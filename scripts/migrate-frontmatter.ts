#!/usr/bin/env bun
/**
 * One-shot EDN → YAML frontmatter migration (blog Phase 0)
 *
 * Converts every .md file in resources/templates/md/{posts,pages}:
 * - EDN frontmatter ({:title ...}) → YAML frontmatter (--- fenced)
 * - Forces `draft: true` on every post (curated publishing per plan)
 * - Pages are converted but get no `draft` key
 * - Markdown body preserved from its first non-whitespace character
 *   (identical to what the old parser produced via content.trim())
 *
 * Self-contained on purpose: the EDN parsing code lives here so the
 * script stays runnable after src/lib/markdown.ts drops EDN support.
 *
 * Usage:
 *   bun run scripts/migrate-frontmatter.ts --dry-run   # preview only
 *   bun run scripts/migrate-frontmatter.ts             # migrate + verify
 */

import { readdir } from "node:fs/promises";

const POSTS_DIR = "./resources/templates/md/posts";
const PAGES_DIR = "./resources/templates/md/pages";

type EDNValue = string | number | boolean | string[];
type RawFrontmatter = Record<string, EDNValue>;

// ---------------------------------------------------------------------------
// EDN parsing (fixed rewrite of the legacy parser)
//
// Fixes vs the legacy version:
// - keyword regex accepts trailing `?` (`:draft?`, `:navbar?` were silently
//   dropped before — the root cause of drafts leaking to production)
// - values are parsed by shape (string/vector/scalar), not by fragile
//   start/end offsets — the legacy slicing broke on multi-space alignment
//   (producing garbage dates and silently dropped tags on the live site)
// - string values are unescaped (`\"` was kept literally in titles)
// ---------------------------------------------------------------------------

function unescapeEDNString(value: string): string {
  return value.replace(/\\(.)/g, (_, c: string) => {
    const escapes: Record<string, string> = {
      '"': '"',
      "\\": "\\",
      n: "\n",
      t: "\t",
    };
    return escapes[c] ?? c;
  });
}

function parseEDNValue(valueStr: string): EDNValue {
  const trimmed = valueStr.trim();

  // String (quoted)
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return unescapeEDNString(trimmed.slice(1, -1));
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
          items.push(String(parseEDNValue(current.trim())));
          current = "";
        }
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      items.push(String(parseEDNValue(current.trim())));
    }

    return items;
  }

  return trimmed;
}

/**
 * Extract the value starting at the beginning of `rest` by its shape:
 * quoted string, vector, or line scalar. Returns the raw value text.
 */
function readValueText(rest: string): string {
  const first = rest[0];

  if (first === '"') {
    // Scan to the closing unescaped quote
    let i = 1;
    while (i < rest.length && !(rest[i] === '"' && rest[i - 1] !== "\\")) i++;
    return rest.slice(0, i + 1);
  }

  if (first === "[") {
    // Scan to the matching `]`, respecting quoted items
    let i = 0;
    let inQuote = false;
    while (i < rest.length) {
      const char = rest[i];
      if (char === '"' && rest[i - 1] !== "\\") {
        inQuote = !inQuote;
      } else if (char === "]" && !inQuote) {
        break;
      }
      i++;
    }
    return rest.slice(0, i + 1);
  }

  // Scalar (keyword, boolean, number): up to end of line
  const newline = rest.indexOf("\n");
  return newline === -1 ? rest : rest.slice(0, newline);
}

function parseEDNFrontmatter(ednString: string): RawFrontmatter {
  const result: RawFrontmatter = {};

  // Remove outer braces and normalize whitespace
  const content = ednString.trim().slice(1, -1).trim();

  // Match :keyword followed by its value; `?` suffix allowed (e.g. :draft?)
  const keywordRegex = /:(\w+[\w-]*\??)\s+/g;

  let match;
  while ((match = keywordRegex.exec(content)) !== null) {
    const key = match[1];
    if (!key) continue;
    const start = match.index + match[0].length;
    result[key] = parseEDNValue(readValueText(content.slice(start)).trim());
  }

  return result;
}

// ---------------------------------------------------------------------------
// YAML emission (deterministic block style; Bun.YAML.stringify only emits
// single-line flow style, which we don't want for frontmatter)
// ---------------------------------------------------------------------------

const YAML_KEYWORDS = /^(true|false|null|yes|no|on|off)$/i;

/** Keys whose free-text values are always emitted double-quoted. */
const ALWAYS_QUOTE_KEYS = new Set(["title", "abstract"]);

/** Plain scalar when safe, JSON double-quoted otherwise (valid YAML). */
function yamlScalar(value: string): string {
  if (
    /^[a-zA-Z0-9][a-zA-Z0-9 ._/-]*[a-zA-Z0-9.]$|^[a-zA-Z0-9]$/.test(value) &&
    !YAML_KEYWORDS.test(value)
  ) {
    return value;
  }
  return JSON.stringify(value);
}

function toYAML(fm: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(fm)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      // Always quote items: free-text tags bite in flow style otherwise
      lines.push(
        `${key}: [${value.map((v) => JSON.stringify(String(v))).join(", ")}]`,
      );
    } else if (typeof value === "string") {
      lines.push(
        `${key}: ${ALWAYS_QUOTE_KEYS.has(key) ? JSON.stringify(value) : yamlScalar(value)}`,
      );
    } else {
      lines.push(`${key}: ${String(value)}`);
    }
  }
  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

