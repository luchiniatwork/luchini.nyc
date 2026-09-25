import { layout, escapeHtml } from "../lib/html.ts";
import {
  loadPosts,
  getPostsByYear,
  getSeriesPosts,
  formatDate,
  type Post,
} from "../lib/posts.ts";

/**
 * Blog archive page - lists all posts
 */
export async function postsPage(): Promise<string> {
  const postsByYear = await getPostsByYear();
  const years = Array.from(postsByYear.keys()).sort((a, b) =>
    b.localeCompare(a),
  );

  if (years.length === 0) {
    return layout(
      `
    <header class="py-4">
      <h1 class="text-4xl font-bold mb-2">Writing</h1>
      <p class="text-lg opacity-70">
        Thoughts on technology, leadership, and life.
      </p>
    </header>

    <div class="py-16 text-center">
      <p class="text-lg opacity-70">No posts published yet &mdash; check back soon.</p>
    </div>
  `,
      {
        title: "Writing - Tiago Luchini",
        description:
          "Blog posts on technology, leadership, and life by Tiago Luchini",
        currentPath: "/posts",
      },
    );
  }

  const postsList = years
    .map((year) => {
      const posts = postsByYear.get(year)!;
      return `
      <div class="mb-10" data-year-group>
        <h2 class="text-2xl font-bold mb-4 text-secondary">${year}</h2>
        <div class="space-y-3">
          ${posts.map((post) => postCard(post)).join("")}
        </div>
      </div>
    `;
    })
    .join("");

  return layout(
    `
    <header class="py-4">
      <h1 class="text-4xl font-bold mb-2">Writing</h1>
      <p class="text-lg opacity-70">
        Thoughts on technology, leadership, and life.
      </p>
    </header>
    
    <div class="flex flex-wrap items-center gap-2 py-4 border-b border-base-300 mb-8">
      <input
        type="search"
        placeholder="Filter posts&hellip;"
        aria-label="Filter posts"
        class="input input-bordered input-sm flex-1 min-w-48 max-w-sm"
        oninput="filterPosts(this.value)"
      >
      <a href="/tags" class="btn btn-ghost btn-sm">
        Browse by tag &rarr;
      </a>
    </div>

    <div id="no-search-results" class="hidden py-8 text-center opacity-70">
      No posts match your filter.
    </div>

    ${postsList}

    <script>
      window.filterPosts = function (query) {
        const q = query.trim().toLowerCase();
        let visible = 0;
        document.querySelectorAll("[data-post-card]").forEach((el) => {
          const match = !q || (el.getAttribute("data-search") || "").includes(q);
          el.classList.toggle("hidden", !match);
          if (match) visible++;
        });
        document.querySelectorAll("[data-year-group]").forEach((group) => {
          group.classList.toggle(
            "hidden",
            !group.querySelector("[data-post-card]:not(.hidden)"),
          );
        });
        const empty = document.getElementById("no-search-results");
        if (empty) empty.classList.toggle("hidden", visible > 0);
      };
    </script>
  `,
    {
      title: "Writing - Tiago Luchini",
      description:
        "Blog posts on technology, leadership, and life by Tiago Luchini",
      currentPath: "/posts",
    },
  );
}

/**
 * Individual post card for the archive (exported for reuse on the
 * homepage, related posts, and series pages)
 */
