const fs = require('fs');
let content = fs.readFileSync('src/components/modules/PortfolioModule.tsx', 'utf8');

// 1. Fix CSV Import Button UI
content = content.replace(
  /className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary py-3 rounded-xl font-label-md transition-colors cursor-pointer border border-primary\/20"/,
  'className="w-full flex items-center justify-center gap-2 bg-[#222] text-white hover:bg-[#20EFA0]/10 hover:text-[#20EFA0] border border-[#333] hover:border-[#20EFA0] py-3 rounded-[12px] font-heading font-bold text-[14px] transition-colors cursor-pointer shadow-sm"'
);

// 2. Fix Holdings Table UI
content = content.replace(
  /<div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant\/20 overflow-hidden">/,
  '<div className="w-full bg-[#161616] rounded-2xl shadow-sm border border-[#333] overflow-hidden">'
);
content = content.replace(
  /<div className="grid grid-cols-6 border-b border-outline-variant\/40 bg-surface-container-lowest\/50 px-6 py-4 text-label-md font-label-md text-tertiary uppercase tracking-widest">/,
  '<div className="grid grid-cols-6 border-b border-[#333] bg-[#111] px-4 py-3 text-[11px] font-heading font-bold text-[#8A8F98] uppercase tracking-widest">'
);

// Fix Table Rows py-5 -> py-2.5, px-6 -> px-4, bg-surface-variant/20 -> #222
content = content.replace(
  /className="grid grid-cols-6 px-6 py-5 hover:bg-surface-variant\/20 transition-colors group relative cursor-default"/g,
  'className="grid grid-cols-6 px-4 py-2.5 hover:bg-[#222] border-b border-[#333]/50 transition-colors group relative cursor-default"'
);

// Ticker text
content = content.replace(
  /className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface"/g,
  'className="text-[13px] font-heading font-bold text-white"'
);
content = content.replace(
  /className="font-label-md text-label-md text-tertiary mt-0\.5"/g,
  'className="text-[11px] text-[#8A8F98] mt-0.5"'
);
// Values text
content = content.replace(
  /className="text-right font-body-md text-body-md flex items-center justify-end text-on-surface-variant"/g,
  'className="text-right text-[12px] font-body flex items-center justify-end text-[#C4C4C4]"'
);
content = content.replace(
  /className="text-right font-body-md text-body-md flex items-center justify-end font-medium text-on-surface"/g,
  'className="text-right text-[12px] font-body flex items-center justify-end font-medium text-white"'
);
content = content.replace(
  /className=\{`text-right font-body-md text-body-md flex flex-col items-end justify-center font-medium \$\{isPositive \? 'text-status-positive' : 'text-status-risk'\}`\}/g,
  'className={`text-right text-[12px] flex flex-col items-end justify-center font-bold ${isPositive ? "text-[#00B386]" : "text-[#D64545]"}`}'
);

// Also fix the clear data and add asset buttons to use the proper dark theme
content = content.replace(
  /className="font-label-md text-label-md uppercase tracking-wider text-error hover:underline flex items-center gap-1"/g,
  'className="text-[12px] font-bold uppercase tracking-wider text-[#D64545] hover:underline flex items-center gap-1"'
);
content = content.replace(
  /className="font-label-md text-label-md uppercase tracking-wider text-primary hover:underline flex items-center gap-1"/g,
  'className="text-[12px] font-bold uppercase tracking-wider text-[#20EFA0] hover:underline flex items-center gap-1"'
);

// Fix AI section container in PortfolioModule.tsx to just be dark theme
content = content.replace(
  /<section className="mb-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant\/20 p-8">/,
  '<section className="mb-12 bg-[#161616] rounded-2xl shadow-sm border border-[#222] p-8">'
);

fs.writeFileSync('src/components/modules/PortfolioModule.tsx', content);
