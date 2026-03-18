import { Shield, Upload, FileText } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onFileSelected: (file: File) => void;
  onTextSubmit: (description: string) => void;
}

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
    <section className="flex flex-col items-center px-4 pt-12 pb-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
        <Shield className="h-8 w-8 text-primary-foreground" />
      </div>

      <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
        Don't Pay That Fine Yet!
      </h1>
      <p className="mt-3 max-w-md text-lg font-medium text-muted-foreground">
        Get a <span className="text-gradient-gold font-bold">Free AI Legal Audit</span> in 30 Seconds.
      </p>

      {/* Mode toggle */}
      <div className="mt-8 flex rounded-lg border border-border bg-muted p-1 gap-1">
        <button
          onClick={() => setMode("photo")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "photo"
              ? "bg-background text-foreground shadow-sm"
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
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Describe It
        </button>
      </div>

      {mode === "photo" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="mt-5 flex w-full max-w-sm cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-accent bg-card p-8 transition-colors hover:border-accent/80 hover:bg-muted/50"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
            <Upload className="h-6 w-6 text-accent" />
          </div>
          <p className="font-display text-sm font-semibold text-foreground">
            Upload your PCN photo
          </p>
          <p className="text-xs text-muted-foreground">
            Tap here or drag & drop · JPG, PNG
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="mt-5 flex w-full max-w-sm flex-col gap-3">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your PCN details: issuing authority, date, location, contravention code, amount, and any circumstances you think are relevant..."
            className="min-h-[140px] resize-none text-sm"
          />
          <p className="text-xs text-muted-foreground text-left">
            Include as much detail as possible: PCN number, date, location, contravention, amount, and why you think it's unfair.
          </p>
          <Button
            onClick={handleTextSubmit}
            disabled={description.trim().length < 20}
            className="w-full"
          >
            Analyse My PCN
          </Button>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-success" /> 256-bit encrypted
        </span>
        <span>·</span>
        <span>87,000+ fines challenged</span>
      </div>
    </section>
  );
};

export default HeroSection;
