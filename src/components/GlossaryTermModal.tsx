import React from 'react';
import { GlossaryTerm, EducationLevel } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Stethoscope, 
  Zap, 
  ArrowRight,
  GraduationCap,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { findGlossaryTerm } from '../data/glossaryData';

interface GlossaryTermModalProps {
  term: GlossaryTerm | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRelatedTerm?: (term: GlossaryTerm) => void;
  onAskTutor?: (question: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (termId: string) => void;
}

export const GlossaryTermModal: React.FC<GlossaryTermModalProps> = ({
  term,
  isOpen,
  onClose,
  onSelectRelatedTerm,
  onAskTutor,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);

  if (!isOpen || !term) return null;

  const handleCopy = () => {
    const textToCopy = `${term.term} (${term.category}): ${term.definition}\n\nMechanism: ${term.mechanism}\n\nClinical Pearl: ${term.clinicalPearl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term.term);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Physiology': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Anatomy': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Biochemistry': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Cell & Molecular': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Genetics': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Immunology': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Neurobiology': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin relative text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Badges & Close Button */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryColor(term.category)}`}>
                {term.category}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {term.level.toUpperCase()} LEVEL
              </span>
              {term.etymology && (
                <span className="text-[10px] text-slate-400 italic">
                  ({term.etymology})
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {term.term}
              </h2>
              {term.pronunciation && (
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                  {term.pronunciation}
                </span>
              )}
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition ${
                  speaking ? 'text-emerald-400 animate-pulse' : ''
                }`}
                title="Listen to pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(term.id)}
                className={`p-2 rounded-xl border transition ${
                  isBookmarked 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this term'}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 transition"
              title="Copy definition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Definition */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Definition</span>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
            {term.definition}
          </p>
        </div>

        {/* Physiological Mechanism */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Biochemical & Physiological Mechanism</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-cyan-950/20 border border-cyan-500/20 p-3.5 rounded-2xl">
            {term.mechanism}
          </p>
        </div>

        {/* Clinical & Board Exam Pearl */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Pearl & Board Exam High-Yield</span>
          </div>
          <div className="text-xs text-amber-200/90 leading-relaxed bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-2xl">
            {term.clinicalPearl}
          </div>
        </div>

        {/* Related Terms Navigation */}
        {term.relatedTerms && term.relatedTerms.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Related Concepts in Glossary:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {term.relatedTerms.map((relName, idx) => {
                const target = findGlossaryTerm(relName);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (target && onSelectRelatedTerm) {
                        onSelectRelatedTerm(target);
                      } else if (onAskTutor) {
                        onAskTutor(`Explain ${relName} and its connection to ${term.term}`);
                        onClose();
                      }
                    }}
                    className="text-xs bg-slate-950 hover:bg-slate-800 text-teal-300 hover:text-teal-200 px-3 py-1 rounded-xl border border-slate-800 hover:border-teal-500/40 transition flex items-center gap-1"
                  >
                    <span>{relName}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">
            Interactive Medical & Biology Glossary
          </span>
          
          {onAskTutor && (
            <button
              onClick={() => {
                onAskTutor(`Please explain the concept of "${term.term}" in detail, including its physiological mechanism, clinical significance, and any high-yield mnemonics.`);
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Tutor About "{term.term}"</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
