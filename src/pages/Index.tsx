import { useState, useCallback, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import SocialProofTicker from "@/components/SocialProofTicker";
import AnalysisProgress from "@/components/AnalysisProgress";
import DiagnosisCard from "@/components/DiagnosisCard";
import MockCheckout from "@/components/MockCheckout";
import AppealLetter from "@/components/AppealLetter";
import AuthPage from "@/components/AuthPage";
import AppealHistory from "@/components/AppealHistory";
import FAQSection from "@/components/FAQSection";
import { useSubmission } from "@/hooks/useSubmission";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, History, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Stage = "upload" | "analyzing" | "diagnosis" | "generating" | "unlocked" | "history";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [stage, setStage] = useState<Stage>("upload");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { analysis, letterText, analyzeImage, generateLetter } = useSubmission(user?.id);
  const prevUserRef = useRef(user);

  // When user signs in while auth modal is open, auto-proceed to checkout
  useEffect(() => {
    if (!prevUserRef.current && user && showAuth) {
      handleAuthComplete();
    }
    prevUserRef.current = user;
  }, [user, showAuth]);

  const handleFileSelected = useCallback(async (file: File) => {
    setStage("analyzing");
    const result = await analyzeImage(file);
    if (result) {
      setStage("diagnosis");
    } else {
      setStage("upload");
    }
  }, [analyzeImage]);

  const handleTextSubmit = useCallback(async (description: string) => {
    setStage("analyzing");
    const result = await analyzeImage(undefined, description);
    if (result) {
      setStage("diagnosis");
    } else {
      setStage("upload");
    }
  }, [analyzeImage]);

  const handleUnlock = () => {
    if (!user) {
      // Not signed in — show auth modal first
      setShowAuth(true);
      return;
    }
    setCheckoutOpen(true);
  };

  // After successful auth, proceed to checkout
  const handleAuthComplete = () => {
    setShowAuth(false);
    setCheckoutOpen(true);
  };

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
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-display text-sm font-bold tracking-tight text-primary">
            ParkShield
          </span>
        </div>
        {user && (
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
        )}
      </header>

      {stage === "history" && <AppealHistory onBack={() => setStage("upload")} />}
      {stage === "upload" && (
        <>
          <HeroSection onFileSelected={handleFileSelected} onTextSubmit={handleTextSubmit} />
          <SocialProofTicker />
          <FAQSection />
        </>
      )}
      {stage === "analyzing" && <AnalysisProgress />}
      {stage === "diagnosis" && analysis && (
        <DiagnosisCard analysis={analysis} onUnlock={handleUnlock} />
      )}
      {stage === "generating" && <AnalysisProgress generating />}
      {stage === "unlocked" && <AppealLetter letterText={letterText} defaultRecipientEmail={analysis?.pcn_details?.appeals_email} />}

      <MockCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Auth modal — shown when unauthenticated user tries to unlock */}
      <AnimatePresence>
        {showAuth && !user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="relative mx-4 w-full max-w-md rounded-2xl bg-card shadow-2xl"
            >
              <button
                onClick={() => setShowAuth(false)}
                className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="p-1">
                <AuthPage />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
