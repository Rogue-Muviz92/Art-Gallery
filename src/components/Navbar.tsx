import React from "react";
import { Menu, X, Landmark, Sliders } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  logoText: string;
  onOpenEditor: () => void;
  hasNewInquiries: boolean;
}

export default function Navbar({ logoText, onOpenEditor, hasNewInquiries }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1A1A1A]/95 border-b border-neutral-900 transition-all duration-300">
      <div id="navbar-container" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
        {/* LOGO / Name Left */}
        <div 
          id="navbar-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Landmark className="w-5 h-5 text-neutral-400 transition-transform duration-500 group-hover:rotate-12" />
          <span className="font-serif text-sm tracking-[0.25em] uppercase text-[#E8E6E1]/90 group-hover:text-white transition-colors duration-300">
            {logoText || "[LOGO / Name Left]"}
          </span>
        </div>

        {/* Desktop Navigation Links [ Gallery | Journey ] */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-10">
          <button
            onClick={() => scrollToSection("gallery-section")}
            className="font-sans text-xs tracking-widest uppercase text-[#E8E6E1]/70 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Gallery
          </button>
          <div className="w-[1px] h-3 bg-neutral-800"></div>
          <button
            onClick={() => scrollToSection("journey-section")}
            className="font-sans text-xs tracking-widest uppercase text-[#E8E6E1]/70 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Journey
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#E8E6E1] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-neutral-800 bg-[#0D0D0D] px-6 py-6 space-y-4"
        >
          <button
            onClick={() => scrollToSection("gallery-section")}
            className="block w-full text-left font-sans text-sm tracking-widest uppercase text-[#E8E6E1] py-1 cursor-pointer"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection("journey-section")}
            className="block w-full text-left font-sans text-sm tracking-widest uppercase text-[#E8E6E1] py-1 cursor-pointer"
          >
            Journey
          </button>
        </motion.div>
      )}
    </header>
  );
}
