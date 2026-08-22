const fs = require('fs');

const file = 'src/types/index.ts';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes("'quant_risk'")) {
  c = c.replace(
    /export type ModuleId =([\s\S]*?);/,
    (match, p1) => `export type ModuleId =${p1}  | 'quant_risk';`
  );
  fs.writeFileSync(file, c);
  console.log('Added quant_risk to ModuleId');
} else {
  console.log('quant_risk already exists');
}
