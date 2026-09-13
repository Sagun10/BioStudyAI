import React, { useState, useRef, useEffect } from 'react';
import { EducationLevel, StudyMode, SubjectCategory, ChatMessage, GlossaryTerm } from '../types';
import { GlossaryAnnotatedText } from './GlossaryAnnotatedText';
import { GlossaryTermModal } from './GlossaryTermModal';
import { DownloadSummaryModal } from './DownloadSummaryModal';
import { findGlossaryTerm } from '../data/glossaryData';
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  ListOrdered, 
  Zap, 
  Image as ImageIcon, 
  X, 
  ArrowRight, 
  HelpCircle, 
  Copy, 
  Check, 
  Layers,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertCircle,
  Radio,
  FileDown
} from 'lucide-react';
import Markdown from 'react-markdown';
import { getVisitorId } from '../utils/telemetry';

interface AskStudyViewProps {
  educationLevel: EducationLevel;
  onSelectLevel: (level: EducationLevel) => void;
  onOpenQuizWithTopic: (topic: string) => void;
  onOpenFlashcardsWithTopic: (topic: string) => void;
  onOpenAnatomyModel: (modelKey: string) => void;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
  isGuest?: boolean;
  guestQuestionsLeft?: number;
  onUseGuestQuestion?: () => void;
  onRequestUpgrade?: (feature: string, reason: string) => void;
}

const SAMPLE_QUESTIONS: Record<EducationLevel, Array<{ question: string; subject: string; mode: StudyMode; icon: string }>> = {
  school: [
    { question: 'How does photosynthesis convert sunlight, water, and CO2 into glucose?', subject: 'Cell & Molecular Biology', mode: 'step_by_step', icon: '🌱' },
    { question: 'Explain the path of blood through the four chambers of the human heart.', subject: 'Human Anatomy', mode: 'explain', icon: '❤️' },
    { question: 'What is the simple difference between Mitosis and Meiosis?', subject: 'Genetics & Evolution', mode: 'quick_summary', icon: '🧬' },
    { question: 'Give me easy mnemonics to remember the stages of Mitosis and taxonomic ranks.', subject: 'Genetics & Evolution', mode: 'mnemonic', icon: '💡' },
    { question: 'How do neurons send electrical signals to muscles?', subject: 'Physiology', mode: 'explain', icon: '⚡' },
  ],
  undergrad: [
    { question: 'Explain the sliding filament theory of muscle contraction and the role of Ca2+ and ATP.', subject: 'Physiology', mode: 'step_by_step', icon: '💪' },
    { question: 'Describe the countercurrent multiplier mechanism in the loop of Henle.', subject: 'Physiology', mode: 'explain', icon: '🫘' },
    { question: 'How does DNA Polymerase III proofread and synthesize lagging strand Okazaki fragments?', subject: 'Genetics & Evolution', mode: 'step_by_step', icon: '🧬' },
    { question: 'Compare Glycolysis, the Krebs Cycle, and Oxidative Phosphorylation ATP yields.', subject: 'Biochemistry', mode: 'quick_summary', icon: '⚡' },
    { question: 'How do helper T cells and cytotoxic T cells coordinate adaptive immune responses?', subject: 'Immunology & Microbiology', mode: 'explain', icon: '🛡️' },
  ],
  grad: [
    { question: 'Detail the cellular mechanism of Renal Glomerular Podocyte effacement in Nephrotic Syndrome.', subject: 'Physiology', mode: 'explain', icon: '🔬' },
    { question: 'Explain the physiological basis of the Bohr effect and 2,3-BPG on the Hemoglobin-O2 dissociation curve.', subject: 'Biochemistry', mode: 'step_by_step', icon: '🩸' },
    { question: 'Describe the molecular pharmacology of G-protein coupled receptors (Gs, Gi, Gq) and second messengers.', subject: 'Biochemistry', mode: 'quick_summary', icon: '🧪' },
    { question: 'High-yield board mnemonics for Cranial Nerve functional modalities (Sensory, Motor, Both).', subject: 'Human Anatomy', mode: 'mnemonic', icon: '🧠' },
    { question: 'Differentiate between Type I, II, III, and IV Hypersensitivity reactions with clinical examples.', subject: 'Immunology & Microbiology', mode: 'quick_summary', icon: '🩺' },
  ]
};

const SUBJECT_LIST: SubjectCategory[] = [
  'All Subjects',
  'Human Anatomy',
  'Physiology',
  'Cell & Molecular Biology',
  'Genetics & Evolution',
  'Biochemistry',
  'Immunology & Microbiology',
];

