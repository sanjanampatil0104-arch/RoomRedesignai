import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Palette, Layers, Check } from 'lucide-react';
import { DESIGN_STYLES } from '../data/styles';

export const StylesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Header Banner */}
      <section className="pt-16 pb-12 bg-white border-b border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF1EB] text-[#2D4433] text-xs font-semibold">
            <Palette className="w-3.5 h-3.5 text-[#3D5A45]" />
            <span>Architectural Taxonomy</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C1E1B]">
            Interior Design Styles Catalog
          </h1>

          <p className="text-sm sm:text-base text-[#6D756C] max-w-2xl mx-auto font-light leading-relaxed">
            Discover the 10 distinct architectural styles supported by the RoomRedesign AI platform. Each style is encoded with rich material keywords, lighting profiles, and spatial design principles.
          </p>
        </div>
      </section>

      {/* Style Catalog List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="space-y-12">
          {DESIGN_STYLES.map((style, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={style.id}
                id={style.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8E1D5] shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Photo Column */}
                <div className={`lg:col-span-5 relative aspect-4/3 lg:aspect-auto ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img
                    src={style.preview_image}
                    alt={style.name}
                    onError={(e) => {
                      e.currentTarget.src = '/styles/scandinavian.jpg';
                    }}
                    className="w-full h-full object-cover min-h-[300px]"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider">
                      Style #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Information Column */}
                <div className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3D5A45]">
                        {style.tagline}
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1E1B] mt-1">
                        {style.name}
                      </h2>
                    </div>

                    <p className="text-sm text-[#4B514A] leading-relaxed">
                      {style.description}
                    </p>

                    {/* Materials */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B] mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#3D5A45]" />
                        <span>Signature Materials</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {style.materials.map((m, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] text-xs text-[#2C302B] font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Color Palette recommendation */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1E1B] mb-2 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#3D5A45]" />
                        <span>Recommended Color Scheme</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        {style.color_palette_recommendation.map((hex, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[#6D756C]">
                            <span
                              className="w-6 h-6 rounded-lg border border-black/10 shadow-2xs"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="font-mono text-[11px]">{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Redesign Action */}
                  <div className="pt-4 border-t border-[#F2EDE4] flex items-center justify-between">
                    <span className="text-xs text-[#7A7E78]">
                      Ready to apply to your room?
                    </span>
                    <Link
                      to={`/redesign?style=${style.id}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3D5A45] text-white text-xs font-semibold shadow-xs hover:bg-[#324B39] active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Redesign with {style.name}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
