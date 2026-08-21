const https = require('https');
const fs = require('fs');
const path = require('path');

const ALPHA_VANTAGE_KEY = 'NLG8IQ2UO7GNEOA0';

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', ...headers } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data.slice(0, 1000) });
        }
      });
    });
    req.on('error', reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

async function fetchAmfiNavs() {
  console.log('[1/3] Fetching AMFI India official daily NAV table...');
  try {
    const rawText = await fetchText('https://portal.amfiindia.com/spages/NAVAll.txt');
    const lines = rawText.split('\n');
    const navMap = {};

    // Target major Indian schemes
    const targetSchemes = {
      '122639': 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
      '120716': 'UTI Nifty 50 Index Fund - Direct Plan - Growth',
      '127042': 'Motilal Oswal Midcap Fund - Direct Plan - Growth',
      '119598': 'SBI Liquid Fund - Direct Plan - Growth',
      '120503': 'Mirae Asset Large & Midcap Fund - Direct Plan - Growth',
      '120847': 'HDFC Small Cap Fund - Direct Plan - Growth'
    };

    for (const line of lines) {
      const parts = line.split(';');
      if (parts.length >= 6) {
        const code = parts[0].trim();
        if (targetSchemes[code] || parts[3]?.includes('Parag Parikh') || parts[3]?.includes('UTI Nifty 50')) {
          const nav = parseFloat(parts[parts.length - 2]);
          const date = parts[parts.length - 1].trim();
          if (!isNaN(nav)) {
            navMap[code] = {
              schemeCode: code,
              isin: parts[1] || parts[2],
              schemeName: parts[3] + (parts[4] ? ' ' + parts[4] : '') + (parts[5] ? ' ' + parts[5] : ''),
              nav: nav,
              date: date
            };
          }
        }
      }
    }
    console.log(`✓ Fetched AMFI NAVs for ${Object.keys(navMap).length} key funds.`);
    return navMap;
  } catch (e) {
    console.error('Error fetching AMFI NAVs:', e.message);
    return {};
  }
}

async function fetchAlphaVantageQuotes() {
  console.log('[2/3] Fetching Alpha Vantage live BSE/NSE equity quotes...');
  const symbols = ['RELIANCE.BSE', 'HDFCBANK.BSE', 'INFY.BSE', 'TCS.BSE', 'ICICIBANK.BSE'];
  const quotes = {};

  for (const sym of symbols) {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${ALPHA_VANTAGE_KEY}`;
      const res = await fetchJson(url);
      if (res['Global Quote'] && res['Global Quote']['05. price']) {
        const gq = res['Global Quote'];
        quotes[sym] = {
          symbol: gq['01. symbol'],
          price: parseFloat(gq['05. price']),
          open: parseFloat(gq['02. open']),
          high: parseFloat(gq['03. high']),
          low: parseFloat(gq['04. low']),
          volume: parseInt(gq['06. volume']),
          latestTradingDay: gq['07. latest trading day'],
          previousClose: parseFloat(gq['08. previous close']),
          change: parseFloat(gq['09. change']),
          changePercent: gq['10. change percent']
        };
        console.log(`  ✓ ${sym}: ₹${quotes[sym].price} (${quotes[sym].changePercent})`);
      }
      // Small pause to respect free API pacing
      await new Promise(r => setTimeout(r, 600));
    } catch (e) {
      console.error(`  ✗ Error fetching ${sym}:`, e.message);
    }
  }
  return quotes;
}

async function fetchYahooFinanceIndices() {
  console.log('[3/3] Fetching Yahoo Finance indices & historical crisis charts...');
  const indices = {};
  const series = ['^NSEI', '^BSESN', 'NIFTYBEES.NS', 'GOLDBEES.NS'];

  for (const sym of series) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1mo&interval=1d`;
      const res = await fetchJson(url);
      if (res.chart && res.chart.result && res.chart.result[0]) {
        const item = res.chart.result[0];
        const meta = item.meta;
        const closes = item.indicators.quote[0].close || [];
        const timestamps = item.timestamp || [];
        
        indices[sym] = {
          symbol: meta.symbol,
          currency: meta.currency,
          regularMarketPrice: meta.regularMarketPrice,
          chartPreviousClose: meta.chartPreviousClose,
          history: timestamps.map((ts, idx) => ({
            date: new Date(ts * 1000).toISOString().split('T')[0],
            close: closes[idx] ? parseFloat(closes[idx].toFixed(2)) : null
          })).filter(h => h.close !== null)
        };
        console.log(`  ✓ ${sym}: ₹${indices[sym].regularMarketPrice}`);
      }
    } catch (e) {
      console.error(`  ✗ Error fetching ${sym}:`, e.message);
    }
  }

  // Fetch Covid Crash specific historical range (Feb 2020 - Apr 2020)
  try {
    const covidUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?period1=1580428800&period2=1588204800&interval=1d';
    const covidRes = await fetchJson(covidUrl);
    if (covidRes.chart?.result?.[0]) {
      const result = covidRes.chart.result[0];
      const timestamps = result.timestamp || [];
      const closes = result.indicators.quote[0].close || [];
      indices['COVID_CRASH_2020'] = {
        title: 'Covid 2020 Crash Timeline',
        peakClose: 12201.20,
        troughClose: 7610.25,
        drawdownPercentage: -37.63,
        timeline: timestamps.map((ts, idx) => ({
          date: new Date(ts * 1000).toISOString().split('T')[0],
          close: closes[idx] ? parseFloat(closes[idx].toFixed(2)) : null
        })).filter(t => t.close !== null)
      };
      console.log('  ✓ Covid 2020 authentic crash trajectory loaded.');
    }
  } catch (e) {
    console.error('  ✗ Error fetching Covid history:', e.message);
  }

  return indices;
}

async function run() {
  console.log('=== FinSight Real Market Data Synchronization Engine ===\n');
  const [amfiNavs, alphaQuotes, yahooIndices] = await Promise.all([
    fetchAmfiNavs(),
    fetchAlphaVantageQuotes(),
    fetchYahooFinanceIndices()
  ]);

  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      sources: [
        'AMFI India (portal.amfiindia.com)',
        'Alpha Vantage API (BSE/NSE Equities)',
        'Yahoo Finance (Nifty 50 & Historical Crises)'
      ]
    },
    mutualFunds: amfiNavs,
    equities: alphaQuotes,
    indices: yahooIndices
  };

  const outputPath = path.join('public', 'data', 'latest-market-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n✓ Successfully saved real market dataset to ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
}

run();
