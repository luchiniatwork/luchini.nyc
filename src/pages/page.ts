import { layout } from "../lib/html.ts";
import { getPage } from "../lib/posts.ts";

/**
 * Generic static page renderer
 */
export async function staticPage(slug: string): Promise<string | null> {
  const page = await getPage(slug);
  
  if (!page) {
    return null;
  }
  
  // Determine current path for navigation highlighting
  const currentPath = `/${slug}`;
  
  return layout(`
    <article class="max-w-none">
      <header class="py-4">
        <h1 class="text-4xl font-bold mb-2">${page.title}</h1>
      </header>
      
      <div class="prose prose-invert prose-lg max-w-none py-8 border-t border-base-300">
        ${page.html}
      </div>
    </article>
  `, { 
    title: `${page.title} - Tiago Luchini`,
    description: `${page.title} - Tiago Luchini's personal website`,
    currentPath
  });
}
