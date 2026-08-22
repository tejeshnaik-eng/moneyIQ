import React from 'react';
import { ModuleId } from '../../types';

interface LandingPageProps {
  onStart: (module?: ModuleId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <>
      <style>{`
        :root {
            --bg-color: #080B0A;
            --text-color: #F2F7F4;
            --muted-color: #A7B5AE;
            --primary: #20EFA0;
            --primary-dim: #0B9E6A;
            --primary-soft: #0D2B21;
        }

        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Outfit', sans-serif;
        }

        .stitch-page {
            position: relative;
            height: calc(100vh - 64px);
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        /* Background Animation */
        .bg-container {
            position: absolute;
            inset: 0;
            z-index: 0;
            overflow: hidden;
        }

        .bg-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            animation: kenBurns 10s ease-out forwards;
        }

        @keyframes kenBurns {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }

        /* Gradient Scrim (No Blur) */
        .scrim {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(8, 11, 10, 1) 0%, rgba(8, 11, 10, 0.7) 40%, rgba(8, 11, 10, 0.4) 100%);
            z-index: 1;
        }

        /* Buttons */
        .stitch-btn {
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 15px;
            padding: 12px 28px;
            border-radius: 9999px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
        }

        .stitch-btn--solid {
            background-color: var(--primary);
            color: #080B0A;
        }
        .stitch-btn--solid:hover {
            background-color: var(--primary-dim);
        }

        .stitch-btn--outline {
            background-color: transparent;
            color: var(--text-color);
            border: 1.5px solid var(--primary);
        }
        .stitch-btn--outline:hover {
            background-color: rgba(15, 157, 101, 0.1);
        }

        /* Hero Section */
        .stitch-hero {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-top: auto;
            padding: 0 40px 60px 40px;
            max-width: 900px;
        }

        .badge {
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--primary);
            margin-bottom: 24px;
            display: inline-block;
            opacity: 0;
            animation: fadeUp 0.6s ease-out 0.4s forwards;
        }

        .headline {
            font-size: 64px;
            line-height: 1.1;
            font-weight: 700;
            margin: 0 0 32px 0;
            letter-spacing: -0.02em;
            color: #ffffff;
        }

        .headline-mask {
            display: block;
            overflow: hidden;
            padding-bottom: 8px; /* Room for descenders */
        }

        .headline-text {
            display: block;
            transform: translateY(100%);
        }
        
        .headline-mask:nth-child(1) .headline-text {
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
        }
        
        .headline-mask:nth-child(2) .headline-text {
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.66s forwards;
        }

        .accent {
            position: relative;
            display: inline-block;
            color: var(--muted-color);
        }
        
        .accent::before {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            color: var(--primary-soft);
            width: 0%;
            overflow: hidden;
            white-space: nowrap;
            animation: textWipe 1.2s cubic-bezier(0.77, 0, 0.175, 1) 1.2s forwards;
        }

        .accent::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            color: var(--primary);
            width: 0%;
            overflow: hidden;
            white-space: nowrap;
            animation: textWipe 1.2s cubic-bezier(0.77, 0, 0.175, 1) 1.4s forwards;
        }

        .hero-actions {
            display: flex;
            gap: 16px;
            margin-bottom: 40px;
        }
        
        .hero-actions .stitch-btn:nth-child(1) {
            opacity: 0;
            animation: fadeUp 0.6s ease-out 0.85s forwards;
        }
        
        .hero-actions .stitch-btn:nth-child(2) {
            opacity: 0;
            animation: fadeUp 0.6s ease-out 0.95s forwards;
        }

        .lede {
            font-family: 'Hedvig Letters Sans', sans-serif;
            font-size: 18px;
            line-height: 1.6;
            color: var(--muted-color);
            max-width: 600px;
            margin: 0;
            opacity: 0;
            animation: fadeUp 0.6s ease-out 1.1s forwards;
        }

        /* Keyframes */
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        
        @keyframes textWipe {
            0% { width: 0%; }
            100% { width: 100%; }
        }

        /* Responsive */
        @media (max-width: 768px) {
            body, html {
                overflow: auto;
            }
            .stitch-page {
                height: auto;
                min-height: calc(100vh - 64px);
            }
            .stitch-hero {
                padding: 40px 20px 60px 20px;
            }
            .headline {
                font-size: 42px;
            }
            .hero-actions {
                flex-direction: column;
            }
            .hero-actions .stitch-btn {
                width: 100%;
            }
            .bg-container {
                position: fixed;
            }
        }
      `}</style>
      
      <div className="stitch-page">
        {/* Background Asset */}
        <div className="bg-container">
          <img 
            alt="Institutional trading terminal in dark mode" 
            className="bg-image opacity-30" 
            src="/hero_bg.jpg" 
          />
          <div className="scrim"></div>
        </div>

        {/* Hero Section */}
        <main className="stitch-hero" id="top">
          <span className="badge">Confidence Layer for Indian Investors</span>
          <h1 className="headline">
            <span className="headline-mask">
              <span className="headline-text">Stop guessing with your money.</span>
            </span>
            <span className="headline-mask">
              <span className="headline-text">
                <span>It's time for </span>
                <span className="accent" data-text="confidence.">confidence.</span>
              </span>
            </span>
          </h1>
          <div className="hero-actions">
            <button className="stitch-btn stitch-btn--solid" onClick={() => onStart('overview')}>Start Free</button>
            <button className="stitch-btn stitch-btn--outline" onClick={() => onStart('marketsim')}>Try the Simulator</button>
          </div>
          <p className="lede">
            FinSight reads your real portfolio, risk profile, and goals — not social media hype — and turns them into a plan you can actually trust. Practice with virtual money before you commit real capital.
          </p>
        </main>
      </div>
    </>
  );
};
