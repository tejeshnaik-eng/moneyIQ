# MoneyIQ 💡

**MoneyIQ** is an explainable personal finance and wealth intelligence platform designed to transform complex market data into clear, personalized, and actionable insights. Built to address the growing gap between financial literacy and financial confidence, MoneyIQ helps users consolidate portfolios, understand their true risk profile, and make data-driven decisions.

## Features 🚀

- **Quantitative Risk Profiling & Automated Asset Allocation**: A multi-variable mathematical engine that evaluates goals, time horizons, financial cushions, and behavioral tendencies to construct a highly personalized asset allocation and SIP basket.
- **Smart Portfolio Ledger**: A borderless, unified dashboard to import, track, and manage all your holdings across multiple brokers. (You can test imports using the \`sample_portfolio.csv\` included in the \`public\` folder).
- **Market Simulator**: A risk-free sandbox environment to backtest strategies, simulate trades, and understand market dynamics across different economic regimes (e.g., COVID-19 Crash, 2008 Financial Crisis).
- **AI Financial Assistant**: A globally available, context-aware chatbot (powered by Google Gemini) ready to answer questions, analyze uploaded screenshots, or explain complex financial jargon.
- **Goal & Spend Analysis**: Track your financial milestones and analyze spending patterns to identify leakage and optimize your savings rate.

## Tech Stack 🛠️

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **State Management & Data Fetching**: React Hooks, Context API
- **Backend/Database**: Supabase (PostgreSQL, Auth)
- **AI Integration**: Google Gemini API (\`@google/genai\`)
- **Build Tool**: Vite

## Getting Started 💻

1. **Clone the repository**
2. **Install dependencies**: \`npm install\`
3. **Environment Variables**: Create a \`.env\` file with your Supabase credentials and Gemini API Key:
   \`\`\`env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   \`\`\`
4. **Run the development server**: \`npm run dev\`

## Testing the Platform 🧪

For judges or reviewers testing the application:
- **Sample Portfolio**: Download and import \`/sample_portfolio.csv\` into the **Holdings** tab to instantly populate the dashboard with realistic data.
- **Risk Profiler**: Try adjusting the inputs in the **Risk Profiling (Quant)** tab to see how the mathematical model dynamically adjusts your target allocation and recommended SIP basket.
- **Chatbot**: Click the floating \`mIQ\` icon in the bottom left to ask questions or get explanations of any page.

---
*Built with ❤️ for the Hackathon.*
