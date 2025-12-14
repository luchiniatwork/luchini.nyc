/**
 * HTML templating utilities for server-side rendering with HTMX
 */

export interface LayoutOptions {
  title?: string;
  description?: string;
  author?: string;
  currentPath?: string;
}

const defaultOptions: LayoutOptions = {
  title: "Tiago Luchini",
  description: "CTO, Digital Product Innovation Strategist, Business Leader, and Engineer",
  author: "Tiago Luchini",
  currentPath: "/",
};

/**
 * Base HTML layout wrapper
 */
export function layout(content: string, options: LayoutOptions = {}): string {
  const { title, description, author, currentPath } = { ...defaultOptions, ...options };
  
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="${author}">
  <meta name="keywords" content="Technology, Leadership, Clojure, Software Engineering, CTO">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://luchini.nyc">
  <meta property="og:image" content="https://luchini.nyc/img/avatar.jpg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@tiagoluchini">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/img/ico/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/img/ico/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/img/ico/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/img/ico/favicon-16x16.png">
  <link rel="manifest" href="/img/ico/manifest.json">
  <meta name="theme-color" content="#110838">
  
  <!-- RSS Feed -->
  <link rel="alternate" type="application/rss+xml" title="Tiago Luchini" href="/feed.xml">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="/output.css">
  
  <!-- HTMX -->
  <script src="https://unpkg.com/htmx.org@2.0.4" defer></script>
</head>
<body class="min-h-screen bg-base-100 text-base-content" hx-boost="true">
  <!-- Loading indicator -->
  <div id="loading-indicator" class="htmx-indicator fixed top-0 left-0 right-0 z-50">
    <div class="h-1 bg-secondary animate-pulse"></div>
  </div>
  
  <!-- Header (outside container for full-width sticky) -->
  ${header(currentPath)}
  
  <div class="container mx-auto px-4 max-w-4xl">
    <!-- Main content with transition -->
    <main id="main-content" class="py-8 transition-opacity duration-200">
      ${content}
    </main>
    
    <!-- Footer -->
    ${footer()}
  </div>
  
  <script>
    // HTMX event handlers for smooth transitions
    document.body.addEventListener('htmx:beforeSwap', function(evt) {
      document.getElementById('main-content')?.classList.add('opacity-50');
    });
    document.body.addEventListener('htmx:afterSwap', function(evt) {
      document.getElementById('main-content')?.classList.remove('opacity-50');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateActiveNavLink();
    });
    
    // Update active navigation link based on current URL
    function updateActiveNavLink() {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('nav a[href]');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === '/' 
          ? currentPath === '/' 
          : currentPath.startsWith(href);
        
        if (isActive) {
          link.classList.add('btn-active', 'text-secondary');
        } else {
          link.classList.remove('btn-active', 'text-secondary');
        }
      });
    }
  </script>
</body>
</html>`;
}

/**
 * Header with navigation
 */
export function header(currentPath: string = "/"): string {
  const navLinks = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/open-source", label: "Open Source", icon: "code" },
    { href: "/awards", label: "Awards", icon: "trophy" },
  ];
  
  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath?.startsWith(href);
  };
  
  return `
    <header class="sticky top-0 z-40 bg-base-100 shadow-sm">
      <div class="container mx-auto px-4 max-w-4xl py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Logo/Name -->
          <a href="/" class="text-xl font-bold hover:text-secondary transition-colors">
            Tiago Luchini
          </a>
          
          <!-- Navigation and Social -->
          <div class="flex flex-wrap items-center gap-4">
            <nav class="flex flex-wrap items-center gap-1">
              ${navLinks.map(link => `
                <a href="${link.href}" 
                   class="btn btn-ghost btn-sm ${isActive(link.href) ? 'btn-active text-secondary' : ''}"
                   hx-indicator="#loading-indicator"
                   hx-target="#main-content"
                   hx-select="#main-content"
                   hx-swap="innerHTML transition:true">
                  ${link.label}
                </a>
              `).join("")}
            </nav>
            
            <!-- Social links -->
            <div class="flex items-center gap-1 border-l border-base-300 pl-4">
              <a href="https://twitter.com/tiagoluchini" class="btn btn-ghost btn-sm btn-square" aria-label="Twitter" target="_blank" rel="noopener noreferrer" hx-boost="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com/luchiniatwork" class="btn btn-ghost btn-sm btn-square" aria-label="GitHub" target="_blank" rel="noopener noreferrer" hx-boost="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com/in/tiagoluchini" class="btn btn-ghost btn-sm btn-square" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" hx-boost="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="mailto:tiago@luchini.nyc" class="btn btn-ghost btn-sm btn-square" aria-label="Email" hx-boost="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>`;
}

/**
 * Footer component
 */
export function footer(): string {
  const year = new Date().getFullYear();
  
  return `
    <footer class="py-8 border-t border-base-300">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Social links -->
        <div class="flex items-center gap-2">
          <a href="https://twitter.com/tiagoluchini" class="btn btn-ghost btn-sm btn-square" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://github.com/luchiniatwork" class="btn btn-ghost btn-sm btn-square" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://linkedin.com/in/tiagoluchini" class="btn btn-ghost btn-sm btn-square" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="mailto:tiago@luchini.nyc" class="btn btn-ghost btn-sm btn-square" aria-label="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
          </a>
        </div>
        
        <!-- Copyright -->
        <p class="text-sm opacity-60">
          &copy; ${year} Tiago Luchini
        </p>
      </div>
    </footer>`;
}

/**
 * Simple navigation for internal pages (deprecated - using header now)
 */
export function nav(currentPath: string = "/"): string {
  // Kept for backwards compatibility, but header() is now preferred
  return "";
}

/**
 * Card component for content sections
 */
export function card(title: string, content: string, className: string = ""): string {
  return `
    <div class="card bg-base-200 ${className}">
      <div class="card-body">
        <h2 class="card-title">${title}</h2>
        ${content}
      </div>
    </div>`;
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

/**
 * Reading time estimate
 */
export function readingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
