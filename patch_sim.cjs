const fs = require('fs');

const file = 'src/components/modules/MarketSimModule.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Remove all border classes
c = c.replace(/\bborder-[a-z0-9\/\[\]#-]+\b/g, ''); // removes border-b, border-[#111916], border-[#6E7C75]/20, border-[#20EFA0]/20
c = c.replace(/\bborder\b/g, ''); // removes standalone "border"

// 2. Increase rounding
c = c.replace(/\brounded-lg\b/g, 'rounded-[24px]');
c = c.replace(/\brounded-md\b/g, 'rounded-[20px]');
c = c.replace(/\brounded\b/g, 'rounded-2xl');

// Clean up extra spaces inside classNames
c = c.replace(/className="([^"]*)"/g, (match, p1) => {
  return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
});
c = c.replace(/className=\{`([^`]*)`\}/g, (match, p1) => {
  return `className={\`${p1.replace(/\s+/g, ' ').trim()}\`}`;
});

fs.writeFileSync(file, c);
console.log('Removed borders and increased rounding in MarketSimModule');
