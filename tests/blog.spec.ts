import { test, expect } from "@playwright/test";

const DEV = "http://localhost:3000";
const PROD = "http://localhost:3001";

test.describe("navigation", () => {
  test("navbar links to the blog and marks it active", async ({ page }) => {
    await page.goto(`${DEV}/`);

    const writingLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Writing" });
    await expect(writingLink).toBeVisible();

    await writingLink.click();
    await page.waitForURL("**/posts");
    await expect(page.getByRole("heading", { name: "Writing" })).toBeVisible();

    // Active state follows onto blog pages
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Writing" }),
    ).toHaveClass(/btn-active/);
  });
});

test.describe("blog archive (dev: drafts visible)", () => {
  test("archive groups posts by year", async ({ page }) => {
    await page.goto(`${DEV}/posts`);

    await expect(page.getByRole("heading", { name: "Writing" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "2018", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "2007", exact: true }),
    ).toBeVisible();

    // All posts are currently drafts and must be badged in dev
    await expect(page.locator(".badge-warning").first()).toHaveText("draft");
  });

  test("search filters cards and shows a no-match state", async ({ page }) => {
    await page.goto(`${DEV}/posts`);

    const total = await page.locator("[data-post-card]").count();
    expect(total).toBeGreaterThan(40);

    const search = page.getByRole("searchbox", { name: "Filter posts" });
    await search.fill("ultra-marathon");
    await expect(page.locator("[data-post-card]:visible")).toHaveCount(1);

    await search.fill("zzzz-no-such-post-zzzz");
    await expect(page.locator("[data-post-card]:visible")).toHaveCount(0);
    await expect(page.locator("#no-search-results")).toBeVisible();
  });
});

test.describe("single post (dev)", () => {
  test("renders with article meta, canonical link, and JSON-LD", async ({
    page,
  }) => {
    const response = await page.goto(
      `${DEV}/posts/we-gotta-stop-calling-it-community`,
    );
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/community/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://luchini.nyc/posts/we-gotta-stop-calling-it-community",
    );
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toBeAttached();

    // Draft badge is visible in dev
    await expect(page.locator(".badge-warning")).toHaveText("draft");
  });

  test("renders table of contents with working anchors", async ({ page }) => {
    await page.goto(`${DEV}/posts/testing-the-data-layer-of-applications`);

    await expect(page.locator(".collapse-title")).toHaveText("Contents");

    const tocLink = page.locator(".collapse-content a", {
      hasText: "The scenario",
    });
    await expect(tocLink).toHaveAttribute("href", "#the-scenario");
    await expect(page.locator("h2#the-scenario")).toBeAttached();
  });
});

test.describe("tag pages (dev)", () => {
  test("tag page lists only its posts", async ({ page }) => {
    await page.goto(`${DEV}/tags/clojure`);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "clojure",
    );
    await expect(page.locator("[data-post-card]")).toHaveCount(2);
  });

  test("unknown tag shows the not-found state", async ({ page }) => {
    await page.goto(`${DEV}/tags/nope-not-a-tag`);
    await expect(page.getByText("Tag not found")).toBeVisible();
  });
});

test.describe("production mode gates drafts", () => {
  test("archive lists only published posts", async ({ page }) => {
    await page.goto(`${PROD}/posts`);

    await expect(page.getByText("No posts published yet")).toHaveCount(0);
    await expect(page.locator("[data-post-card]")).toHaveCount(3);
    // Drafts are excluded entirely in production, so no draft badges
    await expect(page.locator(".badge-warning")).toHaveCount(0);
  });

  test("draft post URLs return 404", async ({ page }) => {
    const response = await page.goto(
      `${PROD}/posts/we-gotta-stop-calling-it-community`,
    );
    expect(response?.status()).toBe(404);
  });

  test("published post URLs return 200", async ({ page }) => {
    const response = await page.goto(
      `${PROD}/posts/disconnect-urgency-from-importance`,
    );
    expect(response?.status()).toBe(200);
  });

  test("homepage shows recent writing once posts are published", async ({
    page,
  }) => {
    await page.goto(`${PROD}/`);
    await expect(
      page.getByRole("heading", { name: "Recent writing" }),
    ).toBeVisible();

    await page.goto(`${DEV}/`);
    await expect(
      page.getByRole("heading", { name: "Recent writing" }),
    ).toBeVisible();
  });

  test("production RSS feed includes published items, no drafts", async ({
    request,
  }) => {
    const response = await request.get(`${PROD}/feed.xml`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("<rss");
    expect((body.match(/<item>/g) ?? []).length).toBe(3);
    expect(body).not.toContain("we-gotta-stop-calling-it-community");
  });

  test("dev RSS feed includes items with full content", async ({ request }) => {
    const response = await request.get(`${DEV}/feed.xml`);
    const body = await response.text();

    expect((body.match(/<item>/g) ?? []).length).toBe(20);
    expect(body).toContain("content:encoded");
  });

  test("sitemap reflects publication state", async ({ request }) => {
    const prodBody = await (await request.get(`${PROD}/sitemap.xml`)).text();
    expect(prodBody).toContain("<urlset");
    expect(prodBody).toContain("<loc>https://luchini.nyc/</loc>");
    expect(prodBody).not.toContain("we-gotta-stop-calling-it-community");
    expect(prodBody).toContain("disconnect-urgency-from-importance");
    expect(prodBody).toContain("are-you-part-of-a-cargo-cult");
    expect(prodBody).toContain(
      "west-meets-east-why-does-my-redbull-taste-like-tea",
    );

    const devBody = await (await request.get(`${DEV}/sitemap.xml`)).text();
    expect(devBody).toContain("we-gotta-stop-calling-it-community");
  });
});
