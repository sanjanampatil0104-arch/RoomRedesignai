import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Sparkles, RefreshCw, SlidersHorizontal, Eye, Columns } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage: string;
  redesignedImage: string;
  originalLabel?: string;
  redesignedLabel?: string;
  styleName?: string;
  onGenerateAlternative?: () => void;
  onModifySettings?: () => void;
  isGenerating?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalImage,
  redesignedImage,
  originalLabel = 'Original Room',
  redesignedLabel = 'AI Redesigned',
  styleName,
  onGenerateAlternative,
  onModifySettings,
  isGenerating = false,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'after-only' | 'before-only'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle position calculation
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Actual high-res download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = redesignedImage;
    const safeStyle = (styleName || 'room').toLowerCase().replace(/\s+/g, '-');
    link.download = `roomredesign-${safeStyle}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top View Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E8E1D5] shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F1EB] rounded-xl text-xs font-medium text-[#4B514A]">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'slider'
                ? 'bg-white text-[#1C1E1B] shadow-xs font-semibold'
                : 'hover:text-[#1C1E1B]'
            }`}
          >
            Split Slider
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'side-by-side'
                ? 'bg-white text-[#1C1E1B] shadow-xs font-semibold'
                : 'hover:text-[#1C1E1B]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('after-only')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'after-only'
                ? 'bg-white text-[#1C1E1B] shadow-xs font-semibold'
                : 'hover:text-[#1C1E1B]'
            }`}
          >
            Redesign Only
          </button>
          <button
            onClick={() => setViewMode('before-only')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'before-only'
                ? 'bg-white text-[#1C1E1B] shadow-xs font-semibold'
                : 'hover:text-[#1C1E1B]'
            }`}
          >
            Original
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {onGenerateAlternative && (
            <button
              onClick={onGenerateAlternative}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#D5CABE] bg-[#FAF8F5] text-xs font-medium text-[#2C302B] hover:bg-[#F2EDE4] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              title="Generate alternative variation of this room with the same parameters"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#3D5A45] ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Generate Another Design</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#3D5A45] text-white text-xs font-medium hover:bg-[#324B39] shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Redesigned Image</span>
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#1C1E1B] border border-[#E8E1D5] shadow-lg">
        {/* VIEW MODE: SLIDER */}
        {viewMode === 'slider' && (
          <div
            ref={containerRef}
            className="relative w-full aspect-4/3 sm:aspect-16/10 select-none cursor-ew-resize overflow-hidden"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
          >
            {/* Background Image: Redesigned (Right / After) */}
            <img
              src={redesignedImage}
              alt={redesignedLabel}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Foreground Clipped Image: Original (Left / Before) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalImage}
                alt={originalLabel}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
                }}
              />
            </div>

            {/* Vertical Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Draggable Circle Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#1C1E1B] flex items-center justify-center shadow-xl border-2 border-[#3D5A45] pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-105 transition-transform">
                <div className="flex items-center gap-1 text-[11px] font-bold tracking-tighter">
                  <span>◀</span>
                  <span>▶</span>
                </div>
              </div>
            </div>

            {/* Floating Tags */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                {originalLabel}
              </span>
            </div>
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-[#3D5A45]/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase border border-white/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E8EFE9]" />
                {redesignedLabel}
              </span>
            </div>

            {/* Subtle Helper Hint at bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white/80 text-[10px] tracking-wide">
              Drag slider left or right to compare
            </div>
          </div>
        )}

        {/* VIEW MODE: SIDE-BY-SIDE */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2 bg-[#232622]">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden group">
              <img src={originalImage} alt={originalLabel} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold uppercase">
                  {originalLabel}
                </span>
              </div>
            </div>
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden group">
              <img src={redesignedImage} alt={redesignedLabel} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-[#3D5A45]/90 backdrop-blur-md text-white text-[11px] font-semibold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E8EFE9]" />
                  {redesignedLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE: AFTER ONLY */}
        {viewMode === 'after-only' && (
          <div className="relative w-full aspect-4/3 sm:aspect-16/10">
            <img src={redesignedImage} alt={redesignedLabel} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-[#3D5A45]/90 backdrop-blur-md text-white text-xs font-semibold uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E8EFE9]" />
                {redesignedLabel}
              </span>
            </div>
          </div>
        )}

        {/* VIEW MODE: BEFORE ONLY */}
        {viewMode === 'before-only' && (
          <div className="relative w-full aspect-4/3 sm:aspect-16/10">
            <img src={originalImage} alt={originalLabel} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold uppercase">
                {originalLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
