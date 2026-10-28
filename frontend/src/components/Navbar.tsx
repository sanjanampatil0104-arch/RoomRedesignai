import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Settings2, Compass, Layers, Info } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  hasCustomKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, hasCustomKey }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Workspace', path: '/redesign' },
    { name: 'Explore Styles', path: '/styles' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About Project', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3D6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-[#EAF1EB] flex items-center justify-center border border-[#C2D4C6] text-[#3D5A45] shadow-xs group-hover:scale-105 transition-transform">
            {/* House Outline with Sparkle */}
            <svg
              className="w-6 h-6"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 13.5L16 5.5L26 13.5V26.5C26 27.0523 25.5523 27.5 25 27.5H7C6.44772 27.5 6 27.0523 6 26.5V13.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M13 27.5V18.5H19V27.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M23.5 6.5L24.5 3.5L25.5 6.5L28.5 7.5L25.5 8.5L24.5 11.5L23.5 8.5L20.5 7.5L23.5 6.5Z"
                fill="#C59B27"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1E1B] leading-none">
              RoomRedesign<span className="text-[#3D5A45]">.AI</span>
            </span>
            <span className="text-[11px] font-medium text-[#7A7E78] tracking-wider uppercase mt-1">
              Reimagine Your Space. Powered by AI.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.path.startsWith('/#')) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-sm font-medium text-[#4B514A] hover:text-[#1C1E1B] transition-colors"
                >
                  {link.name}
                </a>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#3D5A45] font-semibold'
                    : 'text-[#4B514A] hover:text-[#1C1E1B]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              hasCustomKey
                ? 'bg-[#EAF1EB] text-[#2D4433] border-[#C2D4C6]'
                : 'bg-white text-[#4B514A] border-[#D5CABE] hover:bg-[#F2ECE4]'
            }`}
            title="Configure AI Engine & API Token"
          >
            <Settings2 className="w-4 h-4 text-[#3D5A45]" />
            <span className="hidden lg:inline text-xs">AI Settings</span>
            {hasCustomKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <Link
            to="/redesign"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3D5A45] text-white text-xs font-semibold shadow-xs hover:bg-[#324B39] hover:shadow-md active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#E8EFE9]" />
            <span>Redesign My Room</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white border border-[#D5CABE] text-[#4B514A]"
          >
            <Settings2 className="w-5 h-5 text-[#3D5A45]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-[#D5CABE] text-[#1C1E1B]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#EAE3D6] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#1C1E1B] hover:bg-[#F0EAE1]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to="/redesign"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#3D5A45] text-white text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Redesign My Room</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
