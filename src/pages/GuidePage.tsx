import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPosts, fetchPostBySlug } from "@/lib/posts";
import MarkdownArticle from "@/components/MarkdownArticle";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ArrowLeft, Loader2 } from "lucide-react";

const GuidePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchAllPosts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug!, posts.length ? posts : undefined),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="mb-2 text-xl font-bold text-foreground">Guide not found</h1>
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

  const relatedPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

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
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <span className="text-border">|</span>
            <Link to="/" className="flex items-center gap-1.5">
              <img src="/favicon.png" alt="Ticket Crusader" className="h-4 w-4" />
              <span className="font-display text-xs font-bold text-primary">Ticket Crusader</span>
            </Link>
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-8">
            <div className="mb-3 flex flex-wrap gap-1.5">
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

          <MarkdownArticle content={post.content} />

          {relatedPosts.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <h3 className="mb-4 font-display text-sm font-semibold text-foreground">More Legal Guides</h3>
              <div className="grid gap-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    to={`/guides/${relatedPost.slug}`}
                    className="rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/30"
                  >
                    <span className="font-medium text-foreground">{relatedPost.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </HelmetProvider>
  );
};

export default GuidePage;
