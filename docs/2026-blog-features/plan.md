# Blog Feature Plan

Plan for extending the markdown-sourced blog on luchini.nyc. Written 2026-09-14, amended 2026-09-14 (YAML migration + all-posts-draft decision).

## Current state (evidence, pre-migration)

- **Content:** `resources/templates/md/posts/*.md` — 45 posts (+ 6 post-asset directories), `YYYY-MM-DD-slug.md` filenames, Cryogen-style EDN frontmatter (`:title :layout :date :tags :abstract :draft?`); `resources/templates/md/pages/*.md` uses EDN too (`:page-index :navbar? :home?`)
- **Pipeline:** `src/lib/markdown.ts` (EDN frontmatter parser + marked) → `src/lib/posts.ts` (load/cache/query) → `src/pages/*.ts` (HTML strings) → routes in `index.ts`
- **Existing routes:** `/posts` (archive by year), `/posts/:slug` (with prev/next nav, reading time), `/tags`, `/tags/:tag`, `/feed.xml` (last 20 posts)
- **Tests:** `bun run test` runs Playwright, but there are zero spec files
- **Runtime:** Bun 1.3.4 — `Bun.YAML` is available (verified), so YAML parsing needs no new dependency

## Design constraints

1. **YAML frontmatter** with `---` fences, parsed via `Bun.YAML` — no new runtime dependencies (migrated from EDN in Phase 0).
2. Keep the server-rendered HTML-string pattern — no framework, no client-side rendering for content.
3. Extend the existing layering: lib function in `src/lib/`, page in `src/pages/`, route in `index.ts`.
4. All feature data comes from markdown frontmatter or content — nothing hardcoded in TS.
5. Respect the existing DaisyUI dark-theme design system.
6. YAML keys stay camelCase to match existing TS interfaces (`pageIndex`, not `page_index`) — no mapping layer.

## Phase 0 — Frontmatter migration & draft gate

**Status: implemented (2026-09-15).** Migration verified (45 posts + 3 pages, metadata preserved, all posts `draft: true`); draft gate verified in dev and prod modes.

One atomic change: parser swap, content migration, and draft filtering must ship together. The migration marks **every post `draft: true`** — nothing is publicly published until curated.

Implementation notes — the legacy EDN parser turned out to be buggier than planned for, and the migration fixed these as a side effect:

- Its keyword regex couldn't match `?`-suffixed keys, so `:draft?`/`:navbar?` were *never parsed* (root cause of the draft leak; also `navbar` flags on pages)
- Its value-slicing broke on multi-space-aligned frontmatter, producing garbage `date` strings and silently dropping tags on posts that also set `:draft?`
- Escaped quotes in titles were never unescaped (e.g. `\"community\"` rendered literally)

The migration script is self-contained (`scripts/migrate-frontmatter.ts`, fixed EDN parser + YAML emitter), idempotent (skips already-migrated files), and includes a verification pass.

Follow-up fixes from manual QA (2026-09-15):

- `layout()` now HTML-escapes all frontmatter-derived head values (excerpts with quotes/embeds broke `content="..."` attributes and leaked text onto the page); post titles escaped in h1/cards, URL-derived tag names escaped in tag pages
- `extractExcerpt` strips raw HTML tags so embeds don't leak into excerpts/RSS/meta
- `.prose` heading sizes/weights restored in app.css (Tailwind v4 preflight had reset them; headings rendered as paragraphs)
- Post-asset serving pulled forward from Phase 2.3: `/posts/<dated-dir>/<file>` now serves files from the legacy Cryogen asset directories (post images render)

### 0.1 Replace EDN parser with YAML

- Rewrite `parseMarkdown` in `src/lib/markdown.ts`: frontmatter becomes the `---`-fenced block parsed with `Bun.YAML.parse`; keep the exported `ParsedMarkdown`/`Frontmatter` shapes so `src/lib/posts.ts` is untouched.
- Key mapping during migration: `:title`→`title`, `:layout :post`→`layout: post`, `:date`→`date`, `:tags`→`tags`, `:abstract`→`abstract`, `:draft?`→`draft`, `:navbar?`→`navbar`, `:home?`→`home`, `:page-index`→`pageIndex`.
- Delete the EDN parsing code (`parseEDNFrontmatter`, `parseEDNValue`) once migration is verified.

