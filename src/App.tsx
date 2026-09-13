import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EducationLevel, UserProfile } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar, ActiveAppTab } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { VisualAnatomyView } from './components/VisualAnatomyView';
import { AskStudyView } from './components/AskStudyView';
import { FlashcardsView } from './components/FlashcardsView';
import { PathwaysView } from './components/PathwaysView';
import { PracticeQuizView } from './components/PracticeQuizView';
import { TextbooksSection } from './components/TextbooksSection';
import { GlossaryView } from './components/GlossaryView';
import { OwnerAnalyticsModal } from './components/OwnerAnalyticsModal';
import { GuestUpgradeModal } from './components/GuestUpgradeModal';
import { GuestLimitedBanner } from './components/GuestLimitedBanner';
import { initTelemetryHeartbeat } from './utils/telemetry';
import { ShieldCheck } from 'lucide-react';

const GUEST_MAX_QUESTIONS = 3;

function AppContent() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bio_study_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showLanding, setShowLanding] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bio_study_user_session');
      return !saved;
    } catch {
      return true;
    }
  });

  const [currentTab, setCurrentTab] = useState<ActiveAppTab>('atlas');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(() => {
    return currentUser?.educationLevel || 'undergrad';
  });
  const [quizTopic, setQuizTopic] = useState<string>('Human Heart & Blood Circulation');
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState<boolean>(false);
  const { theme } = useTheme();

  // Guest limitations state
  const [guestQuestionsUsed, setGuestQuestionsUsed] = useState<number>(() => {
    try {
      const val = localStorage.getItem('bio_study_guest_queries_count');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalFeature, setUpgradeModalFeature] = useState<string>('Full Pro Biology Access');
  const [upgradeModalReason, setUpgradeModalReason] = useState<string>(
    'You are currently in Guest Preview Mode. Unlock unlimited AI tutor queries, all 8+ organ cross-sections, and board exam question banks.'
  );

  const guestQuestionsLeft = Math.max(0, GUEST_MAX_QUESTIONS - guestQuestionsUsed);

  useEffect(() => {
    initTelemetryHeartbeat();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Ctrl+Shift+A or Cmd+Shift+A opens owner analytics console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsOwnerModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEnterAppFromLanding = (user: UserProfile) => {
    setCurrentUser(user);
    setEducationLevel(user.educationLevel);
    setShowLanding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bio_study_user_session');
    setCurrentUser(null);
    setShowLanding(true);
  };

  const handleOpenQuizWithTopic = (topic: string) => {
    setQuizTopic(topic);
    setCurrentTab('quiz');
  };

  const handleAskAboutStructure = (structureName: string, modelName?: string) => {
    const prompt = structureName.endsWith('?')
      ? structureName
      : `Explain the anatomical location, physiological function, and clinical/exam significance of the ${structureName}${modelName ? ` in the ${modelName}` : ''}.`;
    setPendingQuestion(prompt);
    setCurrentTab('tutor');
  };

  const handleUseGuestQuestion = () => {
    setGuestQuestionsUsed((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('bio_study_guest_queries_count', next.toString());
      } catch {}
      return next;
    });
  };

  const handleRequestUpgrade = (featureName: string, reasonText: string) => {
    setUpgradeModalFeature(featureName);
    setUpgradeModalReason(reasonText);
    setIsUpgradeModalOpen(true);
  };

  // If user is not logged in OR is explicitly viewing the landing overview
  if (!currentUser || showLanding) {
    return (
      <LandingPage
        onEnterApp={handleEnterAppFromLanding}
        currentUser={currentUser}
        onSelectLevel={setEducationLevel}
        educationLevel={educationLevel}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200`}>
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        educationLevel={educationLevel}
        onSelectLevel={setEducationLevel}
        onOpenOwnerConsole={() => setIsOwnerModalOpen(true)}
        currentUser={currentUser}
        onGoToLanding={() => setShowLanding(true)}
        onLogout={handleLogout}
      />

      {/* Main Study Workspace with Smooth Framer Motion Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        {/* Guest Preview Mode Banner */}
        {currentUser.isGuest && (
          <GuestLimitedBanner
            guestQuestionsLeft={guestQuestionsLeft}
            maxQuestions={GUEST_MAX_QUESTIONS}
            onUpgradeClick={() => {
              handleRequestUpgrade(
                'Full Scholar & Pro Access',
                'Upgrade your free preview to unlock unlimited AI explanations, all 8+ organ 3D models, active recall flashcards, and exam test banks.'
              );
            }}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="w-full"
          >
            {/* Tab 1: Interactive 2D/3D Vector Anatomy Atlas */}
            {currentTab === 'atlas' && (
              <VisualAnatomyView
                educationLevel={educationLevel}
                onSelectLevel={setEducationLevel}
                onAskAboutStructure={handleAskAboutStructure}
                onGenerateQuizOnModel={handleOpenQuizWithTopic}
                isGuest={currentUser.isGuest}
                onRequestUpgrade={handleRequestUpgrade}
              />
            )}

            {/* Tab 2: AI Biology & Anatomy Tutor */}
            {currentTab === 'tutor' && (
              <AskStudyView
                educationLevel={educationLevel}
                onSelectLevel={setEducationLevel}
                onOpenQuizWithTopic={handleOpenQuizWithTopic}
                onOpenFlashcardsWithTopic={(t) => {
                  setCurrentTab('flashcards');
                }}
                onOpenAnatomyModel={() => setCurrentTab('atlas')}
                initialQuestion={pendingQuestion}
                onClearInitialQuestion={() => setPendingQuestion(null)}
                isGuest={currentUser.isGuest}
                guestQuestionsLeft={guestQuestionsLeft}
                onUseGuestQuestion={handleUseGuestQuestion}
                onRequestUpgrade={handleRequestUpgrade}
              />
            )}

            {/* Tab 3: Active Recall Spaced Repetition Flashcards (Anki) */}
            {currentTab === 'flashcards' && (
              <FlashcardsView
                educationLevel={educationLevel}
                onAskTutor={handleAskAboutStructure}
              />
            )}

            {/* Tab 4: Interactive Biochemical & Physiological Pathways */}
            {currentTab === 'pathways' && (
              <PathwaysView
                onAskTutor={handleAskAboutStructure}
              />
            )}

            {/* Tab 5: Practice Quiz & Board Exam Question Bank */}
            {currentTab === 'quiz' && (
              <PracticeQuizView
                educationLevel={educationLevel}
                initialTopic={quizTopic}
                onAskTutor={(q) => handleAskAboutStructure(q)}
              />
            )}

            {/* Tab 6: Curated Gold-Standard Academic Textbooks Reference */}
            {currentTab === 'textbooks' && (
              <div className="space-y-4">
                <TextbooksSection
                  educationLevel={educationLevel}
                  onSelectLevel={setEducationLevel}
                  onAskAboutChapter={(book, chapter) => {
                    handleAskAboutStructure(`From the textbook "${book}", explain the high-yield concepts of "${chapter}".`);
                  }}
                  onGenerateQuizOnBook={(book) => {
                    handleOpenQuizWithTopic(`${book} Core Concepts`);
                  }}
                />
              </div>
            )}

            {/* Tab 7: Interactive Biology & Medical Glossary */}
            {currentTab === 'glossary' && (
              <div className="space-y-4">
                <GlossaryView
                  educationLevel={educationLevel}
                  onSelectLevel={setEducationLevel}
                  onAskTutor={(question) => {
                    setPendingQuestion(question);
                    setCurrentTab('tutor');
                  }}
                  onOpenQuizWithTopic={handleOpenQuizWithTopic}
                  onOpenFlashcardsWithTopic={() => setCurrentTab('flashcards')}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subdued Footer with Open Educational Access & Discreet Owner Portal Trigger */}
      <footer className={`${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-900 text-slate-500'} border-t py-4 px-4 text-xs transition-colors`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className={theme === 'light' ? 'text-slate-700 font-medium' : 'text-slate-400 font-medium'}>
              BioStudy AI • Premium Biology & Medical Learning Platform
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowLanding(true)}
              className="text-emerald-500 hover:underline font-semibold"
            >
              App Overview & Features
            </button>
            <span>•</span>
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className={`${theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 hover:text-slate-400'} transition flex items-center gap-1`}
              title="Creator Private Analytics Console (Ctrl+Shift+A)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Guest Upgrade / Conversion Modal */}
      <GuestUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onOpenRegister={() => {
          setIsUpgradeModalOpen(false);
          setShowLanding(true);
        }}
        onOpenLogin={() => {
          setIsUpgradeModalOpen(false);
          setShowLanding(true);
        }}
        featureName={upgradeModalFeature}
        reasonText={upgradeModalReason}
      />

      {/* Private Owner Analytics Console Modal */}
      <OwnerAnalyticsModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
