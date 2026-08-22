import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

const GUIDE_CARDS = [
  {
    id: 1,
    tag: 'Beginner',
    title: 'Order Types 101',
    description: 'Master Market, Limit, and Stop-Loss orders to enter and exit trades precisely.',
    tasks: '4 modules',
    projects: '15 mins',
    progress: 100,
    progressText: '100%',
    bottomLeft: 'Modules: 4/4',
    buttonText: 'Review',
    bgColor: 'bg-[#FCE7F3]', // Pink pastel
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Technologist%20Light%20Skin%20Tone.png',
  },
  {
    id: 2,
    tag: 'Recommended',
    title: 'Margin & MTF',
    description: 'Learn the fundamentals of leverage, Margin Trading Facility, and avoiding margin calls.',
    tasks: '6 modules',
    projects: '25 mins',
    progress: 0,
    progressText: '0%',
    bottomLeft: 'Start date: Today',
    buttonText: 'Start',
    bgColor: 'bg-[#E0F2FE]', // Blue pastel
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Office%20Worker%20Medium-Dark%20Skin%20Tone.png',
  },
  {
    id: 3,
    tag: 'Popular',
    title: 'Options Chain',
    description: 'Understand the options chain layout, strikes, premiums, and open interest on the broker.',
    tasks: '8 modules',
    projects: '40 mins',
    progress: 45,
    progressText: '45%',
    bottomLeft: 'Modules: 3/8',
    buttonText: 'Continue',
    bgColor: 'bg-[#FEF9C3]', // Yellow pastel
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Student%20Medium%20Skin%20Tone.png',
  },
  {
    id: 4,
    tag: 'Advanced',
    title: 'Portfolio Analytics',
    description: 'Navigate P&L reports, calculate your true XIRR, and analyze asset distribution.',
    tasks: '3 modules',
    projects: '10 mins',
    progress: 0,
    progressText: '0%',
    bottomLeft: 'Start date: Flexible',
    buttonText: 'Start',
    bgColor: 'bg-[#DCFCE7]', // Green pastel
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Student%20Dark%20Skin%20Tone.png',
  }
];

export const LearningModule: React.FC = () => {
  return (
    <div className="w-full h-full p-2 pb-10 overflow-y-auto custom-scrollbar">
      <div className="mb-8 pl-2">
        <h1 className="text-4xl font-heading font-semibold text-gray-900 tracking-tight mb-2">App Guides</h1>
        <p className="text-gray-500 font-body text-[15px]">Master your brokerage app. Learn how to execute trades, read chains, and manage risk.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 pr-4">
        {GUIDE_CARDS.map(card => (
          <div key={card.id} className="rounded-[32px] overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
            
            {/* Top Colored Section */}
            <div className={`${card.bgColor} p-8 relative flex-1 min-h-[220px]`}>
              
              {/* 3D Avatar Image */}
              <div className="absolute right-2 top-8 w-32 h-32 z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
              
              <div className="bg-black/5 text-black/70 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider w-max mb-6">
                {card.tag}
              </div>
              
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3 w-[70%] leading-tight relative z-20">
                {card.title}
              </h2>
              
              <p className="text-[13px] text-gray-700 mb-6 w-[65%] font-body relative z-20 leading-relaxed">
                {card.description}
              </p>
              
              <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-700 mb-10 relative z-20">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 opacity-70" /> {card.tasks}
                </div>
                <div className="w-1 h-1 rounded-full bg-black/20" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 opacity-70" /> {card.projects}
                </div>
              </div>
              
              <div className="mt-auto relative z-20">
                <div className="flex justify-between items-center text-[12px] font-bold text-gray-700 mb-2.5">
                  <span>Progress</span>
                  <span>{card.progressText}</span>
                </div>
                <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${card.progress}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Bottom White Section */}
            <div className="bg-white p-6 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-gray-500">{card.bottomLeft}</span>
              <button className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-heading font-semibold text-[13px] transition-colors shadow-sm">
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
