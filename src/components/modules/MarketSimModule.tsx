import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Play, StepForward, TrendingUp, TrendingDown, 
  Activity, BookOpen, Calendar, PieChart, Info, DollarSign,
  Briefcase, LineChart, BarChart2, Terminal
} from 'lucide-react';
import { MarketDataService, StockData, OHLCV } from '../../services/marketDataService';
import { IndicatorService } from '../../services/indicatorService';

type Mode = 'RESEARCH' | 'SIMULATE';
type Tab = 'Overview' | 'Technicals' | 'News' | 'Events' | 'F&O';

const Tooltip = ({ children, content }: { children: React.ReactNode, content: string }) => {
  return (
    <div className="relative inline-flex flex-col items-center group cursor-help">
      <span className="border-b border-dashed border-[#6E7C75]/50">{children}</span>
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-[250px] bg-[#1A1A1A] text-[#F2F7F4] text-xs p-2 rounded shadow-lg border border-[#6E7C75]/20 z-[100] whitespace-normal text-left">
        {content}
      </div>
    </div>
  );
};

// Custom SVG Chart
function FinancialChart({ data, width, height, type }: { data: OHLCV[]; width: number; height: number; type: 'line' | 'candlestick' }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return <div className="flex h-full items-center justify-center text-[#A7B5AE]">No chart data available</div>;

  const margin = { top: 20, right: 50, bottom: 30, left: 20 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...data.map(d => d.volume));

  const numCandles = data.length;
  const candleWidth = Math.max((chartWidth / numCandles) * 0.8, 1);
  const candleSpacing = chartWidth / numCandles;

  const getY = (price: number) => chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  const getVolY = (vol: number) => chartHeight - (vol / maxVolume) * (chartHeight * 0.2);

  const isUpOverall = data[data.length - 1].close >= data[0].close;
  const lineColor = isUpOverall ? '#20EFA0' : '#FF5B5B';
  const firstCloseY = getY(data[0].close);

  const linePath = data.map((d, i) => {
    const x = i * candleSpacing + candleSpacing / 2;
    const y = getY(d.close);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="relative w-full h-full select-none" onMouseLeave={() => setHoveredIndex(null)}>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = chartHeight * tick;
            const price = maxPrice - tick * priceRange;
            return (
              <g key={tick}>
                <line x1={0} x2={chartWidth} y1={y} y2={y} stroke="#111916" strokeWidth={1} />
                <text x={chartWidth + 5} y={y + 4} fill="#6E7C75" fontSize={10} fontFamily="Hedvig Letters Sans">
                  {price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {type === 'line' ? (
            <g>
              <line x1={0} x2={chartWidth} y1={firstCloseY} y2={firstCloseY} stroke={lineColor} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
              <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} />
              {/* Interaction areas for line chart */}
              {data.map((d, i) => {
                const x = i * candleSpacing + candleSpacing / 2;
                return (
                  <rect
                    key={i}
                    x={x - candleSpacing / 2}
                    y={0}
                    width={candleSpacing}
                    height={chartHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(i)}
                    className="cursor-crosshair"
                  />
                );
              })}
            </g>
          ) : (
            /* Candles */
            data.map((d, i) => {
              const x = i * candleSpacing + candleSpacing / 2;
              const isUp = d.close >= d.open;
              const color = isUp ? '#20EFA0' : '#FF5B5B';
              
              const highY = getY(d.high);
              const lowY = getY(d.low);
              const openY = getY(d.open);
              const closeY = getY(d.close);
              const topY = Math.min(openY, closeY);
              const bottomY = Math.max(openY, closeY);
              const bodyHeight = Math.max(bottomY - topY, 1);

              return (
                <g 
                  key={i} 
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="cursor-crosshair"
                >
                  {/* Volume */}
                  <rect 
                    x={x - candleWidth / 2} 
                    y={getVolY(d.volume)} 
                    width={candleWidth} 
                    height={chartHeight - getVolY(d.volume)} 
                    fill={color} 
                    opacity={0.3} 
                  />
                  
                  {/* Wick */}
                  <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} strokeWidth={1} />
                  
                  {/* Body */}
                  <rect 
                    x={x - candleWidth / 2} 
                    y={topY} 
                    width={candleWidth} 
                    height={bodyHeight} 
                    fill={isUp ? '#080B0A' : color}
                    stroke={color}
                    strokeWidth={1}
                  />

                  {/* Hover Interaction Area */}
                  <rect
                    x={x - candleSpacing / 2}
                    y={0}
                    width={candleSpacing}
                    height={chartHeight}
                    fill="transparent"
                  />
                </g>
              );
            })
          )}

          {/* Hover Overlay */}
          {hoveredIndex !== null && (
            <g>
              <line 
                x1={hoveredIndex * candleSpacing + candleSpacing / 2}
                x2={hoveredIndex * candleSpacing + candleSpacing / 2}
                y1={0}
                y2={chartHeight}
                stroke="#A7B5AE"
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.5}
              />
              {type === 'line' && (
                <circle
                  cx={hoveredIndex * candleSpacing + candleSpacing / 2}
                  cy={getY(data[hoveredIndex].close)}
                  r={4}
                  fill={lineColor}
                />
              )}
            </g>
          )}
        </g>
      </svg>
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div className="absolute top-2 right-2 bg-[#111916] text-[#A7B5AE] text-xs p-2 rounded shadow flex space-x-3 font-['Hedvig_Letters_Sans'] border border-[#20EFA0]/20 z-10">
          <span className="text-[#F2F7F4]">{new Date(data[hoveredIndex].time).toLocaleDateString()}</span>
          <span>O: <span className="text-[#F2F7F4]">{data[hoveredIndex].open.toFixed(2)}</span></span>
          <span>H: <span className="text-[#F2F7F4]">{data[hoveredIndex].high.toFixed(2)}</span></span>
          <span>L: <span className="text-[#F2F7F4]">{data[hoveredIndex].low.toFixed(2)}</span></span>
          <span>C: <span className="text-[#F2F7F4]">{data[hoveredIndex].close.toFixed(2)}</span></span>
          <span>V: <span className="text-[#F2F7F4]">{(data[hoveredIndex].volume / 1000).toFixed(1)}k</span></span>
        </div>
      )}
    </div>
  );
}

