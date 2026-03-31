"use client";

import React from "react";

interface ThemedLoadingProps {
  status?: string;
  fullScreen?: boolean;
}

export default function ThemedLoading({ 
  status = "SYNCING_IDENTITY...", 
  fullScreen = true 
}: ThemedLoadingProps) {
  return (
    <div 
      className={`${fullScreen ? 'fixed inset-0 z-[9999]' : 'absolute inset-0 z-50'} bg-[#080808] flex flex-col items-center justify-center overflow-hidden`}
      aria-live="polite"
      aria-busy="true"
    >
      {/* Precision Geometric Core */}
      <div className="relative flex flex-col items-center">
        
        {/* Shutter Mechanism */}
        <div className="relative w-20 h-20 animate-step-spin">
          {/* Top Bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-white" />
          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-white" />
          {/* Left Bar */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-1 bg-white" />
          {/* Right Bar */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-1 bg-white" />
          
          {/* Inner Static Frame */}
          <div className="absolute inset-6 border border-[#333] rounded-sm" />
        </div>

        {/* Status Registry */}
        <div className="mt-8 text-center">
          <div className="text-white text-[10px] font-headline font-black tracking-[0.5em] uppercase mb-4 animate-shutter">
            {status}
          </div>
          
          {/* Progress Indicator - Solid Bars */}
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                className="w-8 h-[1px] bg-[#222] relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-white animate-line-draw" 
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Metadata Branding (Solid) */}
        <div className="absolute -bottom-24 text-[#222] text-[8px] font-black tracking-widest uppercase">
          VAULT_OS // ID_7749
        </div>
      </div>

      {/* Grid Pattern Overlay (Low Opacity Solid) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}
