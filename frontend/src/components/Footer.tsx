import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, GraduationCap, Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1C1E1B] text-[#FAF8F5] pt-16 pb-12 border-t border-[#313630]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#313630]">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#3D5A45] flex items-center justify-center text-white">
                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M6 13.5L16 5.5L26 13.5V26.5C26 27.0523 25.5523 27.5 25 27.5H7C6.44772 27.5 6 27.0523 6 26.5V13.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path d="M13 27.5V18.5H19V27.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M23.5 6.5L24.5 3.5L25.5 6.5L28.5 7.5L25.5 8.5L24.5 11.5L23.5 8.5L20.5 7.5L23.5 6.5Z" fill="#C59B27" />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">RoomRedesign.AI</span>
            </div>
            <p className="text-xs text-[#A1A89F] leading-relaxed">
              Transforming everyday photographs into architecturally reimagined interiors using State-of-the-Art Generative AI.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#828B80]">
              <GraduationCap className="w-4 h-4 text-[#8FA97A]" />
              <span>B.Tech AI & Data Science Micro-Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#8FA97A]">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#C5CCC3]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/redesign" className="hover:text-white transition-colors">Redesign Workspace</Link>
              </li>
              <li>
                <Link to="/styles" className="hover:text-white transition-colors">Design Style Catalog</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">System Architecture & Docs</Link>
              </li>
            </ul>
          </div>

          {/* Popular Styles */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#8FA97A]">Featured Styles</h4>
            <ul className="space-y-2 text-xs text-[#C5CCC3]">
              <li><Link to="/redesign?style=scandinavian" className="hover:text-white">Scandinavian</Link></li>
              <li><Link to="/redesign?style=modern-minimalist" className="hover:text-white">Modern Minimalist</Link></li>
              <li><Link to="/redesign?style=japandi" className="hover:text-white">Japandi</Link></li>
              <li><Link to="/redesign?style=luxury-contemporary" className="hover:text-white">Luxury Contemporary</Link></li>
              <li><Link to="/redesign?style=traditional-indian" className="hover:text-white">Traditional Indian</Link></li>
            </ul>
          </div>

          {/* Technology & Academic Badge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#8FA97A]">Technology Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {['FastAPI', 'PyTorch / Diffusers', 'Hugging Face API', 'React 19', 'TypeScript', 'Tailwind CSS', 'Pillow / OpenCV'].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-[#282C27] text-[10px] text-[#C5CCC3] border border-[#3A4038]">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#828B80] pt-2">
              Supports configurable image-to-image diffusion models with structural perspective preservation.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#828B80] gap-4">
          <p>© {new Date().getFullYear()} RoomRedesign AI — Micro-Project Demonstration. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              API Status: Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
