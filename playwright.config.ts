import { defineConfig } from "@playwright/test";
import { readdirSync, existsSync } from "node:fs";

/**
 * On Nix hosts the Playwright-downloaded browser cannot launch (missing
 * system libraries), so prefer the nix-provided headless shell when one
 * is present. CI and non-Nix machines use the stock downloaded browser.
 */
function nixChromiumHeadlessShell(): string | undefined {
  try {
    if (!existsSync("/nix/store")) {
      return undefined;
    }
    const entry = readdirSync("/nix/store").find((name) =>
      name.endsWith("-playwright-chromium-headless-shell"),
    );
    return entry
      ? `/nix/store/${entry}/chrome-headless-shell-linux64/chrome-headless-shell`
      : undefined;
  } catch {
    return undefined;
  }
}

const chromiumExecutable = nixChromiumHeadlessShell();

/**
 * Two servers are started for the suite:
 * - :3000 dev mode (drafts visible) — reuses your running dev server if present
 * - :3001 production mode (drafts excluded) — always spawned
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  // HTML report (never auto-opened) on CI so failures can be uploaded
  // as artifacts; plain list output locally
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        ...(chromiumExecutable
          ? { launchOptions: { executablePath: chromiumExecutable } }
          : {}),
      },
    },
  ],
  webServer: [
    {
      command: "PORT=3000 bun run index.ts",
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "PORT=3001 NODE_ENV=production bun run index.ts",
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
