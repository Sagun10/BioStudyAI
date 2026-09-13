import React from 'react';
import { AnatomyHotspot, AnatomyModel } from '../types';

interface SvgAnatomyRendererProps {
  model: AnatomyModel;
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspotId: string) => void;
  showFlowAnimation?: boolean;
  quizMode?: boolean;
}

export const SvgAnatomyRenderer: React.FC<SvgAnatomyRendererProps> = ({
  model,
  selectedHotspotId,
  onSelectHotspot,
  showFlowAnimation = true,
  quizMode = false,
}) => {
  const renderSvgContent = () => {
    switch (model.svgType) {
      case 'heart':
        return (
          <g id="heart-anatomy-illustration">
            {/* Background Heart Silhouette Shadow */}
            <path
              d="M 250 120 C 180 50, 80 120, 110 240 C 130 320, 220 420, 250 450 C 280 420, 370 320, 390 240 C 420 120, 320 50, 250 120 Z"
              fill="#1e1b4b"
              opacity="0.4"
            />
            {/* Superior & Inferior Vena Cava */}
            <path
              d="M 120 70 L 120 190 Q 120 230 140 250 L 140 370 L 110 370 L 110 250 Q 90 220 90 190 L 90 70 Z"
              fill="#1d4ed8"
              stroke="#60a5fa"
              strokeWidth="2"
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('right_atrium')}
            />
            {/* Aortic Arch & Branches */}
            <path
              d="M 230 180 C 230 70, 290 50, 320 80 C 340 100, 340 140, 330 200 L 305 200 C 315 150, 315 115, 305 105 C 285 85, 250 100, 250 180 Z"
              fill="#b91c1c"
              stroke="#f87171"
              strokeWidth="2"
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('aorta')}
            />
            {/* Aorta Arch 3 Head/Neck Branches */}
            <path d="M 265 85 L 265 45 L 278 45 L 278 82" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />
            <path d="M 290 78 L 290 40 L 303 40 L 303 82" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />
            <path d="M 315 88 L 325 45 L 338 48 L 328 98" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />

            {/* Pulmonary Trunk & Left/Right Arteries */}
            <path
              d="M 220 200 C 210 130, 270 120, 360 125 L 360 145 C 300 140, 250 150, 245 200 Z"
              fill="#3730a3"
              stroke="#818cf8"
              strokeWidth="2"
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('pulmonary_trunk')}
            />
            <path
              d="M 230 150 C 190 140, 150 145, 120 155 L 120 135 C 160 125, 200 125, 230 140 Z"
              fill="#3730a3"
              stroke="#818cf8"
              strokeWidth="2"
            />

            {/* Right Atrium Chamber */}
            <path
              d="M 120 180 C 110 200, 110 260, 140 290 C 165 290, 180 260, 185 220 C 185 180, 160 170, 120 180 Z"
              fill="#1e3a8a"
              stroke={selectedHotspotId === 'right_atrium' ? '#38bdf8' : '#2563eb'}
              strokeWidth={selectedHotspotId === 'right_atrium' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('right_atrium')}
            />
            {/* Left Atrium Chamber */}
            <path
              d="M 280 180 C 330 170, 360 210, 360 270 C 330 280, 300 270, 290 240 C 285 210, 280 190, 280 180 Z"
              fill="#991b1b"
              stroke={selectedHotspotId === 'left_atrium' ? '#fb7185' : '#ef4444'}
              strokeWidth={selectedHotspotId === 'left_atrium' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('left_atrium')}
            />

            {/* Right Ventricle (Thin Myocardium) */}
            <path
              d="M 140 290 C 145 350, 190 410, 235 430 C 240 370, 230 320, 200 280 C 170 280, 150 285, 140 290 Z"
              fill="#1e40af"
              stroke={selectedHotspotId === 'right_ventricle' ? '#60a5fa' : '#3b82f6'}
              strokeWidth={selectedHotspotId === 'right_ventricle' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('right_ventricle')}
            />

            {/* Interventricular Septum */}
            <path
              d="M 235 430 C 245 370, 245 310, 230 250 L 255 250 C 270 310, 270 380, 255 440 Z"
              fill="#7f1d1d"
              stroke="#b91c1c"
              strokeWidth="2"
            />

            {/* Left Ventricle (Very Thick Myocardium) */}
            <path
              d="M 255 440 C 300 420, 365 350, 355 270 C 320 270, 280 290, 260 340 C 250 380, 250 420, 255 440 Z"
              fill="#881337"
              stroke={selectedHotspotId === 'left_ventricle' ? '#f43f5e' : '#f87171'}
              strokeWidth={selectedHotspotId === 'left_ventricle' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('left_ventricle')}
            />

            {/* Mitral & Tricuspid Valves / Chordae Tendineae */}
            <g opacity="0.9">
              {/* Tricuspid */}
              <line x1="160" y1="280" x2="175" y2="330" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="3 3" />
              <line x1="175" y1="280" x2="185" y2="330" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="3 3" />
              {/* Mitral */}
              <line x1="310" y1="265" x2="300" y2="335" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="3 3" />
              <line x1="325" y1="265" x2="315" y2="335" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="3 3" />
            </g>

            {/* Animated Flow Dots (Oxygenated Red & Deoxygenated Blue) */}
            {showFlowAnimation && (
              <g className="pointer-events-none">
                {/* Venous flow in */}
                <circle cx="120" cy="110" r="4" fill="#93c5fd" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="145" cy="230" r="4" fill="#93c5fd" className="animate-pulse" />
                <circle cx="190" cy="350" r="4" fill="#93c5fd" className="animate-pulse" />
                {/* Arterial flow out */}
                <circle cx="305" cy="360" r="4" fill="#fca5a5" className="animate-pulse" />
                <circle cx="280" cy="140" r="5" fill="#fca5a5" className="animate-ping" style={{ animationDuration: '1.8s' }} />
              </g>
            )}
          </g>
        );

      case 'brain':
        return (
          <g id="brain-anatomy-illustration">
            {/* Frontal Lobe */}
            <path
              d="M 120 220 C 110 140, 180 80, 270 80 C 270 140, 260 210, 200 240 C 150 250, 130 240, 120 220 Z"
              fill="#1e3a8a"
              stroke={selectedHotspotId === 'frontal_lobe' ? '#60a5fa' : '#3b82f6'}
              strokeWidth={selectedHotspotId === 'frontal_lobe' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('frontal_lobe')}
            />
            {/* Parietal Lobe */}
            <path
              d="M 270 80 C 350 80, 400 120, 410 190 C 370 200, 330 190, 290 200 C 275 160, 270 110, 270 80 Z"
              fill="#581c87"
              stroke={selectedHotspotId === 'parietal_lobe' ? '#c084fc' : '#a855f7'}
              strokeWidth={selectedHotspotId === 'parietal_lobe' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('parietal_lobe')}
            />
            {/* Occipital Lobe */}
            <path
              d="M 410 190 C 430 240, 420 280, 380 300 C 370 270, 360 240, 350 220 C 370 200, 395 190, 410 190 Z"
              fill="#831843"
              stroke={selectedHotspotId === 'occipital_lobe' ? '#f472b6' : '#ec4899'}
              strokeWidth={selectedHotspotId === 'occipital_lobe' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('occipital_lobe')}
            />
            {/* Temporal Lobe */}
            <path
              d="M 180 250 C 230 230, 300 240, 340 250 C 330 300, 270 320, 210 310 C 180 300, 170 270, 180 250 Z"
              fill="#78350f"
              stroke={selectedHotspotId === 'temporal_lobe' ? '#fbbf24' : '#f59e0b'}
              strokeWidth={selectedHotspotId === 'temporal_lobe' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('temporal_lobe')}
            />
            {/* Cerebellum */}
            <path
              d="M 330 310 C 380 300, 420 330, 410 390 C 370 420, 320 410, 310 360 C 310 330, 320 315, 330 310 Z"
              fill="#064e3b"
              stroke={selectedHotspotId === 'cerebellum' ? '#34d399' : '#10b981'}
              strokeWidth={selectedHotspotId === 'cerebellum' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('cerebellum')}
            />
            {/* Cerebellar Foliation Stripes */}
            <path d="M 335 340 Q 370 330 395 355" stroke="#34d399" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M 330 365 Q 365 360 390 385" stroke="#34d399" strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* Brainstem (Pons & Medulla) */}
            <path
              d="M 250 310 C 275 320, 280 340, 280 370 C 275 420, 260 450, 250 470 L 230 470 C 235 440, 240 400, 235 360 C 230 330, 240 315, 250 310 Z"
              fill="#164e63"
              stroke={selectedHotspotId === 'brainstem' ? '#22d3ee' : '#06b6d4'}
              strokeWidth={selectedHotspotId === 'brainstem' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('brainstem')}
            />

            {/* Cerebral Gyri & Sulci detail lines */}
            <g stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.35" className="pointer-events-none">
              <path d="M 160 150 Q 200 130 240 160 Q 260 130 290 140" />
              <path d="M 140 190 Q 180 180 220 200 Q 240 180 270 180" />
              <path d="M 290 110 Q 320 140 360 120" />
              <path d="M 310 160 Q 350 170 380 150" />
              <path d="M 210 275 Q 260 270 300 280" />
            </g>
          </g>
        );

      case 'cell':
        return (
          <g id="eukaryotic-cell-illustration">
            {/* Plasma Membrane & Cytosol Base */}
            <ellipse
              cx="250"
              cy="250"
              rx="200"
              ry="160"
              fill="#064e3b"
              fillOpacity="0.25"
              stroke="#10b981"
              strokeWidth="4"
              className="transition-all"
            />
            {/* Cytoskeleton Microtubules */}
            <path d="M 90 200 Q 180 290 320 240 Q 400 280 430 200" stroke="#047857" strokeWidth="2" fill="none" opacity="0.4" />
            <path d="M 110 320 Q 240 360 380 300" stroke="#047857" strokeWidth="2" fill="none" opacity="0.4" />

            {/* Nucleus Double Membrane */}
            <circle
              cx="220"
              cy="240"
              r="65"
              fill="#312e81"
              stroke={selectedHotspotId === 'nucleus' ? '#a5b4fc' : '#6366f1'}
              strokeWidth={selectedHotspotId === 'nucleus' ? '4' : '2'}
              className="transition-all hover:brightness-125 cursor-pointer"
              onClick={() => onSelectHotspot('nucleus')}
            />
            {/* Nucleolus */}
            <circle
              cx="210"
              cy="230"
              r="24"
              fill="#4338ca"
              stroke="#818cf8"
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('nucleus')}
            />
            {/* Chromatin Threads */}
            <path d="M 180 245 Q 195 260 220 250 Q 240 260 260 240" stroke="#a5b4fc" strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* Rough Endoplasmic Reticulum (Surrounding Nucleus) */}
            <path
              d="M 150 200 C 140 160, 190 140, 240 150 C 270 140, 300 160, 300 190"
              stroke={selectedHotspotId === 'rough_er' ? '#93c5fd' : '#3b82f6'}
              strokeWidth={selectedHotspotId === 'rough_er' ? '6' : '4'}
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('rough_er')}
            />
            <path
              d="M 140 220 C 120 180, 160 130, 260 130 C 310 130, 320 170, 315 210"
              stroke="#2563eb"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Ribosome dots on RER */}
            <circle cx="160" cy="170" r="2.5" fill="#93c5fd" />
            <circle cx="190" cy="150" r="2.5" fill="#93c5fd" />
            <circle cx="230" cy="140" r="2.5" fill="#93c5fd" />
            <circle cx="270" cy="150" r="2.5" fill="#93c5fd" />

            {/* Mitochondria 1 (Right) */}
            <g
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('mitochondria')}
            >
              <ellipse
                cx="370"
                cy="190"
                rx="40"
                ry="22"
                transform="rotate(-25 370 190)"
                fill="#7f1d1d"
                stroke={selectedHotspotId === 'mitochondria' ? '#f87171' : '#ef4444'}
                strokeWidth={selectedHotspotId === 'mitochondria' ? '3' : '2'}
              />
              {/* Inner Cristae Folds */}
              <path
                d="M 345 198 Q 365 180 355 190 Q 375 175 365 188 Q 385 175 390 182"
                stroke="#fca5a5"
                strokeWidth="2"
                fill="none"
              />
            </g>

            {/* Mitochondria 2 (Bottom Left) */}
            <g
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('mitochondria')}
            >
              <ellipse
                cx="140"
                cy="320"
                rx="35"
                ry="20"
                transform="rotate(35 140 320)"
                fill="#7f1d1d"
                stroke="#ef4444"
                strokeWidth="2"
              />
              <path
                d="M 125 310 Q 140 325 135 315 Q 150 330 155 325"
                stroke="#fca5a5"
                strokeWidth="2"
                fill="none"
              />
            </g>

            {/* Golgi Apparatus (Stacked Cisternae) */}
            <g
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('golgi_apparatus')}
            >
              <path
                d="M 280 320 C 310 310, 350 320, 360 340"
                stroke={selectedHotspotId === 'golgi_apparatus' ? '#fde047' : '#f59e0b'}
                strokeWidth={selectedHotspotId === 'golgi_apparatus' ? '6' : '4.5'}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 285 335 C 315 325, 345 335, 355 355"
                stroke="#d97706"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 290 350 C 315 342, 340 350, 350 370"
                stroke="#b45309"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Golgi Secretory Vesicles */}
              <circle cx="375" cy="335" r="5" fill="#fcd34d" />
              <circle cx="365" cy="370" r="4.5" fill="#fcd34d" />
              <circle cx="270" cy="330" r="4" fill="#fcd34d" />
            </g>

            {/* Lysosomes & Peroxisomes */}
            <circle
              cx="110"
              cy="230"
              r="14"
              fill="#065f46"
              stroke={selectedHotspotId === 'lysosome' ? '#6ee7b7' : '#10b981'}
              strokeWidth={selectedHotspotId === 'lysosome' ? '3' : '2'}
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('lysosome')}
            />
            <circle cx="110" cy="230" r="6" fill="#34d399" opacity="0.6" />
          </g>
        );

      case 'nephron':
        return (
          <g id="nephron-renal-illustration">
            {/* Medullary Background Gradient Zone */}
            <rect x="50" y="240" width="400" height="230" fill="#1e1b4b" fillOpacity="0.4" rx="10" />
            <text x="60" y="260" fill="#6366f1" fontSize="11" fontWeight="bold">Renal Medulla (Hypertonic)</text>
            <text x="60" y="100" fill="#10b981" fontSize="11" fontWeight="bold">Renal Cortex (Isotonic)</text>

            {/* Bowman's Capsule Cup */}
            <path
              d="M 120 120 C 100 140, 100 180, 130 200 C 160 210, 180 180, 175 145"
              stroke={selectedHotspotId === 'glomerulus' ? '#f87171' : '#ef4444'}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('glomerulus')}
            />
            {/* Glomerular Capillary Tuft inside cup */}
            <circle
              cx="140"
              cy="160"
              r="18"
              fill="#991b1b"
              stroke="#fca5a5"
              strokeWidth="2"
              className="cursor-pointer hover:scale-110 transition-all"
              onClick={() => onSelectHotspot('glomerulus')}
            />
            {/* Afferent & Efferent Arterioles */}
            <path d="M 90 140 L 125 155" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <path d="M 95 180 L 128 168" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

            {/* Proximal Convoluted Tubule (PCT) */}
            <path
              d="M 130 200 Q 150 230 180 200 Q 210 170 230 210 Q 250 240 230 260"
              stroke={selectedHotspotId === 'proximal_tubule' ? '#fde047' : '#f59e0b'}
              strokeWidth={selectedHotspotId === 'proximal_tubule' ? '7' : '5'}
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('proximal_tubule')}
            />

            {/* Loop of Henle Hairpin (Thin Descending & Thick Ascending) */}
            <path
              d="M 230 260 L 230 420 Q 240 440 250 440 Q 260 440 260 420 L 260 260"
              stroke={selectedHotspotId === 'loop_of_henle' ? '#60a5fa' : '#3b82f6'}
              strokeWidth={selectedHotspotId === 'loop_of_henle' ? '7' : '5'}
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('loop_of_henle')}
            />

            {/* Distal Convoluted Tubule (DCT) */}
            <path
              d="M 260 260 Q 280 180 320 200 Q 350 220 370 190"
              stroke={selectedHotspotId === 'distal_tubule' ? '#c084fc' : '#8b5cf6'}
              strokeWidth={selectedHotspotId === 'distal_tubule' ? '7' : '5'}
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('distal_tubule')}
            />

            {/* Collecting Duct */}
            <path
              d="M 370 140 L 370 460"
              stroke={selectedHotspotId === 'collecting_duct' ? '#34d399' : '#10b981'}
              strokeWidth={selectedHotspotId === 'collecting_duct' ? '9' : '7'}
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('collecting_duct')}
            />
            {/* Collecting Duct tributary branches */}
            <path d="M 340 160 L 370 175" stroke="#10b981" strokeWidth="4" />
            <path d="M 400 220 L 370 235" stroke="#10b981" strokeWidth="4" />

            {/* Dynamic Water & Solute Arrows */}
            {showFlowAnimation && (
              <g className="pointer-events-none text-xs font-bold">
                {/* H2O reabsorption at descending loop */}
                <path d="M 215 320 L 190 320" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                <text x="160" y="325" fill="#38bdf8" fontSize="10">H₂O</text>
                {/* Na+ Cl- pumping at thick ascending */}
                <path d="M 275 340 L 300 340" stroke="#f59e0b" strokeWidth="2" />
                <text x="305" y="345" fill="#f59e0b" fontSize="10">Na⁺/K⁺/2Cl⁻</text>
              </g>
            )}
          </g>
        );

      case 'eye':
        return (
          <g id="human-eye-illustration">
            {/* Sclera & Globe Outline */}
            <circle cx="250" cy="250" r="150" fill="#0f172a" stroke="#475569" strokeWidth="3" />
            
            {/* Cornea (Transparent Anterior Dome) */}
            <path
              d="M 120 180 C 60 210, 60 290, 120 320"
              stroke={selectedHotspotId === 'cornea' ? '#22d3ee' : '#06b6d4'}
              strokeWidth={selectedHotspotId === 'cornea' ? '6' : '4'}
              fill="#06b6d4"
              fillOpacity="0.2"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('cornea')}
            />

            {/* Anterior Chamber Fluid */}
            <path d="M 120 180 Q 90 250 120 320 L 140 310 Q 115 250 140 190 Z" fill="#38bdf8" fillOpacity="0.15" />

            {/* Iris & Pupil */}
            <path d="M 135 180 L 145 220" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
            <path d="M 135 320 L 145 280" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />

            {/* Crystalline Lens */}
            <ellipse
              cx="160"
              cy="250"
              rx="18"
              ry="45"
              fill="#1e3a8a"
              fillOpacity="0.8"
              stroke={selectedHotspotId === 'lens' ? '#60a5fa' : '#3b82f6'}
              strokeWidth={selectedHotspotId === 'lens' ? '4' : '2'}
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('lens')}
            />
            {/* Zonular fibers & Ciliary Body */}
            <line x1="160" y1="205" x2="160" y2="180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />
            <line x1="160" y1="295" x2="160" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />

            {/* Vitreous Chamber */}
            <circle cx="260" cy="250" r="130" fill="#0284c7" fillOpacity="0.08" className="pointer-events-none" />

            {/* Retina (Inner Orange/Pink Layer) */}
            <path
              d="M 140 130 C 260 110, 380 160, 390 250 C 380 340, 260 390, 140 370"
              stroke={selectedHotspotId === 'retina_fovea' ? '#f472b6' : '#ec4899'}
              strokeWidth={selectedHotspotId === 'retina_fovea' ? '6' : '4'}
              fill="none"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('retina_fovea')}
            />
            {/* Fovea Centralis Depression */}
            <circle
              cx="390"
              cy="250"
              r="8"
              fill="#fb7185"
              stroke="#fff"
              strokeWidth="2"
              className="cursor-pointer animate-pulse"
              onClick={() => onSelectHotspot('retina_fovea')}
            />

            {/* Optic Disc & Optic Nerve Trunk */}
            <path
              d="M 375 285 L 450 315 L 440 340 L 365 305 Z"
              fill="#78350f"
              stroke={selectedHotspotId === 'optic_nerve' ? '#fbbf24' : '#f59e0b'}
              strokeWidth="2"
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('optic_nerve')}
            />

            {/* Focused Light Rays passing through cornea/lens onto fovea */}
            {showFlowAnimation && (
              <g className="pointer-events-none opacity-50">
                <line x1="20" y1="180" x2="160" y2="250" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="20" y1="320" x2="160" y2="250" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="160" y1="250" x2="390" y2="250" stroke="#fef08a" strokeWidth="2" />
              </g>
            )}
          </g>
        );

      case 'dna':
        return (
          <g id="dna-helix-illustration">
            {/* Anti-parallel Strand 1 */}
            <path
              d="M 120 80 Q 250 160 380 80 Q 250 240 120 320 Q 250 400 380 480"
              stroke={selectedHotspotId === 'sugar_phosphate' ? '#34d399' : '#10b981'}
              strokeWidth={selectedHotspotId === 'sugar_phosphate' ? '7' : '5'}
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('sugar_phosphate')}
            />
            {/* Anti-parallel Strand 2 */}
            <path
              d="M 380 80 Q 250 160 120 80 Q 250 240 380 320 Q 250 400 120 480"
              stroke={selectedHotspotId === 'sugar_phosphate' ? '#34d399' : '#059669'}
              strokeWidth={selectedHotspotId === 'sugar_phosphate' ? '7' : '5'}
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('sugar_phosphate')}
            />

            {/* Base Pairs (Hydrogen-bonded rungs) */}
            <g
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('base_pairs')}
            >
              {/* Rung 1: A-T (Blue & Red) */}
              <line x1="170" y1="110" x2="250" y2="120" stroke="#3b82f6" strokeWidth="4" />
              <line x1="250" y1="120" x2="330" y2="110" stroke="#ef4444" strokeWidth="4" />
              <circle cx="250" cy="120" r="3" fill="#fff" />

              {/* Rung 2: G-C (Amber & Green) */}
              <line x1="210" y1="170" x2="250" y2="175" stroke="#f59e0b" strokeWidth="4" />
              <line x1="250" y1="175" x2="290" y2="170" stroke="#10b981" strokeWidth="4" />
              <circle cx="250" cy="175" r="3" fill="#fff" />

              {/* Rung 3: T-A */}
              <line x1="210" y1="230" x2="250" y2="235" stroke="#ef4444" strokeWidth="4" />
              <line x1="250" y1="235" x2="290" y2="230" stroke="#3b82f6" strokeWidth="4" />
              <circle cx="250" cy="235" r="3" fill="#fff" />

              {/* Rung 4: C-G */}
              <line x1="170" y1="290" x2="250" y2="300" stroke="#10b981" strokeWidth="4" />
              <line x1="250" y1="300" x2="330" y2="290" stroke="#f59e0b" strokeWidth="4" />
              <circle cx="250" cy="300" r="3" fill="#fff" />

              {/* Rung 5: A-T */}
              <line x1="210" y1="360" x2="250" y2="365" stroke="#3b82f6" strokeWidth="4" />
              <line x1="250" y1="365" x2="290" y2="360" stroke="#ef4444" strokeWidth="4" />
              <circle cx="250" cy="365" r="3" fill="#fff" />
            </g>

            {/* Replication Fork / Helicase icon at top right */}
            <g
              className="cursor-pointer hover:scale-105 transition-all"
              onClick={() => onSelectHotspot('replication_fork')}
            >
              <polygon points="370,160 410,140 410,180" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
              <text x="375" y="200" fill="#f59e0b" fontSize="10" fontWeight="bold">Helicase</text>
            </g>
          </g>
        );

      case 'lungs':
        return (
          <g id="respiratory-system-illustration">
            {/* Trachea with Cartilage C-Rings */}
            <g
              className="cursor-pointer hover:brightness-125"
              onClick={() => onSelectHotspot('trachea_bronchi')}
            >
              <rect x="235" y="60" width="30" height="90" rx="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
              <line x1="235" y1="80" x2="265" y2="80" stroke="#93c5fd" strokeWidth="2" />
              <line x1="235" y1="100" x2="265" y2="100" stroke="#93c5fd" strokeWidth="2" />
              <line x1="235" y1="120" x2="265" y2="120" stroke="#93c5fd" strokeWidth="2" />
            </g>

            {/* Primary Bronchi Bifurcation (Carina) */}
            <path d="M 240 150 L 180 200" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" />
            <path d="M 260 150 L 320 200" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />

            {/* Right Lung Lobes (3 lobes) */}
            <path
              d="M 180 180 C 130 180, 90 230, 90 320 C 90 410, 150 440, 200 430 C 210 370, 210 230, 180 180 Z"
              fill="#065f46"
              fillOpacity="0.4"
              stroke="#10b981"
              strokeWidth="2"
            />

            {/* Left Lung Lobes (2 lobes + Cardiac Notch) */}
            <path
              d="M 320 180 C 370 180, 410 230, 410 320 C 410 410, 350 440, 300 430 C 290 360, 320 330, 300 270 C 290 230, 300 190, 320 180 Z"
              fill="#065f46"
              fillOpacity="0.4"
              stroke="#10b981"
              strokeWidth="2"
            />

            {/* Bronchioles Branching Tree */}
            <g
              stroke="#c084fc"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('bronchioles')}
            >
              <path d="M 180 200 L 140 240 L 115 280" />
              <path d="M 140 240 L 160 290" />
              <path d="M 180 200 L 185 270 L 160 340" />
              <path d="M 320 200 L 360 250 L 385 300" />
              <path d="M 360 250 L 340 310" />
            </g>

            {/* Alveolar Sac Magnification Cluster (Bottom Right) */}
            <g
              className="cursor-pointer hover:scale-105 transition-all"
              onClick={() => onSelectHotspot('alveoli_pneumocytes')}
            >
              <circle cx="360" cy="350" r="14" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
              <circle cx="380" cy="360" r="16" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
              <circle cx="355" cy="375" r="13" fill="#991b1b" stroke="#fca5a5" strokeWidth="2" />
              <circle cx="375" cy="385" r="14" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
              <text x="330" y="415" fill="#f87171" fontSize="10" fontWeight="bold">Alveoli Capillaries</text>
            </g>
          </g>
        );

      case 'muscle':
        return (
          <g id="muscle-sarcomere-illustration">
            {/* Sarcomere Base Boundaries */}
            <rect x="50" y="100" width="400" height="300" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="8" />

            {/* Left Z-Disc */}
            <path
              d="M 90 120 L 105 150 L 90 180 L 105 210 L 90 240 L 105 270 L 90 300 L 105 330 L 90 360 L 105 380"
              stroke={selectedHotspotId === 'z_disc' ? '#60a5fa' : '#3b82f6'}
              strokeWidth={selectedHotspotId === 'z_disc' ? '6' : '4'}
              fill="none"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('z_disc')}
            />
            <text x="75" y="405" fill="#3b82f6" fontSize="10" fontWeight="bold">Z-Disc</text>

            {/* Right Z-Disc */}
            <path
              d="M 410 120 L 395 150 L 410 180 L 395 210 L 410 240 L 395 270 L 410 300 L 395 330 L 410 360 L 395 380"
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('z_disc')}
            />
            <text x="395" y="405" fill="#3b82f6" fontSize="10" fontWeight="bold">Z-Disc</text>

            {/* Actin Thin Filaments (Green) */}
            <g
              stroke={selectedHotspotId === 'actin_thin' ? '#34d399' : '#10b981'}
              strokeWidth="4"
              strokeLinecap="round"
              className="cursor-pointer"
              onClick={() => onSelectHotspot('actin_thin')}
            >
              {/* Left anchored actin */}
              <line x1="100" y1="160" x2="230" y2="160" />
              <line x1="100" y1="220" x2="230" y2="220" />
              <line x1="100" y1="280" x2="230" y2="280" />
              <line x1="100" y1="340" x2="230" y2="340" />

              {/* Right anchored actin */}
              <line x1="400" y1="160" x2="270" y2="160" />
              <line x1="400" y1="220" x2="270" y2="220" />
              <line x1="400" y1="280" x2="270" y2="280" />
              <line x1="400" y1="340" x2="270" y2="340" />
            </g>

            {/* Myosin Thick Filaments with Heads (Red) */}
            <g
              className="cursor-pointer"
              onClick={() => onSelectHotspot('myosin_thick')}
            >
              {/* Central Myosin Rods */}
              <line x1="180" y1="190" x2="320" y2="190" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
              <line x1="180" y1="250" x2="320" y2="250" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
              <line x1="180" y1="310" x2="320" y2="310" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />

              {/* Central M-Line */}
              <line x1="250" y1="140" x2="250" y2="360" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <text x="235" y="130" fill="#f59e0b" fontSize="10" fontWeight="bold">M-Line</text>

              {/* Myosin Globular Heads */}
              <circle cx="200" cy="180" r="4" fill="#fca5a5" />
              <circle cx="220" cy="180" r="4" fill="#fca5a5" />
              <circle cx="280" cy="180" r="4" fill="#fca5a5" />
              <circle cx="300" cy="180" r="4" fill="#fca5a5" />

              <circle cx="200" cy="240" r="4" fill="#fca5a5" />
              <circle cx="220" cy="240" r="4" fill="#fca5a5" />
              <circle cx="280" cy="240" r="4" fill="#fca5a5" />
              <circle cx="300" cy="240" r="4" fill="#fca5a5" />
            </g>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full aspect-square max-w-[540px] mx-auto bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex items-center justify-center p-3 select-none">
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hotspot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Render Anatomical Vector Paths */}
        {renderSvgContent()}

        {/* Hotspot Interactive Pins Layer */}
        {model.hotspots.map((spot, idx) => {
          const isSelected = selectedHotspotId === spot.id;
          const svgX = (spot.x / 100) * 500;
          const svgY = (spot.y / 100) * 500;

          return (
            <g
              key={spot.id}
              transform={`translate(${svgX}, ${svgY})`}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot.id);
              }}
            >
              {/* Outer Pulse Ring */}
              {isSelected && (
                <circle
                  r="22"
                  fill="none"
                  stroke={spot.color}
                  strokeWidth="2.5"
                  className="animate-ping opacity-75"
                />
              )}

              {/* Pin Base Circle */}
              <circle
                r={isSelected ? '14' : '11'}
                fill={spot.color}
                stroke="#ffffff"
                strokeWidth="2"
                className="drop-shadow-lg"
              />

              {/* Pin Number/Index or ? for quiz */}
              <text
                textAnchor="middle"
                dy=".35em"
                fill="#ffffff"
                fontSize={isSelected ? '11' : '10'}
                fontWeight="900"
                fontFamily="sans-serif"
              >
                {quizMode ? '?' : idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
