const fs = require('fs');
let content = fs.readFileSync('src/components/modules/PortfolioAnalyzer.tsx', 'utf8');

// Remove border from the progress bar
content = content.replace(/className="w-full bg-\[\#111111\] border border-\[\#222\] h-1\.5 rounded-full overflow-hidden"/g, 'className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"');

fs.writeFileSync('src/components/modules/PortfolioAnalyzer.tsx', content);
