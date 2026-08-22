const fs = require('fs');

let c = fs.readFileSync('src/components/modules/PortfolioModule.tsx', 'utf8');

const regex = /const AddModal = \(\) => \{[\s\S]*?return createPortal\(([\s\S]*?)\);\s*\};/;
const match = c.match(regex);
if (match) {
  const innerJsx = match[1];
  
  c = c.replace(regex, ''); // remove definition
  c = c.replace(/<AddModal \/>/g, `{showAddModal && createPortal(${innerJsx})}`);
  
  fs.writeFileSync('src/components/modules/PortfolioModule.tsx', c);
  console.log('Inlined AddModal!');
} else {
  console.log('Could not find AddModal');
}
