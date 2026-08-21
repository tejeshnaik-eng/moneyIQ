import React, { useState } from 'react';
import { Landmark, X, ArrowRight, UserCheck } from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  /*
   * AUTH STUB NOTE:
   * Mock authentication handler for prototyping.
   * Real endpoint: POST /api/v1/auth/login or register
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      name: name || email.split('@')[0],
      email: email,
      age: 30,
      occupation: 'Professional',
      city: 'India',
      monthlyIncome: 0,
      riskCategory: 'Not Assessed',
      healthScore: 0,
      isGuest: false,
    });
    onClose();
  };

  const handleGuestLogin = () => {
    onSuccess({
      name: 'Guest User',
      age: 25,
      email: 'guest@finsight.com',
      occupation: 'Guest',
      city: 'India',
      monthlyIncome: 0,
      riskCategory: 'Not Assessed',
      healthScore: 0,
      isGuest: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] max-w-md w-full p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-[#565e74] hover:text-[#191c1e] transition-colors"
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-heading font-bold text-[#191c1e] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-[#191c1e] outline-none focus:border-[#00b090]"
              />
            </div>
          )}

          <div>
            <label className="block font-heading font-bold text-[#191c1e] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-[#191c1e] outline-none focus:border-[#00b090]"
            />
          </div>

          <div>
            <label className="block font-heading font-bold text-[#191c1e] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-[#191c1e] outline-none focus:border-[#00b090]"
            />
          </div>

          <button
            type="submit"
            className="btn-primary text-xs py-2.5 w-full justify-center shadow-sm"
          >
            <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
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
          className="btn-secondary text-xs py-2.5 w-full justify-center"
        >
          <UserCheck className="w-4 h-4 text-[#00b090]" />
          <span>Continue as Guest (Instant Preview)</span>
        </button>

        <div className="text-center text-xs text-[#565e74]">
          {mode === 'login' ? (
            <span>
              Don't have a ledger yet?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-heading font-bold text-[#006b57] hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
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
