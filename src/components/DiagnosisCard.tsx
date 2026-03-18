import { CheckCircle, Lock, AlertTriangle, Scale } from "lucide-react";
import { motion } from "framer-motion";
import type { PcnAnalysis } from "@/hooks/useSubmission";

interface DiagnosisCardProps {
  analysis: PcnAnalysis;
  onUnlock: () => void;
}

const severityColor = {
  high: "text-destructive",
  medium: "text-accent",
  low: "text-muted-foreground",
};

const DiagnosisCard = ({ analysis, onUnlock }: DiagnosisCardProps) => {
  const prob = analysis.success_probability;
  const probColor = prob >= 60 ? "text-success" : prob >= 40 ? "text-accent" : "text-destructive";
  const barColor = prob >= 60 ? "bg-success" : prob >= 40 ? "bg-accent" : "bg-destructive";

  return (
    <section className="px-4 py-6 pb-8">
      {/* Success Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-sm rounded-2xl bg-card p-6 shadow-lg shadow-primary/5 border border-border"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Legal Audit Complete
        </p>

        {/* PCN Type Badge */}
        <div className="mt-3 flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary">
            {analysis.pcn_type === "council"
              ? "Council PCN (TMA 2004)"
              : analysis.pcn_type === "private"
              ? "Private PCN (PoFA 2012)"
              : "PCN Type Unknown"}
          </span>
        </div>

        {/* PCN Details */}
        {analysis.pcn_details && (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {analysis.pcn_details.pcn_number && (
              <>
                <span className="font-medium">PCN No:</span>
                <span>{analysis.pcn_details.pcn_number}</span>
              </>
            )}
            {analysis.pcn_details.location && (
              <>
                <span className="font-medium">Location:</span>
                <span>{analysis.pcn_details.location}</span>
              </>
            )}
            {analysis.pcn_details.date_issued && (
              <>
                <span className="font-medium">Date:</span>
                <span>{analysis.pcn_details.date_issued}</span>
              </>
            )}
            {analysis.pcn_details.amount && (
              <>
                <span className="font-medium">Amount:</span>
                <span>{analysis.pcn_details.amount}</span>
              </>
            )}
          </div>
        )}

        {/* Success Probability */}
        <div className="mt-5 flex items-end gap-3">
          <span className={`font-display text-5xl font-extrabold ${probColor}`}>
            {prob}%
          </span>
          <span className="mb-1 text-sm font-medium text-muted-foreground">
            Success Probability
          </span>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prob}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full ${barColor}`}
          />
        </div>

        {/* Summary */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {analysis.summary}
        </p>

        {/* Issues Found */}
        <div className="mt-6 space-y-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-accent" />
            {analysis.issues.length} {analysis.issues.length === 1 ? "Issue" : "Issues"} Detected
          </p>
          {analysis.issues.map((issue, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-lg bg-muted/60 px-3 py-2.5"
            >
              <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${severityColor[issue.severity] || "text-success"}`} />
              <div>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {issue.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {issue.description}
                </p>
                <p className="mt-1 text-[10px] font-medium text-primary">
                  📖 {issue.legal_reference}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Blurred Letter Preview */}
        <div className="relative mt-6 overflow-hidden rounded-xl border border-border">
          <div className="space-y-2 p-4 text-xs leading-relaxed text-muted-foreground blur-[6px] select-none">
            <p>Dear Sir/Madam,</p>
            <p>
              I am writing to formally appeal the Penalty Charge Notice referenced
              above. Having conducted a thorough review of the circumstances and
              applicable legislation including the {analysis.pcn_type === "private" ? "Protection of Freedoms Act 2012" : "Traffic Management Act 2004"},
              I have identified several procedural and evidential deficiencies…
            </p>
            <p>
              Under {analysis.issues[0]?.legal_reference || "applicable legislation"},
              the enforcement action taken is non-compliant with statutory requirements…
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
          Ready to Beat {analysis.pcn_type === "private" ? "the Operator" : "the Council"}?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Unlock your custom appeal letter citing {analysis.issues.length} legal grounds,
          written by our AI Solicitor using real UK parking law.
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
