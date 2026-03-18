import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllPosts } from "@/lib/posts";
import { ArrowRight, BookOpen } from "lucide-react";

const LegalGuides = () => {
  const { t } = useTranslation();
  const posts = getAllPosts();

  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold text-foreground">
          {t("legal_guides_title")}
        </h2>
      </div>
      <p className="mb-8 text-sm text-muted-foreground">
        {t("legal_guides_subtitle")}
      </p>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/guides/${post.slug}`}
            className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(post.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LegalGuides;
