import { useState, useCallback, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import AnalysisProgress from "@/components/AnalysisProgress";
import DiagnosisCard from "@/components/DiagnosisCard";
import MockCheckout from "@/components/MockCheckout";
import AppealLetter from "@/components/AppealLetter";
import AuthPage from "@/components/AuthPage";
import AppealHistory from "@/components/AppealHistory";
import { useSubmission } from "@/hooks/useSubmission";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, History, Shield } from "lucide-react";

type Stage = "upload" | "analyzing" | "diagnosis" | "generating" | "unlocked" | "history";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [stage, setStage] = useState<Stage>("upload");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { analysis, letterText, analyzeImage, generateLetter } = useSubmission(user?.id);

  const handleFileSelected = useCallback(async (file: File) => {
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

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center justify-center border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-bold tracking-tight text-primary">
              UK Parking Ticket Crusader
            </span>
          </div>
        </header>
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-display text-sm font-bold tracking-tight text-primary">
            UK Parking Ticket Crusader
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStage(stage === "history" ? "upload" : "history")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <History className="h-3.5 w-3.5" />
            History
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {stage === "history" && <AppealHistory onBack={() => setStage("upload")} />}
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
