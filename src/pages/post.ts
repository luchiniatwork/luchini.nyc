import { layout, readingTime, escapeHtml } from "../lib/html.ts";
import {
  getPost,
  loadPosts,
  getSeriesPosts,
  formatDate,
  type Post,
} from "../lib/posts.ts";

/**
 * Individual blog post page
 */
export async function postPage(slug: string): Promise<string | null> {
  const post = await getPost(slug);

  if (!post) {
    return null;
  }

  // Get adjacent posts for navigation
  const posts = await loadPosts();
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevPost =
    currentIndex < posts.length - 1 ? (posts[currentIndex + 1] ?? null) : null;
  const nextPost = currentIndex > 0 ? (posts[currentIndex - 1] ?? null) : null;

  // Series context when the post belongs to one
  const seriesPosts = post.series ? await getSeriesPosts(post.series) : null;

  return layout(
    `
    <article class="max-w-none">
      <header class="py-4">
        <div class="mb-6">
          <a href="/posts" class="text-sm opacity-60 hover:opacity-100 transition-opacity">
            &larr; All posts
          </a>
        </div>
        
        <h1 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">${escapeHtml(post.title)}</h1>
        
        <div class="flex flex-wrap items-center gap-4 text-sm opacity-60">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span>•</span>
          <span>${readingTime(post.content)}</span>
          ${
            post.updated
              ? `
          <span>•</span>
          <span>Updated <time datetime="${post.updated}">${formatDate(post.updated)}</time></span>
          `
              : ""
          }
          ${
            post.draft
              ? `
          <span>•</span>
          <span class="badge badge-warning badge-sm">draft</span>
          `
              : ""
          }
          
          ${
            post.tags && post.tags.length > 0
              ? `
            <span>•</span>
            <div class="flex flex-wrap gap-1">
              ${post.tags
                .map(
                  (tag) => `
                <a href="/tags/${tag}" class="badge badge-outline badge-sm hover:badge-secondary transition-colors">
                  ${tag}
                </a>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </header>

      ${
        post.cover
          ? `<img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.title)}" class="rounded-xl shadow-lg w-full object-cover max-h-96">
        `
          : ""
      }

      <div class="prose prose-invert prose-lg max-w-none py-8 border-t border-base-300">
        ${post.html}
      </div>

      ${seriesBlock(post, seriesPosts)}

      ${postNavigation(prevPost, nextPost)}
    </article>
  `,
    {
      title: `${post.title} - Tiago Luchini`,
      description: post.excerpt,
      currentPath: "/posts",
      canonicalPath: `/posts/${post.slug}`,
      ogType: "article",
      ogImage: post.cover,
      publishedTime: post.date,
      tags: post.tags,
    },
  );
}

/**
 * Series index block shown on posts that belong to a series
 */
function seriesBlock(post: Post, seriesPosts: Post[] | null): string {
  if (!post.series || !seriesPosts || seriesPosts.length === 0) {
    return "";
  }

  const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug);

  return `
    <aside class="my-8 card bg-base-200">
      <div class="card-body py-4">
        <h2 class="text-sm font-semibold opacity-70 mb-2">
          Part ${currentIndex + 1} of ${seriesPosts.length} in the
          <a href="/series/${encodeURIComponent(post.series)}" class="link link-secondary">${escapeHtml(post.series)}</a>
          series
        </h2>
        <ol class="list-decimal list-inside space-y-1">
          ${seriesPosts
            .map((p) => {
              const isCurrent = p.slug === post.slug;
              const title = escapeHtml(p.title);
              return `
            <li class="${isCurrent ? "font-semibold text-secondary" : ""}">
              ${
                isCurrent
                  ? title
                  : `<a href="/posts/${p.slug}" class="hover:text-secondary transition-colors">${title}</a>`
              }
            </li>
              `;
            })
            .join("")}
        </ol>
      </div>
    </aside>
  `;
}

/**
 * Navigation between posts
 */
function postNavigation(prevPost: Post | null, nextPost: Post | null): string {
  if (!prevPost && !nextPost) {
    return `
      <div class="py-8 border-t border-base-300">
        <a href="/posts" class="btn btn-outline">
          &larr; Back to all posts
        </a>
      </div>
    `;
  }

  return `
    <nav class="py-8 border-t border-base-300">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${
          prevPost
            ? `
          <a href="/posts/${prevPost.slug}" class="card bg-base-200 hover:bg-base-300 transition-colors group">
            <div class="card-body py-4">
              <span class="text-sm opacity-50">&larr; Older</span>
              <span class="font-medium group-hover:text-secondary transition-colors line-clamp-2">
                ${prevPost.title}
              </span>
            </div>
          </a>
        `
            : "<div></div>"
        }
        
        ${
          nextPost
            ? `
          <a href="/posts/${nextPost.slug}" class="card bg-base-200 hover:bg-base-300 transition-colors group text-right">
            <div class="card-body py-4">
              <span class="text-sm opacity-50">Newer &rarr;</span>
              <span class="font-medium group-hover:text-secondary transition-colors line-clamp-2">
                ${nextPost.title}
              </span>
            </div>
          </a>
        `
            : "<div></div>"
        }
      </div>
    </nav>
  `;
}