export function postCard(post: Post): string {
  const searchText = escapeHtml(
    `${post.title} ${post.tags.join(" ")} ${post.excerpt}`.toLowerCase(),
  );

  return `
    <a href="/posts/${post.slug}" class="card bg-base-200 hover:bg-base-300 transition-colors group block" data-post-card data-search="${searchText}">
      <div class="card-body py-4">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          ${
            post.cover
              ? `<img src="${escapeHtml(post.cover)}" alt="" class="w-20 h-20 rounded-lg object-cover shrink-0">
          `
              : ""
          }
          <div class="flex-1">
            <h3 class="font-semibold group-hover:text-secondary transition-colors">
              ${escapeHtml(post.title)}
              ${post.draft ? `<span class="badge badge-sm badge-warning ml-2">draft</span>` : ""}
              ${!post.draft && post.scheduled ? `<span class="badge badge-sm badge-info ml-2">scheduled</span>` : ""}
            </h3>
            <p class="text-sm opacity-60 line-clamp-2 mt-1">${escapeHtml(post.excerpt)}</p>
          </div>
          <div class="flex items-center gap-2 text-sm opacity-50 shrink-0 sm:text-right">
            <time>${formatDate(post.date)}</time>
          </div>
        </div>
        ${
          post.tags && post.tags.length > 0
            ? `
          <div class="flex flex-wrap gap-1 mt-2">
            ${post.tags
              .map(
                (tag) => `
              <span class="badge badge-sm badge-outline opacity-60">${tag}</span>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
      </div>
    </a>
  `;
}

/**
 * Tags page - lists all tags with their posts
 */
export async function tagsPage(): Promise<string> {
  const posts = await loadPosts();
  const tagMap = new Map<string, Post[]>();

  for (const post of posts) {
    for (const tag of post.tags || []) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)!.push(post);
    }
  }

  const sortedTags = Array.from(tagMap.entries()).sort(
    (a, b) => b[1].length - a[1].length,
  );

  return layout(
    `
    <header class="py-4">
      <div class="flex items-center gap-2 mb-4">
        <a href="/posts" class="text-sm opacity-60 hover:opacity-100 transition-opacity">
          &larr; All posts
        </a>
      </div>
      <h1 class="text-4xl font-bold mb-2">Tags</h1>
      <p class="text-lg opacity-70">
        Browse posts by topic.
      </p>
    </header>
    
    <div class="flex flex-wrap gap-2 py-8">
      ${sortedTags
        .map(
          ([tag, tagPosts]) => `
        <a href="/tags/${tag}" class="btn btn-outline gap-2">
          ${tag}
          <span class="badge badge-sm badge-secondary">${tagPosts.length}</span>
        </a>
      `,
        )
        .join("")}
    </div>
  `,
    {
      title: "Tags - Tiago Luchini",
      description: "Browse blog posts by topic",
      currentPath: "/posts",
    },
  );
}

/**
 * Single tag page - lists posts for a specific tag
 */
export async function tagPage(tag: string): Promise<string> {
  const posts = await loadPosts();
  const tagPosts = posts.filter((p) => (p.tags || []).includes(tag));

  if (tagPosts.length === 0) {
    return layout(
      `
      <div class="text-center py-16">
        <h1 class="text-4xl font-bold mb-4">Tag not found</h1>
        <p class="text-lg opacity-70 mb-8">No posts found with tag "${escapeHtml(tag)}"</p>
        <a href="/posts" class="btn btn-primary">Browse all posts</a>
      </div>
    `,
      {
        title: `Tag: ${tag} - Tiago Luchini`,
        currentPath: "/posts",
      },
    );
  }

  return layout(
    `
    <header class="py-4">
      <div class="flex items-center gap-2 mb-4">
        <a href="/tags" class="text-sm opacity-60 hover:opacity-100 transition-opacity">
          &larr; All tags
        </a>
      </div>
      <h1 class="text-4xl font-bold mb-2">
        <span class="opacity-40">#</span>${escapeHtml(tag)}
      </h1>
      <p class="text-lg opacity-70">
        ${tagPosts.length} post${tagPosts.length === 1 ? "" : "s"}
      </p>
    </header>
    
    <div class="py-8 space-y-3">
      ${tagPosts.map((post) => postCard(post)).join("")}
    </div>
  `,
    {
      title: `#${tag} - Tiago Luchini`,
      description: `Blog posts tagged with "${tag}"`,
      currentPath: "/posts",
    },
  );
}

/**
 * Series page - lists all posts in a series in reading order
 */
export async function seriesPage(name: string): Promise<string> {
  const seriesPosts = await getSeriesPosts(name);

  if (seriesPosts.length === 0) {
    return layout(
      `
      <div class="text-center py-16">
        <h1 class="text-4xl font-bold mb-4">Series not found</h1>
        <p class="text-lg opacity-70 mb-8">No posts found in the "${escapeHtml(name)}" series</p>
        <a href="/posts" class="btn btn-primary">Browse all posts</a>
      </div>
    `,
      {
        title: `Series: ${name} - Tiago Luchini`,
        currentPath: "/posts",
      },
    );
  }

  return layout(
    `
    <header class="py-4">
      <div class="flex items-center gap-2 mb-4">
        <a href="/posts" class="text-sm opacity-60 hover:opacity-100 transition-opacity">
          &larr; All posts
        </a>
      </div>
      <h1 class="text-4xl font-bold mb-2">${escapeHtml(name)}</h1>
      <p class="text-lg opacity-70">
        A ${seriesPosts.length}-part series
      </p>
    </header>

    <div class="py-8 space-y-3">
      ${seriesPosts.map((post) => postCard(post)).join("")}
    </div>
  `,
    {
      title: `${name} - Tiago Luchini`,
      description: `All ${seriesPosts.length} parts of the "${name}" series`,
      currentPath: "/posts",
      canonicalPath: `/series/${encodeURIComponent(name)}`,
    },
  );
}
