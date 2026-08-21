import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  TrendingUp,
  PieChart,
  Calculator,
  ArrowLeft,
  CheckCircle2,
  CheckCircle,
  Star,
  Activity,
  BookOpen,
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
      <div className="w-full max-w-[900px] mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={() => { setView('home'); setActiveConceptId(null); }}
          className="flex items-center gap-2 text-sm font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Learning Curriculum
        </button>
        
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-heading font-bold text-[var(--app-text)]">{activeConcept.title}</h1>
            <span className="text-xs font-bold text-[var(--app-text-muted)] tracking-wider">LESSON</span>
          </div>
          <div className="w-full bg-[var(--app-surface-alt)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[var(--secondary)] h-full" style={{ width: completedTopics.includes(activeConcept.id) ? '100%' : '50%' }}></div>
          </div>
        </header>

        <div className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-sm font-heading font-bold text-[var(--app-text)] uppercase tracking-wider mb-3">What you will learn</h3>
          <p className="text-[var(--app-text-muted)] text-lg leading-relaxed">
            {activeConcept.lessonContent.whatYouWillLearn}
          </p>
        </div>
        
        <div className="bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-2xl p-6 mb-8 shadow-sm">
           <p className="text-[var(--app-text)] text-base whitespace-pre-wrap leading-relaxed">
             {activeConcept.lessonContent.explanation}
           </p>
        </div>

        <div className="bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-2xl h-[400px] mb-8 relative flex flex-col items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'linear-gradient(var(--app-border) 1px, transparent 1px), linear-gradient(90deg, var(--app-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           {activeConcept.lessonContent.chartType === 'support_resistance' ? (
             <svg className="w-full h-full p-8" viewBox="0 0 800 300" preserveAspectRatio="none">
                <rect x="0" y="240" width="800" height="20" fill="var(--primary-soft)" />
                <line x1="0" y1="250" x2="800" y2="250" stroke="var(--primary)" strokeDasharray="5" strokeWidth="2" />
                <text x="20" y="275" fill="var(--primary)" fontSize="12" fontWeight="bold">SUPPORT ZONE</text>
                
                <rect x="0" y="40" width="800" height="20" fill="#ba1a1a" opacity="0.1" />
                <line x1="0" y1="50" x2="800" y2="50" stroke="#ba1a1a" strokeDasharray="5" strokeWidth="2" />
                <text x="20" y="35" fill="#ba1a1a" fontSize="12" fontWeight="bold">RESISTANCE ZONE</text>

                <path d="M 50,150 L 100,250 L 200,80 L 300,240 L 450,50 L 600,250 L 750,120" fill="none" stroke="var(--app-text-muted)" strokeWidth="3" />
                
                <circle cx="100" cy="250" r="6" fill="var(--primary)" />
                <circle cx="300" cy="240" r="6" fill="var(--primary)" />
                <circle cx="600" cy="250" r="6" fill="var(--primary)" />
                <circle cx="450" cy="50" r="6" fill="#ba1a1a" />
             </svg>
           ) : (
             <div className="z-10 flex flex-col items-center opacity-50">
                <BarChart2 className="w-16 h-16 text-[var(--app-text-muted)] mb-4" />
                <p className="text-[var(--app-text-muted)] font-heading">Interactive Chart Visualization</p>
             </div>
           )}
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => {
              saveProgress(activeConcept.id);
              setView('home');
              setActiveConceptId(null);
            }}
            className="flex items-center gap-2 bg-[var(--secondary)] hover:bg-[var(--secondary-dim)] text-white font-heading font-bold px-8 py-3 rounded-lg shadow-md transition-colors"
          >
            I Understand
            <CheckCircle2 className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'quiz' && activeConcept && activeConcept.quizContent) {
    return (
      <div className="w-full max-w-[800px] mx-auto p-6 md:p-8 animate-in fade-in duration-300">
        <button 
          onClick={() => { setView('home'); setActiveConceptId(null); setSelectedQuizOption(null); setQuizFeedback(null); }}
          className="flex items-center gap-2 text-sm font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel Quiz
        </button>

        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-[var(--app-text-muted)] tracking-wider mb-3">
            <span className="uppercase">{activeConcept.title}</span>
            <span>QUIZ</span>
          </div>
          <div className="w-full bg-[var(--app-surface-alt)] h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--secondary)] h-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--app-text)] mb-8 leading-snug">
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
                className={`w-full text-left p-5 rounded-xl border transition-all font-body text-base shadow-sm ${
                  isSuccess ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--app-text)]' : 
                  isFail ? 'border-[#ba1a1a] bg-[#ba1a1a]/10 text-[var(--app-text)]' : 
                  selectedQuizOption ? 'border-[var(--app-border)] bg-[var(--app-surface)] opacity-50' :
                  'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--secondary)] hover:bg-[var(--secondary-soft)] text-[var(--app-text)]'
                }`}
              >
                <span className="font-bold mr-3 text-[var(--app-text-muted)]">{letter}.</span>
                {opt.text}
              </button>
            )
          })}
        </div>
        
        {quizFeedback && (
          <div className={`mt-8 p-6 rounded-2xl border ${selectedQuizOption && activeConcept.quizContent?.options.find(o => o.id === selectedQuizOption)?.isCorrect ? 'bg-[var(--primary-soft)] border-[var(--primary)]' : 'bg-[#ba1a1a]/10 border-[#ba1a1a]'} animate-in fade-in slide-in-from-bottom-2`}>
            <p className="text-[var(--app-text)] font-medium">{quizFeedback}</p>
            <div className="mt-6 flex justify-end">
               <button 
                onClick={() => { setView('home'); setActiveConceptId(null); setSelectedQuizOption(null); setQuizFeedback(null); }}
                className="flex items-center gap-2 bg-[var(--secondary)] hover:bg-[var(--secondary-dim)] text-white font-heading font-bold px-6 py-2 rounded-lg transition-colors"
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

  const renderHorizontalCard = (concept: LearningConcept, index: number, isFeatured: boolean = false) => {
    const isCompleted = completedTopics.includes(concept.id);
    return (
      <div key={concept.id} className="bg-[var(--secondary-soft)] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 mb-6 shadow-sm border border-[var(--app-border)]/50">
        <div className="flex-1">
          {isFeatured && (
            <div className="inline-flex items-center gap-1.5 bg-white dark:bg-[var(--app-surface)] text-[var(--secondary)] font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 shadow-sm border border-[var(--app-border)]">
              <Star className="w-3.5 h-3.5" fill="currentColor" /> Featured
            </div>
          )}
          {!isFeatured && isCompleted && (
            <div className="inline-flex items-center gap-1.5 bg-[var(--primary-soft)] text-[var(--primary)] font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 shadow-sm border border-[var(--primary)]/20">
              <CheckCircle className="w-3.5 h-3.5" /> Completed
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--app-text)] mb-3">
            {concept.title}
          </h2>
          <p className="text-base text-[var(--app-text-muted)] mb-8 max-w-xl leading-relaxed">
            {concept.description}
          </p>
          <button 
            onClick={() => {
              setActiveConceptId(concept.id);
              setView(concept.type);
            }}
            className="flex items-center gap-2 bg-[var(--secondary)] hover:bg-[var(--secondary-dim)] text-white font-heading font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {isCompleted ? 'Review Topic' : 'Continue Learning'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full md:w-[280px] h-[180px] shrink-0 hidden sm:block">
          <ChartThumbnail />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6 md:p-12 space-y-12 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-[var(--app-text)] leading-tight mb-2 tracking-tight">
          Learn investing.
        </h1>
        <p className="text-3xl md:text-4xl font-heading text-[var(--app-text-muted)] font-normal tracking-tight">
          Understand the market.
        </p>
      </header>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Progress Card (Spans 4) */}
        <div className="lg:col-span-4 bg-[var(--app-surface)] rounded-[20px] p-8 border border-[var(--app-border)] shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] mb-4 uppercase tracking-widest">
              Your Progress
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-heading font-bold text-[var(--app-text)]">{completedTopics.length}</span>
              <span className="text-lg font-heading font-medium text-[var(--app-text-muted)]">of {totalConcepts} completed</span>
            </div>
          </div>
          <div className="mt-8">
            <div className="w-full h-1.5 bg-[var(--app-surface-hover)] rounded-full relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[var(--primary)] rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--primary)] rounded-full border-2 border-white dark:border-[var(--app-surface)] shadow-sm transition-all duration-1000 ease-out"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              ></div>
            </div>
            <div className="mt-3 text-right text-xs font-bold text-[var(--app-text-muted)]">
              Keep going!
            </div>
          </div>
        </div>

        {/* Featured Card (Spans 8) */}
        <div className="lg:col-span-8">
          {technicalConcepts.length > 0 && renderHorizontalCard(technicalConcepts[0], 0, true)}
        </div>
      </div>

      {/* Curriculum Sections */}
      <div className="space-y-16">
        
        {/* Technical Analysis */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-[var(--app-text)]">Technical Analysis</h2>
          </div>
          <div className="space-y-6">
            {technicalConcepts.slice(1, 4).map((c, i) => renderHorizontalCard(c, i + 1))}
          </div>
        </section>

        {/* Fundamental Analysis */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-[var(--app-text)]">Fundamental Analysis</h2>
          </div>
          <div className="space-y-6">
            {fundamentalConcepts.slice(0, 3).map((c, i) => renderHorizontalCard(c, i))}
          </div>
        </section>

        {/* Portfolio Strategy */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)] flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-[var(--app-text)]">Portfolio Strategy</h2>
          </div>
          <div className="space-y-6">
            {portfolioConcepts.slice(0, 3).map((c, i) => renderHorizontalCard(c, i))}
          </div>
        </section>

      </div>
      
    </div>
  );
};
