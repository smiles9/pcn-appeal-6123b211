import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import SocialProofTicker from "@/components/SocialProofTicker";
import AnalysisProgress from "@/components/AnalysisProgress";
import DiagnosisCard from "@/components/DiagnosisCard";
import MockCheckout from "@/components/MockCheckout";
import AppealLetter from "@/components/AppealLetter";
import AuthPage from "@/components/AuthPage";
import AppealHistory from "@/components/AppealHistory";
import FAQSection from "@/components/FAQSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useSubmission } from "@/hooks/useSubmission";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, History, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type Stage = "upload" | "analyzing" | "diagnosis" | "generating" | "unlocked" | "history";

const Index = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading, signOut } = useAuth();
  const [stage, setStage] = useState<Stage>("upload");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { analysis, letterText, submissionId, analyzeImage, generateLetter } = useSubmission(user?.id);
  const prevUserRef = useRef(user);
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle Stripe redirect back
  useEffect(() => {
    const payment = searchParams.get("payment");
    const sub = searchParams.get("submission");
    if (payment === "success" && user) {
      // Clear query params
      setSearchParams({}, { replace: true });
      toast.success("Payment successful! Generating your appeal letter…");
      setStage("generating");
      // Generate the letter
      generateLetter().then((letter) => {
        if (letter) {
          setStage("unlocked");
        } else {
          setStage("diagnosis");
        }
      });
    } else if (payment === "canceled") {
      setSearchParams({}, { replace: true });
      toast.error("Payment was canceled.");
    }
  }, [searchParams, user]);

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
      setShowAuth(true);
      return;
    }
    setCheckoutOpen(true);
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
    setCheckoutOpen(true);
  };

  // For 100% promo codes (no Stripe redirect)
  const handleFreeSuccess = async () => {
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
          <img src="/favicon.png" alt="Ticket Crusader" className="h-5 w-5" />
          <span className="font-display text-sm font-bold tracking-tight text-primary">
            Ticket Crusader
          </span>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStage(stage === "history" ? "upload" : "history")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <History className="h-3.5 w-3.5" />
              {t("history")}
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
        onSuccess={handleFreeSuccess}
        submissionId={submissionId}
      />

      {/* Auth modal */}
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
