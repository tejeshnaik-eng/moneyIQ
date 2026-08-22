import React, { useEffect, useState } from 'react';
import { X, User, Mail, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data } = await supabase.from('risk_profiles').select('profile_data').eq('user_id', user.id).single();
        if (data && data.profile_data) {
          setProfileData(data.profile_data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const rawAnswers = profileData?.raw_answers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B0A]/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#161616] border border-[#222] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#111111]">
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-3">
            <User className="w-5 h-5 text-[#20EFA0]" />
            Account Details
          </h2>
          <button onClick={onClose} className="text-[#71717A] hover:text-white p-1 rounded-full hover:bg-[#222] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Identity Section */}
          <div className="flex items-center gap-4 p-5 border border-[#222] rounded-2xl bg-[#080B0A] mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#A855F7] flex items-center justify-center text-2xl font-bold text-white font-heading">
                {user?.name ? user.name[0].toUpperCase() : user?.email?.[0].toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">{user?.name || 'Finsight User'}</h3>
              <p className="text-[#71717A] text-sm font-body flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-[#20EFA0]/10 text-[#20EFA0] border border-[#20EFA0]/20 rounded-full text-xs font-bold tracking-widest uppercase">
                Verified
              </span>
            </div>
          </div>

          {/* Profile Data */}
          {loading ? (
            <div className="h-32 flex items-center justify-center text-[#71717A] text-sm animate-pulse">Loading profile data...</div>
          ) : profileData ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-heading font-bold text-[#71717A] uppercase tracking-widest mb-3">AI Risk Assessment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111111] border border-[#222] rounded-xl p-4">
                    <span className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider block mb-1">Archetype</span>
                    <span className="text-white font-bold">{profileData.keyTrait}</span>
                  </div>
                  <div className="bg-[#111111] border border-[#222] rounded-xl p-4">
                    <span className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider block mb-1">Score</span>
                    <span className="text-[#20EFA0] font-bold text-lg leading-none">{profileData.overallScore}</span><span className="text-[#71717A] text-xs">/100</span>
                  </div>
                </div>
              </div>

              {rawAnswers && (
                <div>
                  <button 
                    onClick={() => setShowRaw(!showRaw)}
                    className="w-full flex justify-between items-center bg-[#111111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-colors"
                  >
                    <span className="font-heading font-bold text-white text-sm">Initial Questionnaire Database</span>
                    {showRaw ? <ChevronUp className="w-4 h-4 text-[#71717A]" /> : <ChevronDown className="w-4 h-4 text-[#71717A]" />}
                  </button>

                  {showRaw && (
                    <div className="mt-2 border border-[#222] rounded-xl overflow-hidden divide-y divide-[#222] bg-[#080B0A]">
                      {Object.entries(rawAnswers).map(([key, val]) => (
                        <div key={key} className="p-3 px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 hover:bg-[#111] transition-colors">
                          <span className="text-xs font-mono text-[#71717A]">{key}</span>
                          <span className="text-sm text-white font-medium text-right">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#222] rounded-2xl p-6 text-center flex flex-col items-center">
              <Shield className="w-10 h-10 text-[#71717A] mb-3" />
              <h4 className="text-white font-heading font-bold mb-1">No Assessment Data</h4>
              <p className="text-sm text-[#71717A]">Complete the AI Risk Profiling questionnaire to see your details here.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222] bg-[#111111] flex justify-end">
          <button 
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
