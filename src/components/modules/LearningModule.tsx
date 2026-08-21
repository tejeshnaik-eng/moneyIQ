import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  BarChart2, 
  ArrowRight,
  TrendingUp,
  PieChart,
  Calculator,
  Activity,
  ArrowLeft,
  CheckCircle2,
  CheckCircle,
  XCircle,
  Award
} from 'lucide-react';
import { allLearningConcepts } from '../../data/learningConcepts';
import { LearningConcept } from '../../types/learning';

export const LearningModule: React.FC = () => {
  const [view, setView] = useState<'home' | 'lesson' | 'quiz' | 'challenge' | 'lab'>('home');
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  
  // Load progress
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
          <ArrowLeft className="w-4 h-4" /> Back to Learning Home
        </button>
        
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-heading font-bold text-[var(--app-text)]">{activeConcept.title}</h1>
            <span className="text-xs font-bold text-[var(--app-text-muted)] tracking-wider">LESSON</span>
          </div>
          <div className="w-full bg-[var(--app-surface-alt)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[var(--primary)] h-full" style={{ width: completedTopics.includes(activeConcept.id) ? '100%' : '50%' }}></div>
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
           {/* Mock Interactive Chart Area based on type */}
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
            className="btn-primary text-base px-8 py-3 shadow-md"
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
                  'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--secondary)] hover:bg-[var(--app-surface-hover)] text-[var(--app-text)]'
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
                className="btn-primary"
               >
                 Back to Home
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

  const renderConceptCard = (concept: LearningConcept, IconComponent: any, hoverColor: string) => (
    <button 
      key={concept.id}
      onClick={() => {
        setActiveConceptId(concept.id);
        setView(concept.type);
      }} 
      className={`text-left bg-[var(--app-surface)] p-5 rounded-2xl border border-[var(--app-border)] transition-all duration-200 group cursor-pointer block relative shadow-sm hover:shadow-md hover:border-[${hoverColor}]`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`w-10 h-10 rounded-full bg-[var(--app-surface-hover)] flex items-center justify-center transition-colors`} style={{ color: hoverColor }}>
          <IconComponent className="w-5 h-5" />
        </div>
        {completedTopics.includes(concept.id) ? (
          <CheckCircle className="w-5 h-5" style={{ color: hoverColor }} />
        ) : (
          <span className="text-[10px] font-bold text-[var(--app-text-muted)] bg-[var(--app-surface-alt)] px-2 py-0.5 rounded uppercase">{concept.difficulty}</span>
        )}
      </div>
      <h4 className="text-base font-heading font-bold text-[var(--app-text)] mb-1 transition-colors group-hover:text-[var(--primary)]">
        {concept.title}
      </h4>
      <p className="text-sm text-[var(--app-text-muted)] line-clamp-2 mb-4">
        {concept.description}
      </p>
      <div className="flex items-center justify-between text-xs font-medium text-[var(--app-text-muted)] mt-auto pt-3 border-t border-[var(--app-border)]">
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {concept.durationMinutes} min</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold" style={{ color: hoverColor }}>
          Start <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );

  return (
    <div className="w-full max-w-[1280px] mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <header className="max-w-3xl mb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[var(--app-text)] leading-tight mb-4">
          Learn investing.<br/>Understand the market.
        </h1>
        <p className="text-lg text-[var(--app-text-muted)] max-w-2xl">
          Build your market knowledge by learning with real charts and interactive examples.
        </p>
      </header>

      {/* Progress & Continue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        
        {/* Overall Progress (Spans 4) */}
        <div className="lg:col-span-4 bg-[var(--app-surface)] rounded-2xl p-6 border border-[var(--app-border)] relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm">
          <div>
            <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] mb-2 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              Your Learning Progress
            </h3>
            <div className="text-2xl font-heading font-bold text-[var(--app-text)]">
              {completedTopics.length} of {totalConcepts} concepts completed
            </div>
          </div>
          <div className="mt-8 relative">
            <div className="flex justify-between text-xs font-bold text-[var(--app-text-muted)] mb-2">
              <span>{progressPercent}% Total</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--app-surface-hover)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Continue Learning Hero Card (Spans 8) */}
        <div className="lg:col-span-8 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl overflow-hidden relative group hover:border-[var(--primary)] transition-all duration-300 flex flex-col sm:flex-row shadow-sm">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--app-surface-hover)] flex">
            <div className="h-full bg-[var(--primary)] transition-all duration-1000" style={{ width: '100%' }}></div>
          </div>
          
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between z-10 bg-[var(--app-surface)]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary-soft)] text-[var(--primary)] tracking-wide uppercase">
                  Featured
                </span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-[var(--app-text)] mb-2">
                Keep exploring financial markets!
              </h2>
              <div className="flex items-center gap-4 text-sm text-[var(--app-text-muted)] font-medium">
                Pick a lesson or quiz below to increase your knowledge.
              </div>
            </div>
          </div>
          
          <div className="w-full sm:w-2/5 h-48 sm:h-auto bg-[var(--app-surface-alt)] relative overflow-hidden hidden sm:block border-l border-[var(--app-border)]">
            <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'linear-gradient(var(--app-border) 1px, transparent 1px), linear-gradient(90deg, var(--app-border) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <svg className="absolute inset-0 w-full h-full text-[var(--app-text-muted)] opacity-30 group-hover:opacity-50 transition-opacity duration-500" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 80 Q 20 60, 40 70 T 80 40 T 100 30" fill="none" stroke="currentColor" strokeWidth="2"></path>
              <line stroke="var(--primary)" strokeDasharray="4" strokeWidth="2" x1="0" x2="100" y1="75" y2="75"></line>
              <line stroke="#ba1a1a" strokeDasharray="4" strokeWidth="2" x1="0" x2="100" y1="35" y2="35"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-heading font-bold text-[var(--app-text)] mb-6">Explore Topics</h2>
        
        {allLearningConcepts.length === 0 ? (
          <div className="py-20 text-center text-[var(--app-text-muted)]">
            Loading interactive curriculum...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Technical Analysis Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider border-b border-[var(--app-border)] pb-2 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Technical Analysis
              </h3>
              {technicalConcepts.map(c => renderConceptCard(c, Activity, 'var(--primary)'))}
            </div>

            {/* Fundamental Analysis Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider border-b border-[var(--app-border)] pb-2 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Fundamental Analysis
              </h3>
              {fundamentalConcepts.map(c => renderConceptCard(c, Calculator, 'var(--primary)'))}
            </div>

            {/* Portfolio & Risk Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider border-b border-[var(--app-border)] pb-2 mb-2 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Portfolio Strategy
              </h3>
              {portfolioConcepts.map(c => renderConceptCard(c, PieChart, 'var(--secondary)'))}
            </div>

          </div>
        )}
      </section>
      
    </div>
  );
};
