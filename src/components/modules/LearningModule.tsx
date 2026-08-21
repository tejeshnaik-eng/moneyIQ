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
    return (
      <div className="w-full max-w-[1400px] mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={() => { setView('home'); setActiveConceptId(null); }}
          className="flex items-center gap-2 text-sm font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Learning Curriculum
        </button>
        
        <header className="mb-8 max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--app-text)]">{activeConcept.title}</h1>
            <span className="text-xs font-bold text-[var(--app-text-muted)] tracking-wider uppercase ml-4 px-3 py-1 bg-[var(--app-surface-hover)] rounded-full">Lesson</span>
          </div>
          <div className="w-full bg-[var(--app-surface-alt)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[var(--secondary)] h-full" style={{ width: completedTopics.includes(activeConcept.id) ? '100%' : '50%' }}></div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Chart on very left side */}
          <div className="lg:col-span-7 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-3xl min-h-[500px] relative flex flex-col items-center justify-center overflow-hidden shadow-inner">
             <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'linear-gradient(var(--app-border) 1px, transparent 1px), linear-gradient(90deg, var(--app-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             
             {activeConcept.lessonContent.chartType === 'support_resistance' ? (
               <svg className="w-full h-full p-8 md:p-12 drop-shadow-md" viewBox="0 0 800 400" preserveAspectRatio="none">
                  <rect x="0" y="320" width="800" height="30" fill="var(--primary-soft)" />
                  <line x1="0" y1="335" x2="800" y2="335" stroke="var(--primary)" strokeDasharray="5" strokeWidth="2" />
                  <text x="30" y="365" fill="var(--primary)" fontSize="14" fontWeight="bold">SUPPORT ZONE</text>
                  
                  <rect x="0" y="60" width="800" height="30" fill="#ba1a1a" opacity="0.1" />
                  <line x1="0" y1="75" x2="800" y2="75" stroke="#ba1a1a" strokeDasharray="5" strokeWidth="2" />
                  <text x="30" y="50" fill="#ba1a1a" fontSize="14" fontWeight="bold">RESISTANCE ZONE</text>
  
                  <path d="M 50,200 L 150,335 L 300,100 L 450,320 L 600,75 L 750,335 L 850,150" fill="none" stroke="var(--app-text-muted)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  
                  <circle cx="150" cy="335" r="8" fill="var(--primary)" />
                  <circle cx="450" cy="320" r="8" fill="var(--primary)" />
                  <circle cx="750" cy="335" r="8" fill="var(--primary)" />
                  
                  <circle cx="300" cy="100" r="8" fill="#ba1a1a" />
                  <circle cx="600" cy="75" r="8" fill="#ba1a1a" />
               </svg>
             ) : (
               <div className="z-10 flex flex-col items-center opacity-50">
                  <BarChart2 className="w-16 h-16 text-[var(--app-text-muted)] mb-4" />
                  <p className="text-[var(--app-text-muted)] font-heading text-lg">Interactive Chart Visualization</p>
               </div>
             )}
          </div>
          
          {/* Content on the right */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-8 shadow-sm">
              <h3 className="text-xs font-heading font-bold text-[var(--app-text)] uppercase tracking-widest mb-4">What you will learn</h3>
              <p className="text-[var(--app-text-muted)] text-lg leading-relaxed">
                {activeConcept.lessonContent.whatYouWillLearn}
              </p>
            </div>
            
            <div className="bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-3xl p-8 shadow-sm flex-1">
               <p className="text-[var(--app-text)] text-base whitespace-pre-wrap leading-relaxed">
                 {activeConcept.lessonContent.explanation}
               </p>
            </div>

            <div className="mt-auto pt-4 flex justify-end">
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
          </div>
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
