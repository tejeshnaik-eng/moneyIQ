const fs = require('fs');
const file = 'src/components/modules/RiskProfilingModule.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "console.error('Failed to calculate risk profile', err);",
  "console.error('Failed to calculate risk profile', err);\n      alert('AI Analysis failed. This usually means the Gemini API Key is missing on Vercel or you have hit the rate limit. Please try again in 1 minute.');"
);

fs.writeFileSync(file, c);
