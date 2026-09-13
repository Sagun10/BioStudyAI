import React, { useState } from 'react';
import { BIO_PATHWAYS } from '../data/pathwayData';
import { BioPathway, PathwayStep, EducationLevel } from '../types';
import { TextbooksSection } from './TextbooksSection';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Activity, 
  CheckCircle2, 
  BookOpen, 
  Stethoscope, 
  Layers,
  ChevronRight,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PathwaysViewProps {
  educationLevel?: EducationLevel;
  onAskTutor: (question: string) => void;
}

export const PathwaysView: React.FC<PathwaysViewProps> = ({ educationLevel = 'undergrad', onAskTutor }) => {
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(BIO_PATHWAYS[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showTextbooks, setShowTextbooks] = useState<boolean>(false);

  const activePathway = BIO_PATHWAYS.find((p) => p.id === selectedPathwayId) || BIO_PATHWAYS[0];
  const activeStep: PathwayStep = activePathway.steps[activeStepIndex] || activePathway.steps[0];

  const handleSelectPathway = (id: string) => {
    setSelectedPathwayId(id);
    setActiveStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Pathway Header & Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                Interactive Biochemical & Physiological Pathways
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">{activePathway.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{activePathway.overview}</p>
          </div>

          <button
            onClick={() => onAskTutor(`Explain the entire pathway and rate-limiting step of ${activePathway.title} in full detail.`)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tutor Deep-Dive</span>
          </button>
        </div>

        {/* Pathway Picker Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {BIO_PATHWAYS.map((p) => {
            const isSelected = p.id === selectedPathwayId;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPathway(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-950/70 text-amber-200 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{p.title.split('(')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {p.steps.length} steps
                </span>
              </button>
            );
          })}
        </div>

        {/* High-Yield Meta Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
            <span className="font-bold text-amber-400 shrink-0">Location:</span>
            <span className="text-slate-300 truncate">{activePathway.cellularLocation}</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2 md:col-span-2">
            <span className="font-bold text-rose-400 shrink-0">Rate-Limiting Step:</span>
            <span className="text-slate-300 line-clamp-1">{activePathway.rateLimitingStep}</span>
          </div>
        </div>
      </div>

      {/* Main Split View: Step Sequencer & Active Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Horizontal / Vertical Step Flow (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Step-by-Step Reaction Sequence</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              Step {activeStepIndex + 1} of {activePathway.steps.length}
            </span>
          </div>

          {/* Step Timeline List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {activePathway.steps.map((step, idx) => {
              const isSelected = idx === activeStepIndex;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500/80 ring-1 ring-amber-500/40 shadow-lg text-amber-100'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.stepNumber}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                        {step.title}
                      </h4>
                      {step.energyChange && step.energyChange !== '0' && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          step.energyChange.startsWith('+')
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {step.energyChange}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {step.description}
                    </p>

                    {step.enzyme && (
                      <span className="inline-block text-[10px] font-mono text-amber-400/90 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        ⚡ {step.enzyme}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-950 disabled:opacity-30 border border-slate-800 text-xs font-bold text-slate-300 transition"
            >
              Previous Step
            </button>

            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(activePathway.steps.length - 1, prev + 1))}
              disabled={activeStepIndex === activePathway.steps.length - 1}
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-xs font-bold text-slate-950 shadow transition flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Active Reaction Node Detail (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Reaction Stage Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Reaction Stage {activeStep.stepNumber}</span>
              </span>
              <button
                onClick={() => onAskTutor(`Explain enzyme mechanism: ${activeStep.enzyme || activeStep.title} in ${activePathway.title}`)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Enzyme Mechanism</span>
              </button>
            </div>

            <h3 className="text-lg font-black text-white">{activeStep.title}</h3>

            {/* Reactants -> Products Reaction Visualizer */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reactants (Inputs):</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeStep.reactants.map((r, i) => (
                    <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-300">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center py-1">
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-950/60 border border-amber-500/40 rounded-full text-xs font-mono font-bold text-amber-300">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{activeStep.enzyme || 'Spontaneous Reaction'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Products (Yield):</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeStep.products.map((p, i) => (
                    <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {activeStep.description}
            </p>

            {/* Clinical & Pharmacological Note if present */}
            {activeStep.clinicalNote && (
              <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Clinical / Pharmacology Correlation:</span>
                </span>
                <p className="text-xs text-rose-100/90 leading-relaxed">
                  {activeStep.clinicalNote}
                </p>
              </div>
            )}
          </div>

          {/* Net Equation Summary */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Net Stoichiometric Equation:
            </span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-200/90 leading-relaxed">
              {activePathway.netEquation}
            </div>
          </div>

        </div>

      </div>

      {/* Recommended Biochemistry & Physiology Textbooks Reference */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Recommended Biochemistry & Physiology Textbooks
              </h3>
              <p className="text-xs text-slate-400">
                Deepen pathways mastery with Lehninger, Harper's, Guyton & Hall, and Lippincotts
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTextbooks(!showTextbooks)}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <span>{showTextbooks ? 'Hide Textbooks' : 'Explore Textbooks'}</span>
            {showTextbooks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showTextbooks && (
          <div className="animate-fadeIn">
            <TextbooksSection
              educationLevel={educationLevel}
              onAskAboutChapter={(book, chap) => onAskTutor(`Explain ${chap} from ${book}`)}
              onGenerateQuizOnBook={(book) => onAskTutor(`Generate pathway review questions from ${book}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
