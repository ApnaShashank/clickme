import { useState, useRef, useEffect } from "react";

interface CurvedFooterProps {
  currentPage: "leaderboard" | "profile";
  onGoLeft: () => void;
  onGoRight: () => void;
  onClickMe: () => void;
  clickCount: number;
  themeColor: string;
}

export default function CurvedFooter({
  currentPage,
  onGoLeft,
  onGoRight,
  onClickMe,
  clickCount,
  themeColor,
}: CurvedFooterProps) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [showingScore, setShowingScore] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Helper to clear all timers
  const clearTimers = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    holdTimerRef.current = null;
    progressIntervalRef.current = null;
  };

  const startHold = () => {
    if (showingScore) return; // Ignore hold if already showing score
    
    startTimeRef.current = Date.now();
    setHoldProgress(0);
    
    // Timer for the 3s reveal
    holdTimerRef.current = setTimeout(() => {
      setShowingScore(true);
      setHoldProgress(0);
      clearTimers();

      // Auto-hide score after 5 seconds
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setShowingScore(false);
      }, 5000);
    }, 3000);

    // Visual progress interval (smooth loading)
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setHoldProgress(progress);
    }, 50);
  };

  const endHold = () => {
    const elapsed = Date.now() - startTimeRef.current;
    
    // If held for less than 3s, perform normal click
    if (elapsed < 3000 && !showingScore) {
      onClickMe();
    }

    clearTimers();
    setHoldProgress(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full z-100 pointer-events-none">
      {/* SVG Curved Background - Original Curve */}
      <svg
        className="absolute bottom-0 w-full pointer-events-auto"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        style={{ height: "120px" }}
      >
        <path
          d="M0 0 C50 0, 120 80, 200 80 C280 80, 350 0, 400 0 L400 100 L0 100 Z"
          fill="#0a0a0a"
        />
      </svg>

      {/* Navigation Arrows - Original Style */}
      {currentPage === "profile" && (
        <button
          onClick={onGoLeft}
          className="absolute bottom-5 left-8 pointer-events-auto z-20 active:scale-90 transition-all duration-200"
          aria-label="Back to leaderboard"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors">
            <span
              className="material-symbols-outlined text-white text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_back
            </span>
          </div>
        </button>
      )}

      {currentPage === "leaderboard" && (
        <button
          onClick={onGoRight}
          className="absolute bottom-5 right-8 pointer-events-auto z-20 active:scale-90 transition-all duration-200"
          aria-label="Go to profile"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors">
            <span
              className="material-symbols-outlined text-white text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_forward
            </span>
          </div>
        </button>
      )}

      {/* Floating Section */}
      <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
        {/* Click Me Button with Hold interaction */}
        <button 
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className="relative group active:scale-90 transition-all duration-300 outline-none select-none touch-none"
          aria-label={showingScore ? `Your score is ${clickCount}` : "Hold to see score, click to play"}
        >
          <div className="w-20 h-20 rounded-full bg-white shadow-[0_8px_30px_rgba(255,255,255,0.25)] flex flex-col items-center justify-center border-2 border-white/50 relative z-10 transition-transform group-hover:scale-105 overflow-hidden">
            {showingScore ? (
              <div className="animate-in zoom-in-0 fade-in duration-300 text-center">
                <span className="text-[#0a0a0a] text-xl font-headline font-black leading-none block tracking-tighter">
                  {clickCount.toLocaleString()}
                </span>
                <span className="text-[#0a0a0a] text-[8px] font-black uppercase tracking-widest block -mt-0.5 opacity-40">
                  SCORE
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-[#0a0a0a] text-lg font-headline font-black uppercase leading-none tracking-tighter block">
                  Click
                </span>
                <span className="text-[#0a0a0a] text-lg font-headline font-black uppercase leading-none tracking-tighter block">
                  Me
                </span>
              </div>
            )}
            
            {/* Hold-to-Reveal Progress Fill */}
            {!showingScore && holdProgress > 0 && (
              <div 
                className="absolute bottom-0 left-0 w-full transition-all duration-75 pointer-events-none"
                style={{ height: `${holdProgress}%`, backgroundColor: `${themeColor}20` }}
              />
            )}
          </div>
          
          {/* Theme-colored Pulse/Glow */}
          <div 
            className="absolute -inset-2 rounded-full border-2 opacity-30 animate-pulse pointer-events-none"
            style={{ 
              borderColor: showingScore ? themeColor : (holdProgress > 0 ? themeColor : "white"),
              scale: holdProgress > 0 ? (1 + (holdProgress / 200)) : 1 
            }}
          ></div>

          {/* Visual Charging Indicator */}
          {!showingScore && holdProgress > 0 && (
            <svg className="absolute -inset-2 w-24 h-24 -rotate-90 pointer-events-none opacity-50">
              <circle
                cx="48"
                cy="48"
                r="46"
                fill="none"
                stroke={themeColor}
                strokeWidth="2"
                strokeDasharray={`${(holdProgress / 100) * 289} 289`}
                className="transition-all duration-75"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
