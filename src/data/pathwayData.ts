import { BioPathway } from '../types';

export const BIO_PATHWAYS: BioPathway[] = [
  {
    id: 'glycolysis',
    title: 'Glycolysis (Embden-Meyerhof-Parnas Pathway)',
    category: 'Biochemistry',
    overview: 'The universal 10-step anaerobic cytosolic pathway that breaks down one 6-carbon Glucose molecule into two 3-carbon Pyruvate molecules, generating a net yield of 2 ATP and 2 NADH.',
    cellularLocation: 'Cytosol (Cytoplasm)',
    netEquation: 'Glucose + 2 NAD⁺ + 2 ADP + 2 Pi → 2 Pyruvate + 2 NADH + 2 H⁺ + 2 ATP + 2 H₂O',
    rateLimitingStep: 'Phosphofructokinase-1 (PFK-1): Fructose-6-P + ATP → Fructose-1,6-bisphosphate + ADP. Inhibited by ATP and Citrate; activated by AMP and Fructose-2,6-bisphosphate.',
    steps: [
      {
        stepNumber: 1,
        title: 'Glucose Phosphorylation (Trapping)',
        description: 'Hexokinase (all tissues) or Glucokinase (liver/pancreatic beta cells) transfers a phosphate from ATP to Glucose, creating Glucose-6-Phosphate (G6P) which cannot exit through GLUT transporters.',
        reactants: ['Glucose', 'ATP'],
        products: ['Glucose-6-Phosphate', 'ADP'],
        enzyme: 'Hexokinase / Glucokinase',
        energyChange: '-1 ATP',
        clinicalNote: 'Glucokinase has high Km (low affinity) and high Vmax, acting as a pancreatic glucose sensor.'
      },
      {
        stepNumber: 2,
        title: 'Isomerization to Fructose-6-P',
        description: 'Phosphoglucose isomerase converts aldose G6P into ketose Fructose-6-Phosphate (F6P).',
        reactants: ['Glucose-6-Phosphate'],
        products: ['Fructose-6-Phosphate'],
        enzyme: 'Phosphoglucose Isomerase',
        energyChange: '0'
      },
      {
        stepNumber: 3,
        title: 'Committed Step (PFK-1 Reaction)',
        description: 'Phosphofructokinase-1 phosphorylates F6P to Fructose-1,6-bisphosphate (F1,6BP). This is the key irreversible rate-limiting regulatory valve of glycolysis.',
        reactants: ['Fructose-6-Phosphate', 'ATP'],
        products: ['Fructose-1,6-bisphosphate', 'ADP'],
        enzyme: 'Phosphofructokinase-1 (PFK-1)',
        energyChange: '-1 ATP',
        clinicalNote: 'Insulin stimulates PFK-2 to make F2,6BP, which powerfully stimulates PFK-1 to drive glycolysis.'
      },
      {
        stepNumber: 4,
        title: 'Cleavage into Triose Phosphates',
        description: 'Aldolase splits the 6-carbon F1,6BP into two 3-carbon isomers: Dihydroxyacetone phosphate (DHAP) and Glyceraldehyde-3-phosphate (G3P).',
        reactants: ['Fructose-1,6-bisphosphate'],
        products: ['DHAP', 'G3P'],
        enzyme: 'Aldolase',
        energyChange: '0'
      },
      {
        stepNumber: 5,
        title: 'Triose Isomerization (Payoff Phase Start)',
        description: 'Triose phosphate isomerase (TPI) interconverts DHAP into G3P so both halves of glucose continue through the payoff phase (multiply all subsequent yields by 2).',
        reactants: ['DHAP'],
        products: ['Glyceraldehyde-3-phosphate (G3P)'],
        enzyme: 'Triose Phosphate Isomerase',
        energyChange: '0'
      },
      {
        stepNumber: 6,
        title: 'Oxidation & Phosphorylation (NADH Gen)',
        description: 'G3P dehydrogenase oxidizes G3P and adds inorganic phosphate (Pi) to produce 1,3-bisphosphoglycerate (1,3-BPG) and high-energy NADH.',
        reactants: ['2 G3P', '2 NAD⁺', '2 Pi'],
        products: ['2 (1,3-BPG)', '2 NADH', '2 H⁺'],
        enzyme: 'Glyceraldehyde-3-Phosphate Dehydrogenase',
        energyChange: '+2 NADH',
        clinicalNote: 'Arsenic competes with Pi in this step, resulting in zero net ATP production from glycolysis.'
      },
      {
        stepNumber: 7,
        title: 'Substrate-Level Phosphorylation #1',
        description: 'Phosphoglycerate kinase transfers a high-energy phosphate from 1,3-BPG to ADP, generating ATP and 3-Phosphoglycerate.',
        reactants: ['2 (1,3-BPG)', '2 ADP'],
        products: ['2 (3-Phosphoglycerate)', '2 ATP'],
        enzyme: 'Phosphoglycerate Kinase',
        energyChange: '+2 ATP'
      },
      {
        stepNumber: 8,
        title: 'Phosphate Shift to Carbon 2',
        description: 'Phosphoglycerate mutase moves the phosphate group from C-3 to C-2, creating 2-Phosphoglycerate.',
        reactants: ['2 (3-Phosphoglycerate)'],
        products: ['2 (2-Phosphoglycerate)'],
        enzyme: 'Phosphoglycerate Mutase',
        energyChange: '0'
      },
      {
        stepNumber: 9,
        title: 'Dehydration into High-Energy Enol',
        description: 'Enolase removes a molecule of water to create Phosphoenolpyruvate (PEP), which has an extremely high phosphate-group transfer potential.',
        reactants: ['2 (2-Phosphoglycerate)'],
        products: ['2 Phosphoenolpyruvate (PEP)', '2 H₂O'],
        enzyme: 'Enolase',
        energyChange: '0',
        clinicalNote: 'Fluoride inhibits enolase; fluoride tubes are used in blood draws to prevent RBC glycolysis before testing glucose.'
      },
      {
        stepNumber: 10,
        title: 'Substrate-Level Phosphorylation #2 (Pyruvate)',
        description: 'Pyruvate kinase irreversibly transfers the phosphate from PEP to ADP, generating ATP and the final product Pyruvate.',
        reactants: ['2 PEP', '2 ADP'],
        products: ['2 Pyruvate', '2 ATP'],
        enzyme: 'Pyruvate Kinase',
        energyChange: '+2 ATP',
        clinicalNote: 'Pyruvate kinase deficiency is the 2nd most common cause of hereditary hemolytic anemia (after G6PD deficiency).'
      }
    ]
  },
  {
    id: 'krebs_cycle',
    title: 'Citric Acid (Krebs / TCA) Cycle',
    category: 'Biochemistry',
    overview: 'The central hub of aerobic cellular metabolism. Acetyl-CoA is completely oxidized into 2 CO₂, generating high-energy electron carriers (3 NADH, 1 FADH₂) and 1 GTP/ATP per turn.',
    cellularLocation: 'Mitochondrial Matrix',
    netEquation: 'Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pi + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + CoA-SH + 3 H⁺',
    rateLimitingStep: 'Isocitrate Dehydrogenase: Isocitrate + NAD⁺ → alpha-Ketoglutarate + CO₂ + NADH. Inhibited by high ATP and NADH; activated by ADP and Ca²⁺.',
    steps: [
      {
        stepNumber: 1,
        title: 'Citrate Synthesis (Condensation)',
        description: 'Citrate synthase condenses 2-carbon Acetyl-CoA with 4-carbon Oxaloacetate (OAA) to produce 6-carbon Citrate.',
        reactants: ['Acetyl-CoA', 'Oxaloacetate', 'H₂O'],
        products: ['Citrate', 'CoA-SH'],
        enzyme: 'Citrate Synthase',
        energyChange: '0',
        clinicalNote: 'Citrate can exit to cytosol for fatty acid and cholesterol synthesis.'
      },
      {
        stepNumber: 2,
        title: 'Isomerization to Isocitrate',
        description: 'Aconitase isomerizes Citrate to Isocitrate via a cis-aconitate intermediate.',
        reactants: ['Citrate'],
        products: ['Isocitrate'],
        enzyme: 'Aconitase',
        energyChange: '0'
      },
      {
        stepNumber: 3,
        title: 'Oxidative Decarboxylation #1 (Rate Limiting)',
        description: 'Isocitrate dehydrogenase oxidizes and decarboxylates Isocitrate into 5-carbon alpha-Ketoglutarate, yielding the first CO₂ and NADH.',
        reactants: ['Isocitrate', 'NAD⁺'],
        products: ['alpha-Ketoglutarate', 'CO₂', 'NADH'],
        enzyme: 'Isocitrate Dehydrogenase',
        energyChange: '+1 NADH'
      },
      {
        stepNumber: 4,
        title: 'Oxidative Decarboxylation #2 (NADH & Succinyl-CoA)',
        description: 'alpha-Ketoglutarate dehydrogenase complex (requires Thiamine B1, Lipoic acid, CoA B5, FAD B2, NAD B3) produces Succinyl-CoA, CO₂, and NADH.',
        reactants: ['alpha-Ketoglutarate', 'NAD⁺', 'CoA-SH'],
        products: ['Succinyl-CoA', 'CO₂', 'NADH'],
        enzyme: 'alpha-Ketoglutarate Dehydrogenase',
        energyChange: '+1 NADH',
        clinicalNote: 'Requires the same 5 cofactors as Pyruvate Dehydrogenase: TLCFN (Thiamine, Lipoate, Coenzyme A, FAD, NAD).'
      },
      {
        stepNumber: 5,
        title: 'Substrate-Level Phosphorylation (GTP)',
        description: 'Succinyl-CoA synthetase (succinate thiokinase) hydrolyzes the thioester bond to yield Succinate and 1 GTP (equivalent to 1 ATP).',
        reactants: ['Succinyl-CoA', 'GDP', 'Pi'],
        products: ['Succinate', 'GTP', 'CoA-SH'],
        enzyme: 'Succinyl-CoA Synthetase',
        energyChange: '+1 GTP (ATP)'
      },
      {
        stepNumber: 6,
        title: 'Succinate Oxidation (FADH₂ & Complex II)',
        description: 'Succinate dehydrogenase (embedded in the inner mitochondrial membrane as Complex II of ETC) oxidizes Succinate to Fumarate, transferring electrons to FAD.',
        reactants: ['Succinate', 'FAD'],
        products: ['Fumarate', 'FADH₂'],
        enzyme: 'Succinate Dehydrogenase (Complex II)',
        energyChange: '+1 FADH₂'
      },
      {
        stepNumber: 7,
        title: 'Hydration of Fumarate',
        description: 'Fumarase hydrates Fumarate across its double bond to form L-Malate.',
        reactants: ['Fumarate', 'H₂O'],
        products: ['L-Malate'],
        enzyme: 'Fumarase',
        energyChange: '0'
      },
      {
        stepNumber: 8,
        title: 'Regeneration of Oxaloacetate (OAA)',
        description: 'Malate dehydrogenase oxidizes L-Malate back to Oxaloacetate, yielding the 3rd NADH and completing the cycle.',
        reactants: ['L-Malate', 'NAD⁺'],
        products: ['Oxaloacetate', 'NADH'],
        enzyme: 'Malate Dehydrogenase',
        energyChange: '+1 NADH'
      }
    ]
  },
  {
    id: 'action_potential',
    title: 'Neuronal Action Potential & Ion Dynamics',
    category: 'Neurobiology',
    overview: 'The rapid, all-or-none electrical impulse that propagates along neuronal and muscle membranes to transmit information, driven by voltage-gated Na⁺ and K⁺ channels.',
    cellularLocation: 'Neuronal Axon & Axolemma',
    netEquation: 'Resting (-70 mV) → Threshold (-55 mV) → Depolarization (+30 mV) → Repolarization → Hyperpolarization (-85 mV) → Resting (-70 mV)',
    rateLimitingStep: 'Reaching Threshold Voltage (-55 mV) at the Axon Hillock opens voltage-gated Na⁺ activation gates in a positive feedback loop (Hodgkin cycle).',
    steps: [
      {
        stepNumber: 1,
        title: 'Resting Membrane Potential (-70 mV)',
        description: 'Maintained primarily by non-gated K⁺ leak channels (high intracellular K⁺) and the electrogenic Na⁺/K⁺ ATPase pump (3 Na⁺ pumped OUT, 2 K⁺ pumped IN per ATP hydrolyzed).',
        reactants: ['Intracellular K⁺ high', 'Extracellular Na⁺ high'],
        products: ['Polarized state at -70 mV'],
        enzyme: 'Na⁺/K⁺ ATPase',
        energyChange: '-1 ATP per 3 Na⁺ / 2 K⁺'
      },
      {
        stepNumber: 2,
        title: 'Depolarizing Stimulus to Threshold (-55 mV)',
        description: 'Excitatory postsynaptic potentials (EPSPs via Glutamate AMPA receptors) summate at the axon hillock. If voltage reaches -55 mV, all-or-none firing triggers.',
        reactants: ['Inward positive local current'],
        products: ['Threshold reach (-55 mV)'],
        enzyme: 'Ligand-gated ion channels'
      },
      {
        stepNumber: 3,
        title: 'Rapid Upstroke / Depolarization (+30 mV)',
        description: 'Voltage-gated Na⁺ channels open rapidly. Massive influx of Na⁺ down its electrochemical gradient drives the membrane potential from -55 mV up to +30 mV.',
        reactants: ['Extracellular Na⁺'],
        products: ['Intracellular Na⁺ influx'],
        enzyme: 'Voltage-gated Na⁺ Channels (m-gates open)',
        clinicalNote: 'Tetrodotoxin (Pufferfish) and Local Anesthetics (Lidocaine) block voltage-gated Na⁺ channels, preventing depolarization.'
      },
      {
        stepNumber: 4,
        title: 'Inactivation of Na⁺ & Repolarization Downstroke',
        description: 'At +30 mV, Na⁺ channel inactivation h-gates close (Absolute Refractory Period). Voltage-gated delayed-rectifier K⁺ channels open, causing rapid K⁺ efflux.',
        reactants: ['Intracellular K⁺'],
        products: ['Extracellular K⁺ efflux'],
        enzyme: 'Voltage-gated K⁺ Channels'
      },
      {
        stepNumber: 5,
        title: 'Hyperpolarization & Relative Refractory Period',
        description: 'K⁺ channels remain open slightly too long, bringing potential near the K⁺ equilibrium potential (-85 to -90 mV). A stronger-than-normal stimulus is required to fire another action potential.',
        reactants: ['Continued K⁺ efflux'],
        products: ['Membrane at -85 mV'],
        enzyme: 'Delayed Rectifier K⁺ Channels'
      },
      {
        stepNumber: 6,
        title: 'Return to Baseline Resting Potential',
        description: 'Voltage-gated K⁺ channels close. Na⁺/K⁺ ATPase pumps and K⁺ leak channels restore resting ionic concentrations and -70 mV potential.',
        reactants: ['Ionic gradients'],
        products: ['Resting state (-70 mV)'],
        enzyme: 'Na⁺/K⁺ ATPase & K⁺ leak channels'
      }
    ]
  },
  {
    id: 'raas_system',
    title: 'Renin-Angiotensin-Aldosterone System (RAAS)',
    category: 'Physiology',
    overview: 'The primary endocrine cascade regulating arterial blood pressure, renal sodium retention, extracellular fluid volume, and systemic vascular resistance.',
    cellularLocation: 'Kidneys (Juxtaglomerular apparatus), Liver, Pulmonary Capillary Endothelium, Adrenal Cortex',
    netEquation: 'Low BP → Renin (Kidney) + Angiotensinogen (Liver) → Angiotensin I → ACE (Lungs) → Angiotensin II → Aldosterone + Vasoconstriction → Increased BP & ECF Volume',
    rateLimitingStep: 'Renin secretion by renal Juxtaglomerular (JG) cells in response to low renal perfusion pressure, low NaCl at macula densa, or sympathetic Beta-1 stimulation.',
    steps: [
      {
        stepNumber: 1,
        title: 'Renin Secretion by Juxtaglomerular Cells',
        description: 'JG cells in the afferent arteriole sense decreased stretch (hypotension) and secrete the aspartyl protease enzyme Renin into circulation.',
        reactants: ['Renal hypoperfusion / Sympathetic Beta-1'],
        products: ['Active circulating Renin'],
        enzyme: 'Renin',
        clinicalNote: 'Aliskiren is a direct renin inhibitor used in hypertension.'
      },
      {
        stepNumber: 2,
        title: 'Cleavage of Angiotensinogen to Angiotensin I',
        description: 'Renin cleaves circulating Angiotensinogen (synthesized by the liver) to produce the decapeptide Angiotensin I.',
        reactants: ['Angiotensinogen (Liver)', 'Renin'],
        products: ['Angiotensin I (10 amino acids)'],
        enzyme: 'Renin'
      },
      {
        stepNumber: 3,
        title: 'Conversion to Angiotensin II by ACE',
        description: 'Angiotensin Converting Enzyme (ACE), located primarily on the luminal surface of pulmonary vascular endothelial cells, cleaves 2 amino acids from Ang I to make Ang II.',
        reactants: ['Angiotensin I'],
        products: ['Angiotensin II (8 amino acids)'],
        enzyme: 'Angiotensin Converting Enzyme (ACE)',
        clinicalNote: 'ACE inhibitors (e.g. Lisinopril) also prevent Bradykinin breakdown, frequently causing a dry cough or angioedema.'
      },
      {
        stepNumber: 4,
        title: 'Angiotensin II Actions (Potent Vasoconstriction)',
        description: 'Ang II binds AT1 Gq-protein coupled receptors, causing arteriolar vasoconstriction (preferentially efferent arteriole to preserve GFR) and thirst stimulation.',
        reactants: ['Angiotensin II', 'AT1 Receptors'],
        products: ['Arteriolar vasoconstriction', 'Increased TPR & BP'],
        enzyme: 'Gq → PLC → IP3/DAG → Ca²⁺',
        clinicalNote: 'ARBs (e.g. Losartan) block AT1 receptors without causing bradykinin accumulation.'
      },
      {
        stepNumber: 5,
        title: 'Aldosterone Release from Adrenal Cortex',
        description: 'Ang II acts on the Zona Glomerulosa of the adrenal cortex to stimulate synthesis and secretion of the mineralocorticoid hormone Aldosterone.',
        reactants: ['Angiotensin II', 'Cholesterol'],
        products: ['Aldosterone (Mineralocorticoid)'],
        enzyme: 'Aldosterone Synthase'
      },
      {
        stepNumber: 6,
        title: 'Renal Na⁺ Reabsorption & K⁺/H⁺ Excretion',
        description: 'Aldosterone upregulates ENaC channels and Na⁺/K⁺ ATPase in collecting duct Principal cells, reabsorbing Na⁺ and H₂O while excreting K⁺ and H⁺ into urine.',
        reactants: ['Collecting Duct Principal Cells'],
        products: ['Expanded ECF volume', 'K⁺ & H⁺ excretion'],
        enzyme: 'ENaC channels & Na⁺/K⁺ ATPase',
        clinicalNote: 'Spironolactone and Eplerenone are potassium-sparing aldosterone receptor antagonists.'
      }
    ]
  }
];
