const fs = require('fs');
let content = fs.readFileSync('src/components/modules/PortfolioAnalyzer.tsx', 'utf8');

// Remove border border-[#222] from all instances of bg-[#161616] p-6 rounded-xl
content = content.replace(/className="bg-\[\#161616\] border border-\[\#222\] p-6 rounded-xl"/g, 'className="bg-[#161616] p-6 rounded-xl"');

fs.writeFileSync('src/components/modules/PortfolioAnalyzer.tsx', content);
