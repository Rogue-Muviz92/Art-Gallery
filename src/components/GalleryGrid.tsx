import React from "react";
import { motion } from "motion/react";
import { Eye, Ruler, Palette, Calendar, Sparkles } from "lucide-react";
import { ArtistProfile, Painting } from "../types";

interface GalleryGridProps {
  profile: ArtistProfile;
  onEditPainting: (paintingKey: "painting1" | "painting2" | "painting3" | "painting4" | "painting5" | "painting6" | "painting7") => void;
  showEditorPrompt?: boolean;
}

export default function GalleryGrid({ profile, onEditPainting }: GalleryGridProps) {
  const [displayMode, setDisplayMode] = React.useState<"contain" | "cover">("contain");
  
  // Helper to render a painting card
  const renderPaintingCard = ({
    painting,
    blockId,
    label,
    aspectClass = "aspect-[4/3]"
  }: {
    painting: Painting;
    blockId: "painting1" | "painting2" | "painting3" | "painting4" | "painting5" | "painting6" | "painting7";
    label: string;
    aspectClass?: string;
  }) => {
    return (
      <motion.div
        key={blockId}
        id={`painting-${blockId}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="group flex flex-col"
      >
        {/* Aesthetic frame border */}
        <div className="relative overflow-hidden bg-[#0A0A0A] border border-neutral-800/80 p-3.5 hover:border-neutral-500 transition-all duration-700 dream-glow rounded-sm">
          <div className={`${aspectClass} relative overflow-hidden bg-[#0A0A0A] flex items-center justify-center`}>
            <img
              src={painting.url}
              alt={painting.title || label}
              referrerPolicy="no-referrer"
              className={`w-full h-full transition-all duration-700 ease-out group-hover:scale-[1.03] opacity-90 group-hover:opacity-100 ${
                displayMode === "contain" 
                  ? "object-contain p-1" 
                  : "object-cover"
              }`}
            />
            
            {/* Elegant hover overlay */}
            <div className="absolute inset-0 bg-[#0A0A0A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            </div>
          </div>
        </div>

        {/* Painting metadata */}
        <div className="mt-4 space-y-1.5 text-left">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-lg sm:text-xl text-[#E8E6E1] group-hover:text-white transition-colors duration-300 font-semibold tracking-wide">
              {painting.title || "[Unfilled Painting Title]"}
            </h3>
            <span className="font-mono text-xs text-neutral-500">
              {painting.year || "[Year]"}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-sans tracking-wide">
            <span className="flex items-center gap-1">
              <Palette className="w-3 h-3 text-neutral-500" />
              {painting.medium || "[Medium]"}
            </span>
            <span className="h-3 w-[1px] bg-neutral-800"></span>
            <span className="flex items-center gap-1">
              <Ruler className="w-3 h-3 text-neutral-500" />
              {painting.dimensions || "[Dimensions]"}
            </span>
          </div>

          {painting.description && (
            <p className="font-serif text-sm text-neutral-400 italic font-light pt-2 leading-relaxed border-t border-neutral-850 mt-2">
              {painting.description}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section 
      id="gallery-section" 
      className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-24 scroll-mt-24"
    >
      {/* SECTION HEADER */}
      <div id="gallery-header" className="border-b border-neutral-900 pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400 block mb-2 font-medium">
            MUSEUM ARCHIVE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#E8E6E1] font-light tracking-wide uppercase text-shadow-cinematic">
            THE FEATURED EXHIBITION
          </h2>
        </div>
        
        {/* Toggle Controls to prevent zoomed/cropping issues */}
        <div className="flex flex-col md:items-end gap-2 text-left shrink-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500">
            FRAMING PREFERENCE
          </span>
          <div className="inline-flex border border-neutral-850 bg-[#0D0D0D] p-1 rounded-sm">
            <button
              onClick={() => setDisplayMode("contain")}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer rounded-sm ${
                displayMode === "contain"
                  ? "bg-neutral-800 text-[#E8E6E1] font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Full Canvas Frame
            </button>
            <button
              onClick={() => setDisplayMode("cover")}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer rounded-sm ${
                displayMode === "cover"
                  ? "bg-neutral-800 text-[#E8E6E1] font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Borderless Crop
            </button>
          </div>
        </div>
      </div>

      {/* THE EXHIBITION LAYOUT */}
      <div id="gallery-layout-wrapper" className="space-y-12">
        
        {/* HERO MASTERPIECE (LEFT) + COLUMN OF TWO STACKED (RIGHT) */}
        <div id="gallery-blocks-row-1" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Painting 1 (Huge Hero Landscape) [IMAGE BLOCK 3] */}
          <div id="gallery-block-3-wrapper" className="lg:col-span-7 flex flex-col gap-16 md:gap-24">
            {renderPaintingCard({
              painting: profile.painting1,
              blockId: "painting1",
              label: "IMAGE BLOCK 3 — Painting 1 (Hero Painting)",
              aspectClass: "aspect-[16/9] sm:aspect-[16/9] lg:aspect-[16/10]"
            })}
            
            {/* Elegant space filler by the side of the 3rd painting */}
            <div className="hidden lg:flex flex-col justify-center px-12 xl:px-20 h-full relative max-w-2xl mt-12 mb-auto">
              <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#C5A880]/30 via-[#C5A880]/10 to-transparent"></div>
              <p className="font-serif text-3xl xl:text-4xl text-[#E8E6E1]/90 leading-snug font-light italic opacity-80 mix-blend-screen tracking-wide">
                "The canvas is a mirror; it reveals only what the soulful eye is prepared to see."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-[1px] w-8 bg-[#C5A880]/40"></div>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C5A880]/70 font-semibold">
                  A Curated Exhibition
                </p>
              </div>
            </div>
          </div>

          {/* Painting 2 & Painting 3 Column (Custom Landscape Aspects) [IMAGE BLOCK 4 & 5] */}
          <div id="gallery-block-4-5-column" className="lg:col-span-5 flex flex-col gap-12 md:gap-16">
            {/* Painting 2 (Landscape Sailing Ships) [IMAGE BLOCK 4] */}
            <div className="w-4/5 lg:w-3/4 lg:self-end">
              {renderPaintingCard({
                painting: profile.painting2,
                blockId: "painting2",
                label: "IMAGE BLOCK 4 — Painting 2 (Small)",
                aspectClass: "aspect-[3/2]"
              })}
            </div>

            {/* Painting 3 (Traditional Autumn Bird) [IMAGE BLOCK 5] */}
            <div className="w-full">
              {renderPaintingCard({
                painting: profile.painting3,
                blockId: "painting3",
                label: "IMAGE BLOCK 5 — Painting 3 (Medium)",
                aspectClass: "aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5]"
              })}
            </div>
          </div>

        </div>

        {/* MEDIUM SPACER */}
        <div id="gallery-medium-spacer" className="py-8 flex items-center justify-center">
          <div className="w-16 h-[1px] bg-neutral-900"></div>
          <Sparkles className="w-4 h-4 text-neutral-600 mx-4 animate-pulse" />
          <div className="w-16 h-[1px] bg-neutral-900"></div>
        </div>

        {/* BOTTOM ROW: Paintings 4 & 5 (Asymmetric Landscape & Vertical Majestic Scroll) [IMAGE BLOCK 6 & 7] */}
        <div id="gallery-blocks-row-2" className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Painting 4 (Medium landscape Cabin - 7/12 Width) [IMAGE BLOCK 6] */}
          <div className="md:col-span-7">
            {renderPaintingCard({
              painting: profile.painting4,
              blockId: "painting4",
              label: "IMAGE BLOCK 6 — Painting 4 (Medium)",
              aspectClass: "aspect-[3/2]"
            })}
          </div>

          {/* Painting 5 (Medium/Tall Sunset Branches - 5/12 Width vertical tall piece) [IMAGE BLOCK 7] */}
          <div className="md:col-span-5">
            {renderPaintingCard({
              painting: profile.painting5,
              blockId: "painting5",
              label: "IMAGE BLOCK 7 — Painting 5 (Medium)",
              aspectClass: "aspect-[9/14]"
            })}
          </div>

        </div>

        {/* ADDITIONAL ROW: Painting 6 & 7 [IMAGE BLOCK 8 & 9] */}
        <div id="gallery-blocks-row-3" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mt-12 pt-12 border-t border-neutral-900 border-dashed">
          <div className="w-full">
            {renderPaintingCard({
              painting: profile.painting6,
              blockId: "painting6",
              label: "IMAGE BLOCK 8 — Painting 6 (Medium)",
              aspectClass: "aspect-[4/3]"
            })}
          </div>
          <div className="w-full">
            {renderPaintingCard({
              painting: profile.painting7,
              blockId: "painting7",
              label: "IMAGE BLOCK 9 — Painting 7 (Medium)",
              aspectClass: "aspect-[4/3]"
            })}
          </div>
        </div>

      </div>

    </section>
  );
}
