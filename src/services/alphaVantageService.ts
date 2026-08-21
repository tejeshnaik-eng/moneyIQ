/**
 * Stock Quote Service — Routes through our secure Express backend (/api/stock/:symbol)
 * Backed by yahoo-finance2 on the server. No API keys exposed to the browser.
 */

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: string;
  marketCap: number | null;
  trailingPE: number | null;
  returnOnEquity: number | null;
  debtToEquity: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
}

const MEMORY_CACHE: Record<string, { data: StockQuote; timestamp: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5-minute live cache

export class AlphaVantageService {
  /**
   * Fetches live quote for an NSE stock symbol via our Express backend.
   * Symbol can be bare (e.g. "RELIANCE") or suffixed (e.g. "RELIANCE.NS").
   */
  static async getQuote(symbol: string): Promise<StockQuote | null> {
    const sym = symbol.trim().toUpperCase();

    // Check memory cache
    const cached = MEMORY_CACHE[sym];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const res = await fetch(`/api/stock/${encodeURIComponent(sym)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`[StockQuoteService] ${res.status} for ${sym}:`, err.error || 'Unknown error');
        return null;
      }
      const data = await res.json();

      const quote: StockQuote = {
        symbol: data.symbol,
        name: data.name || sym,
        price: data.regularMarketPrice ?? 0,
        open: data.regularMarketPrice ?? 0,
        high: data.fiftyTwoWeekHigh ?? 0,
        low: data.fiftyTwoWeekLow ?? 0,
        volume: 0,
        latestTradingDay: new Date().toISOString().split('T')[0],
        previousClose: data.regularMarketPrice
          ? data.regularMarketPrice - (data.regularMarketChange ?? 0)
          : 0,
        change: data.regularMarketChange ?? 0,
        changePercent: data.regularMarketChangePercent != null
          ? `${(data.regularMarketChangePercent * 100).toFixed(2)}%`
          : '0.00%',
        marketCap: data.marketCap ?? null,
        trailingPE: data.trailingPE ?? null,
        returnOnEquity: data.returnOnEquity ?? null,
        debtToEquity: data.debtToEquity ?? null,
        fiftyTwoWeekHigh: data.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: data.fiftyTwoWeekLow ?? null,
      };

      MEMORY_CACHE[sym] = { data: quote, timestamp: Date.now() };
      return quote;
    } catch (e) {
      console.error(`[StockQuoteService] Request failed for ${sym}:`, e);
      return null;
    }
  }
}
