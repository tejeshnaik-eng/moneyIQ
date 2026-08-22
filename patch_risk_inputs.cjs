const fs = require('fs');
const file = 'src/components/modules/RiskProfilingModule.tsx';
let c = fs.readFileSync(file, 'utf8');

// Replace all instances of inputs having text color issues.
// Look for className containing "bg-[var(--app-surface-alt)]" and add "text-white"
// Specifically targeting:
// className="w-full px-3 py-2 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-lg text-xs font-mono"

c = c.replace(/className="w-full px-3 py-2 bg-\[var\(--app-surface-alt\)] border border-\[var\(--app-border\)] rounded-lg text-xs font-mono"/g, 'className="w-full px-3 py-2 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-lg text-xs font-mono text-white"');

// also any other generic inputs missing text-white
c = c.replace(/className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg"/g, 'className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-white"');

fs.writeFileSync(file, c);
console.log('RiskProfiling inputs patched for visibility.');
