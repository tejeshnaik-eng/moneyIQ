import React, { useState } from 'react';
import { X, Landmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'login' 
}) => {
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err);
      setIsSubmitting(false);
    } else {
      // The redirect will happen automatically via Supabase
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0 font-['Outfit']">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Apple-style Frosted Glass Modal */}
      <div className="relative bg-white/80 backdrop-blur-2xl w-full max-w-md rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl text-black tracking-tight">FinSight</span>
          </div>
          <button 
            onClick={onClose}
            className="text-black/40 hover:text-black transition-colors p-2 rounded-full hover:bg-black/5"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-3">
              {initialMode === 'login' ? 'Welcome back' : 'Start your journey'}
            </h2>
            <p className="text-[15px] font-medium text-black/60 leading-relaxed">
              {initialMode === 'login' 
                ? 'Sign in to access your AI-powered portfolio insights and continue building financial confidence.' 
                : 'Join FinSight to transform complex market data into clear, actionable insights.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">!</div>
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full relative flex items-center justify-center gap-3 bg-white text-black font-semibold text-[16px] py-4 rounded-full border border-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:bg-gray-50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
          
          <p className="mt-8 text-center text-[13px] font-medium text-black/40">
            By continuing, you agree to FinSight's <a href="#" className="text-black/70 hover:text-black underline decoration-black/20 underline-offset-2">Terms of Service</a> and <a href="#" className="text-black/70 hover:text-black underline decoration-black/20 underline-offset-2">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
