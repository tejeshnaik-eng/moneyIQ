import React from 'react';

// Reusable mini-graphic component that returns an SVG based on the tool type
const ToolGraphic: React.FC<{ type: string }> = ({ type }) => {
  const commonClasses = "w-full h-full";

  switch (type) {
    case 'sip':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="16" width="3" height="4" rx="1" fill="#00B386" fillOpacity="0.4" />
          <rect x="8" y="12" width="3" height="8" rx="1" fill="#00B386" fillOpacity="0.6" />
          <rect x="14" y="8" width="3" height="12" rx="1" fill="#00B386" fillOpacity="0.8" />
          <rect x="20" y="4" width="3" height="16" rx="1" fill="#00B386" />
          <path d="M13 3 L19 3 L19 9 M19 3 L9 13" stroke="#00B386" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'swp':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="3" height="16" rx="1" fill="#D64545" fillOpacity="0.3" />
          <rect x="8" y="8" width="3" height="12" rx="1" fill="#D64545" fillOpacity="0.5" />
          <rect x="14" y="12" width="3" height="8" rx="1" fill="#D64545" fillOpacity="0.7" />
          <rect x="20" y="16" width="3" height="4" rx="1" fill="#D64545" />
          <path d="M5 19 L19 19" stroke="#D64545" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
        </svg>
      );
    case 'lumpsum':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="14" width="6" height="6" rx="1" fill="#2775E8" fillOpacity="0.4" />
          <rect x="15" y="6" width="6" height="14" rx="1" fill="#2775E8" />
          <path d="M10 16 L14 10 M14 10 L12 10 M14 10 L14 12" stroke="#2775E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'brokerage':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="4" width="12" height="16" rx="2" fill="#7757D9" fillOpacity="0.2" />
          <rect x="6" y="14" width="12" height="6" rx="2" fill="#7757D9" fillOpacity="0.6" />
          <rect x="6" y="18" width="12" height="2" rx="1" fill="#7757D9" />
          <line x1="4" y1="14" x2="20" y2="14" stroke="#7757D9" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );
    case 'margin':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="16" height="4" rx="1" fill="#D99A00" fillOpacity="0.3" />
          <rect x="4" y="14" width="10" height="4" rx="1" fill="#D99A00" />
          <line x1="12" y1="4" x2="12" y2="20" stroke="#D99A00" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
        </svg>
      );
    case 'pe':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="8" width="6" height="12" rx="1" fill="#2775E8" fillOpacity="0.4" />
          <rect x="13" y="14" width="6" height="6" rx="1" fill="#2775E8" />
          <path d="M8 8 C 8 4, 16 4, 16 14" stroke="#2775E8" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        </svg>
      );
    case 'cagr':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 19 C 10 19, 14 10, 21 5" stroke="#00B386" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="21" cy="5" r="2" fill="#00B386" />
          <circle cx="3" cy="19" r="2" fill="#00B386" fillOpacity="0.5" />
        </svg>
      );
    case 'inflation':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5 C 10 5, 14 14, 21 19" stroke="#D64545" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="21" cy="19" r="2" fill="#D64545" />
          <circle cx="3" cy="5" r="2" fill="#D64545" fillOpacity="0.5" />
        </svg>
      );
    case 'goal':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="16" height="4" rx="2" fill="#00B386" fillOpacity="0.2" />
          <rect x="4" y="10" width="10" height="4" rx="2" fill="#00B386" />
          <path d="M18 6 L18 18 M18 6 L21 8 L18 10" stroke="#00B386" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#00B386" fillOpacity="0.2" />
        </svg>
      );
    case 'retirement':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="18" x2="22" y2="18" stroke="#7757D9" strokeWidth="2" strokeLinecap="round" />
          <rect x="5" y="14" width="4" height="4" rx="1" fill="#7757D9" fillOpacity="0.4" />
          <rect x="11" y="10" width="4" height="8" rx="1" fill="#7757D9" fillOpacity="0.7" />
          <rect x="17" y="6" width="4" height="12" rx="1" fill="#7757D9" />
        </svg>
      );
    case 'tax':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="5" width="12" height="14" rx="2" fill="#D64545" fillOpacity="0.2" />
          <rect x="6" y="13" width="12" height="6" rx="2" fill="#D64545" />
          <path d="M9 13 L15 13 M9 9 L15 9" stroke="#D64545" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'fd_rd':
      return (
        <svg className={commonClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="12" width="6" height="8" rx="1" fill="#00B386" fillOpacity="0.5" />
          <rect x="5" y="8" width="6" height="4" rx="1" fill="#00B386" fillOpacity="0.8" />
          <rect x="13" y="10" width="6" height="10" rx="1" fill="#00B386" fillOpacity="0.5" />
          <rect x="13" y="6" width="6" height="4" rx="1" fill="#00B386" fillOpacity="0.8" />
        </svg>
      );
    default:
      return null;
  }
};

