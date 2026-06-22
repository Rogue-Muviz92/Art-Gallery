import React, { useRef } from "react";
import { 
  X, Save, FileCode, RotateCcw, Image, 
  User, BookOpen, Layers, Inbox, Upload, Download, Sparkles, Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ArtistProfile, Painting } from "../types";

// Static inquiry interface
export interface InquiryData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

interface EditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ArtistProfile;
  onChangeProfile: (updated: ArtistProfile) => void;
  inquiries: InquiryData[];
  onClearInquiries: () => void;
  onResetToDefault: () => void;
  initialTab?: string;
}

export default function EditorPanel({ 
  isOpen, 
  onClose, 
  profile, 
  onChangeProfile, 
  inquiries, 
  onClearInquiries, 
  onResetToDefault,
  initialTab = "profile"
}: EditorPanelProps) {
  
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [selectedPaintingKey, setSelectedPaintingKey] = React.useState<
    "painting1" | "painting2" | "painting3" | "painting4" | "painting5" | "painting6" | "painting7"
  >("painting1");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // File input refs
  const fileInputPortrait = useRef<HTMLInputElement>(null);
  const fileInputBrushstroke = useRef<HTMLInputElement>(null);
  const fileInputPainting = useRef<HTMLInputElement>(null);

  // Watch for external tab change trigger
  React.useEffect(() => {
    if (isOpen && initialTab) {
      if (initialTab.startsWith("painting")) {
        setActiveTab("paintings");
        setSelectedPaintingKey(initialTab as any);
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  // Helper to trigger save confirmation
  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Update text field generic handler
  const handleUpdateField = (key: keyof ArtistProfile, value: any) => {
    onChangeProfile({
      ...profile,
      [key]: value
    });
    triggerSaveNotification();
  };

  // Update specific paragraph
  const handleUpdateParagraph = (index: number, text: string) => {
    const updatedParagraphs = [...profile.journeyParagraphs];
    updatedParagraphs[index] = text;
    onChangeProfile({
      ...profile,
      journeyParagraphs: updatedParagraphs
    });
    triggerSaveNotification();
  };

  // Add paragraph helper
  const handleAddParagraph = () => {
    onChangeProfile({
      ...profile,
      journeyParagraphs: [...profile.journeyParagraphs, "[Add another stunning paragraph here. Keep it structured and moving.]"]
    });
    triggerSaveNotification();
  };

  // Delete paragraph helper
  const handleDeleteParagraph = (index: number) => {
    if (profile.journeyParagraphs.length <= 1) return; // Keep at least one
    const updatedParagraphs = profile.journeyParagraphs.filter((_, idx) => idx !== index);
    onChangeProfile({
      ...profile,
      journeyParagraphs: updatedParagraphs
    });
    triggerSaveNotification();
  };

  // Update painting field helper
  const handleUpdatePaintingField = (paintingKey: keyof ArtistProfile, field: keyof Painting, value: string) => {
    const targetPainting = { ...(profile[paintingKey] as Painting) };
    targetPainting[field] = value;
    onChangeProfile({
      ...profile,
      [paintingKey]: targetPainting
    });
    triggerSaveNotification();
  };

  // File base64 reader helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "portrait" | "brushstroke" | "painting") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.2 * 1024 * 1024) {
      alert("Note: This image file is quite large. To ensure performance and local session storage stability, we recommend using images under 1MB, or linking public URLs.");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (fieldName === "portrait") {
        handleUpdateField("portraitUrl", base64String);
      } else if (fieldName === "brushstroke") {
        handleUpdateField("brushstrokeUrl", base64String);
      } else if (fieldName === "painting") {
        handleUpdatePaintingField(selectedPaintingKey, "url", base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  // Download entire config JSON
  const handleDownloadBackup = () => {
    const rawName = profile.fatherName.replace(/[\[\]]/g, "").trim() || "Artist_Tribute";
    const cleanFileName = `${rawName.replace(/\s+/g, "_")}_Layout_Backup.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", cleanFileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import uploaded JSON config
  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.fatherName && parsed.painting1 && parsed.painting5) {
          onChangeProfile(parsed);
          triggerSaveNotification();
          alert("Exhibition configuration loaded successfully!");
        } else {
          alert("Error: File does not appear to be a valid backup. Missing key tribute fields.");
        }
      } catch (err) {
        alert("Failed to read file as JSON data.");
      }
    };
    fileReader.readAsText(file, "UTF-8");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="editor-layout-overlay" className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex">
          
          {/* Backdrop screen split */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 md:hidden"
            onClick={onClose}
          />

          {/* Core Panel Card */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full h-full bg-[#141414] text-[#E8E6E1] shadow-2xl flex flex-col border-l border-neutral-800/80 font-sans"
          >
            
            {/* PANEL HEADER */}
            <div id="panel-header" className="p-6 border-b border-neutral-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-neutral-400 animate-pulse" />
                <div>
                  <h3 className="font-serif text-lg tracking-wide text-[#E8E6E1] font-light uppercase">
                    Artist Layout CMS
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase">
                    Real-Time Editorial Desk
                  </p>
                </div>
              </div>

              {/* Status Saved bubble & Global Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadBackup}
                  className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                  title="Export setting to prevent memory wipe on refresh"
                >
                  <Download className="w-3 h-3" /> Save Config
                </button>
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="hidden md:flex items-center gap-1 text-[10px] font-mono uppercase text-emerald-400 px-1 py-0.5"
                    >
                      <Check className="w-3 h-3" />
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={onClose}
                  className="p-1 text-neutral-400 hover:text-white transition-colors"
                  title="Close customizer panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* TAB SELECTOR CONTROL BAR */}
            <div id="panel-tabs" className="grid grid-cols-4 border-b border-neutral-850 bg-black/45 text-xs font-mono tracking-widest text-[#E8E6E1]/50">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-3.5 flex flex-col items-center gap-1 text-[9px] uppercase border-r border-[#E8E6E1]/5 transition-colors cursor-pointer ${activeTab === "profile" ? "bg-[#141414] text-[#E8E6E1] font-semibold border-b-2 border-neutral-500" : "hover:text-[#E8E6E1] hover:bg-neutral-800/20"}`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab("philosophy")}
                className={`py-3.5 flex flex-col items-center gap-1 text-[9px] uppercase border-r border-[#E8E6E1]/5 transition-colors cursor-pointer ${activeTab === "philosophy" ? "bg-[#141414] text-[#E8E6E1] font-semibold border-b-2 border-neutral-500" : "hover:text-[#E8E6E1] hover:bg-neutral-800/20"}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bio/Quote</span>
              </button>

              <button
                onClick={() => setActiveTab("paintings")}
                className={`py-3.5 flex flex-col items-center gap-1 text-[9px] uppercase border-r border-[#E8E6E1]/5 transition-colors cursor-pointer ${activeTab === "paintings" ? "bg-[#141414] text-[#E8E6E1] font-semibold border-b-2 border-neutral-500" : "hover:text-[#E8E6E1] hover:bg-neutral-800/20"}`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Canvases</span>
              </button>

              <button
                onClick={() => setActiveTab("data")}
                className={`relative py-3.5 flex flex-col items-center gap-1 text-[9px] uppercase transition-colors cursor-pointer ${activeTab === "data" ? "bg-[#141414] text-[#E8E6E1] font-semibold border-b-2 border-neutral-500" : "hover:text-[#E8E6E1] hover:bg-neutral-800/20"}`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Inquiries</span>
                {inquiries.length > 0 && (
                  <span className="absolute top-2 right-4 bg-neutral-700 text-white rounded-full text-[8px] font-bold px-1.5 min-w-4 h-4 flex items-center justify-center animate-pulse">
                    {inquiries.length}
                  </span>
                )}
              </button>
            </div>

            {/* SCROLLABLE FORM VIEWER */}
            <div id="panel-form-content" className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {/* TAB 1: ARTIST PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-6 text-left">
                  <div className="border-l border-[#C5A880] pl-3 py-1 mb-4">
                    <h4 className="font-serif text-sm text-[#FAF9F5] uppercase tracking-wider font-light">Hero Profile Titles</h4>
                    <p className="text-[10px] text-neutral-400">Configure your father's main headings and landscape intro</p>
                  </div>

                  {/* Father Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Father's Name (Massive Serif Text)</label>
                    <input
                      type="text"
                      value={profile.fatherName}
                      onChange={(e) => handleUpdateField("fatherName", e.target.value)}
                      placeholder="Enter Father's Name"
                      className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white"
                    />
                  </div>

                  {/* Logo / Left-Text */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Navbar Brand / Logo Left Column</label>
                    <input
                      type="text"
                      value={profile.logoText}
                      onChange={(e) => handleUpdateField("logoText", e.target.value)}
                      placeholder="e.g. Eleanor Vance Tribute"
                      className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white"
                    />
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Sleek, Poetic Tagline [TEXT BLOCK 2]</label>
                    <textarea
                      rows={3}
                      value={profile.tagline}
                      onChange={(e) => handleUpdateField("tagline", e.target.value)}
                      placeholder="Short sentence setting the atmosphere..."
                      className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white resize-none"
                    />
                  </div>

                  {/* Contact Section Direct Editing */}
                  <div className="space-y-1.5 border-t border-[#FAF9F5]/10 pt-4">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#C5A880]">Section Title [TEXT BLOCK 5]</label>
                    <input
                      type="text"
                      value={profile.contactTitle || ""}
                      onChange={(e) => handleUpdateField("contactTitle", e.target.value)}
                      placeholder="[TEXT BLOCK 5] — EXQUISITE ACQUISITIONS"
                      className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#C5A880]">Section Invitation Prompt [TEXT BLOCK 5]</label>
                    <textarea
                      rows={3}
                      value={profile.contactText}
                      onChange={(e) => handleUpdateField("contactText", e.target.value)}
                      placeholder="For archival reproductions, inquiries..."
                      className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white resize-none"
                    />
                  </div>

                  {/* IMAGE BLOCK 1: PORTRAIT CONTROLS */}
                  <div className="border-[#FAF9F5]/10 pt-4 border-t space-y-4">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-semibold">
                      [IMAGE BLOCK 1] Father's Portrait
                    </span>
                    
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-neutral-900 border border-neutral-700 overflow-hidden flex-shrink-0">
                        <img 
                          src={profile.portraitUrl} 
                          alt="Portrait thumbnail" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        {/* Action file upload button */}
                        <button
                          type="button"
                          onClick={() => fileInputPortrait.current?.click()}
                          className="flex items-center gap-2 bg-[#FAF9F5]/10 hover:bg-[#FAF9F5]/20 text-xs px-3.5 py-2 border border-[#FAF9F5]/15 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Local File</span>
                        </button>
                        <input
                          ref={fileInputPortrait}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "portrait")}
                          className="hidden"
                        />
                        <p className="text-[10px] text-neutral-400 italic">Accepts JPG/PNG lightweight files</p>
                      </div>
                    </div>

                    {/* Image URL input */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">Alternate Portrait Web URL</label>
                      <input
                        type="text"
                        value={profile.portraitUrl.startsWith("data:") ? "" : profile.portraitUrl}
                        onChange={(e) => e.target.value && handleUpdateField("portraitUrl", e.target.value)}
                        placeholder="Paste an external picture link if preferred..."
                        className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-xs font-mono transition-colors text-slate-300"
                      />
                    </div>

                    {/* Caption */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Portrait Subcaption</label>
                      <input
                        type="text"
                        value={profile.portraitCaption}
                        onChange={(e) => handleUpdateField("portraitCaption", e.target.value)}
                        placeholder="Father's Studio Frame, 2026"
                        className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: BIOGRAPHY & PHILOSOPHY */}
              {activeTab === "philosophy" && (
                <div className="space-y-6 text-left">
                  
                  {/* QUOTE BLOCK 3 */}
                  <div className="border-l border-[#C5A880] pl-3 py-1 mb-4">
                    <h4 className="font-serif text-sm text-[#FAF9F5] uppercase tracking-wider font-light">
                      Philosophy & Statement
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Edit the massive stylized quote block centered [TEXT BLOCK 3]
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Philosophy Statement Quote Text
                    </label>
                    <textarea
                      rows={3}
                      value={profile.philosophyQuote}
                      onChange={(e) => handleUpdateField("philosophyQuote", e.target.value)}
                      placeholder="Art does not reproduce what we see..."
                      className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Quote Author or Attribute Code
                    </label>
                    <input
                      type="text"
                      value={profile.philosophyAuthor}
                      onChange={(e) => handleUpdateField("philosophyAuthor", e.target.value)}
                      placeholder="Your Father's Name or Artist Attribution"
                      className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white"
                    />
                  </div>

                  {/* JOURNEY BIOGRAPHY NARRATIVE */}
                  <div className="border-t border-[#FAF9F5]/10 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-semibold">
                        [TEXT BLOCK 4] THE JOURNEY (PARAGRAPHS)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddParagraph}
                        className="text-[10px] font-mono uppercase text-[#C5A880] hover:text-white flex items-center gap-1 bg-[#C5A880]/10 px-2 py-1 rounded"
                      >
                        + Add Para
                      </button>
                    </div>

                    <p className="text-[10px] text-neutral-400 italic">
                      Write 2-3 detailed introduction paragraphs. These display seamlessly as individual blocks in the story section.
                    </p>

                    <div className="space-y-4">
                      {profile.journeyParagraphs.map((para, idx) => (
                        <div key={idx} className="space-y-2 border border-neutral-800 p-3 bg-black/20">
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                            <span>Paragraph #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteParagraph(idx)}
                              className="text-red-400 hover:text-red-300"
                              disabled={profile.journeyParagraphs.length <= 1}
                            >
                              Remove
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={para}
                            onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                            className="w-full bg-[#121110] border border-[#FAF9F5]/5 focus:border-[#C5A880] outline-none px-3 py-2 text-xs text-slate-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IMAGE BLOCK 2: DETAIL PHOTO */}
                  <div className="border-t border-[#FAF9F5]/10 pt-4 space-y-4">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-semibold">
                      [IMAGE BLOCK 2] Journey Accent Photo
                    </span>
                    
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-neutral-900 border border-neutral-700 overflow-hidden flex-shrink-0">
                        <img 
                          src={profile.brushstrokeUrl} 
                          alt="Brushstroke thumbnail" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => fileInputBrushstroke.current?.click()}
                          className="flex items-center gap-2 bg-[#FAF9F5]/10 hover:bg-[#FAF9F5]/20 text-xs px-3 py-2 border border-[#FAF9F5]/15 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Local File</span>
                        </button>
                        <input
                          ref={fileInputBrushstroke}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "brushstroke")}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">Brushstroke Accent Caption</label>
                      <input
                        type="text"
                        value={profile.brushstrokeCaption}
                        onChange={(e) => handleUpdateField("brushstrokeCaption", e.target.value)}
                        placeholder="Close-up of physical oils on canvas panel"
                        className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm font-sans transition-colors text-white"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: ARTWORK CANVASES */}
              {activeTab === "paintings" && (
                <div className="space-y-6 text-left">
                  
                  <div className="border-l border-neutral-600 pl-3 py-1 mb-4">
                    <h4 className="font-serif text-sm text-[#E8E6E1] uppercase tracking-wider font-light">
                      Masterpiece Canvas Selector
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Choose which visual block in the exhibition layout you wish to customize.
                    </p>
                  </div>

                  {/* Grid button selectors */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                    <button
                      onClick={() => setSelectedPaintingKey("painting1")}
                      className={`p-2 border text-center transition-all cursor-pointer ${
                        selectedPaintingKey === "painting1"
                          ? "bg-[#E8E6E1] text-[#141414] border-white font-bold"
                          : "bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Piece 1 (Hero)
                    </button>
                    <button
                      onClick={() => setSelectedPaintingKey("painting2")}
                      className={`p-2 border text-center transition-all cursor-pointer ${
                        selectedPaintingKey === "painting2"
                          ? "bg-[#E8E6E1] text-[#141414] border-white font-bold"
                          : "bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Piece 2 (Small)
                    </button>
                    <button
                      onClick={() => setSelectedPaintingKey("painting3")}
                      className={`p-2 border text-center transition-all cursor-pointer ${
                        selectedPaintingKey === "painting3"
                          ? "bg-[#E8E6E1] text-[#141414] border-white font-bold"
                          : "bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Piece 3 (Small)
                    </button>
                    <button
                      onClick={() => setSelectedPaintingKey("painting4")}
                      className={`p-2 border text-center transition-all cursor-pointer ${
                        selectedPaintingKey === "painting4"
                          ? "bg-[#E8E6E1] text-[#141414] border-white font-bold"
                          : "bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Piece 4 (Med)
                    </button>
                    <button
                      onClick={() => setSelectedPaintingKey("painting5")}
                      className={`p-2 border text-center transition-all cursor-pointer ${
                        selectedPaintingKey === "painting5"
                          ? "bg-[#E8E6E1] text-[#141414] border-white font-bold"
                          : "bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Piece 5 (Med)
                    </button>
                    <button
                      onClick={() => setSelectedPaintingKey("painting6")}
                      className={`p-2 border text-center transition-all cursor-pointer ${
                        selectedPaintingKey === "painting6"
                          ? "bg-[#E8E6E1] text-[#141414] border-white font-bold"
                          : "bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Piece 6 (Row)
                    </button>
                    <button
                      onClick={() => setSelectedPaintingKey("painting7")}
                      className={`p-2 border text-center transition-all cursor-pointer ${
                        selectedPaintingKey === "painting7"
                          ? "bg-[#E8E6E1] text-[#141414] border-white font-bold"
                          : "bg-[#0D0D0D] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Piece 7 (Row)
                    </button>
                  </div>

                  {/* ACTIVE PAINTING DETAILS */}
                  <div className="border border-neutral-800 bg-[#0D0D0D]/40 p-4 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-neutral-800">
                      <span className="uppercase">Editing Block: {selectedPaintingKey}</span>
                      <span className="text-[10px] text-neutral-500 uppercase italic">
                        {selectedPaintingKey === "painting1" ? "Huge Hero Block" : selectedPaintingKey.includes("2") || selectedPaintingKey.includes("3") ? "Small Stack" : "Medium Row"}
                      </span>
                    </div>

                    {/* Image visual upload */}
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Painting Showcase Image</label>
                      
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-black border border-neutral-700 overflow-hidden flex-shrink-0">
                          <img 
                            src={profile[selectedPaintingKey].url} 
                            alt="Selected painting" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-grow space-y-2">
                          <button
                            type="button"
                            onClick={() => fileInputPainting.current?.click()}
                            className="flex items-center gap-2 bg-[#FAF9F5]/10 hover:bg-[#FAF9F5]/20 text-xs px-3.5 py-2 border border-[#FAF9F5]/15 transition-all cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Painting File</span>
                          </button>
                          <input
                            ref={fileInputPainting}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "painting")}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image URL input alternative */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-neutral-400">Or Paste Painting Photo URL Link</label>
                      <input
                        type="text"
                        value={profile[selectedPaintingKey].url.startsWith("data:") ? "" : profile[selectedPaintingKey].url}
                        onChange={(e) => e.target.value && handleUpdatePaintingField(selectedPaintingKey, "url", e.target.value)}
                        placeholder="Link to online portrait jpeg/png if preferred..."
                        className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2 text-xs font-mono text-slate-300"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">Artwork Title</label>
                      <input
                        type="text"
                        value={profile[selectedPaintingKey].title}
                        onChange={(e) => handleUpdatePaintingField(selectedPaintingKey, "title", e.target.value)}
                        className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>

                    {/* Grid metadata Year, Medium, size */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">Year Created</label>
                        <input
                          type="text"
                          value={profile[selectedPaintingKey].year}
                          onChange={(e) => handleUpdatePaintingField(selectedPaintingKey, "year", e.target.value)}
                          placeholder="e.g. 2026"
                          className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2 text-sm text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase text-neutral-400">Dimensions</label>
                        <input
                          type="text"
                          value={profile[selectedPaintingKey].dimensions}
                          onChange={(e) => handleUpdatePaintingField(selectedPaintingKey, "dimensions", e.target.value)}
                          placeholder="e.g. 180 x 140 cm"
                          className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">Media Materials (e.g. Oil on Canvas)</label>
                      <input
                        type="text"
                        value={profile[selectedPaintingKey].medium}
                        onChange={(e) => handleUpdatePaintingField(selectedPaintingKey, "medium", e.target.value)}
                        className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3.5 py-2 text-sm text-white"
                      />
                    </div>

                    {/* Canvas Description */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400">Short Canvas Narrative/Description</label>
                      <textarea
                        rows={2}
                        value={profile[selectedPaintingKey].description}
                        onChange={(e) => handleUpdatePaintingField(selectedPaintingKey, "description", e.target.value)}
                        className="w-full bg-[#121110] border border-[#E6E2D8]/10 focus:border-[#C5A880] outline-none px-3 py-2 text-xs text-white resize-none"
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 4: MOCK CORRESPONDENCE & ARCHIVE ACTIONS */}
              {activeTab === "data" && (
                <div className="space-y-6 text-left">
                  
                  {/* INBOX SECTION */}
                  <div className="border-l border-[#C5A880] pl-3 py-1 mb-4">
                    <h4 className="font-serif text-sm text-[#FAF9F5] uppercase tracking-wider font-light">
                      Liaison Mailbox ({inquiries.length})
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Logged messages received from the "Get In Touch" visitor contact button
                    </p>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-neutral-800 text-neutral-500 rounded space-y-2">
                      <Inbox className="w-8 h-8 mx-auto text-neutral-700" />
                      <p className="font-serif italic text-xs">No correspondence logged in this session yet.</p>
                      <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-600">
                        Try clicking "Get In Touch" and sending a test message!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-neutral-500 uppercase">Interactive Logs</span>
                        <button
                          onClick={onClearInquiries}
                          className="text-red-400 hover:text-red-300 transition-colors uppercase"
                        >
                          Wipe Logs
                        </button>
                      </div>

                      <div className="space-y-3.5 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                        {inquiries.map((inq) => (
                          <div key={inq.id} className="p-3 border border-neutral-800 bg-neutral-900 flex flex-col gap-1 text-xs">
                            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                              <span className="font-bold text-[#C5A880]">{inq.name}</span>
                              <span>{inq.date}</span>
                            </div>
                            <span className="text-neutral-400 font-mono text-[10px]">{inq.email}</span>
                            <span className="text-white font-medium mt-1 font-serif">{inq.subject}</span>
                            <p className="text-neutral-300 italic font-serif leading-relaxed mt-1 border-t border-neutral-800/60 pt-2.5">
                              "{inq.message}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DATA BACKUP & RESTORE ACTIONS */}
                  <div className="border-t border-[#FAF9F5]/10 pt-6 space-y-4">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-semibold">
                      ARCHIVAL DATA SYSTEM
                    </span>
                    <p className="text-[10px] text-neutral-400 italic">
                      Prevent browser memory wipes! Export your customized canvas exhibition layout config as a JSON file, or restore a prior backup.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      {/* Download Button */}
                      <button
                        type="button"
                        onClick={handleDownloadBackup}
                        className="flex items-center justify-center gap-2 bg-[#FAF9F5]/10 hover:bg-[#FAF9F5]/15 border border-[#FAF9F5]/10 p-3 text-[#FAF9F5] transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Export JSON</span>
                      </button>

                      {/* Upload Button */}
                      <label className="flex items-center justify-center gap-2 bg-[#E8E6E1]/10 hover:bg-[#E8E6E1]/15 border border-neutral-800 p-3 text-[#E8E6E1] transition-all cursor-pointer text-center">
                        <Upload className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Import Backup</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleUploadBackup}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-2">
                       <button
                        type="button"
                        onClick={() => {
                          if (confirm("Are you absolutely sure you want to revert all changes to the original unfilled placeholder art layouts?")) {
                            onResetToDefault();
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 border border-red-950/40 active:scale-[0.99] hover:bg-red-950/20 p-3 text-red-400/80 transition-all font-mono text-[10px] uppercase cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Aesthetic Defaults</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* PANEL FOOTER ACTIONS */}
            <div id="panel-footer" className="p-4 bg-black/45 border-t border-neutral-850 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Status: Synchronized locally</span>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#E8E6E1] text-[#1A1A1A] font-semibold tracking-wider font-sans text-xs uppercase px-5 py-2.5 hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
              >
                Close Desk
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
