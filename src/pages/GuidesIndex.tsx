import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePosts } from "@/hooks/usePosts";
import { ArrowRight, BookOpen, Loader2, ArrowLeft } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SiteFooter from "@/components/SiteFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const GuidesIndex = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.split("-")[0] || "en";
  const { posts, isLoading } = usePosts(currentLang);
  const allPosts = usePosts();

  const pageUrl = "https://pcn-appeal.lovable.app/guides";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("legal_guides_title"),
    description: t("legal_guides_subtitle"),
    url: pageUrl,
    publisher: { "@type": "Organization", name: "Ticket Crusader" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://pcn-appeal.lovable.app/guides/${post.slug}`,
        name: post.title,
      })),
    },
  };

  // Group posts by language for geo-targeting display
  const langGroups: Record<string, typeof posts> = {};
  (allPosts.posts ?? []).forEach((p) => {
    const l = p.lang || "en";
    if (!langGroups[l]) langGroups[l] = [];
    langGroups[l].push(p);
  });

  const langLabels: Record<string, { flag: string; label: string }> = {
    en: { flag: "🇬🇧", label: "English" },
    de: { flag: "🇩🇪", label: "Deutsch" },
    fr: { flag: "🇫🇷", label: "Français" },
    es: { flag: "🇪🇸", label: "Español" },
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Legal Guides – Fight Parking Fines | Ticket Crusader</title>
          <meta
            name="description"
            content="Free expert legal guides on how to appeal parking tickets across the UK, USA, Germany, France, Australia, Canada and more. Know your rights."
          />
          <link rel="canonical" href={pageUrl} />
          <meta property="og:title" content="Legal Guides – Fight Parking Fines" />
          <meta
            property="og:description"
            content="Free expert legal guides on how to appeal parking tickets across the UK, USA, Germany, France, Australia, Canada and more."
          />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:type" content="website" />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        {/* Header */}
        <header className="border-b border-border px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
              <span className="text-border">|</span>
              <Link to="/" className="flex items-center gap-1.5">
                <img src="/favicon.png" alt="Ticket Crusader" className="h-4 w-4" />
                <span className="font-display text-xs font-bold text-primary">
                  Ticket Crusader
                </span>
              </Link>
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-10">
          {/* Page heading */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="font-display text-2xl font-bold text-foreground">
                {t("legal_guides_title")}
              </h1>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              {t("legal_guides_subtitle")}
            </p>
          </div>

          {/* Language filter pills */}
          {Object.keys(langGroups).length > 1 && (
            <div className="mb-6 flex flex-wrap gap-1.5">
              {Object.entries(langLabels).map(([code, { flag, label }]) => {
                if (!langGroups[code]) return null;
                const isActive = currentLang === code;
                return (
                  <button
                    key={code}
                    onClick={() => i18n.changeLanguage(code)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {flag} {label} ({langGroups[code].length})
                  </button>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading guides…</span>
            </div>
          ) : posts.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No guides available in this language yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/guides/${post.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {post.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <time className="mt-2 block text-[10px] text-muted-foreground">
                        {new Date(post.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

        <SiteFooter />
      </div>
    </HelmetProvider>
  );
};

export default GuidesIndex;
