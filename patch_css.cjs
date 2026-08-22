const fs = require('fs');

const file = 'src/index.css';
let c = fs.readFileSync(file, 'utf8');

const noSpinnersCss = `
/* Remove number input spinners globally */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
`;

if (!c.includes('-webkit-inner-spin-button')) {
  c += '\n' + noSpinnersCss;
  fs.writeFileSync(file, c);
  console.log('Added CSS to hide number spinners');
}
