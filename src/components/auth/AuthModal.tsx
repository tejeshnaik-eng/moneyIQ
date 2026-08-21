import React, { useState } from 'react';
import { Landmark, X, ArrowRight, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
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
  initialMode = 'login',
}) => {
  const { login, register, isLoading: ctxLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    let result: { error?: string };

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      result = await register(name.trim(), email.trim(), password);
    } else {
      result = await login(email.trim(), password);
    }

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      resetForm();
      onSuccess();
    }
  };

  const handleGuestLogin = () => {
    // Guest mode: bypasses server auth entirely, local state only
    // The dashboard will work but /api/audit-claim will return 401 (expected)
    resetForm();
    onClose();
    // Guest navigation is handled by the parent keeping isLoggedIn = false
    // We simply close the modal; the parent's handleStartFromLanding won't navigate to dashboard
    // To support guest mode properly we'd need a separate flag — for now close modal
    onSuccess(); // Let parent decide; DashboardShell will show a guest notice
  };

  const isLoading = isSubmitting || ctxLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] max-w-md w-full p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-[#565e74] hover:text-[#191c1e] transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#00b090] text-white flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-heading font-extrabold text-[#191c1e]">
            {mode === 'login' ? 'Welcome Back' : 'Create Investor Ledger'}
          </h3>
          <p className="text-xs text-[#565e74]">
            {mode === 'login'
              ? 'Access your consolidated financial dashboard.'
              : 'Architect your financial freedom with institutional precision.'}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#ba1a1a] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-heading font-bold text-[#191c1e] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="e.g. Rahul Sharma"
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-[#191c1e] outline-none focus:border-[#00b090] disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block font-heading font-bold text-[#191c1e] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-[#191c1e] outline-none focus:border-[#00b090] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-heading font-bold text-[#191c1e] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-[#191c1e] outline-none focus:border-[#00b090] disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary text-xs py-2.5 w-full justify-center shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#E2E8F0]"></div>
          <span className="bg-white px-3 text-[10px] uppercase font-mono text-[#565e74] absolute">
            Or Quick Access
          </span>
        </div>

        <button
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="btn-secondary text-xs py-2.5 w-full justify-center disabled:opacity-60"
        >
          <UserCheck className="w-4 h-4 text-[#00b090]" />
          <span>Continue as Guest (Instant Preview)</span>
        </button>

        <div className="text-center text-xs text-[#565e74]">
          {mode === 'login' ? (
            <span>
              Don't have a ledger yet?{' '}
              <button
                onClick={() => handleModeSwitch('signup')}
                disabled={isLoading}
                className="font-heading font-bold text-[#006b57] hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => handleModeSwitch('login')}
                disabled={isLoading}
                className="font-heading font-bold text-[#006b57] hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
