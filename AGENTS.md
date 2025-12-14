# Agent Guidelines

## Commands
- **Dev server:** `bun run dev` (builds CSS + hot reload)
- **Build CSS:** `bun run build:css`
- **Type check:** `bun run typecheck`
- **All tests:** `bun run test`
- **Single test:** `bunx playwright test <test-file> --project=chromium`
- **Test UI:** `bun run test:ui`

## Code Style
- **Runtime:** Bun with TypeScript (strict mode, ESNext target)
- **Imports:** Use `.ts` extension in imports (e.g., `./lib/posts.ts`)
- **Types:** Explicit interfaces for data structures (Post, Page, Frontmatter)
- **Naming:** camelCase for functions/variables, PascalCase for interfaces
- **Functions:** Prefer `async function name()` with explicit return types
- **Error handling:** Use try/catch with `console.error`, return null for missing resources
- **HTML:** Template literals with tagged functions (layout, header, footer)
- **Styling:** TailwindCSS v4 + DaisyUI, dark theme default

## Architecture
- Entry point: `index.ts` (Bun.serve HTTP server)
- Pages: `src/pages/*.ts` - return HTML strings
- Lib: `src/lib/*.ts` - shared utilities (markdown parsing, HTML templates)
- Content: `resources/templates/md/` - Markdown with EDN frontmatter
