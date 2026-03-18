// Runtime fetch of markdown posts from GitHub API
// Automatically picks up new .md files pushed to the repository

const GITHUB_OWNER = "smiles9";
const GITHUB_REPO = "pcn-appeal-6123b211";
const POSTS_DIR = "posts";
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_DIR}`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${POSTS_DIR}`;

export interface Post {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
}

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, any> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
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
    tags: meta.tags || [],
    content,
  };
}

// Fetch directory listing, then fetch each file's raw content
export async function fetchAllPosts(): Promise<Post[]> {
  const dirRes = await fetch(API_BASE, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!dirRes.ok) throw new Error(`GitHub API error: ${dirRes.status}`);

  const files: { name: string; download_url: string }[] = await dirRes.json();
  const mdFiles = files.filter((f) => f.name.endsWith(".md"));

  const posts = await Promise.all(
    mdFiles.map(async (f) => {
      const raw = await fetch(f.download_url || `${RAW_BASE}/${f.name}`).then((r) => r.text());
      return rawToPost(raw);
    })
  );

  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

// Fetch a single post by slug — fetches all then filters
// GitHub API doesn't support querying by frontmatter, so we reuse the list
export async function fetchPostBySlug(slug: string, allPosts?: Post[]): Promise<Post | undefined> {
  const posts = allPosts ?? (await fetchAllPosts());
  return posts.find((p) => p.slug === slug);
}
