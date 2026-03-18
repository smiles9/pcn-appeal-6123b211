import { FileSearch, Scale, BookOpen, Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AnalysisProgressProps {
  generating?: boolean;
}

const AnalysisProgress = ({ generating = false }: AnalysisProgressProps) => {
  const { t } = useTranslation();

  const analyzeSteps = [
    { icon: FileSearch, label: t("step_extracting") },
    { icon: Scale, label: t("step_crossref") },
    { icon: BookOpen, label: t("step_identifying") },
  ];

  const generateSteps = [
    { icon: Wand2, label: t("step_drafting") },
    { icon: Scale, label: t("step_citing") },
    { icon: BookOpen, label: t("step_finalising") },
  ];

  const steps = generating ? generateSteps : analyzeSteps;

  return (
    <section className="flex flex-col items-center px-4 py-16 text-center">
      <h2 className="font-display text-xl font-bold text-foreground">
        {generating ? t("generating_title") : t("analysis_title")}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {generating ? t("generating_subtitle") : t("analysis_subtitle")}
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
