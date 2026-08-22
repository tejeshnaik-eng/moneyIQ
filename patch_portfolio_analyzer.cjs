const fs = require('fs');
let content = fs.readFileSync('src/components/modules/PortfolioAnalyzer.tsx', 'utf8');

// 1. Update colors
content = content.replace(
  "const COLORS = ['#20EFA0', '#1bd98f', '#00b090', '#006b57', '#264653'];",
  "const COLORS = ['#20EFA0', '#2775E8', '#7757D9', '#D99A00', '#D64545', '#00B386'];"
);

// 2. Add prompt instruction for warnings
content = content.replace(
  "Your goal is to uncover hidden structural flaws, dangerous sector concentrations, platform exposure risks, and severe deviations from the user's stated risk profile. Evaluate if their true asset allocation matches their intentions.",
  "Your goal is to uncover hidden structural flaws, dangerous sector concentrations, platform exposure risks, and severe deviations from the user's stated risk profile. Evaluate if their true asset allocation matches their intentions.\n\nCRITICAL: You MUST generate at least 2 or 3 'warnings' in the JSON response pointing out structural risks or flaws (e.g. overlap, high fees, concentration). Do not return an empty warnings array."
);

// 3. Initialize state from localStorage
content = content.replace(
  "const [analysisResult, setAnalysisResult] = useState<any>(null);",
  "const [analysisResult, setAnalysisResult] = useState<any>(() => {\n    const saved = localStorage.getItem('finsight_ai_analysis');\n    if (saved) {\n      try {\n        return JSON.parse(saved);\n      } catch (e) { return null; }\n    }\n    return null;\n  });"
);

// 4. Save to localStorage on success
content = content.replace(
  /const resultText = response\.response\.text\(\);\n\s*const parsed = JSON\.parse\(resultText\);\n\s*setAnalysisResult\(parsed\);/,
  "const resultText = response.response.text();\n      const parsed = JSON.parse(resultText);\n      setAnalysisResult(parsed);\n      localStorage.setItem('finsight_ai_analysis', JSON.stringify(parsed));"
);

// Also fallback should clear or something? No, fallback can just set state, maybe not local storage to not pollute it with fallback.
fs.writeFileSync('src/components/modules/PortfolioAnalyzer.tsx', content);
