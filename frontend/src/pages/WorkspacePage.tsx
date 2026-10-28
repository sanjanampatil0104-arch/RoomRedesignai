import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Check,
  AlertCircle,
  X,
  Sliders,
  ChevronDown,
  Info,
  Maximize2,
  Share2,
  Download,
  Leaf,
  Layers,
  HelpCircle,
  Sofa,
  Bed,
  Utensils,
  Wine,
  Briefcase,
  Bath,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
  DESIGN_STYLES,
  ROOM_TYPES,
  COLOR_PALETTES,
  SAMPLE_ROOMS
} from '../data/styles';
import type {
  RedesignResponse,
  AlternativeDesign,
  SampleRoom
} from '../types';
import { redesignRoom, urlToFile } from '../api/client';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

const ROOM_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'living-room': Sofa,
  'bedroom': Bed,
  'kitchen': Utensils,
  'dining-room': Wine,
  'home-office': Briefcase,
  'bathroom': Bath,
  'studio-apartment': Home,
  'other': Sparkles,
};

const LOADING_STEPS = [
  "Analyzing room geometry and perspective...",
  "Applying selected interior styling and lighting...",
  "Transforming furniture, wall finishes, and textiles...",
  "Refining ambient shadows and reflections...",
  "Preparing your high-resolution redesigned room..."
];

const PROMPT_INSPIRATIONS = [
  "Large blonde oak bookshelf",
  "Calacatta marble coffee table",
  "Potted fiddle-leaf fig & monstera",
  "Bouclé curved armchair",
  "Warm recessed ceiling lighting",
  "Natural sheer linen curtains"
];

