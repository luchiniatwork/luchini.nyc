import { layout } from "../lib/html.ts";

// Open source project data organized by category
interface Project {
  name: string;
  url: string;
  description: string;
  stars?: number;
}

interface ProjectCategory {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  projects: Project[];
}

const categories: ProjectCategory[] = [
  {
    id: "hodur",
    title: "Hodur Family",
    subtitle: "Domain modeling approach and collection of libraries for Clojure",
    icon: "cube",
    projects: [
      { name: "Hodur Engine", url: "https://github.com/luchiniatwork/hodur-engine", description: "Core engine for domain modeling in Clojure" },
      { name: "Hodur Datomic Plugin", url: "https://github.com/luchiniatwork/hodur-datomic-schema", description: "Adapter for Datomic schemas" },
      { name: "Hodur Spec Plugin", url: "https://github.com/luchiniatwork/hodur-spec-schema", description: "Adapter for clojure.spec schemas" },
      { name: "Hodur Lacinia Plugin", url: "https://github.com/luchiniatwork/hodur-lacinia-schema", description: "Adapter for GraphQL (Lacinia) schemas" },
      { name: "Hodur Contentful Plugin", url: "https://github.com/luchiniatwork/hodur-contentful-schema", description: "Adapter for Contentful CMS schemas" },
      { name: "Hodur Graphviz Plugin", url: "https://github.com/luchiniatwork/hodur-graphviz-schema", description: "Adapter for GraphViz diagrams" },
      { name: "Hodur Visualizer", url: "https://github.com/luchiniatwork/hodur-visualizer-schema", description: "Web visualizer for Hodur schemas" },
    ]
  },
  {
    id: "resilience4clj",
    title: "Resilience4clj Family",
    subtitle: "Functional resilience patterns for Clojure applications",
    icon: "shield",
    projects: [
      { name: "Circuit Breaker", url: "https://github.com/luchiniatwork/resilience4clj-circuitbreaker", description: "Functional implementation of circuit breakers" },
      { name: "Time Limiter", url: "https://github.com/luchiniatwork/resilience4clj-timelimiter", description: "Functional implementation of time limiters" },
      { name: "Retry", url: "https://github.com/luchiniatwork/resilience4clj-retry", description: "Functional implementation of retry on failure" },
      { name: "Cache", url: "https://github.com/luchiniatwork/resilience4clj-cache", description: "Functional implementation of distributed cached calls" },
    ]
  },
  {
    id: "standalone",
    title: "Standalone Projects",
    subtitle: "Independent tools and libraries",
    icon: "package",
    projects: [
      { name: "ContentQL", url: "https://github.com/luchiniatwork/contentql", description: "Access Contentful data using Om Next Queries" },
      { name: "Migrana", url: "https://github.com/luchiniatwork/migrana", description: "Datomic migration tool for controlled database evolution" },
      { name: "Cambada", url: "https://github.com/luchiniatwork/cambada", description: "Packager for Clojure based on deps.edn" },
    ]
  },

  {
    id: "forks",
    title: "Active Forks",
    subtitle: "Maintained forks with improvements",
    icon: "git-branch",
    projects: [
      { name: "garden-watcher", url: "https://github.com/luchiniatwork/garden-watcher", description: "Component that watches and recompiles Garden stylesheets" },
      { name: "hystrix-event-stream-clj", url: "https://github.com/luchiniatwork/hystrix-event-stream-clj", description: "Easy Hystrix event stream output in Clojure" },
    ]
  },
  {
    id: "tools",
    title: "Tools & Toys",
    subtitle: "Utilities and fun projects",
    icon: "wrench",
    projects: [
      { name: "beautiful-md", url: "https://github.com/luchiniatwork/beautiful-md", description: "Docker image for creating beautiful PDFs from markdown" },
      { name: "LazyPP", url: "https://github.com/luchiniatwork/lazypp", description: "The PowerPoint/Keynote of the Lazy Pragmatic Presenter" },
      { name: "emacs.d", url: "https://github.com/luchiniatwork/emacs.d", description: "Personal Emacs configuration" },
    ]
  },
  {
    id: "legacy",
    title: "Legacy & Experiments",
    subtitle: "Older projects and experiments",
    icon: "archive",
    projects: [
      { name: "snapshoter", url: "https://github.com/luchiniatwork/snapshoter", description: "Distributed headless renderer for escaped fragment specification" },
      { name: "Peon", url: "https://github.com/luchiniatwork/peon", description: "Idiomatic Om Next transactions from stateless components" },
      { name: "terra", url: "https://github.com/luchiniatwork/terra", description: "Write Terraform configurations in pure Clojure" },
      { name: "lein-terra", url: "https://github.com/luchiniatwork/lein-terra", description: "Companion Leiningen plugin to terra" },
      { name: "Concordia", url: "https://github.com/luchiniatwork/concordia", description: "Converters for Om Next Queries to GraphQL" },
    ]
  },
];

