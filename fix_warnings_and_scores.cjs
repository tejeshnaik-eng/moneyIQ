const fs = require('fs');
let content = fs.readFileSync('src/components/modules/PortfolioAnalyzer.tsx', 'utf8');

// 1. Fix Diversification Scores (change /25 to /100)
content = content.replace(
  /\{comp\.score\}\/25/g,
  '{comp.score}/100'
);
content = content.replace(
  /\(comp\.score \/ 25\) \* 100/g,
  'comp.score'
);

// 2. Fix Structural Warnings (make it a single window, no borders on individual cards)
const oldWarningsRegex = /\{\/\* Warnings \*\/\}\s*\{analysisResult\.warnings && analysisResult\.warnings\.length > 0 && \(\s*<div className="space-y-3">\s*<h4 className="text-\[10px\] font-heading font-bold text-\[\#71717A\] uppercase tracking-widest">Structural Warnings<\/h4>\s*\{analysisResult\.warnings\.map\(\(w: any, idx: number\) => \(\s*<div key=\{idx\} className=\{`p-4 rounded-lg border flex items-start gap-3 \\\$\{\s*w\.severity === 'high' \? 'bg-\[\#111111\] border-\[\#ff4444\] text-\[\#ff4444\]' :\s*w\.severity === 'medium' \? 'bg-\[\#111111\] border-\[\#f4a261\] text-\[\#f4a261\]' :\s*'bg-\[\#111111\] border-\[\#222\] text-\[\#71717A\]'\s*\}`\}>\s*\{w\.severity === 'high' \? <Flame className="w-5 h-5 shrink-0" \/> : <AlertTriangle className="w-5 h-5 shrink-0" \/>\}\s*<p className="font-body-sm text-sm text-white">\{w\.message\}<\/p>\s*<\/div>\s*\)\}\s*<\/div>\s*\)/;

const newWarnings = `{/* Warnings */}
          {analysisResult.warnings && analysisResult.warnings.length > 0 && (
            <div className="bg-[#161616] border border-[#222] p-6 rounded-xl">
              <h4 className="text-[10px] font-heading font-bold text-[#71717A] uppercase tracking-widest mb-6">Structural Warnings</h4>
              <div className="space-y-6">
                {analysisResult.warnings.map((w: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={\`shrink-0 mt-0.5 \${
                      w.severity === 'high' ? 'text-[#D64545]' :
                      w.severity === 'medium' ? 'text-[#D99A00]' :
                      'text-[#71717A]'
                    }\`}>
                      {w.severity === 'high' ? <Flame className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <p className="font-body text-[13px] text-white leading-relaxed">{w.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}`;

content = content.replace(oldWarningsRegex, newWarnings);

fs.writeFileSync('src/components/modules/PortfolioAnalyzer.tsx', content);
