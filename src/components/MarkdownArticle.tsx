import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

type HeadingBlock = {
  type: "heading";
  level: number;
  text: string;
};

type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

type ListBlock = {
  type: "unordered_list" | "ordered_list";
  items: string[];
};

type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
};

type Block = HeadingBlock | ParagraphBlock | ListBlock | TableBlock;

const headingPattern = /^(#{1,6})\s+(.*)$/;
const unorderedListPattern = /^-\s+(.*)$/;
const orderedListPattern = /^\d+\.\s+(.*)$/;
const tableSeparatorPattern = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/;
const inlinePattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;

const splitTableRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

const isBlockBoundary = (line: string) => {
  const trimmed = line.trim();

  return (
    trimmed.length === 0 ||
    headingPattern.test(trimmed) ||
    unorderedListPattern.test(trimmed) ||
    orderedListPattern.test(trimmed) ||
    tableSeparatorPattern.test(trimmed)
  );
};

const parseMarkdown = (markdown: string): Block[] => {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];

  for (let index = 0; index < lines.length; ) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(headingPattern);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (trimmed.includes("|") && index + 1 < lines.length && tableSeparatorPattern.test(lines[index + 1].trim())) {
      const headers = splitTableRow(trimmed);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].trim().includes("|")) {
        const row = lines[index].trim();
        if (!row) break;
        rows.push(splitTableRow(row));
        index += 1;
      }

      blocks.push({ type: "table", headers, rows });
      continue;
    }

    const unorderedMatch = trimmed.match(unorderedListPattern);
    if (unorderedMatch) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].trim().match(unorderedListPattern);
        if (!match) break;
        items.push(match[1].trim());
        index += 1;
      }
      blocks.push({ type: "unordered_list", items });
      continue;
    }

    const orderedMatch = trimmed.match(orderedListPattern);
    if (orderedMatch) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].trim().match(orderedListPattern);
        if (!match) break;
        items.push(match[1].trim());
        index += 1;
      }
      blocks.push({ type: "ordered_list", items });
      continue;
    }

    const paragraphLines: string[] = [trimmed];
    index += 1;

    while (index < lines.length && !isBlockBoundary(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
};

const renderInline = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlinePattern)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }

    if (match[2] && match[3]) {
      const label = match[2];
      const href = match[3];
      nodes.push(
        href.startsWith("/") ? (
          <Link key={`${href}-${matchIndex}`} to={href} className="font-medium text-primary underline-offset-4 hover:underline">
            {label}
          </Link>
        ) : (
          <a
            key={`${href}-${matchIndex}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {label}
          </a>
        ),
      );
    } else if (match[4]) {
      nodes.push(
        <strong key={`strong-${matchIndex}`} className="font-semibold text-foreground">
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      nodes.push(
        <em key={`em-${matchIndex}`} className="italic text-foreground">
          {match[5]}
        </em>,
      );
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const headingClasses: Record<number, string> = {
  1: "font-display text-3xl font-bold tracking-tight text-foreground",
  2: "font-display text-2xl font-semibold tracking-tight text-foreground",
  3: "font-display text-xl font-semibold text-foreground",
  4: "font-display text-lg font-semibold text-foreground",
  5: "font-display text-base font-semibold text-foreground",
  6: "font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground",
};

interface MarkdownArticleProps {
  content: string;
}

const MarkdownArticle = ({ content }: MarkdownArticleProps) => {
  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = `h${Math.min(block.level, 6)}` as keyof JSX.IntrinsicElements;
          return (
            <Tag key={`heading-${index}`} className={headingClasses[Math.min(block.level, 6)]}>
              {renderInline(block.text)}
            </Tag>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={`paragraph-${index}`} className="text-base leading-7 text-muted-foreground">
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "unordered_list") {
          return (
            <ul key={`unordered-${index}`} className="ml-5 list-disc space-y-2 text-base leading-7 text-muted-foreground marker:text-primary">
              {block.items.map((item, itemIndex) => (
                <li key={`unordered-${index}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered_list") {
          return (
            <ol key={`ordered-${index}`} className="ml-5 list-decimal space-y-2 text-base leading-7 text-muted-foreground marker:font-semibold marker:text-primary">
              {block.items.map((item, itemIndex) => (
                <li key={`ordered-${index}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }

        return (
          <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {block.headers.map((header, headerIndex) => (
                    <th key={`header-${index}-${headerIndex}`} className="px-4 py-3 font-semibold text-foreground">
                      {renderInline(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`row-${index}-${rowIndex}`} className="border-b border-border last:border-b-0">
                    {row.map((cell, cellIndex) => (
                      <td key={`cell-${index}-${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top text-muted-foreground">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default MarkdownArticle;
