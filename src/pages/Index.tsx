import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import AnalysisProgress from "@/components/AnalysisProgress";
import DiagnosisCard from "@/components/DiagnosisCard";
import MockCheckout from "@/components/MockCheckout";
import AppealLetter from "@/components/AppealLetter";

type Stage = "upload" | "analyzing" | "diagnosis" | "unlocked";

const Index = () => {
  const [stage, setStage] = useState<Stage>("upload");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleFileSelected = useCallback((_file: File) => {
    setStage("analyzing");
  }, []);

  const handleAnalysisComplete = useCallback(() => {
    setStage("diagnosis");
  }, []);

  const handleUnlock = () => setCheckoutOpen(true);

  const handlePaymentSuccess = () => {
    setCheckoutOpen(false);
    setStage("unlocked");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-center border-b border-border px-4 py-3">
        <span className="font-display text-sm font-bold tracking-tight text-primary">
          UK Parking Ticket Crusader
        </span>
      </header>

      {stage === "upload" && <HeroSection onFileSelected={handleFileSelected} />}
      {stage === "analyzing" && <AnalysisProgress onComplete={handleAnalysisComplete} />}
      {stage === "diagnosis" && <DiagnosisCard onUnlock={handleUnlock} />}
      {stage === "unlocked" && <AppealLetter />}

      <MockCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Index;
