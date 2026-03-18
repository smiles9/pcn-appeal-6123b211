// Build-time import of all markdown posts from /posts folder
// When new .md files are added via GitHub sync, they'll be picked up on next build

interface PostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
}

export interface Post extends PostMeta {
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
    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Handle arrays like ["a", "b"]
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

// Vite glob import — runs at build time
const modules = import.meta.glob("/posts/*.md", { query: "?raw", eager: true, import: "default" }) as Record<string, string>;

const posts: Post[] = Object.values(modules)
  .map((raw) => {
    const { meta, content } = parseFrontmatter(raw);
    return {
      title: meta.title || "Untitled",
      slug: meta.slug || "",
      description: meta.description || "",
      date: meta.date || "",
      author: meta.author || "",
      tags: meta.tags || [],
      content,
    } as Post;
  })
  .filter((p) => p.slug)
  .sort((a, b) => (b.date > a.date ? 1 : -1));

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
