import React from 'react';
import { Sparkles, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface GuestLimitedBannerProps {
  onUpgradeClick: () => void;
  guestQuestionsLeft?: number;
  maxQuestions?: number;
}

export const GuestLimitedBanner: React.FC<GuestLimitedBannerProps> = ({
  onUpgradeClick,
  guestQuestionsLeft = 3,
  maxQuestions = 3,
}) => {
  return (
    <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-indigo-500/15 border border-amber-500/30 text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
              Guest Preview Mode
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[10px] font-bold">
              {guestQuestionsLeft} / {maxQuestions} AI Queries Left
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Enjoying the visual cross-sections & AI explanations? Register free or upgrade to Pro for unlimited access to all 8 models and board exam question banks.
          </p>
        </div>
      </div>

      <button
        onClick={onUpgradeClick}
        className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md hover:shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 group"
      >
        <span>Unlock Full Pro</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
      </button>
    </div>
  );
};
