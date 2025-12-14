import { layout } from "../lib/html.ts";

// Award data organized by category
const projectAwards = [
    { year: "2020", award: "Fast Company Innovation", achievement: "Best Design of Latin America", project: "Minha Claro"},
    { year: "2018", award: "Digiday", achievement: "Best Brand Platform", project: "Givewith" },
  { year: "2018", award: "CES Innovation Awards", achievement: "Software and Mobile Apps", project: "Philz Coffee" },
  { year: "2018", award: "W3 Awards", achievement: "Best User Experience for Mobile Sites & Apps", project: "Philz Coffee" },
  { year: "2018", award: "HOW International Design Awards", achievement: "Website", project: "Aesop" },
  { year: "2018", award: "Design Week", achievement: "Website", project: "Aesop" },
  { year: "2017", award: "The One Show", achievement: "Bronze Pencil Award", project: "Virgin America Travel App" },
  { year: "2017", award: "CES Innovation Award Honoree", achievement: "", project: "Virgin America Mobile App" },
  { year: "2017", award: "Webby Awards", achievement: "Best Practices & Best Travel App", project: "Virgin America app" },
  { year: "2017", award: "Andy Awards", achievement: "Mobile App, Digital Design", project: "Virgin America app" },
  { year: "2016", award: "Pixel Awards", achievement: "People's Champ & Best Responsive Design", project: "Virgin America website" },
  { year: "2016", award: "CES Innovation Awards", achievement: "Software and Mobile Apps", project: "Virgin America app" },
  { year: "2015", award: "The One Show", achievement: "Merit Award", project: "Virgin America website" },
  { year: "2015", award: "Webby Awards", achievement: "Best Visual Design", project: "Virgin America website" },
  { year: "2015", award: "Webby Awards", achievement: "Best User Interface", project: "Virgin America website" },
  { year: "2015", award: "Webby Awards", achievement: "Best Practices", project: "Virgin America website" },
  { year: "2015", award: "Cannes Lions", achievement: "Bronze Lion Award", project: "Virgin America" },
  { year: "2015", award: "Clio Awards", achievement: "Bronze Clio Award", project: "Virgin America" },
  { year: "2015", award: "Digiday Award", achievement: "Best Brand Platform", project: "Virgin America" },
  { year: "2015", award: "Pixel Awards", achievement: "News & Publications Finalist", project: "TMZ" },
  { year: "2014", award: "User Experience Awards", achievement: "Grand Prize - Most Significant Industry Evolution", project: "Virgin America" },
  { year: "2014", award: "London International Awards", achievement: "Silver Medal", project: "Virgin America" },
];

const companyAwards = [
  { year: "2019", award: "AdAge's A-List", highlight: true },
  { year: "2019", award: "Fast Company's 10 Most Innovative Companies", highlight: true },
  { year: "2018", award: "Digiday, Agency of the Year", highlight: true },
  { year: "2018", award: "Cannes Lions, Grand Prix", highlight: true },
  { year: "2018", award: "Cannes Lions, Titanium", highlight: true },
  { year: "2018", award: "AdAge's A-List", highlight: false },
  { year: "2017", award: "Forbes - Next Big Thing", highlight: false },
  { year: "2017", award: "Inc 5000 - #295", highlight: false },
  { year: "2017", award: "Fast Company's 10 Most Innovative Companies", highlight: false },
  { year: "2017", award: "AdAge's A-List", highlight: false },
  { year: "2017", award: "Fast Company Innovation by Design, Websites", highlight: false },
  { year: "2017", award: "Webby Awards, Professional Services", highlight: false },
  { year: "2016", award: "DUMBO Improvement District - DUMBO Dozen", highlight: false },
  { year: "2016", award: "Advertising Age's 'Agencies to Watch'", highlight: false },
  { year: "2014", award: "Forrester 'A Model to Follow'", highlight: false },
];

