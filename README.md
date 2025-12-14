# luchini.nyc

Personal website at [luchini.nyc](https://luchini.nyc).

## Tech Stack

- **Runtime:** Bun
- **Framework:** TypeScript with Bun.serve HTTP server
- **Styling:** TailwindCSS v4 + DaisyUI (dark theme)
- **Interactivity:** HTMX for SPA-like navigation
- **Testing:** Playwright
- **Deployment:** Fly.io (dev/staging/prod)

## Development

```bash
bun install
bun run dev        # Dev server with hot reload
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with CSS watch + hot reload |
| `bun run build:css` | Build TailwindCSS |
| `bun run typecheck` | TypeScript type checking |
| `bun run test` | Run Playwright tests |
| `bun run test:ui` | Run tests with UI |

## Project Structure

```
index.ts                    # HTTP server entry point
src/
  lib/
    html.ts                 # Layout and HTML templates
    markdown.ts             # EDN frontmatter + markdown parser
    posts.ts                # Blog post utilities
  pages/                    # Route handlers (return HTML strings)
resources/templates/md/
  pages/                    # Static page content
  posts/                    # Blog posts with EDN frontmatter
public/                     # Static assets (images, CSS output)
```

## Content Format

Blog posts use EDN frontmatter (Clojure-style):

```markdown
{:title "Post Title"
 :layout :post
 :date "2024-01-01"
 :tags ["tag1" "tag2"]}

Markdown content here...
```

## Deployment

CI/CD via GitHub Actions deploys to Fly.io:
- `main` branch → dev
- `staging` branch → staging  
- `prod` branch → production
