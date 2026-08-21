import React, { useState, useEffect } from 'react';
import { MarketDataProvider } from '../../../services/marketDataProvider';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoricalReplayProps {
  initialInstrument?: string;
}

export default function HistoricalReplay({ initialInstrument = 'BSE:SENSEX' }: HistoricalReplayProps) {
  const [instrument, setInstrument] = useState(initialInstrument);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would use actual dates. 
      // For the hackathon/demo, we assume the provider handles it or returns mock data.
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0];
      
      let historicalData = await MarketDataProvider.getHistoricalPrices(instrument);
      
      // Fallback for MF API if it's a number (scheme code)
      if (historicalData.length === 0 && /^\d+$/.test(instrument)) {
        historicalData = await MarketDataProvider.getFundNAVHistory(instrument);
      }
      
      // Transform data for Recharts
      if (historicalData && historicalData.length > 0) {
        const formattedData = historicalData.map((item: any) => ({
          date: item.date || item.timestamp,
          value: item.close || item.nav || item.price,
        })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setData(formattedData);
      } else {
        setError('No data found for this instrument');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const startValue = data.length > 0 ? data[0].value : 0;
  const endValue = data.length > 0 ? data[data.length - 1].value : 0;
  const growthPercent = startValue > 0 ? ((endValue - startValue) / startValue * 100).toFixed(2) : 0;

  return (
    <div className="bg-[var(--app-surface)] rounded-xl shadow-sm border p-4">
      <div className="mb-4">
        <h3 className="font-heading text-2xl text-slate-800">Historical Replay</h3>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Instrument Symbol / Code</label>
            <div className="flex gap-2">
              <input 
                className="input-field text-sm w-full p-2 border rounded"
                value={instrument}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstrument(e.target.value)}
                placeholder="e.g., BSE:SENSEX or 120503"
              />
              <button 
                onClick={fetchHistory} 
                disabled={loading} 
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded"
              >
                {loading ? 'Loading...' : 'Load'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Try BSE:SENSEX for NIFTY 50 or MF Scheme code</p>
          </div>
          
          {data.length > 0 && (
            <div className="flex-1 flex justify-end">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right">
                <p className="text-sm text-gray-500">5-Year Growth</p>
                <p className={`font-heading text-2xl font-bold ${Number(growthPercent) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {Number(growthPercent) >= 0 ? '+' : ''}{growthPercent}%
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="h-80 w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val: any) => {
                    const date = new Date(val);
                    return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2)}`;
                  }}
                  minTickGap={30}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  labelFormatter={(val: any) => new Date(val).toLocaleDateString()}
                  formatter={(val: any) => [Number(val).toFixed(2), 'Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0f172a" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
              Enter an instrument and click Load
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
