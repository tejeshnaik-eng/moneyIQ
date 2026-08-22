import { LearningConcept } from '../../types/learning';

export const portfolioConcepts: LearningConcept[] = [
  {
    id: 'portfolio-asset-allocation-basics',
    category: 'Portfolio Strategy',
    title: 'Asset Allocation & The Core-Satellite Model',
    difficulty: 'Beginner',
    durationMinutes: 8,
    description: 'Understand how distributing capital across equities, fixed income, cash, and alternative assets drives over 90% of long-term return variability.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'How strategic asset allocation balances capital growth and preservation, and how the Core-Satellite framework combines low-cost index investing with tactical alpha generation.',
      explanation: `Asset allocation is the deliberate process of dividing an investment portfolio among different asset classes—primarily Equities, Fixed Income (Bonds), Cash Equivalents, Real Estate, and Commodities/Gold.

1. Why Asset Allocation Matters:
Seminal studies in financial economics (notably Brinson, Hood, and Beebower) revealed that asset allocation policy determines more than 90% of the variation in a portfolio's quarterly returns, far outweighing individual security selection or market timing.

2. The Primary Asset Classes:
- Equities (Stocks): Provide long-term capital appreciation and inflation protection, but come with higher short-term volatility and drawdown risk.
- Fixed Income (Bonds/Debt): Offer predictable income generation and capital preservation, historically exhibiting low or negative correlation to equities during economic contractions.
- Cash Equivalents (Liquid Funds/T-Bills): Provide liquidity, zero nominal credit risk, and optionality during market drawdowns.
- Real Assets (Gold, Real Estate, Commodities): Act as inflation hedges and provide uncorrelated return streams during geopolitical or currency shocks.

3. The Core-Satellite Strategy:
A widely adopted institutional framework that divides capital into two distinct tiers:
- Core (60-80%): Composed of low-cost, broad-market index funds (e.g., Nifty 50, S&P 500, Total Bond Market ETF). The core anchors the portfolio to capture market beta with minimal expense ratios and low turnover.
- Satellite (20-40%): Composed of actively managed strategies, sector bets, thematic ETFs, or individual high-conviction stocks aimed at outperforming the benchmark (generating Alpha).

4. Determining Your Allocation:
Allocation depends on your investment time horizon, risk capacity (financial ability to endure losses), and risk tolerance (emotional ability to stomach volatility). A classic heuristic like "110 minus Age in Equities" provides a starting rule of thumb, but must be refined based on liquidity needs and debt obligations.`,
      chartType: 'none'
    }
  },
  {
    id: 'portfolio-asset-allocation-quiz',
    category: 'Portfolio Strategy',
    title: 'Asset Allocation Fundamentals Quiz',
    difficulty: 'Beginner',
    durationMinutes: 5,
    description: 'Test your understanding of how strategic asset allocation dictates portfolio risk profiles and long-term performance.',
    type: 'quiz',
    quizContent: {
      question: 'According to empirical financial studies (such as Brinson, Hood, and Beebower), what factor accounts for the vast majority (>90%) of a diversified portfolio\'s return variability over time?',
      options: [
        {
          id: 'a',
          text: 'Stock picking and selecting top-performing individual companies',
          isCorrect: false,
          explanation: 'Incorrect. While individual stock selection can impact specific gains, empirical research demonstrates that security selection accounts for only a minor fraction of total portfolio return variation.'
        },
        {
          id: 'b',
          text: 'Market timing and entering/exiting before market cycles turn',
          isCorrect: false,
          explanation: 'Incorrect. Market timing is notoriously unreliable and accounts for less than 2% of long-term return variance for most institutional portfolios.'
        },
        {
          id: 'c',
          text: 'Strategic Asset Allocation across major asset classes',
          isCorrect: true,
          explanation: 'Correct! The strategic mix of broad asset classes (e.g., equities vs. fixed income vs. cash) explains over 90% of long-term return variability and risk.'
        },
        {
          id: 'd',
          text: 'Minimizing broker commission fees and management expenses',
          isCorrect: false,
          explanation: 'Incorrect. Keeping fees low is crucial for net long-term compounding, but fee structure is not the primary driver of return variability across market cycles.'
        }
      ]
    }
  },
  {
    id: 'portfolio-modern-portfolio-theory',
    category: 'Portfolio Strategy',
    title: 'Modern Portfolio Theory & The Efficient Frontier',
    difficulty: 'Intermediate',
    durationMinutes: 12,
    description: 'Explore Harry Markowitz\'s Nobel Prize-winning framework on asset covariance, expected returns, and maximizing returns for a given level of risk.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'How combining imperfectly correlated assets eliminates unsystematic risk without reducing expected returns, forming the Efficient Frontier.',
      explanation: `Introduced by Harry Markowitz in 1952, Modern Portfolio Theory (MPT) revolutionized finance by mathematically demonstrating that an asset should not be evaluated solely on its standalone risk and return, but on how it contributes to an overall portfolio's risk-return profile.

1. Systematic vs. Unsystematic Risk:
- Unsystematic (Idiosyncratic) Risk: Company- or industry-specific risks (e.g., executive fraud, supply chain disruption, product failure). This risk can be completely eliminated through diversification across 20-30 uncorrelated assets.
- Systematic (Market) Risk: Macroeconomic headwinds affecting all market participants (e.g., interest rate hikes, recessions, geopolitical crises). This risk cannot be eliminated via diversification.

2. The Power of Correlation (ρ):
Correlation ranges from -1.0 to +1.0:
- ρ = +1.0: Perfect positive correlation; assets move in lockstep. No risk reduction benefits.
- ρ = 0.0: Uncorrelated assets; combining them significantly dampens portfolio variance.
- ρ = -1.0: Perfect negative correlation; price moves mirror each other in opposite directions, theoretically eliminating all variance.

When two assets have a correlation coefficient strictly less than 1.0, the portfolio standard deviation (total risk) is less than the weighted average of individual standard deviations. This phenomenon is often termed "the only free lunch in finance."

3. The Efficient Frontier:
The Efficient Frontier is the set of optimal portfolios that offer the highest expected return for a defined level of risk, or the lowest risk for a given level of expected return. Portfolios lying beneath the curve are sub-optimal because they carry unnecessary risk for their return level.

4. The Capital Allocation Line (CAL):
When introducing a risk-free asset (like short-term sovereign T-Bills), a straight line drawn from the risk-free rate tangent to the Efficient Frontier creates the Capital Allocation Line. The point of tangency represents the "Tangency Portfolio" or optimal risky portfolio with the highest Sharpe ratio.`,
      chartType: 'none'
    }
  },
  {
    id: 'portfolio-correlation-diversification-quiz',
    category: 'Portfolio Strategy',
    title: 'Correlation & Diversification Mechanics Quiz',
    difficulty: 'Intermediate',
    durationMinutes: 6,
    description: 'Evaluate your understanding of asset co-movement, covariance, and the mathematical boundaries of risk reduction.',
    type: 'quiz',
    quizContent: {
      question: 'Suppose you construct a two-asset portfolio where Asset A and Asset B have identical expected returns and identical volatility. Under which correlation coefficient (ρ) will the total portfolio volatility be reduced to zero?',
      options: [
        {
          id: 'a',
          text: 'ρ = +1.0',
          isCorrect: false,
          explanation: 'Incorrect. At ρ = +1.0 (perfect positive correlation), the portfolio standard deviation is simply the weighted average of the individual volatilities—no risk reduction occurs.'
        },
        {
          id: 'b',
          text: 'ρ = 0.0',
          isCorrect: false,
          explanation: 'Incorrect. At ρ = 0.0 (uncorrelated), volatility is reduced by ~29% for an equally-weighted portfolio, but it does not drop to zero.'
        },
        {
          id: 'c',
          text: 'ρ = -1.0',
          isCorrect: true,
          explanation: 'Correct! At ρ = -1.0 (perfect inverse correlation), the two assets move in exact equal and opposite magnitudes, neutralizing all portfolio variance when weighted equally.'
        },
        {
          id: 'd',
          text: 'ρ = -0.5',
          isCorrect: false,
          explanation: 'Incorrect. While ρ = -0.5 significantly reduces total portfolio standard deviation, complete volatility elimination requires a correlation of exactly -1.0.'
        }
      ]
    }
  },
  {
    id: 'portfolio-risk-adjusted-metrics',
    category: 'Portfolio Strategy',
    title: 'Risk-Adjusted Performance: Sharpe, Sortino & Treynor',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    description: 'Master the three key quantitative metrics institutional fund managers use to evaluate whether returns justify the risk taken.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'The mathematical formulas, key differences, and optimal use cases for Sharpe Ratio, Sortino Ratio, and Treynor Ratio.',
      explanation: `Evaluating an investment purely by nominal return is incomplete without measuring the risk incurred to achieve that return. Risk-adjusted metrics evaluate excess returns relative to specific definitions of volatility.

1. Sharpe Ratio:
Formula: (Rp - Rf) / σp
- Rp: Portfolio return
- Rf: Risk-free rate (e.g., 91-day Treasury bill yield)
- σp: Total standard deviation of portfolio returns
Meaning: Measures excess return earned per unit of total risk (both systematic and unsystematic).
Benchmark rule:
- < 1.0: Sub-optimal risk-adjusted return
- 1.0 - 1.99: Good
- 2.0 - 2.99: Very good
- > 3.0: Exceptional

2. Sortino Ratio:
Formula: (Rp - Rf) / σd
- σd: Downside deviation (only penalizes negative return volatility below a minimum acceptable return, usually Rf or 0)
Why it matters: Standard deviation in the Sharpe ratio treats upside volatility (sudden large gains) the same as downside crashes. Sortino focuses solely on harmful downside volatility, making it ideal for asymmetrical and growth strategies.

3. Treynor Ratio:
Formula: (Rp - Rf) / βp
- βp: Portfolio Beta (measure of systematic market risk)
Why it matters: Treynor measures excess return per unit of systematic risk. It is best suited for evaluating well-diversified portfolios where unsystematic risk has already been eliminated.

4. Information Ratio (IR):
Formula: (Rp - Rb) / Tracking Error
Measures an active manager's ability to generate excess returns relative to a specific benchmark (e.g., Nifty 50) per unit of active risk.`,
      chartType: 'none'
    }
  },
  {
    id: 'portfolio-risk-metrics-quiz',
    category: 'Portfolio Strategy',
    title: 'Evaluating Risk-Adjusted Returns Quiz',
    difficulty: 'Intermediate',
    durationMinutes: 5,
    description: 'Test your ability to select and interpret appropriate risk metrics for different investment profiles.',
    type: 'quiz',
    quizContent: {
      question: 'Why is the Sortino Ratio frequently preferred over the Sharpe Ratio when analyzing momentum investing or asymmetric return strategies?',
      options: [
        {
          id: 'a',
          text: 'Sortino replaces the risk-free rate with the equity market risk premium',
          isCorrect: false,
          explanation: 'Incorrect. Both metrics use the risk-free rate (or a target threshold) in their numerator to calculate excess return.'
        },
        {
          id: 'b',
          text: 'Sortino only penalizes downside volatility, ignoring beneficial upside volatility',
          isCorrect: true,
          explanation: 'Correct! The Sharpe Ratio penalizes all volatility equally, so huge upside surges decrease the Sharpe score. The Sortino Ratio uses Downside Deviation (σd), isolating harmful downward losses.'
        },
        {
          id: 'c',
          text: 'Sortino uses Beta instead of Standard Deviation in the denominator',
          isCorrect: false,
          explanation: 'Incorrect. The metric that uses Beta in the denominator is the Treynor Ratio, not the Sortino Ratio.'
        },
        {
          id: 'd',
          text: 'Sortino adjusts returns for inflation and foreign exchange currency risk',
          isCorrect: false,
          explanation: 'Incorrect. Sortino is a volatility-adjusted performance measure, not a macroeconomic purchasing power metric.'
        }
      ]
    }
  },
  {
    id: 'portfolio-rebalancing-strategies',
    category: 'Portfolio Strategy',
    title: 'Portfolio Rebalancing: Calendar vs. Tolerance Bands',
    difficulty: 'Intermediate',
    durationMinutes: 8,
    description: 'Learn how disciplined rebalancing systematically enforces a "buy low, sell high" process and manages portfolio risk drift.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'The operational mechanics of calendar-based rebalancing, corridor (tolerance band) triggers, and tax-efficient rebalancing through new cash inflows.',
      explanation: `Over time, outperforming asset classes grow to represent a larger percentage of your portfolio than originally intended, while underperforming assets shrink. This asset allocation "drift" alters your intended risk profile. Rebalancing is the disciplined process of restoring target weights.

1. Why Rebalance?
- Risk Control: If equities rally for 3 consecutive years, a 60/40 Equity/Bond portfolio may drift to 80/20, exposing a conservative investor to severe drawdown risk before a market downturn.
- Volatility Harvesting (Shannon's Demon): Systematically trimming appreciating assets and buying depressed assets enforces counter-cyclical buying and selling, locking in gains.

2. Primary Rebalancing Strategies:
- Calendar Rebalancing: Adjusting holdings on a predetermined schedule (e.g., quarterly, semi-annually, annually). Simple to execute, but may trigger unnecessary trades if drift is minimal or miss severe intra-year corrections.
- Tolerance Band (Corridor) Rebalancing: Rebalancing only when an asset class drifts beyond an absolute threshold (e.g., target 60% ± 5% = trigger at 55% or 65%) or relative threshold (e.g., ± 10% of target weight). Reduces turnover while capturing major market dislocations.
- Hybrid (Calendar & Corridor): Reviewing portfolio quarterly, but only executing trades if weights violate predefined corridor boundaries.

3. Tax-Efficient Rebalancing Techniques:
- Cash Flow Rebalancing: Directing new systematic investment plan (SIP) contributions, dividends, and interest payouts into underweight asset classes rather than selling winners.
- Tax-Loss Harvesting: Offsetting realized capital gains by selling underperforming lots at a loss during rebalancing windows.`,
      chartType: 'none'
    }
  },
  {
    id: 'portfolio-rebalancing-quiz',
    category: 'Portfolio Strategy',
    title: 'Rebalancing Decision Rules Quiz',
    difficulty: 'Advanced',
    durationMinutes: 6,
    description: 'Evaluate your ability to compute rebalancing thresholds and optimize portfolio drift management.',
    type: 'quiz',
    quizContent: {
      question: 'An investor maintains a target portfolio of 60% Equities and 40% Bonds with a 5% absolute tolerance band. Following an equity bull run, the portfolio values are ₹70 Lakh in Equities and ₹30 Lakh in Bonds. What rebalancing action is required?',
      options: [
        {
          id: 'a',
          text: 'No action is needed because the 5% tolerance band has not been breached',
          isCorrect: false,
          explanation: 'Incorrect. Equities are currently at 70% (₹70L / ₹100L total), which breaches the upper limit of 65% (60% + 5%).'
        },
        {
          id: 'b',
          text: 'Sell ₹10 Lakh of Equities and buy ₹10 Lakh of Bonds to restore the 60/40 target',
          isCorrect: true,
          explanation: 'Correct! Total portfolio value is ₹100 Lakh. Target equity value is 60% (₹60 Lakh) and bonds 40% (₹40 Lakh). Selling ₹10 Lakh of equities and purchasing ₹10 Lakh of bonds resets weights to exactly 60/40.'
        },
        {
          id: 'c',
          text: 'Sell ₹5 Lakh of Equities and hold as cash in a savings account',
          isCorrect: false,
          explanation: 'Incorrect. Selling only ₹5 Lakh leaves equities at 65% (the boundary edge) and introduces an unallocated cash position rather than funding the underweight bond allocation.'
        },
        {
          id: 'd',
          text: 'Liquidate the entire equity allocation and re-enter at lower moving average levels',
          isCorrect: false,
          explanation: 'Incorrect. Rebalancing is a disciplined calibration back to strategic targets, not an all-or-nothing market timing gamble.'
        }
      ]
    }
  },
  {
    id: 'portfolio-capm-beta-analysis',
    category: 'Portfolio Strategy',
    title: 'Capital Asset Pricing Model (CAPM) & Beta',
    difficulty: 'Advanced',
    durationMinutes: 15,
    description: 'Understand how capital markets price risk through Beta and how to calculate the cost of equity and Jensen\'s Alpha.',
    type: 'lesson',
    lessonContent: {
      whatYouWillLearn: 'How to calculate expected equity returns using the CAPM formula, interpret Beta as systematic sensitivity, and calculate Jensen\'s Alpha for active stock selection.',
      explanation: `Developed by William Sharpe, John Lintner, and Jan Mossin, the Capital Asset Pricing Model (CAPM) establishes a linear relationship between the systematic risk of an asset and its expected return in an efficient market.

1. The CAPM Formula:
E(Ri) = Rf + βi * [E(Rm) - Rf]
- E(Ri): Expected return of asset i
- Rf: Risk-free rate of return (e.g., 10-year Government Bond Yield)
- βi (Beta): Measure of asset i's sensitivity to broad market movements
- E(Rm): Expected return of the broad market portfolio
- [E(Rm) - Rf]: Equity Market Risk Premium (ERP)—the excess return demanded by investors for bearing market risk.

2. Interpreting Beta (β):
- β = 1.0: Stock moves exactly in tandem with the market (same systematic volatility).
- β > 1.0: Aggressive asset (e.g., Tech, Cyclicals, High-growth). If market rises by 10%, a β=1.5 stock is expected to rise 15%; if market drops 10%, it drops 15%.
- 0 < β < 1.0: Defensive asset (e.g., Utilities, FMCG, Healthcare). Experiences muted fluctuations relative to the market.
- β < 0: Negative beta asset (e.g., Gold or inverse instruments). Moves counter to general market trends.

3. The Security Market Line (SML):
The SML is the graphical depiction of CAPM where the x-axis is Beta and the y-axis is Expected Return:
- Fairly priced assets plot directly on the SML.
- Undervalued assets plot ABOVE the SML (they offer higher expected return than their systematic risk requires).
- Overvalued assets plot BELOW the SML.

4. Jensen\'s Alpha (α):
Formula: α = R_actual - E(R_CAPM)
Alpha measures excess returns generated above what the CAPM predicted given the portfolio\'s beta exposure. A positive Alpha indicates superior manager skill or competitive moats.`,
      chartType: 'none'
    }
  },
  {
    id: 'portfolio-factor-investing-quiz',
    category: 'Portfolio Strategy',
    title: 'Factor Investing & Smart Beta Quiz',
    difficulty: 'Advanced',
    durationMinutes: 7,
    description: 'Challenge your knowledge of multi-factor risk premiums and empirical asset pricing models beyond single-factor CAPM.',
    type: 'quiz',
    quizContent: {
      question: 'In the seminal Fama-French Three-Factor Model, which two structural risk factors are added to the standard market risk premium to explain asset returns?',
      options: [
        {
          id: 'a',
          text: 'Momentum (UMD) and Low Volatility (BAB)',
          isCorrect: false,
          explanation: 'Incorrect. Momentum was later formalized in the Carhart 4-Factor model, and Low Volatility in subsequent smart beta extensions.'
        },
        {
          id: 'b',
          text: 'Size (SMB: Small Minus Big) and Value (HML: High Minus Low Book-to-Market)',
          isCorrect: true,
          explanation: 'Correct! Eugene Fama and Kenneth French proved that small-cap stocks historically outperform large-cap stocks (SMB) and value stocks (high book-to-market) outperform growth stocks (HML), creating the 3-Factor model.'
        },
        {
          id: 'c',
          text: 'Dividend Yield (HDY) and Earnings Quality (EQP)',
          isCorrect: false,
          explanation: 'Incorrect. While quality and yield are factors in modern smart beta indices, they were not the original two additions in the 1993 Fama-French Three-Factor paper.'
        },
        {
          id: 'd',
          text: 'Liquidity Premium (LIQ) and Foreign Exchange Exposure (FX)',
          isCorrect: false,
          explanation: 'Incorrect. Liquidity and currency exposures are macroeconomic overlays rather than the core Fama-French size and value factors.'
        }
      ]
    }
  }
];
