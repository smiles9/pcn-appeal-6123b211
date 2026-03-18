import { useEffect, useState } from "react";
import { FileSearch, Scale, BookOpen } from "lucide-react";

interface AnalysisProgressProps {
  onComplete: () => void;
}

const steps = [
  { icon: FileSearch, label: "Scanning PCN for violations…" },
  { icon: Scale, label: "Cross-referencing legal precedents…" },
  { icon: BookOpen, label: "Generating legal audit report…" },
];

const AnalysisProgress = ({ onComplete }: AnalysisProgressProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(1), 1800);
    const t2 = setTimeout(() => setCurrentStep(2), 3600);
    const t3 = setTimeout(() => onComplete(), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <section className="flex flex-col items-center px-4 py-16 text-center">
      <h2 className="font-display text-xl font-bold text-foreground">
        Legal Database Analysis
      </h2>

      <div className="mt-6 w-full max-w-sm">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ animation: "staccato-progress 5s ease-out forwards" }}
          />
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const active = i <= currentStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 ${
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground opacity-40"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
              <span className="text-sm font-medium">{step.label}</span>
              {active && i < currentStep && (
                <span className="ml-auto text-xs font-semibold text-success">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AnalysisProgress;
