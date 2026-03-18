import { Copy, CheckCircle, ChevronRight, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface AppealLetterProps {
  letterText?: string | null;
}

const DEFAULT_LETTER = `Dear Sir/Madam,

I am writing to formally appeal Penalty Charge Notice PCN-2024-AX7291 issued on 14 March 2026 at High Street, London Borough of Camden. Having conducted a thorough review of the circumstances and applicable legislation, I have identified several procedural and evidential deficiencies which render this PCN unenforceable under the Traffic Management Act 2004.

GROUND 1: INVALID SIGNAGE LOCATION
The traffic sign at the enforcement location is positioned approximately 3.2 metres from the nearest parking bay. This exceeds the maximum distance permitted under The Traffic Signs Regulations and General Directions 2016 (TSRGD), Schedule 12, Part 5, regulation 8.3, which stipulates that regulatory signs must be placed within 2 metres of the relevant restriction. I have photographic evidence confirming this measurement.

GROUND 2: INCORRECT DATE FORMAT
The PCN displays the date in a format that is non-compliant with the requirements set out in the Traffic Management Act 2004, Schedule 1, Paragraph 2(4). The date should be expressed in the format DD/MM/YYYY. The failure to adhere to this prescribed format constitutes a procedural irregularity.

GROUND 3: GRACE PERIOD VIOLATION
Under the Deregulation Act 2015, Section 71, a mandatory 10-minute observation period is required before a PCN may be issued to a stationary vehicle. CCTV evidence and the CEO's notes indicate that enforcement action was taken within 7 minutes of the alleged contravention commencing. This is a direct breach of the statutory grace period.

I respectfully request that this PCN be cancelled on the grounds stated above. Should you wish to discuss this matter further, I am available at the contact details provided.

Yours faithfully,
[Your Name]
[Your Address]`;

const nextSteps = [
  "Send the letter using the button below, or print and post it",
  "Address it to the issuing authority shown on your PCN",
  "Submit within 28 days of receiving the PCN",
  "If rejected, escalate to the Traffic Penalty Tribunal — it's free",
  "Keep all photos and correspondence as evidence",
];

const AppealLetter = ({ letterText: propLetter }: AppealLetterProps) => {
  const [copied, setCopied] = useState(false);
  const text = propLetter || DEFAULT_LETTER;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-success" />
          <h2 className="font-display text-lg font-bold text-foreground">
            Your Appeal Letter
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
          <pre className="whitespace-pre-wrap font-body text-xs leading-relaxed text-foreground">
            {text}
          </pre>

          <button
            onClick={handleCopy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy to Clipboard
              </>
            )}
          </button>
        </div>

        {/* Next Steps */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-bold text-foreground">
            What to Do Next
          </h3>
          <ol className="mt-3 space-y-2.5">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
};

export default AppealLetter;
