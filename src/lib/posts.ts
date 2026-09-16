/**
 * Blog post loading and management utilities
 */

import { readdir } from "node:fs/promises";
import {
  parseMarkdown,
  extractExcerpt,
  type Frontmatter,
  type Heading,
} from "./markdown.ts";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  html: string;
  draft: boolean;
  cover?: string;
  series?: string;
  updated?: string;
  toc?: boolean;
  headings: Heading[];
}

export interface Page {
  slug: string;
  title: string;
  pageIndex?: number;
  navbar: boolean;
  content: string;
  html: string;
}

const POSTS_DIR = "./resources/templates/md/posts";
const PAGES_DIR = "./resources/templates/md/pages";

// Drafts are visible in development but never published in production
const isProd = process.env.NODE_ENV === "production";

// Cache for posts (cleared on file changes in dev mode)
let postsCache: Post[] | null = null;
let pagesCache: Map<string, Page> | null = null;

/**
 * Extract slug from filename
 * e.g., "2018-03-04-digital-archeology.md" -> "digital-archeology"
 */
function extractSlugFromFilename(filename: string): string {
  // Remove date prefix (YYYY-MM-DD-) and .md extension
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
}

/**
 * Extract date from filename if not in frontmatter
 */
function extractDateFromFilename(filename: string): string | undefined {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : undefined;
}

/**
 * Soft frontmatter validation. Returns a list of problems (empty when
 * valid). Structural failures (unparseable YAML, missing title) already
 * throw in normalizeFrontmatter and are caught per file.
 */
function validateFrontmatter(
  filename: string,
  frontmatter: Frontmatter,
  kind: "post" | "page",
): string[] {
  const problems: string[] = [];

  if (!["post", "page", "home"].includes(frontmatter.layout)) {
    problems.push(`unexpected layout "${frontmatter.layout}"`);
  }
  if (
    kind === "post" &&
    !frontmatter.date &&
    !extractDateFromFilename(filename)
  ) {
    problems.push("missing date (frontmatter and filename)");
  }

  return problems;
}

/**
 * Report validation problems: warn loudly in development, skip-and-log
 * in production. Returns true when the entry should be skipped.
 */
function reportProblems(filename: string, problems: string[]): boolean {
  if (problems.length === 0) {
    return false;
  }
  const message = `${filename}: ${problems.join(", ")}`;
  if (isProd) {
    console.error(`Skipping invalid entry: ${message}`);
    return true;
  }
  console.warn(`⚠️  Invalid frontmatter: ${message}`);
  return false;
}

/**
 * Load all blog posts
 */
export async function loadPosts(): Promise<Post[]> {
  if (postsCache) {
    return postsCache;
  }

  const entries = await readdir(POSTS_DIR, { withFileTypes: true });
  const posts: Post[] = [];

  for (const entry of entries) {
    // Skip directories (posts with assets)
    if (entry.isDirectory()) continue;

    // Only process markdown files
    if (!entry.name.endsWith(".md")) continue;

    try {
      const filePath = `${POSTS_DIR}/${entry.name}`;
      const source = await Bun.file(filePath).text();
      const parsed = parseMarkdown(source);

      if (
        reportProblems(
          entry.name,
          validateFrontmatter(entry.name, parsed.frontmatter, "post"),
        )
      ) {
        continue;
      }

      const slug = extractSlugFromFilename(entry.name);
      const date =
        parsed.frontmatter.date ||
        extractDateFromFilename(entry.name) ||
        "1970-01-01";

      // Ensure tags is always an array
      const tags = Array.isArray(parsed.frontmatter.tags)
        ? parsed.frontmatter.tags
        : [];

      posts.push({
        slug,
        title: parsed.frontmatter.title,
        date,
        tags,
        // Author-provided abstract wins over the auto-derived excerpt
        excerpt: parsed.frontmatter.abstract ?? extractExcerpt(parsed.content),
        content: parsed.content,
        html: parsed.html,
        draft: parsed.frontmatter.draft === true,
        cover: parsed.frontmatter.cover,
        series: parsed.frontmatter.series,
        updated: parsed.frontmatter.updated,
        toc: parsed.frontmatter.toc,
        headings: parsed.headings,
      });
    } catch (error) {
      console.error(`Error parsing post ${entry.name}:`, error);
    }
  }

  // Sort by date descending (newest first)
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // Drafts never reach production listings, feeds, or direct URLs
  const visible = isProd ? posts.filter((p) => !p.draft) : posts;

  postsCache = visible;
  return visible;
}

/**
 * Get a single post by slug
 */
export async function getPost(slug: string): Promise<Post | null> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await loadPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

/**
 * Get posts in a series, ordered oldest first (reading order)
 */
export async function getSeriesPosts(series: string): Promise<Post[]> {
  const posts = await loadPosts();
  return posts
    .filter((p) => p.series === series)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get posts related to the given one by shared tags, most shared tags
 * first, ties broken by recency. Excludes the post itself and posts
 * sharing no tags.
 */
export async function getRelatedPosts(
  post: Post,
  limit: number = 3,
): Promise<Post[]> {
  const posts = await loadPosts();

  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map(({ post }) => post);
}

/**
 * Get all unique tags with their post counts
 */
export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await loadPosts();
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  return tagCounts;
}

/**
 * Load all static pages
 */
export async function loadPages(): Promise<Map<string, Page>> {
  if (pagesCache) {
    return pagesCache;
  }

  const entries = await readdir(PAGES_DIR, { withFileTypes: true });
  const pages = new Map<string, Page>();

  for (const entry of entries) {
    if (!entry.name.endsWith(".md")) continue;

    try {
      const filePath = `${PAGES_DIR}/${entry.name}`;
      const source = await Bun.file(filePath).text();
      const parsed = parseMarkdown(source);

      if (
        reportProblems(
          entry.name,
          validateFrontmatter(entry.name, parsed.frontmatter, "page"),
        )
      ) {
        continue;
      }

      const slug = entry.name.replace(/\.md$/, "");

      // Skip home page (handled separately)
      if (parsed.frontmatter.home) continue;

      pages.set(slug, {
        slug,
        title: parsed.frontmatter.title,
        pageIndex: parsed.frontmatter.pageIndex,
        navbar: parsed.frontmatter.navbar || false,
        content: parsed.content,
        html: parsed.html,
      });
    } catch (error) {
      console.error(`Error parsing page ${entry.name}:`, error);
    }
  }

  pagesCache = pages;
  return pages;
}

/**
 * Get a single page by slug
 */
export async function getPage(slug: string): Promise<Page | null> {
  const pages = await loadPages();
  return pages.get(slug) || null;
}

/**
 * Clear caches (useful for development hot reload)
 */
export function clearCaches(): void {
  postsCache = null;
  pagesCache = null;
}

/**
 * Format date for display
 *
 * Parses YYYY-MM-DD as a plain calendar date in local time. Using
 * `new Date(dateStr)` would parse it as UTC midnight and render one
 * day early whenever the server timezone is behind UTC.
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.slice(0, 10).split("-").map(Number);
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Group posts by year
 */
export async function getPostsByYear(): Promise<Map<string, Post[]>> {
  const posts = await loadPosts();
  const byYear = new Map<string, Post[]>();

  for (const post of posts) {
    const year = post.date.slice(0, 4);
    if (!byYear.has(year)) {
      byYear.set(year, []);
    }
    byYear.get(year)!.push(post);
  }

  return byYear;
}
