import React from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ArtistProfile } from "../types";

interface ArtistStoryProps {
  profile: ArtistProfile;
  onEditClick: (tab: string) => void;
}

export default function ArtistStory({ profile, onEditClick }: ArtistStoryProps) {
  return (
    <div id="artist-story-wrapper" className="space-y-24 md:space-y-36">
      
      {/* SECTION 2: HERO TRIBUTE BLOCK */}
      <section 
        id="hero-section" 
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 md:pt-16 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
      >
        {/* Left Col: Portrait [IMAGE BLOCK 1] */}
        <motion.div 
          id="hero-portrait-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col group"
        >
          <div className="relative overflow-hidden bg-[#0D0D0D] border border-neutral-800/80 p-3.5 transition-all duration-700 hover:border-neutral-500 dream-glow rounded-sm">
            <div className="aspect-[3/4] relative overflow-hidden bg-neutral-900">
              <img
                id="artist-portrait-img"
                src={profile.portraitUrl}
                alt={profile.fatherName ? `${profile.fatherName} Portrait` : "Father's Portrait"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103 opacity-90 hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/65 via-transparent to-transparent"></div>
            </div>
          </div>
          {/* Subtle metadata caption under portrait */}
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mt-3">
            {profile.portraitCaption || "[IMAGE BLOCK 1: Father's Portrait]"}
          </span>
        </motion.div>

        {/* Right Col: Titles [TEXT BLOCK 1 & 2] */}
        <motion.div 
          id="hero-info-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          <div className="space-y-4">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">
              A Retrospective Tribute
            </span>
            <h1 
              id="hero-artist-name"
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#E8E6E1] leading-none tracking-tight break-words uppercase text-shadow-cinematic"
              onClick={() => onEditClick("profile")}
              title="Click to edit name"
            >
              {profile.fatherName}
            </h1>
            
            {/* TEXT BLOCK 2: Tagline */}
            <p 
              id="hero-tagline"
              className="font-serif text-xl sm:text-2xl text-neutral-400 italic font-light mt-6 pr-4 sm:pr-10 leading-relaxed border-l-2 border-neutral-700 pl-4"
              onClick={() => onEditClick("profile")}
            >
              {profile.tagline || "[Tagline Block Unfilled]"}
            </p>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <button
              onClick={() => document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-3 font-sans text-xs tracking-widest uppercase text-[#E8E6E1] hover:text-white transition-colors duration-300 font-medium cursor-pointer"
            >
              <span>Explore Gallery</span>
              <div className="p-2 border border-neutral-800 rounded-full group-hover:border-neutral-500 group-hover:translate-y-0.5 transition-all duration-300">
                <ArrowDown className="w-3 h-3 text-neutral-400" />
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* SPACER 1: LARGE SPACER */}
      <div id="spacer-1" className="h-10 md:h-20 flex items-center justify-center">
        <div className="w-[1px] h-16 bg-gradient-to-b from-neutral-800 to-transparent"></div>
      </div>

      {/* SECTION 3: THE ARTIST'S PHILOSOPHY [TEXT BLOCK 3] */}
      <section id="philosophy-section" className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-500">
            The Philosophy
          </span>
          <blockquote 
            id="philosophy-quote"
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E8E6E1]/90 leading-tight font-light italic"
            onClick={() => onEditClick("philosophy")}
          >
            {profile.philosophyQuote || `"[The Artist's Philosophy Column Is Unfilled]"`}
          </blockquote>
          <cite 
            id="philosophy-author"
            className="block font-serif text-lg tracking-wider text-neutral-400 mt-4 not-italic font-light"
            onClick={() => onEditClick("philosophy")}
          >
            &mdash; {profile.philosophyAuthor || "[Author Name]"}
          </cite>
        </motion.div>
      </section>

      {/* SPACER 2: LARGE SPACER */}
      <div id="spacer-2" className="h-10 md:h-20 flex items-center justify-center">
        <div className="w-[1px] h-16 bg-gradient-to-b from-neutral-800 to-transparent"></div>
      </div>

      {/* SECTION 4: THE JOURNEY BLOCK [TEXT BLOCK 4 & IMAGE BLOCK 2] */}
      <section 
        id="journey-section" 
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start scroll-mt-24"
      >
        {/* Left Side: Editorial Introduction Bio [TEXT BLOCK 4] */}
        <motion.div 
          id="journey-text-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2 block">
            {profile.journeyTitle || "THE JOURNEY"}
          </span>
          <div className="space-y-6 max-w-xl">
            {profile.journeyParagraphs.map((para, idx) => (
              <p 
                key={idx}
                id={`journey-para-${idx}`}
                className="font-serif text-lg sm:text-xl text-[#E8E6E1]/80 leading-relaxed font-light hover:bg-neutral-800/40 p-2 rounded transition-all duration-200 cursor-pointer"
                onClick={() => onEditClick("philosophy")}
                title="Click to edit biography"
              >
                {para}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Brushstroke/Studio Focus [IMAGE BLOCK 2] */}
        <motion.div 
          id="journey-image-block"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-5 flex flex-col group mt-4 lg:mt-0"
        >
          <div className="relative overflow-hidden bg-[#0D0D0D] border border-neutral-800/80 p-3.5 hover:border-neutral-500 transition-all duration-700 dream-glow rounded-sm">
            <div className="aspect-[4/3] relative overflow-hidden bg-neutral-900">
              <img
                id="brushstroke-detail-img"
                src={profile.brushstrokeUrl}
                alt={profile.brushstrokeCaption || "Brushstroke detail"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 opacity-90 hover:opacity-100"
              />
              <div className="absolute inset-0 bg-neutral-900/10 mix-blend-multiply"></div>
            </div>
          </div>
          {/* Caption */}
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mt-3">
            {profile.brushstrokeCaption || "[IMAGE BLOCK 2: Studio Shot or Brushstroke Detail]"}
          </span>
        </motion.div>
      </section>

    </div>
  );
}
