"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("PASSWORDS_DO_NOT_MATCH");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("IDENTITY_SECURED: PASSWORD_UPDATED");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "RECOVERY_FAILED: TOKEN_INVALID");
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
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">SECURE_RE_MAPPING</span>
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
              <div className="space-y-2 group">
                <label htmlFor="reset-new-password" className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-[#0066FF] transition-colors">
                  New Security Key
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
                    <span className="material-symbols-outlined text-sm" aria-label="New Password Icon">lock_reset</span>
                  </div>
                  <input
                    id="reset-new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-[#0a0a0a] border border-white/5 pl-11 pr-4 py-4 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-sm"
                    placeholder="MIN_8_CHARS"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label htmlFor="reset-confirm-password" className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-[#0066FF] transition-colors">
                  Confirm Key
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
                    <span className="material-symbols-outlined text-sm" aria-label="Confirm Password Icon">verified_user</span>
                  </div>
                  <input
                    id="reset-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/5 pl-11 pr-4 py-4 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-sm"
                    placeholder="RE_ENTER_KEY"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066FF] text-white font-headline font-black text-lg uppercase tracking-[0.2em] py-4.5 hover:bg-[#0052cc] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-2"
            >
              {loading ? "MAPPING_KEY..." : "RE_MAP_IDENTITY"}
            </button>
          </form>
        </div>

        {/* Muted Footer */}
        <div className="text-center mt-10">
          <Link href="/login" className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#0066FF] transition-colors">
            IDENTITY_Registry_Login
          </Link>
        </div>
      </div>
    </div>
  );
}
