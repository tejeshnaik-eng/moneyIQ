const fs = require('fs');

const file = 'src/components/modules/QuantRiskModule.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/style=\{\{ width: \\\`\\\$\{(.*?)\}%\\\` \}\}/g, 'style={{ width: `${$1}%` }}');
c = c.replace(/title=\{\\\`Equity: \\\$\{(.*?)\}%\\\`\}/g, 'title={`Equity: ${$1}%`}');
c = c.replace(/title=\{\\\`Debt: \\\$\{(.*?)\}%\\\`\}/g, 'title={`Debt: ${$1}%`}');
c = c.replace(/title=\{\\\`Gold: \\\$\{(.*?)\}%\\\`\}/g, 'title={`Gold: ${$1}%`}');

c = c.replace(/className=\{\\\`(.*?)\\\`\}/g, 'className={`$1`}');

fs.writeFileSync(file, c);
console.log('Fixed JSX syntax in QuantRiskModule');
