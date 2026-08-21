// Using Alpha Vantage for Equities, MFAPI for Mutual Funds
const ALPHA_VANTAGE_KEY = (import.meta as any).env?.VITE_MARKET_DATA_API_KEY || 'NLG8IQ2UO7GNEOA0';

export interface MarketDataPoint {
  date: string;
  price: number;
}

export class MarketDataProvider {
  private static cache = new Map<string, MarketDataPoint[]>();

  static async getFundNAVHistory(schemeCode: string): Promise<MarketDataPoint[]> {
    if (this.cache.has(schemeCode)) return this.cache.get(schemeCode)!;
    
    try {
      const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
      const data = await response.json();
      if (!data || !data.data) throw new Error('Invalid MF data');
      
      const parsed = data.data.map((item: any) => {
        // Date is "DD-MM-YYYY" from mfapi
        const parts = item.date.split('-');
        return {
          date: `${parts[2]}-${parts[1]}-${parts[0]}`,
          price: parseFloat(item.nav)
        };
      }).reverse(); // Sort oldest to newest usually

      this.cache.set(schemeCode, parsed);
      return parsed;
    } catch (e) {
      console.error('MFAPI fetch failed:', e);
      return [];
    }
  }

  static async getHistoricalPrices(symbol: string): Promise<MarketDataPoint[]> {
    if (this.cache.has(symbol)) return this.cache.get(symbol)!;
    
    try {
      // Using TIME_SERIES_MONTHLY for long term decisions
      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`);
      const data = await response.json();
      const timeSeries = data['Monthly Time Series'];
      if (!timeSeries) throw new Error('Invalid AlphaVantage data');
      
      const parsed: MarketDataPoint[] = Object.keys(timeSeries).map(date => ({
        date,
        price: parseFloat(timeSeries[date]['4. close'])
      })).sort((a, b) => a.date.localeCompare(b.date)); // Oldest to newest
      
      this.cache.set(symbol, parsed);
      return parsed;
    } catch (e) {
      console.error('AlphaVantage fetch failed:', e);
      return [];
    }
  }
}
