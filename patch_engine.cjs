const fs = require('fs');

const file = 'src/services/quantitativeRiskEngine.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/monthlyBudget: number;/, `monthlyBudget: number;\n  additionalContext?: string;`);

fs.writeFileSync(file, c);
console.log('Updated RiskProfileInputs with additionalContext');
