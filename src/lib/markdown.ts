/**
 * Markdown parsing with EDN frontmatter support
 * 
 * Parses Clojure EDN-style frontmatter used by Cryogen:
 * {:title "Post Title"
 *  :layout :post
 *  :date "2018-03-04"
 *  :tags ["tag1" "tag2"]}
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
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  content: string;
  html: string;
}

/**
 * Parse EDN-style frontmatter from Cryogen markdown files
 * 
 * Handles format like:
 * {:title "My Title"
 *  :layout :post
 *  :date "2024-01-01"
 *  :tags ["tag1" "tag2"]}
 */
function parseEDNFrontmatter(ednString: string): Frontmatter {
  const result: Partial<Frontmatter> = {};
  
  // Remove outer braces and normalize whitespace
  const content = ednString.trim().slice(1, -1).trim();
  
  // Parse key-value pairs
  // Match :keyword followed by its value
  const keywordRegex = /:(\w+[\w-]*)\s+/g;
  const matches: { key: string; start: number; end: number }[] = [];
  
  let match;
  while ((match = keywordRegex.exec(content)) !== null) {
    const key = match[1];
    if (key) {
      matches.push({
        key,
        start: match.index + match[0].length,
        end: -1,
      });
    }
  }
  
  // Set end positions
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    if (current) {
      current.end = next ? next.start - next.key.length - 2 : content.length;
    }
  }
  
  // Extract values
  for (const match of matches) {
    if (!match) continue;
    const { key, start, end } = match;
    const valueStr = content.slice(start, end).trim();
    const value = parseEDNValue(valueStr);
    
    // Map EDN keys to TypeScript properties
    switch (key) {
      case "title":
        result.title = value as string;
        break;
      case "layout":
        result.layout = value as "post" | "page" | "home";
        break;
      case "date":
        result.date = value as string;
        break;
      case "tags":
        result.tags = value as string[];
        break;
      case "page-index":
        result.pageIndex = value as number;
        break;
      case "navbar?":
        result.navbar = value as boolean;
        break;
      case "home?":
        result.home = value as boolean;
        break;
      case "abstract":
        result.abstract = value as string;
        break;
    }
  }
  
  return result as Frontmatter;
}

/**
 * Parse individual EDN values
 */
function parseEDNValue(valueStr: string): string | number | boolean | string[] {
  const trimmed = valueStr.trim();
  
  // String (quoted)
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  
  // Keyword (like :post)
  if (trimmed.startsWith(":")) {
    return trimmed.slice(1);
  }
  
  // Boolean
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  
  // Number
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed);
  }
  
  // Vector/Array
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    
    // Parse array items (handle quoted strings)
    const items: string[] = [];
    let current = "";
    let inQuote = false;
    
    for (let i = 0; i < inner.length; i++) {
      const char = inner[i];
      if (char === '"' && inner[i - 1] !== "\\") {
        inQuote = !inQuote;
        current += char;
      } else if ((char === " " || char === "\n") && !inQuote) {
        if (current.trim()) {
          items.push(parseEDNValue(current.trim()) as string);
          current = "";
        }
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      items.push(parseEDNValue(current.trim()) as string);
    }
    
    return items;
  }
  
  return trimmed;
}

/**
 * Parse a markdown file with EDN frontmatter
 */
export function parseMarkdown(source: string): ParsedMarkdown {
  // Find EDN frontmatter block (starts with { and ends with })
  const frontmatterMatch = source.match(/^\s*\{[\s\S]*?\}\s*\n/);
  
  if (!frontmatterMatch) {
    throw new Error("No EDN frontmatter found");
  }
  
  const frontmatterStr = frontmatterMatch[0];
  const content = source.slice(frontmatterStr.length).trim();
  const frontmatter = parseEDNFrontmatter(frontmatterStr);
  
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
export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/```[\s\S]*?```/g, "") // code blocks
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