const TOOLS_DIRECTORY = [
  {
    category: "Investment",
    tools: [
      { id: 'sip', title: 'SIP Calculator', desc: 'Estimate future returns from a systematic investment plan.' },
      { id: 'swp', title: 'SWP Calculator', desc: 'Estimate withdrawals and remaining corpus from a systematic withdrawal plan.' },
      { id: 'lumpsum', title: 'Lumpsum Calculator', desc: 'Estimate future value from a one-time investment.' },
      { id: 'cagr', title: 'CAGR Calculator', desc: 'Calculate annualized returns over an investment period.' },
    ]
  },
  {
    category: "Trading",
    tools: [
      { id: 'brokerage', title: 'Brokerage Calculator', desc: 'Estimate brokerage, taxes, and charges for your trades.' },
      { id: 'margin', title: 'Margin Calculator', desc: 'Estimate the balance required to buy or sell securities.' },
      { id: 'pe', title: 'P/E Calculator', desc: 'Understand valuation using earnings and market price.' },
    ]
  },
  {
    category: "Planning",
    tools: [
      { id: 'goal', title: 'Goal Calculator', desc: 'Estimate how much you need to invest to reach a financial goal.' },
      { id: 'retirement', title: 'Retirement Calculator', desc: 'Estimate your retirement corpus and required monthly investment.' },
      { id: 'inflation', title: 'Inflation Calculator', desc: 'See how inflation changes the purchasing power of money over time.' },
    ]
  },
  {
    category: "Savings & Tax",
    tools: [
      { id: 'fd_rd', title: 'FD / RD Calculator', desc: 'Estimate maturity value and interest from fixed or recurring deposits.' },
      { id: 'tax', title: 'Tax Calculator', desc: 'Estimate applicable taxes on your investments and income.' },
    ]
  }
];

export const ToolsModule: React.FC = () => {
  return (
    <div 
      className="w-full h-full bg-[#1E1E1E] text-white font-sans overflow-y-auto custom-scrollbar"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <div className="max-w-[1400px] mx-auto p-8 lg:p-10 pb-20">
        
        {/* Page Heading */}
        <div className="mb-14">
          <h1 className="text-[34px] sm:text-[38px] font-bold tracking-[-0.035em] text-white mb-2">
            Tools
          </h1>
          <p className="text-[16px] text-[#A1A1AA] font-medium">
            Useful calculators and financial tools to help you make better decisions.
          </p>
        </div>

        {/* Directory Layout: 3 Columns Desktop, 2 Tablet, 1 Mobile */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
          {TOOLS_DIRECTORY.map((group, gIdx) => (
            <div key={gIdx} className="break-inside-avoid">
              <h2 className="text-[12px] font-bold tracking-widest uppercase text-[#7B8580] mb-5 pl-4">
                {group.category}
              </h2>
              
              <div className="space-y-1">
                {group.tools.map((tool) => (
                  <div 
                    key={tool.id} 
                    className="group cursor-pointer p-4 rounded-[20px] transition-all duration-180 ease-out hover:bg-[#262626] border border-transparent hover:border-[#333333]"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-[16px] mb-1.5 flex items-center gap-1.5 group-hover:text-white transition-colors">
                          {tool.title}
                          <span className="opacity-0 -translate-x-2 transition-all duration-180 ease-out group-hover:opacity-100 group-hover:translate-x-0 text-[#7B8580] text-sm">
                            →
                          </span>
                        </h3>
                        <p className="text-[#8A8F98] text-[13px] leading-relaxed pr-2">
                          {tool.desc}
                        </p>
                      </div>
                      
                      {/* Contextual Graphic */}
                      <div className="w-11 h-11 shrink-0 rounded-[14px] bg-[#161616] group-hover:bg-[#1E1E1E] transition-colors border border-[#222222] flex items-center justify-center p-2.5">
                        <ToolGraphic type={tool.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
