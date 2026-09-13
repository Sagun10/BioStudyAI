import React, { useState, useEffect } from 'react';
import { EducationLevel, QuizQuestion, Flashcard, GlossaryTerm } from '../types';
import { GlossaryAnnotatedText } from './GlossaryAnnotatedText';
import { GlossaryTermModal } from './GlossaryTermModal';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  RefreshCw, 
  Check, 
  Zap, 
  GraduationCap,
  Award,
  Clock,
  Target,
  Minus,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getVisitorId } from '../utils/telemetry';
import { TextbooksSection } from './TextbooksSection';

interface PracticeQuizViewProps {
  educationLevel: EducationLevel;
  initialTopic?: string;
  onAskTutor: (question: string) => void;
}

const PRESET_TOPICS: Record<EducationLevel, string[]> = {
  school: [
    'Cell Organelles & Functions',
    'Photosynthesis & Cellular Respiration',
    'Human Circulatory & Heart System',
    'Mitosis vs Meiosis Stages',
    'Mendelian Genetics & Punnett Squares',
    'Digestive System Organs',
  ],
  undergrad: [
    'Sliding Filament Muscle Contraction',
    'Nephron Countercurrent Multiplier',
    'DNA Replication & Okazaki Fragments',
    'Enzyme Kinetics & Allosteric Regulation',
    'Action Potential & Synaptic Transmission',
    'Glycolysis & Krebs Cycle Yields',
  ],
  grad: [
    'Glomerular Filtration Hemodynamics',
    'Hemoglobin O2 Dissociation & Bohr Effect',
    'GPCR Signal Transduction Pathways',
    'Cranial Nerves & Brainstem Lesions',
    'Hypersensitivity Types I-IV Pathophysiology',
    'Cardiac Pressure-Volume Loops',
  ],
};

const QUESTION_COUNT_PRESETS = [
  { count: 3, label: '3 Qs (Quick Check)', time: '~2 min' },
  { count: 5, label: '5 Qs (Standard)', time: '~4 min' },
  { count: 10, label: '10 Qs (Deep Review)', time: '~8 min' },
  { count: 15, label: '15 Qs (Exam Prep)', time: '~12 min' },
  { count: 20, label: '20 Qs (Mock Board)', time: '~18 min' },
];

