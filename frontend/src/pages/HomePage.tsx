import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Upload,
  Sliders,
  Download,
  Palette,
  Layers,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  Camera,
  Compass
} from 'lucide-react';
import { DESIGN_STYLES } from '../data/styles';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

export const HomePage: React.FC = () => {
  // Hero sample before and after images (local verified assets)
  const heroOriginal = "/samples/sample-living-room.jpg";
  const heroRedesigned = "/styles/modern-minimalist.jpg";

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Soft atmospheric gradient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#EAF1EB]/50 rounded-full blur-3xl pointer-events-none -z-10 animate-soft-glow" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#F2ECE4]/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF1EB] border border-[#C2D4C6] text-[#2D4433] text-xs font-semibold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Next-Gen Generative Interior Redesign</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#1C1E1B] tracking-tight leading-[1.08]">
              Your Dream Interior, <br />
              <span className="italic font-normal text-[#3D5A45]">Designed by AI.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#4B514A] font-light max-w-2xl mx-auto leading-relaxed">
              Transform your existing room into a beautiful new space. Upload a photo, choose your style, and let AI reimagine your home while preserving its spatial architecture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/redesign"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#3D5A45] text-white text-base font-semibold shadow-md hover:bg-[#324B39] hover:shadow-lg active:scale-95 transition-all group"
              >
                <span>Redesign My Room</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/styles"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white border border-[#D5CABE] text-[#1C1E1B] text-base font-medium shadow-2xs hover:bg-[#F5F1EB] active:scale-95 transition-all"
              >
                <Compass className="w-4 h-4 text-[#3D5A45]" />
                <span>Explore Design Styles</span>
              </Link>
            </div>

            {/* Quick feature pill tags */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#6D756C]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3D5A45]" />
                <span>Preserves Room Perspective</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3D5A45]" />
                <span>10 Curated Architectural Styles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3D5A45]" />
                <span>Instant High-Res Export</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Before-and-After Preview Slider */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="p-3 sm:p-4 rounded-[32px] bg-white/70 backdrop-blur-md border border-[#E8E1D5] shadow-xl">
              <BeforeAfterSlider
                originalImage={heroOriginal}
                redesignedImage={heroRedesigned}
                originalLabel="Original Apartment"
                redesignedLabel="Scandinavian Minimalism"
                styleName="Scandinavian"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#F5F2EB]/60 border-y border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3D5A45]">Seamless Process</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1E1B]">
              How RoomRedesign Works
            </h2>
            <p className="text-sm sm:text-base text-[#6D756C]">
              Three effortless steps to transform any room photo into an architectural magazine showpiece.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-center text-[#3D5A45] mb-6 group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <div className="absolute top-8 right-8 text-3xl font-serif font-bold text-[#D5CABE]/70">
                01
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1E1B] mb-2">Upload Your Room</h3>
              <p className="text-sm text-[#4B514A] leading-relaxed">
                Take a photograph of your bedroom, living room, kitchen, or home office on any smartphone or camera. Upload it in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF1EB] border border-[#C2D4C6] flex items-center justify-center text-[#3D5A45] mb-6 group-hover:scale-105 transition-transform">
                <Sliders className="w-7 h-7" />
              </div>
              <div className="absolute top-8 right-8 text-3xl font-serif font-bold text-[#D5CABE]/70">
                02
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1E1B] mb-2">Customize Your Design</h3>
              <p className="text-sm text-[#4B514A] leading-relaxed">
                Select from 10 iconic styles, custom color palettes, lighting schemes, and budget preferences to tailor every architectural nuance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-center text-[#3D5A45] mb-6 group-hover:scale-105 transition-transform">
                <Download className="w-7 h-7" />
              </div>
              <div className="absolute top-8 right-8 text-3xl font-serif font-bold text-[#D5CABE]/70">
                03
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1E1B] mb-2">Generate and Download</h3>
              <p className="text-sm text-[#4B514A] leading-relaxed">
                Our image-to-image AI pipeline generates high-resolution redesigned visuals. Compare on the interactive slider and download instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESIGN STYLES SHOWCASE */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#3D5A45]">Curated Aesthetics</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1E1B]">
                Explore 10 Design Styles
              </h2>
              <p className="text-sm text-[#6D756C]">
                From serene Nordic minimalism to regal traditional heritage, explore architectural aesthetics engineered for photorealistic transformation.
              </p>
            </div>
            <Link
              to="/styles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3D5A45] hover:underline"
            >
              <span>View complete style guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Style Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {DESIGN_STYLES.map((style) => (
              <div
                key={style.id}
                className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8E1D5] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={style.preview_image}
                    alt={style.name}
                    onError={(e) => {
                      e.currentTarget.src = '/styles/scandinavian.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-serif text-lg font-bold leading-tight">{style.name}</h4>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <p className="text-xs text-[#4B514A] line-clamp-2 leading-relaxed">
                    {style.tagline}
                  </p>

                  <div className="pt-2 border-t border-[#F2EDE4] flex items-center justify-between">
                    {/* Color swatches */}
                    <div className="flex items-center -space-x-1">
                      {style.color_palette_recommendation.slice(0, 4).map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <Link
                      to={`/redesign?style=${style.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3D5A45] hover:text-[#1C1E1B] transition-colors"
                    >
                      <span>Redesign</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEY PLATFORM FEATURES */}
      <section className="py-20 md:py-28 bg-[#FAF8F5] border-t border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3D5A45]">Intelligent Architecture</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1E1B]">
              Engineered for Interior Perfection
            </h2>
            <p className="text-sm sm:text-base text-[#6D756C]">
              Discover why RoomRedesign AI delivers consistent, high-fidelity interior results without unwanted architectural distortion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1E1B]">Perspective Preservation</h3>
              <p className="text-xs text-[#4B514A] leading-relaxed">
                Unlike generic text-to-image generators, our image-to-image conditioning honors existing walls, doors, ceiling height, and window placement.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#3D5A45] flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1E1B]">Harmonious Color Palettes</h3>
              <p className="text-xs text-[#4B514A] leading-relaxed">
                Choose from curated interior schemes including Warm Neutrals, Sage Green, and Black & Gold, or use the interactive hex picker for custom branding.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1E1B]">Interactive Comparison</h3>
              <p className="text-xs text-[#4B514A] leading-relaxed">
                Fluid before-and-after slider with side-by-side inspection modes provides clear visual feedback on every transformation.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#3D5A45] flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1E1B]">Alternative Variations</h3>
              <p className="text-xs text-[#4B514A] leading-relaxed">
                Generate multiple creative options for the exact same room with controlled latent seeds without re-uploading the original photo.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1E1B]">High-Resolution Export</h3>
              <p className="text-xs text-[#4B514A] leading-relaxed">
                Direct one-click download delivers full-resolution JPEG images suitable for client presentations, renovation planning, or moodboards.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#3D5A45] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1E1B]">Resilient Zero-Downtime Engine</h3>
              <p className="text-xs text-[#4B514A] leading-relaxed">
                Connects to cloud Hugging Face diffusion providers with automatic fallback to an internal neural harmonizer for 100% demo reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-20 md:py-28 bg-[#2A3F30] text-white relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4E6B56] rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1C1E1B] rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Ready for your interior transformation?</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
            See Your Room in a Whole New Light.
          </h2>

          <p className="text-sm sm:text-base text-[#D0DCD2] max-w-xl mx-auto font-light leading-relaxed">
            No design expertise needed. Upload an existing room photo or choose one of our sample spaces to experience AI-powered interior redesign now.
          </p>

          <div className="pt-4">
            <Link
              to="/redesign"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-[#FAF8F5] text-[#1C1E1B] text-base font-semibold shadow-lg hover:bg-white active:scale-95 transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#3D5A45]" />
              <span>Launch Redesign Workspace</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
