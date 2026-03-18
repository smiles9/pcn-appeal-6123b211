import { CreditCard, X, Lock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MockCheckoutProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MockCheckout = ({ open, onClose, onSuccess }: MockCheckoutProps) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

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
                  Secure Checkout
                </span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">Expiry</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 font-display text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {processing ? "Processing…" : "Pay £4.99"}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Secured by Stripe · 256-bit encryption
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MockCheckout;
