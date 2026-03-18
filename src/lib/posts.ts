// Build-time import of markdown posts using Vite glob
// Automatically picks up new .md files added to the /posts directory

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
    lang: meta.lang || "en",
    tags: meta.tags || [],
    content,
  };
}

// Vite glob import – eagerly loads all .md files from /posts at build time
const modules = import.meta.glob("/posts/*.md", { eager: true, query: "?raw", import: "default" });

const allPosts: Post[] = Object.values(modules)
  .map((raw) => rawToPost(raw as string))
  .filter((p): p is Post => p !== null)
  .sort((a, b) => (b.date > a.date ? 1 : -1));

export function fetchAllPosts(): Post[] {
  return allPosts;
}

export function fetchPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}
