const fs = require('fs');
let content = fs.readFileSync('src/components/modules/PortfolioAnalyzer.tsx', 'utf8');

const oldWarnings = `{/* Warnings */}
            {analysisResult.warnings && analysisResult.warnings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-heading font-bold text-[#71717A] uppercase tracking-widest">Structural Warnings</h4>
                {analysisResult.warnings.map((w: any, idx: number) => (
                  <div key={idx} className={\`p-4 rounded-lg border flex items-start gap-3 \\\${\n                    w.severity === 'high' ? 'bg-[#111111] border-[#ff4444] text-[#ff4444]' :\n                    w.severity === 'medium' ? 'bg-[#111111] border-[#f4a261] text-[#f4a261]' :\n                    'bg-[#111111] border-[#222] text-[#71717A]'\n                  }\`}>
                    {w.severity === 'high' ? <Flame className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                    <p className="font-body-sm text-sm text-white">{w.message}</p>
                  </div>
                ))}
              </div>
            )}`;

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
                      <p className="font-body text-[13px] text-[#E4E4E7] leading-relaxed">{w.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}`;

// This string replace is tricky because of whitespace.
// Instead of literal matching, let's just use replace with indexOf slicing.

const startIndex = content.indexOf('{/* Warnings */}');
const endIndex = content.indexOf('{/* Right Col: Charts & Diversification */}');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newWarnings + '\n          </div>\n\n          ' + content.substring(endIndex);
}

fs.writeFileSync('src/components/modules/PortfolioAnalyzer.tsx', content);
