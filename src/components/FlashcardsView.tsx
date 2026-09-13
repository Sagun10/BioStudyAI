import React, { useState } from 'react';
import { FLASHCARD_DECKS } from '../data/flashcardData';
import { FlashcardDeck, Flashcard, EducationLevel } from '../types';
import { TextbooksSection } from './TextbooksSection';
import { 
  RotateCw, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Plus, 
  Lightbulb, 
  BookOpen,
  Award,
  Zap,
  Repeat,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardsViewProps {
  educationLevel: EducationLevel;
  onAskTutor: (question: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  educationLevel,
  onAskTutor,
}) => {
  const [decks, setDecks] = useState<FlashcardDeck[]>(FLASHCARD_DECKS);
  const [selectedDeckId, setSelectedDeckId] = useState<string>(FLASHCARD_DECKS[0].id);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardMasteryMap, setCardMasteryMap] = useState<Record<string, 'again' | 'hard' | 'good' | 'easy'>>({});

  // AI custom generator state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showTextbooks, setShowTextbooks] = useState<boolean>(false);

  const activeDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const currentCard: Flashcard | undefined = activeDeck.cards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex + 1 < activeDeck.cards.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Completed deck!
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    setCardMasteryMap((prev) => ({ ...prev, [currentCard.id]: rating }));

    if (rating === 'good' || rating === 'easy') {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.7 } });
    }

    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const handleGenerateCustomDeck = async () => {
    if (!customTopicInput.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: customTopicInput, level: educationLevel })
      });
      const data = await res.json();
      if (data && data.flashcards && data.flashcards.length > 0) {
        const newDeck: FlashcardDeck = {
          id: `custom_${Date.now()}`,
          title: `${customTopicInput} (AI Generated)`,
          category: 'All Subjects',
          level: educationLevel,
          description: `Custom generated active recall deck on ${customTopicInput}`,
          cards: data.flashcards
        };
        setDecks((prev) => [newDeck, ...prev]);
        setSelectedDeckId(newDeck.id);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setShowAiModal(false);
        setCustomTopicInput('');
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Failed to generate deck:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const completedCount = Object.keys(cardMasteryMap).filter((id) =>
    activeDeck.cards.some((c) => c.id === id && (cardMasteryMap[id] === 'good' || cardMasteryMap[id] === 'easy'))
  ).length;
  const progressPercent = Math.round((completedCount / activeDeck.cards.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Deck Carousel & AI Deck Generator Button */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                Active Recall & Spaced Repetition (Anki-Style)
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">{activeDeck.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{activeDeck.description}</p>
          </div>

          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Deck with AI</span>
          </button>
        </div>

        {/* Deck Picker Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {decks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
            return (
              <button
                key={deck.id}
                onClick={() => {
                  setSelectedDeckId(deck.id);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-950/80 text-indigo-200 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{deck.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {deck.cards.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Deck Mastery Progress</span>
            <span className="font-mono font-bold text-emerald-400">{progressPercent}% Mastered</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Viewport */}
      {currentCard ? (
        <div className="space-y-4">
          
          {/* Card Meta Header */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider font-mono">
                Card {currentCardIndex + 1} of {activeDeck.cards.length}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {currentCard.category}
              </span>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Click card or spacebar to flip
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[320px] sm:min-h-[360px] bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-2xl cursor-pointer transition-all flex flex-col justify-between select-none relative overflow-hidden group"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Front vs Back Content */}
            {!isFlipped ? (
              // FRONT OF CARD
              <div className="space-y-6 my-auto text-center animate-fadeIn">
                <span className="inline-block text-xs uppercase tracking-widest font-extrabold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                  QUESTION / PROMPT
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-100 leading-snug max-w-2xl mx-auto">
                  {currentCard.front}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-4">
                  <RotateCw className="w-4 h-4 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Tap to reveal answer & mnemonics</span>
                </div>
              </div>
            ) : (
              // BACK OF CARD
              <div className="space-y-5 my-auto animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                    ANSWER & MECHANISM
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskTutor(`Explain in detail: ${currentCard.front} -> ${currentCard.back}`);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-100 whitespace-pre-line leading-relaxed">
                  {currentCard.back}
                </p>

                {/* Mnemonic Badge if present */}
                {currentCard.mnemonic && (
                  <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Memory Mnemonic:</span>
                    </span>
                    <p className="text-xs text-amber-200/90 font-medium leading-relaxed">
                      {currentCard.mnemonic}
                    </p>
                  </div>
                )}

                {/* Key Fact / Clinical Pearl */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-0.5">High-Yield Clinical / Exam Fact:</span>
                  {currentCard.keyFact}
                </div>
              </div>
            )}

            {/* Bottom Footer hint */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
              <span>{isFlipped ? 'Answer Revealed' : 'Active Recall Mode'}</span>
              <span>Rate below to advance</span>
            </div>
          </div>

          {/* Anki-Style Spaced Repetition Rating Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <button
              onClick={() => handleRateCard('again')}
              className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400 text-rose-300 text-xs font-bold transition flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-sm font-black">Again</span>
              <span className="text-[10px] text-rose-400 font-mono">&lt; 1 min</span>
            </button>

            <button
              onClick={() => handleRateCard('hard')}
              className="p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold transition flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-sm font-black">Hard</span>
              <span className="text-[10px] text-amber-400 font-mono">10 mins</span>
            </button>

            <button
              onClick={() => handleRateCard('good')}
              className="p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 hover:border-blue-400 text-blue-300 text-xs font-bold transition flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-sm font-black">Good</span>
              <span className="text-[10px] text-blue-400 font-mono">1 day</span>
            </button>

            <button
              onClick={() => handleRateCard('easy')}
              className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-sm font-black">Easy</span>
              <span className="text-[10px] text-emerald-400 font-mono">4 days</span>
            </button>
          </div>

          {/* Previous / Next Manual Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentCardIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-xs font-bold text-slate-300 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentCardIndex === activeDeck.cards.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-xs font-bold text-slate-300 transition flex items-center gap-2"
            >
              <span>Next Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Award className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Deck Completed! 🎉</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You've reviewed all the cards in this deck. Reset to practice again or generate a new custom deck with AI.
          </p>
          <button
            onClick={() => {
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition"
          >
            Restart Deck
          </button>
        </div>
      )}

      {/* AI Deck Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Generate AI Flashcard Deck</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter any biology topic, anatomical region, enzyme pathway, or exam concept (e.g. <em>"Cranial Nerves & Foramina"</em>, <em>"Enzyme Kinetics & Michaelis-Menten"</em>, <em>"Immunology Hypersensitivity Reactions"</em>).
            </p>

            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="e.g. Hypersensitivity Reactions Type I-IV"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerateCustomDeck();
              }}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateCustomDeck}
                disabled={isGenerating || !customTopicInput.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-xs font-bold text-white shadow flex items-center gap-2"
              >
                {isGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGenerating ? 'Building Deck...' : 'Generate Deck'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Textbooks Reference Drawer */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Recommended Textbooks for {educationLevel.toUpperCase()} Biology Flashcards
              </h3>
              <p className="text-xs text-slate-400">
                Cross-reference active recall cards with gold-standard textbooks & high-yield chapters
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
              onAskAboutChapter={(book, chap) => onAskTutor(`Explain ${chap} in ${book}`)}
              onGenerateQuizOnBook={(book) => onAskTutor(`Generate review questions on ${book}`)}
            />
          </div>
        )}
      </div>

    </div>
  );
};
