export type EducationLevel = 'school' | 'undergrad' | 'grad';

export type StudyMode = 'explain' | 'step_by_step' | 'mnemonic' | 'quick_summary' | 'comparison';

export type SubjectCategory = 
  | 'All Subjects'
  | 'Human Anatomy'
  | 'Physiology'
  | 'Cell & Molecular Biology'
  | 'Genetics & Evolution'
  | 'Biochemistry'
  | 'Immunology & Microbiology'
  | 'Neurobiology';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  level?: EducationLevel;
  studyMode?: StudyMode;
  imageUrl?: string;
  suggestedQuestions?: string[];
  visualModelKey?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptSummary: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  mnemonic?: string;
  category: string;
  keyFact: string;
  mastery?: 'new' | 'learning' | 'mastered';
}

export interface FlashcardDeck {
  id: string;
  title: string;
  category: SubjectCategory;
  level: EducationLevel;
  description: string;
  cards: Flashcard[];
}

export interface AnatomyHotspot {
  id: string;
  name: string;
  description: string;
  function: string;
  clinicalOrExamTip?: string;
  color: string;
  x: number; // percentage on SVG (0-100)
  y: number; // percentage on SVG (0-100)
  schoolExplanation?: string;
  collegeExplanation?: string;
  gradExplanation?: string;
  schoolTip?: string;
  collegeTip?: string;
  gradTip?: string;
}

export interface AnatomyModel {
  key: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  svgType: 'heart' | 'brain' | 'cell' | 'nephron' | 'eye' | 'dna' | 'lungs' | 'muscle';
  imageUrl?: string;
  photoCaption?: string;
  hotspots: AnatomyHotspot[];
  examHighYield: string[];
  relatedQuestions: string[];
}

export interface PathwayStep {
  stepNumber: number;
  title: string;
  description: string;
  reactants: string[];
  products: string[];
  enzyme?: string;
  energyChange?: string; // e.g. "+2 ATP", "-1 NADH"
  clinicalNote?: string;
}

export interface BioPathway {
  id: string;
  title: string;
  category: SubjectCategory;
  overview: string;
  cellularLocation: string;
  netEquation: string;
  rateLimitingStep: string;
  steps: PathwayStep[];
}

export interface AdminMetrics {
  totalUniqueVisitors: number;
  activeUsersNow: number;
  totalSessions: number;
  totalChatMessages: number;
  totalNotesDiagnosed: number;
  totalCasesSimulated: number;
  totalSchedulesGenerated: number;
  recentActivity: Array<{
    id: string;
    timestamp: number;
    type: 'chat' | 'diagnosis' | 'case_sim' | 'schedule' | 'session_start';
    details: string;
    device?: string;
  }>;
  dailyVisitors: Array<{
    date: string;
    visitors: number;
    queries: number;
  }>;
  contentPlan: {
    isFullyFree: boolean;
    freeAccessStatement: string;
    futureSubscriptionPlanConfigured: boolean;
  };
}

export interface GlossaryTerm {
  id: string;
  term: string;
  aliases: string[];
  category: 'Physiology' | 'Anatomy' | 'Biochemistry' | 'Cell & Molecular' | 'Genetics' | 'Immunology' | 'Neurobiology' | 'Pharmacology & Pathology';
  level: EducationLevel;
  pronunciation?: string;
  etymology?: string;
  definition: string;
  mechanism: string;
  clinicalPearl: string;
  relatedTerms?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  educationLevel: EducationLevel;
  targetExam?: string;
  streakDays: number;
  studyHoursTotal: number;
  avatarSeed: string;
  isGuest?: boolean;
  createdAt: number;
}

