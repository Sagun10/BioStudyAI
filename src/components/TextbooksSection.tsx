import React, { useState } from 'react';
import { EducationLevel } from '../types';
import { RECOMMENDED_TEXTBOOKS, TextbookInfo } from '../data/textbooksData';
import { EDUCATION_TIERS } from '../data/educationLevelConfig';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  BookmarkCheck, 
  Lightbulb, 
  School, 
  GraduationCap, 
  Stethoscope, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

interface TextbooksSectionProps {
  educationLevel: EducationLevel;
  onSelectLevel?: (level: EducationLevel) => void;
  onAskAboutChapter?: (bookTitle: string, chapterTitle: string) => void;
  onGenerateQuizOnBook?: (bookTitle: string) => void;
  compactMode?: boolean;
}

export const TextbooksSection: React.FC<TextbooksSectionProps> = ({
  educationLevel,
  onSelectLevel,
  onAskAboutChapter,
  onGenerateQuizOnBook,
  compactMode = false,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<EducationLevel | 'all'>(educationLevel);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);

  // Filter textbooks
  const filteredTextbooks = RECOMMENDED_TEXTBOOKS.filter((book) => {
    // Level filter
    if (selectedLevelFilter !== 'all' && book.level !== selectedLevelFilter) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && book.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthors = book.authors.toLowerCase().includes(q);
      const matchExams = book.targetExams.some((e) => e.toLowerCase().includes(q));
      const matchCategory = book.category.toLowerCase().includes(q);
      const matchChapters = book.highYieldChapters.some((c) => c.title.toLowerCase().includes(q));
      if (!matchTitle && !matchAuthors && !matchExams && !matchCategory && !matchChapters) {
        return false;
      }
    }
    return true;
  });

  const categories = ['all', 'General Biology', 'Physiology', 'Biochemistry', 'Pathology', 'Cell & Molecular', 'Genetics', 'Board Review', 'Pharmacology', 'Immunology'];

  const getLevelBadge = (level: EducationLevel) => {
    const tier = EDUCATION_TIERS[level];
    return (
      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder} flex items-center gap-1`}>
        {level === 'school' && <School className="w-3 h-3" />}
        {level === 'undergrad' && <GraduationCap className="w-3 h-3" />}
        {level === 'grad' && <Stethoscope className="w-3 h-3" />}
        <span>{tier.shortName}</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              Curated Gold-Standard Academic Textbooks
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Syllabi Standards
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Essential Textbooks for School, College & Grad School
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Access the highest-yield, universally recommended textbooks across high school AP/IB biology, college pre-med/biochemistry, and medical school board exams (USMLE / NCLEX). Inspect key chapters, study tips, and ask our AI Tutor to break down any textbook chapter.
          </p>
        </div>

        {/* Tier Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-stretch sm:self-auto shrink-0">
          <button
            onClick={() => {
              setSelectedLevelFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedLevelFilter === 'all'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Levels
          </button>
          {(['school', 'undergrad', 'grad'] as EducationLevel[]).map((lvl) => {
            const isSelected = selectedLevelFilter === lvl;
            const tier = EDUCATION_TIERS[lvl];
            return (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevelFilter(lvl);
                  if (onSelectLevel) onSelectLevel(lvl);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? `${tier.badgeBg} ${tier.badgeText} border ${tier.badgeBorder} shadow-sm`
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'school' && <School className="w-3.5 h-3.5" />}
                {lvl === 'undergrad' && <GraduationCap className="w-3.5 h-3.5" />}
                {lvl === 'grad' && <Stethoscope className="w-3.5 h-3.5" />}
                <span>{tier.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Subject Category Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbooks, authors, exams..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Subjects' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Textbooks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTextbooks.map((book) => {
          const isExpanded = expandedBookId === book.id;
          return (
            <div
              key={book.id}
              className={`bg-slate-950/80 border rounded-2xl p-5 space-y-4 transition-all hover:border-slate-700 ${
                isExpanded ? 'border-amber-500/50 ring-1 ring-amber-500/20 bg-slate-950' : 'border-slate-800'
              }`}
            >
              {/* Top Row: Category & Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {getLevelBadge(book.level)}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${book.badgeColor}`}>
                    {book.coverBadge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {book.category}
                  </span>
                </div>

                {book.isOpenAccess && book.accessUrl && (
                  <a
                    href={book.accessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <span>Read Free</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Title & Author Citation */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-amber-300/90 font-medium">
                  {book.authors} • <span className="text-slate-400">{book.edition}</span>
                </p>
              </div>

              {/* Description & Why It's the Best */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  {book.description}
                </p>

                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Why It's the Gold Standard:</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {book.whyItsBest}
                  </p>
                </div>
              </div>

              {/* Target Exams Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Target Curriculum & Board Exams:
                </span>
                <div className="flex flex-wrap gap-1">
                  {book.targetExams.map((exam, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expandable High-Yield Chapters Drawer */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                    className="text-xs font-bold text-slate-300 hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isExpanded ? 'Hide Key Chapters' : `View High-Yield Chapters (${book.highYieldChapters.length})`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-2">
                    {onGenerateQuizOnBook && (
                      <button
                        onClick={() => onGenerateQuizOnBook(book.title)}
                        className="px-2.5 py-1 bg-purple-600/90 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                        title="Practice questions tailored to this textbook"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Practice Quiz</span>
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="space-y-3 pt-2 animate-fadeIn">
                    {/* Pro Study Tip */}
                    <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>High-Yield Reading Strategy:</span>
                      </span>
                      <p className="text-xs text-amber-100/90 leading-relaxed">
                        {book.proStudyTip}
                      </p>
                    </div>

                    {/* Key Chapters Breakdown */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Most Tested Chapters in this Textbook:
                      </span>

                      <div className="space-y-1.5">
                        {book.highYieldChapters.map((chap, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  Ch. {chap.number}
                                </span>
                                <span className="text-xs font-bold text-white">{chap.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-snug">{chap.description}</p>
                            </div>

                            {onAskAboutChapter && (
                              <button
                                onClick={() => onAskAboutChapter(book.title, `Chapter ${chap.number}: ${chap.title}`)}
                                className="px-2.5 py-1 bg-indigo-600/90 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1 self-start sm:self-center shrink-0"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Explain with AI</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Official Citation */}
                    <p className="text-[10px] font-mono text-slate-500 italic pt-1">
                      Ref: {book.citation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTextbooks.length === 0 && (
        <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-300 font-bold">No textbooks found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevelFilter('all');
            }}
            className="text-xs text-amber-400 font-semibold hover:underline"
          >
            Clear search filters
          </button>
        </div>
      )}
    </div>
  );
};
