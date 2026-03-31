"use client";

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
        {/* Click Count Display - Improved for the original UI */}
        <div className="mb-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span
            className="text-4xl font-headline font-black tracking-tighter drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]"
            style={{ color: themeColor }}
          >
            {clickCount.toLocaleString()}
          </span>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 -mt-1">
            Total Clicks
          </div>
        </div>

        {/* Original White Click Me Button */}
        <button 
          onClick={onClickMe}
          className="relative group active:scale-90 transition-all duration-300 outline-none"
        >
          <div className="w-20 h-20 rounded-full bg-white shadow-[0_8px_30px_rgba(255,255,255,0.25)] flex flex-col items-center justify-center border-2 border-white/50 relative z-10 transition-transform group-hover:scale-105">
            <span className="text-[#0a0a0a] text-lg font-black uppercase text-center leading-none tracking-tighter">
              Click
            </span>
            <span className="text-[#0a0a0a] text-lg font-black uppercase text-center leading-none tracking-tighter">
              Me
            </span>
          </div>
          
          {/* Theme-colored Pulse/Glow */}
          <div 
            className="absolute -inset-2 rounded-full border-2 opacity-30 animate-pulse pointer-events-none"
            style={{ borderColor: themeColor }}
          ></div>
        </button>
      </div>
    </div>
  );
}
