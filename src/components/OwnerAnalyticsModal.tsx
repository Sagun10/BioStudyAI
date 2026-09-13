import React, { useState, useEffect } from 'react';
import { AdminMetrics } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Brain, 
  Target, 
  Calendar, 
  Stethoscope, 
  X, 
  RefreshCw, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Gift, 
  Sparkles, 
  KeyRound, 
  TrendingUp, 
  Clock, 
  Globe, 
  Laptop
} from 'lucide-react';

interface OwnerAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerAnalyticsModal: React.FC<OwnerAnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [passkey, setPasskey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showSubscriptionSim, setShowSubscriptionSim] = useState<boolean>(false);

  // Check stored auth
  useEffect(() => {
    const savedKey = localStorage.getItem('biomentor_owner_key');
    if (savedKey === 'biomentor-admin-2026' || savedKey === 'beherasagun@gmail.com') {
      setIsAuthenticated(true);
      fetchMetrics(savedKey);
    }
  }, [isOpen]);

  const fetchMetrics = async (authKey: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/metrics?key=${encodeURIComponent(authKey)}`, {
        headers: {
          'x-admin-key': authKey,
        },
      });

      if (!res.ok) {
        throw new Error('Invalid passkey or unauthorized owner access.');
      }

      const data: AdminMetrics = await res.json();
      setMetrics(data);
      setIsAuthenticated(true);
      localStorage.setItem('biomentor_owner_key', authKey);
    } catch (err: any) {
      console.error('Owner metrics fetch error:', err);
      setErrorMsg(err.message || 'Failed to fetch owner analytics');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;
    fetchMetrics(passkey.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('biomentor_owner_key');
    setIsAuthenticated(false);
    setMetrics(null);
    setPasskey('');
  };

  if (!isOpen) return null;

  return (
    <div id="owner-analytics-modal-backdrop" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div id="owner-analytics-modal-content" className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">Private Creator & Owner Analytics Console</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Confidential • Owner Only
                </span>
              </div>
              <p className="text-xs text-slate-400">Audience metrics and free tier management hidden from the public learner UI.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => fetchMetrics(localStorage.getItem('biomentor_owner_key') || 'biomentor-admin-2026')}
                disabled={isLoading}
                title="Refresh Analytics"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {!isAuthenticated ? (
            /* Passkey Authentication Form */
            <div className="max-w-md mx-auto py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">Owner Verification Required</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Visitor counts and platform metrics are strictly private to the creator. Enter your owner passkey or registered email (<code className="text-indigo-300 font-mono">beherasagun@gmail.com</code>) to access.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl text-left">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3 pt-2">
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter Owner Passkey or Email..."
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading || !passkey.trim()}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Unlock Creator Metrics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPasskey('beherasagun@gmail.com');
                      fetchMetrics('beherasagun@gmail.com');
                    }}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
                  >
                    Use Owner Email
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Authenticated Metrics Dashboard */
            metrics && (
              <div className="space-y-5 animate-fadeIn">
                {/* 1. Top KPI Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Live Active Now */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/30 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Live Active Now</span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-300">{metrics.activeUsersNow}</span>
                      <span className="text-[11px] text-slate-400">online learner(s)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Active in last 10 minutes</p>
                  </div>

                  {/* Total Unique Visitors */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Total Unique Users</span>
                      <Users className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-100">{metrics.totalUniqueVisitors}</span>
                      <span className="text-[11px] text-emerald-400 font-bold">+100% organic</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Unique device footprints</p>
                  </div>

                  {/* Total Sessions */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Total Study Sessions</span>
                      <Activity className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-100">{metrics.totalSessions}</span>
                      <span className="text-[11px] text-slate-400">runs</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Page loads & heartbeats</p>
                  </div>

                  {/* Total AI Questions & Queries */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">AI Socratic Queries</span>
                      <Sparkles className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-100">
                        {metrics.totalChatMessages + metrics.totalNotesDiagnosed + metrics.totalCasesSimulated + metrics.totalSchedulesGenerated}
                      </span>
                      <span className="text-[11px] text-slate-400">interactions</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Total model generations</p>
                  </div>
                </div>

                {/* 2. Free Tier & Subscription Policy Status Banner */}
                <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Current Access Policy: 100% Free Open Educational Access
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Zero Paywalls Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      All biology models, Socratic tutoring dialogue, multimodal handwritten note diagnoses, clinical case simulations, and spaced repetition schedule generation are unrestricted and free for all learners worldwide.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowSubscriptionSim(!showSubscriptionSim)}
                    className="shrink-0 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{showSubscriptionSim ? 'Hide Subscription Controls' : 'Future Monetization Settings'}</span>
                  </button>
                </div>

                {/* Optional Future Subscription Configuration Drawer */}
                {showSubscriptionSim && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Future Subscription Model Sandbox</span>
                      <span className="text-[10px] text-amber-400 font-mono">STATUS: Currently in 100% Free Mode</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Whenever you decide to introduce paid tiers (e.g. Pro Med Pass, Institutional licenses), you can configure pricing plans here. For now, all content remains completely open and free with no barriers.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="font-bold text-slate-200 block">Free Tier (Active)</span>
                        <span className="text-[11px] text-emerald-400">$0/mo • Unlimited Socratic Chat, Notes & Atlas</span>
                      </div>
                      <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 opacity-60">
                        <span className="font-bold text-slate-300 block">Pro Student (Planned)</span>
                        <span className="text-[11px] text-slate-400">Offline Anki Exports, 1-on-1 OSCE Audio</span>
                      </div>
                      <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 opacity-60">
                        <span className="font-bold text-slate-300 block">Medical School Campus (Planned)</span>
                        <span className="text-[11px] text-slate-400">Classroom Analytics & Custom Cohort Decks</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Feature Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Usage Breakdown by Tool */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Learning Module Engagement Breakdown
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-slate-200">Socratic Tutoring Dialogues</span>
                        </div>
                        <span className="font-mono font-bold text-slate-100">{metrics.totalChatMessages} queries</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-400" />
                          <span className="font-semibold text-slate-200">Multimodal Handwritten Note Diagnoses</span>
                        </div>
                        <span className="font-mono font-bold text-slate-100">{metrics.totalNotesDiagnosed} notes analyzed</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-rose-400" />
                          <span className="font-semibold text-slate-200">Clinical Case Step Evaluations</span>
                        </div>
                        <span className="font-mono font-bold text-slate-100">{metrics.totalCasesSimulated} cases practiced</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-slate-200">7-Day Spaced Repetition Plans</span>
                        </div>
                        <span className="font-mono font-bold text-slate-100">{metrics.totalSchedulesGenerated} schedules generated</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Learner Activity Feed */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Live Interaction Activity Stream
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Real-time Telemetry</span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {metrics.recentActivity.map((act) => (
                          <div key={act.id} className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/60 text-xs flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                  act.type === 'chat' ? 'bg-emerald-500/20 text-emerald-300' :
                                  act.type === 'diagnosis' ? 'bg-indigo-500/20 text-indigo-300' :
                                  act.type === 'case_sim' ? 'bg-rose-500/20 text-rose-300' :
                                  act.type === 'schedule' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {act.type}
                                </span>
                                <span className="text-slate-300 text-[11px] font-medium truncate max-w-[200px] sm:max-w-xs">
                                  {act.details}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Logged in as: <strong className="text-slate-200">beherasagun@gmail.com</strong></span>
                      <button
                        onClick={handleLogout}
                        className="text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Lock Console
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Confidential Creator Workspace • User counts remain hidden on public views</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
