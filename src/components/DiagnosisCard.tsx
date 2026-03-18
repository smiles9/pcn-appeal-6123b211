import { CheckCircle, Lock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface DiagnosisCardProps {
  onUnlock: () => void;
}

const issues = [
  { text: "Invalid Signage Location — Sign positioned >2m from bay, violating TSR 2016 §8.3", severity: "high" },
  { text: "Incorrect Date Format — PCN date format non-compliant with TMA 2004 Schedule 1", severity: "medium" },
  { text: "10-Minute Grace Period Violation — Enforcement within statutory grace window", severity: "high" },
];

const DiagnosisCard = ({ onUnlock }: DiagnosisCardProps) => {
  return (
    <section className="px-4 pb-8">
      {/* Success Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-sm rounded-2xl bg-card p-6 shadow-lg shadow-primary/5 border border-border"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Legal Audit Complete
        </p>

        <div className="mt-4 flex items-end gap-3">
          <span className="font-display text-5xl font-extrabold text-success">85%</span>
          <span className="mb-1 text-sm font-medium text-muted-foreground">
            Success Probability
          </span>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full bg-success"
          />
        </div>

        {/* Issues Found */}
        <div className="mt-6 space-y-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-accent" />
            3 Issues Detected
          </p>
          {issues.map((issue, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-lg bg-muted/60 px-3 py-2.5"
            >
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span className="text-sm leading-snug text-foreground">{issue.text}</span>
            </div>
          ))}
        </div>

        {/* Blurred Letter Preview */}
        <div className="relative mt-6 overflow-hidden rounded-xl border border-border">
          <div className="space-y-2 p-4 text-xs leading-relaxed text-muted-foreground blur-[6px] select-none">
            <p>Dear Sir/Madam,</p>
            <p>
              I am writing to formally appeal Penalty Charge Notice [PCN-REF]
              issued on [DATE] at [LOCATION]. Having conducted a thorough review
              of the circumstances and applicable legislation, I have identified
              several procedural and evidential deficiencies which render this
              PCN unenforceable under the Traffic Management Act 2004…
            </p>
            <p>
              Firstly, the signage at the location fails to comply with The
              Traffic Signs Regulations and General Directions 2016, specifically
              regulation 8.3 regarding placement distance…
            </p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/70 backdrop-blur-sm">
            <Lock className="h-8 w-8 text-primary" />
            <p className="mt-2 font-display text-sm font-bold text-foreground">
              Full Appeal Letter Locked
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-auto mt-6 max-w-sm rounded-2xl border border-accent/30 bg-card p-6 shadow-lg"
      >
        <p className="font-display text-lg font-bold text-foreground">
          Ready to Beat the Council?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Unlock your 100% custom high-authority appeal letter written by our AI Solicitor.
        </p>

        <button
          onClick={onUnlock}
          className="mt-5 w-full rounded-xl bg-accent px-6 py-4 font-display text-base font-bold text-accent-foreground shadow-md shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Unlock Full Letter for £4.99
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Save £60+ vs. solicitor fees · Instant delivery
        </p>
      </motion.div>
    </section>
  );
};

export default DiagnosisCard;
