// Runtime fetching of markdown posts from GitHub API
// Fetches articles dynamically so new posts appear without rebuild

export interface Post {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  lang: string;
  tags: string[];
  content: string;
}

const GITHUB_API_URL =
  "https://api.github.com/repos/smiles9/pcn-appeal-6123b211/contents/posts";

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, any> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[")) {
      try {
        meta[key] = JSON.parse(value);
      } catch {
        meta[key] = value;
      }
    } else {
      meta[key] = value;
    }
  }
  return { meta, content: match[2].trim() };
}

function rawToPost(raw: string): Post | null {
  const { meta, content } = parseFrontmatter(raw);
  if (!meta.slug) return null;
  return {
    title: meta.title || "Untitled",
    slug: meta.slug,
    description: meta.description || "",
    date: meta.date || "",
    author: meta.author || "",
    lang: meta.lang || "en",
    tags: meta.tags || [],
    content,
  };
}

interface GitHubFile {
  name: string;
  download_url: string;
}

/**
 * Fetches all posts from the GitHub repo at runtime.
 * Results are cached by React Query in the caller.
 */
export async function fetchPostsFromGitHub(): Promise<Post[]> {
  // Step 1: list files in /posts directory
  const listRes = await fetch(GITHUB_API_URL, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!listRes.ok) {
    console.error("GitHub API error:", listRes.status);
    return [];
  }

  const files: GitHubFile[] = await listRes.json();
  const mdFiles = files.filter((f) => f.name.endsWith(".md"));

  // Step 2: fetch raw content of each markdown file in parallel
  const posts = await Promise.all(
    mdFiles.map(async (file) => {
      try {
        const rawRes = await fetch(file.download_url);
        if (!rawRes.ok) return null;
        const raw = await rawRes.text();
        return rawToPost(raw);
      } catch {
        return null;
      }
    })
  );

  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}
