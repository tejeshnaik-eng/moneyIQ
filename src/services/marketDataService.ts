export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  symbol: string;
  companyName: string;
  exchange: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  history: OHLCV[];
  // Extended fundamentals (marked optional because they might be unavailable)
  marketCap?: number;
  peRatio?: number;
  pbRatio?: number;
  eps?: number;
  dividendYield?: number;
  bookValue?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  dayHigh?: number;
  dayLow?: number;
}

export class MarketDataService {
  private static cache: Record<string, StockData> = {};

  static async getStockData(symbol: string): Promise<StockData | null> {
    if (this.cache[symbol]) return this.cache[symbol];
    try {
      const res = await fetch(`/market-data/${symbol}.json`);
      if (!res.ok) throw new Error('Data unavailable');
      const data: StockData = await res.json();
      
      // Calculate missing values if possible
      data.dayHigh = Math.max(...data.history.slice(-1).map(h => h.high));
      data.dayLow = Math.min(...data.history.slice(-1).map(h => h.low));
      const last52Weeks = data.history.slice(-252); // Approx 252 trading days in a year
      if (last52Weeks.length > 0) {
        data.fiftyTwoWeekHigh = Math.max(...last52Weeks.map(h => h.high));
        data.fiftyTwoWeekLow = Math.min(...last52Weeks.map(h => h.low));
      }

      // Add full company names for standard symbols
      const names: Record<string, string> = {
        'HDFCBANK': 'HDFC Bank',
        'RELIANCE': 'Reliance Industries',
        'TCS': 'Tata Consultancy Services',
        'INFY': 'Infosys',
        'ICICIBANK': 'ICICI Bank'
      };
      if (names[symbol]) {
        data.companyName = names[symbol];
      }

      this.cache[symbol] = data;
      return data;
    } catch (e) {
      console.warn(`Failed to fetch market data for ${symbol}`);
      return null;
    }
  }

  static async searchSymbols(query: string): Promise<{symbol: string, name: string}[]> {
    const available = [
      {symbol: 'HDFCBANK', name: 'HDFC Bank'},
      {symbol: 'RELIANCE', name: 'Reliance Industries'},
      {symbol: 'TCS', name: 'Tata Consultancy Services'},
      {symbol: 'INFY', name: 'Infosys'},
      {symbol: 'ICICIBANK', name: 'ICICI Bank'}
    ];
    if (!query) return available;
    const q = query.toLowerCase();
    return available.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }
}
