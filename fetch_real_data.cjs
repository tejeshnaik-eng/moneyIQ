const https = require('https');
const fs = require('fs');
const path = require('path');

const symbols = ['HDFCBANK.NS', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'ICICIBANK.NS'];
const outDir = path.join(__dirname, 'public', 'market-data');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function fetchData(symbol) {
  return new Promise((resolve, reject) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5y&interval=1d`;
    console.log('Fetching', url);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const result = json.chart.result[0];
          const meta = result.meta;
          
          const timestamps = result.timestamp;
          const quote = result.indicators.quote[0];
          
          const history = timestamps.map((t, i) => ({
            time: t,
            open: quote.open[i],
            high: quote.high[i],
            low: quote.low[i],
            close: quote.close[i],
            volume: quote.volume[i]
          })).filter(h => h.open !== null && h.close !== null);
          
          const finalObj = {
            symbol: meta.symbol.replace('.NS', ''),
            companyName: meta.symbol.replace('.NS', ''), // Just use symbol if longName isn't in meta
            exchange: meta.exchangeName,
            currentPrice: meta.regularMarketPrice,
            previousClose: meta.chartPreviousClose,
            change: meta.regularMarketPrice - meta.chartPreviousClose,
            changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100,
            volume: history[history.length-1].volume,
            history: history
          };
          
          fs.writeFileSync(path.join(outDir, `${finalObj.symbol}.json`), JSON.stringify(finalObj));
          console.log(`Saved ${finalObj.symbol}`);
          resolve();
          
        } catch(e) {
          console.error('Error parsing', symbol, e);
          resolve();
        }
      });
    }).on('error', e => {
      console.error(e);
      resolve();
    });
  });
}

async function run() {
  for (let s of symbols) {
    await fetchData(s);
  }
}
run();
