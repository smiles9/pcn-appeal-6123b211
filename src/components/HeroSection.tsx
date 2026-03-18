import { Shield, Upload } from "lucide-react";
import { useCallback, useRef } from "react";

interface HeroSectionProps {
  onFileSelected: (file: File) => void;
}

const HeroSection = ({ onFileSelected }: HeroSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="mt-8 flex w-full max-w-sm cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-accent bg-card p-8 transition-colors hover:border-accent/80 hover:bg-muted/50"
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
