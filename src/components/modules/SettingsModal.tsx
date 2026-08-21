import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Shield, 
  Activity, 
  Sliders, 
  Database, 
  LogOut, 
  RotateCcw, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  Bell, 
  DollarSign, 
  Lock,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getStorageKey } from '../../utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogout?: () => void;
}

type SettingsTab = 'account' | 'simulator' | 'preferences' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Account tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Preferences state
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('finsight_pref_currency') || 'INR';
  });
  const [leakageAlerts, setLeakageAlerts] = useState<boolean>(() => {
    return localStorage.getItem('finsight_pref_leakage_alerts') !== 'false';
  });
  const [sebiFactChecker, setSebiFactChecker] = useState<boolean>(() => {
    return localStorage.getItem('finsight_pref_sebi_factcheck') !== 'false';
  });
  const [volatilityAlerts, setVolatilityAlerts] = useState<boolean>(() => {
    return localStorage.getItem('finsight_pref_volatility_alerts') !== 'false';
  });
  const [displayFormat, setDisplayFormat] = useState<string>(() => {
    return localStorage.getItem('finsight_pref_display_format') || 'standard';
  });

  // Action status toasts/feedback
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'warning' | 'danger' } | null>(null);

  // Simulator info live count
  const [sandboxCash, setSandboxCash] = useState<number>(0);
  const [tradeCount, setTradeCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      try {
        const cashStr = localStorage.getItem(getStorageKey('finsight_sandbox_cash'));
        setSandboxCash(cashStr ? Number(cashStr) : 0);
        const tradesStr = localStorage.getItem(getStorageKey('finsight_sandbox_trades'));
        setTradeCount(tradesStr ? JSON.parse(tradesStr).length : 0);
      } catch {
        setSandboxCash(0);
        setTradeCount(0);
      }
    }
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clear feedback message after 4s
  useEffect(() => {
    if (actionFeedback) {
      const t = setTimeout(() => setActionFeedback(null), 4000);
      return () => clearTimeout(t);
    }
  }, [actionFeedback]);

  if (!isOpen) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    // Success simulation
    setPasswordFeedback({ type: 'success', message: 'Security credentials updated successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  const handleSaveCurrency = (newCurr: string) => {
    setCurrency(newCurr);
    localStorage.setItem('finsight_pref_currency', newCurr);
    setActionFeedback({ message: `Base currency set to ${newCurr}.`, type: 'success' });
  };

  const handleTogglePreference = (key: string, val: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>, label: string) => {
    setter(val);
    localStorage.setItem(key, String(val));
    setActionFeedback({ message: `${label} preference updated.`, type: 'success' });
  };

  const handleResetSandbox = () => {
    if (window.confirm('Are you sure you want to reset the Virtual Market Sandbox? All simulated cash and trades will be reset to defaults.')) {
      localStorage.setItem(getStorageKey('finsight_sandbox_cash'), '500000');
      localStorage.setItem(getStorageKey('finsight_sandbox_trades'), '[]');
      setSandboxCash(500000);
      setTradeCount(0);
      setActionFeedback({ message: 'Market Sandbox reset to ₹5,00,000 virtual cash with empty ledger.', type: 'warning' });
    }
  };

  const handleWipeCrashHistory = () => {
    if (window.confirm('Wipe historical crisis simulation reaction logs?')) {
      localStorage.removeItem('finsight_crisis_history_logs');
      setActionFeedback({ message: 'Crash replay sandbox logs and reaction records wiped.', type: 'warning' });
    }
  };

  const handleExportCSV = () => {
    try {
      const holdings = localStorage.getItem(getStorageKey('finsight_portfolio_holdings')) || '[]';
      const goals = localStorage.getItem(getStorageKey('finsight_goals')) || '[]';
      const transactions = localStorage.getItem(getStorageKey('finsight_spend_transactions')) || '[]';

      const parsedHoldings = JSON.parse(holdings);
      const parsedGoals = JSON.parse(goals);
      const parsedTxns = JSON.parse(transactions);

      let csv = `FINSIGHT INSTITUTIONAL LEDGER AUDIT EXPORT\nGenerated: ${new Date().toISOString()}\nInvestor: ${user.name} (${user.email})\n\n`;
      
      csv += `--- PORTFOLIO HOLDINGS ---\nAsset,Type,Quantity,Avg Price,Current Price,Platform\n`;
      parsedHoldings.forEach((h: any) => {
        csv += `"${h.name || h.symbol || ''}","${h.type || ''}",${h.quantity || 0},${h.avgPrice || 0},${h.currentPrice || 0},"${h.platform || ''}"\n`;
      });

      csv += `\n--- CAPITAL GOALS ---\nGoal Name,Target Amount,Current Amount,Target Year,Priority\n`;
      parsedGoals.forEach((g: any) => {
        csv += `"${g.title || ''}",${g.targetAmount || 0},${g.currentAmount || 0},${g.targetYear || ''},"${g.priority || ''}"\n`;
      });

      csv += `\n--- SPEND & SIP LEDGER ---\nDescription,Category,Amount,Frequency,Impact\n`;
      parsedTxns.forEach((t: any) => {
        csv += `"${t.title || t.description || ''}","${t.category || ''}",${t.amount || 0},"${t.frequency || ''}","${t.leakageScore || ''}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FinSight_Ledger_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setActionFeedback({ message: 'Ledger exported successfully as CSV.', type: 'success' });
    } catch (e) {
      console.error(e);
      setActionFeedback({ message: 'Failed to export CSV ledger.', type: 'danger' });
    }
  };

  const handleExportJSON = () => {
    try {
      const dataToExport = {
        investor: {
          name: user.name,
          email: user.email,
          riskCategory: user.riskCategory,
          exportedAt: new Date().toISOString(),
        },
        portfolio: JSON.parse(localStorage.getItem(getStorageKey('finsight_portfolio_holdings')) || '[]'),
        goals: JSON.parse(localStorage.getItem(getStorageKey('finsight_goals')) || '[]'),
        spendTransactions: JSON.parse(localStorage.getItem(getStorageKey('finsight_spend_transactions')) || '[]'),
        sandboxCash: localStorage.getItem(getStorageKey('finsight_sandbox_cash')),
        sandboxTrades: JSON.parse(localStorage.getItem(getStorageKey('finsight_sandbox_trades')) || '[]'),
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FinSight_Backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setActionFeedback({ message: 'Institutional JSON backup exported successfully.', type: 'success' });
    } catch (e) {
      console.error(e);
      setActionFeedback({ message: 'Failed to export JSON backup.', type: 'danger' });
    }
  };

  const handleTerminateAccount = () => {
    if (window.prompt('WARNING: This will purge all portfolio data, goals, simulator logs, and session tokens. Type "TERMINATE" to confirm:') === 'TERMINATE') {
      localStorage.clear();
      onClose();
      if (onLogout) {
        onLogout();
      } else {
        logout();
      }
    }
  };

  const handleExecuteLogout = () => {
    onClose();
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl border border-[#E2E8F0] max-w-4xl w-full h-[640px] shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00b090]/10 text-[#006b57] flex items-center justify-center border border-[#00b090]/20">
              <Sliders className="w-5 h-5 text-[#006b57]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-heading font-extrabold text-[#191c1e]">
                  Institutional Ledger Settings
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#f2f4f6] text-[#006b57] border border-[#E2E8F0]">
                  v1.2.0 • Security L3
                </span>
              </div>
              <p className="text-xs text-[#565e74]">
                Configure security parameters, simulator execution desk, and institutional data retention.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#565e74] hover:bg-[#f2f4f6] hover:text-[#191c1e] transition-colors border border-transparent hover:border-[#E2E8F0]"
            title="Close Settings (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {actionFeedback && (
          <div className={`px-6 py-2.5 text-xs flex items-center justify-between border-b transition-all ${
            actionFeedback.type === 'success' ? 'bg-[#00b090]/10 text-[#006b57] border-[#00b090]/20' :
            actionFeedback.type === 'warning' ? 'bg-[#ffdad6]/40 text-[#ba1a1a] border-[#ba1a1a]/20' :
            'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#006b57] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
              )}
              <span>{actionFeedback.message}</span>
            </div>
            <button onClick={() => setActionFeedback(null)} className="text-[11px] underline hover:opacity-80">Dismiss</button>
          </div>
        )}

        {/* Main Body: Sidebar Tabs + Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Tabs Nav */}
          <div className="w-56 bg-[#f7f9fb] border-r border-[#E2E8F0] p-3 flex flex-col justify-between shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all text-left ${
                  activeTab === 'account'
                    ? 'bg-white text-[#006b57] shadow-sm border border-[#E2E8F0]'
                    : 'text-[#565e74] hover:bg-[#eceef0] hover:text-[#191c1e]'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'account' ? 'text-[#006b57]' : 'text-[#565e74]'}`} />
                <span>Account & Security</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all text-left ${
                  activeTab === 'simulator'
                    ? 'bg-white text-[#006b57] shadow-sm border border-[#E2E8F0]'
                    : 'text-[#565e74] hover:bg-[#eceef0] hover:text-[#191c1e]'
                }`}
              >
                <Activity className={`w-4 h-4 ${activeTab === 'simulator' ? 'text-[#006b57]' : 'text-[#565e74]'}`} />
                <span>Simulator Control</span>
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all text-left ${
                  activeTab === 'preferences'
                    ? 'bg-white text-[#006b57] shadow-sm border border-[#E2E8F0]'
                    : 'text-[#565e74] hover:bg-[#eceef0] hover:text-[#191c1e]'
                }`}
              >
                <Sliders className={`w-4 h-4 ${activeTab === 'preferences' ? 'text-[#006b57]' : 'text-[#565e74]'}`} />
                <span>Preferences</span>
              </button>

              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all text-left ${
                  activeTab === 'data'
                    ? 'bg-white text-[#006b57] shadow-sm border border-[#E2E8F0]'
                    : 'text-[#565e74] hover:bg-[#eceef0] hover:text-[#191c1e]'
                }`}
              >
                <Database className={`w-4 h-4 ${activeTab === 'data' ? 'text-[#006b57]' : 'text-[#565e74]'}`} />
                <span>Data Governance</span>
              </button>
            </nav>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={handleExecuteLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-heading font-bold text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-white space-y-6">
            {/* TAB 1: Account & Security */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                    Investor Identity
                  </h4>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    Credentials and institutional verification status for this ledger session.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#006b57] text-white flex items-center justify-center font-heading font-bold text-lg shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-[#191c1e]">{user.name}</span>
                        <span className="text-[10px] font-mono bg-[#00b090]/15 text-[#006b57] font-semibold px-2 py-0.5 rounded">
                          Active Investor
                        </span>
                      </div>
                      <p className="text-xs text-[#565e74] font-mono mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-[#565e74] block">Risk Classification</span>
                    <span className="text-xs font-heading font-bold text-[#006b57]">{user.riskCategory || 'Moderate Growth'}</span>
                  </div>
                </div>

                {/* Change Password Form */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#006b57]" />
                    <h4 className="text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                      Security Passcode & Authentication
                    </h4>
                  </div>

                  {passwordFeedback && (
                    <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      passwordFeedback.type === 'success' 
                        ? 'bg-[#00b090]/10 text-[#006b57] border border-[#00b090]/20' 
                        : 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20'
                    }`}>
                      {passwordFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span>{passwordFeedback.message}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-[11px] font-heading font-bold text-[#191c1e] mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs outline-none focus:border-[#00b090]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-heading font-bold text-[#191c1e] mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs outline-none focus:border-[#00b090]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-heading font-bold text-[#191c1e] mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs outline-none focus:border-[#00b090]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-secondary text-xs py-2 px-4 mt-1 font-heading font-bold"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Session Security */}
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-xs text-[#191c1e] block">
                        Active JWT Session
                      </span>
                      <span className="text-[11px] text-[#565e74]">
                        HttpOnly, SameSite=Strict cryptographic cookie. Expires in 7 days.
                      </span>
                    </div>
                    <button
                      onClick={handleExecuteLogout}
                      className="btn-secondary text-xs py-1.5 px-3 text-[#ba1a1a] hover:bg-[#ffdad6] hover:border-[#ba1a1a]/30"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminate Session</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Simulator Control */}
            {activeTab === 'simulator' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                    Market Sandbox & Crisis Engine Controls
                  </h4>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    Reset paper trade execution ledgers, virtual cash reserves, and historical stress tests.
                  </p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#565e74] tracking-wider">Current Sandbox Cash</span>
                    <div className="text-xl font-heading font-extrabold text-[#006b57] font-mono">
                      ₹{sandboxCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[10px] text-[#565e74]">Allocated virtual capital for paper trading</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#565e74] tracking-wider">Recorded Executions</span>
                    <div className="text-xl font-heading font-extrabold text-[#191c1e] font-mono">
                      {tradeCount} Trades
                    </div>
                    <span className="text-[10px] text-[#565e74]">Stored in local simulated order book</span>
                  </div>
                </div>

                {/* Danger Zone Actions */}
                <div className="p-5 rounded-xl bg-white border border-[#ba1a1a]/20 space-y-4">
                  <div className="flex items-center gap-2 text-[#ba1a1a]">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-heading font-bold text-xs uppercase tracking-wider">
                      Simulator Danger Zone
                    </span>
                  </div>

                  <div className="space-y-3 divide-y divide-[#E2E8F0]">
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="font-heading font-bold text-xs text-[#191c1e] block">
                          Reset Sandbox Portfolio
                        </span>
                        <span className="text-[11px] text-[#565e74]">
                          Purges simulated trade orders and resets virtual cash balance to ₹5,00,000.
                        </span>
                      </div>
                      <button
                        onClick={handleResetSandbox}
                        className="btn-secondary text-xs py-1.5 px-3 text-[#ba1a1a] hover:bg-[#ffdad6]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Sandbox</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div>
                        <span className="font-heading font-bold text-xs text-[#191c1e] block">
                          Wipe Crash Replay History
                        </span>
                        <span className="text-[11px] text-[#565e74]">
                          Clears behavioral outcome logs recorded during March 2020 and 2008 GFC tests.
                        </span>
                      </div>
                      <button
                        onClick={handleWipeCrashHistory}
                        className="btn-secondary text-xs py-1.5 px-3 text-[#ba1a1a] hover:bg-[#ffdad6]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Wipe History</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                    Institutional Display & Alerts
                  </h4>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    Customize currency units, precision levels, and autonomous leakage alerts.
                  </p>
                </div>

                {/* Base Currency */}
                <div className="space-y-2">
                  <label className="block text-xs font-heading font-bold text-[#191c1e]">
                    Base Reporting Currency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { code: 'INR', symbol: '₹', label: 'Indian Rupee (Default)' },
                      { code: 'USD', symbol: '$', label: 'US Dollar' },
                      { code: 'EUR', symbol: '€', label: 'Euro' },
                    ].map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleSaveCurrency(curr.code)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          currency === curr.code
                            ? 'border-[#006b57] bg-[#00b090]/10 text-[#006b57]'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs text-[#191c1e]">{curr.code} ({curr.symbol})</span>
                          {currency === curr.code && <Check className="w-4 h-4 text-[#006b57]" />}
                        </div>
                        <span className="text-[10px] text-[#565e74] block mt-0.5">{curr.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Toggles */}
                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                    System Intelligence & Guardrails
                  </span>

                  <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <span className="font-heading font-bold text-xs text-[#191c1e] block">
                          Expense Leakage Warnings
                        </span>
                        <span className="text-[11px] text-[#565e74]">
                          Autonomous warning triggers when discretionary leakage exceeds ₹5,000/month.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={leakageAlerts}
                        onChange={(e) => handleTogglePreference('finsight_pref_leakage_alerts', e.target.checked, setLeakageAlerts, 'Leakage alerts')}
                        className="w-4 h-4 accent-[#006b57] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                      <div className="pr-4">
                        <span className="font-heading font-bold text-xs text-[#191c1e] block">
                          SEBI/RBI Empirical Auditor Guardrail
                        </span>
                        <span className="text-[11px] text-[#565e74]">
                          Enforce mathematical friction checks and regulatory ground truth on claim analysis.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={sebiFactChecker}
                        onChange={(e) => handleTogglePreference('finsight_pref_sebi_factcheck', e.target.checked, setSebiFactChecker, 'SEBI Fact-Checker')}
                        className="w-4 h-4 accent-[#006b57] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                      <div className="pr-4">
                        <span className="font-heading font-bold text-xs text-[#191c1e] block">
                          Market Volatility & Drawdown Alerts
                        </span>
                        <span className="text-[11px] text-[#565e74]">
                          Display risk badges when benchmark indices drop &gt;2% in a single trading session.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={volatilityAlerts}
                        onChange={(e) => handleTogglePreference('finsight_pref_volatility_alerts', e.target.checked, setVolatilityAlerts, 'Volatility alerts')}
                        className="w-4 h-4 accent-[#006b57] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Data Control */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                    Institutional Data Governance & Portability
                  </h4>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    Export audit-ready CSV ledgers, generate full cryptographic backups, or purge local stores.
                  </p>
                </div>

                {/* Export Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#006b57]">
                        <FileSpreadsheet className="w-5 h-5" />
                        <span className="font-heading font-bold text-xs text-[#191c1e]">Export Ledger (CSV)</span>
                      </div>
                      <p className="text-[11px] text-[#565e74] mt-1">
                        Spreadsheet export including portfolio holdings, goals, and spend transactions.
                      </p>
                    </div>
                    <button
                      onClick={handleExportCSV}
                      className="btn-primary text-xs py-2 px-3 justify-center shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#006b57]">
                        <FileCode className="w-5 h-5" />
                        <span className="font-heading font-bold text-xs text-[#191c1e]">Full JSON Ledger Backup</span>
                      </div>
                      <p className="text-[11px] text-[#565e74] mt-1">
                        Complete raw cryptographic state backup for cold storage and multi-device restore.
                      </p>
                    </div>
                    <button
                      onClick={handleExportJSON}
                      className="btn-secondary text-xs py-2 px-3 justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>
                </div>

                {/* Account Termination Danger Zone */}
                <div className="p-5 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#ba1a1a]">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-heading font-bold text-xs uppercase tracking-wider">
                      Permanent Data Termination
                    </span>
                  </div>
                  <p className="text-xs text-[#565e74] leading-relaxed">
                    This action will permanently erase all local encrypted ledgers, holdings statements, goals, trade history, and session tokens. This action is irreversible.
                  </p>
                  <button
                    onClick={handleTerminateAccount}
                    className="btn-secondary text-xs py-2 px-4 text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white border-[#ba1a1a]/30 transition-colors font-heading font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Terminate Account & Purge All Records</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
