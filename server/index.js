// FinSight - Secure API Server
// Handles all LLM communication server-side so API keys are never exposed to the browser.

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import YahooFinance from 'yahoo-finance2';
import * as dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey', 'ripHistorical'] });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Strict JSON Schema for Gemini Structured Outputs ---
const auditSchema = {
  type: SchemaType.OBJECT,
  properties: {
    risk_assessment_badge: {
      type: SchemaType.STRING,
      description:
        "A concise risk verdict label, e.g. 'High Risk / Statistically Unfavorable', 'Misleading Assumption', or 'Factually Flawed'.",
      nullable: false,
    },
    regulatory_ground_truth: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'A short, sharp title for the regulatory ground truth section.',
          nullable: false,
        },
        description: {
          type: SchemaType.STRING,
          description:
            'Cite specific SEBI or RBI data, study names, years, and percentages. Be factually precise.',
          nullable: false,
        },
      },
      required: ['title', 'description'],
    },
    mathematical_reality: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'A short, sharp title for the mathematical reality section.',
          nullable: false,
        },
        description: {
          type: SchemaType.STRING,
          description:
            'Explain theta decay, slippage, taxes, and compounding friction with concrete numbers.',
          nullable: false,
        },
      },
      required: ['title', 'description'],
    },
    evidence_based_strategy: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'A short, sharp title for the evidence-based strategy section.',
          nullable: false,
        },
        description: {
          type: SchemaType.STRING,
          description:
            'Provide a clear, actionable alternative investment strategy grounded in empirical data.',
          nullable: false,
        },
      },
      required: ['title', 'description'],
    },
  },
  required: [
    'risk_assessment_badge',
    'regulatory_ground_truth',
    'mathematical_reality',
    'evidence_based_strategy',
  ],
};

// --- System Prompt ---
const SYSTEM_PROMPT =
  'You are a strict SEBI/RBI empirical financial auditor. Analyze the provided financial claim for risk, friction, and historical reality.';

// --- API Route ---
app.post('/api/audit-claim', async (req, res) => {
  const { claim } = req.body;

  if (!claim || typeof claim !== 'string' || claim.trim().length === 0) {
    return res.status(400).json({ error: 'A financial claim string is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res
      .status(500)
      .json({ error: 'GEMINI_API_KEY is not configured. Please add it to your .env file.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: auditSchema,
        temperature: 0.3, // Low temperature for factual, consistent outputs
        maxOutputTokens: 1024,
      },
    });

    const userPrompt = `Analyze this financial claim and return a structured audit: "${claim.trim()}"`;

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    // Parse and validate the JSON response
    const auditResult = JSON.parse(responseText);

    return res.json(auditResult);
  } catch (err) {
    console.error('[FinSight Audit API Error]:', err?.message || err);

    if (err?.message?.includes('API_KEY')) {
      return res.status(401).json({ error: 'Invalid Gemini API key. Please check your .env file.' });
    }

    const detailMsg = err?.message || 'The AI audit engine encountered an error. Please try again shortly.';
    return res.status(500).json({
      error: detailMsg,
    });
  }
});

// --- Real-Time Stock Fundamentals & Live Pricing Route (NSE) ---
app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Stock symbol is required.' });
  }

  const rawUpper = symbol.trim().toUpperCase();
  const formattedSymbol =
    rawUpper.endsWith('.NS') || rawUpper.endsWith('.BO') ? rawUpper : `${rawUpper}.NS`;

  try {
    const summary = await yahooFinance.quoteSummary(formattedSymbol, {
      modules: ['price', 'defaultKeyStatistics', 'financialData', 'summaryDetail'],
    });

    const price = summary.price || {};
    const summaryDetail = summary.summaryDetail || {};
    const financialData = summary.financialData || {};
    const defaultKeyStats = summary.defaultKeyStatistics || {};

    const data = {
      symbol: formattedSymbol,
      name: price.shortName || price.longName || rawUpper,
      currency: price.currency || 'INR',
      regularMarketPrice: price.regularMarketPrice ?? null,
      regularMarketChange: price.regularMarketChange ?? null,
      regularMarketChangePercent: price.regularMarketChangePercent ?? null,
      marketCap: price.marketCap ?? summaryDetail.marketCap ?? null,
      trailingPE: summaryDetail.trailingPE ?? defaultKeyStats.trailingPE ?? null,
      returnOnEquity: financialData.returnOnEquity ?? defaultKeyStats.returnOnEquity ?? null,
      debtToEquity: financialData.debtToEquity ?? null,
      fiftyTwoWeekHigh: summaryDetail.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: summaryDetail.fiftyTwoWeekLow ?? null,
    };

    return res.json(data);
  } catch (err) {
    console.error(`[Stock API Error - ${formattedSymbol}]:`, err?.message || err);
    if (
      err?.message?.includes('not found') ||
      err?.message?.includes('404') ||
      err?.name === 'NotFoundError'
    ) {
      return res.status(404).json({ error: 'Symbol not found on NSE' });
    }
    return res.status(500).json({
      error: `Failed to fetch stock data for ${formattedSymbol}: ${err?.message || 'Unknown error'}`,
    });
  }
});

// --- Historical Crash & Price Data Route ---
app.get('/api/historical/:symbol/:startDate/:endDate', async (req, res) => {
  const { symbol, startDate, endDate } = req.params;
  if (!symbol || !startDate || !endDate) {
    return res.status(400).json({
      error: 'Symbol, startDate (YYYY-MM-DD), and endDate (YYYY-MM-DD) are required.',
    });
  }

  const rawUpper = symbol.trim().toUpperCase();
  const formattedSymbol =
    rawUpper.endsWith('.NS') || rawUpper.endsWith('.BO') ? rawUpper : `${rawUpper}.NS`;

  try {
    const historicalData = await yahooFinance.historical(formattedSymbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d',
    });

    if (!historicalData || historicalData.length === 0) {
      return res
        .status(404)
        .json({ error: 'Symbol not found on NSE or no data available for this period' });
    }

    const cleanData = historicalData.map((item) => ({
      date: item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      adjClose: item.adjClose,
      volume: item.volume,
    }));

    return res.json({
      symbol: formattedSymbol,
      startDate,
      endDate,
      count: cleanData.length,
      data: cleanData,
    });
  } catch (err) {
    console.error(`[Historical API Error - ${formattedSymbol}]:`, err?.message || err);
    if (
      err?.message?.includes('not found') ||
      err?.message?.includes('404') ||
      err?.name === 'NotFoundError'
    ) {
      return res.status(404).json({ error: 'Symbol not found on NSE' });
    }
    return res.status(500).json({
      error: `Failed to fetch historical data for ${formattedSymbol}: ${err?.message || 'Unknown error'}`,
    });
  }
});

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'FinSight Audit API', model: 'gemini-3.5-flash-lite' });
});

// --- Vite Middleware (MUST be after API routes) ---
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});
app.use(vite.middlewares);

app.listen(PORT, () => {
  console.log(`\n🟢 FinSight Unified Server running at http://localhost:${PORT}`);
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ Loaded' : '✗ Missing!'}\n`);
});
