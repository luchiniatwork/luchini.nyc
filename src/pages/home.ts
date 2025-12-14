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
            Co-founder & CTO at <a href="https://theoai.ai" target="_blank" class="link link-secondary">Theo Ai</a>, 
            building AI-powered litigation prediction. Previously Partner at 
            <a href="https://work.co" target="_blank" class="link link-secondary">Work & Co</a>, where I led 
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
        I'm a 5x Founder/CTO, Digital Product Innovation Strategist, and Engineer with 
        credits including leading <a href="https://work.co/clients/virgin-america/" target="_blank" class="link link-secondary">Virgin America</a>'s award-winning digital 
        transformation, <a href="https://work.co/clients/apple/" target="_blank" class="link link-secondary">Apple</a>'s "Today at Apple" program, and serving as 
        Lead Architect for <a href="https://music.youtube.com" target="_blank" class="link link-secondary">YouTube Music</a> and <a href="https://tv.youtube.com" target="_blank" class="link link-secondary">YouTube TV</a>.
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
          Currently serving as Co-founder & CTO at <a href="https://theoai.ai" target="_blank" class="link link-secondary"><strong>Theo Ai</strong></a>, 
          an AI-powered litigation prediction platform helping legal teams forecast case outcomes. 
          We've raised over $10M from investors including NextView Ventures, Run Ventures, and Collide Capital, 
          and built a GC Advisory Board with leaders from Bristol Myers Squibb, GoDaddy, DocuSign, and HP.
        </p>
        
        <p>
          Previously Co-founder & CTO at <a href="https://www.deeporigin.com" target="_blank" class="link link-secondary"><strong>Deep Origin</strong></a> (biotech), 
          CTO at <a href="https://www.odeko.com" target="_blank" class="link link-secondary"><strong>Odeko</strong></a> ($250M funded), 
          Head of Digital Transformation at <a href="https://www.viasat.com" target="_blank" class="link link-secondary"><strong>Viasat</strong></a> (leading 90+ engineers), and 
          Partner at <a href="https://work.co" target="_blank" class="link link-secondary"><strong>Work & Co</strong></a> where I grew the technology practice 
          from scratch to 110+ people.
        </p>
        
        <p>
          My journey has taken me from Brazil to Finland, China, and the United States. 
          At <a href="https://www.nokia.com" target="_blank" class="link link-secondary">Nokia</a> in Beijing, I led R&D centers and learned that effective leadership 
          transcends language and culture.
        </p>
        
        <p>
          When I'm not building products, I'm an ultra-distance runner, board game 
          enthusiast, and aspiring improv performer in the San Francisco Bay Area.
        </p>
      </div>
    </section>
  `, { 
    title: "Tiago Luchini - Co-founder & CTO at Theo Ai",
    description: "Co-founder & CTO at Theo Ai. Previously Deep Origin, Odeko, Viasat, Work & Co. 20+ years building products and leading global engineering teams.",
    currentPath: "/"
  });
}
