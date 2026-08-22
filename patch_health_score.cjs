const fs = require('fs');

const file = 'src/components/modules/OverviewModule.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  /\{analysis\?\.healthScore \|\| 80\}/g,
  `{analysis?.healthScore || profile?.overallScore || '--'}`
);

c = c.replace(
  /\{analysis\?\.healthBand \|\| 'Excellent'\}/g,
  `{analysis?.healthBand || profile?.keyTrait || 'Assessment Pending'}`
);

fs.writeFileSync(file, c);
console.log('OverviewModule health score patched.');
