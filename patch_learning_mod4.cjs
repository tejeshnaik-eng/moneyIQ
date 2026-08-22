const fs = require('fs');
let content = fs.readFileSync('src/components/modules/LearningModule.tsx', 'utf8');

// Add Import
content = content.replace(
  "import { SIPMechanicsModule3 } from './SIPMechanicsModule3';",
  "import { SIPMechanicsModule3 } from './SIPMechanicsModule3';\nimport { TaxationModule4 } from './TaxationModule4';"
);

// Add to LESSONS array
const newLesson = `,{
    id: 'taxation-mechanics',
    title: 'Module 4: Mutual Fund Taxation & Redemption',
    subtitle: 'Master tax classifications, FIFO rules, and smart redemption strategies.',
    content: (
      <TaxationModule4 />
    )
  }`;

content = content.replace(
  "  }\n];",
  "  }\n" + newLesson + "\n];"
);

fs.writeFileSync('src/components/modules/LearningModule.tsx', content);