export const AskStudyView: React.FC<AskStudyViewProps> = ({
  educationLevel,
  onSelectLevel,
  onOpenQuizWithTopic,
  onOpenFlashcardsWithTopic,
  onOpenAnatomyModel,
  initialQuestion,
  onClearInitialQuestion,
  isGuest = false,
  guestQuestionsLeft = 3,
  onUseGuestQuestion,
  onRequestUpgrade,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('All Subjects');
  const [studyMode, setStudyMode] = useState<StudyMode>('explain');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: `### Welcome to BioStudy AI Tutor 🧬\n\nAsk any question across **Anatomy, Physiology, Biochemistry, Genetics, or Pathology**.\n\n- 📖 **Mechanism Explanations & Step-by-Step Pathways**\n- 💡 **High-Yield Memory Mnemonics & Exam Pearls**\n- ✨ **Interactive Glossary Active**: Tap highlighted medical terms for instant definitions\n- 📸 **Upload Photos or Homework Diagrams** for instant AI analysis`,
      timestamp: Date.now(),
      level: educationLevel,
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoLinkGlossary, setAutoLinkGlossary] = useState<boolean>(true);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // Web Speech API state for voice dictation & text-to-speech
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSubmit(initialQuestion);
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  // Clean up Web Speech API recognition & synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, []);

  const startListening = () => {
    setSpeechError(null);
    if (!isSpeechSupported) {
      setSpeechError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari for voice dictation.');
      return;
    }

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interim = '';

        for (let i = 0; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript + ' ';
          } else {
            interim += item[0].transcript;
          }
        }

        const fullText = (finalTranscript + interim).trim();
        if (fullText) {
          setInputText(fullText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone permissions in your browser to dictate questions.');
        } else if (event.error === 'no-speech') {
          // No speech detected, keep listening or let user stop
        } else if (event.error === 'network') {
          setSpeechError('Network error connecting to browser speech recognition.');
        } else {
          setSpeechError(`Speech recognition: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Could not start voice dictation: ' + (err?.message || 'Unknown error'));
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakText = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown formatting for spoken clarity
    const cleanText = text
      .replace(/[#*`_\[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (customPrompt?: string, customMode?: StudyMode) => {
    stopListening();
    const promptToSend = customPrompt || inputText;
    if (!promptToSend.trim() && !selectedImage) return;

    // Check if guest reached query limit
    if (isGuest && guestQuestionsLeft <= 0) {
      onRequestUpgrade?.(
        'Unlimited AI Tutor',
        'You have used all 3 free AI queries in Guest Preview Mode. Create a free account or upgrade to Pro for unlimited AI tutoring, step-by-step pathway explanations, and photo diagnosis.'
      );
      return;
    }

    const currentModeToUse = customMode || studyMode;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: promptToSend,
      timestamp: Date.now(),
      level: educationLevel,
      studyMode: currentModeToUse,
      imageUrl: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    const imageToSend = selectedImage;
    const mimeToSend = imageMime;
    setSelectedImage(null);
    setIsLoading(true);

    if (isGuest) {
      onUseGuestQuestion?.();
    }

    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch('/api/ask-biology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: promptToSend,
          educationLevel,
          studyMode: currentModeToUse,
          conversationHistory: messages.slice(-4),
          imageBase64: imageToSend,
          mimeType: mimeToSend,
          visitorId: getVisitorId(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get answer from study tutor.');
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: data.text,
        timestamp: Date.now(),
        level: educationLevel,
        studyMode: currentModeToUse,
        suggestedQuestions: data.followUpQuestions,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          content: `⚠️ **Error:** Unable to complete your request. Please check your connection and try again.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
      {/* Sleek Minimalist Tutor Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-white tracking-wide">
                BioStudy AI Assistant
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {educationLevel === 'school' ? 'High School & AP' : educationLevel === 'undergrad' ? 'College & Pre-Med' : 'Medical & USMLE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Voice-enabled biology tutor with real organ links & step-by-step pathways
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 transition flex items-center gap-1.5 shadow-xs"
            title="Download structured study summary (PDF or Markdown) with linked glossary index"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Download Summary</span>
            <span className="sm:hidden">Summary</span>
          </button>

          <button
            onClick={() => setAutoLinkGlossary(!autoLinkGlossary)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
              autoLinkGlossary
                ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle automatic medical glossary highlights in tutor answers"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoLinkGlossary ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="hidden sm:inline">Glossary Links:</span>
            <span className="font-bold">{autoLinkGlossary ? 'ON' : 'OFF'}</span>
          </button>

          {messages.length > 1 && (
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome_' + Date.now(),
                    role: 'assistant',
                    content: `### Welcome to BioStudy AI Tutor 🧬\n\nAsk any question across **Anatomy, Physiology, Biochemistry, Genetics, or Pathology**.\n\n- 📖 **Mechanism Explanations & Step-by-Step Pathways**\n- 💡 **High-Yield Memory Mnemonics & Exam Pearls**\n- ✨ **Interactive Glossary Active**: Tap highlighted medical terms for instant definitions\n- 📸 **Upload Photos or Homework Diagrams** for instant AI analysis`,
                    timestamp: Date.now(),
                    level: educationLevel,
                  }
                ]);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
              title="Clear conversation history"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Suggested Topic Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Prompts:</span>
        </span>
        {SAMPLE_QUESTIONS[educationLevel].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setStudyMode(item.mode);
              handleSubmit(item.question, item.mode);
            }}
            disabled={isLoading}
            className="text-left text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 group"
          >
            <span>{item.icon}</span>
            <span className="line-clamp-1 max-w-[240px]">{item.question}</span>
            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
          </button>
        ))}
      </div>

      {/* Main Conversation Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden flex flex-col min-h-[450px] max-h-[650px]">
        {/* Messages List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-bold text-slate-400">
                  {msg.role === 'user' ? 'You (Student)' : 'BioStudy AI Tutor'}
                </span>
                {msg.studyMode && msg.role === 'user' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    Mode: {msg.studyMode.replace('_', ' ')}
                  </span>
                )}
              </div>

              <div
                className={`rounded-2xl p-4 sm:p-5 text-sm max-w-full sm:max-w-3xl leading-relaxed relative group ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-slate-950 text-slate-200 border border-slate-800/90 rounded-tl-sm shadow-sm'
                }`}
              >
                {/* Uploaded Image Preview if user message */}
                {msg.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded Diagram"
                      className="max-h-48 rounded-xl border border-emerald-400/40 object-contain bg-black/40"
                    />
                  </div>
                )}

                {/* Markdown Formatted Body with Automatic Medical Glossary Term Linking */}
                <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-sm leading-relaxed space-y-2">
                  {msg.role === 'assistant' ? (
                    <Markdown
                      components={{
                        p: ({ children }) => (
                          <p className="leading-relaxed mb-2 last:mb-0">
                            <GlossaryAnnotatedText
                              enabled={autoLinkGlossary}
                              onSelectTerm={(term) => {
                                setSelectedGlossaryTerm(term);
                                setIsGlossaryModalOpen(true);
                              }}
                            >
                              {children}
                            </GlossaryAnnotatedText>
                          </p>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed">
                            <GlossaryAnnotatedText
                              enabled={autoLinkGlossary}
                              onSelectTerm={(term) => {
                                setSelectedGlossaryTerm(term);
                                setIsGlossaryModalOpen(true);
                              }}
                            >
                              {children}
                            </GlossaryAnnotatedText>
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-white">
                            <GlossaryAnnotatedText
                              enabled={autoLinkGlossary}
                              onSelectTerm={(term) => {
                                setSelectedGlossaryTerm(term);
                                setIsGlossaryModalOpen(true);
                              }}
                            >
                              {children}
                            </GlossaryAnnotatedText>
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-slate-200">
                            <GlossaryAnnotatedText
                              enabled={autoLinkGlossary}
                              onSelectTerm={(term) => {
                                setSelectedGlossaryTerm(term);
                                setIsGlossaryModalOpen(true);
                              }}
                            >
                              {children}
                            </GlossaryAnnotatedText>
                          </em>
                        ),
                      }}
                    >
                      {msg.content}
                    </Markdown>
                  ) : (
                    <Markdown>{msg.content}</Markdown>
                  )}
                </div>

                {/* Assistant Action Tools */}
                {msg.role === 'assistant' && msg.id !== 'welcome_1' && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900 border border-slate-800 transition"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy Notes'}</span>
                      </button>
                      <button
                        onClick={() => setIsDownloadModalOpen(true)}
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-slate-900 border border-slate-800 transition"
                        title="Download complete lesson summary with glossary index as PDF or Markdown"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Export Summary</span>
                      </button>
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.content)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded border transition ${
                          speakingMessageId === msg.id
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 animate-pulse'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title={speakingMessageId === msg.id ? 'Stop audio readout' : 'Listen to this explanation aloud'}
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-rose-300 font-bold">Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenQuizWithTopic(inputText || 'This Topic')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 rounded-lg transition font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Test Me (Quiz)</span>
                      </button>
                      <button
                        onClick={() => onOpenFlashcardsWithTopic(inputText || 'This Topic')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 rounded-lg transition font-medium"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Flashcards</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Questions */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 block">Explore Further:</span>
                    <div className="flex flex-col gap-1.5">
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSubmit(sq)}
                          disabled={isLoading}
                          className="text-left text-xs bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-800 transition flex items-center justify-between"
                        >
                          <span>{sq}</span>
                          <ArrowRight className="w-3 h-3 shrink-0 ml-1 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2 animate-fadeIn">
              <div className="rounded-2xl p-4 bg-slate-950 text-slate-400 border border-slate-800 rounded-tl-sm text-xs flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>BioStudy AI is synthesizing explanation for {educationLevel}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Unified Controls */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          {/* Style Selector & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 px-2 font-medium">Style:</span>
              <button
                onClick={() => setStudyMode('explain')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  studyMode === 'explain' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explain</span>
              </button>
              <button
                onClick={() => setStudyMode('step_by_step')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  studyMode === 'step_by_step' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Step-by-Step</span>
              </button>
              <button
                onClick={() => setStudyMode('mnemonic')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  studyMode === 'mnemonic' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Mnemonics</span>
              </button>
              <button
                onClick={() => setStudyMode('quick_summary')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  studyMode === 'quick_summary' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Cheat-Sheet</span>
              </button>
            </div>

            {/* Quick Actions: Voice Dictation & Upload Diagram Trigger */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-md shadow-rose-950/50 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-teal-300'
                }`}
                title={isListening ? 'Stop voice dictation' : 'Dictate question via Web Speech API'}
              >
                {isListening ? (
                  <>
                    <Radio className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                    <span>Listening... (Stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-teal-400" />
                    <span>Voice Dictate</span>
                  </>
                )}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  selectedImage
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedImage ? 'Image Attached' : 'Attach Photo'}</span>
              </button>
            </div>
          </div>

          {/* Active Voice Dictation Banner */}
          {isListening && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-teal-950/60 border border-rose-500/40 text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn shadow-lg">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                  <Mic className="w-4 h-4 animate-bounce" />
                </div>
                <div className="space-y-0.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                      Live Voice Dictation Active
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                      Web Speech API
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {inputText.trim() 
                      ? <span className="text-emerald-300 font-medium">"{inputText}"</span>
                      : 'Speak clearly into your microphone. Say terms like "Explain the Bohr effect" or "Krebs cycle"...'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Done Speaking</span>
                </button>
                {inputText.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      stopListening();
                      handleSubmit();
                    }}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ask AI Now</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Speech Error Banner if permission denied or unsupported */}
          {speechError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{speechError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                className="text-rose-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Image Thumbnail Preview if attached */}
          {selectedImage && (
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Selected preview"
                className="h-16 w-auto rounded-lg border border-emerald-500 object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow hover:bg-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Text Input & Submit Button */}
          {isGuest && (
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Guest Preview AI Queries:</span>
                <span className={`font-bold ${guestQuestionsLeft > 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                  {guestQuestionsLeft} / 3 left
                </span>
              </span>
              {guestQuestionsLeft === 0 ? (
                <button
                  type="button"
                  onClick={() => onRequestUpgrade?.('Unlimited AI Biology Tutor', 'You have reached the 3-query limit in Guest mode. Upgrade to Pro or register free for unlimited queries.')}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Limit Reached — Upgrade to Pro →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequestUpgrade?.('Pro AI Biology Tutor', 'Unlock unlimited queries, instant photo diagnostics, and deeper textbook citations with Pro.')}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Get Unlimited Queries →
                </button>
              )}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  educationLevel === 'school'
                    ? 'Ask anything or dictate (e.g., How does photosynthesis work? What are blood types? Explain the brain lobes...)'
                    : educationLevel === 'undergrad'
                    ? 'Ask anything or dictate (e.g., Explain the sliding filament theory, Krebs cycle regulation, nephron countercurrent...)'
                    : 'Ask anything or dictate (e.g., Glomerular filtration hemodynamics, USMLE high-yield mnemonics, GPCR second messengers...)'
                }
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2.5 p-1.5 rounded-lg transition ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                }`}
                title={isListening ? 'Stop voice dictation' : 'Click to dictate question with microphone'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition shadow-lg flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>

      {/* Interactive Glossary Term Modal for Instant Term Lookups */}
      <GlossaryTermModal
        term={selectedGlossaryTerm}
        isOpen={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
        onSelectRelatedTerm={(relTerm) => setSelectedGlossaryTerm(relTerm)}
        onAskTutor={(q) => {
          handleSubmit(q);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Download Study Summary (PDF & Markdown) Modal */}
      <DownloadSummaryModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        messages={messages}
        educationLevel={educationLevel}
      />
    </div>
  );
};
