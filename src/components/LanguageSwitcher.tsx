import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => i18n.language.startsWith(l.code)) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label="Change language"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <Globe className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg border border-border bg-card p-1 shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                i18n.language.startsWith(lang.code)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="text-sm">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
