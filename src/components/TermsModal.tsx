import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Copyright, FileText, Ban, AlertTriangle } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatherName: string;
}

export default function TermsModal({ isOpen, onClose, fatherName }: TermsModalProps) {
  // Prevent background scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const actualFatherName = fatherName || "Zia-ud-din Hassan";

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="terms-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#060606]/98"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-[#0A0A0A] border border-neutral-850 shadow-xl flex flex-col rounded-sm z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-900 flex items-start justify-between gap-4 shrink-0 bg-[#0C0C0C]">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A880] flex items-center gap-1.5 font-semibold">
                  <Shield className="w-3 h-3" />
                  LEGAL NOTICES
                </span>
                <h3 className="font-sans text-lg md:text-xl font-bold tracking-wide text-[#E8E6E1] uppercase">
                  Intellectual Property & Terms of Use
                </h3>
              </div>
              
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-white p-1 rounded-sm border border-transparent hover:border-neutral-800 transition-all cursor-pointer"
                aria-label="Close legal modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Document Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 text-left font-sans text-neutral-300 text-sm leading-relaxed custom-scrollbar">
              
              {/* Introduction Banner */}
              <div className="bg-[#0E0E0E] border-l-2 border-[#C5A880] p-4 font-serif italic text-[#E8E6E1]/90 rounded-sm">
                "To protect the lifelong, quiet memories and artistic legacy of {actualFatherName}, we kindly request that visitors review and abide by the terms set below. Thank you for respecting this sanctuary."
              </div>

              {/* Section 1 */}
              <div id="terms-section-1" className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#E8E6E1] flex items-center gap-2">
                  <span className="font-mono text-xs text-[#C5A880]">1.</span>
                  Ownership of Content
                </h4>
                <p className="pl-5 text-neutral-400">
                  All content presented on this website, including but not limited to the paintings, images, photography, text, design, and layout, is the exclusive intellectual property of <strong className="text-[#E8E6E1]">{actualFatherName}</strong> and is protected by international copyright laws. All rights reserved.
                </p>
              </div>

              {/* Section 2 */}
              <div id="terms-section-2" className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#E8E6E1] flex items-center gap-2">
                  <span className="font-mono text-xs text-[#C5A880]">2.</span>
                  Limited Viewing License
                </h4>
                <p className="pl-5 text-neutral-400">
                  This website is intended solely for personal, non-commercial, and private viewing purposes. Visitors are granted a limited, non-exclusive, non-transferable license to access and view the content on this site as it is displayed. This license does not grant you any ownership or rights to the content.
                </p>
              </div>

              {/* Section 3 */}
              <div id="terms-section-3" className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#E8E6E1] flex items-center gap-2">
                  <span className="font-mono text-xs text-[#C5A880]">3.</span>
                  Prohibited Conduct (No Copying or Distribution)
                </h4>
                <p className="pl-5 text-neutral-400 mb-2">
                  You are strictly prohibited from doing any of the following without prior express written consent from <strong className="text-[#E8E6E1]">{actualFatherName}</strong>:
                </p>
                <div className="pl-5 space-y-4 pt-1">
                  <div className="flex gap-3">
                    <div className="mt-0.5"><Copyright className="w-3.5 h-3.5 text-neutral-500 shrink-0" /></div>
                    <div>
                      <span className="font-bold text-[#E8E6E1] block text-xs tracking-wide uppercase">Reproduction</span>
                      <span className="text-neutral-400 text-xs">Copying, downloading, screen-capturing, or printing any artwork or text.</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5"><FileText className="w-3.5 h-3.5 text-neutral-500 shrink-0" /></div>
                    <div>
                      <span className="font-bold text-[#E8E6E1] block text-xs tracking-wide uppercase">Redistribution</span>
                      <span className="text-neutral-400 text-xs">Sharing, uploading, or posting any material from this site to other websites, social media platforms, or digital portfolios.</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5"><Ban className="w-3.5 h-3.5 text-neutral-500 shrink-0" /></div>
                    <div>
                      <span className="font-bold text-[#E8E6E1] block text-xs tracking-wide uppercase">Modification</span>
                      <span className="text-neutral-400 text-xs">Altering, editing, or creating derivative works based on the paintings or website design.</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5"><AlertTriangle className="w-3.5 h-3.5 text-neutral-500 shrink-0" /></div>
                    <div>
                      <span className="font-bold text-[#E8E6E1] block text-xs tracking-wide uppercase">Commercial Use</span>
                      <span className="text-neutral-400 text-xs">Selling, licensing, or using any content for commercial gain or advertising purposes.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div id="terms-section-4" className="space-y-3">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#E8E6E1] flex items-center gap-2">
                  <span className="font-mono text-xs text-[#C5A880]">4.</span>
                  Digital Piracy & Unauthorized Use
                </h4>
                <p className="pl-5 text-neutral-400">
                  Any unauthorized reproduction, distribution, or public display of the materials found on this website constitutes a violation of copyright law. We utilize digital monitoring tools to protect our work. Any unauthorized use of our intellectual property will be investigated, and we reserve the right to pursue all available legal remedies, including but not limited to cease-and-desist orders, financial damages, and legal action to the fullest extent of the law.
                </p>
              </div>

              {/* Section 5 */}
              <div id="terms-section-5" className="space-y-3 border-t border-neutral-900 pt-6">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#E8E6E1] flex items-center gap-2">
                  <span className="font-mono text-xs text-[#C5A880]">5.</span>
                  Inquiries & Permission
                </h4>
                <p className="pl-5 text-neutral-400">
                  If you wish to request permission to use any of the content for educational, editorial, or commercial purposes, please contact us directly at:{" "}
                  <a
                    href="mailto:dvlpermd@gmail.com"
                    className="text-[#C5A880] hover:text-[#E8E6E1] underline underline-offset-4 transition-colors font-mono"
                  >
                    dvlpermd@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="p-5 border-t border-neutral-900 bg-[#0C0C0C] flex items-center justify-end shrink-0">
              <button
                onClick={onClose}
                className="bg-[#E8E6E1] text-[#1A1A1A] hover:bg-white px-5 py-2 font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-colors rounded-sm"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
