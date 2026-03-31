"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("RECOVERY_LINK_GENERATED: CHECK_SERVER_CONSOLE");
      } else {
        setError(data.error || "RECOVERY_FAILURE: SYSTEM_OFFLINE");
      }
    } catch {
      setError("NETWORK_DISCONNECT: RE-LINKING_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-12 font-body relative overflow-hidden">
      <div className="w-full max-w-sm relative z-10">
        {/* Simple Static Logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-headline font-black text-white tracking-widest uppercase">
            Click<span className="text-primary">Me</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 mb-1 text-white/20">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">IDENTITY_RECOVERY</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>
        </div>

        {/* Matte Card */}
        <div className="bg-[#111] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-600 border border-red-700 text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}
            
            {message && (
              <div className="bg-[#0066FF] border border-[#0052cc] text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-white/40 text-[10px] text-center uppercase tracking-widest leading-relaxed">
                Enter your registered ID to generate a secure recovery link.
              </p>
              
              <div className="space-y-2 group">
                <label htmlFor="recovery-email" className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-[#0066FF] transition-colors">
                  Registered Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
                    <span className="material-symbols-outlined text-sm" aria-label="Email Icon">alternate_email</span>
                  </div>
                  <input
                    id="recovery-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/5 pl-11 pr-4 py-4 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-sm"
                    placeholder="ID_REGISTRY@EMAIL.COM"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066FF] text-white font-headline font-black text-lg uppercase tracking-[0.2em] py-4.5 hover:bg-[#0052cc] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-2"
            >
              {loading ? "GENERATING..." : "REQUEST_RESET"}
            </button>
          </form>
        </div>

        {/* Muted Footer */}
        <div className="text-center mt-10">
          <Link href="/login" className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#0066FF] transition-colors">
            Back to Registry Login
          </Link>
        </div>
      </div>
    </div>
  );
}
