const fs = require('fs');

const shellFile = 'src/components/dashboard/DashboardShell.tsx';
let shell = fs.readFileSync(shellFile, 'utf8');

if (!shell.includes('QuantRiskModule')) {
  shell = shell.replace(
    /import \{ LearningModule \} from '\.\.\/modules\/LearningModule';/,
    `import { LearningModule } from '../modules/LearningModule';\nimport { QuantRiskModule } from '../modules/QuantRiskModule';`
  );
  
  shell = shell.replace(
    /case 'learning':\s*return <LearningModule \/>;/,
    `case 'learning':\n        return <LearningModule />;\n      case 'quant_risk':\n        return <QuantRiskModule />;`
  );
  
  fs.writeFileSync(shellFile, shell);
  console.log('DashboardShell patched with QuantRiskModule.');
} else {
  console.log('QuantRiskModule already in DashboardShell.');
}

const sidebarFile = 'src/components/dashboard/DashboardSidebar.tsx';
let sidebar = fs.readFileSync(sidebarFile, 'utf8');

if (!sidebar.includes("'quant_risk'")) {
  sidebar = sidebar.replace(
    /\{renderNavButton\('learning', 'Learning', GraduationCap\)\}/,
    `{renderNavButton('learning', 'Learning', GraduationCap)}\n            {renderNavButton('quant_risk', 'Risk Profiling (Quant)', Shield)}`
  );
  
  fs.writeFileSync(sidebarFile, sidebar);
  console.log('DashboardSidebar patched with QuantRiskModule.');
} else {
  console.log('QuantRiskModule already in DashboardSidebar.');
}
