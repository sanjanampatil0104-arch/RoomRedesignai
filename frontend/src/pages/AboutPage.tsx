import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Cpu,
  Layers,
  Code2,
  Sparkles,
  Server,
  ShieldCheck,
  ArrowRight,
  Database,
  Image as ImageIcon
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Header Banner */}
      <section className="pt-16 pb-12 bg-white border-b border-[#E8E1D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF1EB] text-[#2D4433] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#3D5A45]" />
            <span>Final-Year B.Tech AI & Data Science Micro-Project</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C1E1B]">
            System Architecture & Methodology
          </h1>

          <p className="text-sm sm:text-base text-[#6D756C] max-w-2xl mx-auto font-light leading-relaxed">
            RoomRedesign AI is an end-to-end full-stack Generative AI application integrating deep diffusion models, edge-aware image conditioning, and automated architectural prompt engineering.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        
        {/* 1. Problem Statement & Motivation */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D5] shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D5A45]">01. Project Objective</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1E1B]">
            Problem Statement & Motivation
          </h2>
          <p className="text-sm text-[#4B514A] leading-relaxed">
            Traditional interior 3D rendering workflows require CAD drafting, 3ds Max/Blender modeling, texture mapping, and computationally intensive ray-tracing that take hours or days per room. Conversely, generic text-to-image AI tools (like DALL-E or Midjourney) generate hallucinated rooms from scratch, completely disregarding the user's real room geometry, window openings, ceiling boundaries, and structural doorways.
          </p>
          <p className="text-sm text-[#4B514A] leading-relaxed">
            <strong>RoomRedesign AI</strong> solves this fundamental challenge by implementing a structural image-to-image transformation pipeline. Users submit existing room photographs, select architectural styles and color palettes, and receive photorealistic redesigned interiors that respect existing spatial arrangements.
          </p>
        </div>

        {/* 2. System Architecture Workflow */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D5] shadow-xs space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D5A45]">02. System Architecture</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1E1B]">
            End-to-End Pipeline Workflow
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-[#1C1E1B]">Client Workspace</h4>
              <p className="text-[11px] text-[#6D756C] leading-relaxed">
                React 19 + TypeScript collects room image, style metadata, color palettes, and budget tier.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-[#1C1E1B]">Prompt Builder</h4>
              <p className="text-[11px] text-[#6D756C] leading-relaxed">
                FastAPI composes high-fidelity architectural prompts incorporating lighting, materials, and negative tokens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-[#1C1E1B]">Inference Pipeline</h4>
              <p className="text-[11px] text-[#6D756C] leading-relaxed">
                Image-to-image diffusion model conditions generation on input geometry with latent seed control.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF1EB] text-[#3D5A45] flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h4 className="text-xs font-bold text-[#1C1E1B]">Comparison Stage</h4>
              <p className="text-[11px] text-[#6D756C] leading-relaxed">
                Interactive dual before/after slider with full-res JPEG download and alternative session variations.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Deep Learning & Image Conditioning Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D5] shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D5A45]">03. AI Methodology</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1E1B]">
            Generative Diffusion Conditioning
          </h2>
          <div className="space-y-3 text-sm text-[#4B514A] leading-relaxed">
            <p>
              The platform utilizes <strong>Latent Diffusion Models (LDM)</strong> adapted for image-to-image and instruction-guided editing (Instruct-Pix2Pix / Stable Diffusion). Rather than starting from pure Gaussian noise, the input image is encoded into latent space <em>z₀ = E(x)</em> via a Variational Autoencoder (VAE).
            </p>
            <p>
              Noise is added up to intermediate step <em>t</em>, preserving low-frequency spatial compositions (walls, floor plane, camera perspective), while the high-frequency semantics (furniture styling, wall colors, lighting temperature) are guided along the prompt vector <em>c</em> during reverse denoising steps:
            </p>
            <div className="p-3 bg-[#FAF8F5] rounded-xl font-mono text-xs text-[#1C1E1B] border border-[#E8E1D5]">
              ε_θ(z_t, t, c) = (1 + s) · ε(z_t, t, c) - s · ε(z_t, t, ∅) &nbsp; [Classifier-Free Guidance]
            </div>
            <p>
              <strong>Resilient Micro-Project Fallback Engine:</strong> In academic evaluations or offline demos where internet or cloud GPU quotas may encounter temporary rate limits, our backend incorporates an intelligent algorithmic and neural style-transfer fallback that preserves room contours, harmonizes color palettes, adjusts lighting curves, and guarantees 100% demo uptime without blank screens or 500 errors.
            </p>
          </div>
        </div>

        {/* 4. Complete Technology Stack Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D5] shadow-xs space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D5A45]">04. Technology Stack</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1E1B]">
            Components & Libraries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D5A45] flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Frontend Tier
              </h4>
              <ul className="text-xs space-y-1.5 text-[#4B514A]">
                <li>• <strong>React 19 & TypeScript:</strong> Type-safe UI components</li>
                <li>• <strong>Vite:</strong> Ultra-fast modern build tooling</li>
                <li>• <strong>Tailwind CSS:</strong> Architectural luxury design system</li>
                <li>• <strong>Lucide React:</strong> Vector iconography</li>
                <li>• <strong>React Router DOM:</strong> Client-side route management</li>
                <li>• <strong>Interactive Canvas Slider:</strong> Smooth touch/mouse tracking</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D5A45] flex items-center gap-1.5">
                <Server className="w-4 h-4" /> Backend & AI Tier
              </h4>
              <ul className="text-xs space-y-1.5 text-[#4B514A]">
                <li>• <strong>FastAPI & Python 3.11:</strong> High-performance async REST API</li>
                <li>• <strong>Pydantic v2:</strong> Request validation and schemas</li>
                <li>• <strong>Pillow & NumPy:</strong> High-precision image processing & validation</li>
                <li>• <strong>Hugging Face Inference API:</strong> Cloud diffusion model execution</li>
                <li>• <strong>Docker & Uvicorn:</strong> Containerized production deployment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Launch Workspace CTA */}
        <div className="p-8 rounded-3xl bg-[#3D5A45] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold">Experience the Platform Live</h3>
            <p className="text-xs text-[#E8EFE9]">Upload any room photo or test with our one-click sample rooms.</p>
          </div>
          <Link
            to="/redesign"
            className="px-6 py-3 rounded-2xl bg-white text-[#1C1E1B] text-xs font-semibold hover:bg-[#FAF8F5] active:scale-95 transition-all shadow-xs shrink-0 flex items-center gap-2"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
