const fs = require('fs');
let content = fs.readFileSync('src/components/modules/LearningModule.tsx', 'utf8');

content = content.replace("import { ChevronDown, ChevronUp, CheckCircle2, Circle, ArrowRight } from 'lucide-react';", "import { ChevronDown, ChevronUp, CheckCircle2, Circle, ArrowRight, BookOpen } from 'lucide-react';\nimport { GrowwInteractiveModule2 } from './GrowwInteractiveModule2';");

// Remove the old GrowwInterfaceVisual string since we use the new component
content = content.replace(/const GrowwInterfaceVisual: React\.FC = \(\) => {[\s\S]*?};\n/, "");

// Replace <GrowwInterfaceVisual /> with <GrowwInteractiveModule2 />
content = content.replace(/<GrowwInterfaceVisual \/>/g, "<GrowwInteractiveModule2 />");

const NEW_LAYOUT = `
export const LearningModule: React.FC = () => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);

  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  const markComplete = (id: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const progress = (completedLessons.size / LESSONS.length) * 100;

  return (
    <div className="w-full h-full bg-[#1E1E1E] text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="shrink-0 p-6 lg:px-10 border-b border-[#333]">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#00B386]/15 text-[#00B386] text-[11px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-[8px]">
            Learning Center
          </div>
          <span className="text-[12px] text-[#71717A] font-body">{completedLessons.size} of {LESSONS.length} modules complete</span>
        </div>
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-white font-heading">
          Foundations of Markets & Mutual Funds
        </h1>
        <div className="mt-4">
          <div className="h-1.5 w-64 bg-[#262626] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#00B386] transition-all duration-500 ease-out" style={{ width: \`\${progress}%\` }} />
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 pb-32">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b border-[#333] pb-6">
              <h2 className="text-[32px] font-heading font-bold text-white mb-2">{activeLesson.title}</h2>
              <p className="text-[16px] text-[#8A8F98] font-body">{activeLesson.subtitle}</p>
            </div>
            
            <div className="text-white">
              {activeLesson.content}
            </div>

            <div className="mt-12 pt-8 border-t border-[#333] flex justify-between items-center">
              {!completedLessons.has(activeLesson.id) ? (
                <button
                  onClick={() => markComplete(activeLesson.id)}
                  className="inline-flex items-center gap-2 bg-[#00B386] hover:bg-[#00B386]/80 text-[#0D1117] px-6 py-3 rounded-[14px] text-[14px] font-heading font-semibold transition-all duration-[180ms]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark as Complete
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[#00B386]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[14px] font-heading font-semibold">Completed</span>
                </div>
              )}
            </div>

            {/* If it's the last lesson, optionally show quiz at the bottom */}
            {activeLessonId === LESSONS[LESSONS.length - 1].id && (
              <div className="mt-16 pt-8 border-t border-[#333]">
                <h2 className="text-[20px] font-heading font-bold text-white mb-5">Test Your Understanding</h2>
                <KnowledgeCheck questions={QUIZ_QUESTIONS} />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Module Navigation */}
        <div className="w-full lg:w-[380px] shrink-0 border-l border-[#333] bg-[#1A1A1A] overflow-y-auto custom-scrollbar p-6">
          <h3 className="text-[14px] font-heading font-bold text-[#8A8F98] uppercase tracking-wider mb-4">Course Modules</h3>
          <div className="space-y-3">
            {LESSONS.map((lesson, idx) => {
              const isActive = activeLessonId === lesson.id;
              const isComplete = completedLessons.has(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={\`w-full flex items-start gap-4 p-4 rounded-[16px] text-left transition-all duration-200 \${isActive ? 'bg-[#262626] ring-1 ring-[#00B386]/30' : 'hover:bg-[#222]'}\`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-[#00B386]" />
                    ) : (
                      <div className={\`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold \${isActive ? 'border-[#00B386] text-[#00B386]' : 'border-[#444] text-[#8A8F98]'}\`}>
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={\`text-[14px] font-heading font-bold mb-1 \${isActive ? 'text-white' : 'text-[#C4C4C4]'}\`}>{lesson.title}</h4>
                    <p className="text-[12px] text-[#71717A] line-clamp-2 leading-relaxed">{lesson.subtitle}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
`;

content = content.replace(/export const LearningModule: React\.FC = \(\) => {[\s\S]*?};\n/, NEW_LAYOUT);
fs.writeFileSync('src/components/modules/LearningModule.tsx', content);
