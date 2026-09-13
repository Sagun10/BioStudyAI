import { EducationLevel } from '../types';

export interface EducationTierConfig {
  id: EducationLevel;
  name: string;
  shortName: string;
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  gradient: string;
  heroTagline: string;
  targetExams: string[];
  vocabularyLevel: string;
  learningApproach: string;
  specializedModes: Array<{
    id: string;
    label: string;
    icon: string;
    description: string;
  }>;
  curriculumHighlights: string[];
  keyTools: string[];
}

export const EDUCATION_TIERS: Record<EducationLevel, EducationTierConfig> = {
  school: {
    id: 'school',
    name: 'School & AP Biology',
    shortName: 'School',
    badge: 'Middle / High School / AP / IB',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-300',
    gradient: 'from-amber-500/20 via-orange-500/10 to-emerald-500/10',
    heroTagline: 'Foundational concepts, everyday analogies, visual memory aids, and AP/IB curriculum prep.',
    targetExams: ['AP Biology', 'IB Biology (SL/HL)', 'GCSE / A-Levels', 'High School Honors', 'State Science Assessments'],
    vocabularyLevel: 'Clear, intuitive English with essential scientific terms clearly defined and highlighted.',
    learningApproach: 'Concept simplification, relatable everyday metaphors, step-by-step homework help, and visual memory mnemonics.',
    specializedModes: [
      { id: 'explain', label: 'Everyday Analogy (ELI5)', icon: '💡', description: 'Simplifies complex biology with easy real-life metaphors.' },
      { id: 'step_by_step', label: 'Step-by-Step Pathway', icon: '🔢', description: 'Breaks biological processes into numbered, easy-to-follow steps.' },
      { id: 'mnemonic', label: 'Visual Mnemonics', icon: '🧠', description: 'Fun acronyms and memory hooks to ace classroom tests.' },
      { id: 'quick_summary', label: 'Cheat-Sheet & Flashcard', icon: '⚡', description: 'Quick high-yield bulleted summary for test morning revision.' },
    ],
    curriculumHighlights: [
      'Cell Structures, Membranes & Organelles',
      'Photosynthesis vs Cellular Respiration',
      'Mitosis, Meiosis & Cell Cycle Stages',
      'Mendelian Punnett Squares & Pedigrees',
      'Human Organ Systems (Circulatory, Respiratory, Digestive)',
      'Ecology, Food Webs & Natural Selection'
    ],
    keyTools: ['Visual Analogy Helper', 'Numbered Homework Stepper', 'Organelle Pinpoint', 'Memory Acronyms']
  },
  undergrad: {
    id: 'undergrad',
    name: 'College & Pre-Med Biology',
    shortName: 'College',
    badge: 'Undergraduate / B.Sc / Pre-Med / MCAT',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/10',
    heroTagline: 'Mechanistic stoichiometry, enzymatic kinetics, bioenergetics, and MCAT/NEET preparation.',
    targetExams: ['MCAT (Biological & Biochemical Foundations)', 'NEET-UG', 'College General Biology I & II', 'Genetics', 'Biochemistry', 'Human Physiology'],
    vocabularyLevel: 'Rigorous academic terminology, biochemical nomenclature, and physiological equations.',
    learningApproach: 'Molecular mechanisms, enzyme kinetics (Michaelis-Menten), membrane bioenergetics, and experimental data interpretation.',
    specializedModes: [
      { id: 'explain', label: 'Mechanistic Deep Dive', icon: '🔬', description: 'Detailed molecular cascades, receptors, and enzyme kinetics.' },
      { id: 'step_by_step', label: 'Stoichiometry & Energy Yields', icon: '⚡', description: 'Step-by-step reactions with ATP/NADH net energy accounting.' },
      { id: 'mnemonic', label: 'High-Yield MCAT Hooks', icon: '💡', description: 'Targeted mnemonics for high-frequency MCAT/NEET questions.' },
      { id: 'quick_summary', label: 'High-Yield Review Matrix', icon: '📊', description: 'Side-by-side comparison tables and regulatory checkpoints.' },
    ],
    curriculumHighlights: [
      'Glycolysis, Krebs Cycle & Oxidative Phosphorylation Bioenergetics',
      'Muscle Sliding Filament & Cross-Bridge Ca2+ Dynamics',
      'Nephron Countercurrent Multiplier & Renal Clearance',
      'DNA Replication, Transcription & Translation Enzymology',
      'Action Potentials, Nernst/Goldman Potentials & Synapses',
      'Adaptive Immunology (T-cells, B-cells & Antibodies)'
    ],
    keyTools: ['Reaction Stoichiometry Tracker', 'Enzyme Rate-Limiting Inspector', 'Physiological Flow Engine', 'MCAT Question Bank']
  },
  grad: {
    id: 'grad',
    name: 'Medical School & USMLE / Grad',
    shortName: 'Grad / Med',
    badge: 'Medical School / USMLE / NCLEX / Postgrad',
    badgeBg: 'bg-indigo-500/15',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-300',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-pink-500/10',
    heroTagline: 'Clinical case vignettes, organ-system pathophysiology, pharmacology targets, and USMLE Step 1/2 mastery.',
    targetExams: ['USMLE Step 1 & Step 2 CK', 'COMLEX-USA Level 1/2', 'NCLEX-RN', 'PLAB / UKMLA', 'First Aid Board Review', 'Biomedical PhD Candidacy'],
    vocabularyLevel: 'Advanced clinical pathology, pharmacodynamics, histological markers, and diagnostic criteria.',
    learningApproach: 'Patient case vignettes, disease pathophysiology, drug mechanisms of action, and high-yield board correlations.',
    specializedModes: [
      { id: 'explain', label: 'Clinical Case & Pathophysiology', icon: '🩺', description: 'Integrates clinical presentations, histological biopsies, and mechanisms.' },
      { id: 'step_by_step', label: 'Pathological & Drug Cascade', icon: '💊', description: 'Maps out disease progression and pharmacological drug targets.' },
      { id: 'mnemonic', label: 'First Aid Board Mnemonics', icon: '🏆', description: 'Standard medical school mnemonics for USMLE & NCLEX.' },
      { id: 'quick_summary', label: 'Differential & Diagnostic Matrix', icon: '📑', description: 'High-yield differential diagnoses, lab findings, and pearls.' },
    ],
    curriculumHighlights: [
      'Glomerular Diseases (Nephrotic vs Nephritic Biopsy Findings)',
      'Cardiac Pressure-Volume Loops, Murmurs & Coronary Infarctions',
      'G-Protein Coupled Receptors (Gs, Gi, Gq) & Second Messengers',
      'Cranial Nerve & Brainstem Stroke Syndromes (Wallenberg, Weber)',
      'Hypersensitivity Types I–IV & Autoimmune Mechanisms',
      'Inborn Errors of Metabolism & Glycogen Storage Diseases'
    ],
    keyTools: ['Clinical Case Vignette Solver', 'Drug Target & MOA Locator', 'Board High-Yield Pearls', 'Differential Diagnostic Matrix']
  }
};
