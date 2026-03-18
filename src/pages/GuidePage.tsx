import { useParams, Link } from "react-router-dom";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

const GuidePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <h1 className="text-xl font-bold text-foreground mb-2">Guide not found</h1>
        <Link to="/" className="text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const articleUrl = `https://pcn-appeal.lovable.app/guides/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Ticket Crusader" },
    mainEntityOfPage: articleUrl,
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{`${post.title} | Ticket Crusader`}</title>
          <meta name="description" content={post.description} />
          <link rel="canonical" href={articleUrl} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.description} />
          <meta property="og:url" content={articleUrl} />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={post.date} />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        <header className="border-b border-border px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <span className="text-border">|</span>
            <Link to="/" className="flex items-center gap-1.5">
              <img src="/favicon.png" alt="Ticket Crusader" className="h-4 w-4" />
              <span className="font-display text-xs font-bold text-primary">
                Ticket Crusader
              </span>
            </Link>
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-6">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <time className="text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {/* @ts-ignore - react-markdown types */}
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-th:text-foreground prose-td:text-muted-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Related guides */}
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">
              More Legal Guides
            </h3>
            <div className="grid gap-3">
              {getAllPosts()
                .filter((p) => p.slug !== post.slug)
                .slice(0, 3)
                .map((p) => (
                  <Link
                    key={p.slug}
                    to={`/guides/${p.slug}`}
                    className="rounded-lg border border-border p-3 text-sm hover:border-primary/30 transition-colors"
                  >
                    <span className="font-medium text-foreground">{p.title}</span>
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </div>
    </HelmetProvider>
  );
};

export default GuidePage;