interface ExpectedMeta {
  filePath: string;
  title: string;
  date?: string;
  tags: string[];
  isPost: boolean;
}

function mapToYAMLFrontmatter(
  raw: RawFrontmatter,
  isPost: boolean,
): Record<string, unknown> {
  const fm: Record<string, unknown> = {};

  fm.title = raw.title;
  fm.layout = raw.layout;
  if (raw.date !== undefined) fm.date = raw.date;
  if (raw.tags !== undefined) fm.tags = raw.tags;
  if (raw.abstract !== undefined) fm.abstract = raw.abstract;
  if (raw.toc !== undefined) fm.toc = raw.toc;

  if (isPost) {
    // All posts start unpublished; curation removes this key (Phase 0.4)
    fm.draft = true;
  } else {
    if (raw["page-index"] !== undefined) fm.pageIndex = raw["page-index"];
    if (raw["navbar?"] !== undefined) fm.navbar = raw["navbar?"];
    if (raw["home?"] !== undefined) fm.home = raw["home?"];
  }

  return fm;
}

async function migrateDir(
  dir: string,
  isPost: boolean,
  dryRun: boolean,
): Promise<ExpectedMeta[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: ExpectedMeta[] = [];

  for (const entry of entries) {
    // Skip asset directories and non-markdown files
    if (entry.isDirectory() || !entry.name.endsWith(".md")) continue;

    const filePath = `${dir}/${entry.name}`;
    const source = await Bun.file(filePath).text();

    // Skip files already migrated (keeps re-runs idempotent)
    if (source.startsWith("---")) {
      console.log(`Skipping ${filePath} (already YAML)`);
      continue;
    }

    const match = source.match(/^\s*\{[\s\S]*?\}\s*\n/);
    if (!match) {
      throw new Error(`No EDN frontmatter found in ${filePath}`);
    }

    const raw = parseEDNFrontmatter(match[0]);
    const body = source.slice(match[0].length);
    const fm = mapToYAMLFrontmatter(raw, isPost);
    const migrated = `---\n${toYAML(fm)}---\n\n${body}`;

    if (typeof raw.title !== "string") {
      throw new Error(`Missing or invalid :title in ${filePath}`);
    }

    results.push({
      filePath,
      title: raw.title,
      date: raw.date === undefined ? undefined : String(raw.date),
      tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
      isPost,
    });

    if (dryRun) {
      console.log(`--- ${filePath}`);
      console.log(toYAML(fm));
    } else {
      await Bun.write(filePath, migrated);
    }
  }

  return results;
}

async function verify(expected: ExpectedMeta[]): Promise<void> {
  let failures = 0;

  for (const meta of expected) {
    const source = await Bun.file(meta.filePath).text();
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!match || !match[1]) {
      console.error(`✗ ${meta.filePath}: no YAML frontmatter after migration`);
      failures++;
      continue;
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = Bun.YAML.parse(match[1]) as Record<string, unknown>;
    } catch (error) {
      console.error(
        `✗ ${meta.filePath}: invalid YAML after migration: ${error}`,
      );
      failures++;
      continue;
    }

    const problems: string[] = [];
    if (parsed.title !== meta.title) {
      problems.push(
        `title ${JSON.stringify(parsed.title)} != ${JSON.stringify(meta.title)}`,
      );
    }
    const parsedDate =
      parsed.date === undefined ? undefined : String(parsed.date);
    if (parsedDate !== meta.date) {
      problems.push(
        `date ${JSON.stringify(parsedDate)} != ${JSON.stringify(meta.date)}`,
      );
    }
    const parsedTags = Array.isArray(parsed.tags)
      ? parsed.tags.map(String)
      : [];
    if (JSON.stringify(parsedTags) !== JSON.stringify(meta.tags)) {
      problems.push(
        `tags ${JSON.stringify(parsedTags)} != ${JSON.stringify(meta.tags)}`,
      );
    }
    if (meta.isPost && parsed.draft !== true) {
      problems.push("post missing draft: true");
    }
    if (!meta.isPost && parsed.draft !== undefined) {
      problems.push("page should not have a draft key");
    }

    if (problems.length > 0) {
      console.error(`✗ ${meta.filePath}: ${problems.join("; ")}`);
      failures++;
    }
  }

  const posts = expected.filter((m) => m.isPost).length;
  const pages = expected.filter((m) => !m.isPost).length;

  if (failures > 0) {
    console.error(`\nVerification FAILED: ${failures} file(s) with mismatches`);
    process.exit(1);
  }

  console.log(
    `\nVerification passed: ${posts} posts + ${pages} pages, all metadata preserved, all posts draft: true`,
  );
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  const posts = await migrateDir(POSTS_DIR, true, dryRun);
  const pages = await migrateDir(PAGES_DIR, false, dryRun);
  const all = [...posts, ...pages];

  if (dryRun) {
    console.log(
      `Dry run: would migrate ${posts.length} posts + ${pages.length} pages (no files written)`,
    );
    return;
  }

  await verify(all);
}

await main();
