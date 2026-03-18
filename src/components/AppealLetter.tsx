import { Copy, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface AppealLetterProps {
  letterText?: string | null;
  defaultRecipientEmail?: string;
}

const DEFAULT_LETTER = `Dear Sir/Madam,

I am writing to formally appeal the parking ticket referenced above. Having conducted a thorough review of the circumstances and applicable legislation, I have identified several procedural and evidential deficiencies which render this ticket unenforceable.

GROUND 1: INVALID SIGNAGE
The traffic sign at the enforcement location does not comply with the applicable signage regulations for this jurisdiction. I have photographic evidence confirming non-compliance.

GROUND 2: PROCEDURAL ERROR
The ticket contains procedural irregularities that do not meet the statutory requirements for valid enforcement.

GROUND 3: GRACE PERIOD / TIMING VIOLATION
The enforcement action was taken in violation of the applicable grace period or timing requirements.

I respectfully request that this ticket be cancelled on the grounds stated above. Should you wish to discuss this matter further, I am available at the contact details provided.

Yours faithfully,
[Your Name]
[Your Address]`;

const AppealLetter = ({ letterText: propLetter, defaultRecipientEmail }: AppealLetterProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(defaultRecipientEmail || "");
  const text = propLetter || DEFAULT_LETTER;

  const isValidEmail = recipientEmail.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim());

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const nextSteps = [
    t("next_step_1"),
    t("next_step_2"),
    t("next_step_3"),
    t("next_step_4"),
    t("next_step_5"),
  ];

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
            {t("your_appeal")}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
          <pre className="whitespace-pre-wrap font-body text-xs leading-relaxed text-foreground">
            {text}
          </pre>

          <div className="mt-4">
            <label className="text-[11px] font-medium text-muted-foreground">
              {t("authority_email")}
            </label>
            <div className="mt-1 flex items-center gap-0 rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-primary">
              <Mail className="ml-3 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder={t("email_placeholder")}
                maxLength={255}
                className="w-full bg-transparent px-2.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <a
            href={`mailto:${encodeURIComponent(recipientEmail.trim())}?subject=${encodeURIComponent("Formal Appeal — Parking Ticket")}&body=${encodeURIComponent(text)}`}
            onClick={(e) => { if (!isValidEmail) e.preventDefault(); }}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-display text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98] ${!isValidEmail ? "opacity-50 pointer-events-none" : ""}`}
            aria-disabled={!isValidEmail}
          >
            <Mail className="h-4 w-4" /> {t("send_email")}
          </a>

          <button
            onClick={handleCopy}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" /> {t("copied")}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> {t("copy_clipboard")}
              </>
            )}
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-bold text-foreground">
            {t("next_steps_title")}
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