// Featured/highlight awards for the hero section
const featuredAwards = [
  { icon: "lion", count: "4", label: "Cannes Lions", detail: "Including Titanium & Grand Prix" },
  { icon: "webby", count: "5", label: "Webby Awards", detail: "Best Design & UX" },
  { icon: "ces", count: "3", label: "CES Innovation", detail: "Awards & Honoree" },
];

export async function awardsPage(): Promise<string> {
  const currentPath = "/awards";
  
  return layout(`
    <!-- Hero Section -->
    <section class="py-8">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Awards & Recognition</h1>
      <p class="text-lg opacity-80 mb-8 max-w-2xl">
        Recognition for work spanning digital transformation, product innovation, 
        and user experience across Fortune 500 companies and high-growth startups.
      </p>
      
      <!-- Featured Stats - Bento Grid -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        ${featuredAwards.map(award => `
          <div class="bg-base-200 rounded-xl p-6 text-center hover:bg-base-300 transition-colors">
            <div class="text-4xl md:text-5xl font-bold text-secondary mb-2">${award.count}</div>
            <div class="font-semibold">${award.label}</div>
            <div class="text-sm opacity-60 mt-1">${award.detail}</div>
          </div>
        `).join("")}
      </div>
    </section>
    
    <!-- Company Awards Section -->
    <section class="py-8 border-t border-base-300">
      <h2 class="text-2xl font-bold mb-6">Company Recognition</h2>
      <p class="text-sm opacity-70 mb-6">Awards received during tenure at Work & Co</p>
      
      <!-- Highlight Awards - Cards -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${companyAwards.filter(a => a.highlight).map(award => `
          <div class="bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-5 border border-secondary/20">
            <div class="text-secondary font-mono text-sm mb-2">${award.year}</div>
            <div class="font-semibold">${award.award}</div>
          </div>
        `).join("")}
      </div>
      
      <!-- Other Company Awards - Compact List -->
      <div class="bg-base-200 rounded-xl p-6">
        <h3 class="text-sm font-semibold opacity-70 mb-4 uppercase tracking-wide">More Recognition</h3>
        <div class="grid md:grid-cols-2 gap-x-8 gap-y-2">
          ${companyAwards.filter(a => !a.highlight).map(award => `
            <div class="flex items-center gap-3 py-2 border-b border-base-300 last:border-0">
              <span class="text-secondary font-mono text-sm w-12 shrink-0">${award.year}</span>
              <span class="text-sm">${award.award}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    
    <!-- Project Awards Section -->
    <section class="py-8 border-t border-base-300">
      <h2 class="text-2xl font-bold mb-6">Project Awards</h2>
      <p class="text-sm opacity-70 mb-6">Recognition for specific projects and products</p>
      
      <!-- Group by project for better organization -->
      ${renderProjectAwardsByProject()}
    </section>
  `, { 
    title: "Awards - Tiago Luchini",
    description: "Awards and recognition including Cannes Lions, Webby Awards, and CES Innovation Awards",
    currentPath
  });
}

function renderProjectAwardsByProject(): string {
  // Group awards by project
  const projectGroups: Record<string, typeof projectAwards> = {};
  
  projectAwards.forEach(award => {
    const key = award.project;
    if (!projectGroups[key]) {
      projectGroups[key] = [];
    }
    projectGroups[key].push(award);
  });
  
  // Sort projects by number of awards (descending)
  const sortedProjects = Object.entries(projectGroups)
    .sort((a, b) => b[1].length - a[1].length);
  
  return `
    <div class="grid md:grid-cols-2 gap-4">
      ${sortedProjects.map(([project, awards]) => `
        <div class="bg-base-200 rounded-xl p-5 hover:bg-base-300 transition-colors">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">${project}</h3>
            <span class="badge badge-secondary badge-sm">${awards.length} award${awards.length > 1 ? 's' : ''}</span>
          </div>
          <ul class="space-y-2">
            ${awards.map(award => `
              <li class="flex items-start gap-2 text-sm">
                <span class="text-secondary font-mono shrink-0">${award.year}</span>
                <span class="opacity-80">${award.award}${award.achievement ? ` - ${award.achievement}` : ''}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  `;
}
