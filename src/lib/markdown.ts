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
  /** Social/header image: absolute URL or site-relative path */
  cover?: string;
  /** Series name grouping multi-part posts */
  series?: string;
  /** Revision date (YYYY-MM-DD) shown next to the publish date */
  updated?: string;
}

export interface Heading {
  depth: number; // 2 or 3 (h2/h3 are included in the TOC)
  text: string; // plain text with inline markdown stripped
  slug: string; // anchor id, deduplicated
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  content: string;
  html: string;
  headings: Heading[];
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
  } else if (fm.toc === false) {
    frontmatter.toc = false;
  }
  if (typeof fm.cover === "string") {
    frontmatter.cover = fm.cover;
  }
  if (typeof fm.series === "string") {
    frontmatter.series = fm.series;
  }
  if (fm.updated !== undefined) {
    frontmatter.updated = String(fm.updated);
  }

  return frontmatter;
}

/**
 * GitHub-style slug for heading anchors
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Strip inline markdown formatting for plain-text display
 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/**
 * Walk lexer tokens (including nested blockquote/list tokens) in document
 * order and collect h2/h3 headings.
 */
function collectHeadings(
  tokens: unknown[],
  out: { depth: number; text: string }[],
): void {
  for (const raw of tokens) {
    const token = raw as {
      type?: string;
      depth?: number;
      text?: string;
      tokens?: unknown[];
      items?: { tokens?: unknown[] }[];
    };
    if (token.type === "heading" && typeof token.depth === "number") {
      out.push({ depth: token.depth, text: token.text ?? "" });
    }
    if (Array.isArray(token.tokens)) {
      collectHeadings(token.tokens, out);
    }
    if (Array.isArray(token.items)) {
      for (const item of token.items) {
        if (Array.isArray(item.tokens)) {
          collectHeadings(item.tokens, out);
        }
      }
    }
  }
}

/**
 * Extract h2/h3 headings for the table of contents and inject matching id
 * anchors into the rendered HTML. Id assignment relies on lexer order being
 * render order; raw-HTML headings not produced by markdown are left alone
 * (guarded by depth comparison).
 */
function processHeadings(
  content: string,
  html: string,
): { headings: Heading[]; html: string } {
  const rawHeadings: { depth: number; text: string }[] = [];
  collectHeadings(marked.lexer(content), rawHeadings);

  const slugCounts = new Map<string, number>();
  const headings: Heading[] = [];

  for (const raw of rawHeadings) {
    if (raw.depth < 2 || raw.depth > 3) continue;
    const text = stripInlineMarkdown(raw.text);
    if (!text) continue;
    const base = slugify(text);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    headings.push({
      depth: raw.depth,
      text,
      slug: count === 0 ? base : `${base}-${count}`,
    });
  }

  let index = 0;
  const htmlWithIds = html.replace(/<h([23])>/g, (match, depth: string) => {
    const heading = headings[index];
    if (heading && String(heading.depth) === depth) {
      index++;
      return `<h${depth} id="${heading.slug}">`;
    }
    return match;
  });

  return { headings, html: htmlWithIds };
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
  const rawHtml = marked.parse(content, { async: false }) as string;
  const { headings, html } = processHeadings(content, rawHtml);

  return {
    frontmatter,
    content,
    html,
    headings,
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
