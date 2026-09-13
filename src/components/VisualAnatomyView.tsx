import React, { useState, useEffect } from 'react';
import { ANATOMY_MODELS } from '../data/anatomyData';
import { AnatomyModel, AnatomyHotspot, EducationLevel } from '../types';
import { EDUCATION_TIERS } from '../data/educationLevelConfig';
import { EducationTierBanner } from './EducationTierBanner';
import { SvgAnatomyRenderer } from './SvgAnatomyRenderer';
import { RealisticOrganRenderer } from './RealisticOrganRenderer';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Heart, 
  Brain, 
  Dna, 
  Zap, 
  Eye, 
  Wind, 
  Target, 
  Play, 
  RotateCcw, 
  Volume2, 
  Stethoscope, 
  Lightbulb, 
  Award, 
  Camera, 
  Columns, 
  Activity, 
  School, 
  GraduationCap,
  Microscope,
  Lock,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VisualAnatomyViewProps {
  educationLevel: EducationLevel;
  onSelectLevel: (level: EducationLevel) => void;
  onAskAboutStructure: (structureName: string, modelName?: string) => void;
  onGenerateQuizOnModel: (topicName: string) => void;
  isGuest?: boolean;
  onRequestUpgrade?: (feature: string, reason: string) => void;
}

export const VisualAnatomyView: React.FC<VisualAnatomyViewProps> = ({
  educationLevel,
  onSelectLevel,
  onAskAboutStructure,
  onGenerateQuizOnModel,
  isGuest = false,
  onRequestUpgrade,
}) => {
  const [selectedModelKey, setSelectedModelKey] = useState<string>(ANATOMY_MODELS[0].key);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(ANATOMY_MODELS[0].hotspots[0].id);
  const [activeTab, setActiveTab] = useState<'explore' | 'pinQuiz'>('explore');
  const [renderMode, setRenderMode] = useState<'photo' | 'comparison' | 'vector'>('photo');
  const [showFlowAnimation, setShowFlowAnimation] = useState<boolean>(true);
  const [inspectorLevel, setInspectorLevel] = useState<EducationLevel>(educationLevel);

  // Sync inspectorLevel if global educationLevel changes
  useEffect(() => {
    setInspectorLevel(educationLevel);
  }, [educationLevel]);

  // Pin Quiz Mode state
  const [quizTargetIndex, setQuizTargetIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [answeredPinIds, setAnsweredPinIds] = useState<string[]>([]);

  const activeModel = ANATOMY_MODELS.find((m) => m.key === selectedModelKey) || ANATOMY_MODELS[0];
  const activeHotspot = activeModel.hotspots.find((h) => h.id === selectedHotspotId) || activeModel.hotspots[0];

  const currentTier = EDUCATION_TIERS[inspectorLevel];

  const getModelIcon = (key: string) => {
    if (key.includes('heart')) return <Heart className="w-4 h-4 text-rose-400" />;
    if (key.includes('brain')) return <Brain className="w-4 h-4 text-purple-400" />;
    if (key.includes('cell')) return <Layers className="w-4 h-4 text-emerald-400" />;
    if (key.includes('nephron')) return <Target className="w-4 h-4 text-amber-400" />;
    if (key.includes('eye')) return <Eye className="w-4 h-4 text-cyan-400" />;
    if (key.includes('dna')) return <Dna className="w-4 h-4 text-blue-400" />;
    if (key.includes('lungs')) return <Wind className="w-4 h-4 text-teal-400" />;
    return <Zap className="w-4 h-4 text-amber-400" />;
  };

  const handleSelectModel = (key: string) => {
    // In Guest mode, allow the first 2 flagship models (Heart and Brain) as free preview
    if (isGuest && (key !== 'heart_cross_section' && key !== 'brain_sagittal')) {
      const targetModel = ANATOMY_MODELS.find((m) => m.key === key);
      onRequestUpgrade?.(
        `${targetModel?.title || 'Advanced Organ'} Model`,
        `The ${targetModel?.title || 'requested organ'} 3D cross-section and landmark inspector is available in the Full Scholar & Pro version. Create a free account or sign in to explore all 8+ anatomical models.`
      );
      return;
    }

    setSelectedModelKey(key);
    const model = ANATOMY_MODELS.find((m) => m.key === key) || ANATOMY_MODELS[0];
    setSelectedHotspotId(model.hotspots[0].id);
    resetPinQuiz(model);
  };

  const resetPinQuiz = (model = activeModel) => {
    setQuizTargetIndex(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setAnsweredPinIds([]);
  };

  const handlePinClick = (hotspotId: string) => {
    if (activeTab === 'pinQuiz') {
      const currentTarget = activeModel.hotspots[quizTargetIndex];
      if (currentTarget && currentTarget.id === hotspotId) {
        setQuizFeedback('correct');
        setQuizScore((prev) => prev + 1);
        setAnsweredPinIds((prev) => [...prev, hotspotId]);

        if (quizTargetIndex + 1 >= activeModel.hotspots.length) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          setTimeout(() => {
            setQuizTargetIndex((prev) => prev + 1);
            setQuizFeedback(null);
          }, 900);
        }
      } else {
        setQuizFeedback('wrong');
        setTimeout(() => setQuizFeedback(null), 1200);
      }
    } else {
      setSelectedHotspotId(hotspotId);
    }
  };

  const currentQuizTarget = activeModel.hotspots[quizTargetIndex];
  const isQuizComplete = activeTab === 'pinQuiz' && quizTargetIndex >= activeModel.hotspots.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Tier Banner with Level Selector */}
      <EducationTierBanner
        educationLevel={educationLevel}
        onSelectLevel={onSelectLevel}
      />

      {/* Header Organ Selector Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-sm font-black text-white">
              Interactive 2D/3D Anatomical & Cellular Atlas
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-semibold hidden sm:inline flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>Actual Organ Pictures & Scientific 3D Visualizations</span>
          </span>
        </div>

        {/* 8 Organ Models Carousel / Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ANATOMY_MODELS.map((model) => {
            const isSelected = model.key === selectedModelKey;
            const isLockedForGuest = isGuest && (model.key !== 'heart_cross_section' && model.key !== 'brain_sagittal');
            return (
              <button
                key={model.key}
                onClick={() => handleSelectModel(model.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition shrink-0 border relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/50 shadow-lg scale-[1.02]'
                    : isLockedForGuest
                    ? 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-amber-300 hover:border-amber-500/40'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {getModelIcon(model.key)}
                <span>{model.title.split('&')[0]}</span>
                {isLockedForGuest && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-extrabold bg-amber-400/15 px-1.5 py-0.5 rounded-md border border-amber-400/30 ml-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>PRO</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Interactive Graphic Canvas (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          
          {/* Canvas Mode & View Style Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            {/* Mode: Explore vs Pin Quiz */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'explore'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explore Mode</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('pinQuiz');
                  resetPinQuiz();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'pinQuiz'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Pin Challenge</span>
              </button>
            </div>

            {/* View Render Style: Real Photo vs Side-by-Side vs Vector */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRenderMode('photo')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  renderMode === 'photo'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Actual Organ Picture & 3D Render with Landmark Pins"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Actual Photo</span>
              </button>

              <button
                onClick={() => setRenderMode('comparison')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  renderMode === 'comparison'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Side-by-side: Real Organ Picture + Vector Diagram"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Dual View</span>
              </button>

              <button
                onClick={() => setRenderMode('vector')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  renderMode === 'vector'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Vector Diagram & Flow Schematic"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Schematic</span>
              </button>
            </div>

            {/* MCQ Quiz Launcher */}
            <button
              onClick={() => onGenerateQuizOnModel(activeModel.title)}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice MCQ</span>
            </button>
          </div>

          {/* Pin Quiz Target Banner if in Pin Quiz Mode */}
          {activeTab === 'pinQuiz' && currentQuizTarget && !isQuizComplete && (
            <div className="p-3.5 bg-indigo-950/70 border border-indigo-500/40 rounded-2xl flex items-center justify-between gap-3 animate-pulse">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-300">
                    Locate on the actual organ picture:
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-200 bg-indigo-900/80 px-2 py-0.5 rounded-md">
                    {quizTargetIndex + 1} of {activeModel.hotspots.length}
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{currentQuizTarget.name}</h4>
              </div>

              {quizFeedback === 'correct' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Correct!</span>
                </div>
              )}
              {quizFeedback === 'wrong' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-bold animate-shake">
                  <HelpCircle className="w-4 h-4" />
                  <span>Try again!</span>
                </div>
              )}
            </div>
          )}

          {/* Interactive Visual Viewport */}
          <div className="flex flex-col items-center justify-center">
            {renderMode === 'photo' && (
              <RealisticOrganRenderer
                model={activeModel}
                selectedHotspotId={activeTab === 'pinQuiz' ? null : selectedHotspotId}
                onSelectHotspot={handlePinClick}
                quizMode={activeTab === 'pinQuiz'}
              />
            )}

            {renderMode === 'vector' && (
              <div className="w-full flex flex-col items-center">
                <SvgAnatomyRenderer
                  model={activeModel}
                  selectedHotspotId={activeTab === 'pinQuiz' ? null : selectedHotspotId}
                  onSelectHotspot={handlePinClick}
                  showFlowAnimation={showFlowAnimation}
                  quizMode={activeTab === 'pinQuiz'}
                />
                <button
                  onClick={() => setShowFlowAnimation(!showFlowAnimation)}
                  className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800"
                >
                  <Play className="w-3 h-3" />
                  <span>Toggle Flow Animation: {showFlowAnimation ? 'Active' : 'Paused'}</span>
                </button>
              </div>
            )}

            {renderMode === 'comparison' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>Actual Organ Picture</span>
                  </span>
                  <RealisticOrganRenderer
                    model={activeModel}
                    selectedHotspotId={activeTab === 'pinQuiz' ? null : selectedHotspotId}
                    onSelectHotspot={handlePinClick}
                    quizMode={activeTab === 'pinQuiz'}
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Schematic Cross-Section</span>
                  </span>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center justify-center max-h-[500px] overflow-hidden">
                    <SvgAnatomyRenderer
                      model={activeModel}
                      selectedHotspotId={activeTab === 'pinQuiz' ? null : selectedHotspotId}
                      onSelectHotspot={handlePinClick}
                      showFlowAnimation={showFlowAnimation}
                      quizMode={activeTab === 'pinQuiz'}
                    />
                  </div>
                </div>
              </div>
            )}

            <span className="text-[11px] text-slate-400 mt-2 text-center">
              💡 {activeTab === 'pinQuiz' 
                ? 'Click on the pin on the actual organ photo that corresponds to the structure above' 
                : 'Click any numbered pin on the actual organ picture to inspect high-yield anatomy, physiology & clinical pearls'}
            </span>
          </div>

          {/* Hotspots Quick Pill Selector Grid */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Anatomical Landmarks in this Organ:
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {activeModel.hotspots.length} structures identified
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {activeModel.hotspots.map((spot, idx) => {
                const isSelected = selectedHotspotId === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      if (activeTab === 'pinQuiz') {
                        handlePinClick(spot.id);
                      } else {
                        setSelectedHotspotId(spot.id);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isSelected && activeTab !== 'pinQuiz'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
                      style={{ backgroundColor: spot.color }}
                    >
                      {idx + 1}
                    </span>
                    <span>{spot.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Deep-Dive Inspector & Clinical Pearls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Structure Card with Level Depth Switcher */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            
            {/* Header + Inspector Depth Tabs */}
            <div className="flex flex-col gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeHotspot.color }}
                    ></span>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                      Landmark #{activeModel.hotspots.findIndex(h => h.id === activeHotspot.id) + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{activeHotspot.name}</h3>
                </div>

                {/* Ask AI Tutor about this structure */}
                <button
                  onClick={() => onAskAboutStructure(activeHotspot.name, activeModel.title)}
                  className="px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
                  title="Deep dive with AI tutor"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain with AI</span>
                </button>
              </div>

              {/* Level Depth Switcher for this specific structure */}
              <div className="flex items-center justify-between bg-slate-950 p-1 rounded-xl border border-slate-800 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-2">
                  Depth Level:
                </span>
                <div className="flex gap-1">
                  {(['school', 'undergrad', 'grad'] as EducationLevel[]).map((lvl) => {
                    const isSelected = inspectorLevel === lvl;
                    const tier = EDUCATION_TIERS[lvl];
                    return (
                      <button
                        key={lvl}
                        onClick={() => setInspectorLevel(lvl)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isSelected
                            ? `${tier.badgeBg} ${tier.badgeText} border ${tier.badgeBorder} shadow-sm`
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lvl === 'school' && <School className="w-3 h-3" />}
                        {lvl === 'undergrad' && <GraduationCap className="w-3 h-3" />}
                        {lvl === 'grad' && <Stethoscope className="w-3 h-3" />}
                        <span>{tier.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Level-Tailored Anatomy Description */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Anatomy & Location</span>
                <span className={`text-[10px] font-bold ${currentTier.badgeText}`}>
                  ({currentTier.shortName} Perspective)
                </span>
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {inspectorLevel === 'school' && (
                  activeHotspot.schoolExplanation || activeHotspot.description
                )}
                {inspectorLevel === 'undergrad' && (
                  activeHotspot.collegeExplanation || `${activeHotspot.description} Key orientation: integrates with surrounding vascular beds and cellular parenchyma.`
                )}
                {inspectorLevel === 'grad' && (
                  activeHotspot.gradExplanation || `${activeHotspot.description} Critical surgical landmark; evaluated via ultrasound, CT/MRI, and biopsy pathology.`
                )}
              </p>
            </div>

            {/* Level-Tailored Physiological Function */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {inspectorLevel === 'school' ? 'How it Works in Plain English:' : inspectorLevel === 'undergrad' ? 'Physiological Mechanism & Kinetics:' : 'Clinical Pathophysiology & Mechanism:'}
                </span>
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeHotspot.function}
              </p>
            </div>

            {/* Level-Tailored Exam / Clinical Pearl */}
            <div className={`p-3.5 rounded-2xl space-y-1 border ${
              inspectorLevel === 'school' 
                ? 'bg-amber-950/40 border-amber-500/40' 
                : inspectorLevel === 'undergrad' 
                ? 'bg-emerald-950/40 border-emerald-500/40' 
                : 'bg-indigo-950/40 border-indigo-500/40'
            }`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider block flex items-center gap-1.5 ${
                inspectorLevel === 'school' ? 'text-amber-300' : inspectorLevel === 'undergrad' ? 'text-emerald-300' : 'text-indigo-300'
              }`}>
                {inspectorLevel === 'school' && <Lightbulb className="w-3.5 h-3.5" />}
                {inspectorLevel === 'undergrad' && <Award className="w-3.5 h-3.5" />}
                {inspectorLevel === 'grad' && <Stethoscope className="w-3.5 h-3.5" />}
                <span>
                  {inspectorLevel === 'school' ? 'AP / High School Test Tip:' : inspectorLevel === 'undergrad' ? 'MCAT / College Board Pearl:' : 'USMLE / NCLEX Clinical Vignette Correlation:'}
                </span>
              </span>
              <p className={`text-xs leading-relaxed ${
                inspectorLevel === 'school' ? 'text-amber-100/90' : inspectorLevel === 'undergrad' ? 'text-emerald-100/90' : 'text-indigo-100/90'
              }`}>
                {activeHotspot.clinicalOrExamTip || 'Frequently tested concept regarding normal vs abnormal physiological function.'}
              </p>
            </div>
          </div>

          {/* High-Yield Board Exam Pearls for this Model */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Key Exam Takeaways ({activeModel.title.split('&')[0]})
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentTier.badgeBg} ${currentTier.badgeText} border ${currentTier.badgeBorder}`}>
                {currentTier.shortName} Focus
              </span>
            </div>

            <ul className="space-y-2">
              {activeModel.examHighYield.map((pearl, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2"
                >
                  <span className="text-emerald-400 font-bold font-mono shrink-0">#{idx + 1}</span>
                  <span>{pearl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Frequently Tested Biology Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Frequently Tested Questions ({currentTier.targetExams[0]})
              </h4>
            </div>

            <div className="space-y-1.5">
              {activeModel.relatedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskAboutStructure(q, activeModel.title)}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-xs text-slate-300 hover:text-indigo-200 transition flex items-center justify-between group"
                >
                  <span className="line-clamp-2 pr-2">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
