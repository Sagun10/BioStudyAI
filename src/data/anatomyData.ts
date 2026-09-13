import { AnatomyModel } from '../types';
import heartImg from '../assets/images/heart_cross_sec_1786876528621.jpg';
import brainImg from '../assets/images/brain_cross_sec_1786876539765.jpg';
import cellImg from '../assets/images/cell_cross_sec_1786876576388.jpg';
import kidneyImg from '../assets/images/kidney_cross_sec_1786876550107.jpg';
import eyeImg from '../assets/images/eye_cross_sec_1786876562801.jpg';
import dnaImg from '../assets/images/dna_cross_sec_1786876613194.jpg';
import lungsImg from '../assets/images/lungs_cross_sec_1786876590265.jpg';
import sarcomereImg from '../assets/images/sarcomere_cross_1786876600055.jpg';

export const ANATOMY_MODELS: AnatomyModel[] = [
  {
    key: 'heart_anatomy',
    title: 'Human Heart & Systemic Circulation',
    category: 'Human Anatomy & Cardiology',
    subtitle: 'Coronal Cross-Section: Chambers, Valves & Septum',
    description: 'A four-chambered muscular organ that serves as the central circulatory pump. The right side receives systemic venous blood and pumps it into pulmonary circulation; the left side receives oxygen-rich pulmonary blood and ejects it into high-pressure systemic arteries.',
    svgType: 'heart',
    imageUrl: heartImg,
    photoCaption: 'High-detail coronal cross-section of the human heart showing internal ventricles, atria, interventricular septum, bicuspid/tricuspid valves, and chordae tendineae.',
    hotspots: [
      {
        id: 'left_ventricle',
        name: 'Left Ventricle',
        description: 'The thickest muscular chamber of the heart. Pumps oxygenated blood through the aortic valve into systemic circulation.',
        function: 'Generates systolic pressure (~120 mmHg) to perfuse all peripheral organs and tissues.',
        clinicalOrExamTip: 'Left ventricular hypertrophy (LVH) occurs due to chronic untreated hypertension or aortic stenosis.',
        color: '#ef4444',
        x: 64,
        y: 72
      },
      {
        id: 'right_ventricle',
        name: 'Right Ventricle',
        description: 'Anterior crescent-shaped chamber that pumps deoxygenated blood into the low-pressure pulmonary circuit.',
        function: 'Generates systolic pressure (~25 mmHg) to send venous blood to the alveolar capillaries.',
        clinicalOrExamTip: 'Cor pulmonale refers to right ventricular enlargement secondary to chronic lung disease.',
        color: '#3b82f6',
        x: 36,
        y: 70
      },
      {
        id: 'right_atrium',
        name: 'Right Atrium',
        description: 'Receives deoxygenated venous return from the Superior Vena Cava (SVC), Inferior Vena Cava (IVC), and Coronary Sinus.',
        function: 'Reservoir chamber and holds the Sinoatrial (SA) Node at the junction of the SVC and crista terminalis.',
        clinicalOrExamTip: 'Atrial septal defects (ASD) allow oxygenated blood to shunt left-to-right into the right atrium.',
        color: '#2563eb',
        x: 28,
        y: 44
      },
      {
        id: 'left_atrium',
        name: 'Left Atrium',
        description: 'Posterior base of the heart receiving 4 pulmonary veins carrying oxygenated blood from the lungs.',
        function: 'Contracts during late diastole ("atrial kick", contributing ~20% to cardiac output) into the left ventricle.',
        clinicalOrExamTip: 'Left atrial enlargement can compress the esophagus (dysphagia) or recurrent laryngeal nerve (hoarseness).',
        color: '#f87171',
        x: 72,
        y: 42
      },
      {
        id: 'aorta',
        name: 'Ascending Aorta & Aortic Arch',
        description: 'The largest arterial trunk in the body arising directly from the aortic orifice of the left ventricle.',
        function: 'Branches into the Brachiocephalic, Left Common Carotid, and Left Subclavian arteries to supply the brain and upper body.',
        clinicalOrExamTip: 'Aortic dissection commonly originates at the ascending aorta just distal to the coronary ostia.',
        color: '#f59e0b',
        x: 52,
        y: 18
      },
      {
        id: 'pulmonary_trunk',
        name: 'Pulmonary Trunk & Arteries',
        description: 'Arises from the right ventricle and bifurcates into the left and right pulmonary arteries.',
        function: 'Only postnatal arteries in the human body that carry deoxygenated blood.',
        clinicalOrExamTip: 'Pulmonary saddle embolisms lodge at the bifurcation of the pulmonary trunk, causing sudden circulatory arrest.',
        color: '#6366f1',
        x: 62,
        y: 28
      },
      {
        id: 'mitral_valve',
        name: 'Mitral (Bicuspid) Valve & Chordae Tendineae',
        description: 'Dual-flap atrioventricular valve between the left atrium and left ventricle supported by fibrous chordae tendineae and papillary muscles.',
        function: 'Snaps shut at the onset of ventricular systole to produce the S1 heart sound and prevent regurgitation.',
        clinicalOrExamTip: 'Mitral valve prolapse (MVP) produces a mid-systolic click followed by a late systolic murmur.',
        color: '#10b981',
        x: 62,
        y: 54
      }
    ],

    examHighYield: [
      'Normal blood flow sequence: SVC/IVC → Right Atrium → Tricuspid Valve → Right Ventricle → Pulmonary Valve → Lungs → Pulmonary Veins → Left Atrium → Mitral Valve → Left Ventricle → Aortic Valve → Systemic Organs.',
      'S1 heart sound = Closure of AV valves (Mitral & Tricuspid) at beginning of systole. S2 = Closure of semilunar valves (Aortic & Pulmonic) at end of systole.',
      'The left coronary artery branches into the Left Anterior Descending (LAD, "widowmaker") and the Circumflex branch (LCx).'
    ],
    relatedQuestions: [
      'Why is the left ventricular myocardium roughly 3 times thicker than the right ventricular wall?',
      'Trace the path of an electrical impulse from the SA node through the Purkinje fibers.',
      'What physiological mechanism causes the S1 and S2 heart sounds heard with a stethoscope?'
    ]
  },
  {
    key: 'brain_neuro',
    title: 'Human Brain & Neuroanatomy',
    category: 'Neuroscience & Gross Anatomy',
    subtitle: 'Sagittal Midline Cross-Section: Cortex, Ventricles & Brainstem',
    description: 'The executive organ of the central nervous system containing ~86 billion neurons. Manages motor execution, sensory interpretation, higher cognitive reasoning, autonomic reflexes, and emotional memory.',
    svgType: 'brain',
    imageUrl: brainImg,
    photoCaption: 'Detailed sagittal midline cross-section of the human brain showing the cerebral cortex, corpus callosum, thalamus, lateral ventricle, brainstem, and cerebellum arbor vitae.',
    hotspots: [
      {
        id: 'frontal_lobe',
        name: 'Frontal Lobe & Prefrontal Cortex',
        description: 'Anterior cerebral hemisphere containing primary motor cortex (precentral gyrus) and Broca’s expressive speech area.',
        function: 'Executive functioning, impulse control, working memory, voluntary motor initiation, and personality.',
        clinicalOrExamTip: 'Lesions to Broca’s area (inferior frontal gyrus) cause expressive motor aphasia with intact comprehension.',
        color: '#3b82f6',
        x: 24,
        y: 35
      },
      {
        id: 'parietal_lobe',
        name: 'Parietal Lobe & Corpus Callosum',
        description: 'Midline neural bridge and somatosensory cortex connecting left and right cerebral hemispheres.',
        function: 'Processes tactile sensation and provides interhemispheric communication via ~200 million axonal fibers.',
        clinicalOrExamTip: 'Surgical transection of the corpus callosum (callosotomy) creates "split-brain" syndrome.',
        color: '#8b5cf6',
        x: 52,
        y: 32
      },
      {
        id: 'occipital_lobe',
        name: 'Occipital Lobe & Visual Cortex',
        description: 'Posterior cerebral pole surrounding the calcarine sulcus.',
        function: 'Primary visual reception (Brodmann area 17) and color, motion, and form processing.',
        clinicalOrExamTip: 'Posterior cerebral artery (PCA) stroke leads to homonymous hemianopia with macular sparing.',
        color: '#ec4899',
        x: 82,
        y: 46
      },
      {
        id: 'temporal_lobe',
        name: 'Thalamus & Hypothalamus',
        description: 'Central diencephalic relay station and endocrine/autonomic command center above the brainstem.',
        function: 'Relays all sensory inputs (except olfaction) to the cortex; regulates body temperature, thirst, hunger, and circadian rhythm.',
        clinicalOrExamTip: 'Thalamic pain syndrome (Dejerine-Roussy) causes severe contralateral burning pain after thalamic infarct.',
        color: '#f59e0b',
        x: 48,
        y: 50
      },
      {
        id: 'cerebellum',
        name: 'Cerebellum & Arbor Vitae',
        description: 'Infratentorial structure with cerebellar hemispheres and distinct white matter branching pattern (arbor vitae).',
        function: 'Coordinates fine motor movements, balance, posture, motor learning, and rapid alternating hand movements.',
        clinicalOrExamTip: 'Cerebellar dysfunction produces ipsilateral ataxia, intention tremor, nystagmus, and dysdiadochokinesia.',
        color: '#10b981',
        x: 74,
        y: 72
      },
      {
        id: 'brainstem',
        name: 'Brainstem (Midbrain, Pons, Medulla)',
        description: 'Connects the cerebral hemispheres to the spinal cord; houses cranial nerve nuclei III through XII.',
        function: 'Regulates critical life-support reflexes: respiratory rhythm, heart rate, blood pressure, vomiting, and sleep-wake cycles.',
        clinicalOrExamTip: 'Medullary respiratory centers detect arterial PCO2 via CSF hydrogen ion concentration.',
        color: '#06b6d4',
        x: 46,
        y: 76
      }
    ],
    examHighYield: [
      'Circle of Willis provides vital collateral cerebral blood flow: Anterior Communicating, Anterior Cerebral, Internal Carotid, Posterior Communicating, and Posterior Cerebral Arteries.',
      'Upper Motor Neuron (UMN) lesions = Spastic paralysis, hyperreflexia, positive Babinski sign. Lower Motor Neuron (LMN) lesions = Flaccid paralysis, fasciculations, hyporeflexia.',
      'Cerebrospinal fluid (CSF) is produced by ependymal cells of the choroid plexus and reabsorbed into superior sagittal sinus via arachnoid granulations.'
    ],
    relatedQuestions: [
      'How does Broca’s motor aphasia differ clinically from Wernicke’s receptive aphasia?',
      'What are the 3 structural components of the brainstem and their primary vital reflex centers?',
      'Trace the flow of Cerebrospinal Fluid (CSF) from the lateral ventricles to the arachnoid villi.'
    ]
  },
  {
    key: 'cell_biology',
    title: 'Eukaryotic Animal Cell & Organelles',
    category: 'Cell & Molecular Biology',
    subtitle: '3D Cutaway Cross-Section: Nucleus, Organelles & Cristae',
    description: 'The fundamental microscopic unit of animal life. Encased by a phospholipid bilayer with compartmentalized, membrane-bound organelles that execute transcription, translation, oxidative phosphorylation, lipid synthesis, and protein sorting.',
    svgType: 'cell',
    imageUrl: cellImg,
    photoCaption: 'Detailed 3D cutaway cross-section of an animal cell exposing internal nucleolus, endoplasmic reticulum, mitochondria cristae, and Golgi apparatus.',
    hotspots: [
      {
        id: 'nucleus',
        name: 'Nucleus & Dense Nucleolus',
        description: 'Double-membraned organelle with nuclear pores enclosing the eukaryotic genome (chromatin).',
        function: 'Stores genomic DNA, regulates transcription and mRNA processing; the dense nucleolus synthesizes ribosomal RNA (rRNA).',
        clinicalOrExamTip: 'Nuclear pore complexes selectively transport proteins bearing Nuclear Localization Signals (NLS) via importins.',
        color: '#8b5cf6',
        x: 46,
        y: 46
      },
      {
        id: 'mitochondria',
        name: 'Mitochondria (Cristae & Matrix)',
        description: 'Double-membraned organelle with folded inner cristae and an electrochemical proton-gradient matrix.',
        function: 'Site of Krebs (TCA) cycle, beta-oxidation of fatty acids, and ATP synthesis via electron transport chain / ATP synthase.',
        clinicalOrExamTip: 'Mitochondria contain their own circular maternal DNA (mtDNA) and replicate via binary fission.',
        color: '#ef4444',
        x: 74,
        y: 42
      },
      {
        id: 'rough_er',
        name: 'Rough Endoplasmic Reticulum (RER)',
        description: 'Extensive folded membrane network continuous with the outer nuclear envelope, studded with 80S ribosomes.',
        function: 'Synthesizes, folds, and performs N-linked glycosylation of secretory, lysosomal, and transmembrane proteins.',
        clinicalOrExamTip: 'Neurons have prominent rough ER collections known as Nissl bodies for massive neurotransmitter production.',
        color: '#3b82f6',
        x: 32,
        y: 38
      },
      {
        id: 'golgi_apparatus',
        name: 'Golgi Apparatus Cisternae',
        description: 'Stacked, flattened cisternae with distinct cis (entry) and trans (exit) maturation faces.',
        function: 'Modifies proteins (O-linked glycosylation, mannose-6-phosphate tagging for lysosomes) and packages vesicles into secretory pathways.',
        clinicalOrExamTip: 'I-cell disease is a fatal lysosomal storage defect caused by failure of the Golgi to add Mannose-6-Phosphate tags.',
        color: '#f59e0b',
        x: 64,
        y: 65
      },
      {
        id: 'lysosome',
        name: 'Lysosome & Peroxisome',
        description: 'Spherical acidic vesicles (pH ~4.5 - 5.0) packed with over 50 hydrolytic enzymes and proton ATPase pumps.',
        function: 'Degrades endocytosed macromolecules, worn-out organelles (autophagy), and engulfed pathogens.',
        clinicalOrExamTip: 'Tay-Sachs disease results from deficiency of lysosomal hexosaminidase A leading to GM2 ganglioside accumulation.',
        color: '#10b981',
        x: 24,
        y: 66
      }
    ],
    examHighYield: [
      'Fluid Mosaic Model: Phospholipid bilayer with hydrophobic fatty acid tails facing inward and hydrophilic phosphate heads facing aqueous cytosol/extracellular matrix.',
      'Protein secretion pathway: Nucleus (Transcription) → Cytosol/Ribosome → Rough ER (Translation & Folding) → COPII vesicle → cis-Golgi → trans-Golgi → Secretory granule → Exocytosis.',
      'Peroxisomes carry out catalase-mediated breakdown of hydrogen peroxide (H2O2) and very long chain fatty acids (VLCFA).'
    ],
    relatedQuestions: [
      'How does the Golgi apparatus specifically tag and sort enzymes destined for the lysosome?',
      'Why does the mitochondrial electron transport chain require an intact inner membrane proton gradient?',
      'What are the primary structural differences between Rough ER and Smooth ER?'
    ]
  },
  {
    key: 'nephron_renal',
    title: 'Kidney Coronal Cutaway & Nephron',
    category: 'Renal Physiology & Histology',
    subtitle: 'Coronal Cross-Section: Cortex, Medullary Pyramids & Pelvis',
    description: 'The functional filtration system of the human kidney. Filters blood plasma under pressure, selectively reabsorbs water, glucose, and electrolytes, secretes metabolic wastes, and maintains acid-base and blood pressure homeostasis.',
    svgType: 'nephron',
    imageUrl: kidneyImg,
    photoCaption: 'High-detail coronal cross-section of the human kidney displaying the renal cortex, medullary pyramids, renal pelvis, calyces, and renal vessels.',
    hotspots: [
      {
        id: 'glomerulus',
        name: 'Renal Cortex & Glomeruli',
        description: 'Outer granular zone containing ~1 million glomeruli, Bowman capsules, and proximal and distal convoluted tubules.',
        function: 'Ultrafiltration of blood plasma (GFR ~125 mL/min); produces primary ultrafiltrate free of large proteins.',
        clinicalOrExamTip: 'Nephrotic syndrome is characterized by podocyte effacement leading to massive proteinuria (>3.5 g/day).',
        color: '#ef4444',
        x: 28,
        y: 32
      },
      {
        id: 'proximal_tubule',
        name: 'Renal Medullary Pyramids',
        description: 'Striated triangular medullary lobes containing parallel loops of Henle, collecting ducts, and vasa recta capillaries.',
        function: 'Establishes hypertonic corticomedullary osmolar gradient necessary for water reabsorption.',
        clinicalOrExamTip: 'Renal papillary necrosis occurs with chronic analgesic use (NSAIDs), sickle cell disease, or severe diabetes mellitus.',
        color: '#f59e0b',
        x: 46,
        y: 48
      },
      {
        id: 'loop_of_henle',
        name: 'Renal Calyces (Minor & Major)',
        description: 'Funnel-shaped cup-like collecting chambers enclosing the papillae of the renal pyramids.',
        function: 'Collects final urine from the collecting ducts and funnels it smoothly into the renal pelvis.',
        clinicalOrExamTip: 'Staghorn calculi (struvite stones) form branched casts filling the renal pelvis and calyces, typically secondary to Proteus infection.',
        color: '#3b82f6',
        x: 60,
        y: 44
      },
      {
        id: 'distal_tubule',
        name: 'Renal Pelvis & Ureter',
        description: 'Expanded upper end of the ureter residing at the renal hilum.',
        function: 'Transports urine via smooth muscle peristalsis down the ureter to the urinary bladder.',
        clinicalOrExamTip: 'Hydronephrosis refers to dilation of the renal pelvis and calyces caused by obstruction to urine outflow.',
        color: '#8b5cf6',
        x: 74,
        y: 65
      },
      {
        id: 'collecting_duct',
        name: 'Renal Artery & Vein (Hilum)',
        description: 'High-flow vascular conduit receiving ~20-25% of total resting cardiac output.',
        function: 'Delivers oxygenated blood for glomerular filtration and drains cleansed venous blood into the Inferior Vena Cava.',
        clinicalOrExamTip: 'Renal artery stenosis activates RAAS, causing refractory renovascular hypertension and abdominal bruits.',
        color: '#10b981',
        x: 66,
        y: 30
      }
    ],
    examHighYield: [
      'Renin-Angiotensin-Aldosterone System (RAAS): Juxtaglomerular cells secrete Renin in response to low renal perfusion pressure or low NaCl delivery to macula densa.',
      'Countercurrent multiplier mechanism in the loop of Henle establishes a corticomedullary hyperosmolar gradient (300 mOsm/L at cortex to 1200 mOsm/L in inner medulla).',
      'Normal Glomerular Filtration Rate (GFR) is approximately 90 - 120 mL/min/1.73 m².'
    ],
    relatedQuestions: [
      'Explain how the thick ascending limb of Henle creates the medullary hyperosmolar gradient.',
      'How does Antidiuretic Hormone (ADH/Vasopressin) regulate urine concentration in the collecting duct?',
      'What are the cellular components of the glomerular filtration barrier and how do they prevent albuminuria?'
    ]
  },
  {
    key: 'eye_vision',
    title: 'Human Eye Sagittal Cross-Section',
    category: 'Sensory Physiology & Optics',
    subtitle: 'Cross-Section: Cornea, Lens, Retina Layers & Optic Nerve',
    description: 'A specialized sensory organ designed for light focusing and phototransduction. Light refracts through the cornea and lens onto the multilayered neurosensory retina, where rhodopsin in rods and photopsin in cones hyperpolarize to generate visual nerve signals.',
    svgType: 'eye',
    imageUrl: eyeImg,
    photoCaption: 'High-detail sagittal cross-section of the human eyeball exposing the anterior chamber, crystalline lens, vitreous body, retina, choroid, and optic nerve head.',
    hotspots: [
      {
        id: 'cornea',
        name: 'Cornea & Anterior Chamber',
        description: 'Avascular transparent fibrous anterior window with aqueous humor chamber in front of the iris.',
        function: 'Provides roughly two-thirds (~43 diopters) of total refractive focusing power of the eye.',
        clinicalOrExamTip: 'Corneal reflex: Afferent limb is CN V1 (ophthalmic nerve); Efferent limb is CN VII (facial nerve motor to orbicularis oculi).',
        color: '#06b6d4',
        x: 18,
        y: 48
      },
      {
        id: 'lens',
        name: 'Crystalline Lens & Ciliary Body',
        description: 'Biconvex, elastic transparent protein structure suspended by zonular fibers attached to the ciliary muscle.',
        function: 'Undergoes accommodation (parasympathetic CN III stimulation contracts ciliary muscle, slackens zonules, rounding the lens for near vision).',
        clinicalOrExamTip: 'Presbyopia is age-related loss of lens elasticity causing inability to focus on near objects.',
        color: '#3b82f6',
        x: 36,
        y: 48
      },
      {
        id: 'retina_fovea',
        name: 'Retina, Choroid & Fovea Centralis',
        description: 'Neurosensory inner tunic backed by vascular choroid; the fovea is a central retinal depression packed with cone photoreceptors.',
        function: 'Site of highest visual acuity and photopic color vision; zero rod photoreceptors in the foveola.',
        clinicalOrExamTip: 'Age-related macular degeneration (AMD) causes central scotoma and loss of fine reading vision.',
        color: '#ec4899',
        x: 78,
        y: 48
      },
      {
        id: 'optic_nerve',
        name: 'Optic Nerve & Optic Disc (Blind Spot)',
        description: 'Axons of retinal ganglion cells coalescing at the optic disc, exiting the globe through the lamina cribrosa toward the optic chiasm.',
        function: 'Transmits all visual electrical impulses to the lateral geniculate nucleus (LGN) of the thalamus.',
        clinicalOrExamTip: 'Increased intracranial pressure causes swelling of the optic disc known as papilledema.',
        color: '#f59e0b',
        x: 88,
        y: 58
      }
    ],
    examHighYield: [
      'Phototransduction cascade: Light absorbs into 11-cis-retinal → isomerizes to all-trans-retinal → activates Transducin (G-protein) → activates PDE6 → decreases cGMP → closes Na+/Ca2+ channels → photoreceptor HYPERPOLARIZES.',
      'Rods = High sensitivity to light, low visual acuity, nighttime vision, contain Rhodopsin. Cones = Low sensitivity, high visual acuity, color vision (Red/Green/Blue), concentrated in fovea.',
      'Pupillary Light Reflex: Afferent CN II (Optic) → Pretectal nuclei (bilateral) → Edinger-Westphal nuclei → Efferent CN III (Oculomotor) → Ciliary ganglion → Sphincter pupillae constriction.'
    ],
    relatedQuestions: [
      'Explain the biochemical mechanism of phototransduction and why light causes photoreceptors to hyperpolarize rather than depolarize.',
      'Trace the pupillary light reflex pathway explaining why shining light in one eye causes consensual constriction in the other.',
      'How does the ciliary muscle accommodate the lens for near vs distance vision?'
    ]
  },
  {
    key: 'dna_genetics',
    title: 'DNA Double Helix & Base Pair Cross-Section',
    category: 'Genetics & Molecular Biology',
    subtitle: 'Molecular Diagram: Nitrogenous Bases & Sugar-Phosphate Backbone',
    description: 'The biochemical blueprint of hereditary information composed of two anti-parallel polynucleotide strands wound in a right-handed B-DNA double helix, connected by specific hydrogen bonds between purines and pyrimidines.',
    svgType: 'dna',
    imageUrl: dnaImg,
    photoCaption: 'Detailed 3D molecular cross-section of DNA showing hydrogen-bonded A-T and G-C base pairs, major/minor grooves, and antiparallel sugar-phosphate backbones.',
    hotspots: [
      {
        id: 'base_pairs',
        name: 'Complementary Base Pairs (A-T & G-C)',
        description: 'Purines (Adenine, Guanine) pair strictly with Pyrimidines (Thymine, Cytosine). A-T forms 2 hydrogen bonds; G-C forms 3 hydrogen bonds.',
        function: 'Encodes genetic instructions into triplet codons; high G-C content increases DNA melting temperature (Tm).',
        clinicalOrExamTip: 'Deamination of Cytosine produces Uracil, recognized and excised by Uracil-DNA Glycosylase in base excision repair.',
        color: '#3b82f6',
        x: 50,
        y: 42
      },
      {
        id: 'sugar_phosphate',
        name: 'Sugar-Phosphate Backbone',
        description: 'Alternating 2-deoxyribose sugars and phosphate groups linked by 3’,5’-phosphodiester covalent bonds.',
        function: 'Provides structural rigidity and negatively charged exterior surface; gives DNA its anti-parallel (5’ to 3’ and 3’ to 5’) polarity.',
        clinicalOrExamTip: 'Histone octamers are rich in basic, positively charged Lysine and Arginine residues to bind negatively charged DNA backbone.',
        color: '#10b981',
        x: 28,
        y: 50
      },
      {
        id: 'replication_fork',
        name: 'Replication Fork & Helicase',
        description: 'Y-shaped active region where DNA Helicase unwinds the double helix and Single-Stranded Binding Proteins (SSBs) stabilize template strands.',
        function: 'Provides unwound single-stranded templates for leading strand and lagging strand synthesis.',
        clinicalOrExamTip: 'Topoisomerases (e.g. DNA Gyrase in bacteria, Topo I & II in eukaryotes) relieve upstream supercoiling strain.',
        color: '#f59e0b',
        x: 74,
        y: 32
      },
      {
        id: 'dna_polymerase',
        name: 'DNA Polymerase III & Okazaki Fragments',
        description: 'Primary catalytic enzyme that synthesizes new DNA strictly in the 5’ → 3’ direction using an RNA primer.',
        function: 'Synthesizes continuous leading strand and discontinuous Okazaki fragments on the lagging strand with 3’ → 5’ proofreading exonuclease activity.',
        clinicalOrExamTip: 'Telomerase is a reverse transcriptase that extends chromosomal ends (TTAGGG repeats) in stem and cancer cells.',
        color: '#ef4444',
        x: 76,
        y: 68
      }
    ],
    examHighYield: [
      'DNA replication is semi-conservative (Meselson-Stahl experiment) and bi-directional from origins of replication.',
      'Leading strand is synthesized continuously 5’ to 3’ toward replication fork; Lagging strand is synthesized discontinuously 5’ to 3’ away from fork as Okazaki fragments.',
      'DNA Polymerase requires a free 3’-OH group supplied by RNA Primase to initiate synthesis.'
    ],
    relatedQuestions: [
      'Why can DNA Polymerase only synthesize new strands in the 5’ to 3’ direction, and how does this create Okazaki fragments?',
      'How does G-C content affect the thermodynamic melting temperature of a DNA duplex?',
      'What are the distinct functions of DNA Topoisomerase I, Helicase, and Primase at the replication fork?'
    ]
  },
  {
    key: 'lungs_respiratory',
    title: 'Respiratory Bronchial Tree & Alveolar Cross-Section',
    category: 'Pulmonary Anatomy & Physiology',
    subtitle: 'Cross-Section: Bronchial Generations & Alveolar Air Sacs',
    description: 'The pulmonary apparatus facilitating oxygen uptake and carbon dioxide elimination. Ambient air travels through branching airway generations to reach ~300 million microscopic alveoli with a total surface area of ~70 square meters.',
    svgType: 'lungs',
    imageUrl: lungsImg,
    photoCaption: 'Detailed cross-sectional medical diagram of the human tracheobronchial tree branching down into cutaway microscopic alveoli clusters and capillaries.',
    hotspots: [
      {
        id: 'trachea_bronchi',
        name: 'Trachea & Mainstem Bronchi',
        description: 'Cartilaginous airway lined by pseudostratified ciliated columnar epithelium with mucus-secreting goblet cells.',
        function: 'Conducts, warms, and humidifies inspired air; mucociliary escalator sweeps trapped particulate debris toward the pharynx.',
        clinicalOrExamTip: 'Aspirated foreign bodies lodge preferentially into the right mainstem bronchus because it is wider, shorter, and more vertical.',
        color: '#3b82f6',
        x: 48,
        y: 22
      },
      {
        id: 'bronchioles',
        name: 'Lobar & Segmental Bronchioles',
        description: 'Airways branching deeply into pulmonary lobes, lined with smooth muscle and Club (Clara) cells.',
        function: 'Regulates airway resistance via autonomic bronchoconstriction (parasympathetic M3) and bronchodilation (sympathetic Beta-2).',
        clinicalOrExamTip: 'Asthma is reversible bronchoconstriction and airway hyperreactivity; Beta-2 agonists (Albuterol) cause relaxation.',
        color: '#8b5cf6',
        x: 32,
        y: 52
      },
      {
        id: 'alveoli_pneumocytes',
        name: 'Cutaway Alveoli & Capillary Network',
        description: 'Microscopic air sacs surrounded by dense pulmonary capillary mesh for gas exchange.',
        function: 'Type I pneumocytes facilitate rapid gas diffusion; Type II pneumocytes synthesize Surfactant (dipalmitoylphosphatidylcholine).',
        clinicalOrExamTip: 'Neonatal Respiratory Distress Syndrome (NRDS) occurs in premature infants due to lack of pulmonary surfactant.',
        color: '#ef4444',
        x: 74,
        y: 62
      }
    ],
    examHighYield: [
      'Gas diffusion is governed by Fick’s Law: Diffusion Rate is proportional to [Surface Area × Partial Pressure Gradient × Solubility] / Membrane Thickness.',
      'Hemoglobin-Oxygen Dissociation Curve shifts RIGHT (unloading O2 to tissues) with: Increased [H+] (low pH), Increased PCO2, Increased Temperature, Increased 2,3-BPG (CADET face right).',
      'Normal Ventilation/Perfusion (V/Q) ratio is ~0.8; apex of lung has high V/Q (~3.0), base of lung has low V/Q (~0.6).'
    ],
    relatedQuestions: [
      'Why is pulmonary surfactant essential for preventing alveolar collapse according to the Law of Laplace?',
      'What physiological factors cause a rightward shift of the hemoglobin-oxygen dissociation curve?',
      'How does the anatomic structure of the right mainstem bronchus make it more susceptible to foreign body aspiration?'
    ]
  },
  {
    key: 'muscle_sarcomere',
    title: 'Skeletal Muscle Sarcomere Ultrastructure',
    category: 'Musculoskeletal Physiology',
    subtitle: 'Microscopic Cross-Section: Z-Discs, Actin & Myosin Filaments',
    description: 'The fundamental contractile unit of striated skeletal muscle spanning from Z-disc to Z-disc. Muscle contraction occurs as thick myosin heads bind thin actin filaments and pull them toward the center M-line upon calcium release from the sarcoplasmic reticulum.',
    svgType: 'muscle',
    imageUrl: sarcomereImg,
    photoCaption: 'High-detail microscopic cross-section diagram of the sarcomere revealing thick myosin filaments, thin actin filaments, Z-discs, and cross-bridges.',
    hotspots: [
      {
        id: 'z_disc',
        name: 'Z-Disc & Sarcomere Boundaries',
        description: 'Dense protein plate (alpha-actinin) anchoring the plus ends of thin actin filaments; defines the functional sarcomere length (~2.5 um).',
        function: 'Transmits contractile tension from myofibril to myofibril across the muscle fiber.',
        clinicalOrExamTip: 'Titin is the largest known human protein, anchoring thick myosin filaments to the Z-disc and providing passive elasticity.',
        color: '#3b82f6',
        x: 18,
        y: 50
      },
      {
        id: 'actin_thin',
        name: 'Actin Thin Filaments & Troponin Complex',
        description: 'Helical F-actin polymer associated with regulatory Tropomyosin ribbons and Troponin complexes (TnT, TnI, TnC).',
        function: 'When intracellular Ca2+ binds Troponin C, Tropomyosin shifts out of the way, exposing myosin-binding sites on actin.',
        clinicalOrExamTip: 'Cardiac Troponin I and T are gold-standard serum biomarkers for diagnosing acute myocardial infarction (heart attack).',
        color: '#10b981',
        x: 42,
        y: 35
      },
      {
        id: 'myosin_thick',
        name: 'Myosin Thick Filaments & Cross-Bridges',
        description: 'Bipolar polymers of Myosin II with globular heads possessing ATPase activity and actin-binding sites.',
        function: 'ATP hydrolysis cocks the myosin head; Pi release triggers the power stroke (pulling actin inward); fresh ATP binding causes myosin release.',
        clinicalOrExamTip: 'Rigor mortis occurs after death because ATP depletion prevents myosin heads from detaching from actin filaments.',
        color: '#ef4444',
        x: 58,
        y: 62
      }
    ],
    examHighYield: [
      'Cross-Bridge Cycling sequence: 1. ATP binds myosin head → Myosin detaches from actin. 2. ATP hydrolyzes to ADP + Pi → Myosin cocks into high-energy state. 3. Myosin binds actin. 4. Pi is released → Power Stroke pulls actin toward M-line. 5. ADP is released.',
      'During sarcomere contraction: A-band (myosin length) remains CONSTANT; I-band (actin only) and H-zone (myosin only) SHORTEN; distance between Z-discs DECREASES.',
      'Excitation-Contraction Coupling: Action potential travels down T-tubules → activates DHP L-type Ca2+ receptors → triggers Ryanodine receptors (RyR1) on Sarcoplasmic Reticulum to release Ca2+.'
    ],
    relatedQuestions: [
      'Describe the molecular steps of the cross-bridge cycle and explain why ATP binding is required for muscle relaxation.',
      'During skeletal muscle contraction, which bands in the sarcomere shorten and which band remains constant in length?',
      'How does calcium release from the sarcoplasmic reticulum trigger actin-myosin interaction via Troponin C?'
    ]
  }
];
