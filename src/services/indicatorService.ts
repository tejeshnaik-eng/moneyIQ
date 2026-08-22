import { OHLCV } from './marketDataService';

export class IndicatorService {
  static calculateSMA(data: number[], period: number): (number | null)[] {
    const sma: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j];
        }
        sma.push(sum / period);
      }
    }
    return sma;
  }

  static calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(data[0]);
      } else {
        const current = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
        ema.push(current);
      }
    }
    return ema;
  }

  static calculateRSI(data: number[], period: number = 14): (number | null)[] {
    const rsi: (number | null)[] = [];
    let gains = 0;
    let losses = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        rsi.push(null);
        continue;
      }
      
      const diff = data[i] - data[i - 1];
      if (i <= period) {
        if (diff > 0) gains += diff;
        else losses -= diff;
        
        if (i === period) {
          let avgGain = gains / period;
          let avgLoss = losses / period;
          let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
          rsi.push(100 - (100 / (1 + rs)));
        } else {
          rsi.push(null);
        }
      } else {
        const avgGain = (gains * (period - 1) + (diff > 0 ? diff : 0)) / period;
        const avgLoss = (losses * (period - 1) + (diff < 0 ? -diff : 0)) / period;
        
        gains = avgGain;
        losses = avgLoss;
        
        let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    return rsi;
  }

  static calculateMACD(data: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const fastEma = this.calculateEMA(data, fastPeriod);
    const slowEma = this.calculateEMA(data, slowPeriod);
    const macdLine: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (fastEma[i] === null || slowEma[i] === null) {
        macdLine.push(null);
      } else {
        macdLine.push(fastEma[i] - slowEma[i]);
      }
    }
    
    // Filter out nulls for signal calculation
    const validMacdLine = macdLine.filter((m): m is number => m !== null);
    const signalEma = this.calculateEMA(validMacdLine, signalPeriod);
    
    const signalLine: (number | null)[] = [];
    let signalIdx = 0;
    const histogram: (number | null)[] = [];
    
    for (let i = 0; i < data.length; i++) {
      if (macdLine[i] === null) {
        signalLine.push(null);
        histogram.push(null);
      } else {
        const sig = signalEma[signalIdx++];
        signalLine.push(sig);
        histogram.push((macdLine[i] as number) - sig);
      }
    }
    
    return { macdLine, signalLine, histogram };
  }

  static calculatePivotPoints(high: number, low: number, close: number) {
    const pivot = (high + low + close) / 3;
    const r1 = (2 * pivot) - low;
    const s1 = (2 * pivot) - high;
    const r2 = pivot + (high - low);
    const s2 = pivot - (high - low);
    const r3 = high + 2 * (pivot - low);
    const s3 = low - 2 * (high - pivot);
    
    return { pivot, r1, r2, r3, s1, s2, s3 };
  }
}
