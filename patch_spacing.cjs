const fs = require('fs');
const glob = require('fs').readdirSync;
const path = require('path');

const dir = 'src/components/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const p = path.join(dir, file);
  let c = fs.readFileSync(p, 'utf8');
  
  // Replace `px-4 md:px-0` or `px-4 lg:px-0` or similar with `px-6 md:px-10`
  c = c.replace(/px-4 (?:md|lg|xl):px-0/g, 'px-6 lg:px-10');
  
  // Also look for `px-4 md:px-0` without spacing (just in case)
  
  fs.writeFileSync(p, c);
}

// Let's also check OverviewModule just to be sure it has good padding
let overview = fs.readFileSync(path.join(dir, 'OverviewModule.tsx'), 'utf8');
overview = overview.replace(/px-4 md:px-0/g, 'px-6 lg:px-10');
overview = overview.replace(/px-4 lg:px-0/g, 'px-6 lg:px-10');
fs.writeFileSync(path.join(dir, 'OverviewModule.tsx'), overview);

// DashboardShell check
let shell = fs.readFileSync('src/components/dashboard/DashboardShell.tsx', 'utf8');
if (!shell.includes('px-6 md:px-8')) {
   // Let's add padding to the main element itself so everything naturally breathes
   // `main className="flex-1 w-full mx-auto p-0 max-w-none"`
   shell = shell.replace(/main className="flex-1 w-full mx-auto p-0 max-w-none"/, 'main className="flex-1 w-full mx-auto p-4 md:p-8 max-w-none"');
   fs.writeFileSync('src/components/dashboard/DashboardShell.tsx', shell);
}

console.log('Padding applied.');
