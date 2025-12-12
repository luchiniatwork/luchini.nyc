/**
 * Blog post loading and management utilities
 */

import { readdir } from "node:fs/promises";
import { parseMarkdown, extractExcerpt, type ParsedMarkdown } from "./markdown.ts";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  html: string;
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
      
      const slug = extractSlugFromFilename(entry.name);
      const date = parsed.frontmatter.date || extractDateFromFilename(entry.name) || "1970-01-01";
      
      // Ensure tags is always an array
      const tags = Array.isArray(parsed.frontmatter.tags) ? parsed.frontmatter.tags : [];
      
      posts.push({
        slug,
        title: parsed.frontmatter.title,
        date,
        tags,
        excerpt: extractExcerpt(parsed.content),
        content: parsed.content,
        html: parsed.html,
      });
    } catch (error) {
      console.error(`Error parsing post ${entry.name}:`, error);
    }
  }

  // Sort by date descending (newest first)
  posts.sort((a, b) => b.date.localeCompare(a.date));
  
  postsCache = posts;
  return posts;
}

/**
 * Get a single post by slug
 */
export async function getPost(slug: string): Promise<Post | null> {
  const posts = await loadPosts();
  return posts.find(p => p.slug === slug) || null;
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await loadPosts();
  return posts.filter(p => p.tags.includes(tag));
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
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
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
