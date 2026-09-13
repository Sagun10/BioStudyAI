import React, { useState, useMemo, useEffect } from 'react';
import { GlossaryTerm, EducationLevel } from '../types';
import { BIOLOGY_GLOSSARY, findGlossaryTerm } from '../data/glossaryData';
import { GlossaryTermModal } from './GlossaryTermModal';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Stethoscope, 
  Zap, 
  Layers, 
  Filter, 
  X, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Dna, 
  GraduationCap, 
  Shuffle, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GlossaryViewProps {
  educationLevel: EducationLevel;
  onSelectLevel?: (level: EducationLevel) => void;
  onAskTutor: (question: string) => void;
  onOpenQuizWithTopic?: (topic: string) => void;
  onOpenFlashcardsWithTopic?: (topic: string) => void;
  initialSelectedTermId?: string;
}

const CATEGORIES = [
  'All Categories',
  'Physiology',
  'Anatomy',
  'Biochemistry',
  'Cell & Molecular',
  'Genetics',
  'Immunology',
  'Neurobiology',
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  educationLevel,
  onSelectLevel,
  onAskTutor,
  onOpenQuizWithTopic,
  onOpenFlashcardsWithTopic,
  initialSelectedTermId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  
  // Bookmarks in localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('biostudy_glossary_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal active term
  const [modalTerm, setModalTerm] = useState<GlossaryTerm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Expanded cards state
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  // Term of the day
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);

  useEffect(() => {
    // Pick a deterministic or initial featured term
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setFeaturedIndex(dayOfYear % BIOLOGY_GLOSSARY.length);
  }, []);

  useEffect(() => {
    if (initialSelectedTermId) {
      const found = BIOLOGY_GLOSSARY.find((t) => t.id === initialSelectedTermId);
      if (found) {
        setModalTerm(found);
        setIsModalOpen(true);
      }
    }
  }, [initialSelectedTermId]);

  const toggleBookmark = (termId: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(termId)
        ? prev.filter((id) => id !== termId)
        : [...prev, termId];
      try {
        localStorage.setItem('biostudy_glossary_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleCopyTerm = (term: GlossaryTerm, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${term.term}: ${term.definition}\nMechanism: ${term.mechanism}\nClinical Pearl: ${term.clinicalPearl}`;
    navigator.clipboard.writeText(text);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRandomTerm = () => {
    const randIdx = Math.floor(Math.random() * BIOLOGY_GLOSSARY.length);
    setFeaturedIndex(randIdx);
    const chosen = BIOLOGY_GLOSSARY[randIdx];
    setModalTerm(chosen);
    setIsModalOpen(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  // Filter terms
  const filteredTerms = useMemo(() => {
    return BIOLOGY_GLOSSARY.filter((item) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTerm = item.term.toLowerCase().includes(q);
        const matchesDef = item.definition.toLowerCase().includes(q);
        const matchesMech = item.mechanism.toLowerCase().includes(q);
        const matchesPearl = item.clinicalPearl.toLowerCase().includes(q);
        const matchesAlias = item.aliases.some((a) => a.toLowerCase().includes(q));
        if (!matchesTerm && !matchesDef && !matchesMech && !matchesPearl && !matchesAlias) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevelFilter !== 'all' && item.level !== selectedLevelFilter) {
        return false;
      }

      // Bookmarked filter
      if (onlyBookmarked && !bookmarks.includes(item.id)) {
        return false;
      }

      // Letter filter
      if (activeLetter && !item.term.toUpperCase().startsWith(activeLetter)) {
        return false;
      }

      return true;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory, selectedLevelFilter, onlyBookmarked, activeLetter, bookmarks]);

  const featuredTerm = BIOLOGY_GLOSSARY[featuredIndex] || BIOLOGY_GLOSSARY[0];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Physiology': return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Anatomy': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Biochemistry': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Cell & Molecular': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Genetics': return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Immunology': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Neurobiology': return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Authoritative Reference
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {BIOLOGY_GLOSSARY.length} Gold-Standard Terms
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Interactive Biology & Medical Glossary
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive dictionary linking high-yield terms, mechanisms, phonetic pronunciations, and board pearls.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              onClick={handleRandomTerm}
              className="flex-1 md:flex-initial px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Pearl</span>
            </button>
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border shadow-sm ${
                onlyBookmarked 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {onlyBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>Saved ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Featured Term of the Day Card */}
        {featuredTerm && !onlyBookmarked && !searchQuery && (
          <div className="bg-gradient-to-r from-teal-950/40 via-slate-950 to-slate-950 border border-teal-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    High-Yield Term Spotlight
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(featuredTerm.category)}`}>
                    {featuredTerm.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{featuredTerm.term}</span>
                  {featuredTerm.pronunciation && (
                    <span className="text-xs font-mono text-slate-400 font-normal">
                      {featuredTerm.pronunciation}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl line-clamp-2">
                  {featuredTerm.definition}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => {
                    setModalTerm(featuredTerm);
                    setIsModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1"
                >
                  <span>Explore Mechanism</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="space-y-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medical term, definition, mechanism, or board high-yield pearl..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Alphabetical Quick Scrubber Bar */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-800/80">
            <button
              onClick={() => setActiveLetter(null)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition ${
                activeLetter === null ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              ALL
            </button>
            {ALPHABET.map((letter) => {
              const hasTerms = BIOLOGY_GLOSSARY.some((t) => t.term.toUpperCase().startsWith(letter));
              return (
                <button
                  key={letter}
                  onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
                  disabled={!hasTerms}
                  className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-mono font-bold transition ${
                    activeLetter === letter
                      ? 'bg-teal-600 text-white shadow-xs'
                      : hasTerms
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 cursor-not-allowed'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-200">{filteredTerms.length}</strong> terms
          {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          {activeLetter && ` starting with "${activeLetter}"`}
          {onlyBookmarked && ` (Saved Only)`}
        </span>
        {(searchQuery || selectedCategory !== 'All Categories' || activeLetter || onlyBookmarked) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setActiveLetter(null);
              setOnlyBookmarked(false);
            }}
            className="text-teal-400 hover:text-teal-300 font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Glossary Term Cards Grid */}
      {filteredTerms.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Glossary Terms Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find any terms matching "{searchQuery}". Try broadening your search or selecting another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setActiveLetter(null);
              setOnlyBookmarked(false);
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
          >
            View All Terms
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((term) => {
            const isExpanded = !!expandedCards[term.id];
            const isBookmarked = bookmarks.includes(term.id);

            return (
              <div
                key={term.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Top Badges & Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(term.category)}`}>
                        {term.category}
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                        {term.level}
                      </span>
                      {term.etymology && (
                        <span className="text-[10px] text-slate-500 italic hidden sm:inline">
                          {term.etymology}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleSpeak(term.term, e)}
                        className="p-1 text-slate-500 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(term.id)}
                        className={`p-1 rounded-lg transition ${
                          isBookmarked ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title={isBookmarked ? 'Saved in bookmarks' : 'Bookmark term'}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => handleCopyTerm(term, e)}
                        className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition"
                        title="Copy definition"
                      >
                        {copiedId === term.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Term Title & Pronunciation */}
                  <div>
                    <h3 
                      onClick={() => {
                        setModalTerm(term);
                        setIsModalOpen(true);
                      }}
                      className="text-base font-black text-white hover:text-teal-300 transition cursor-pointer flex items-center gap-2"
                    >
                      <span>{term.term}</span>
                    </h3>
                    {term.pronunciation && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {term.pronunciation}
                      </span>
                    )}
                  </div>

                  {/* Core Definition */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {term.definition}
                  </p>

                  {/* Expanded Mechanism & Clinical Pearl Accordion */}
                  {isExpanded && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-800/80 animate-fadeIn text-xs">
                      {/* Mechanism */}
                      <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                          <Zap className="w-3 h-3" />
                          <span>Mechanism & Pathway:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          {term.mechanism}
                        </p>
                      </div>

                      {/* Clinical Pearl */}
                      <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          <Stethoscope className="w-3 h-3" />
                          <span>Clinical & Exam Pearl:</span>
                        </div>
                        <p className="text-amber-200/90 leading-relaxed text-[11px]">
                          {term.clinicalPearl}
                        </p>
                      </div>

                      {/* Related Terms */}
                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Related:</span>
                          <div className="flex flex-wrap gap-1">
                            {term.relatedTerms.map((rt, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const target = findGlossaryTerm(rt);
                                  if (target) {
                                    setModalTerm(target);
                                    setIsModalOpen(true);
                                  } else {
                                    setSearchQuery(rt);
                                  }
                                }}
                                className="text-[10px] bg-slate-950 text-teal-300 hover:text-white px-2 py-0.5 rounded-md border border-slate-800 hover:border-teal-500/40 transition"
                              >
                                {rt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom Controls */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => toggleExpand(term.id)}
                    className="text-slate-400 hover:text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Mechanism & Pearls'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAskTutor(`Explain the biology concept "${term.term}" in detail, focusing on mechanisms, exam questions, and everyday analogies.`)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-teal-300 hover:text-teal-200 border border-slate-800 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ask AI Tutor</span>
                    </button>
                    <button
                      onClick={() => {
                        setModalTerm(term);
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      title="Open full view modal"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal for Term */}
      <GlossaryTermModal
        term={modalTerm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectRelatedTerm={(newTerm) => setModalTerm(newTerm)}
        onAskTutor={onAskTutor}
        isBookmarked={modalTerm ? bookmarks.includes(modalTerm.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
};