### 0.2 Migration script

- `scripts/migrate-frontmatter.ts` — one-shot, kept in repo for reproducibility:
  - Reads every `.md` in `resources/templates/md/posts/` and `resources/templates/md/pages/`
  - Parses existing EDN frontmatter with the current parser
  - Rewrites the file as YAML frontmatter + **byte-identical** markdown body
  - **Posts: force `draft: true` on all 51 posts** (per author decision — everything starts unpublished)
  - Pages: no `draft` key added
  - Filename convention (`YYYY-MM-DD-slug.md`) unchanged
- Verification gate: after migration, re-parse all files with the new YAML parser; assert 51 posts load, and titles/dates/tags match a pre-migration snapshot. `bun run typecheck` passes; dev server renders `/posts`.

### 0.3 Draft filtering (was "honor `:draft?`" — now blocking)

- **Pre-existing bug:** 3 posts carry `:draft? true` but the EDN parser ignores the key and `loadPosts()` publishes everything, including to RSS.
- Posts with `draft: true` are excluded in production from: archive, tag pages, RSS, sitemap, search index, related posts, and direct URL access (`/posts/:slug` → 404, do not leak existence).
- In dev (`NODE_ENV !== "production"`) drafts remain visible with a "Draft" badge on archive cards and the post page.
- `/posts` with zero published posts must render a friendly empty state, not a blank page.

### 0.4 Curation workflow

- Publishing a post = removing `draft: true` (or setting `draft: false`) in its frontmatter.
- Consequence, accepted by author: after migration the prod blog, RSS feed, and homepage writing sections are empty; posts go live incrementally as they are curated/revised.

## Phase 1 — Correctness fixes

**Status: implemented (2026-09-16).** Abstract preference verified both directions; `formatDate` renders calendar dates TZ-independently; post pages emit canonical link, `og:type=article`, per-post `og:url`, `article:published_time`/`article:tag`, and `twitter:image` (non-post pages keep website defaults).

### 1.1 Use `abstract` when present

- **Gap:** `:abstract` is parsed but never read; excerpts are always regex-derived via `extractExcerpt`.
- **Fix:** in `loadPosts()`, prefer `frontmatter.abstract` for the excerpt; fall back to `extractExcerpt(content)`. Flows into archive cards, RSS `<description>`, and post meta descriptions.

### 1.2 Fix date timezone drift

- **Bug:** `formatDate` (src/lib/posts.ts) does `new Date("2018-07-12")` (UTC midnight) then formats in server TZ — posts can render one day early.
- **Fix:** parse `YYYY-MM-DD` as a plain calendar date (explicit year/month/day parts) before formatting.

### 1.3 Per-post OG / canonical tags

- **Gap:** `layout()` (src/lib/html.ts) hardcodes `og:url` to `https://luchini.nyc`, `og:type` to `website`, and one avatar image for every page.
- **Fix:** extend `LayoutOptions` with `canonicalPath`, `ogType`, `ogImage`, `publishedTime`, `tags`; post pages emit `og:type=article`, per-post `og:url`, `article:published_time`, `article:tag`, and `<link rel="canonical">`.

## Phase 2 — Content model extensions

**Status: implemented (2026-09-16).** Verified with fixture posts (removed after QA): `cover:` drives og:image, a post-page header image, and archive card thumbnails; `series:` renders a "Part N of M" index block on posts plus `/series/:name` listing pages in reading order; `updated:` renders "Updated …" next to the publish date. 2.3's asset serving landed earlier (Phase 0 QA follow-up); legacy relative image refs resolve without HTML rewriting, so nothing else was needed there. RSS/sitemap `lastmod` wiring for `updated:` deferred to Phase 4.

### 2.1 `cover:`

- Per-post social image. Feeds `og:image`/`twitter:image`, an optional header image on the post page, and thumbnails on archive cards.

### 2.2 `series:`

- Groups multi-part posts. Each post in a series renders a series index block ("Part 2 of 4 in *Name*") with links to siblings. Optional `/series/:name` page listing the ordered parts, date ascending.

### 2.3 Post-local assets

