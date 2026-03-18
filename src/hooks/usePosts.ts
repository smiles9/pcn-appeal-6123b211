import { useQuery } from "@tanstack/react-query";
import { fetchPostsFromGitHub, Post } from "@/lib/posts";

export function usePosts(lang?: string) {
  const query = useQuery<Post[]>({
    queryKey: ["github-posts"],
    queryFn: fetchPostsFromGitHub,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,
  });

  const filtered = lang
    ? (query.data ?? []).filter((p) => p.lang === lang)
    : (query.data ?? []);

  return { ...query, posts: filtered };
}

export function usePost(slug: string | undefined) {
  const { data: allPosts, isLoading, error } = usePosts();
  const post = slug ? allPosts.find((p) => p.slug === slug) : undefined;
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  return { post, relatedPosts, isLoading, error };
}
