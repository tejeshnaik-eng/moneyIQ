const fs = require('fs');

const file = 'src/App.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /\{currentView === 'landing' && \([\s\S]*?onStartModule=\{handleStartFromLanding\}\n\s*\/>\n\s*\)\}\n\n/m;

c = c.replace(regex, "");

fs.writeFileSync(file, c);
console.log("App.tsx patched.");
