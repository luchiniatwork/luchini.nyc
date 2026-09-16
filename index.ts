import { homePage } from "./src/pages/home.ts";
import { notFoundPage } from "./src/pages/not-found.ts";
import { postsPage, tagsPage, tagPage, seriesPage } from "./src/pages/posts.ts";
import { postPage } from "./src/pages/post.ts";
import { staticPage } from "./src/pages/page.ts";
import { awardsPage } from "./src/pages/awards.ts";
import { openSourcePage } from "./src/pages/open-source.ts";
import {
  loadPosts,
  loadPages,
  getAllTags,
  getPostsByTag,
  type Post,
} from "./src/lib/posts.ts";

// Check if we're in development mode
const isDev = process.env.NODE_ENV !== "production";

// Content type mapping
const contentTypes: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".zip": "application/zip",
};

function getContentType(path: string): string {
  const ext = path.substring(path.lastIndexOf("."));
  return contentTypes[ext] || "application/octet-stream";
}

// Request handler
async function handleRequest(req: Request): Promise<Response> {
  let url: URL;
  try {
    url = new URL(req.url);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
  const path = url.pathname;

  // Redirect www to apex domain
  if (url.hostname === "www.luchini.nyc") {
    return Response.redirect(
      `https://luchini.nyc${url.pathname}${url.search}`,
      301,
    );
  }

  // Serve static files from public directory
  if (
    path.startsWith("/img/") ||
    path === "/output.css" ||
    path.startsWith("/favicon") ||
    path.endsWith(".xml") ||
    path.endsWith(".json") ||
    path.endsWith(".pdf") ||
    path.endsWith(".zip")
  ) {
    const filePath = `./public${path}`;
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file, {
        headers: { "Content-Type": getContentType(path) },
      });
    }
  }

  // Routes
  // Homepage
  if (path === "/" || path === "/index.html") {
    const html = await homePage();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Blog archive
  if (path === "/posts" || path === "/posts/") {
    const html = await postsPage();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Tags list
  if (path === "/tags" || path === "/tags/") {
    const html = await tagsPage();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Single tag
  const tagMatch = path.match(/^\/tags\/([^/]+)\/?$/);
  if (tagMatch && tagMatch[1]) {
    const tag = decodeURIComponent(tagMatch[1]);
    const html = await tagPage(tag);
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Series page
  const seriesMatch = path.match(/^\/series\/([^/]+)\/?$/);
  if (seriesMatch && seriesMatch[1]) {
    const name = decodeURIComponent(seriesMatch[1]);
    const html = await seriesPage(name);
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Post-local assets (e.g. /posts/2007-08-15-slug/image.gif)
  const postAssetMatch = path.match(
    /^\/posts\/(\d{4}-\d{2}-\d{2}-[^/]+\/[^/]+)$/,
  );
  if (
    postAssetMatch &&
    postAssetMatch[1] &&
    !postAssetMatch[1].includes("..")
  ) {
    const file = Bun.file(
      `./resources/templates/md/posts/${postAssetMatch[1]}`,
    );
    if (await file.exists()) {
      return new Response(file, {
        headers: { "Content-Type": getContentType(path) },
      });
    }
  }

  // Single blog post
  const postMatch = path.match(/^\/posts\/([^/]+)\/?$/);
  if (postMatch && postMatch[1]) {
    const slug = postMatch[1];
    const html = await postPage(slug);
    if (html) {
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  // RSS feed
  if (path === "/feed.xml" || path === "/rss.xml") {
    const posts = await loadPosts();
    const feed = generateRSSFeed(posts, "Tiago Luchini", "feed.xml");
    return new Response(feed, {
      headers: { "Content-Type": "application/xml" },
    });
  }

  // Per-tag RSS feed
  const tagFeedMatch = path.match(/^\/tags\/([^/]+)\/feed\.xml$/);
  if (tagFeedMatch && tagFeedMatch[1]) {
    const tag = decodeURIComponent(tagFeedMatch[1]);
    const tagPosts = await getPostsByTag(tag);
    const feed = generateRSSFeed(
      tagPosts,
      `Tiago Luchini - #${tag}`,
      `tags/${encodeURIComponent(tag)}/feed.xml`,
    );
    return new Response(feed, {
      headers: { "Content-Type": "application/xml" },
    });
  }

  // XML sitemap
  if (path === "/sitemap.xml") {
    const sitemap = await generateSitemap();
    return new Response(sitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  }

  // Awards page
  if (path === "/awards" || path === "/awards/") {
    const html = await awardsPage();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Open Source page
  if (path === "/open-source" || path === "/open-source/") {
    const html = await openSourcePage();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Static pages (portfolio, media, running)
  const pageMatch = path.match(/^\/([a-z-]+)\/?$/);
  if (pageMatch && pageMatch[1]) {
    const slug = pageMatch[1];
    const html = await staticPage(slug);
    if (html) {
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  // 404 for everything else
  return new Response(notFoundPage(), {
    status: 404,
    headers: { "Content-Type": "text/html" },
  });
}

const BASE_URL = "https://luchini.nyc";

/**
 * Escape XML special characters in element text
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Safely wrap text in CDATA (splits any embedded "]]>" terminator)
 */
function cdata(text: string): string {
  return `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/**
 * Generate an RSS feed for the given posts
 */
function generateRSSFeed(
  posts: Post[],
  channelTitle: string,
  feedPath: string,
): string {
  const recentPosts = posts.slice(0, 20); // Last 20 posts

  const items = recentPosts
    .map(
      (post) => `
    <item>
      <title>${cdata(post.title)}</title>
      <link>${BASE_URL}/posts/${post.slug}</link>
      <guid>${BASE_URL}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${cdata(post.excerpt)}</description>
      <content:encoded>${cdata(post.html)}</content:encoded>
      ${(post.tags || []).map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
    </item>
  `,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${BASE_URL}</link>
    <description>Thoughts on technology, leadership, and life by Tiago Luchini</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/${feedPath}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

/**
 * Generate the XML sitemap (published posts only, via the loadPosts
 * production filter)
 */
async function generateSitemap(): Promise<string> {
  const posts = await loadPosts();
  const pages = await loadPages();
  const tags = await getAllTags();

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: `${BASE_URL}/` },
    { loc: `${BASE_URL}/posts` },
    { loc: `${BASE_URL}/tags` },
    { loc: `${BASE_URL}/awards` },
    { loc: `${BASE_URL}/open-source` },
  ];

  for (const slug of pages.keys()) {
    urls.push({ loc: `${BASE_URL}/${slug}` });
  }

  for (const post of posts) {
    urls.push({
      loc: `${BASE_URL}/posts/${post.slug}`,
      lastmod: post.updated ?? post.date,
    });
  }

  for (const tag of tags.keys()) {
    urls.push({ loc: `${BASE_URL}/tags/${encodeURIComponent(tag)}` });
  }

  const seriesNames = new Set(
    posts.map((post) => post.series).filter((s): s is string => Boolean(s)),
  );
  for (const name of seriesNames) {
    urls.push({ loc: `${BASE_URL}/series/${encodeURIComponent(name)}` });
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>`;
}

// Start server with optional live reload in development
// PORT overrides the default 3000 (used by the Playwright prod server)
const port = Number(process.env.PORT) || 3000;

if (isDev) {
  try {
    const { withHtmlLiveReload } = await import("bun-html-live-reload");
    Bun.serve({
      port,
      fetch: withHtmlLiveReload(handleRequest),
    });
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log("📦 Development mode with hot reload enabled");
  } catch {
    Bun.serve({ port, fetch: handleRequest });
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log("⚠️  Live reload not available");
  }
} else {
  Bun.serve({ port, fetch: handleRequest });
  console.log(`🚀 Server running at http://localhost:${port}`);
}

export { handleRequest };
