/**
 * Markdown parsing with YAML frontmatter support
 *
 * Frontmatter is a --- fenced YAML block parsed with Bun.YAML:
 * ---
 * title: "Post Title"
 * layout: post
 * date: 2018-03-04
 * tags: ["tag1", "tag2"]
 * draft: true
 * ---
 */

import { marked } from "marked";

export interface Frontmatter {
  title: string;
  layout: "post" | "page" | "home";
  date?: string;
  tags?: string[];
  pageIndex?: number;
  navbar?: boolean;
  home?: boolean;
  abstract?: string;
  draft?: boolean;
  toc?: boolean;
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  content: string;
  html: string;
}

/**
 * Normalize a parsed YAML frontmatter block into the Frontmatter shape.
 * Throws on structurally invalid input (missing title, non-map YAML).
 */
function normalizeFrontmatter(raw: unknown): Frontmatter {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Frontmatter must be a YAML mapping");
  }

  const fm = raw as Record<string, unknown>;

  if (typeof fm.title !== "string" || fm.title.length === 0) {
    throw new Error("Frontmatter missing required 'title'");
  }

  const frontmatter: Frontmatter = {
    title: fm.title,
    layout: (fm.layout as Frontmatter["layout"]) ?? "post",
  };

  // Coerce defensively: YAML scalars like dates may parse as non-strings
  if (fm.date !== undefined) {
    frontmatter.date = String(fm.date);
  }
  if (Array.isArray(fm.tags)) {
    frontmatter.tags = fm.tags.map(String);
  }
  if (typeof fm.pageIndex === "number") {
    frontmatter.pageIndex = fm.pageIndex;
  }
  if (fm.navbar === true) {
    frontmatter.navbar = true;
  }
  if (fm.home === true) {
    frontmatter.home = true;
  }
  if (typeof fm.abstract === "string") {
    frontmatter.abstract = fm.abstract;
  }
  if (fm.draft === true) {
    frontmatter.draft = true;
  }
  if (fm.toc === true) {
    frontmatter.toc = true;
  }

  return frontmatter;
}

/**
 * Parse a markdown file with YAML frontmatter
 */
export function parseMarkdown(source: string): ParsedMarkdown {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!match || match[1] === undefined) {
    throw new Error("No YAML frontmatter found");
  }

  const frontmatter = normalizeFrontmatter(Bun.YAML.parse(match[1]));
  const content = source.slice(match[0].length).trim();

  // Configure marked for safe HTML output
  const html = marked.parse(content, { async: false }) as string;

  return {
    frontmatter,
    content,
    html,
  };
}

/**
 * Extract a plain text excerpt from markdown content
 */
export function extractExcerpt(
  content: string,
  maxLength: number = 200,
): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // code blocks (before inline code)
    .replace(/<[^>]+>/g, " ") // raw HTML tags (embeds, blockquotes)
    .replace(/#{1,6}\s+/g, "") // headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\n+/g, " ") // newlines to spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Cut at word boundary
  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.slice(0, lastSpace) + "...";
}
