import React from 'react';
import { ModuleId } from '../../types';
import { ArrowRight, Activity, TrendingUp, TrendingDown, Target, HelpCircle, Shield, Briefcase, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onStart: (module?: ModuleId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen w-full bg-[#BBC5AE] p-4 md:p-6 lg:p-8 flex items-center justify-center font-['Outfit'] selection:bg-black/10">
      
      {/* Main Inner Container */}
      <div className="relative w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Background Imagery (Nature / Airy) */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-90"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2500&auto=format&fit=crop")',
            backgroundPosition: 'center bottom',
          }}
        >
          {/* White Gradient Fade from Top */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col h-full">
          
          {/* Glass Navbar Pill */}
          <div className="w-full flex justify-center mt-6 md:mt-10 px-4">
            <nav className="flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/60 rounded-full py-2 px-3 shadow-[0_8px_32px_rgba(0,0,0,0.05)] w-full max-w-2xl transition-all hover:bg-white/50">
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full text-white">
                <Target className="w-5 h-5" />
              </div>
              
              <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-black/70">
                <a href="#" className="hover:text-black transition-colors">Services</a>
                <a href="#" className="hover:text-black transition-colors">How it Works</a>
                <a href="#" className="hover:text-black transition-colors">About Us</a>
                <a href="#" className="hover:text-black transition-colors">Pricing</a>
              </div>

              <button 
                onClick={() => onStart('overview')}
                className="bg-white/80 hover:bg-white border border-white/80 shadow-sm text-black font-semibold text-[14px] py-2.5 px-6 rounded-full transition-all hover:shadow-md active:scale-95"
              >
                Get started
              </button>
            </nav>
          </div>

          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center mt-12 md:mt-20 px-4 text-center">
            
            <h1 className="text-[48px] md:text-[72px] lg:text-[84px] leading-[1.05] tracking-[-0.03em] font-medium mb-6 text-black">
              <span className="text-black/30 block mb-1">A New Way</span>
              to Manage Your<br/>
              Digital Wealth
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-black/60 max-w-md mx-auto leading-relaxed font-medium mb-16">
              Take full control of your crypto assets with our comprehensive portfolio management platform.
            </p>

            {/* Floating Glassmorphism Cards */}
            <div className="relative w-full max-w-md mx-auto perspective-1000">
              
              {/* Card 1: BTC */}
              <div className="relative z-40 bg-white/40 backdrop-blur-2xl border border-white/50 rounded-2xl p-4 mb-2 shadow-[0_16px_40px_rgba(0,0,0,0.08)] flex justify-between items-center transform transition-transform hover:-translate-y-1 hover:bg-white/50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F7931A]/20 flex items-center justify-center text-[#F7931A] font-bold">
                    ₿
                  </div>
                  <div className="text-left">
                    <h3 className="text-black font-bold text-[15px] leading-tight">BTC</h3>
                    <p className="text-black/50 font-medium text-[13px]">Bitcoin</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-black font-bold text-[15px] leading-tight">$64,235.17</h3>
                  <p className="text-[#0B9E6A] font-bold text-[13px]">+1.00%</p>
                </div>
              </div>

              {/* Card 2: ETH */}
              <div className="relative z-30 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4 mb-2 shadow-[0_16px_40px_rgba(0,0,0,0.05)] flex justify-between items-center transform transition-transform hover:-translate-y-1 hover:bg-white/40 cursor-pointer -mt-4 scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#627EEA]/20 flex items-center justify-center text-[#627EEA] font-bold">
                    ⟠
                  </div>
                  <div className="text-left">
                    <h3 className="text-black font-bold text-[15px] leading-tight">ETH</h3>
                    <p className="text-black/50 font-medium text-[13px]">Ethereum</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-black font-bold text-[15px] leading-tight">$3,250.08</h3>
                  <p className="text-[#D64545] font-bold text-[13px]">-0.18%</p>
                </div>
              </div>

              {/* Card 3: LTC */}
              <div className="relative z-20 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 mb-2 shadow-[0_16px_40px_rgba(0,0,0,0.03)] flex justify-between items-center transform transition-transform hover:-translate-y-1 hover:bg-white/30 cursor-pointer -mt-4 scale-[0.96]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#345D9D]/20 flex items-center justify-center text-[#345D9D] font-bold">
                    Ł
                  </div>
                  <div className="text-left">
                    <h3 className="text-black font-bold text-[15px] leading-tight">LTC</h3>
                    <p className="text-black/50 font-medium text-[13px]">Litecoin</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-black font-bold text-[15px] leading-tight">$1,235.00</h3>
                  <p className="text-[#0B9E6A] font-bold text-[13px]">+5.23%</p>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Area */}
          <div className="pb-8 pt-12 flex justify-center">
            <button 
              onClick={() => onStart('overview')}
              className="text-[11px] font-bold tracking-[0.2em] text-black/40 hover:text-black uppercase flex items-center gap-2 transition-colors"
            >
              + Scroll to Explore +
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
