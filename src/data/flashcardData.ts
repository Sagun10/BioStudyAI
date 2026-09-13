import { FlashcardDeck } from '../types';

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck_anatomy_core',
    title: 'Gross Anatomy & High-Yield Organ Systems',
    category: 'Human Anatomy',
    level: 'undergrad',
    description: 'Essential cardiovascular, pulmonary, gastrointestinal, and neuroanatomy board facts for rapid active recall.',
    cards: [
      {
        id: 'fc_1',
        front: 'What are the three main branches arising from the Aortic Arch?',
        back: '1. Brachiocephalic trunk (bifurcates into Right Common Carotid & Right Subclavian)\n2. Left Common Carotid artery\n3. Left Subclavian artery',
        mnemonic: 'ABC\'S: Aortic arch gives rise to Brachiocephalic, Common carotid (L), Subclavian (L).',
        category: 'Cardiovascular',
        keyFact: 'Supplies arterial oxygenated blood to the head, neck, and upper extremities.'
      },
      {
        id: 'fc_2',
        front: 'Which cranial nerve provides parasympathetic innervation to the heart, lungs, and GI tract down to the splenic flexure?',
        back: 'Cranial Nerve X (Vagus Nerve).',
        mnemonic: 'Vagus "wanders" (Vagabond) down into the thorax and abdomen to slow heart rate and promote digestion.',
        category: 'Neuroanatomy',
        keyFact: 'Postganglionic parasympathetic fibers release Acetylcholine onto M2 muscarinic receptors in the heart.'
      },
      {
        id: 'fc_3',
        front: 'What anatomical landmark marks the bifurcation of the trachea into the left and right mainstem bronchi?',
        back: 'The Carina, located at the T4-T5 vertebral level (Sternal Angle of Louis).',
        mnemonic: 'T4 = Tracheal bifurcation at the Sternal Angle.',
        category: 'Pulmonary',
        keyFact: 'The right main bronchus is wider, shorter, and more vertical than the left, making it more prone to foreign body aspiration.'
      },
      {
        id: 'fc_4',
        front: 'What are the four rotator cuff muscles of the shoulder and their respective actions?',
        back: '1. Supraspinatus (Abduction 0-15°)\n2. Infraspinatus (External rotation)\n3. Teres minor (External rotation & adduction)\n4. Subscapularis (Internal rotation)',
        mnemonic: 'SITS muscles (Supraspinatus, Infraspinatus, Teres minor, Subscapularis).',
        category: 'Musculoskeletal',
        keyFact: 'Supraspinatus is the most frequently injured rotator cuff muscle (impingement beneath acromion).'
      },
      {
        id: 'fc_5',
        front: 'What structures pass through the Carpal Tunnel beneath the flexor retinaculum?',
        back: 'Median Nerve + 9 Flexor Tendons (4 FDP, 4 FDS, 1 FPL).',
        mnemonic: '1 Nerve + 9 Tendons = 10 structures in the tunnel.',
        category: 'Upper Limb Anatomy',
        keyFact: 'Compression of the Median nerve causes numbness in the thumb, index, middle, and radial half of the ring finger.'
      }
    ]
  },
  {
    id: 'deck_cell_genetics',
    title: 'Cell Biology, Genetics & Molecular Mechanisms',
    category: 'Cell & Molecular Biology',
    level: 'school',
    description: 'Core concepts in organelle function, DNA replication, protein synthesis, and Mendelian inheritance.',
    cards: [
      {
        id: 'cg_1',
        front: 'What is the primary function of the Nucleolus inside the cell nucleus?',
        back: 'Synthesis and assembly of ribosomal RNA (rRNA) and ribosome subunits.',
        mnemonic: 'Nucleo-LUS makes ribo-SOME-RUS.',
        category: 'Organelles',
        keyFact: 'Ribosomal subunits exit through nuclear pores to assemble into active 80S ribosomes in the cytoplasm.'
      },
      {
        id: 'cg_2',
        front: 'What are the start codon and three stop codons in mRNA translation?',
        back: 'Start Codon: AUG (codes for Methionine)\nStop Codons: UAA, UAG, UGA',
        mnemonic: 'AUG = "Are U Going?" (Start)\nStop = U Go Away (UGA), U Are Away (UAA), U Are Gone (UAG).',
        category: 'Molecular Genetics',
        keyFact: 'Stop codons do not recruit tRNAs; instead, they bind Release Factors (RFs) to terminate peptide elongation.'
      },
      {
        id: 'cg_3',
        front: 'How do Mitosis and Meiosis differ in terms of daughter cell ploidy and genetic recombination?',
        back: 'Mitosis: 1 division → 2 identical diploid (2n) somatic cells; no crossing over.\nMeiosis: 2 divisions → 4 non-identical haploid (1n) gametes; crossing over occurs in Prophase I.',
        mnemonic: 'Mitosis = "My Toes" (body somatic cells); Meiosis = "Makes Me" (gametes / sperm & egg).',
        category: 'Cell Division',
        keyFact: 'Homologous chromosome pairing during Synapsis is facilitated by the synaptonemal complex.'
      },
      {
        id: 'cg_4',
        front: 'What enzyme synthesizes the short RNA primers necessary for DNA replication?',
        back: 'RNA Primase (part of the primosome).',
        mnemonic: 'Primase creates the "Prime" launchpad with a free 3\'-OH.',
        category: 'Molecular Biology',
        keyFact: 'DNA Polymerase cannot start de novo without a free 3\'-OH end provided by the RNA primer.'
      }
    ]
  },
  {
    id: 'deck_physiology_highyield',
    title: 'Medical Physiology & Board Correlations (USMLE / MCAT)',
    category: 'Physiology',
    level: 'grad',
    description: 'Cardiovascular hemodynamics, renal clearance, endocrine feedback loops, and respiratory mechanics.',
    cards: [
      {
        id: 'phys_1',
        front: 'What causes the Hemoglobin-Oxygen dissociation curve to shift to the RIGHT (facilitating O2 delivery to tissues)?',
        back: '1. Increased [H+] (low pH / acidosis)\n2. Increased PCO2\n3. Increased Temperature\n4. Increased 2,3-BPG',
        mnemonic: 'CADET, face Right! (CO2, Acid, 2,3-DPG, Exercise, Temperature).',
        category: 'Respiratory Physiology',
        keyFact: 'A right shift decreases Hemoglobin\'s oxygen affinity, promoting O2 unloading in actively respiring tissues (Bohr effect).'
      },
      {
        id: 'phys_2',
        front: 'What is the equation for Cardiac Output (CO) and Mean Arterial Pressure (MAP)?',
        back: 'CO = Stroke Volume (SV) × Heart Rate (HR)\nMAP = Diastolic Blood Pressure + 1/3 (Systolic - Diastolic) = CO × Total Peripheral Resistance (TPR)',
        mnemonic: 'MAP = DBP + 1/3 Pulse Pressure.',
        category: 'Cardiovascular Physiology',
        keyFact: 'Systole accounts for 1/3 of the cardiac cycle duration at resting heart rates; Diastole accounts for 2/3.'
      },
      {
        id: 'phys_3',
        front: 'Which renal substance is freely filtered and neither reabsorbed nor secreted, making it the gold standard for measuring GFR?',
        back: 'Inulin (or Creatinine for practical clinical estimation).',
        mnemonic: 'INulin stays IN the urine without being added or subtracted.',
        category: 'Renal Physiology',
        keyFact: 'Para-aminohippuric acid (PAH) is both filtered and completely secreted, measuring Renal Plasma Flow (RPF).'
      },
      {
        id: 'phys_4',
        front: 'What is the rate-limiting enzyme of the Renin-Angiotensin-Aldosterone System (RAAS) and where is it secreted?',
        back: 'Renin, secreted by Juxtaglomerular (JG) cells in the afferent arteriole of the kidney.',
        mnemonic: 'JG cells secrete Renin when Pressure is Low or Sympathetic tone is High.',
        category: 'Endocrine & Renal',
        keyFact: 'Renin cleaves liver-derived Angiotensinogen into Angiotensin I.'
      }
    ]
  }
];
