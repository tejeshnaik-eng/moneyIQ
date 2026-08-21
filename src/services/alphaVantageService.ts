/**
 * Alpha Vantage Real Equity & ETF Service
 * API Key: NLG8IQ2UO7GNEOA0
 * Provides real-time quotes, day high/low, and daily time-series for Indian (BSE/NSE) and global equities.
 */

export interface StockQuote {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: string;
}

const API_KEY = 'NLG8IQ2UO7GNEOA0';
const MEMORY_CACHE: Record<string, { data: StockQuote; timestamp: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes live cache

export class AlphaVantageService {
  /**
   * Fetches real-time quote for a stock or ETF symbol (e.g. RELIANCE.BSE, HDFCBANK.BSE, INFY.BSE).
   */
  static async getQuote(symbol: string): Promise<StockQuote | null> {
    const sym = symbol.toUpperCase().includes('.') ? symbol.toUpperCase() : `${symbol.toUpperCase()}.BSE`;
    
    // Check memory cache
    const cached = MEMORY_CACHE[sym];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(sym)}&apikey=${API_KEY}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json['Global Quote'] && json['Global Quote']['05. price']) {
          const gq = json['Global Quote'];
          const quote: StockQuote = {
            symbol: gq['01. symbol'] || sym,
            price: parseFloat(gq['05. price']),
            open: parseFloat(gq['02. open'] || '0'),
            high: parseFloat(gq['03. high'] || '0'),
            low: parseFloat(gq['04. low'] || '0'),
            volume: parseInt(gq['06. volume'] || '0'),
            latestTradingDay: gq['07. latest trading day'] || new Date().toISOString().split('T')[0],
            previousClose: parseFloat(gq['08. previous close'] || gq['05. price']),
            change: parseFloat(gq['09. change'] || '0'),
            changePercent: gq['10. change percent'] || '0.00%',
          };

          MEMORY_CACHE[sym] = { data: quote, timestamp: Date.now() };
          return quote;
        }
      }
    } catch (e) {
      console.warn(`[AlphaVantage] Live API fetch failed for ${sym}, checking local snapshot...`, e);
    }

    // Fallback to local snapshot data
    try {
      const snapshotRes = await fetch('/data/latest-market-data.json');
      if (snapshotRes.ok) {
        const snapshot = await snapshotRes.json();
        if (snapshot.equities && snapshot.equities[sym]) {
          return snapshot.equities[sym];
        }
      }
    } catch (err) {
      console.error('[AlphaVantage] Failed to load local snapshot:', err);
    }

    return null;
  }
}