// Calculate totals
const totalProjects = categories.reduce((sum, cat) => sum + cat.projects.length, 0);
const totalFamilies = categories.filter(c => c.id === "hodur" || c.id === "resilience4clj").length;

export async function openSourcePage(): Promise<string> {
  const currentPath = "/open-source";
  
  return layout(`
    <!-- Hero Section -->
    <section class="py-8">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Open Source</h1>
      <p class="text-lg opacity-80 mb-8 max-w-2xl">
        A collection of libraries, tools, and experiments. 
        Focused on domain modeling, resilience patterns, and developer productivity.
      </p>
      
      <!-- Stats -->
      <div class="flex flex-wrap gap-6 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </div>
          <div>
            <div class="text-2xl font-bold">${totalProjects}</div>
            <div class="text-sm opacity-60">Projects</div>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
          </div>
          <div>
            <div class="text-2xl font-bold">${totalFamilies}</div>
            <div class="text-sm opacity-60">Library Families</div>
          </div>
        </div>
        
        <a href="https://github.com/luchiniatwork" target="_blank" rel="noopener noreferrer" 
           class="ml-auto btn btn-secondary btn-outline gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub
        </a>
      </div>
    </section>
    
    <!-- Featured Project Families -->
    <section class="py-8 border-t border-base-300">
      <h2 class="text-2xl font-bold mb-6">Featured Library Families</h2>
      
      <div class="grid md:grid-cols-2 gap-6">
        ${categories.filter(c => c.id === "hodur" || c.id === "resilience4clj").map(category => `
          <div class="bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-6 border border-secondary/10">
            <div class="flex items-center gap-3 mb-4">
              ${getCategoryIcon(category.id)}
              <div>
                <h3 class="text-xl font-bold">${category.title}</h3>
                <p class="text-sm opacity-70">${category.subtitle}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              ${category.projects.map(project => `
                <a href="${project.url}" target="_blank" rel="noopener noreferrer"
                   class="block bg-base-100/50 rounded-lg p-3 hover:bg-base-100 transition-colors group">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-secondary group-hover:underline">${project.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-40 group-hover:opacity-100"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                  </div>
                  <p class="text-sm opacity-60 mt-1">${project.description}</p>
                </a>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
    
    <!-- Other Categories - Bento Grid -->
    <section class="py-8 border-t border-base-300">
      <h2 class="text-2xl font-bold mb-6">More Projects</h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        ${categories.filter(c => c.id !== "hodur" && c.id !== "resilience4clj").map(category => `
          <div class="bg-base-200 rounded-xl p-5 hover:bg-base-300 transition-colors">
            <div class="flex items-center gap-2 mb-4">
              ${getCategoryIcon(category.id, "sm")}
              <div>
                <h3 class="font-semibold">${category.title}</h3>
                ${category.subtitle ? `<p class="text-xs opacity-60">${category.subtitle}</p>` : ''}
              </div>
            </div>
            
            <ul class="space-y-2">
              ${category.projects.map(project => `
                <li>
                  <a href="${project.url}" target="_blank" rel="noopener noreferrer"
                     class="flex items-center gap-2 text-sm hover:text-secondary transition-colors group">
                    <span class="text-secondary">→</span>
                    <span class="group-hover:underline">${project.name}</span>
                  </a>
                </li>
              `).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    </section>
  `, { 
    title: "Open Source - Tiago Luchini",
    description: "Open source Clojure libraries, tools, and experiments by Tiago Luchini",
    currentPath
  });
}

function getCategoryIcon(categoryId: string, size: "sm" | "md" = "md"): string {
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "16" : "20";
  
  const icons: Record<string, string> = {
    hodur: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z"/><path d="M10 22v-8L2.25 9.15"/><path d="m10 14 11.77-6.87"/></svg>`,
    resilience4clj: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    standalone: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    company: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    forks: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>`,
    tools: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    legacy: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`,
  };
  
  return `<div class="${sizeClass} rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">${icons[categoryId] || icons.standalone}</div>`;
}
