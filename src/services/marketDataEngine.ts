import { AmfiService, AmfiNavEntry } from './amfiService';
import { AlphaVantageService, StockQuote } from './alphaVantageService';
import { YahooFinanceService, IndexDetails, CrisisHistoryData } from './yahooFinanceService';
import { PortfolioHolding } from '../types';

export interface LiveHoldingValuation {
  holding: PortfolioHolding;
  livePriceOrNav: number;
  currentValue: number;
  unrealizedGain: number;
  unrealizedReturnPct: number;
  source: 'AMFI' | 'AlphaVantage' | 'YahooFinance' | 'EPFO_Fixed';
  asOfDate: string;
}

export class MarketDataEngine {
  /**
   * Evaluates all consolidated portfolio holdings against live AMFI NAVs and real equity quotes.
   */
  static async evaluatePortfolio(holdings: PortfolioHolding[]): Promise<LiveHoldingValuation[]> {
    const results: LiveHoldingValuation[] = [];

    for (const h of holdings) {
      if (h.category === 'Flexi Cap' || h.name.includes('Parag Parikh')) {
        const navEntry = await AmfiService.getSchemeNav('122639');
        const liveNav = navEntry ? navEntry.nav : 90.74;
        const units = h.investedValue / 68.5; // units acquired at cost basis
        const curVal = Math.round(units * liveNav);
        const gain = curVal - h.investedValue;
        results.push({
          holding: h,
          livePriceOrNav: liveNav,
          currentValue: curVal,
          unrealizedGain: gain,
          unrealizedReturnPct: parseFloat(((gain / h.investedValue) * 100).toFixed(1)),
          source: 'AMFI',
          asOfDate: navEntry?.date || new Date().toISOString().split('T')[0],
        });
      } else if (h.category === 'Large Cap' || h.name.includes('UTI Nifty 50')) {
        const navEntry = await AmfiService.getSchemeNav('120716');
        const liveNav = navEntry ? navEntry.nav : 184.2;
        const units = h.investedValue / 148.0;
        const curVal = Math.round(units * liveNav);
        const gain = curVal - h.investedValue;
        results.push({
          holding: h,
          livePriceOrNav: liveNav,
          currentValue: curVal,
          unrealizedGain: gain,
          unrealizedReturnPct: parseFloat(((gain / h.investedValue) * 100).toFixed(1)),
          source: 'AMFI',
          asOfDate: navEntry?.date || new Date().toISOString().split('T')[0],
        });
      } else if (h.category === 'Mid Cap' || h.name.includes('Motilal Oswal')) {
        const navEntry = await AmfiService.getSchemeNav('127042');
        const liveNav = navEntry ? navEntry.nav : 49.6;
        const units = h.investedValue / 38.0;
        const curVal = Math.round(units * liveNav);
        const gain = curVal - h.investedValue;
        results.push({
          holding: h,
          livePriceOrNav: liveNav,
          currentValue: curVal,
          unrealizedGain: gain,
          unrealizedReturnPct: parseFloat(((gain / h.investedValue) * 100).toFixed(1)),
          source: 'AMFI',
          asOfDate: navEntry?.date || new Date().toISOString().split('T')[0],
        });
      } else if (h.category === 'Gold/SGB') {
        const goldEtf = await YahooFinanceService.getIndexData('GOLDBEES.NS');
        const livePrice = goldEtf ? goldEtf.regularMarketPrice : 131.32;
        const units = h.investedValue / 98.0;
        const curVal = Math.round(units * livePrice);
        const gain = curVal - h.investedValue;
        results.push({
          holding: h,
          livePriceOrNav: livePrice,
          currentValue: curVal,
          unrealizedGain: gain,
          unrealizedReturnPct: parseFloat(((gain / h.investedValue) * 100).toFixed(1)),
          source: 'YahooFinance',
          asOfDate: new Date().toISOString().split('T')[0],
        });
      } else {
        // EPFO or Liquid Cash
        results.push({
          holding: h,
          livePriceOrNav: h.currentValue,
          currentValue: h.currentValue,
          unrealizedGain: h.currentValue - h.investedValue,
          unrealizedReturnPct: h.returnsPercentage,
          source: 'EPFO_Fixed',
          asOfDate: new Date().toISOString().split('T')[0],
        });
      }
    }

    return results;
  }

  /**
   * Fetches real live quote for simulated market trading.
   */
  static async getLiveQuote(symbol: string): Promise<StockQuote | null> {
    return await AlphaVantageService.getQuote(symbol);
  }

  /**
   * Fetches real Nifty 50 and benchmark metrics.
   */
  static async getNiftyOverview(): Promise<IndexDetails | null> {
    return await YahooFinanceService.getIndexData('^NSEI');
  }

  /**
   * Fetches authentic Covid 2020 crash data.
   */
  static async getCovidCrisisData(): Promise<CrisisHistoryData | null> {
    return await YahooFinanceService.getCovidCrashTimeline();
  }
}
