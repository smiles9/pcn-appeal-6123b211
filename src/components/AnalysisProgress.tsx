import { FileSearch, Scale, BookOpen, Wand2 } from "lucide-react";

interface AnalysisProgressProps {
  generating?: boolean;
}

const analyzeSteps = [
  { icon: FileSearch, label: "Extracting PCN details from image…" },
  { icon: Scale, label: "Cross-referencing UK parking legislation…" },
  { icon: BookOpen, label: "Identifying legal grounds for appeal…" },
];

const generateSteps = [
  { icon: Wand2, label: "Drafting your appeal letter…" },
  { icon: Scale, label: "Citing relevant case law & legislation…" },
  { icon: BookOpen, label: "Finalising professional letter…" },
];

const AnalysisProgress = ({ generating = false }: AnalysisProgressProps) => {
  const steps = generating ? generateSteps : analyzeSteps;

  return (
    <section className="flex flex-col items-center px-4 py-16 text-center">
      <h2 className="font-display text-xl font-bold text-foreground">
        {generating ? "Generating Appeal Letter" : "AI Legal Analysis"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {generating ? "Our AI Solicitor is writing your letter…" : "Analysing your PCN against UK parking law…"}
      </p>

      <div className="mt-6 w-full max-w-sm">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary animate-pulse"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-card px-4 py-3 text-foreground shadow-sm animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AnalysisProgress;
