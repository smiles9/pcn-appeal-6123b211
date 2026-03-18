import { CreditCard, X, Lock, Tag, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface MockCheckoutProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  submissionId?: string | null;
}

const MockCheckout = ({ open, onClose, onSuccess, submissionId }: MockCheckoutProps) => {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) return;

    setValidatingPromo(true);
    setPromoError("");

    try {
      const { data, error } = await supabase.functions.invoke("validate-promo", {
        body: { code: trimmed },
      });

      if (error) throw new Error("Validation failed");

      if (data.valid) {
        setPromoApplied(true);
        setDiscountPercent(data.discount_percent);
        setPromoError("");
      } else {
        setPromoError(data.error || "Invalid promo code");
        setPromoApplied(false);
      }
    } catch {
      setPromoError("Could not validate code. Try again.");
    } finally {
      setValidatingPromo(false);
    }
  };

  const handlePay = async () => {
    setProcessing(true);

    if (promoApplied && discountPercent === 100) {
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          submissionId,
          promoCode: promoApplied ? promoCode.trim() : undefined,
        },
      });

      if (error || data?.error) throw new Error(data?.error || "Payment failed");

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      setProcessing(false);
      setPromoError(e instanceof Error ? e.message : "Payment failed. Try again.");
    }
  };

  const originalPrice = 4.99;
  const finalPrice = promoApplied
    ? Math.max(0, originalPrice * (1 - discountPercent / 100))
    : originalPrice;
  const isFree = finalPrice === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 sm:items-center"
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="w-full max-w-sm rounded-t-2xl bg-card p-6 shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-display text-sm font-bold text-foreground">
                  {t("secure_checkout")}
                </span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">{t("promo_label")}</label>
              <div className="mt-1 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError("");
                      if (promoApplied) {
                        setPromoApplied(false);
                        setDiscountPercent(0);
                      }
                    }}
                    placeholder={t("promo_placeholder")}
                    maxLength={50}
                    disabled={promoApplied}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  disabled={validatingPromo || promoApplied || !promoCode.trim()}
                  className="rounded-lg bg-muted px-3 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80 disabled:opacity-50"
                >
                  {validatingPromo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : promoApplied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    t("apply")
                  )}
                </button>
              </div>
              {promoError && (
                <p className="mt-1 text-xs text-destructive">{promoError}</p>
              )}
              {promoApplied && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  {discountPercent === 100
                    ? t("promo_free")
                    : t("promo_discount", { percent: discountPercent })}
                </p>
              )}
            </div>

            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("appeal_letter")}</span>
                <div className="flex items-center gap-2">
                  {promoApplied && discountPercent > 0 && (
                    <span className="text-xs text-muted-foreground line-through">£{originalPrice.toFixed(2)}</span>
                  )}
                  <span className="font-bold text-foreground">
                    {isFree ? t("free") : `£${finalPrice.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 font-display text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("redirecting")}
                </>
              ) : isFree ? (
                t("unlock_free")
              ) : (
                t("pay_amount", { amount: finalPrice.toFixed(2) })
              )}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3" /> {t("secured_stripe")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MockCheckout;