interface WorkspacePageProps {
  apiKeyOverride?: string;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ apiKeyOverride }) => {
  const [searchParams] = useSearchParams();

  // Configuration Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const [roomType, setRoomType] = useState<string>('living-room');
  const [styleId, setStyleId] = useState<string>('scandinavian');
  const [colorPaletteId, setColorPaletteId] = useState<string>('warm-neutral');
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('#3D5A45');
  const [customAccentColor, setCustomAccentColor] = useState<string>('#DCCEC1');

  const [budget, setBudget] = useState<string>('mid-range');
  const [lighting, setLighting] = useState<string>('natural');
  const [furniture, setFurniture] = useState<string>('functional');
  const [roomMood, setRoomMood] = useState<string>('calm');
  const [sustainability, setSustainability] = useState<boolean>(false);
  const [preserveLayout, setPreserveLayout] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Generation & Results State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<RedesignResponse | null>(null);
  const [alternativesHistory, setAlternativesHistory] = useState<AlternativeDesign[]>([]);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync style from query params if navigated from Explore Styles
  useEffect(() => {
    const styleQuery = searchParams.get('style');
    if (styleQuery && DESIGN_STYLES.some((s) => s.id === styleQuery)) {
      setStyleId(styleQuery);
    }
  }, [searchParams]);

  // Loading animation interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isGenerating) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Handle local file selection
  const handleFile = (file: File) => {
    setErrorMsg(null);
    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload JPG, PNG, or WebP.');
      return;
    }
    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10 MB limit.');
      return;
    }

    setSelectedFile(file);

    // Read preview and dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreviewUrl(dataUrl);

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle picking one of the 4 sample rooms
  const handlePickSampleRoom = async (sample: SampleRoom) => {
    try {
      setErrorMsg(null);
      const file = await urlToFile(sample.url, `${sample.id}.jpg`);
      setRoomType(sample.type);
      handleFile(file);
    } catch (err) {
      console.error('Failed to load sample room:', err);
      setErrorMsg('Could not load sample room photo. Please try uploading an image.');
    }
  };

  // Drag & drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = () => {
    setIsDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setImageDimensions(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Generate / Run Redesign
  const handleGenerate = async (seedOverride?: number) => {
    if (!selectedFile) {
      setErrorMsg('Please upload a room photograph or choose a sample room below.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const customColorString =
        colorPaletteId === 'custom'
          ? `Primary: ${customPrimaryColor}, Accent: ${customAccentColor}`
          : undefined;

      const response = await redesignRoom({
        imageFile: selectedFile,
        roomType,
        style: styleId,
        colorPalette: colorPaletteId,
        customColors: customColorString,
        lighting,
        furniture,
        roomMood,
        budget,
        sustainability,
        preserveLayout,
        customPrompt,
        seed: seedOverride,
        apiKeyOverride,
      });

      setCurrentResult(response);

      // Add to session history
      const newAlt: AlternativeDesign = {
        id: `alt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seed: response.seed,
        styleName: response.metadata.style_name,
        styleId: response.metadata.style_id,
        roomType: response.metadata.room_type,
        redesignedImage: response.redesigned_image,
        originalImage: response.original_image,
        providerUsed: response.provider_used,
        modelUsed: response.model_used,
        prompt: response.prompt,
        generationTimeMs: response.generation_time_ms,
      };

      setAlternativesHistory((prev) => [newAlt, ...prev]);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3D5A45', '#C5A059', '#DCCEC1'],
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Alternative Design Generator (keeps image & settings, rolls new seed)
  const handleGenerateAnother = () => {
    const randomSeed = Math.floor(Math.random() * 900000) + 100000;
    handleGenerate(randomSeed);
  };

  // Append inspiration chip to custom prompt
  const handleAddPromptChip = (chip: string) => {
    setCustomPrompt((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}, ${chip.toLowerCase()}` : chip;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Workspace Header Subbar */}
      <div className="bg-white/80 border-b border-[#E8E1D5] px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1E1B]">
              Redesign Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF1EB] text-[#2D4433] text-[11px] font-semibold">
              Studio v1.0
            </span>
          </div>

          <div className="text-xs text-[#6D756C] flex items-center gap-3">
            <span>Preserve Layout: <strong className="text-[#1C1E1B]">{preserveLayout ? 'Active' : 'Off'}</strong></span>
            <span>•</span>
            <span>Style: <strong className="text-[#3D5A45]">{DESIGN_STYLES.find(s => s.id === styleId)?.name}</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT CONFIGURATION PANEL (lg:col-span-5) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D5] shadow-sm space-y-6">
              
              {/* SECTION A: IMAGE UPLOAD */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#3D5A45]" />
                    <span>Room Photograph</span>
                  </label>
                  {selectedFile && (
                    <button
                      onClick={handleClearImage}
                      className="text-[11px] text-red-600 hover:underline flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                {/* Dropzone */}
                {!imagePreviewUrl ? (
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-[#3D5A45] bg-[#EAF1EB]/50'
                        : 'border-[#D5CABE] bg-[#FAF8F5] hover:bg-[#F5F1EB]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E1D5] text-[#3D5A45] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#1C1E1B]">
                      Drag & drop your room photo here, or <span className="text-[#3D5A45] underline">browse</span>
                    </p>
                    <p className="text-[11px] text-[#7A7E78] mt-1">
                      Supports JPG, PNG, WebP (Max 10 MB)
                    </p>
                  </div>
                ) : (
                  /* Selected Image Preview Card */
                  <div className="relative rounded-2xl overflow-hidden border border-[#E8E1D5] bg-[#FAF8F5] p-3 flex items-center gap-4">
                    <img
                      src={imagePreviewUrl}
                      alt="Room Preview"
                      className="w-20 h-20 rounded-xl object-cover border border-[#D5CABE]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1C1E1B] truncate">
                        {selectedFile?.name || 'Selected Room'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#6D756C]">
                        {imageDimensions && (
                          <span className="px-1.5 py-0.5 rounded bg-white border border-[#E8E1D5]">
                            {imageDimensions.width} × {imageDimensions.height}px
                          </span>
                        )}
                        {selectedFile && (
                          <span className="px-1.5 py-0.5 rounded bg-white border border-[#E8E1D5]">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-[11px] text-[#3D5A45] font-semibold hover:underline"
                      >
                        Replace Image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                {/* Instant 1-Click Sample Room Picker */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#6D756C]">
                      Or pick a sample room to test instantly:
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SAMPLE_ROOMS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handlePickSampleRoom(sample)}
                        className="relative rounded-2xl overflow-hidden border border-[#E8E1D5] hover:border-[#3D5A45] hover:shadow-md transition-all group aspect-4/3 text-left cursor-pointer bg-black/5"
                        title={sample.description}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          onError={(e) => {
                            e.currentTarget.src = '/samples/sample-living-room.jpg';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-2.5">
                          <span className="text-xs font-semibold text-white leading-tight drop-shadow-xs">
                            {sample.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION B: ROOM TYPE */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B]">
                  Room Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROOM_TYPES.map((type) => {
                    const IconComponent = ROOM_ICONS[type.id] || Sparkles;
                    const isSelected = roomType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setRoomType(type.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EAF1EB] border-[#3D5A45] text-[#2D4433] font-semibold shadow-2xs'
                            : 'bg-[#FAF8F5] border-[#E8E1D5] text-[#4B514A] hover:bg-white hover:border-[#D5CABE]'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#3D5A45]' : 'text-[#7A7E78]'}`} />
                        <span className="text-xs truncate">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION C: DESIGN STYLE */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B]">
                    Interior Design Style
                  </label>
                  <span className="text-[11px] text-[#3D5A45] font-medium">
                    10 Styles Available
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {DESIGN_STYLES.map((style) => {
                    const isSelected = styleId === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setStyleId(style.id)}
                        className={`group relative rounded-2xl overflow-hidden border p-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#3D5A45] ring-2 ring-[#3D5A45]/30 bg-[#EAF1EB]/50'
                            : 'border-[#E8E1D5] bg-[#FAF8F5] hover:border-[#D5CABE] hover:bg-white'
                        }`}
                      >
                        <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-2">
                          <img
                            src={style.preview_image}
                            alt={style.name}
                            onError={(e) => {
                              e.currentTarget.src = '/styles/scandinavian.jpg';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#3D5A45] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1E1B] leading-tight truncate">
                          {style.name}
                        </h4>
                        <p className="text-[10px] text-[#6D756C] line-clamp-1 mt-0.5">
                          {style.tagline}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION D: COLOR PALETTE */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B]">
                  Color Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PALETTES.map((palette) => {
                    const isSelected = colorPaletteId === palette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setColorPaletteId(palette.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EAF1EB] border-[#3D5A45] ring-1 ring-[#3D5A45]'
                            : 'bg-[#FAF8F5] border-[#E8E1D5] hover:bg-white'
                        }`}
                      >
                        <div className="text-left">
                          <span className="text-xs font-semibold text-[#1C1E1B] block">
                            {palette.name}
                          </span>
                        </div>
                        {/* Swatches */}
                        <div className="flex items-center -space-x-1 shrink-0 ml-2">
                          {palette.colors.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Pickers if Custom is chosen */}
                {colorPaletteId === 'custom' && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[#4B514A] block mb-1">
                        Primary Wall Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customPrimaryColor}
                          onChange={(e) => setCustomPrimaryColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-[#D5CABE]"
                        />
                        <span className="text-xs font-mono text-[#1C1E1B]">{customPrimaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#4B514A] block mb-1">
                        Accent / Trim Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customAccentColor}
                          onChange={(e) => setCustomAccentColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-[#D5CABE]"
                        />
                        <span className="text-xs font-mono text-[#1C1E1B]">{customAccentColor}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION E: BUDGET CATEGORY */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B]">
                    Budget Preference
                  </label>
                  <span className="text-[10px] text-[#7A7E78]">
                    Guides finish & decor tier
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget-friendly', label: 'Budget-Friendly' },
                    { id: 'mid-range', label: 'Mid-Range' },
                    { id: 'premium-luxury', label: 'Premium Luxury' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudget(b.id)}
                      className={`py-2 px-2 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                        budget === b.id
                          ? 'bg-[#3D5A45] text-white font-semibold border-[#3D5A45]'
                          : 'bg-[#FAF8F5] border-[#E8E1D5] text-[#4B514A] hover:bg-white'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION F: ADDITIONAL PREFERENCES */}
              <div className="space-y-3 pt-2 border-t border-[#F2EDE4]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B] block">
                  Lighting & Atmosphere
                </label>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-[#6D756C] block mb-1">Lighting</label>
                    <select
                      value={lighting}
                      onChange={(e) => setLighting(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-[#D5CABE] bg-[#FAF8F5] text-xs text-[#1C1E1B] focus:outline-none focus:ring-1 focus:ring-[#3D5A45]"
                    >
                      <option value="natural">Natural Light</option>
                      <option value="warm">Warm Ambient</option>
                      <option value="cool">Cool Light</option>
                      <option value="dramatic">Dramatic</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#6D756C] block mb-1">Furniture</label>
                    <select
                      value={furniture}
                      onChange={(e) => setFurniture(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-[#D5CABE] bg-[#FAF8F5] text-xs text-[#1C1E1B] focus:outline-none focus:ring-1 focus:ring-[#3D5A45]"
                    >
                      <option value="minimal">Minimal</option>
                      <option value="functional">Functional</option>
                      <option value="premium">Premium</option>
                      <option value="space-saving">Space-Saving</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#6D756C] block mb-1">Room Mood</label>
                    <select
                      value={roomMood}
                      onChange={(e) => setRoomMood(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-[#D5CABE] bg-[#FAF8F5] text-xs text-[#1C1E1B] focus:outline-none focus:ring-1 focus:ring-[#3D5A45]"
                    >
                      <option value="calm">Calm & Serene</option>
                      <option value="cozy">Cozy Hygge</option>
                      <option value="professional">Professional</option>
                      <option value="luxurious">Luxurious</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-1">
                  {/* Preserve Layout Switch */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#3D5A45]" />
                      <div>
                        <span className="text-xs font-semibold text-[#1C1E1B] block">
                          Preserve Existing Layout
                        </span>
                        <span className="text-[10px] text-[#7A7E78]">
                          Retains window positions, walls, and perspective
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preserveLayout}
                      onChange={(e) => setPreserveLayout(e.target.checked)}
                      className="w-4 h-4 accent-[#3D5A45] rounded"
                    />
                  </label>

                  {/* Sustainability Switch */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-[#3D5A45]" />
                      <div>
                        <span className="text-xs font-semibold text-[#1C1E1B] block">
                          Eco-Friendly & Biophilic Materials
                        </span>
                        <span className="text-[10px] text-[#7A7E78]">
                          Adds live greenery, bamboo, and non-toxic plaster
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={sustainability}
                      onChange={(e) => setSustainability(e.target.checked)}
                      className="w-4 h-4 accent-[#3D5A45] rounded"
                    />
                  </label>
                </div>
              </div>

              {/* SECTION G: CUSTOM PROMPT */}
              <div className="space-y-2 pt-2 border-t border-[#F2EDE4]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B] flex items-center justify-between">
                  <span>Describe Your Dream Room (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Create a peaceful Scandinavian bedroom with light oak furniture, soft beige walls, indoor plants, natural lighting, and minimal decoration."
                  className="w-full p-3 rounded-xl border border-[#D5CABE] bg-[#FAF8F5] text-xs text-[#1C1E1B] placeholder-[#9EA69D] focus:outline-none focus:ring-1 focus:ring-[#3D5A45]"
                />
                
                {/* Inspiration chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PROMPT_INSPIRATIONS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPromptChip(chip)}
                      className="text-[10px] px-2 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#EAF1EB] text-[#4B514A] border border-[#E8E1D5] transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* MAIN GENERATE BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !selectedFile}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-semibold transition-all shadow-md active:scale-98 cursor-pointer ${
                    isGenerating || !selectedFile
                      ? 'bg-[#B0B8AE] text-white cursor-not-allowed opacity-80'
                      : 'bg-[#3D5A45] hover:bg-[#324B39] text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 text-[#C59B27] ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Redesigning Room with AI...' : 'Generate My Room'}</span>
                </button>
                {!selectedFile && (
                  <p className="text-[11px] text-center text-[#7A7E78] mt-2">
                    Upload a room photo above or select one of the 4 sample spaces to begin
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT WORKSPACE & RESULTS AREA (lg:col-span-7) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">

            {/* STATE 1: GENERATING / LOADING */}
            {isGenerating && (
              <div className="bg-white rounded-3xl p-8 border border-[#E8E1D5] shadow-lg text-center space-y-6 min-h-[500px] flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mx-auto">
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#3D5A45]/20 animate-ping" />
                  <div className="w-20 h-20 rounded-full bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center border border-[#C2D4C6] shadow-md">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1E1B]">
                    Reimagining Your Space
                  </h3>
                  <p className="text-sm text-[#3D5A45] font-medium animate-pulse">
                    {LOADING_STEPS[loadingStepIndex]}
                  </p>
                  <p className="text-xs text-[#7A7E78]">
                    Synthesizing {DESIGN_STYLES.find(s => s.id === styleId)?.name} aesthetics while retaining architectural geometry.
                  </p>
                </div>

                {/* Progressive Step Trackers */}
                <div className="w-full max-w-sm mx-auto space-y-2 pt-4">
                  {LOADING_STEPS.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 text-xs text-left px-3 py-1.5 rounded-xl transition-all ${
                        idx === loadingStepIndex
                          ? 'bg-[#EAF1EB] text-[#2D4433] font-semibold border border-[#C2D4C6]'
                          : idx < loadingStepIndex
                          ? 'text-[#3D5A45] font-medium'
                          : 'text-[#9EA69D]'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        idx === loadingStepIndex ? 'bg-[#3D5A45] animate-ping' : idx < loadingStepIndex ? 'bg-[#3D5A45]' : 'bg-[#D5CABE]'
                      }`} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STATE 2: SUCCESS RESULTS (Before-and-After Slider) */}
            {!isGenerating && currentResult && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8E1D5] shadow-lg space-y-5">
                  
                  {/* Slider Component */}
                  <BeforeAfterSlider
                    originalImage={currentResult.original_image}
                    redesignedImage={currentResult.redesigned_image}
                    originalLabel="Original Room"
                    redesignedLabel={`${currentResult.metadata.style_name} Redesign`}
                    styleName={currentResult.metadata.style_name}
                    onGenerateAlternative={handleGenerateAnother}
                    isGenerating={isGenerating}
                  />

                  {/* Redesign Specifications Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B]">
                        Architectural Redesign Metadata
                      </span>
                      <span className="text-[11px] text-[#6D756C]">
                        Generated in {(currentResult.generation_time_ms / 1000).toFixed(2)}s
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D5CABE] text-[#1C1E1B] font-medium">
                        Style: <strong>{currentResult.metadata.style_name}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D5CABE] text-[#1C1E1B]">
                        Room: {currentResult.metadata.room_type.replace('-', ' ')}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D5CABE] text-[#1C1E1B]">
                        Palette: {currentResult.metadata.color_palette.replace('-', ' ')}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D5CABE] text-[#1C1E1B]">
                        Lighting: {currentResult.metadata.lighting}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D5CABE] text-[#1C1E1B]">
                        Seed: <code className="font-mono">{currentResult.seed}</code>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#EAF1EB] border border-[#C2D4C6] text-[#2D4433] font-medium">
                        Engine: {currentResult.provider_used}
                      </span>
                    </div>

                    {/* Collapsible Prompt Excerpt */}
                    <details className="text-[11px] text-[#6D756C] pt-1">
                      <summary className="cursor-pointer hover:text-[#1C1E1B] font-medium">
                        View Generated Architectural Prompt
                      </summary>
                      <div className="mt-2 p-2.5 bg-white rounded-xl border border-[#E8E1D5] font-mono text-[10px] leading-relaxed select-all">
                        {currentResult.prompt}
                      </div>
                    </details>
                  </div>

                  {/* Quick Action Navigation Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      onClick={() => {
                        // Switch to another style easily
                        const currentIndex = DESIGN_STYLES.findIndex(s => s.id === styleId);
                        const nextStyle = DESIGN_STYLES[(currentIndex + 1) % DESIGN_STYLES.length];
                        setStyleId(nextStyle.id);
                      }}
                      className="px-4 py-2 rounded-xl border border-[#D5CABE] bg-white text-xs font-semibold text-[#1C1E1B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Try Next Style ({DESIGN_STYLES[(DESIGN_STYLES.findIndex(s => s.id === styleId) + 1) % DESIGN_STYLES.length].name})
                    </button>

                    <button
                      onClick={handleClearImage}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-[#6D756C] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
                    >
                      Start New Project
                    </button>
                  </div>

                </div>

                {/* Alternative Designs Session Gallery */}
                {alternativesHistory.length > 1 && (
                  <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-bold text-[#1C1E1B]">
                        Session Variations ({alternativesHistory.length})
                      </h4>
                      <span className="text-xs text-[#7A7E78]">Click any variation to inspect</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {alternativesHistory.map((alt) => (
                        <div
                          key={alt.id}
                          onClick={() => {
                            if (currentResult) {
                              setCurrentResult({
                                ...currentResult,
                                redesigned_image: alt.redesignedImage,
                                seed: alt.seed,
                                metadata: {
                                  ...currentResult.metadata,
                                  style_name: alt.styleName,
                                  style_id: alt.styleId,
                                }
                              });
                            }
                          }}
                          className={`relative rounded-xl overflow-hidden border cursor-pointer aspect-4/3 transition-all ${
                            currentResult.seed === alt.seed
                              ? 'border-[#3D5A45] ring-2 ring-[#3D5A45]/40'
                              : 'border-[#E8E1D5] hover:border-[#D5CABE]'
                          }`}
                        >
                          <img
                            src={alt.redesignedImage}
                            alt="Alternative"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                            <span className="text-[10px] text-white font-medium truncate">
                              {alt.styleName} (Seed: {alt.seed})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STATE 3: EMPTY / INITIAL STATE */}
            {!isGenerating && !currentResult && (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E1D5] shadow-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#3D5A45] flex items-center justify-center mx-auto shadow-2xs">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1E1B]">
                    Ready to Redesign Your Room
                  </h3>
                  <p className="text-xs text-[#6D756C] leading-relaxed">
                    Upload a room photo on the left panel or click one of the quick sample rooms to preview an instant AI transformation.
                  </p>
                </div>

                {/* Selected Style Moodboard Preview */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={DESIGN_STYLES.find(s => s.id === styleId)?.preview_image}
                      alt="Selected Style"
                      className="w-14 h-14 rounded-xl object-cover border border-[#D5CABE]"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5A45]">Active Style Preview</span>
                      <h4 className="font-serif text-lg font-bold text-[#1C1E1B]">
                        {DESIGN_STYLES.find(s => s.id === styleId)?.name}
                      </h4>
                      <p className="text-[11px] text-[#6D756C] line-clamp-1">
                        {DESIGN_STYLES.find(s => s.id === styleId)?.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] text-[#4B514A]">
                    <span>Key Materials:</span>
                    <span className="font-medium text-[#1C1E1B] truncate max-w-[200px]">
                      {DESIGN_STYLES.find(s => s.id === styleId)?.materials.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#7A7E78]">
                  Tip: Use the sample room buttons on the left to test instantly without needing your own files!
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
