import { Copy, CheckCircle, Mail, User, MapPin, AlertCircle, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface AppealLetterProps {
  letterText?: string | null;
  defaultRecipientEmail?: string;
  vehicleRegistration?: string;
  pcnNumber?: string;
  issuingAuthority?: string;
  onStrengthen?: (circumstances: string[], extraDetails: string) => Promise<void>;
  strengthening?: boolean;
}

const PLACEHOLDERS = {
  name: "[YOUR NAME]",
  address: "[YOUR ADDRESS]",
  postcode: "[YOUR POSTCODE]",
};

const CIRCUMSTANCE_OPTIONS = [
  { id: "loading", label: "Loading/Unloading" },
  { id: "blue-badge", label: "Blue Badge" },
  { id: "breakdown", label: "Breakdown" },
  { id: "medical", label: "Medical Emergency" },
  { id: "obscured-signs", label: "Obscured Signs" },
  { id: "wrong-duration", label: "Wrong Duration" },
  { id: "paid-valid", label: "Paid & Valid Ticket" },
  { id: "dropped-off", label: "Dropping Off Passenger" },
];

const AppealLetter = ({
  letterText: propLetter,
  defaultRecipientEmail,
  vehicleRegistration,
  pcnNumber,
  issuingAuthority,
  onStrengthen,
  strengthening,
}: AppealLetterProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const defaultIsUrl = (defaultRecipientEmail || "").startsWith("http");
  const [recipientEmail, setRecipientEmail] = useState(defaultIsUrl ? "" : (defaultRecipientEmail || ""));
  const [appealsUrl, setAppealsUrl] = useState(defaultIsUrl ? defaultRecipientEmail! : "");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  const rawText = propLetter || "";

  // Check which placeholders exist in the letter
  const hasPlaceholders = rawText.includes(PLACEHOLDERS.name) || rawText.includes(PLACEHOLDERS.address) || rawText.includes(PLACEHOLDERS.postcode);

  // Build the final letter with user details filled in
  const finalText = useMemo(() => {
    let text = rawText;
    if (fullName.trim()) text = text.split(PLACEHOLDERS.name).join(fullName.trim());
    if (address.trim()) text = text.split(PLACEHOLDERS.address).join(address.trim());
    if (postcode.trim()) text = text.split(PLACEHOLDERS.postcode).join(postcode.trim());
    return text;
  }, [rawText, fullName, address, postcode]);

  const isValidEmail = recipientEmail.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim());
  const hasUnfilledName = finalText.includes("[YOUR NAME]");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalText);
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

        {/* Personal details form - shown prominently */}
        {hasPlaceholders && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-bold text-foreground">
                {t("personalise_letter", "Complete your details")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {t("personalise_hint", "Fill in your details below — they'll be inserted into your letter automatically.")}
            </p>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground">
                  {t("your_full_name", "Your full name")} *
                </label>
                <div className="mt-1 flex items-center gap-0 rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-primary">
                  <User className="ml-3 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Smith"
                    maxLength={100}
                    className="w-full bg-transparent px-2.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground">
                  {t("your_address", "Your address")} <span className="text-muted-foreground/60">({t("optional", "optional")})</span>
                </label>
                <div className="mt-1 flex items-center gap-0 rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-primary">
                  <MapPin className="ml-3 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, London"
                    maxLength={200}
                    className="w-full bg-transparent px-2.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground">
                  {t("your_postcode", "Postcode / ZIP")} <span className="text-muted-foreground/60">({t("optional", "optional")})</span>
                </label>
                <div className="mt-1 rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-primary">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="SW1A 1AA"
                    maxLength={20}
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Auto-detected info */}
            {(vehicleRegistration || pcnNumber) && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5">
                  {t("auto_detected", "Auto-detected from your ticket:")}
                </p>
                <div className="space-y-1 text-xs text-foreground">
                  {vehicleRegistration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("vehicle_reg", "Vehicle Reg")}</span>
                      <span className="font-mono font-medium">{vehicleRegistration}</span>
                    </div>
                  )}
                  {pcnNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("ticket_ref", "Ticket Ref")}</span>
                      <span className="font-mono font-medium">{pcnNumber}</span>
                    </div>
                  )}
                  {issuingAuthority && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("authority", "Authority")}</span>
                      <span className="font-medium">{issuingAuthority}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Warning if name still unfilled */}
        {hasUnfilledName && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {t("fill_name_warning", "Please fill in your name above before sending.")}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
          <pre className="whitespace-pre-wrap font-body text-xs leading-relaxed text-foreground">
            {finalText}
          </pre>

          {/* Appeals URL - shown as link if detected */}
          {appealsUrl && (
            <div className="mt-4">
              <label className="text-[11px] font-medium text-muted-foreground">
                {t("appeals_portal", "Appeals portal")}
              </label>
              <a
                href={appealsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-primary hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{appealsUrl}</span>
              </a>
            </div>
          )}

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
            href={`mailto:${encodeURIComponent(recipientEmail.trim())}?subject=${encodeURIComponent("Formal Appeal — Parking Ticket")}&body=${encodeURIComponent(finalText)}`}
            onClick={(e) => { if (!isValidEmail || hasUnfilledName) e.preventDefault(); }}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-display text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98] ${(!isValidEmail || hasUnfilledName) ? "opacity-50 pointer-events-none" : ""}`}
            aria-disabled={!isValidEmail || hasUnfilledName}
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
