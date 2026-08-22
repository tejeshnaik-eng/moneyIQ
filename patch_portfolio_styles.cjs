const fs = require('fs');

const file = 'src/components/modules/PortfolioModule.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Fix Empty State Styling (No borders, dark theme)
c = c.replace(
  /className="p-12 rounded-2xl bg-surface-container-lowest border border-outline-variant\/30 shadow-sm/g,
  'className="p-12 rounded-2xl bg-[#161616] shadow-xl border-none'
);
c = c.replace(
  /bg-surface-variant flex items-center justify-center/g,
  'bg-[#222] flex items-center justify-center'
);
c = c.replace(
  /text-on-surface-variant/g,
  'text-[#8A8F98]'
);
c = c.replace(
  /text-on-surface/g,
  'text-white'
);
c = c.replace(
  /bg-primary text-on-primary font-label-md py-3 px-6 rounded-lg/g,
  'bg-[#00D09C] shadow-[0_4px_24px_rgba(0,208,156,0.3)] text-black font-bold text-[14px] py-3 px-8 rounded-xl'
);
c = c.replace(
  /btn-secondary py-3 px-4 flex items-center gap-2 text-\[#ba1a1a\] border-\[#ba1a1a\] hover:bg-\[#ffdad6\]/g,
  'py-3 px-4 flex items-center gap-2 text-[#D64545] font-bold text-[14px] hover:bg-[#D64545]/10 rounded-xl transition-colors border-none'
);

// 2. Fix Add Modal Styling (Inspired by Groww image: No borders, pill badges, glowing green)
c = c.replace(
  /className="bg-\[#161616\] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-\[#333\]"/g,
  'className="bg-[#1C1C1C] rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden border-none"'
);
c = c.replace(
  /className="p-4 border-b border-\[#333\] flex items-center justify-between"/g,
  'className="p-6 pb-2 flex items-center justify-between border-none"'
);
c = c.replace(
  /className="p-4 bg-\[#111\] flex flex-col items-center justify-center gap-2 border-b border-\[#333\]"/g,
  'className="px-6 py-4 flex flex-col items-center justify-center gap-2 border-none"'
);
c = c.replace(
  /className="border border-\[#20EFA0\]\/30 text-\[#20EFA0\] py-2 px-4 rounded-lg flex items-center gap-2 cursor-pointer w-full justify-center bg-\[#161616\] hover:bg-\[#20EFA0\]\/10 transition-colors"/g,
  'className="text-[#00D09C] py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer w-full justify-center bg-[#00D09C]/10 hover:bg-[#00D09C]/20 transition-colors font-bold text-[13px] border-none"'
);
c = c.replace(
  /className="p-4 space-y-4"/g,
  'className="p-6 space-y-4 pt-2"'
);
c = c.replace(
  /bg-\[#111\] border border-\[#333\] rounded-lg py-2 px-3 focus:outline-none focus:border-\[#20EFA0\]/g,
  'bg-[#252525] border-none rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C]'
);
c = c.replace(
  /bg-\[#222\] text-\[#8A8F98\]/g,
  'bg-[#2A2A2A] text-[#8A8F98]'
);
c = c.replace(
  /bg-\[#20EFA0\] text-black font-bold text-\[13px\] flex-1 text-center hover:bg-\[#1bc785\]/g,
  'bg-[#00D09C] text-black font-bold text-[14px] flex-1 text-center hover:bg-[#00E5AA] shadow-[0_4px_20px_rgba(0,208,156,0.3)] rounded-xl'
);
c = c.replace(
  /rounded-lg bg-\[#222\]/g,
  'rounded-xl bg-[#2A2A2A]'
);


fs.writeFileSync(file, c);
console.log('PortfolioModule empty state and modal styled to match borderless dark theme.');
