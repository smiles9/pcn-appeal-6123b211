import { Shield, Upload, FileText, CheckCircle, Clock, TrendingUp, Star, Globe } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onFileSelected: (file: File) => void;
  onTextSubmit: (description: string) => void;
}

const stats = [
  { icon: TrendingUp, value: "73%", label: "Success Rate" },
  { icon: Clock, value: "30s", label: "AI Analysis" },
  { icon: Star, value: "87K+", label: "Fines Challenged" },
];

const steps = [
  { num: "1", text: "Upload your ticket or describe it" },
  { num: "2", text: "Get a free AI legal audit instantly" },
  { num: "3", text: "Unlock your personalised appeal letter" },
];

const HeroSection = ({ onFileSelected, onTextSubmit }: HeroSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"photo" | "text">("photo");
  const [description, setDescription] = useState("");

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
        {/* Subtle pattern overlay */}
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
          <Shield className="h-7 w-7 text-accent-foreground" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative font-display text-2xl font-extrabold leading-tight text-primary-foreground sm:text-3xl"
        >
          Don't Pay That
          <br />
          Parking Fine Yet!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative mt-2.5 text-sm font-medium text-primary-foreground/80"
        >
          Get a{" "}
          <span className="inline-block rounded-md bg-accent/20 px-1.5 py-0.5 font-bold text-accent">
            Free AI Legal Audit
          </span>{" "}
          in 30 seconds
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
          {steps.map((step, i) => (
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
          Upload Photo
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
          Describe It
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
                Upload your parking ticket photo
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap here or drag & drop · JPG, PNG
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
              placeholder="Describe your parking ticket: issuing authority, country/city, date, location, violation code, amount, and any circumstances you think are relevant..."
              className="min-h-[130px] resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground text-left">
              Include as much detail as possible for the best results. We support tickets from any country.
            </p>
            <Button
              onClick={handleTextSubmit}
              disabled={description.trim().length < 20}
              className="w-full"
            >
              Analyse My Ticket
            </Button>
          </div>
        )}
      </motion.div>

      {/* Global coverage badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-5 flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2"
      >
        <span className="text-base leading-none">🇺🇸🇬🇧🇩🇪🇫🇷🇦🇺🇨🇦</span>
        <span className="text-xs font-semibold text-foreground">Works in 50+ countries</span>
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
      </motion.div>

      {/* Trust bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
      >
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-success" /> 256-bit encrypted
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3.5 w-3.5 text-success" /> No payment required
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
