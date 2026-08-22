import React, { useState } from 'react';
import { Landmark, X, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-[var(--app-surface)] w-full max-w-md rounded-2xl shadow-2xl border border-[var(--app-border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--app-border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl text-[var(--app-text)] tracking-tight">FinSight</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors p-1 rounded-md hover:bg-[var(--app-surface-alt)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold font-heading text-[var(--app-text)] mb-2">
            Welcome to FinSight
          </h2>
          <p className="text-[var(--app-text-muted)] mb-8">
            Sign in to access your institutional portfolio management engine.
          </p>

          {error && (
            <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-start gap-2 text-left">
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
