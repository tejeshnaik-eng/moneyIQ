const fs = require('fs');
const file = 'src/components/landing/LandingPage.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldHeroRegex = /<p className="text-\[15px\].*?<\/p>/;
const newHeroText = `<div className="text-[14px] md:text-[16px] text-black/70 max-w-3xl mx-auto leading-relaxed font-medium mb-12 space-y-4">
              <p>
                Financial literacy in India is growing, but financial confidence is not. Students begin SIPs without understanding risk, professionals struggle to manage investments spread across multiple platforms, and first-time investors often rely on social media hype instead of data-driven decisions.
              </p>
              <p>
                FinSight is an innovative, user-centric platform that transforms complex financial and market data into clear, personalized, and actionable insights. From risk profiling and portfolio consolidation to goal-based planning, we empower you to make informed financial decisions with confidence.
              </p>
            </div>`;

c = c.replace(oldHeroRegex, newHeroText);

fs.writeFileSync(file, c);
console.log('Landing page text updated.');
