"use client";

import React from "react";

interface ThemedLoadingProps {
  status?: string;
  fullScreen?: boolean;
}

export default function ThemedLoading({ 
  status = "INITIALIZING_VAULT...", 
  fullScreen = true 
}: ThemedLoadingProps) {
  return (
    <div 
      className={`${fullScreen ? 'fixed inset-0 z-[9999]' : 'absolute inset-0 z-50'} bg-[#050505] flex flex-col items-center justify-center overflow-hidden`}
      aria-live="polite"
      aria-busy="true"
    >
      {/* Floating Background Icons (Continuity with Auth Theme) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden select-none">
        <span className="material-symbols-outlined absolute top-[15%] left-[20%] text-5xl animate-float text-white/5">bolt</span>
        <span className="material-symbols-outlined absolute bottom-[20%] right-[25%] text-4xl animate-float-delayed text-white/5">security</span>
        <span className="material-symbols-outlined absolute top-[40%] right-[10%] text-6xl animate-float-slow text-white/5">military_tech</span>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Orbital Ring System */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer Ring - Slow Reverse */}
          <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full animate-spin-reverse-slow" />
          
          {/* Middle Ring - Faster Clockwise */}
          <div className="absolute inset-4 border border-white/10 rounded-full animate-spin-slow" />
          
          {/* Inner Glow Ring - Reactive */}
          <div className="absolute inset-8 border-2 border-white/20 rounded-full blur-[2px] animate-pulse" />

          {/* Central Pulsing Liquid Core */}
          <div className="relative w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] animate-pulse-silver">
             <div className="absolute inset-0 bg-white blur-md animate-pulse" />
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-10 text-center animate-pulse">
           <span className="silver-text-gradient text-[10px] font-headline font-black tracking-[0.4em] uppercase block mb-1">
             {status}
           </span>
           <div className="flex items-center justify-center gap-1.5 h-1">
              {[0, 1, 2].map(i => (
                <div 
                  key={i} 
                  className="w-1 h-1 bg-white/20 rounded-full"
                  style={{ animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
           </div>
        </div>
      </div>
      
      {/* Scanline Effect Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[2px] w-full animate-in slide-in-from-top duration-1000 infinite pointer-events-none opacity-10" />
    </div>
  );
}
