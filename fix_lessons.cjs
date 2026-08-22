const fs = require('fs');

let content = fs.readFileSync('src/components/modules/LearningModule.tsx', 'utf8');

// Find the lesson object for "decoding-groww"
const match = content.match(/{\s*id:\s*'decoding-groww'[\s\S]*?<\/>\s*\),\s*},/);
if (match) {
  // Remove it from current position
  content = content.replace(match[0], '');
  
  // Find the end of LESSONS array
  const endMatch = content.match(/\s*\];\s*const QUIZ_QUESTIONS/);
  if (endMatch) {
    content = content.replace(endMatch[0], '\n' + match[0] + endMatch[0]);
  }
}

// Ensure the title is exactly what they asked, or just leave it
content = content.replace("Module 2: Decoding the Groww Interface", "Module 2: Decoding the Groww Interface");

fs.writeFileSync('src/components/modules/LearningModule.tsx', content);
