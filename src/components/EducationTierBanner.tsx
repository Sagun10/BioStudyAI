import React, { useState } from 'react';
import { EducationLevel } from '../types';
import { EDUCATION_TIERS } from '../data/educationLevelConfig';
import { 
  School, 
  GraduationCap, 
  Stethoscope, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Layers, 
  BookOpen, 
  Target, 
  Info,
  HelpCircle,
  X
} from 'lucide-react';

interface EducationTierBannerProps {
  educationLevel: EducationLevel;
  onSelectLevel: (level: EducationLevel) => void;
  compact?: boolean;
}

export const EducationTierBanner: React.FC<EducationTierBannerProps> = ({
  educationLevel,
  onSelectLevel,
  compact = false,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const currentTier = EDUCATION_TIERS[educationLevel];

  const getTierIcon = (level: EducationLevel) => {
    switch (level) {
      case 'school':
        return <School className="w-4 h-4 text-amber-400" />;
      case 'undergrad':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'grad':
        return <Stethoscope className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <>
      {/* Tier Status Banner */}
      <div 
        className={`w-full rounded-2xl bg-gradient-to-r ${currentTier.gradient} border ${currentTier.badgeBorder} p-3 sm:p-4 mb-6 backdrop-blur transition-all shadow-lg`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Current Active Level & Target Exams */}
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2.5 rounded-xl ${currentTier.badgeBg} border ${currentTier.badgeBorder} shrink-0`}>
              {getTierIcon(educationLevel)}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Active Study Tier:
                </span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${currentTier.badgeBg} ${currentTier.badgeText} border ${currentTier.badgeBorder}`}>
                  {currentTier.name}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">•</span>
                <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                  Targeting: <strong className="text-slate-100">{currentTier.targetExams.slice(0, 3).join(', ')}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug line-clamp-1">
                {currentTier.heroTagline}
              </p>
            </div>
          </div>

          {/* Right: Quick Switcher Tabs & Compare Modal Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              {(['school', 'undergrad', 'grad'] as EducationLevel[]).map((level) => {
                const tier = EDUCATION_TIERS[level];
                const isActive = educationLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => onSelectLevel(level)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                      isActive
                        ? `${tier.badgeBg} ${tier.badgeText} border ${tier.badgeBorder} shadow-sm`
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {level === 'school' && <School className="w-3.5 h-3.5" />}
                    {level === 'undergrad' && <GraduationCap className="w-3.5 h-3.5" />}
                    {level === 'grad' && <Stethoscope className="w-3.5 h-3.5" />}
                    <span>{tier.shortName}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 px-2.5 font-semibold"
              title="Compare all 3 education tiers"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Compare Tiers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deep Differentiation Comparison Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">How BioStudy AI Adapts to Every Education Level</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Switching levels instantly customizes vocabulary depth, AI tutor explanations, anatomical inspector pearls, biochemical pathways, flashcards, and practice quiz questions.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3-Column Comparative Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['school', 'undergrad', 'grad'] as EducationLevel[]).map((level) => {
                const tier = EDUCATION_TIERS[level];
                const isCurrent = educationLevel === level;

                return (
                  <div
                    key={level}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? `bg-gradient-to-b ${tier.gradient} ${tier.badgeBorder} ring-2 ring-offset-2 ring-offset-slate-900 ring-emerald-500/50 shadow-xl`
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Tier Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl ${tier.badgeBg} ${tier.badgeBorder} border`}>
                            {getTierIcon(level)}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">{tier.name}</h4>
                            <span className={`text-[10px] font-bold ${tier.badgeText}`}>
                              {tier.badge}
                            </span>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {tier.heroTagline}
                      </p>

                      {/* Target Exams */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Target Exams & Curricula:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tier.targetExams.map((exam, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pedagogical Approach */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Tutor Strategy & Depth:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                          {tier.learningApproach}
                        </p>
                      </div>

                      {/* Specialized Level Modes */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Specialized Study Tools:
                        </span>
                        <ul className="space-y-1">
                          {tier.specializedModes.map((mode, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span>{mode.icon}</span>
                              <span className="font-medium text-slate-200">{mode.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Select This Tier Button */}
                    <button
                      onClick={() => {
                        onSelectLevel(level);
                        setShowModal(false);
                      }}
                      className={`w-full mt-5 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Currently Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Switch to {tier.shortName}</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