- **Gap:** `loadPosts()` skips directories (`if (entry.isDirectory()) continue`), so images cannot be co-located with a post (Cryogen supported this).
- **Fix:** support `posts/<slug>/` asset directories; serve them under `/posts/<slug>/...`; rewrite relative image URLs in post HTML.

### 2.4 `updated:`

- Optional revised date; render "Updated …" next to the publish date and expose it in RSS/sitemap `lastmod`.

## Phase 3 — Discovery & reading UX

**Status: implemented (2026-09-16).** Verified with fixture posts (removed after QA). Deviation from the original sketch: 3.1 uses DOM filtering of the server-rendered archive (cards carry `data-search` attributes; a small inline script toggles visibility, hides empty year groups, and shows a no-match state) instead of a `/search.json` endpoint + client-side renderer — same no-dependency outcome with zero markup duplication. Related posts score by shared tags with recency tie-break and reuse the exported `postCard`; the homepage "Recent writing" section hides itself while everything is unpublished. TOC headings are extracted with `marked.lexer` (nested tokens walked), ids injected into the HTML in document order, and the collapsible block renders for posts with 3+ headings unless `toc:` overrides (the one legacy `:toc true` post still opts in; `toc: false` suppresses).

### 3.1 Client-side search

- Serve `/search.json` from the existing `loadPosts()` cache (slug, title, tags, excerpt, date; published posts only). Small vanilla-JS searcher on `/posts`. No new runtime dependencies.

### 3.2 Related posts

- Score other published posts by shared-tag count, tie-break by recency; render 3 cards at the bottom of `postPage`.

### 3.3 Homepage "Recent writing"

- Top 3 published posts on `src/pages/home.ts`; today nothing on `/` surfaces the blog. Hidden while all posts are drafts.

### 3.4 Table of contents

- Extract headings during markdown parse; render a collapsible TOC for posts with 3+ headings.

## Phase 4 — Distribution & SEO

**Status: implemented (2026-09-16).** Verified live: `/sitemap.xml` lists static pages, published posts (`lastmod` from `updated` ?? `date`), tag and series pages (drafts excluded via the `loadPosts` prod filter); `/feed.xml` gained full-content `content:encoded` (CDATA-safe) and per-tag feeds at `/tags/:tag/feed.xml`; post pages embed `Article` JSON-LD (headline, dates with `dateModified` from `updated`, author, keywords, cover image) via a `jsonLd` layout option with script-tag sanitization.

### 4.1 `/sitemap.xml`

- Static pages + published posts + tag pages, with `lastmod` from post dates.

### 4.2 RSS upgrades

- Full-content option (`content:encoded`), per-tag feeds at `/tags/:tag/feed.xml`.

### 4.3 JSON-LD

- `Article` schema on post pages (headline, datePublished, dateModified, author, keywords).

## Phase 5 — Quality gates

### 5.1 Playwright specs

- First specs in the repo: archive renders grouped by year, single post renders, tag pages list correct posts, **drafts excluded in prod mode**, RSS is valid XML with expected item count, search returns results.

### 5.2 Frontmatter validation

- Validate required YAML keys (`title`, `layout`, `date`) on load; warn loudly in dev, skip-and-log in prod (today a bad file fails silently via `console.error`).

### 5.3 Pagination on `/posts`

- Explicitly deferred. Fine at 51 posts; revisit past ~100.

## Suggested implementation order

1. **Phase 0** — migration + draft gate ship together (atomic); site goes to "all drafts" state
2. Phase 1 (correctness fixes, small diffs)
3. Phase 3.3 + 3.2 (homepage surface + related posts) — as first posts are curated live
4. Phase 2 (content model) — needs author decisions on covers/series naming
5. Phase 3.1 (search) + 4.1 (sitemap)
6. Phase 5 (tests) — or interleave specs with each phase; draft-filtering spec belongs with Phase 0
7. Phase 4.2–4.3 as needed

## Open questions for the author

- Cover images: generate/social-card style, or manual per-post assets?
- Series: are there existing multi-part posts in the archive to retro-tag?
- Search UI: inline filter on `/posts`, or a dedicated `/search` page?
- Curation: what are the criteria for un-drafting old posts (as-is, revise first, rewrite)?
