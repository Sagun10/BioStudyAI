import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EducationLevel, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  Dna, 
  Activity, 
  BookOpen, 
  Layers, 
  Zap, 
  HelpCircle, 
  Sparkles, 
  GraduationCap, 
  School, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  Award, 
  Check, 
  Lock, 
  Mail, 
  User, 
  Target, 
  Compass, 
  Sun, 
  Moon,
  ChevronRight,
  BookMarked
} from 'lucide-react';

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  educationLevel: EducationLevel;
  targetExam: string;
  streakDays: number;
  studyHoursTotal: number;
  avatarSeed: string;
  createdAt: number;
}

const DEFAULT_DEMO_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr_demo_1',
    name: 'Alex Rivera',
    email: 'demo@biostudy.ai',
    password: 'password123',
    educationLevel: 'undergrad',
    targetExam: 'MCAT / Pre-Med',
    streakDays: 5,
    studyHoursTotal: 14,
    avatarSeed: 'Alex',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'usr_demo_2',
    name: 'Dr. Sarah Chen',
    email: 'sarah@biostudy.ai',
    password: 'password123',
    educationLevel: 'grad',
    targetExam: 'USMLE Step 1 & 2',
    streakDays: 12,
    studyHoursTotal: 38,
    avatarSeed: 'Sarah',
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'usr_demo_3',
    name: 'Jordan Taylor',
    email: 'jordan@biostudy.ai',
    password: 'password123',
    educationLevel: 'school',
    targetExam: 'AP Biology / High School',
    streakDays: 3,
    studyHoursTotal: 8,
    avatarSeed: 'Jordan',
    createdAt: Date.now() - 86400000 * 3,
  }
];

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem('bio_study_registered_accounts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored accounts', e);
  }
  // Initialize with demo accounts
  localStorage.setItem('bio_study_registered_accounts', JSON.stringify(DEFAULT_DEMO_ACCOUNTS));
  return DEFAULT_DEMO_ACCOUNTS;
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem('bio_study_registered_accounts', JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts', e);
  }
}

