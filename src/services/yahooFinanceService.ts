/**
 * Yahoo Finance Real Market Index & Crisis History Service
 * Fetches real chart data for Nifty 50 (^NSEI), Sensex (^BSESN), NiftyBees ETF, and GoldBees ETF.
 */

export interface IndexPricePoint {
  date: string;
  close: number;
}

export interface IndexDetails {
  symbol: string;
  currency: string;
  regularMarketPrice: number;
  chartPreviousClose: number;
  history: IndexPricePoint[];
}

export interface CrisisHistoryData {
  title: string;
  peakClose: number;
  troughClose: number;
  drawdownPercentage: number;
  timeline: IndexPricePoint[];
}

export class YahooFinanceService {
  /**
   * Fetches latest index quote and price history.
   */
  static async getIndexData(symbol: string = '^NSEI'): Promise<IndexDetails | null> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.chart?.result?.[0]) {
          const item = json.chart.result[0];
          const meta = item.meta;
          const closes: (number | null)[] = item.indicators.quote[0].close || [];
          const timestamps: number[] = item.timestamp || [];

          return {
            symbol: meta.symbol,
            currency: meta.currency,
            regularMarketPrice: meta.regularMarketPrice,
            chartPreviousClose: meta.chartPreviousClose,
            history: timestamps.map((ts, idx) => ({
              date: new Date(ts * 1000).toISOString().split('T')[0],
              close: closes[idx] !== null ? parseFloat(closes[idx]!.toFixed(2)) : 0,
            })).filter(h => h.close > 0),
          };
        }
      }
    } catch (e) {
      console.warn(`[YahooFinanceService] Live query failed for ${symbol}, checking local snapshot...`, e);
    }

    // Fallback to local snapshot
    try {
      const snapshotRes = await fetch('/data/latest-market-data.json');
      if (snapshotRes.ok) {
        const snapshot = await snapshotRes.json();
        if (snapshot.indices && snapshot.indices[symbol]) {
          return snapshot.indices[symbol];
        }
      }
    } catch (err) {
      console.error('[YahooFinanceService] Failed to load local snapshot:', err);
    }

    return null;
  }

  /**
   * Retrieves authentic historical timeline of the March 2020 Covid crash.
   */
  static async getCovidCrashTimeline(): Promise<CrisisHistoryData | null> {
    try {
      const snapshotRes = await fetch('/data/latest-market-data.json');
      if (snapshotRes.ok) {
        const snapshot = await snapshotRes.json();
        if (snapshot.indices && snapshot.indices['COVID_CRASH_2020']) {
          return snapshot.indices['COVID_CRASH_2020'];
        }
      }
    } catch (e) {
      console.error('[YahooFinanceService] Failed to load Covid crash timeline:', e);
    }

    // Default authentic points if offline
    return {
      title: 'Covid 2020 Crash Timeline',
      peakClose: 12201.20,
      troughClose: 7610.25,
      drawdownPercentage: -37.63,
      timeline: [
        { date: '2020-02-03', close: 12089.15 },
        { date: '2020-02-14', close: 12113.45 },
        { date: '2020-02-28', close: 11201.75 },
        { date: '2020-03-09', close: 10451.45 },
        { date: '2020-03-16', close: 9197.40 },
        { date: '2020-03-23', close: 7610.25 },
        { date: '2020-03-31', close: 8597.75 },
        { date: '2020-04-15', close: 8925.30 },
        { date: '2020-04-30', close: 9859.90 },
      ],
    };
  }
}
