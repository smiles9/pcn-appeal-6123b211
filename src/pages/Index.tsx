import { useState, useCallback, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import AnalysisProgress from "@/components/AnalysisProgress";
import DiagnosisCard from "@/components/DiagnosisCard";
import MockCheckout from "@/components/MockCheckout";
import AppealLetter from "@/components/AppealLetter";
import { useSubmission } from "@/hooks/useSubmission";
import type { PcnAnalysis } from "@/hooks/useSubmission";

type Stage = "upload" | "analyzing" | "diagnosis" | "generating" | "unlocked";

const Index = () => {
  const [stage, setStage] = useState<Stage>("upload");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { analysis, letterText, loading, analyzeImage, generateLetter } = useSubmission();
  const fileRef = useRef<File | null>(null);

  const handleFileSelected = useCallback(async (file: File) => {
    fileRef.current = file;
    setStage("analyzing");
    const result = await analyzeImage(file);
    if (result) {
      setStage("diagnosis");
    } else {
      setStage("upload");
    }
  }, [analyzeImage]);

  const handleUnlock = () => setCheckoutOpen(true);

  const handlePaymentSuccess = async () => {
    setCheckoutOpen(false);
    setStage("generating");
    const letter = await generateLetter();
    if (letter) {
      setStage("unlocked");
    } else {
      setStage("diagnosis");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-center border-b border-border px-4 py-3">
        <span className="font-display text-sm font-bold tracking-tight text-primary">
          UK Parking Ticket Crusader
        </span>
      </header>

      {stage === "upload" && <HeroSection onFileSelected={handleFileSelected} />}
      {stage === "analyzing" && <AnalysisProgress />}
      {stage === "diagnosis" && analysis && (
        <DiagnosisCard analysis={analysis} onUnlock={handleUnlock} />
      )}
      {stage === "generating" && <AnalysisProgress generating />}
      {stage === "unlocked" && <AppealLetter letterText={letterText} />}

      <MockCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Index;
