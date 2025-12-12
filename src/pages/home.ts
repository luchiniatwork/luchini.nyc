import { layout, card, readingTime } from "../lib/html.ts";
import { loadPosts, formatDate, type Post } from "../lib/posts.ts";

/**
 * Homepage
 */
export async function homePage(): Promise<string> {
  const posts = await loadPosts();
  const recentPosts = posts.slice(0, 3);
  
  return layout(`
    <!-- Hero section -->
    <section class="py-8">
      <div class="grid md:grid-cols-3 gap-8 items-start">
        <div class="md:col-span-2">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Building products,<br>
            <span class="text-secondary">leading teams</span>
          </h1>
          <p class="text-lg opacity-80 mb-6 leading-relaxed">
            CTO at Deep Origin. Previously Partner at Work & Co, where I led 
            award-winning digital transformations for Apple, Google, Virgin America, 
            and more. 20+ years bridging business and technology across 4 continents.
          </p>
          <div class="flex flex-wrap gap-3">
            <a href="/posts" class="btn btn-secondary">
              Read my writing
            </a>
            <a href="/open-source" class="btn btn-outline">
              Open source
            </a>
          </div>
        </div>
        
        <div class="hidden md:block">
          <img 
            src="/img/avatar.jpg" 
            alt="Tiago Luchini" 
            class="rounded-xl shadow-lg w-full aspect-square object-cover"
          >
        </div>
      </div>
    </section>
    
    <!-- Recent posts -->
    <section class="py-8 border-t border-base-300">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Recent Writing</h2>
        <a href="/posts" class="btn btn-ghost btn-sm">
          View all &rarr;
        </a>
      </div>
      
      <div class="grid gap-4">
        ${recentPosts.map(post => recentPostCard(post)).join("")}
      </div>
    </section>
    
    <!-- About section -->
    <section class="py-8 border-t border-base-300">
      <h2 class="text-2xl font-bold mb-6">About</h2>
      
      <div class="prose prose-invert max-w-none">
        <p>
          I'm a CTO, Digital Product Innovation Strategist, and Engineer with 
          credits including leading Virgin America's award-winning digital 
          transformation, Apple's "Today at Apple" program, and serving as 
          Lead Architect for YouTube Music and YouTube TV.
        </p>
        
        <p>
          Recipient of <strong>4 Cannes Lions</strong> (including Titanium and Grand Prix), 
          <strong>5 Webby Awards</strong>, and numerous other industry recognitions for 
          work spanning Fortune 500 companies and high-growth startups.
        </p>
        
        <div class="grid sm:grid-cols-2 gap-6 not-prose mt-8">
          ${card("Career Highlights", `
            <ul class="text-sm space-y-2 mt-2">
              <li class="flex items-start gap-2">
                <span class="text-secondary">→</span>
                <span>Built and led global teams of 100+ engineers</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-secondary">→</span>
                <span>Delivered products used by millions daily</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-secondary">→</span>
                <span>Speaker at Clojure/conj, Heart of Clojure</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-secondary">→</span>
                <span>Dual MBA from Columbia & London Business School</span>
              </li>
            </ul>
          `)}
          
          ${card("Get in Touch", `
            <p class="text-sm opacity-80 mt-2 mb-3">
              Open to conversations about:
            </p>
            <ul class="text-sm space-y-1">
              <li>• Advisory & investment opportunities</li>
              <li>• Speaking engagements</li>
              <li>• Podcasts & interviews</li>
              <li>• Engineering leadership</li>
            </ul>
            <a href="mailto:tiago@luchini.nyc" class="btn btn-secondary btn-sm mt-4">
              Say hello
            </a>
          `)}
        </div>
      </div>
    </section>
    
    <!-- Background section -->
    <section class="py-8 border-t border-base-300">
      <h2 class="text-2xl font-bold mb-6">Background</h2>
      
      <div class="prose prose-invert max-w-none">
        <p>
          Currently serving as Chief Technology Officer at <strong>Deep Origin</strong>, 
          a biotech startup where I built a world-class engineering team and delivered 
          an MVP in under 3 months.
        </p>
        
        <p>
          Previously CTO at <strong>Odeko</strong> ($250M funded), Head of Digital 
          Transformation at <strong>Viasat</strong> (leading 90+ engineers), and 
          Partner at <strong>Work & Co</strong> where I grew the technology practice 
          from scratch to 110+ people.
        </p>
        
        <p>
          My journey has taken me from Brazil to Finland, China, and the United States. 
          At Nokia in Beijing, I led R&D centers and learned that effective leadership 
          transcends language and culture.
        </p>
        
        <p class="text-sm opacity-70 mt-6">
          When I'm not building products, I'm an ultra-distance runner, board game 
          enthusiast, and amateur cortado connoisseur in the Hudson Valley.
        </p>
      </div>
    </section>
  `, { 
    title: "Tiago Luchini - CTO & Digital Product Leader",
    description: "CTO at Deep Origin. Previously Partner at Work & Co. 20+ years building products and leading global engineering teams.",
    currentPath: "/"
  });
}

/**
 * Recent post card for homepage
 */
function recentPostCard(post: Post): string {
  return `
    <a href="/posts/${post.slug}" class="card bg-base-200 hover:bg-base-300 transition-colors group">
      <div class="card-body py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 class="font-semibold group-hover:text-secondary transition-colors">
            ${post.title}
          </h3>
          <div class="flex items-center gap-3 text-sm opacity-60 shrink-0">
            <span>${readingTime(post.content)}</span>
            <span>•</span>
            <time>${formatDate(post.date)}</time>
          </div>
        </div>
        <p class="text-sm opacity-70 line-clamp-2 mt-1">${post.excerpt}</p>
      </div>
    </a>
  `;
}
