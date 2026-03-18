import { Upload, FileText, CheckCircle, Clock, TrendingUp, Star, Globe, Shield } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onFilesSelected: (files: File[]) => void;
  onTextSubmit: (description: string) => void;
}

const HeroSection = ({ onFilesSelected, onTextSubmit }: HeroSectionProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"photo" | "text">("photo");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const stats = [
    { icon: TrendingUp, value: "73%", label: t("stat_success_rate") },
    { icon: Clock, value: "30s", label: t("stat_ai_analysis") },
    { icon: Star, value: "87K+", label: t("stat_fines_challenged") },
  ];

  const steps = [
    { num: "1", text: t("step_1") },
    { num: "2", text: t("step_2") },
    { num: "3", text: t("step_3") },
  ];

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleTextSubmit = () => {
    const trimmed = description.trim();
    if (trimmed.length < 20) return;
    onTextSubmit(trimmed);
  };

  return (
    <section className="flex flex-col items-center px-4 pb-8">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-primary px-5 py-8 mt-4 text-center"
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent shadow-lg"
        >
          <img src="/favicon.png" alt="Ticket Crusader" className="h-8 w-8" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative font-display text-2xl font-extrabold leading-tight text-primary-foreground sm:text-3xl"
        >
          {t("hero_title_1")}
          <br />
          {t("hero_title_2")}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative mt-2.5 text-sm font-medium text-primary-foreground/80"
        >
          {t("hero_subtitle_prefix")}{" "}
          <span className="inline-block rounded-md bg-accent/20 px-1.5 py-0.5 font-bold text-accent">
            {t("hero_subtitle_highlight")}
          </span>{" "}
          {t("hero_subtitle_suffix")}
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="relative mt-6 grid grid-cols-3 gap-2"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl bg-primary-foreground/10 px-2 py-2.5 backdrop-blur-sm"
            >
              <stat.icon className="mb-1 h-4 w-4 text-accent" />
              <span className="font-display text-lg font-bold text-primary-foreground">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium text-primary-foreground/60">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 w-full max-w-sm"
      >
        <div className="flex items-center gap-3">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-1 items-start gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {step.num}
              </div>
              <p className="text-[11px] leading-tight text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mode toggle */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-6 flex rounded-lg border border-border bg-muted p-1 gap-1"
      >
        <button
          onClick={() => setMode("photo")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "photo"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          {t("upload_photo")}
        </button>
        <button
          onClick={() => setMode("text")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "text"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          {t("describe_it")}
        </button>
      </motion.div>

      {/* Upload / Text input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm mt-4"
      >
        {mode === "photo" ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="group flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-accent/50 bg-card p-7 transition-all hover:border-accent hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
              <Upload className="h-5 w-5 text-accent" />
            </div>
            <div className="text-center">
              <p className="font-display text-sm font-semibold text-foreground">
                {t("upload_title")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("upload_hint")}
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-3">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("text_placeholder")}
              className="min-h-[130px] resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground text-left">
              {t("text_hint")}
            </p>
            <Button
              onClick={handleTextSubmit}
              disabled={description.trim().length < 20}
              className="w-full"
            >
              {t("analyse_button")}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Top countries showcase */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-5 w-full max-w-sm"
      >
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-foreground">{t("trusted_countries")}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { flag: "🇬🇧", name: "UK", rate: "78%" },
              { flag: "🇺🇸", name: "USA", rate: "65%" },
              { flag: "🇦🇺", name: "AUS", rate: "72%" },
              { flag: "🇨🇦", name: "CAN", rate: "68%" },
              { flag: "🇩🇪", name: "DEU", rate: "61%" },
            ].map((c) => (
              <div key={c.name} className="flex flex-col items-center rounded-lg bg-muted/60 px-1 py-2">
                <span className="text-lg leading-none">{c.flag}</span>
                <span className="mt-1 text-[10px] font-bold text-foreground">{c.rate}</span>
                <span className="text-[9px] text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
            {t("country_rates_note")}
          </p>
        </div>
      </motion.div>

      {/* Trust bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
      >
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-success" /> {t("encrypted")}
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3.5 w-3.5 text-success" /> {t("no_payment")}
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
