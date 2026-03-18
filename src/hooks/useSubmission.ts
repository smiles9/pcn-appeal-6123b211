import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export interface PcnIssue {
  title: string;
  description: string;
  legal_reference: string;
  severity: "high" | "medium" | "low";
}

export interface PcnAnalysis {
  pcn_type: "council" | "private" | "unknown";
  pcn_details?: {
    pcn_number?: string;
    date_issued?: string;
    location?: string;
    contravention_code?: string;
    issuing_authority?: string;
    amount?: string;
    appeals_email?: string;
  };
  success_probability: number;
  issues: PcnIssue[];
  summary: string;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useSubmission(userId: string | undefined) {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PcnAnalysis | null>(null);
  const [letterText, setLetterText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When a user signs in, claim any anonymous submission
  useEffect(() => {
    if (userId && submissionId) {
      supabase
        .from("submissions")
        .update({ user_id: userId })
        .eq("id", submissionId)
        .is("user_id", null)
        .then(({ error }) => {
          if (error) console.error("Failed to link submission to user:", error);
        });
    }
  }, [userId, submissionId]);

  const analyzeImage = async (file?: File, userDescription?: string) => {
    if (!file && !userDescription) {
      toast.error("Please upload a photo or describe your PCN");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let imageBase64: string | undefined;
      if (file) {
        imageBase64 = await fileToBase64(file);
      }

      const { data: analysisData, error: fnError } = await supabase.functions.invoke("analyze-pcn", {
        body: { imageBase64, userDescription },
      });

      if (fnError) throw new Error(fnError.message || "Analysis failed");
      if (analysisData.error) throw new Error(analysisData.error);

      const result = analysisData as PcnAnalysis;
      setAnalysis(result);

      const sessionId = userId || crypto.randomUUID();
      const { data: submission, error: dbError } = await supabase
        .from("submissions")
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          success_probability: result.success_probability,
          issues: result.issues as any,
          status: "diagnosed",
        })
        .select("id")
        .single();

      if (dbError) {
        console.error("Failed to save submission:", dbError);
      } else {
        setSubmissionId(submission.id);
      }

      setLoading(false);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return null;
    }
  };

  const generateLetter = async (userDescription?: string) => {
    if (!analysis || !submissionId || !userId) return null;
    setLoading(true);
    setError(null);

    try {
      await supabase
        .from("submissions")
        .update({ status: "paid" })
        .eq("id", submissionId);

      const { data: letterData, error: fnError } = await supabase.functions.invoke("generate-appeal", {
        body: { analysis, userDescription },
      });

      if (fnError) throw new Error(fnError.message || "Letter generation failed");
      if (letterData.error) throw new Error(letterData.error);

      const letter = letterData.letter;
      setLetterText(letter);

      await supabase.from("appeal_letters").insert({
        submission_id: submissionId,
        user_id: userId,
        letter_text: letter,
      });

      setLoading(false);
      return letter;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Letter generation failed";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return null;
    }
  };

  return {
    submissionId,
    analysis,
    letterText,
    loading,
    error,
    analyzeImage,
    generateLetter,
  };
}
