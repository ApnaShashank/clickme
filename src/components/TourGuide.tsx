"use client";

import React, { useState, useEffect, useRef } from "react";

interface TourGuideProps {
  onComplete: () => void;
  themeColor?: string;
  currentPage: "leaderboard" | "profile";
  onNavigate: (page: "leaderboard" | "profile") => void;
}

export default function TourGuide({ onComplete, themeColor = "#FFFFFF", currentPage, onNavigate }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
  
  const steps = [
    { 
      target: null, // Center
      title: "SYSTEM INITIALIZED.", 
      icon: "rocket_launch", 
      text: "Welcome to The Arena. The rules are simple: Dominate the global ranking by any means necessary.",
      action: () => {}
    },
    { 
      target: "tour-leaderboard-title", 
      title: "GLOBAL LEDGER", 
      icon: "view_list", 
      text: "This is the live list of every fighter in the vault. If you aren't here, you don't exist.",
      action: () => {}
    },
    { 
      target: "tour-player-card", 
      title: "INTERACTION PROTOCOL", 
      icon: "ads_click", 
      text: "Tap a profile once to view identity. DOUBLE TAP to launch their Viral Advertisement link.",
      action: () => {}
    },
    { 
      target: "tour-click-button", 
      title: "THE PULSE", 
      icon: "touch_app", 
      text: "This is your main interaction. CLICK to increase your score. HOLD to view your secret vault stats.",
      action: () => {}
    },
    { 
      target: "tour-nav-profile", 
      title: "VAULT NAVIGATION", 
      icon: "arrow_forward", 
      text: "Use this to access your personal customization chamber. Let's move there now.",
      action: () => {
        onNavigate("profile");
      }
    },
    { 
      target: "tour-profile-avatar", 
      title: "IDENTITY SHIFT", 
      icon: "person_celebrate", 
      text: "Swipe left and right on your avatar to choose your visual signature.",
      action: () => {}
    },
    { 
      target: "tour-profile-link", 
      title: "VIRAL DESTINATION", 
      icon: "link", 
      text: "Double-tap your avatar here to reveal and edit your Target Link. This launches when people double-click you in the Arena.",
      action: () => {}
    },
    { 
      target: "tour-profile-stats", 
      title: "TIER PROGRESSION", 
      icon: "military_tech", 
      text: "Track your clicks, live rank, and dynamic Tier name (DAONE, DATWO, etc.) here.",
      action: () => {}
    },
  ];

  const updateCoords = () => {
    const step = steps[currentStep];
    if (!step.target) {
      setCoords(null);
      return;
    }

    const el = document.getElementById(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    // Small delay to let page transitions finish if any
    const timer = setTimeout(updateCoords, 300);
    window.addEventListener('resize', updateCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateCoords);
    };
  }, [currentStep, currentPage]);

  const handleNext = () => {
    steps[currentStep].action();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-100 font-body overflow-x-hidden">
      
      {/* Background Mask */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-500" />
      
      {/* Spotlight Circle */}
      {coords && (
        <div 
          className="absolute z-10 transition-all duration-500 ease-in-out border-2 animate-pulse rounded-md"
          style={{ 
            top: coords.top - 8, 
            left: coords.left - 8, 
            width: coords.width + 16, 
            height: coords.height + 16,
            borderColor: themeColor,
            boxShadow: `0 0 40px ${themeColor}30, 0 0 100px black`
          }}
        >
          {/* Arrow pointing at the target */}
          <div 
            className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce"
            style={{ color: themeColor }}
          >
            <span className="material-symbols-outlined text-4xl">south</span>
          </div>
        </div>
      )}

      {/* Content Dialog */}
      <div 
        className={`fixed z-20 transition-all duration-500 w-full max-w-[280px] p-6 bg-[#080808]/90 border border-white/10 shadow-2xl ${
          coords 
            ? (coords.top > 350 ? "bottom-[120px] left-1/2 -translate-x-1/2" : "top-[120px] left-1/2 -translate-x-1/2")
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
             <span className="material-symbols-outlined text-4xl" style={{ color: themeColor }}>
               {steps[currentStep].icon}
             </span>
          </div>

          <h2 className="text-sm font-headline font-black uppercase tracking-[0.2em] text-white mb-2">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-[10px] font-bold text-white/50 tracking-wide uppercase leading-relaxed mb-6">
            {steps[currentStep].text}
          </p>

          <div className="flex items-center justify-between w-full gap-4">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">
              STP_{currentStep + 1} / {steps.length}
            </span>
            <button 
              onClick={handleNext}
              className="px-6 py-2 silver-button font-headline font-black tracking-widest uppercase text-[9px] active:scale-[0.98] transition-transform"
            >
              {isLast ? "INITIATE" : "NEXT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
