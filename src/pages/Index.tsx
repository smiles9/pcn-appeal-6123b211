import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import AnalysisProgress from "@/components/AnalysisProgress";
import DiagnosisCard from "@/components/DiagnosisCard";
import MockCheckout from "@/components/MockCheckout";
import AppealLetter from "@/components/AppealLetter";
import { useSubmission } from "@/hooks/useSubmission";

type Stage = "upload" | "analyzing" | "diagnosis" | "unlocked";

const Index = () => {
  const [stage, setStage] = useState<Stage>("upload");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { letterText, createSubmission, markDiagnosed, markPaidAndGenerateLetter } = useSubmission();

  const handleFileSelected = useCallback(async (_file: File) => {
    setStage("analyzing");
    await createSubmission();
  }, [createSubmission]);

  const handleAnalysisComplete = useCallback(async () => {
    await markDiagnosed();
    setStage("diagnosis");
  }, [markDiagnosed]);

  const handleUnlock = () => setCheckoutOpen(true);

  const handlePaymentSuccess = async () => {
    setCheckoutOpen(false);
    await markPaidAndGenerateLetter();
    setStage("unlocked");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-center border-b border-border px-4 py-3">
        <span className="font-display text-sm font-bold tracking-tight text-primary">
          UK Parking Ticket Crusader
        </span>
      </header>

      {stage === "upload" && <HeroSection onFileSelected={handleFileSelected} />}
      {stage === "analyzing" && <AnalysisProgress onComplete={handleAnalysisComplete} />}
      {stage === "diagnosis" && <DiagnosisCard onUnlock={handleUnlock} />}
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
