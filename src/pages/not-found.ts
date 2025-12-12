import { layout } from "../lib/html.ts";

export function notFoundPage(): string {
  return layout(`
    <div class="text-center py-20">
      <h1 class="text-9xl font-bold mb-4 opacity-10">404</h1>
      <h2 class="text-2xl font-bold mb-4">Page not found</h2>
      <p class="text-lg opacity-60 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="flex justify-center gap-3">
        <a href="/" class="btn btn-secondary">
          Go Home
        </a>
        <a href="/posts" class="btn btn-outline">
          Read Blog
        </a>
      </div>
    </div>
  `, { 
    title: "404 - Page Not Found",
    currentPath: ""
  });
}
