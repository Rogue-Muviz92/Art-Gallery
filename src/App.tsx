import React, { useState, useEffect } from "react";
import { Sliders, HelpCircle, Mail, Globe, ArrowUp, CheckCircle, Sparkles, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { set, get } from "idb-keyval";

import { ArtistProfile } from "./types";
import { defaultArtistProfile } from "./data";

// Custom Modular Components
import Navbar from "./components/Navbar";
import ArtistStory from "./components/ArtistStory";
import GalleryGrid from "./components/GalleryGrid";
import InquiryModal from "./components/InquiryModal";
import EditorPanel, { InquiryData } from "./components/EditorPanel";
import TermsModal from "./components/TermsModal";
import Gatekeeper from "./components/Gatekeeper";

export default function App() {
  const [profile, setProfile] = useState<ArtistProfile>(defaultArtistProfile);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load from local storage / IndexedDB
  useEffect(() => {
    async function initStorage() {
      try {
        let loadedProfile = defaultArtistProfile;
        
        // Try IndexedDB first (which supports huge base64 assets)
        let savedProfileRaw = await get("father_tribute_profile");
        
        // Fallback to localStorage if no DB value exists (migration)
        if (!savedProfileRaw) {
          const ls = localStorage.getItem("father_tribute_profile");
          if (ls) {
             savedProfileRaw = JSON.parse(ls);
          }
        }

        if (savedProfileRaw) {
          const parsed = savedProfileRaw as any;
          // Security / Version migration validations
          if (!(parsed.fatherName && (parsed.fatherName.includes("[YOUR") || parsed.fatherName === ""))) {
            if (parsed.contactText && (parsed.contactText.includes("archival reproductions") || parsed.contactText.includes("buying") || parsed.contactText.includes("purchasing") || parsed.contactTitle === "[TEXT BLOCK 5] — EXQUISITE ACQUISITIONS")) {
              parsed.contactTitle = defaultArtistProfile.contactTitle;
              parsed.contactText = defaultArtistProfile.contactText;
            }
            if (!parsed.painting6) parsed.painting6 = defaultArtistProfile.painting6;
            if (!parsed.painting7) parsed.painting7 = defaultArtistProfile.painting7;
            loadedProfile = parsed;
          }
        }
        setProfile(loadedProfile);

        // Load inquiries
        let savedInquiries = await get("father_tribute_inquiries");
        if (!savedInquiries) {
          const lsInfo = localStorage.getItem("father_tribute_inquiries");
          if (lsInfo) {
            savedInquiries = JSON.parse(lsInfo);
          }
        }
        if (savedInquiries) {
          setInquiries(savedInquiries as any);
        }

      } catch (e) {
        console.error("Storage load failed:", e);
      } finally {
        setIsDataLoaded(true);
      }
    }
    initStorage();
  }, []);

  // Sync state to local storage when changed
  useEffect(() => {
    if (!isDataLoaded) return;
    try {
      set("father_tribute_profile", profile).catch(e => console.warn(e));
      // For smaller configurations also update localStorage as quick fallback (might fail if big)
      try { localStorage.setItem("father_tribute_profile", JSON.stringify(profile)); } catch(e) {}
    } catch (error) {
      console.warn("Save sync error:", error);
    }
  }, [profile, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    try {
      set("father_tribute_inquiries", inquiries).catch(e => console.warn(e));
      try { localStorage.setItem("father_tribute_inquiries", JSON.stringify(inquiries)); } catch(e) {}
    } catch (error) {
      console.warn("Save sync error:", error);
    }
  }, [inquiries, isDataLoaded]);

  // UI States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState("profile");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [showGuideBanner, setShowGuideBanner] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasNewInquiryAlert, setHasNewInquiryAlert] = useState(false);
  
  // Inline write/editor states
  const [isEditingInquireInline, setIsEditingInquireInline] = useState(false);
  const [tempInquireTitle, setTempInquireTitle] = useState("");
  const [tempInquireText, setTempInquireText] = useState("");

  // Monitor page scroll for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler for adding a visitor inquiry
  const handleAddInquiry = (inq: { name: string; email: string; subject: string; message: string }) => {
    const newInquiry: InquiryData = {
      id: `inq_${Date.now()}`,
      ...inq,
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    setHasNewInquiryAlert(true);
  };

  const handleClearInquiries = () => {
    setInquiries([]);
    setHasNewInquiryAlert(false);
  };

  // Revert all customized settings back to original placeholders
  const handleResetToDefault = () => {
    setProfile(defaultArtistProfile);
    setIsEditorOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper trigger to open editor straight to a specific category
  const triggerEditor = (tabKey: string) => {
    setEditorTab(tabKey);
    setIsEditorOpen(true);
  };

  return (
    <Gatekeeper fatherName={profile.fatherName}>
      <div id="website-root-div" className="min-h-screen bg-[#1A1A1A] text-[#E8E6E1] flex flex-col font-sans selection:bg-neutral-700/50 overflow-x-hidden relative">
      
      {/* Cinematic Ambient Textures & Film Grain */}
      <div 
        className="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-[0.15]" 
        style={{ backgroundImage: "url('/src/assets/images/shadows_background_1782096342482.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/80 opacity-80" />

      {/* 1. INTRODUCTORY GUIDE BANNER */}
      <AnimatePresence>
        {showGuideBanner && (
          <motion.div
            id="guide-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#0D0D0D] text-slate-300 border-b border-neutral-800 text-xs py-3.5 px-6 relative z-50 text-center"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
              <span className="font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                DRAFT PREVIEW MODE
              </span>
              <p className="font-sans font-light">
                This website is structured exactly to your requested layout. You can click <strong>"Customize"</strong> or double-click text blocks, portrait fields, and paintings to insert your father's custom details and canvases!
              </p>
              <button
                onClick={() => triggerEditor("profile")}
                className="bg-neutral-800 text-[#E8E6E1] border border-neutral-700 font-semibold uppercase px-3 py-1 font-mono text-[10px] tracking-wider hover:bg-[#E8E6E1] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                Open Design Desk
              </button>
              
              <button
                onClick={() => setShowGuideBanner(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
                title="Dismiss help banner"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE STICKY HEADER NAVIGATION BAR */}
      <Navbar 
        logoText={profile.logoText} 
        onOpenEditor={() => triggerEditor("profile")}
        hasNewInquiries={hasNewInquiryAlert}
      />

      {/* MAIN LAYOUT CANVAS CONTAINER */}
      <main id="main-editorial-canvas" className="flex-grow pt-8 pb-20 relative z-10">
        
        {/* SECTIONS 2, 3, & 4: HERO / PORTRAIT, CENTRED QUOTE, AND JOURNEY STORY BIO */}
        <ArtistStory 
          profile={profile} 
          onEditClick={triggerEditor} 
        />

        {/* SPACER 3: LARGE SECTION SPACER */}
        <div id="spacer-3" className="h-12 md:h-24 flex items-center justify-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-neutral-800 to-transparent"></div>
        </div>

        {/* SECTION 5: GALLERY COMPONENT */}
        <GalleryGrid 
          profile={profile} 
          onEditPainting={(paintingKey) => triggerEditor(paintingKey)} 
        />

        {/* ENHANCEMENT DISCLAIMER */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-8 text-center select-none relative z-10">
          <div className="border-t border-neutral-900/50 pt-16">
            <p className="font-serif text-sm md:text-base text-neutral-400 italic font-light leading-relaxed max-w-3xl mx-auto">
              "While these images have been digitally enhanced to sharpen detail and optimize lighting, please note that every piece in this collection is an authentic, original oil painting created by hand."
            </p>
            <p className="font-serif text-sm text-neutral-500 italic font-light leading-relaxed max-w-2xl mx-auto mt-6">
              Each painting showcased here is an authentic hand-painted work of art; we have carefully adjusted the lighting and sharpness to ensure these digital representations best capture the depth and character of the original canvases.
            </p>
          </div>
        </section>

        {/* SPACER 4: LARGE SECTION SPACER */}
        <div id="spacer-4" className="h-12 md:h-24 flex items-center justify-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-neutral-800 to-transparent"></div>
        </div>

        {/* SECTION 6: INQUIRE CORRESPONDENCE BANNER */}
        <section id="inquire-section" className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="border border-neutral-800 bg-[#0F0F0F] p-10 md:p-14 space-y-8 relative overflow-hidden shadow-lg"
          >
            {/* Soft decorative ambient glow */}
            <div className="absolute -left-20 -top-20 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>

            <div className="space-y-4 max-w-xl mx-auto">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400 block font-semibold transition-colors">
                {profile.contactTitle || "EXQUISITE ACQUISITIONS"}
              </span>
              <p 
                id="inquire-callout-text"
                className="font-serif text-xl sm:text-2xl text-[#E8E6E1]/90 font-light leading-relaxed transition-colors duration-200"
              >
                {profile.contactText || "Want to see the full collection or inquire about a piece?"}
              </p>
            </div>

            {/* ELEGANT BUTTON: Get In Touch */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsContactModalOpen(true)}
              className="bg-[#E8E6E1] text-[#1A1A1A] hover:bg-white active:scale-95 font-sans text-xs uppercase tracking-[0.25em] font-semibold px-10 py-5 group transition-colors duration-500 shadow-2xl cursor-pointer inline-flex items-center gap-3 border border-white/10"
            >
              <Mail className="w-4 h-4 text-neutral-800 group-hover:text-black transition-colors" />
              <span>Get In Touch</span>
            </motion.button>
          </motion.div>
        </section>

      </main>

      {/* FOOTER BLOCK */}
      <footer id="app-footer" className="bg-[#0D0D0D] text-neutral-400 border-t border-neutral-900 py-10 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-neutral-500 text-xs font-mono text-center sm:text-left">
            <span>Copyright &copy; 2026</span>
            <span className="hidden sm:inline w-[1px] h-3 bg-neutral-800"></span>
            <span className="text-[#E8E6E1]/70 font-serif uppercase tracking-widest text-[10px]">Handcrafted Tribute</span>
            <span className="hidden sm:inline w-[1px] h-3 bg-neutral-800"></span>
            <span className="text-[#C5A880] text-[10px] sm:text-xs font-mono uppercase tracking-wider">Website created by Dvlper Md</span>
          </div>

          <div className="flex items-center gap-5 text-neutral-500 font-sans text-[10px] tracking-wider uppercase">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Archive Top
            </span>
            <span>&middot;</span>
            <span className="hover:text-[#C5A880] cursor-pointer transition-colors font-medium" onClick={() => setIsTermsModalOpen(true)}>
              Terms of Use
            </span>
            <span>&middot;</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => triggerEditor("profile")}>
              Layout Editor
            </span>
          </div>
        </div>
      </footer>

      {/* 3. INTERACTIVE CORRESPONDENCE MODAL (POPUP) */}
      <InquiryModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmitInquiry={(inq) => {
          handleAddInquiry(inq);
          if (!isEditorOpen) {
            setHasNewInquiryAlert(true);
          }
        }}
      />

      {/* TERMS OF USE & INTELLECTUAL PROPERTY MODAL */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        fatherName={profile.fatherName}
      />

      {/* 4. REAL-TIME EDITOR CONTROL DESK DRAWER */}
      <EditorPanel 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        profile={profile}
        onChangeProfile={(updated) => setProfile(updated)}
        inquiries={inquiries}
        onClearInquiries={handleClearInquiries}
        onResetToDefault={handleResetToDefault}
        initialTab={editorTab}
      />

      {/* Floating Customize Toggle at bottom-right of viewport */}
      <motion.button
        id="floating-editor-action-btn"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => triggerEditor("profile")}
        className="fixed bottom-6 right-6 z-30 bg-[#0D0D0D] hover:bg-white text-[#E8E6E1] hover:text-[#1A1A1A] py-4 px-5 rounded-full shadow-2xl flex items-center gap-2 group-hover:px-6 transition-all duration-300 font-sans text-xs uppercase tracking-widest font-semibold cursor-pointer border border-neutral-800 hover:border-white/20"
        title="Customize Layout Content"
      >
        <Sliders className="w-4 h-4 text-neutral-400" />
        <span className="hidden md:inline">Layout CMS</span>
      </motion.button>

      {/* Floating Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-top-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-30 bg-[#0D0D0D] hover:bg-neutral-800 text-neutral-400 hover:text-white p-3.5 rounded-full shadow-lg border border-neutral-800 transition-all cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
    </Gatekeeper>
  );
}
