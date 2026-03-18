import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const ISSUES = [
  { text: "Invalid Signage Location — Sign positioned >2m from bay, violating TSR 2016 §8.3", severity: "high" },
  { text: "Incorrect Date Format — PCN date format non-compliant with TMA 2004 Schedule 1", severity: "medium" },
  { text: "10-Minute Grace Period Violation — Enforcement within statutory grace window", severity: "high" },
];

const LETTER_TEXT = `Dear Sir/Madam,

I am writing to formally appeal Penalty Charge Notice PCN-2024-AX7291 issued on 14 March 2026 at High Street, London Borough of Camden. Having conducted a thorough review of the circumstances and applicable legislation, I have identified several procedural and evidential deficiencies which render this PCN unenforceable under the Traffic Management Act 2004.

GROUND 1: INVALID SIGNAGE LOCATION
The traffic sign at the enforcement location is positioned approximately 3.2 metres from the nearest parking bay. This exceeds the maximum distance permitted under The Traffic Signs Regulations and General Directions 2016 (TSRGD), Schedule 12, Part 5, regulation 8.3, which stipulates that regulatory signs must be placed within 2 metres of the relevant restriction. I have photographic evidence confirming this measurement.

GROUND 2: INCORRECT DATE FORMAT
The PCN displays the date in a format that is non-compliant with the requirements set out in the Traffic Management Act 2004, Schedule 1, Paragraph 2(4). The date should be expressed in the format DD/MM/YYYY. The failure to adhere to this prescribed format constitutes a procedural irregularity.

GROUND 3: GRACE PERIOD VIOLATION
Under the Deregulation Act 2015, Section 71, a mandatory 10-minute observation period is required before a PCN may be issued to a stationary vehicle. CCTV evidence and the CEO's notes indicate that enforcement action was taken within 7 minutes of the alleged contravention commencing. This is a direct breach of the statutory grace period.

I respectfully request that this PCN be cancelled on the grounds stated above. Should you wish to discuss this matter further, I am available at the contact details provided.

Yours faithfully,
[Your Name]
[Your Address]`;

function getSessionId(): string {
  let id = localStorage.getItem("ptc_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ptc_session_id", id);
  }
  return id;
}

export function useSubmission() {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [letterText, setLetterText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createSubmission = async () => {
    setLoading(true);
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        session_id: sessionId,
        success_probability: 85,
        issues: ISSUES as any,
        status: "analyzing",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create submission:", error);
      setLoading(false);
      return null;
    }
    setSubmissionId(data.id);
    setLoading(false);
    return data.id;
  };

  const markDiagnosed = async () => {
    if (!submissionId) return;
    await supabase
      .from("submissions")
      .update({ status: "diagnosed" })
      .eq("id", submissionId);
  };

  const markPaidAndGenerateLetter = async () => {
    if (!submissionId) return;

    // Update submission status
    await supabase
      .from("submissions")
      .update({ status: "paid" })
      .eq("id", submissionId);

    // Insert appeal letter
    const { data, error } = await supabase
      .from("appeal_letters")
      .insert({
        submission_id: submissionId,
        letter_text: LETTER_TEXT,
      })
      .select("letter_text")
      .single();

    if (error) {
      console.error("Failed to create appeal letter:", error);
      return;
    }

    setLetterText(data.letter_text);
  };

  return {
    submissionId,
    letterText,
    loading,
    createSubmission,
    markDiagnosed,
    markPaidAndGenerateLetter,
  };
}