export const MarketSimModule: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('HDFCBANK');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{symbol: string, name: string}[]>([]);
  const [mode, setMode] = useState<Mode>('RESEARCH');
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [timeframe, setTimeframe] = useState('1Y');

  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation State
  const [simCapital, setSimCapital] = useState(100000);
  const [simCash, setSimCash] = useState(100000);
  const [simShares, setSimShares] = useState(0);
  const [simIndex, setSimIndex] = useState(0);
  const [tradeQuantity, setTradeQuantity] = useState(10);

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setChartDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchSearch = async () => {
      const results = await MarketDataService.searchSymbols(searchQuery);
      if (active) setSearchResults(results);
    };
    fetchSearch();
    return () => { active = false; };
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      const data = await MarketDataService.getStockData(selectedSymbol);
      if (active) {
        setStockData(data);
        setSimIndex(Math.max(0, (data?.history.length || 0) - 100)); // start 100 days ago for simulation
        setLoading(false);
      }
    };
    loadData();
    return () => { active = false; };
  }, [selectedSymbol]);

  const displayedHistory = useMemo(() => {
    if (!stockData) return [];
    const base = mode === 'RESEARCH' ? stockData.history : stockData.history.slice(0, simIndex + 1);
    if (!base || base.length === 0) return [];
    
    let points = base.length;
    switch(timeframe) {
      case '1D': points = 2; break;
      case '1W': points = 5; break;
      case '1M': points = 21; break;
      case '3M': points = 63; break;
      case '6M': points = 126; break;
      case '1Y': points = 252; break;
      case '3Y': points = 756; break;
      case '5Y': points = 1260; break;
      case 'All': points = base.length; break;
    }
    return base.slice(Math.max(0, base.length - points));
  }, [stockData, mode, simIndex, timeframe]);

  const currentDayData = displayedHistory[displayedHistory.length - 1];
  const simPortfolioValue = simCash + (simShares * (currentDayData?.close || 0));

  const handleStepForward = () => {
    if (stockData && simIndex < stockData.history.length - 1) {
      setSimIndex(prev => prev + 1);
    }
  };

  const handleBuy = () => {
    if (!currentDayData) return;
    const cost = currentDayData.close * tradeQuantity;
    if (simCash >= cost) {
      setSimCash(prev => prev - cost);
      setSimShares(prev => prev + tradeQuantity);
    }
  };

  const handleSell = () => {
    if (!currentDayData) return;
    if (simShares >= tradeQuantity) {
      const revenue = currentDayData.close * tradeQuantity;
      setSimCash(prev => prev + revenue);
      setSimShares(prev => prev - tradeQuantity);
    }
  };

  const renderTabContent = () => {
    if (loading) return <div className="p-4 text-[#A7B5AE]">Loading data...</div>;
    if (!stockData || !currentDayData) return <div className="p-4 text-[#A7B5AE]">No data available</div>;

    if (activeTab === 'Overview') {
      const last252 = displayedHistory.slice(-252);
      const w52High = Math.max(...last252.map(d => d.high), stockData.fiftyTwoWeekHigh || 0);
      const w52Low = Math.min(...last252.map(d => d.low), stockData.fiftyTwoWeekLow || currentDayData.close);
      
      const todayHigh = currentDayData.high;
      const todayLow = currentDayData.low;
      const currentPrice = currentDayData.close;
      const prevClose = stockData.previousClose || (displayedHistory.length > 1 ? displayedHistory[displayedHistory.length - 2].close : currentPrice);
      const lowerCircuit = prevClose * 0.9;
      const upperCircuit = prevClose * 1.1;

      const getProgress = (min: number, max: number, val: number) => {
        if (max === min) return 50;
        const p = ((val - min) / (max - min)) * 100;
        return Math.max(0, Math.min(100, p));
      };

      return (
        <div className="p-6 space-y-6 font-['Outfit'] pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Performance */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-[#F2F7F4]">
                <Tooltip content="Price range over specific periods">Performance</Tooltip>
              </h3>
              <div className="bg-[#111916] rounded-lg p-5 border border-[#6E7C75]/20 space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <div><p className="text-[#6E7C75]">Today's Low</p><p className="text-[#F2F7F4] font-medium">₹{todayLow.toFixed(2)}</p></div>
                    <div className="text-right"><p className="text-[#6E7C75]">Today's High</p><p className="text-[#F2F7F4] font-medium">₹{todayHigh.toFixed(2)}</p></div>
                  </div>
                  <div className="relative h-2 bg-[#2A2A2A] rounded-full">
                    <div className="absolute top-0 bottom-0 left-0 bg-[#20EFA0] rounded-full" style={{width: '100%'}}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F2F7F4] rotate-45 border-2 border-[#111916]" style={{ left: `calc(${getProgress(todayLow, todayHigh, currentPrice)}% - 6px)`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <div><p className="text-[#6E7C75]">52W Low</p><p className="text-[#F2F7F4] font-medium">₹{w52Low.toFixed(2)}</p></div>
                    <div className="text-right"><p className="text-[#6E7C75]">52W High</p><p className="text-[#F2F7F4] font-medium">₹{w52High.toFixed(2)}</p></div>
                  </div>
                  <div className="relative h-2 bg-[#2A2A2A] rounded-full">
                    <div className="absolute top-0 bottom-0 left-0 bg-[#20EFA0] rounded-full" style={{width: '100%'}}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F2F7F4] rotate-45 border-2 border-[#111916]" style={{ left: `calc(${getProgress(w52Low, w52High, currentPrice)}% - 6px)`}}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#6E7C75]/20 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div><p className="text-[#6E7C75] text-xs">Open</p><p className="text-[#F2F7F4] text-sm font-medium">{currentDayData.open.toFixed(2)}</p></div>
                  <div><p className="text-[#6E7C75] text-xs">Prev. Close</p><p className="text-[#F2F7F4] text-sm font-medium">{prevClose.toFixed(2)}</p></div>
                  <div><p className="text-[#6E7C75] text-xs">Volume</p><p className="text-[#F2F7F4] text-sm font-medium">{(currentDayData.volume/1000).toFixed(2)}k</p></div>
                  <div><p className="text-[#6E7C75] text-xs">Lower Circuit</p><p className="text-[#F2F7F4] text-sm font-medium">{lowerCircuit.toFixed(2)}</p></div>
                  <div><p className="text-[#6E7C75] text-xs">Upper Circuit</p><p className="text-[#F2F7F4] text-sm font-medium">{upperCircuit.toFixed(2)}</p></div>
                </div>
              </div>

              <h3 className="text-lg font-medium text-[#F2F7F4] mt-6">
                <Tooltip content="Core financial metrics of the company">Fundamentals</Tooltip>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111916] p-4 rounded-lg border border-[#6E7C75]/20 flex justify-between">
                  <Tooltip content="Total market value of a company's outstanding shares"><span className="text-[#6E7C75] text-sm">Market Cap</span></Tooltip>
                  <span className="text-[#F2F7F4] font-medium">{stockData.marketCap ? `₹${(stockData.marketCap / 10000000).toFixed(2)}Cr` : 'N/A'}</span>
                </div>
                <div className="bg-[#111916] p-4 rounded-lg border border-[#6E7C75]/20 flex justify-between">
                  <Tooltip content="Price-to-Earnings ratio"><span className="text-[#6E7C75] text-sm">P/E Ratio</span></Tooltip>
                  <span className="text-[#F2F7F4] font-medium">{stockData.peRatio?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="bg-[#111916] p-4 rounded-lg border border-[#6E7C75]/20 flex justify-between">
                  <Tooltip content="Return on Equity"><span className="text-[#6E7C75] text-sm">ROE</span></Tooltip>
                  <span className="text-[#F2F7F4] font-medium">{'N/A'}</span>
                </div>
                <div className="bg-[#111916] p-4 rounded-lg border border-[#6E7C75]/20 flex justify-between">
                  <Tooltip content="Annual dividend payment relative to stock price"><span className="text-[#6E7C75] text-sm">Dividend Yield</span></Tooltip>
                  <span className="text-[#F2F7F4] font-medium">{'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Market Depth */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#F2F7F4]">
                <Tooltip content="Real-time list of buy and sell orders">Market depth</Tooltip>
              </h3>
              <div className="bg-[#111916] rounded-lg p-5 border border-[#6E7C75]/20">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#20EFA0]">0.0% Buy</span>
                  <span className="text-[#FF5B5B]">0.0% Sell</span>
                </div>
                <div className="flex h-2 bg-[#2A2A2A] rounded-full mb-6 overflow-hidden">
                  <div className="bg-[#20EFA0]" style={{width: '50%'}}></div>
                  <div className="bg-[#FF5B5B]" style={{width: '50%'}}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="grid grid-cols-2 text-[#6E7C75] mb-2"><span className="text-left">Bid</span><span className="text-right">Qty</span></div>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="grid grid-cols-2 text-[#F2F7F4] mb-2"><span className="text-left">0.00</span><span className="text-right">0</span></div>
                    ))}
                    <div className="grid grid-cols-2 text-[#20EFA0] mt-4 font-medium"><span className="text-left">Total</span><span className="text-right">0</span></div>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 text-[#6E7C75] mb-2"><span className="text-left">Ask</span><span className="text-right">Qty</span></div>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="grid grid-cols-2 text-[#F2F7F4] mb-2"><span className="text-left">0.00</span><span className="text-right">0</span></div>
                    ))}
                    <div className="grid grid-cols-2 text-[#FF5B5B] mt-4 font-medium"><span className="text-left">Total</span><span className="text-right">0</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }

    if (activeTab === 'Technicals') {
      const closes = displayedHistory.map(d => d.close);
      const rsi = IndicatorService.calculateRSI(closes, 14);
      const currentRSI = rsi[rsi.length - 1];
      const sma20 = IndicatorService.calculateSMA(closes, 20);
      const currentSMA = sma20[sma20.length - 1];
      
      let rsiSignal = 'Neutral';
      let rsiColor = '#A7B5AE';
      if (currentRSI !== null) {
        if (currentRSI > 70) { rsiSignal = 'Overbought'; rsiColor = '#FF5B5B'; }
        else if (currentRSI < 30) { rsiSignal = 'Oversold'; rsiColor = '#20EFA0'; }
      }

      return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-['Outfit']">
          <div className="bg-[#111916] p-5 rounded-lg border border-[#6E7C75]/20 flex items-center justify-between">
            <div>
              <p className="text-[#6E7C75] text-sm mb-1">
                <Tooltip content="Relative Strength Index - momentum oscillator">RSI (14)</Tooltip>
              </p>
              <p className="text-[#F2F7F4] text-3xl font-medium">{currentRSI?.toFixed(2) || 'N/A'}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium border" style={{ backgroundColor: `${rsiColor}10`, color: rsiColor, borderColor: `${rsiColor}30` }}>
              {rsiSignal}
            </span>
          </div>
          <div className="bg-[#111916] p-5 rounded-lg border border-[#6E7C75]/20">
            <p className="text-[#6E7C75] text-sm mb-1">
              <Tooltip content="Simple Moving Average">SMA (20)</Tooltip>
            </p>
            <p className="text-[#F2F7F4] text-3xl font-medium">{currentSMA?.toFixed(2) || 'N/A'}</p>
            <p className="text-[#A7B5AE] text-sm mt-2">
              Current Price is {currentSMA && currentDayData && currentDayData.close > currentSMA ? <span className="text-[#20EFA0]">above</span> : <span className="text-[#FF5B5B]">below</span>} SMA 20
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === 'F&O') {
      return (
        <div className="p-6 font-['Outfit'] space-y-6">
          <div className="bg-[#111916] rounded-lg border border-[#6E7C75]/20 overflow-hidden">
            <div className="p-4 bg-[#0D1311] border-b border-[#6E7C75]/20 flex justify-between items-center">
              <h3 className="text-[#F2F7F4] font-medium">Option Chain (Example Data)</h3>
              <span className="text-xs bg-[#2A2A2A] text-[#A7B5AE] px-2 py-1 rounded">Exp: 28 Sep 2026</span>
            </div>
            <div className="p-4 grid grid-cols-3 text-sm text-center border-b border-[#6E7C75]/20">
              <div className="text-[#A7B5AE]">CALLS (LTP)</div>
              <div className="text-[#F2F7F4] font-medium">STRIKE</div>
              <div className="text-[#A7B5AE]">PUTS (LTP)</div>
            </div>
            {[1400, 1450, 1500, 1550, 1600].map((strike, i) => (
              <div key={strike} className={`grid grid-cols-3 text-sm text-center p-3 ${i % 2 === 0 ? 'bg-[#0D1311]/50' : ''}`}>
                <div className="text-[#F2F7F4]">{(Math.random() * 50 + 10).toFixed(2)}</div>
                <div className="text-[#20EFA0] font-medium">{strike}</div>
                <div className="text-[#F2F7F4]">{(Math.random() * 50 + 10).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'Events') {
      return (
        <div className="p-6 font-['Outfit'] space-y-6">
          <div className="bg-[#111916] rounded-lg border border-[#6E7C75]/20 p-5">
            <h3 className="text-[#F2F7F4] font-medium mb-4">Company Events (Example Data)</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#6E7C75]/20 before:to-transparent">
              {[
                { date: '12 Oct 2026', title: 'Q2 Earnings Release', type: 'Earnings' },
                { date: '15 Sep 2026', title: 'Annual General Meeting', type: 'AGM' },
                { date: '05 Aug 2026', title: 'Dividend Ex-Date (₹15.50)', type: 'Dividend' }
              ].map((ev, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#20EFA0] bg-[#111916] text-[#20EFA0] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg bg-[#0D1311] border border-[#6E7C75]/20 shadow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#A7B5AE]">{ev.date}</span>
                      <span className="text-[10px] bg-[#2A2A2A] text-[#F2F7F4] px-2 py-0.5 rounded">{ev.type}</span>
                    </div>
                    <h4 className="text-[#F2F7F4] font-medium text-sm">{ev.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default empty states for other tabs
    return (
      <div className="h-40 flex flex-col items-center justify-center text-[#A7B5AE] font-['Outfit']">
        <Info className="w-8 h-8 mb-2 opacity-50" />
        <p>Data unavailable for {activeTab}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#080B0A] text-[#F2F7F4] font-['Outfit'] overflow-hidden">
      
      {/* Header */}
      <header className="flex-none bg-[#0D1311] border-b border-[#111916] p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="flex items-center bg-[#111916] rounded-md px-3 py-1.5 border border-[#6E7C75]/20">
              <Search className="w-4 h-4 text-[#A7B5AE] mr-2" />
              <input 
                className="bg-transparent text-[#F2F7F4] outline-none placeholder-[#6E7C75] w-48 text-sm"
                placeholder="Search symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-[#111916] border border-[#6E7C75]/20 rounded-md shadow-xl overflow-hidden z-20">
                {searchResults.map(res => (
                  <button 
                    key={res.symbol}
                    className="w-full text-left px-4 py-2 hover:bg-[#0D1311] flex flex-col transition-colors"
                    onClick={() => {
                      setSelectedSymbol(res.symbol);
                      setSearchQuery('');
                    }}
                  >
                    <span className="font-medium text-[#F2F7F4]">{res.symbol}</span>
                    <span className="text-xs text-[#6E7C75]">{res.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!loading && stockData && currentDayData && (
            <div className="flex items-center space-x-4 border-l border-[#111916] pl-6">
              <div>
                <h1 className="text-xl font-bold font-['Hedvig_Letters_Sans']">{stockData.companyName} <span className="text-sm font-normal text-[#A7B5AE]">({stockData.symbol})</span></h1>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">₹{currentDayData.close.toFixed(2)}</span>
                  <span className={`text-sm flex items-center ${stockData.change >= 0 ? 'text-[#20EFA0]' : 'text-[#FF5B5B]'}`}>
                    {stockData.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stockData.change).toFixed(2)} ({Math.abs(stockData.changePercent).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex bg-[#111916] rounded-full p-1 border border-[#6E7C75]/20">
          <button 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'RESEARCH' ? 'bg-[#2A2A2A] text-[#F2F7F4]' : 'text-[#A7B5AE] hover:text-[#F2F7F4]'}`}
            onClick={() => setMode('RESEARCH')}
          >
            Research
          </button>
          <button 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'SIMULATE' ? 'bg-[#2A2A2A] text-[#F2F7F4]' : 'text-[#A7B5AE] hover:text-[#F2F7F4]'}`}
            onClick={() => setMode('SIMULATE')}
          >
            Simulate
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left/Center: Chart + Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#080B0A]">
          {/* Chart Container */}
          <div className="flex-1 min-h-[300px] border-b border-[#111916] p-6 flex flex-col" ref={containerRef}>
            {loading ? (
              <div className="h-full flex items-center justify-center text-[#A7B5AE]">Loading chart...</div>
            ) : (
              <div className="flex flex-col h-full w-full">
                {/* Header (Static) */}
                {(() => {
                  const currentData = displayedHistory[displayedHistory.length - 1];
                  const firstData = displayedHistory[0];
                  let priceChange = 0;
                  let percentChange = 0;
                  if (currentData && firstData) {
                    priceChange = currentData.close - firstData.close;
                    percentChange = (priceChange / firstData.close) * 100;
                  }
                  const isUp = priceChange >= 0;
                  const changeColor = isUp ? 'text-[#20EFA0]' : 'text-[#FF5B5B]';

                  return (
                    <div className="flex items-end space-x-2 mb-4">
                      <span className="text-3xl font-bold text-[#F2F7F4]">₹{currentData?.close.toFixed(2) || '0.00'}</span>
                      <span className={`text-sm font-medium flex items-center pb-1 ${changeColor}`}>
                        {isUp ? '+' : ''}{priceChange.toFixed(2)} ({isUp ? '+' : ''}{percentChange.toFixed(2)}%)
                        <span className="text-[#A7B5AE] ml-2 font-normal">{timeframe}</span>
                      </span>
                    </div>
                  );
                })()}

                {/* Chart SVG wrapper */}
                <div className="flex-1 w-full relative mb-4">
                  <div className="absolute inset-0">
                    <FinancialChart 
                      data={displayedHistory} 
                      width={chartDimensions.width - 48} 
                      height={Math.max(1, chartDimensions.height - 48 - 40 - 52)} 
                      type={chartType}
                    />
                  </div>
                </div>

                {/* Toolbar */}
                <div className="h-10 flex items-center justify-between border-t border-[#111916] pt-4 mt-auto">
                  <div className="flex items-center space-x-1">
                    {['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'All'].map(tf => (
                      <button 
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${timeframe === tf ? 'bg-[#2A2A2A] text-[#F2F7F4]' : 'bg-transparent text-[#A7B5AE] hover:bg-[#1A1A1A] hover:text-[#F2F7F4]'}`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setChartType(chartType === 'line' ? 'candlestick' : 'line')}
                      className={`p-1.5 rounded-full transition-colors ${chartType === 'candlestick' ? 'bg-[#2A2A2A] text-[#F2F7F4]' : 'bg-transparent text-[#A7B5AE] hover:bg-[#1A1A1A] hover:text-[#F2F7F4]'}`}
                      title="Toggle Chart Type"
                    >
                      {chartType === 'line' ? <BarChart2 className="w-4 h-4" /> : <LineChart className="w-4 h-4" />}
                    </button>
                    <div className="w-px h-4 bg-[#111916]"></div>
                    <button className="flex items-center px-3 py-1.5 text-xs font-medium rounded-full text-[#A7B5AE] bg-transparent hover:bg-[#1A1A1A] hover:text-[#F2F7F4] transition-colors">
                      <Terminal className="w-3 h-3 mr-1" />
                      Terminal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs Section */}
          <div className="h-1/3 min-h-[250px] bg-[#0D1311] flex flex-col">
            <div className="flex space-x-6 px-6 border-b border-[#111916]">
              {(['Overview', 'Technicals', 'News', 'Events', 'F&O'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-2 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'border-[#F2F7F4] text-[#F2F7F4]' 
                      : 'border-transparent text-[#A7B5AE] hover:text-[#F2F7F4]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Simulator Panel */}
        {mode === 'SIMULATE' && (
          <div className="w-80 bg-[#0D1311] border-l border-[#111916] flex flex-col">
            <div className="p-4 border-b border-[#111916]">
              <h2 className="text-lg font-medium flex items-center mb-4">
                <Briefcase className="w-5 h-5 mr-2 text-[#20EFA0]" />
                Simulator
              </h2>
              
              <div className="bg-[#111916] p-4 rounded-lg space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E7C75]">Portfolio Value</span>
                  <span className="text-[#F2F7F4] font-medium font-['Hedvig_Letters_Sans']">₹{simPortfolioValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E7C75]">Available Cash</span>
                  <span className="text-[#F2F7F4] font-medium font-['Hedvig_Letters_Sans']">₹{simCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E7C75]">Holdings</span>
                  <span className="text-[#F2F7F4] font-medium font-['Hedvig_Letters_Sans']">{simShares} shares</span>
                </div>
                <div className="pt-2 border-t border-[#6E7C75]/20 flex justify-between text-sm">
                  <span className="text-[#6E7C75]">Return</span>
                  <span className={`font-medium ${simPortfolioValue >= simCapital ? 'text-[#20EFA0]' : 'text-[#FF5B5B]'}`}>
                    {((simPortfolioValue - simCapital) / simCapital * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A7B5AE]">Current Date</span>
                  <span className="text-[#F2F7F4] font-medium">{currentDayData ? new Date(currentDayData.time).toLocaleDateString() : '--'}</span>
                </div>
                <button 
                  onClick={handleStepForward}
                  disabled={!stockData || simIndex >= stockData.history.length - 1}
                  className="w-full py-2.5 bg-[#2A2A2A] hover:bg-[#333333] text-[#F2F7F4] rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <StepForward className="w-4 h-4 mr-2" />
                  Step Next Day
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A7B5AE]">Trade Quantity</span>
                  <input 
                    type="number" 
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 bg-[#111916] border border-[#6E7C75]/30 rounded px-2 py-1 text-right outline-none text-[#F2F7F4]"
                    min="1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleBuy}
                    disabled={!currentDayData || simCash < currentDayData.close * tradeQuantity}
                    className="py-2 bg-[#2A2A2A] hover:bg-[#333333] text-[#F2F7F4] rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy
                  </button>
                  <button 
                    onClick={handleSell}
                    disabled={simShares < tradeQuantity}
                    className="py-2 bg-[#2A2A2A] hover:bg-[#333333] text-[#F2F7F4] rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sell
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
