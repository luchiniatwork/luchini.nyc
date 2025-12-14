import { homePage } from "./src/pages/home.ts";
import { notFoundPage } from "./src/pages/not-found.ts";
import { postsPage, tagsPage, tagPage } from "./src/pages/posts.ts";
import { postPage } from "./src/pages/post.ts";
import { staticPage } from "./src/pages/page.ts";
import { awardsPage } from "./src/pages/awards.ts";
import { openSourcePage } from "./src/pages/open-source.ts";
import { loadPosts } from "./src/lib/posts.ts";

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
  const url = new URL(req.url);
  const path = url.pathname;

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
    const feed = await generateRSSFeed();
    return new Response(feed, {
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

/**
 * Generate RSS feed
 */
async function generateRSSFeed(): Promise<string> {
  const posts = await loadPosts();
  const recentPosts = posts.slice(0, 20); // Last 20 posts
  
  const items = recentPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://luchini.nyc/posts/${post.slug}</link>
      <guid>https://luchini.nyc/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${(post.tags || []).map(tag => `<category>${tag}</category>`).join("")}
    </item>
  `).join("");
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tiago Luchini</title>
    <link>https://luchini.nyc</link>
    <description>Thoughts on technology, leadership, and life by Tiago Luchini</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://luchini.nyc/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

// Start server with optional live reload in development
if (isDev) {
  try {
    const { withHtmlLiveReload } = await import("bun-html-live-reload");
    // @ts-expect-error - bun-html-live-reload types are not accurate
    Bun.serve(withHtmlLiveReload(handleRequest));
    console.log("🚀 Server running at http://localhost:3000");
    console.log("📦 Development mode with hot reload enabled");
  } catch {
    Bun.serve({ port: 3000, fetch: handleRequest });
    console.log("🚀 Server running at http://localhost:3000");
    console.log("⚠️  Live reload not available");
  }
} else {
  Bun.serve({ port: 3000, fetch: handleRequest });
  console.log("🚀 Server running at http://localhost:3000");
}

export { handleRequest };
