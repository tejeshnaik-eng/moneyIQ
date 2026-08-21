import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  TrendingUp,
  PieChart,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  CheckCircle,
  Star,
  BarChart2
} from 'lucide-react';
import { allLearningConcepts } from '../../data/learningConcepts';
import { LearningConcept } from '../../types/learning';

const ChartThumbnail = () => (
  <div className="bg-white dark:bg-[var(--app-surface)] p-3 rounded-xl border border-[var(--app-border)] shadow-sm w-full h-full flex flex-col">
    <div className="text-[8px] font-bold text-center mb-2 text-[var(--app-text)] tracking-wider">SUPPORT AND RESISTANCE LEVELS</div>
    <div className="flex-1 relative border-l border-b border-[var(--app-border)]">
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full border-b border-[var(--app-border)] border-dashed opacity-50 flex-1"></div>
        ))}
      </div>
      {/* Candles */}
      <div className="absolute inset-0 flex items-end justify-around px-2 pb-2">
         <div className="w-1.5 h-8 bg-gray-800 dark:bg-gray-200 mb-6"></div>
         <div className="w-1.5 h-12 bg-gray-800 dark:bg-gray-200 mb-8"></div>
         <div className="w-1.5 h-6 bg-gray-800 dark:bg-gray-200 mb-5"></div>
         <div className="w-1.5 h-10 bg-[var(--primary)] mb-5"></div>
         <div className="w-1.5 h-14 bg-[var(--primary)] mb-7"></div>
         <div className="w-1.5 h-16 bg-[var(--primary)] mb-10"></div>
         <div className="w-1.5 h-12 bg-[var(--primary)] mb-14"></div>
         <div className="w-1.5 h-10 bg-gray-800 dark:bg-gray-200 mb-14"></div>
      </div>
      {/* Trendline */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
         <line x1="10%" y1="70%" x2="90%" y2="20%" stroke="var(--secondary)" strokeWidth="1.5" strokeDasharray="3" />
      </svg>
    </div>
  </div>
);

