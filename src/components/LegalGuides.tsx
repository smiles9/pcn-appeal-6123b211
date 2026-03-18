import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePosts } from "@/hooks/usePosts";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";

const LegalGuides = () => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/guides"
        className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {t("legal_guides_title")}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("legal_guides_subtitle")}
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    </section>
  );
};

export default LegalGuides;
