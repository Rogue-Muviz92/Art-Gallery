import React from "react";
import { X, Send, CheckCircle, Mail, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => void;
}

export default function InquiryModal({ isOpen, onClose, onSubmitInquiry }: InquiryModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("[General Inquiry] Retrospective Exhibition");
  const [message, setMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Clear fields
  const handleClose = () => {
    setName("");
    setEmail("");
    setSubject("[General Inquiry] Retrospective Exhibition");
    setMessage("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    // Simulate luxurious API delay
    setTimeout(() => {
      onSubmitInquiry({ name, email, subject, message });
      setSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="inquiry-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D0D0D]/95"
            onClick={handleClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#141414] border border-neutral-800 shadow-xl p-6 sm:p-8 overflow-hidden z-10 rounded-md"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-neutral-800"
              aria-label="Close Inquiry Form"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Custom Background Decal */}
            <div className="absolute -right-24 -bottom-24 w-60 h-60 bg-white/5 rounded-full pointer-events-none"></div>

            {/* Modal Content */}
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* Header */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] tracking-widest text-[#E8E6E1]/70 uppercase font-semibold flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-neutral-500" />
                    Secure Liaison
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#E8E6E1] tracking-wide">
                    ART INQUIRY & CORRESPONDENCE
                  </h3>
                  <p className="font-serif text-neutral-400 italic font-light text-xs">
                    Please submit your general message, feedback, or historical inquiries regarding the archive collection.
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Visitor Name */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
                      Your Full Name <span className="text-[#E8E6E1]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-neutral-500 outline-none px-3.5 py-2.5 text-sm text-[#E8E6E1] font-sans transition-colors rounded-none placeholder-neutral-600"
                    />
                  </div>

                  {/* Visitor Email */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
                      Email Address <span className="text-[#E8E6E1]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. eleanor@exhibition.com"
                      className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-neutral-500 outline-none px-3.5 py-2.5 text-sm text-[#E8E6E1] font-sans transition-colors rounded-none placeholder-neutral-600"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
                      Piece of Interest / Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Painting 1 (Hero Masterpiece)"
                      className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-neutral-500 outline-none px-3.5 py-2.5 text-sm text-[#E8E6E1] font-sans transition-colors rounded-none placeholder-neutral-600"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please direct your message here. For instance: 'I am deeply moved by the atmospheric landscapes. The color tones perfectly capture the quiet stillness of that era.'"
                      className="w-full bg-[#0D0D0D] border border-neutral-800 focus:border-neutral-500 outline-none px-3.5 py-2.5 text-sm text-[#E8E6E1] font-sans transition-colors rounded-none placeholder-neutral-600 resize-none h-28"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#E8E6E1] hover:bg-white active:scale-[0.98] text-[#1A1A1A] font-sans text-xs uppercase tracking-widest px-6 py-4.5 font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:pointer-events-none border border-white/5"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin border-2 border-t-transparent border-[#1A1A1A] w-3 h-3 rounded-full" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Correspondence</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-2 flex flex-col items-center text-center space-y-6"
              >
                <div className="p-4 bg-neutral-800/40 border border-neutral-700 rounded-full text-neutral-300 animate-bounce">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-light text-[#E8E6E1] uppercase tracking-wide">
                    Correspondence Sent
                  </h3>
                  <p className="font-serif text-neutral-400 italic font-light text-sm max-w-sm">
                    Thank you, {name}. Your inquiry has been logged securely in this presentation prototype.
                  </p>
                </div>
                <p className="font-mono text-[9px] uppercase text-neutral-500 max-w-xs border border-neutral-850 bg-[#0D0D0D] px-3 py-1.5 leading-normal">
                  Mock ID logged in Admin Customizer Panel. Press Esc or click Close to return.
                </p>
                <button
                  onClick={handleClose}
                  className="font-sans text-xs tracking-widest uppercase text-neutral-400 hover:text-white transition-colors font-medium border border-neutral-800 hover:border-neutral-500 px-6 py-3 cursor-pointer mt-6"
                >
                  Return to Archive
                </button>
              </motion.div>
            )}
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