export const LearningModule: React.FC = () => {
  const [view, setView] = useState<'home' | 'lesson' | 'quiz'>('home');
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem('finsight_learning_progress');
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      const newTopics = [...completedTopics, topicId];
      setCompletedTopics(newTopics);
      localStorage.setItem('finsight_learning_progress', JSON.stringify(newTopics));
    }
  };

  const totalConcepts = Math.max(30, allLearningConcepts.length);
  const progressPercent = Math.round((completedTopics.length / totalConcepts) * 100) || 0;
  const activeConcept = allLearningConcepts.find(c => c.id === activeConceptId);

  // --- SUBVIEWS --- //
  if (view === 'lesson' && activeConcept && activeConcept.lessonContent) {
    const allInCategory = allLearningConcepts.filter(c => c.category === activeConcept.category);
    const currentIndex = allInCategory.findIndex(c => c.id === activeConcept.id) + 1;
    const totalInCategory = allInCategory.length;
    const nextConcept = allInCategory[currentIndex]; // Since it's 1-based, index = currentIndex is the next element
    const isNextQuiz = nextConcept?.type === 'quiz';

    return (
      <div className="w-full max-w-[1300px] mx-auto p-6 md:p-8 animate-in fade-in duration-300 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="mb-6">
          <button 
            onClick={() => { setView('home'); setActiveConceptId(null); setSelectedQuizOption(null); setQuizFeedback(null); }}
            className="flex items-center gap-2 text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] mb-5 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Learning Curriculum
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex flex-col md:flex-row md:items-baseline gap-4">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--app-text)] leading-none tracking-tight">{activeConcept.title}</h1>
              <span className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-widest bg-[var(--app-surface)] border border-[var(--app-border)] px-3 py-1.5 rounded-full whitespace-nowrap">
                LESSON {String(currentIndex).padStart(2, '0')} · {activeConcept.difficulty} · {activeConcept.durationMinutes} MIN
              </span>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0 hidden md:flex">
              <span className="text-xs font-bold text-[var(--app-text)]">{currentIndex} of {totalInCategory} concepts</span>
              <div className="w-48 bg-[var(--app-surface-hover)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[var(--secondary)] h-full transition-all duration-500" style={{ width: `${(currentIndex/totalInCategory)*100}%` }}></div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE (62 / 38 SPLIT) */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 lg:h-[600px]">
          
          {/* LEFT SIDE: MARKET CHART (62%) */}
          <div className="w-full lg:w-[62%] bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl flex flex-col overflow-hidden shadow-sm h-[400px] lg:h-full">
             <div className="flex items-center gap-2 p-3 border-b border-[var(--app-border)] bg-[var(--app-surface-alt)] overflow-x-auto custom-scrollbar">
               <button className="text-[10px] font-bold bg-[var(--app-surface)] border border-[var(--app-border)] px-3 py-1.5 rounded hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary)] transition-colors shrink-0">20D</button>
               <button className="text-[10px] font-bold bg-[var(--app-surface)] border border-[var(--app-border)] px-3 py-1.5 rounded hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary)] transition-colors shrink-0">50D</button>
               <button className="text-[10px] font-bold bg-[var(--app-surface)] border border-[var(--app-border)] px-3 py-1.5 rounded hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary)] transition-colors shrink-0">200D</button>
               <div className="w-px h-4 bg-[var(--app-border)] mx-1 shrink-0"></div>
               <button className="text-[10px] font-bold bg-[var(--secondary)] text-white border border-[var(--secondary)] px-3 py-1.5 rounded transition-colors shrink-0">SMA</button>
               <button className="text-[10px] font-bold bg-[var(--app-surface)] border border-[var(--app-border)] px-3 py-1.5 rounded hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary)] transition-colors shrink-0">EMA</button>
               
               <div className="ml-auto text-[10px] md:text-xs font-medium text-[var(--app-text-muted)] flex items-center gap-3 md:gap-4 whitespace-nowrap pl-4">
                 <span>O: <span className="text-[var(--app-text)] font-bold">142.50</span></span>
                 <span>H: <span className="text-[var(--app-text)] font-bold">145.80</span></span>
                 <span>L: <span className="text-[var(--app-text)] font-bold">141.20</span></span>
                 <span>C: <span className="text-[var(--primary)] font-bold">144.30</span></span>
               </div>
             </div>
             
             <div className="flex-1 relative bg-white dark:bg-[#0B0E14]">
               <svg className="w-full h-full p-6" viewBox="0 0 1000 500" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[...Array(10)].map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="var(--app-border)" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
                  ))}
                  {[...Array(20)].map((_, i) => (
                    <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" stroke="var(--app-border)" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
                  ))}
                  
                  {/* Volume Bars */}
                  {[...Array(50)].map((_, i) => {
                     const h = 20 + Math.random() * 80;
                     const isUp = Math.random() > 0.5;
                     return <rect key={`vol-${i}`} x={i * 20 + 6} y={450 - h} width="8" height={h} fill={isUp ? 'var(--primary)' : '#ba1a1a'} opacity="0.15" />
                  })}
                  
                  {/* Moving Averages */}
                  <path d="M0,200 Q100,180 200,220 T400,150 T600,250 T800,100 T1000,180" fill="none" stroke="#3b82f6" strokeWidth="2.5" opacity="0.8" />
                  <path d="M0,220 Q150,210 300,250 T500,200 T700,280 T900,150 T1000,200" fill="none" stroke="#eab308" strokeWidth="2.5" opacity="0.8" />
                  
                  {/* Candlesticks */}
                  {[...Array(50)].map((_, i) => {
                     const x = i * 20 + 10;
                     const base = 250 + Math.sin(i * 0.2) * 60;
                     const isUp = Math.cos(i * 0.5) > 0;
                     const open = base + (isUp ? 12 : -12);
                     const close = base + (isUp ? -12 : 12);
                     const high = Math.min(open, close) - 18;
                     const low = Math.max(open, close) + 18;
                     const color = isUp ? 'var(--primary)' : '#ba1a1a';
                     return (
                       <g key={`candle-${i}`}>
                         <line x1={x} y1={high} x2={x} y2={low} stroke={color} strokeWidth="1.5" />
                         <rect x={x - 3.5} y={Math.min(open, close)} width="7" height={Math.abs(open - close)} fill={color} />
                       </g>
                     )
                  })}
                  
                  {/* Highlighted Crossover */}
                  <circle cx="500" cy="200" r="16" fill="var(--secondary-soft)" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
               </svg>
             </div>
          </div>
          
          {/* RIGHT SIDE: LEARNING PANEL (38%) */}
          <div className="w-full lg:w-[38%] flex flex-col gap-6 h-full">
            <div className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-6 shadow-sm shrink-0">
              <h3 className="text-xs font-heading font-bold text-[var(--app-text)] uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--secondary)]" /> What you'll learn
              </h3>
              <ul className="space-y-3">
                 {activeConcept.lessonContent.whatYouWillLearn.split(', ').map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-[var(--app-text)] font-medium">
                     <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5 opacity-80" />
                     <span className="leading-snug">{item.trim().replace(/^and /i, '')}</span>
                   </li>
                 ))}
              </ul>
            </div>
            
            <div className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl shadow-sm flex-1 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-[var(--app-border)] bg-[var(--app-surface-alt)] shrink-0">
                 <h3 className="text-xs font-heading font-bold text-[var(--app-text)] uppercase tracking-wider">Lesson Sections</h3>
               </div>
               <div className="p-4 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                 {activeConcept.lessonContent.explanation.split('\n\n').filter(p => p.trim() !== '').map((para, i) => (
                   <div key={i} className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-alt)] hover:border-[var(--secondary)] transition-colors group cursor-pointer">
                     <h4 className="text-[10px] font-bold text-[var(--app-text-muted)] group-hover:text-[var(--secondary)] transition-colors mb-2 uppercase tracking-widest">
                       {String(i + 1).padStart(2, '0')} · Concept Segment
                     </h4>
                     <p className="text-sm text-[var(--app-text)] leading-relaxed font-medium">{para}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE LEARNING SECTION */}
        {isNextQuiz && nextConcept.quizContent ? (
           <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-8 shadow-sm">
             <h3 className="text-xs font-heading font-bold text-[var(--secondary)] uppercase tracking-widest mb-6">Try It Yourself</h3>
             <div className="flex flex-col lg:flex-row gap-12 items-start">
               <div className="flex-1 w-full">
                 <h2 className="text-2xl font-heading font-bold text-[var(--app-text)] mb-6">{nextConcept.quizContent.question}</h2>
                 <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                   {nextConcept.quizContent.options.map((opt, i) => {
                      const isSelected = selectedQuizOption === opt.id;
                      const isSuccess = isSelected && opt.isCorrect;
                      const isFail = isSelected && !opt.isCorrect;
                      return (
                       <button 
                         key={opt.id} 
                         disabled={selectedQuizOption !== null}
                         onClick={() => {
                           setSelectedQuizOption(opt.id);
                           setQuizFeedback(opt.explanation);
                           if(opt.isCorrect) saveProgress(nextConcept.id);
                         }} 
                         className={`flex-1 min-w-[150px] text-left px-6 py-4 rounded-xl border-2 transition-all font-body text-base font-semibold shadow-sm ${
                           isSuccess ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' : 
                           isFail ? 'border-[#ba1a1a] bg-[#ba1a1a]/10 text-[#ba1a1a]' : 
                           selectedQuizOption ? 'border-[var(--app-border)] bg-[var(--app-surface-alt)] opacity-50' :
                           'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--secondary)] hover:bg-[var(--secondary-soft)] text-[var(--app-text)]'
                         }`}
                       >
                         {opt.text}
                       </button>
                      )
                   })}
                 </div>
               </div>
               {quizFeedback && (
                 <div className={`w-full lg:w-[400px] p-6 rounded-2xl border-2 ${selectedQuizOption && nextConcept.quizContent?.options.find(o => o.id === selectedQuizOption)?.isCorrect ? 'bg-[var(--primary-soft)] border-[var(--primary)]' : 'bg-[#ba1a1a]/10 border-[#ba1a1a]'} animate-in fade-in`}>
                   <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: selectedQuizOption && nextConcept.quizContent?.options.find(o => o.id === selectedQuizOption)?.isCorrect ? 'var(--primary-dim)' : '#ba1a1a' }}>Why?</h4>
                   <p className="text-base font-medium text-[var(--app-text)]">{quizFeedback}</p>
                 </div>
               )}
             </div>
           </div>
        ) : (
          <div className="w-full flex justify-end">
            <button 
              onClick={() => {
                saveProgress(activeConcept.id);
                setView('home');
                setActiveConceptId(null);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--secondary)] hover:bg-[var(--secondary-dim)] text-white font-heading font-bold px-10 py-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              I Understand
              <CheckCircle2 className="w-5 h-5 ml-1" />
            </button>
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="flex items-center justify-between py-6 mt-auto border-t border-[var(--app-border)]">
          <button 
            onClick={() => { setView('home'); setActiveConceptId(null); setSelectedQuizOption(null); setQuizFeedback(null); }}
            className="text-sm font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] flex items-center gap-2 transition-colors"
          >
             ← Previous
          </button>
          <span className="text-xs font-bold text-[var(--app-text-muted)] uppercase tracking-widest hidden sm:block">Concept {currentIndex} / {totalInCategory}</span>
          <button 
            onClick={() => {
              saveProgress(activeConcept.id);
              setView('home');
              setActiveConceptId(null);
              setSelectedQuizOption(null);
              setQuizFeedback(null);
            }}
            className="text-sm font-bold text-[var(--secondary)] hover:text-[var(--secondary-dim)] flex items-center gap-2 transition-colors"
          >
             Next Concept →
          </button>
        </div>
        
      </div>
    );
  }

  if (view === 'quiz' && activeConcept && activeConcept.quizContent) {
    return (
      <div className="w-full max-w-[800px] mx-auto p-6 md:p-12 animate-in fade-in duration-300">
        <button 
          onClick={() => { setView('home'); setActiveConceptId(null); setSelectedQuizOption(null); setQuizFeedback(null); }}
          className="flex items-center gap-2 text-sm font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel Quiz
        </button>

        <div className="mb-12">
          <div className="flex justify-between text-xs font-bold text-[var(--app-text-muted)] tracking-wider mb-4">
            <span className="uppercase">{activeConcept.title}</span>
            <span>QUIZ</span>
          </div>
          <div className="w-full bg-[var(--app-surface-alt)] h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--secondary)] h-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--app-text)] mb-10 leading-snug tracking-tight">
          {activeConcept.quizContent.question}
        </h2>

        <div className="space-y-4">
          {activeConcept.quizContent.options.map((opt, i) => {
             const letter = String.fromCharCode(65 + i);
             const isSelected = selectedQuizOption === opt.id;
             const isSuccess = isSelected && opt.isCorrect;
             const isFail = isSelected && !opt.isCorrect;
             
             return (
              <button 
                key={opt.id} 
                disabled={selectedQuizOption !== null}
                onClick={() => {
                  setSelectedQuizOption(opt.id);
                  setQuizFeedback(opt.explanation);
                  if(opt.isCorrect) {
                    saveProgress(activeConcept.id);
                  }
                }} 
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-body text-lg shadow-sm ${
                  isSuccess ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--app-text)]' : 
                  isFail ? 'border-[#ba1a1a] bg-[#ba1a1a]/10 text-[var(--app-text)]' : 
                  selectedQuizOption ? 'border-[var(--app-border)] bg-[var(--app-surface)] opacity-50' :
                  'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--secondary)] hover:bg-[var(--secondary-soft)] text-[var(--app-text)]'
                }`}
              >
                <span className="font-bold mr-4 text-[var(--app-text-muted)]">{letter}.</span>
                {opt.text}
              </button>
            )
          })}
        </div>
        
        {quizFeedback && (
          <div className={`mt-10 p-8 rounded-2xl border-2 ${selectedQuizOption && activeConcept.quizContent?.options.find(o => o.id === selectedQuizOption)?.isCorrect ? 'bg-[var(--primary-soft)] border-[var(--primary)]' : 'bg-[#ba1a1a]/10 border-[#ba1a1a]'} animate-in fade-in slide-in-from-bottom-4`}>
            <p className="text-[var(--app-text)] font-medium text-lg">{quizFeedback}</p>
            <div className="mt-8 flex justify-end">
               <button 
                onClick={() => { setView('home'); setActiveConceptId(null); setSelectedQuizOption(null); setQuizFeedback(null); }}
                className="flex items-center gap-2 bg-[var(--secondary)] hover:bg-[var(--secondary-dim)] text-white font-heading font-bold px-8 py-3 rounded-xl transition-colors shadow-md hover:-translate-y-0.5"
               >
                 Back to Curriculum
               </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- HOME VIEW --- //
  const technicalConcepts = allLearningConcepts.filter(c => c.category === 'Technical Analysis');
  const fundamentalConcepts = allLearningConcepts.filter(c => c.category === 'Fundamental Analysis');
  const portfolioConcepts = allLearningConcepts.filter(c => c.category === 'Portfolio Strategy');
  const featuredConcept = technicalConcepts[0]; // Just picking first for hero

  const renderHorizontalCard = (concept: LearningConcept) => {
    const isCompleted = completedTopics.includes(concept.id);
    return (
      <div key={concept.id} className="bg-[var(--app-surface)] hover:bg-[var(--app-surface-alt)] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 mb-6 shadow-sm border border-[var(--app-border)] transition-colors group">
        <div className="flex-1">
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 bg-[var(--primary-soft)] text-[var(--primary)] font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 shadow-sm border border-[var(--primary)]/20">
              <CheckCircle className="w-3.5 h-3.5" /> Completed
            </div>
          )}
          <h3 className="text-xl md:text-2xl font-heading font-bold text-[var(--app-text)] mb-3 group-hover:text-[var(--secondary)] transition-colors">
            {concept.title}
          </h3>
          <p className="text-base text-[var(--app-text-muted)] mb-8 max-w-2xl leading-relaxed">
            {concept.description}
          </p>
          <button 
            onClick={() => {
              setActiveConceptId(concept.id);
              setView(concept.type);
            }}
            className="flex items-center gap-2 bg-[var(--app-surface)] hover:bg-[var(--secondary-soft)] text-[var(--app-text)] border border-[var(--app-border)] hover:border-[var(--secondary)] font-heading font-semibold px-6 py-3 rounded-xl transition-all shadow-sm group-hover:text-[var(--secondary)]"
          >
            {isCompleted ? 'Review Topic' : 'Continue Learning'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full md:w-[240px] h-[160px] shrink-0 hidden sm:block">
          <ChartThumbnail />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-12 animate-in fade-in duration-300">
      
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
        
        {/* Left Side: Hero Section (Progress + Featured) - Fixed to Left */}
        <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 order-1 flex flex-col gap-6 lg:h-[calc(100vh-6rem)] lg:sticky lg:top-8">
           
           <header className="lg:hidden shrink-0 mb-2">
             <h1 className="text-4xl font-heading font-bold text-[var(--app-text)] leading-tight mb-2 tracking-tight">
               Learn investing.
             </h1>
             <p className="text-2xl font-heading text-[var(--app-text-muted)] font-normal tracking-tight">
               Understand the market.
             </p>
           </header>

           {/* Progress Card */}
           <div className="bg-[var(--app-surface)] rounded-[24px] p-6 md:p-8 border border-[var(--app-border)] shadow-sm flex flex-col justify-between shrink-0">
             <div>
               <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] mb-4 uppercase tracking-widest">
                 Your Progress
               </h3>
               <div className="flex items-baseline gap-2">
                 <span className="text-6xl md:text-7xl font-heading font-bold text-[var(--app-text)] leading-none">{completedTopics.length}</span>
                 <span className="text-lg font-heading font-medium text-[var(--app-text-muted)]">of {totalConcepts} completed</span>
               </div>
             </div>
             <div className="mt-6 md:mt-8">
               <div className="w-full h-1.5 bg-[var(--app-surface-hover)] rounded-full relative">
                 <div 
                   className="absolute top-0 left-0 h-full bg-[var(--primary)] rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progressPercent}%` }}
                 ></div>
                 <div 
                   className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[var(--primary)] rounded-full border-2 border-white dark:border-[var(--app-surface)] shadow-sm transition-all duration-1000 ease-out"
                   style={{ left: `calc(${progressPercent}% - 7px)` }}
                 ></div>
               </div>
               <div className="mt-4 text-right text-xs font-bold text-[var(--app-text-muted)] uppercase tracking-wider">
                 Keep going!
               </div>
             </div>
           </div>
           
           {/* Featured Vertical Card */}
           {featuredConcept && (
             <div className="bg-[var(--secondary-soft)] rounded-[24px] p-6 md:p-8 border border-[var(--app-border)]/50 shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="inline-flex items-center gap-1.5 bg-white dark:bg-[var(--app-surface)] text-[var(--secondary)] font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm w-fit shrink-0 mb-4 md:mb-6">
                  <Star className="w-3.5 h-3.5" fill="currentColor" /> Featured
                </div>
                
                <div className="flex flex-col flex-1 min-h-0">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--app-text)] mb-2 md:mb-3 shrink-0">
                    {featuredConcept.title}
                  </h2>
                  <p className="text-sm text-[var(--app-text-muted)] mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-3 shrink-0">
                    {featuredConcept.description}
                  </p>
                  
                  <div className="w-full flex-1 min-h-[100px] mb-6 shrink min-h-0 rounded-xl overflow-hidden">
                    <ChartThumbnail />
                  </div>

                  <button 
                    onClick={() => {
                      setActiveConceptId(featuredConcept.id);
                      setView(featuredConcept.type);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--secondary)] hover:bg-[var(--secondary-dim)] text-white font-heading font-bold px-6 py-3.5 md:py-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5 shrink-0 mt-auto"
                  >
                    Continue Learning <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
             </div>
           )}
        </div>

        {/* Right Side: Header + Course Content (Main Content) */}
        <div className="flex-1 order-2 space-y-16">
          <header className="hidden lg:block">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-[var(--app-text)] leading-tight mb-2 tracking-tight">
              Learn investing.
            </h1>
            <p className="text-3xl md:text-4xl font-heading text-[var(--app-text-muted)] font-normal tracking-tight">
              Understand the market.
            </p>
          </header>

          <div className="space-y-16">
            
            {/* Technical Analysis */}
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-[var(--app-border)] pb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-[var(--app-text)] tracking-tight">Technical Analysis</h2>
              </div>
              <div className="space-y-6">
                {technicalConcepts.slice(1, 4).map(c => renderHorizontalCard(c))}
              </div>
            </section>

            {/* Fundamental Analysis */}
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-[var(--app-border)] pb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)] flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-[var(--app-text)] tracking-tight">Fundamental Analysis</h2>
              </div>
              <div className="space-y-6">
                {fundamentalConcepts.slice(0, 3).map(c => renderHorizontalCard(c))}
              </div>
            </section>

            {/* Portfolio Strategy */}
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-[var(--app-border)] pb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)] flex items-center justify-center">
                  <PieChart className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-[var(--app-text)] tracking-tight">Portfolio Strategy</h2>
              </div>
              <div className="space-y-6">
                {portfolioConcepts.slice(0, 3).map(c => renderHorizontalCard(c))}
              </div>
            </section>

          </div>
        </div>

      </div>
      
    </div>
  );
};
