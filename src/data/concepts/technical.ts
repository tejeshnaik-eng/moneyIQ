import { LearningConcept } from '../../types/learning';

export const technicalConcepts: LearningConcept[] = [
  {
    id: 'tech-1',
    category: 'Technical Analysis',
    title: 'Candlestick Anatomy & Price Action Fundamentals',
    difficulty: 'Beginner',
    durationMinutes: 5,
    description: 'Learn how Japanese candlesticks reveal the ongoing battle between buyers and sellers through real bodies and shadows.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'How to read Open, High, Low, and Close (OHLC) values on candlestick charts, interpret bullish and bearish bodies, and identify rejection wicks.',
      explanation: 'Japanese candlesticks are the bedrock of visual price action analysis. Each candle represents trading activity over a specified timeframe (e.g., 1 minute, 1 hour, 1 day). The wide portion is the "real body", spanning the difference between opening and closing prices. A green (or white) candle indicates bullish momentum where buyers pushed the closing price above the open. A red (or black) candle shows bearish pressure where sellers closed price below the open.\n\nThe thin lines extending above and below the body are called "wicks" or "shadows". The upper wick marks the session high, while the lower wick marks the session low. Long upper wicks indicate that bulls attempted to rally price but encountered aggressive overhead selling (supply). Conversely, long lower wicks signal intraday dip-buying where demand absorbed selling pressure. Analyzing candle body size relative to wick length gives traders real-time insight into market sentiment, conviction, and potential exhaustion points.',
      chartType: 'candlestick'
    }
  },
  {
    id: 'tech-2',
    category: 'Technical Analysis',
    title: 'Support and Resistance Dynamics',
    difficulty: 'Beginner',
    durationMinutes: 6,
    description: 'Understand the fundamental price levels where buying demand or selling supply concentrates to reverse or stall trends.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'How to draw horizontal support and resistance zones, recognize the Polarity Principle (role reversal), and validate breakouts.',
      explanation: 'Support and Resistance represent key price memory zones created by institutional supply and demand imbalances. Support is a price floor where buying interest is sufficiently strong to overcome selling pressure, halting downward moves. Resistance is a price ceiling where selling interest overcomes buying momentum, halting rallies.\n\nA fundamental rule in technical analysis is the Polarity Principle (Role Reversal): once a strong resistance level is definitively broken to the upside, it often transforms into a future support level on pullbacks. This happens because previous sellers regret their positions and look to buy at breakeven, while breakout buyers add to winners. Effective traders view support and resistance as dynamic zones rather than single rigid price points, waiting for volume confirmation before confirming legitimate breakouts or spotting bull/bear traps.',
      chartType: 'support_resistance'
    }
  },
  {
    id: 'tech-3',
    category: 'Technical Analysis',
    title: 'Quiz: Support & Resistance Mastery',
    difficulty: 'Beginner',
    durationMinutes: 3,
    description: 'Test your grasp of price floors, ceilings, and the polarity principle in market structure.',
    type: 'quiz',
    quizContent: {
      question: 'What commonly occurs to a major resistance level after price decisively breaks above it with high volume?',
      options: [
        {
          id: 'sr-opt-1',
          text: 'The level becomes permanently irrelevant as prices expand into price discovery.',
          isCorrect: false,
          explanation: 'Major technical levels retain market memory and rarely become completely irrelevant.'
        },
        {
          id: 'sr-opt-2',
          text: 'The broken resistance level flips into a potential new support floor on subsequent retests.',
          isCorrect: true,
          explanation: 'Under the Polarity Principle (role reversal), broken resistance frequently flips to support as buyers defend breakout levels.'
        },
        {
          id: 'sr-opt-3',
          text: 'Exchange circuit breakers automatically trigger to freeze further upward trading.',
          isCorrect: false,
          explanation: 'Technical breakouts do not trigger exchange halts unless extreme regulatory percentage limits are breached.'
        },
        {
          id: 'sr-opt-4',
          text: 'The asset is guaranteed to decline immediately back to its 52-week low.',
          isCorrect: false,
          explanation: 'High-volume breakouts above resistance usually signal trend continuation rather than an immediate collapse.'
        }
      ]
    }
  },
  {
    id: 'tech-4',
    category: 'Technical Analysis',
    title: 'Trend Identification with Moving Averages',
    difficulty: 'Intermediate',
    durationMinutes: 7,
    description: 'Master Simple and Exponential Moving Averages (SMA & EMA) to smooth noise, identify baseline trends, and trade crosses.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'The mathematical difference between SMA and EMA, identifying dynamic support/resistance, and interpreting the Golden Cross and Death Cross.',
      explanation: 'Moving Averages smooth volatile price action into smooth trend lines. The Simple Moving Average (SMA) calculates an arithmetic mean of closing prices over a specified lookback period (e.g., 50 or 200 periods). The Exponential Moving Average (EMA) applies a weighting multiplier that gives greater importance to recent price data, making it respond faster to recent price fluctuations.\n\nInstitutional investors closely track benchmark moving averages on daily charts. When the price trades consistently above an upward-sloping 50-day and 200-day SMA, the asset is considered in a confirmed bull trend. A "Golden Cross" occurs when a short-term moving average (like the 50-day SMA) crosses above a long-term moving average (like the 200-day SMA), signaling long-term bullish accumulation. Conversely, a "Death Cross" (50-day crossing below 200-day) signals macro weakness and potential cyclical downtrends.',
      chartType: 'moving_average'
    }
  },
  {
    id: 'tech-5',
    category: 'Technical Analysis',
    title: 'Quiz: Moving Average Signals & Trend Filters',
    difficulty: 'Intermediate',
    durationMinutes: 4,
    description: 'Evaluate your ability to interpret moving average crosses and trend-following signals.',
    type: 'quiz',
    quizContent: {
      question: 'Which signal is widely recognized by technical analysts as a "Golden Cross"?',
      options: [
        {
          id: 'ma-opt-1',
          text: 'When the 200-day SMA crosses above the 50-day SMA during a down market.',
          isCorrect: false,
          explanation: 'A 200-day SMA above a 50-day SMA is a Death Cross, which reflects long-term bearish momentum.'
        },
        {
          id: 'ma-opt-2',
          text: 'When a short-term moving average (e.g. 50-day SMA) crosses above a long-term moving average (e.g. 200-day SMA).',
          isCorrect: true,
          explanation: 'The Golden Cross indicates that medium-term price velocity has overtaken long-term averages, signaling strong bullish momentum.'
        },
        {
          id: 'ma-opt-3',
          text: 'When price crosses below the lower Bollinger Band on extreme volume.',
          isCorrect: false,
          explanation: 'Crossing below the lower Bollinger Band is an oversold condition, not a Golden Cross.'
        },
        {
          id: 'ma-opt-4',
          text: 'When the 9-day EMA matches the exact value of the 20-day SMA.',
          isCorrect: false,
          explanation: 'A standard moving average convergence without directional crossing of key macro lines is not a Golden Cross.'
        }
      ]
    }
  },
  {
    id: 'tech-6',
    category: 'Technical Analysis',
    title: 'Momentum Oscillators: RSI and MACD Mechanics',
    difficulty: 'Intermediate',
    durationMinutes: 8,
    description: 'Harness the Relative Strength Index (RSI) and Moving Average Convergence Divergence (MACD) to gauge momentum and spot exhaustion.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'How to calculate RSI velocity, identify overbought/oversold boundaries, and spot bullish and bearish divergences on MACD and RSI.',
      explanation: 'Momentum oscillators measure the speed and change of price movements. The Relative Strength Index (RSI) fluctuates on a 0 to 100 scale based on the ratio of average upward price changes to average downward price changes over typically 14 periods. Traditionally, RSI above 70 indicates an overbought condition (potential pullback or consolidation), while RSI below 30 indicates an oversold condition (potential technical rebound).\n\nThe Moving Average Convergence Divergence (MACD) consists of the MACD Line (12 EMA minus 26 EMA), the Signal Line (9 EMA of the MACD Line), and the Histogram (the difference between the two). Divergence is one of the most powerful signals generated by oscillators: when price prints a Higher High but RSI or MACD prints a Lower High (Regular Bearish Divergence), it indicates that underlying momentum is waning despite higher prices, often preceding sharp trend reversals.',
      chartType: 'none'
    }
  },
  {
    id: 'tech-7',
    category: 'Technical Analysis',
    title: 'Classic Chart Patterns: Reversals & Continuations',
    difficulty: 'Advanced',
    durationMinutes: 9,
    description: 'Identify reliable multi-bar price structures including Head & Shoulders, Double Bottoms, Flags, and Triangles.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'Differentiating reversal patterns from continuation patterns, calculating measured move price targets, and executing pattern breakouts.',
      explanation: 'Chart patterns encapsulate collective market psychology over extended periods. Reversal patterns signal that the prevailing trend is losing control. The Head and Shoulders top pattern features a Left Shoulder, a higher Head, and a lower Right Shoulder connected by a baseline "Neckline". A decisive breakdown below the neckline confirms distribution and projects a measured downside target equal to the vertical distance from Head to Neckline.\n\nContinuation patterns, such as Bull Flags and Symmetrical Triangles, represent brief pauses or orderly consolidations before the dominant trend resumes. In a Bull Flag, price surges upward in a "flagpole" on strong volume, followed by a tight, downward-sloping channel on contracting volume. A breakout above the upper trendline of the flag triggers entry, with a target calculated by projecting the height of the initial flagpole upward from the breakout point.',
      chartType: 'support_resistance'
    }
  },
  {
    id: 'tech-8',
    category: 'Technical Analysis',
    title: 'Quiz: Oscillator Divergence & Trend Exhaustion',
    difficulty: 'Advanced',
    durationMinutes: 4,
    description: 'Test your understanding of regular and hidden momentum divergences in technical trading.',
    type: 'quiz',
    quizContent: {
      question: 'When an asset makes a new Higher High in price, but the 14-period RSI forms a Lower High below 70, what technical condition is present?',
      options: [
        {
          id: 'div-opt-1',
          text: 'Hidden Bullish Divergence signaling aggressive trend continuation.',
          isCorrect: false,
          explanation: 'Hidden bullish divergence occurs when price makes a higher low while the oscillator makes a lower low.'
        },
        {
          id: 'div-opt-2',
          text: 'Regular Bearish Divergence signaling waning upside momentum and potential reversal risk.',
          isCorrect: true,
          explanation: 'A higher high in price combined with a lower high in momentum reflects diminishing buying power, known as Regular Bearish Divergence.'
        },
        {
          id: 'div-opt-3',
          text: 'An immediate market order squeeze forcing short sellers into mandatory liquidation.',
          isCorrect: false,
          explanation: 'Lower momentum readings indicate weakening buying enthusiasm, not a rapid short squeeze.'
        },
        {
          id: 'div-opt-4',
          text: 'Complete market illiquidity requiring trading suspension.',
          isCorrect: false,
          explanation: 'Divergence is a standard momentum phenomenon and has no relation to market halts or exchange illiquidity.'
        }
      ]
    }
  },
  {
    id: 'tech-9',
    category: 'Technical Analysis',
    title: 'Volume Profile & Institutional Order Blocks',
    difficulty: 'Advanced',
    durationMinutes: 10,
    description: 'Learn how Volume Profile, Point of Control (POC), and Value Areas reveal where institutions accumulate and distribute liquidity.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'Analyzing volume-by-price histograms, navigating Point of Control (POC) magnets, and locating institutional liquidity pools.',
      explanation: 'Traditional volume histograms display volume executed over time (x-axis), but Volume Profile displays volume traded at specific price levels (y-axis) across an evaluated session. This distinction is vital for understanding Auction Market Theory. High Volume Nodes (HVNs) represent fair value areas where buyers and sellers reached intense consensus, causing price to trade frequently and spend extended time.\n\nThe single price level with the greatest total traded volume is designated the Point of Control (POC). The Value Area (VA) encompasses the price range where approximately 70% of total session volume was transacted, bounded by Value Area High (VAH) and Value Area Low (VAL). Low Volume Nodes (LVNs) represent price rejection zones where orders cleared rapidly. When price enters an LVN, it tends to travel swiftly through the void until encountering a POC or HVN anchor. Traders utilize these structures to enter high-conviction pullbacks alongside institutional order flow.',
      chartType: 'none'
    }
  },
  {
    id: 'tech-10',
    category: 'Technical Analysis',
    title: 'Quiz: Volume Profile & Auction Market Theory',
    difficulty: 'Advanced',
    durationMinutes: 4,
    description: 'Validate your grasp of Point of Control (POC), Value Area dynamics, and liquidity zones.',
    type: 'quiz',
    quizContent: {
      question: 'In Volume Profile analysis, what does the Point of Control (POC) signify?',
      options: [
        {
          id: 'vp-opt-1',
          text: 'The exact price level with the highest total executed trading volume during the observed period, acting as a strong price magnet.',
          isCorrect: true,
          explanation: 'The Point of Control (POC) represents the most heavily transacted price level, reflecting market consensus and serving as significant dynamic support or resistance.'
        },
        {
          id: 'vp-opt-2',
          text: 'The arithmetic average of the daily opening and closing prices across all major exchanges.',
          isCorrect: false,
          explanation: 'The POC is calculated from actual traded volume distribution at price, not a simple average of open/close prices.'
        },
        {
          id: 'vp-opt-3',
          text: 'The low volume price gap where market makers guarantee zero order slippage.',
          isCorrect: false,
          explanation: 'Low volume nodes have thin liquidity and often experience high slippage, the opposite of the Point of Control.'
        },
        {
          id: 'vp-opt-4',
          text: 'An algorithmic indicator restricted exclusively to pre-market futures derivatives.',
          isCorrect: false,
          explanation: 'Volume profile and POC analysis apply universally to equities, crypto, forex, and futures on all timeframes.'
        }
      ]
    }
  }
];
