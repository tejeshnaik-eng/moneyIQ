const fs = require('fs');

let content = fs.readFileSync('src/components/modules/LearningModule.tsx', 'utf8');

const growwVisual = `
const GrowwInterfaceVisual: React.FC = () => {
  return (
    <div className="bg-[#1A1A1A] rounded-[20px] p-6 mb-6">
      <div className="mb-6 rounded-[12px] overflow-hidden">
         <iframe width="100%" height="400" src="https://www.youtube.com/embed/P69yqR-Qoew?si=E1t3T_3QpZ3t1c2L" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      
      <div className="bg-black/40 rounded-xl border border-[#333] p-5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
             <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-red-600 font-bold text-xl">NI</div>
             <div>
               <h3 className="text-white font-heading font-bold text-[18px]">Nippon India Small Cap Fund - Direct Growth</h3>
               <p className="text-[#00B386] bg-[#00B386]/10 px-2 py-0.5 rounded text-[11px] font-bold mt-1 inline-block">EQUITY • SMALL CAP</p>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-[#8A8F98] text-[12px] mb-1">NAV</p>
            <p className="text-white font-bold text-[16px]">₹142.50 <span className="text-[#00B386] text-[12px] ml-1">(+0.42%)</span></p>
          </div>
          <div>
            <p className="text-[#8A8F98] text-[12px] mb-1">3Y CAGR</p>
            <p className="text-white font-bold text-[16px]">24.5%</p>
          </div>
          <div>
            <p className="text-[#8A8F98] text-[12px] mb-1">Fund Size (AUM)</p>
            <p className="text-white font-bold text-[16px]">₹45,210 Cr</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-[#333]">
           <div className="bg-[#222] px-3 py-2 rounded-lg">
             <p className="text-[#8A8F98] text-[11px]">Expense Ratio</p>
             <p className="text-white font-bold text-[13px]">0.72% (incl. GST)</p>
           </div>
           <div className="bg-[#222] px-3 py-2 rounded-lg">
             <p className="text-[#8A8F98] text-[11px]">Exit Load</p>
             <p className="text-white font-bold text-[13px]">1% if &lt; 1 yr</p>
           </div>
           <div className="bg-[#222] px-3 py-2 rounded-lg">
             <p className="text-[#8A8F98] text-[11px]">Riskometer</p>
             <p className="text-white font-bold text-[13px] flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-[#D64545]"></span> Very High
             </p>
           </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        {[
          { label: 'NAV', def: 'Net Asset Value: The per-unit market price of the fund, calculated daily after market close ((Total Assets - Expenses) / Total Units).' },
          { label: 'Returns', def: 'Annualized Compound Growth Rate (CAGR). Teach users that past returns do not guarantee future performance.' },
          { label: 'AUM', def: 'Assets Under Management: Total capital managed by the scheme. Very large AUMs in Small Cap funds can limit agility.' },
          { label: 'Expense Ratio', def: "The annual fee deducted directly from the fund's NAV to cover operational and management fees. Lower is better." },
          { label: 'Exit Load', def: 'Penalty fee charged if an investor withdraws capital before a minimum specified holding period.' },
          { label: 'Riskometer', def: 'SEBI-mandated dial showing risk level (Low to Very High) based on underlying asset volatility.' },
          { label: 'Holdings', def: 'The percentage of the fund allocated across sectors (Financials, Tech, Auto) and individual companies (Top 10).' }
        ].map(item => (
          <div key={item.label} className="flex flex-col md:flex-row gap-2 md:gap-4 items-start p-4 bg-[#222] rounded-[12px]">
            <div className="bg-[#7757D9]/20 text-[#7757D9] font-bold text-[12px] px-3 py-1.5 rounded-[6px] shrink-0 md:min-w-[120px] md:text-center w-fit">
              {item.label}
            </div>
            <p className="text-[#C4C4C4] text-[13px] font-body leading-relaxed">
              {item.def}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
`;

const lessonObj = `
  {
    id: 'decoding-groww',
    title: 'Module 2: Decoding the Groww Interface',
    subtitle: 'When you open a fund page on Groww, every metric tells a specific story.',
    content: (
      <>
        <div className="space-y-4 mb-6">
          <p className="text-[15px] text-[#C4C4C4] font-body leading-[1.75]">
            Before investing, you need to know how to read the data presented to you on platforms like Groww. We've broken down every UI element so you know exactly what to look for.
          </p>
        </div>
        <GrowwInterfaceVisual />
      </>
    ),
  },
`;

content = content.replace("const LESSONS: Lesson[] = [", growwVisual + "\nconst LESSONS: Lesson[] = [\n" + lessonObj);

// Also add a quiz question for it
const quizQuestion = `
    {
      question: 'What does the "Expense Ratio" of a mutual fund represent?',
      options: [
        'The amount of money the fund holds (AUM)',
        'The annual fee deducted directly from the NAV to cover operational fees',
        'A penalty for withdrawing early',
        'The expected yearly return of the fund',
      ],
      correctIndex: 1,
      explanation: 'Expense Ratio is the annual maintenance charge levied by mutual funds to finance its expenses. A lower expense ratio means more of your money is actually invested.',
    },
`;

content = content.replace("const QUIZ_QUESTIONS: QuizQuestion[] = [", "const QUIZ_QUESTIONS: QuizQuestion[] = [\n" + quizQuestion);

fs.writeFileSync('src/components/modules/LearningModule.tsx', content);
