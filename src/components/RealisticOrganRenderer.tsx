import React, { useState, useRef } from 'react';
import { AnatomyHotspot, AnatomyModel } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';

interface RealisticOrganRendererProps {
  model: AnatomyModel;
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspotId: string) => void;
  quizMode?: boolean;
}

export const RealisticOrganRenderer: React.FC<RealisticOrganRendererProps> = ({
  model,
  selectedHotspotId,
  onSelectHotspot,
  quizMode = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const hoveredSpot = model.hotspots.find((h) => h.id === hoveredHotspotId);
  const selectedSpot = model.hotspots.find((h) => h.id === selectedHotspotId);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 transition-all ${
        isFullscreen 
          ? 'fixed inset-4 z-50 flex flex-col justify-center items-center bg-slate-950/95 backdrop-blur-md shadow-2xl p-6 border-slate-700' 
          : 'aspect-square sm:aspect-[4/3] max-h-[500px]'
      }`}
    >
      {/* Top Floating Overlay Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-bold text-slate-200">
            Anatomical Cross-Section / Cutaway
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1 rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => setShowPins(!showPins)}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              showPins 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
            title="Toggle Anatomical Landmark Pins"
          >
            <Eye className="w-3 h-3" />
            <span>Pins {showPins ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-mono text-slate-300 px-1 font-semibold">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.25}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {zoomLevel > 1 && (
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition border-l border-slate-800 ml-0.5"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Image'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Image Canvas with Zoom & Interactive Landmark Hotspots */}
      <div className="w-full h-full relative overflow-auto flex items-center justify-center cursor-crosshair select-none p-2">
        <div 
          className="relative inline-block transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Actual Organ High-Resolution Image */}
          {model.imageUrl ? (
            <img
              src={model.imageUrl}
              alt={model.title}
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[480px] object-contain rounded-xl shadow-2xl drop-shadow-2xl pointer-events-none"
            />
          ) : (
            <div className="w-96 h-96 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500">
              No Image Available
            </div>
          )}

          {/* Interactive Anatomical Pins Layer */}
          {showPins && (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {model.hotspots.map((spot, idx) => {
                const isSelected = selectedHotspotId === spot.id;
                const isHovered = hoveredHotspotId === spot.id;

                return (
                  <div
                    key={spot.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHotspot(spot.id);
                    }}
                    onMouseEnter={() => setHoveredHotspotId(spot.id)}
                    onMouseLeave={() => setHoveredHotspotId(null)}
                  >
                    {/* Pulsing selection halo */}
                    {isSelected && (
                      <span 
                        className="absolute -inset-2.5 rounded-full animate-ping opacity-75 pointer-events-none"
                        style={{ backgroundColor: spot.color }}
                      ></span>
                    )}

                    {/* Interactive Button Landmark Pin */}
                    <div
                      className={`relative flex items-center justify-center rounded-full shadow-2xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'w-7 h-7 ring-4 ring-white/60 scale-125 z-20'
                          : isHovered
                          ? 'w-6 h-6 ring-2 ring-white/40 scale-110 z-10'
                          : 'w-5 h-5 z-0'
                      }`}
                      style={{
                        backgroundColor: spot.color,
                        borderColor: '#ffffff',
                      }}
                    >
                      <span className="text-[10px] font-black text-white font-mono leading-none drop-shadow">
                        {quizMode ? '?' : idx + 1}
                      </span>
                    </div>

                    {/* Quick Hover Tooltip over the Organ Photo */}
                    {!quizMode && isHovered && !isSelected && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900/95 border border-slate-700 p-2 rounded-xl shadow-2xl z-30 pointer-events-none backdrop-blur-md animate-fadeIn">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: spot.color }}
                          ></span>
                          <p className="text-xs font-bold text-white truncate">{spot.name}</p>
                        </div>
                        <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                          {spot.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Info / Caption Banner */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-xl shadow-lg pointer-events-auto max-w-[85%]">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-300 font-medium line-clamp-1">
              {model.photoCaption || model.subtitle}
            </p>
          </div>
        </div>

        {selectedSpot && !quizMode && (
          <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto hidden sm:flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: selectedSpot.color }}
            ></span>
            <span className="text-xs font-bold text-emerald-200 truncate">
              {selectedSpot.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
