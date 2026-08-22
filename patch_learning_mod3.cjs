const fs = require('fs');
let content = fs.readFileSync('src/components/modules/LearningModule.tsx', 'utf8');

content = content.replace(
  "import { GrowwInteractiveModule2 } from './GrowwInteractiveModule2';",
  "import { GrowwInteractiveModule2 } from './GrowwInteractiveModule2';\nimport { SIPMechanicsModule3 } from './SIPMechanicsModule3';"
);

const newLesson = `,
  {
    id: 'sip-mechanics',
    title: 'Module 3: Mechanics of SIP & Compounding',
    subtitle: 'Master Rupee Cost Averaging and the Groww execution lifecycle.',
    content: (
      <SIPMechanicsModule3 />
    )
  }
`;

content = content.replace(
  "    },\n];",
  "    }" + newLesson + "];"
);

fs.writeFileSync('src/components/modules/LearningModule.tsx', content);