interface LandingPageProps {
  onEnterApp: (user: UserProfile) => void;
  currentUser: UserProfile | null;
  onSelectLevel: (level: EducationLevel) => void;
  educationLevel: EducationLevel;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  currentUser,
  onSelectLevel,
  educationLevel,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(educationLevel);
  const [targetGoal, setTargetGoal] = useState<string>('MCAT / Pre-Med');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthModalOpen(true);
  };

  const handleFillDemo = (demoAccount: StoredAccount) => {
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
    setAuthError(null);
    setAuthSuccess(`Loaded credentials for ${demoAccount.name} (${demoAccount.educationLevel.toUpperCase()})`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (cleanPassword.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    const accounts = getStoredAccounts();

    if (authMode === 'register') {
      const cleanName = name.trim();
      if (!cleanName) {
        setAuthError('Please enter your full name or preferred display name.');
        return;
      }

      // Check if email already registered
      const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
      if (existing) {
        setAuthError('An account with this email already exists. Please switch to "Log In" or use a different email.');
        return;
      }

      const newAccount: StoredAccount = {
        id: 'usr_' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        educationLevel: selectedLevel,
        targetExam: targetGoal,
        streakDays: 1,
        studyHoursTotal: 0,
        avatarSeed: cleanName,
        createdAt: Date.now(),
      };

      const updatedAccounts = [...accounts, newAccount];
      saveStoredAccounts(updatedAccounts);

      const userProfile: UserProfile = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        educationLevel: newAccount.educationLevel,
        targetExam: newAccount.targetExam,
        streakDays: newAccount.streakDays,
        studyHoursTotal: newAccount.studyHoursTotal,
        avatarSeed: newAccount.avatarSeed,
        isGuest: false,
        createdAt: newAccount.createdAt,
      };

      localStorage.setItem('bio_study_user_session', JSON.stringify(userProfile));
      onSelectLevel(userProfile.educationLevel);
      setIsAuthModalOpen(false);
      onEnterApp(userProfile);
    } else {
      // Login mode
      const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
      if (!account) {
        setAuthError('No account found with this email. Please click "Register / Sign Up" to create an account, or try the 1-click Demo Account below.');
        return;
      }

      if (account.password !== cleanPassword) {
        setAuthError('Incorrect password. Please verify and try again.');
        return;
      }

      const userProfile: UserProfile = {
        id: account.id,
        name: account.name,
        email: account.email,
        educationLevel: account.educationLevel,
        targetExam: account.targetExam,
        streakDays: Math.max(account.streakDays, 1),
        studyHoursTotal: account.studyHoursTotal,
        avatarSeed: account.avatarSeed,
        isGuest: false,
        createdAt: account.createdAt,
      };

      localStorage.setItem('bio_study_user_session', JSON.stringify(userProfile));
      onSelectLevel(userProfile.educationLevel);
      setIsAuthModalOpen(false);
      onEnterApp(userProfile);
    }
  };

  const handleGuestEnter = () => {
    const guestProfile: UserProfile = {
      id: 'guest_' + Date.now(),
      name: 'Guest Scholar',
      email: 'guest@biostudy.ai',
      educationLevel: selectedLevel,
      targetExam: 'General Study Preview',
      streakDays: 1,
      studyHoursTotal: 0,
      avatarSeed: 'Guest',
      isGuest: true,
      createdAt: Date.now(),
    };
    localStorage.setItem('bio_study_user_session', JSON.stringify(guestProfile));
    onSelectLevel(selectedLevel);
    setIsAuthModalOpen(false);
    onEnterApp(guestProfile);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200`}>
      
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg text-white">
              <Dna className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight">BioStudy AI</span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Free
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">Visual Biology & Medical Study Platform</span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`p-2 rounded-xl border transition ${
                theme === 'light' ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {currentUser ? (
              <button
                onClick={() => onEnterApp(currentUser)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
              >
                <span>Continue as {currentUser.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleOpenAuth('login')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    theme === 'light' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Log In
                </button>

                <button
                  onClick={() => handleOpenAuth('register')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Visual Anatomy • AI Tutor • Board Exam Prep</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Master Biology & Medicine with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              Interactive Cross-Sections
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
            From high school AP Biology to MCAT and USMLE Step 1. Explore authentic medical cross-sections, interactive metabolic pathways, active recall flashcards, and an AI tutor grounded in gold-standard textbooks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {currentUser ? (
              <button
                onClick={() => onEnterApp(currentUser)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black shadow-xl hover:shadow-emerald-500/25 transition flex items-center justify-center gap-2 group"
              >
                <span>Enter Study Workspace as {currentUser.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleOpenAuth('register')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black shadow-xl hover:shadow-emerald-500/25 transition flex items-center justify-center gap-2 group"
                >
                  <User className="w-4 h-4" />
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => handleOpenAuth('login')}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border text-sm font-bold transition flex items-center justify-center gap-2 ${
                    theme === 'light' ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800' : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={handleGuestEnter}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Preview as Guest</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left">
            <div className={`p-3.5 rounded-2xl border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="text-xl font-black text-emerald-400">8+</div>
              <div className="text-xs text-slate-400 font-medium">Cross-Sectional Models</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="text-xl font-black text-indigo-400">1,000+</div>
              <div className="text-xs text-slate-400 font-medium">High-Yield Flashcards</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="text-xl font-black text-teal-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Free & Open Access</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="text-xl font-black text-amber-400">3 Tiers</div>
              <div className="text-xs text-slate-400 font-medium">School, College & Med</div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid: What is this app? */}
      <section className={`py-16 border-t ${theme === 'light' ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Everything You Need for Biological & Medical Mastery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A comprehensive visual study suite integrating 7 dedicated interactive study tools into one streamlined platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Cross-Sectional Atlas */}
            <div className={`p-6 rounded-3xl border transition hover:border-emerald-500/50 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'}`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black mb-2">Cross-Sectional Anatomical Atlas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detailed coronal, sagittal, and microscopic cutaways of the heart, brain, nephron, eye, cell, lungs, sarcomere, and DNA with interactive pins and pin-drop quizzes.
              </p>
            </div>

            {/* Feature 2: AI Biology & Anatomy Tutor */}
            <div className={`p-6 rounded-3xl border transition hover:border-indigo-500/50 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'}`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black mb-2">Adaptive AI Biology Tutor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask any question and receive tailored explanations across 5 learning styles: Deep Mechanism, Step-by-Step, Memory Mnemonics, High-Yield Summary, or Direct Comparisons.
              </p>
            </div>

            {/* Feature 3: Spaced Repetition Flashcards */}
            <div className={`p-6 rounded-3xl border transition hover:border-purple-500/50 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'}`}>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black mb-2">Active Recall Flashcard Decks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anki-style high-yield decks covering anatomy landmarks, cellular physiology, enzyme kinetics, and pathology pearls with instant flip and self-evaluation.
              </p>
            </div>

            {/* Feature 4: Metabolic Pathways Engine */}
            <div className={`p-6 rounded-3xl border transition hover:border-amber-500/50 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'}`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black mb-2">Metabolic Pathways Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step interactive breakdown of Glycolysis, Krebs Cycle, Gluconeogenesis, Electron Transport Chain, Beta-Oxidation, and Urea Cycle with ATP yields.
              </p>
            </div>

            {/* Feature 5: Question Bank & Practice Quizzes */}
            <div className={`p-6 rounded-3xl border transition hover:border-teal-500/50 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'}`}>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black mb-2">USMLE, MCAT & AP Bio Question Bank</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exam-grade multiple choice questions with thorough rationale breakdowns, concept summaries, and instant one-click follow-up queries with the AI tutor.
              </p>
            </div>

            {/* Feature 6: Medical Glossary & Textbooks */}
            <div className={`p-6 rounded-3xl border transition hover:border-blue-500/50 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'}`}>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <BookMarked className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black mb-2">Interactive Glossary & Reference</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatic term recognition that highlights complex terms in tutor answers for instant definitions, plus high-yield chapter guides from Campbell and Guyton.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Education Tiers Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tailored Specifically for Your Exact Academic Stage
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select your tier anytime to recalibrate question difficulty, terminology depth, and clinical context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* School Tier */}
          <div className={`p-6 rounded-3xl border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black">High School & AP Biology</h3>
                <span className="text-[11px] text-amber-400 font-semibold">Foundational Clarity</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clear analogies, foundational definitions, simplified diagrams, and AP Biology prep without confusing medical jargon.
            </p>
            <div className="text-[11px] font-semibold text-slate-300 space-y-1 pt-2 border-t border-slate-800/60">
              <div>• AP Biology, GCSE, IB Biology</div>
              <div>• Organelles, Mendelian Genetics, Ecology</div>
            </div>
          </div>

          {/* College Tier */}
          <div className={`p-6 rounded-3xl border ${theme === 'light' ? 'bg-white border-emerald-500/40 ring-2 ring-emerald-500/20' : 'bg-slate-900 border-emerald-500/40 ring-2 ring-emerald-500/20'} space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black">College & Pre-Med</h3>
                <span className="text-[11px] text-emerald-400 font-semibold">Mechanistic Rigor</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Biochemical pathways, enzyme kinetics, physiological feedback loops, and high-yield MCAT / NEET preparation.
            </p>
            <div className="text-[11px] font-semibold text-slate-300 space-y-1 pt-2 border-t border-slate-800/60">
              <div>• MCAT, NEET, B.Sc. Physiology</div>
              <div>• Action Potentials, Thermodynamics, Cellular Signaling</div>
            </div>
          </div>

          {/* Graduate Tier */}
          <div className={`p-6 rounded-3xl border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black">Graduate & Medical School</h3>
                <span className="text-[11px] text-indigo-400 font-semibold">Clinical Diagnostics</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clinical vignettes, pathophysiology, pharmacological mechanisms of action, and USMLE Step 1 / Step 2 board pearls.
            </p>
            <div className="text-[11px] font-semibold text-slate-300 space-y-1 pt-2 border-t border-slate-800/60">
              <div>• USMLE Step 1 & 2, COMLEX, MBBS, NCLEX</div>
              <div>• Pathologic Histology, Drug Targets, Case Scenarios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className={`border-t py-8 px-4 text-center ${theme === 'light' ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>BioStudy AI is 100% Free Forever • Built for Students Worldwide</span>
          </div>
          <button
            onClick={() => handleOpenAuth('register')}
            className="text-emerald-400 font-bold hover:underline"
          >
            Create Your Free Account →
          </button>
        </div>
      </footer>

      {/* Auth Modal (Login / Register) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-6 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}
            >
              
              {/* Modal Header & Mode Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black">
                      {authMode === 'register' ? 'Create Free Account' : 'Welcome Back'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {authMode === 'register' ? 'Join BioStudy AI to track progress and study goals' : 'Log in to continue your biology study session'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Auth Mode Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition ${
                    authMode === 'register' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register / Sign Up
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition ${
                    authMode === 'login' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {authError}
                </div>
              )}

              {/* Success / Info Message */}
              {authSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {authSuccess}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Maya Chen"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Education Level</label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {(['school', 'undergrad', 'grad'] as EducationLevel[]).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSelectedLevel(lvl)}
                            className={`py-2 px-2 rounded-xl border text-center font-bold transition ${
                              selectedLevel === lvl
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {lvl === 'school' ? 'High School' : lvl === 'undergrad' ? 'College' : 'Grad / Med'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Primary Exam / Goal</label>
                      <select
                        value={targetGoal}
                        onChange={(e) => setTargetGoal(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="MCAT / Pre-Med">MCAT / Pre-Med</option>
                        <option value="USMLE Step 1 & 2">USMLE Step 1 & 2</option>
                        <option value="AP Biology / High School">AP Biology / High School</option>
                        <option value="NEET / International Medical">NEET / International Medical</option>
                        <option value="General College Biology">General College Biology</option>
                      </select>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>{authMode === 'register' ? 'Create Account & Start Studying' : 'Log In to Study Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Quick 1-Click Demo Accounts for testing */}
                {authMode === 'login' && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 text-center">
                      Quick 1-Click Demo Accounts:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      {DEFAULT_DEMO_ACCOUNTS.map((demo) => (
                        <button
                          key={demo.id}
                          type="button"
                          onClick={() => handleFillDemo(demo)}
                          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-center transition"
                        >
                          <div className="font-bold truncate">{demo.name}</div>
                          <div className="text-emerald-400 font-semibold">{demo.educationLevel.toUpperCase()}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-800/80">
                  {authMode === 'register' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className="text-xs text-slate-400 hover:text-emerald-400 font-semibold"
                    >
                      Already have an account? Log In →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className="text-xs text-slate-400 hover:text-emerald-400 font-semibold"
                    >
                      New student? Register free in 5 seconds →
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleGuestEnter}
                    className="text-xs text-amber-400/90 hover:text-amber-300 font-bold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try limited guest preview instead →</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
