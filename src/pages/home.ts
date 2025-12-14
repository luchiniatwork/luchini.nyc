import { layout } from "../lib/html.ts";

/**
 * Homepage
 */
export async function homePage(): Promise<string> {
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
            <a href="/open-source" class="btn btn-outline">
              Open source
            </a>
            <a href="/awards" class="btn btn-outline">
              Awards
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
    
    <!-- About section -->
    <section class="py-8 border-t border-base-300">
      <h2 class="text-2xl font-bold mb-6">About</h2>
      
      <p class="text-lg opacity-80 mb-4 leading-relaxed">
        I'm a CTO, Digital Product Innovation Strategist, and Engineer with 
        credits including leading Virgin America's award-winning digital 
        transformation, Apple's "Today at Apple" program, and serving as 
        Lead Architect for YouTube Music and YouTube TV.
      </p>
      
      <p class="text-lg opacity-80 mb-8 leading-relaxed">
        Recipient of <strong>4 Cannes Lions</strong> (including Titanium and Grand Prix), 
        <strong>5 Webby Awards</strong>, and numerous other industry recognitions for 
        work spanning Fortune 500 companies and high-growth startups.
      </p>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="bg-base-200 rounded-xl p-5 hover:bg-base-300 transition-colors">
          <h3 class="font-semibold mb-4">Career Highlights</h3>
          <ul class="space-y-2">
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
        </div>
        
        <div class="bg-base-200 rounded-xl p-5 hover:bg-base-300 transition-colors">
          <h3 class="font-semibold mb-4">Get in Touch</h3>
          <p class="opacity-70 mb-4">Open to conversations about:</p>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <span class="text-secondary">→</span>
              <span>Advisory & investment opportunities</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-secondary">→</span>
              <span>Speaking engagements</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-secondary">→</span>
              <span>Podcasts & interviews</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-secondary">→</span>
              <span>Engineering leadership</span>
            </li>
          </ul>
          <div class="flex mt-4">
            <a href="mailto:tiago@luchini.nyc" class="btn btn-secondary ml-auto">
              Say hello
            </a>
          </div>
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


