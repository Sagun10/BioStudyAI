import React, { useState, useRef, useEffect } from 'react';
import { EducationLevel, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  BookOpen, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Dna,
  School,
  Stethoscope,
  Layers,
  Zap,
  HelpCircle,
  Sun,
  Moon,
  Home,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Compass,
  BookmarkCheck
} from 'lucide-react';

export type ActiveAppTab = 'atlas' | 'tutor' | 'flashcards' | 'pathways' | 'quiz' | 'textbooks' | 'glossary';

interface NavbarProps {
  currentTab: ActiveAppTab;
  onSelectTab: (tab: ActiveAppTab) => void;
  educationLevel: EducationLevel;
  onSelectLevel: (level: EducationLevel) => void;
  onOpenOwnerConsole: () => void;
  currentUser?: UserProfile | null;
  onGoToLanding?: () => void;
  onLogout?: () => void;
}

const NAV_ITEMS: Array<{ id: ActiveAppTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
  { id: 'atlas', label: '3D Atlas', icon: Activity },
  { id: 'tutor', label: 'AI Tutor', icon: BookOpen, badge: 'Voice/Vision' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'pathways', label: 'Pathways', icon: Zap },
  { id: 'quiz', label: 'Quiz Bank', icon: HelpCircle },
  { id: 'textbooks', label: 'Textbooks', icon: BookmarkCheck },
  { id: 'glossary', label: 'Glossary', icon: Sparkles },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  educationLevel,
  onSelectLevel,
  onOpenOwnerConsole,
  currentUser,
  onGoToLanding,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showLevelMenu, setShowLevelMenu] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const levelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (levelRef.current && !levelRef.current.contains(e.target as Node)) {
        setShowLevelMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTierDetails = (level: EducationLevel) => {
    switch (level) {
      case 'school':
        return { label: 'High School', short: 'School', icon: School, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'undergrad':
        return { label: 'College / Pre-Med', short: 'College', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'grad':
        return { label: 'Medical / Grad', short: 'Med/Grad', icon: Stethoscope, color: 'text-indigo-400', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
    }
  };

  const activeTier = getTierDetails(educationLevel);
  const ActiveTierIcon = activeTier.icon;

  return (
    <header className="bg-slate-900/95 border-b border-slate-800/80 sticky top-0 z-40 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-3">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onGoToLanding}
              className="flex items-center gap-2.5 text-left group transition"
              title="Go to Landing Page"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-md text-white group-hover:scale-105 transition">
                <Dna className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-100 tracking-tight">BioStudy AI</span>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Pro
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-slate-800/80">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition relative ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Academic Tier Switcher & Quick Tools */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Academic Level Dropdown Pill */}
            <div className="relative" ref={levelRef}>
              <button
                onClick={() => setShowLevelMenu(!showLevelMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${activeTier.bg} ${activeTier.border} text-slate-200 hover:border-slate-600`}
                title="Select Academic Tier (School / College / Med)"
              >
                <ActiveTierIcon className={`w-3.5 h-3.5 ${activeTier.color}`} />
                <span className="hidden sm:inline font-bold">{activeTier.label}</span>
                <span className="sm:hidden font-bold">{activeTier.short}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLevelMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-1.5 z-50 animate-fadeIn space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Academic Difficulty Level
                  </div>
                  {(['school', 'undergrad', 'grad'] as EducationLevel[]).map((lvl) => {
                    const info = getTierDetails(lvl);
                    const Icon = info.icon;
                    const isSelected = educationLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => {
                          onSelectLevel(lvl);
                          setShowLevelMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : info.color}`} />
                          <span>{info.label}</span>
                        </div>
                        {isSelected && <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User Profile / Status */}
            {currentUser && (
              <div className="relative" ref={profileRef}>
                {currentUser.isGuest ? (
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 text-xs font-bold text-amber-300 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Guest</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                )}

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-2.5 py-2 border-b border-slate-800">
                      <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {currentUser.isGuest ? 'Guest Preview Session' : currentUser.email}
                      </div>
                    </div>
                    {currentUser.isGuest && onGoToLanding && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onGoToLanding();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Unlock Pro Access</span>
                      </button>
                    )}
                    {onGoToLanding && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onGoToLanding();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Home className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Landing Overview</span>
                      </button>
                    )}
                    {onLogout && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{currentUser.isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Discreet Analytics Access */}
            <button
              onClick={onOpenOwnerConsole}
              title="Analytics Console"
              className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-xl transition hidden sm:block"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden py-3 border-t border-slate-800 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow'
                        : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};