export const PracticeQuizView: React.FC<PracticeQuizViewProps> = ({
  educationLevel,
  initialTopic,
  onAskTutor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'flashcards' | 'textbooks'>('quiz');
  const [topicInput, setTopicInput] = useState<string>(initialTopic || 'Human Heart & Blood Circulation');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showTextbooksDrawer, setShowTextbooksDrawer] = useState<boolean>(false);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState<boolean>(false);

  // Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (initialTopic) {
      setTopicInput(initialTopic);
      handleGenerateQuiz(initialTopic, numQuestions);
    } else {
      handleGenerateQuiz(PRESET_TOPICS[educationLevel][0], numQuestions);
    }
  }, [educationLevel, initialTopic]);

  const handleGenerateQuiz = async (topicToUse?: string, countToUse?: number) => {
    const targetTopic = topicToUse || topicInput;
    const targetCount = countToUse || numQuestions;
    if (!targetTopic.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setUserAnswers({});
    setShowResults(false);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          level: educationLevel,
          numQuestions: targetCount,
          visitorId: getVisitorId(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate practice quiz');
      const data = await res.json();
      setQuizQuestions(data.questions || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Could not generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFlashcards = async (topicToUse?: string) => {
    const targetTopic = topicToUse || topicInput;
    if (!targetTopic.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setIsFlipped(false);
    setCurrentCardIndex(0);

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          level: educationLevel,
          visitorId: getVisitorId(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate flashcards');
      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Could not generate flashcards.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  const handleQuestionCountChange = (delta: number) => {
    setNumQuestions((prev) => {
      const updated = Math.min(25, Math.max(1, prev + delta));
      return updated;
    });
  };

  const scrollToQuestion = (index: number) => {
    const el = document.getElementById(`quiz-question-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = quizQuestions.length;
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Active Recall & Knowledge Testing
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {educationLevel.toUpperCase()} LEVEL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">Biology Practice Engine</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize quiz lengths, practice active recall flashcards, and inspect recommended textbooks for each topic.
            </p>
          </div>

          {/* Sub-Tab Selector: Quiz vs Flashcards vs Textbooks */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs shrink-0 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveSubTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                activeSubTab === 'quiz' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Practice Quiz</span>
            </button>
            <button
              onClick={() => {
                setActiveSubTab('flashcards');
                if (flashcards.length === 0) {
                  handleGenerateFlashcards();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                activeSubTab === 'flashcards' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>
            <button
              onClick={() => setActiveSubTab('textbooks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                activeSubTab === 'textbooks' ? 'bg-amber-600 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Textbooks</span>
            </button>
          </div>
        </div>

        {activeSubTab !== 'textbooks' && (
          <>
            {/* Topic Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (activeSubTab === 'quiz') handleGenerateQuiz();
                else handleGenerateFlashcards();
              }}
              className="flex flex-col sm:flex-row gap-2 pt-1"
            >
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter any topic (e.g. Heart Anatomy, Mitosis, Photosynthesis, Action Potential...)"
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !topicInput.trim()}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate {activeSubTab === 'quiz' ? `${numQuestions}-Question Quiz` : 'Flashcards'}</span>
              </button>
            </form>

            {/* Liberty to Choose Question Count (Only in Quiz sub-tab) */}
            {activeSubTab === 'quiz' && (
              <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">
                      Choose Question Count Liberty:
                    </span>
                    <span className="text-[11px] font-mono font-extrabold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30">
                      {numQuestions} {numQuestions === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>

                  {/* Number Stepper Controls */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Custom count:</span>
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuestionCountChange(-1)}
                        disabled={numQuestions <= 1 || isLoading}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition"
                        title="Decrease question count"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={numQuestions}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            setNumQuestions(Math.min(25, Math.max(1, val)));
                          }
                        }}
                        className="w-10 text-center bg-transparent text-xs font-bold text-white focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuestionCountChange(1)}
                        disabled={numQuestions >= 25 || isLoading}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition"
                        title="Increase question count"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Count Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Presets:</span>
                  {QUESTION_COUNT_PRESETS.map((preset) => {
                    const isSelected = numQuestions === preset.count;
                    return (
                      <button
                        key={preset.count}
                        type="button"
                        onClick={() => {
                          setNumQuestions(preset.count);
                          handleGenerateQuiz(topicInput, preset.count);
                        }}
                        disabled={isLoading}
                        className={`text-xs px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <span>{preset.label}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                          {preset.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Preset Topics */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Topic Presets:</span>
              {PRESET_TOPICS[educationLevel].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopicInput(preset);
                    if (activeSubTab === 'quiz') handleGenerateQuiz(preset, numQuestions);
                    else handleGenerateFlashcards(preset);
                  }}
                  disabled={isLoading}
                  className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* SUB-TAB 3: DEDICATED TEXTBOOKS EXPLORER */}
      {activeSubTab === 'textbooks' && (
        <div className="space-y-4">
          <TextbooksSection
            educationLevel={educationLevel}
            onAskAboutChapter={(bookTitle, chapterTitle) => {
              onAskTutor(`From the textbook "${bookTitle}", please explain "${chapterTitle}" in depth with key mechanisms and study tips.`);
            }}
            onGenerateQuizOnBook={(bookTitle) => {
              setTopicInput(`${bookTitle} Core High-Yield Topics`);
              setActiveSubTab('quiz');
              handleGenerateQuiz(`${bookTitle} Core High-Yield Topics`, numQuestions);
            }}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Synthesizing {numQuestions} Custom Practice Questions...
            </h3>
            <p className="text-xs text-slate-400">
              Calibrating question difficulty, board-style explanations, and key concepts for "{topicInput}".
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && !isLoading && (
        <div className="p-4 bg-rose-950/50 border border-rose-500/40 rounded-2xl text-xs text-rose-200 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => handleGenerateQuiz()}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUB-TAB 1: PRACTICE QUIZ QUESTIONS */}
      {!isLoading && activeSubTab === 'quiz' && quizQuestions.length > 0 && (
        <div className="space-y-5">
          {/* Progress Header & Question Navigator Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">
                  Quiz Progress: {answeredCount} of {totalCount} Answered ({progressPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-mono text-[11px]">
                  {showResults ? 'Quiz Complete' : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Interactive Question Jump Map */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Question Quick Jump:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quizQuestions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCorrect = userAnswers[q.id] === q.correctAnswerIndex;

                  let btnColor = 'bg-slate-950 border-slate-800 text-slate-400 hover:border-purple-500';
                  if (showResults) {
                    btnColor = isCorrect
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-rose-950 border-rose-500 text-rose-300 font-bold';
                  } else if (isAnswered) {
                    btnColor = 'bg-purple-950 border-purple-500 text-purple-200 font-bold';
                  }

                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => scrollToQuestion(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono border flex items-center justify-center transition shadow-sm ${btnColor}`}
                      title={`Jump to Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Summary Banner (Visible after submission) */}
          {showResults && (
            <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Score: {calculateScore()} / {quizQuestions.length} ({Math.round((calculateScore() / quizQuestions.length) * 100)}%)
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {calculateScore() === quizQuestions.length
                      ? '🌟 Perfect score! Outstanding conceptual mastery.'
                      : calculateScore() >= quizQuestions.length * 0.7
                      ? '👏 Great performance! Review explanations below for missed questions.'
                      : '💡 Solid practice session! Review the rationale sections and recommended textbook chapters below.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setUserAnswers({});
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={() => handleGenerateQuiz(topicInput, numQuestions)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Questions</span>
                </button>
              </div>
            </div>
          )}

          {/* Question Cards List */}
          {quizQuestions.map((q, qIndex) => {
            const selectedOpt = userAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctAnswerIndex;

            return (
              <div
                id={`quiz-question-${qIndex}`}
                key={q.id || qIndex}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm scroll-mt-20"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-xs border border-purple-500/30">
                      Q{qIndex + 1}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {q.difficulty || 'Medium'}
                    </span>
                    {isAnswered && !showResults && (
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                        Answer Selected
                      </span>
                    )}
                  </div>

                  {showResults && (
                    <span className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                      isCorrect ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{isCorrect ? 'Correct (+1)' : 'Incorrect'}</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-100 leading-relaxed">
                  {q.question}
                </p>

                {/* Multiple Choice Options */}
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    const isOptionCorrect = optIdx === q.correctAnswerIndex;

                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

                    if (showResults) {
                      if (isOptionCorrect) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 line-through';
                      } else {
                        btnStyle = 'bg-slate-950/50 border-slate-800/50 text-slate-500';
                      }
                    } else if (isOptionSelected) {
                      btnStyle = 'bg-purple-950 border-purple-500 text-purple-200 font-bold ring-1 ring-purple-500/50';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={showResults}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center gap-3 ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-900 text-slate-400 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 border border-slate-800">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box (Visible after submitting or showing results) */}
                {showResults && (
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Rationale & Mechanism:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      <GlossaryAnnotatedText
                        onSelectTerm={(t) => {
                          setSelectedGlossaryTerm(t);
                          setIsGlossaryModalOpen(true);
                        }}
                      >
                        {q.explanation}
                      </GlossaryAnnotatedText>
                    </p>
                    <div className="p-2 bg-purple-950/30 rounded-lg border border-purple-500/20 text-purple-300 text-[11px]">
                      <strong>Key Concept:</strong>{' '}
                      <GlossaryAnnotatedText
                        onSelectTerm={(t) => {
                          setSelectedGlossaryTerm(t);
                          setIsGlossaryModalOpen(true);
                        }}
                      >
                        {q.conceptSummary}
                      </GlossaryAnnotatedText>
                    </div>

                    <button
                      onClick={() => onAskTutor(`Explain in detail: ${q.question}`)}
                      className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 pt-1"
                    >
                      <span>Ask AI Tutor to break this down further</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Quiz / Reveal Answers Button */}
          {!showResults && (
            <div className="pt-2 text-center space-y-2">
              <button
                onClick={() => {
                  setShowResults(true);
                  const score = calculateScore();
                  if (score > 0) {
                    confetti({ particleCount: 60, spread: 75, origin: { y: 0.6 } });
                  }
                }}
                disabled={answeredCount === 0}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black rounded-2xl shadow-lg transition"
              >
                Submit Answers ({answeredCount}/{totalCount} Completed) & Reveal Rationales
              </button>
              {answeredCount < totalCount && (
                <p className="text-[11px] text-slate-400">
                  You have {totalCount - answeredCount} unanswered questions remaining.
                </p>
              )}
            </div>
          )}

          {/* Collapsible Textbooks Section in Quiz View */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowTextbooksDrawer(!showTextbooksDrawer)}
                className="text-xs font-bold text-slate-300 hover:text-amber-300 transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Recommended Textbooks & High-Yield References for {educationLevel.toUpperCase()}</span>
                {showTextbooksDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showTextbooksDrawer && (
              <div className="animate-fadeIn pt-2">
                <TextbooksSection
                  educationLevel={educationLevel}
                  compactMode={true}
                  onAskAboutChapter={(book, chap) => onAskTutor(`Explain ${chap} from ${book}`)}
                  onGenerateQuizOnBook={(book) => handleGenerateQuiz(book, numQuestions)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FLASHCARDS */}
      {!isLoading && activeSubTab === 'flashcards' && flashcards.length > 0 && (
        <div className="space-y-4 max-w-xl mx-auto">
          {/* Card Counter */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
            <span className="font-mono text-purple-400">{flashcards[currentCardIndex].category}</span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[260px] bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-purple-500/40 hover:border-purple-500 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 transform select-none"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                {isFlipped ? 'Answer & Rationale' : 'Active Recall Question'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Click to flip 🔄</span>
            </div>

            <div className="py-6 text-center space-y-3">
              {!isFlipped ? (
                <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                  {flashcards[currentCardIndex].front}
                </h3>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-sm font-semibold text-emerald-300 leading-relaxed">
                    {flashcards[currentCardIndex].back}
                  </p>
                  {flashcards[currentCardIndex].mnemonic && (
                    <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300 text-left">
                      <strong>💡 Mnemonic:</strong> {flashcards[currentCardIndex].mnemonic}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center">
              <span className="text-[11px] text-slate-500">
                {!isFlipped ? 'Think of the answer, then click to check' : 'Golden Rule: ' + flashcards[currentCardIndex].keyFact}
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition"
            >
              ← Previous Card
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow"
            >
              {isFlipped ? 'Show Question' : 'Flip Answer'}
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* Interactive Glossary Term Modal for Instant Lookups */}
      <GlossaryTermModal
        term={selectedGlossaryTerm}
        isOpen={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
        onSelectRelatedTerm={(rel) => setSelectedGlossaryTerm(rel)}
        onAskTutor={(q) => onAskTutor(q)}
      />
    </div>
  );
};
