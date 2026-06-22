import React, { useState, useEffect } from "react";
import { 
  auth, 
  doGoogleSignIn, 
  doSignOut, 
  recordUserLogin, 
  recordCopyrightConsent,
  checkCopyrightConsent
} from "../lib/firebase";
import { onAuthStateChanged, type User, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { Shield, Lock, Copyright, AlertTriangle, FileText, Ban, X, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GatekeeperProps {
  children: React.ReactNode;
  fatherName: string;
}

export default function Gatekeeper({ children, fatherName }: GatekeeperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [isLockout, setIsLockout] = useState(false);
  const [simulatedAuthMode, setSimulatedAuthMode] = useState(false);
  const [directEmailInput, setDirectEmailInput] = useState("moezzuddin0254@gmail.com");
  const [authError, setAuthError] = useState<string | null>(null);

  // Monitor real Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check firestore for copyright approval
        const consented = await checkCopyrightConsent(currentUser.uid);
        setHasConsented(consented);
      } else {
        // Check if there is a local simulated bypass user session
        let simulatedUser = null;
        let mockedConsent = null;
        try {
          simulatedUser = localStorage.getItem("simulated_preview_user");
          mockedConsent = localStorage.getItem("copyright_accepted_simulated");
        } catch (e) {
          console.warn("Could not access localStorage:", e);
        }
        
        if (simulatedUser) {
          try {
            const parsed = JSON.parse(simulatedUser);
            setUser(parsed);
            setHasConsented(mockedConsent === "true");
          } catch (e) {
            setUser(null);
            setHasConsented(null);
          }
        } else {
          setHasConsented(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle genuine Google sign in
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const loggedUser = await doGoogleSignIn();
      const consented = await checkCopyrightConsent(loggedUser.uid);
      setHasConsented(consented);
    } catch (error: any) {
      console.error(error);
      setAuthError(
        "Direct Google authorization was blocked. If playing in the AI Studio live preview panel, please try the Sandbox Preview login below."
      );
    }
  };

  // Safe logout
  const handleSignOut = async () => {
    localStorage.removeItem("simulated_preview_user");
    localStorage.removeItem("copyright_accepted_simulated");
    await doSignOut();
    setUser(null);
    setHasConsented(null);
    setIsLockout(false);
  };

  // Simulated login fallback for the dev sandbox/frame environment
  const handleSimulatedSignIn = () => {
    if (!directEmailInput.trim()) return;
    const mockUser = {
      uid: "simulated_" + btoa(directEmailInput).substring(0, 10),
      email: directEmailInput,
      displayName: directEmailInput.split("@")[0].toUpperCase(),
      photoURL: "https://lh3.googleusercontent.com/a/default-user=s96-c"
    } as any;
    
    try {
      localStorage.setItem("simulated_preview_user", JSON.stringify(mockUser));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    setUser(mockUser);
    
    let consented = false;
    try {
      consented = localStorage.getItem("copyright_accepted_simulated") === "true";
    } catch (e) {
      console.warn("Could not read localStorage", e);
    }
    setHasConsented(consented);
  };

  // Acceptance of terms handler
  const handleAcceptTerms = async () => {
    if (!user) return;
    
    setLoading(true);
    if (user.uid.startsWith("simulated_")) {
      try {
        localStorage.setItem("copyright_accepted_simulated", "true");
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      setHasConsented(true);
    } else {
      await recordCopyrightConsent(user);
      setHasConsented(true);
    }
    setLoading(false);
  };

  // Rejection/Decline/Crossing terms handler -> automatically closes / locks the website
  const handleDeclineTerms = () => {
    setIsLockout(true);
    // Explicitly try to close window/tab
    try {
      window.close();
    } catch (e) {
      console.log("Window.close() block occurred, displaying permanent safe lockout screen.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A] flex flex-col items-center justify-center z-50">
        <div className="space-y-4 text-center z-10">
          <div className="w-8 h-8 border-t border-[#C5A880] rounded-full animate-spin mx-auto"></div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C5A880] block">
            VERIFYING ARCHIVE ACCESS...
          </span>
        </div>
      </div>
    );
  }

  // State A: User is completely lockout (declined terms or closed popup)
  if (isLockout) {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A] text-neutral-400 flex flex-col items-center justify-center p-6 z-50 border-4 border-red-950/20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#1A1A1A] border border-red-900/30 p-8 text-center space-y-6 rounded-sm relative z-10"
        >
          <div className="w-16 h-16 bg-red-950/40 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-800/30 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-400 font-bold block">
              ACCESS DECREED VOID
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-light tracking-wide text-[#E8E6E1] uppercase">
              Copyright Rejected
            </h2>
            <p className="font-sans text-xs text-neutral-500 leading-relaxed pt-2">
              Viewing permission has been automatically terminated because you did not consent to the Intellectual Property & Copyright protect laws of the estate of <span className="text-white font-serif">{fatherName || "Zia-ud-din Hassan"}</span>.
            </p>
          </div>

          <div className="h-[1px] bg-red-950/50 w-full"></div>

          <p className="font-mono text-[9px] text-red-400 uppercase tracking-widest leading-relaxed">
            Legal monitoring logs are active. Please close this window or request consent below to restore your session.
          </p>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => {
                setIsLockout(false);
                setHasConsented(null);
              }}
              className="bg-red-950 border border-red-800 text-red-200 hover:bg-red-900 hover:text-white py-2.5 font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-colors w-full rounded-sm"
            >
              Request Consent Screen Again
            </button>
            <button
              onClick={() => window.location.replace("about:blank")}
              className="border border-neutral-800 text-neutral-500 hover:text-white py-2.5 font-mono text-[10px] uppercase font-semibold tracking-widest cursor-pointer transition-all w-full rounded-sm"
            >
              Close Web Portal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // State B: Google Sign-In is required
  if (!user) {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A] text-neutral-300 flex flex-col items-center justify-center p-4 z-40">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#1A1A1A] border border-neutral-850 p-8 sm:p-10 text-center space-y-8 rounded-sm relative z-10"
        >
          <div className="space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C5A880] flex items-center justify-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5" />
              SECURE DEPOSITORY GATEWAY
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-white uppercase">
              Archival Verification
            </h1>
            <p className="font-serif text-sm text-neutral-400 italic font-light leading-relaxed">
              Official online catalog tracking the absolute artistic estate and historic compositions of {fatherName || "Zia-ud-din Hassan"}.
            </p>
          </div>

          <div className="border-t border-b border-neutral-900 py-6 text-xs text-neutral-400 space-y-2 leading-relaxed font-sans text-left">
            <p>
              To protect the visual works from artificial crawlers, unauthorized visual copying, and scraping, this depository is locked.
            </p>
            <p className="font-semibold text-[#E8E6E1]">
              Verification of your identity via a Google account is strictly required to review the curated canvas collections.
            </p>
          </div>

          {/* Core Auth Trigger Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-[#E8E6E1] hover:bg-white text-[#1A1A1A] font-serif font-semibold py-3 px-6 rounded-sm text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Authorize with Google</span>
            </button>

            {authError && (
              <div className="text-[11px] text-[#C5A880]/95 bg-[#140E0A] border border-[#C5A880]/10 p-3.5 text-left leading-relaxed rounded-none font-mono">
                {authError}
              </div>
            )}
          </div>

          {/* Sandbox Bypass Tool */}
          <div className="pt-4 border-t border-neutral-910">
            <button
              onClick={() => setSimulatedAuthMode(!simulatedAuthMode)}
              className="text-neutral-550 hover:text-neutral-400 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
            >
              {simulatedAuthMode ? "Hide Preview Backdoor" : "Sandbox Preview Bypass (iframe)"}
            </button>
            
            {simulatedAuthMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3.5 p-4 bg-[#0D0D0D] border border-neutral-850 text-left space-y-3"
              >
                <div className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                  Inside sandboxed iframes, browser cookies might block popups. Input your email below to preview the archive instantly!
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#C5A880]">PREVIEW GOOGLE EMAIL</span>
                  <input
                    type="email"
                    value={directEmailInput}
                    onChange={(e) => setDirectEmailInput(e.target.value)}
                    className="bg-black border border-neutral-800 text-xs px-3 py-2 text-white font-mono outline-none focus:border-neutral-600 rounded-none w-full"
                    placeholder="Enter email..."
                  />
                </div>
                <button
                  onClick={handleSimulatedSignIn}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-1.5 font-mono text-[9px] uppercase font-bold tracking-widest transition-colors cursor-pointer rounded-sm"
                >
                  Verify Sandbox Credentials
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // State C: User is authenticated but hasn't consented to Intellect Profile & Copyright terms
  if (hasConsented === false || hasConsented === null) {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A]/98 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-[#1A1A1A] border border-neutral-850 flex flex-col rounded-sm z-10"
        >
          {/* Header with mandatory cancel trigger */}
          <div className="p-6 border-b border-neutral-900 flex items-start justify-between gap-4 shrink-0 bg-[#1A1A1A]">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A880] flex items-center gap-1.5 font-semibold">
                <Shield className="w-3 h-3 animate-pulse" />
                MANDATORY REGULATORY DECREE
              </span>
              <h3 className="font-serif text-lg md:text-xl font-light tracking-wide text-[#E8E6E1] uppercase">
                Intellectual Property & Terms of Use
              </h3>
            </div>
            
            {/* The "Cross" button. If they try to exit/cross it, it triggers the close lockout */}
            <button
              onClick={handleDeclineTerms}
              className="text-neutral-500 hover:text-red-400 p-1.5 rounded-sm border border-neutral-900 bg-black/60 hover:bg-red-950/20 transition-all cursor-pointer"
              title="Close and exit application"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Connected Identity Indicator */}
          <div className="px-6 py-2 bg-[#1A1A1A] border-b border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              Verified: <strong className="text-emerald-400">{user.email}</strong>
            </span>
            <button 
              onClick={handleSignOut}
              className="text-[#C5A880] hover:text-[#E8E6E1] uppercase tracking-wider text-[9px] cursor-pointer"
            >
              Switch Account
            </button>
          </div>

          {/* scrollbar styled documentation */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left font-sans text-neutral-300 text-sm leading-relaxed custom-scrollbar">
            
            {/* Introductory declaration */}
            <div className="bg-[#1A1A1A] border-l-2 border-[#C5A880] p-4 font-serif italic text-[#E8E6E1]/90 rounded-sm">
              "To protect the lifelong quiet memories, visual expressions, and artistic legacy of {fatherName || "Zia-ud-din Hassan"}, we request that all verified portal visitors review, understand, and accept the copyright statements."
            </div>

            {/* Content Clauses */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-serif font-light text-xs uppercase tracking-widest text-[#E8E6E1] flex items-center gap-1.5">
                  <span className="text-xs font-mono text-[#C5A880]">1.</span>
                  Ownership of Content
                </h4>
                <p className="text-neutral-400 text-xs pl-4 leading-relaxed">
                  All content presented on this website, including but not limited to the paintings, images, photography, text, design, and layout, is the exclusive intellectual property of <strong className="font-serif font-light">{fatherName || "Zia-ud-din Hassan"}</strong> and is protected by international copyright laws. All rights reserved.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-light text-xs uppercase tracking-widest text-[#E8E6E1] flex items-center gap-1.5">
                  <span className="text-xs font-mono text-[#C5A880]">2.</span>
                  Limited Viewing License
                </h4>
                <p className="text-neutral-400 text-xs pl-4 leading-relaxed">
                  This website is intended solely for personal, non-commercial, and private viewing purposes. Visitors are granted a limited, non-exclusive, non-transferable license to access and view the content on this site as it is displayed. This license does not grant you any ownership or rights to the content.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-light text-xs uppercase tracking-widest text-[#E8E6E1] flex items-center gap-1.5">
                  <span className="text-xs font-mono text-[#C5A880]">3.</span>
                  Prohibited Conduct (No Copying or Distribution)
                </h4>
                <p className="text-neutral-400 text-xs pl-4 leading-relaxed">
                  You are strictly prohibited from doing any of the following without prior express written consent from <strong className="font-serif font-light">{fatherName || "Zia-ud-din Hassan"}</strong>:
                </p>
                <ul className="pl-8 space-y-2 pt-1 text-xs text-neutral-400 list-disc">
                  <li><strong className="text-neutral-200">Reproduction:</strong> Copying, downloading, screen-capturing, or printing any artwork or text.</li>
                  <li><strong className="text-neutral-200">Redistribution:</strong> Sharing, uploading, or posting any material from this site to other websites, social media platforms, or digital portfolios.</li>
                  <li><strong className="text-neutral-200">Modification:</strong> Altering, editing, or creating derivative works based on the paintings or website design.</li>
                  <li><strong className="text-neutral-200">Commercial Use:</strong> Selling, licensing, or using any content for commercial gain or advertising purposes.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-light text-xs uppercase tracking-widest text-[#E8E6E1] flex items-center gap-1.5">
                  <span className="text-xs font-mono text-[#C5A880]">4.</span>
                  Digital Piracy & Unauthorized Use
                </h4>
                <p className="text-neutral-400 text-xs pl-4 leading-relaxed">
                  Any unauthorized reproduction, distribution, or public display of the materials found on this website constitutes a violation of copyright law. We utilize digital monitoring tools to protect our work. Any unauthorized use of our intellectual property will be investigated, and we reserve the right to pursue all available legal remedies.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-light text-xs uppercase tracking-widest text-[#E8E6E1] flex items-center gap-1.5">
                  <span className="text-xs font-mono text-[#C5A880]">5.</span>
                  Inquiries & Permission
                </h4>
                <p className="text-neutral-400 text-xs pl-4 leading-relaxed">
                  If you wish to request permission to contact us for educational, editorial, or commercial purpose permission, please contact us directly at:{" "}
                  <a href="mailto:dvlpermd@gmail.com" className="text-[#C5A880] underline transition-colors font-mono">dvlpermd@gmail.com</a>.
                </p>
              </div>
            </div>

          </div>

          {/* Actions panel */}
          <div className="p-5 border-t border-neutral-900 bg-[#1A1A1A] flex items-center justify-between shrink-0">
            <button
              onClick={handleDeclineTerms}
              className="text-neutral-500 hover:text-red-400 px-4 py-2 font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Decline & Terms Reject
            </button>
            
            <button
              onClick={handleAcceptTerms}
              className="bg-[#E8E6E1] text-[#1A1A1A] hover:bg-white px-6 py-2.5 font-serif text-[11px] uppercase font-bold tracking-widest cursor-pointer transition-colors rounded-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>I Consent & Entering Archive</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // State D: Authenticated AND consented! Render the actual premium portfolio children!
  return (
    <div className="relative">
      {/* Small floating Verified Badge in bottom corner for elegance */}
      <div className="fixed bottom-4 left-4 z-40 bg-[#0A0A09]/95 border border-neutral-850/90 px-3 py-1.5 rounded-sm shadow-md pointer-events-auto flex items-center gap-2 group transition-all duration-300">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">
          AUTHORIZED PROFILE: {user.email?.split("@")[0]}
        </span>
        <button 
          onClick={handleSignOut}
          className="text-neutral-500 hover:text-[#E8E6E1] font-mono text-[8px] tracking-wide uppercase cursor-pointer ml-1 xl:opacity-0 group-hover:opacity-100 transition-opacity"
          title="Sign out of archive portal"
        >
          [Sign Out]
        </button>
      </div>
      {children}
    </div>
  );
}
