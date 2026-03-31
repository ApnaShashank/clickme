"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemedLoading from "@/components/ThemedLoading";
import GoogleSignInButton from "@/components/GoogleSignInButton";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("AUTHENTICATION_FAILED: Invalid Credentials");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-silver-matte flex items-center justify-center px-6 py-12 font-body relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="material-symbols-outlined absolute top-[10%] left-[10%] text-6xl text-white/5 animate-float opacity-20">bolt</span>
        <span className="material-symbols-outlined absolute top-[20%] right-[15%] text-4xl text-white/5 animate-float-delayed opacity-10">ads_click</span>
        <span className="material-symbols-outlined absolute bottom-[15%] left-[20%] text-5xl text-white/5 animate-float-slow opacity-15">military_tech</span>
        <span className="material-symbols-outlined absolute bottom-[25%] right-[10%] text-7xl text-white/5 animate-float opacity-10">trophy</span>
        <span className="material-symbols-outlined absolute top-[40%] left-[40%] text-3xl text-white/5 animate-float-delayed opacity-5">security</span>
        <span className="material-symbols-outlined absolute top-[60%] right-[30%] text-4xl text-white/5 animate-float-slow opacity-10">rocket_launch</span>
      </div>

      <div className="w-full max-w-sm relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-headline font-black tracking-tighter uppercase mb-1">
            <span className="silver-text-gradient">CLICK</span>
            <span className="text-white opacity-40">ME</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-white/10">
            <div className="h-px w-8 bg-white/5"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">ACCESS_VAULT_v3</span>
            <div className="h-px w-8 bg-white/5"></div>
          </div>
        </div>

        {/* The Silver Vault Card */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-xl silver-border p-8 relative overflow-hidden">
          {loading && <ThemedLoading status="VERIFYING_CREDENTIALS..." fullScreen={false} />}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-950/20 border border-red-500/30 text-red-400 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center animate-in shake-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="login-email" className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-1">
                Registry ID
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" aria-hidden="true">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-4 text-white font-bold outline-none focus:border-white/20 transition-all placeholder:text-white/5 text-sm"
                  placeholder="USER@VAULT.SYS"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label htmlFor="login-password" className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                  Security Key
                </label>
                <Link href="/forgot-password" className="text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">LOST_KEY?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" aria-hidden="true">
                  <span className="material-symbols-outlined text-sm">lock</span>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-4 text-white font-bold outline-none focus:border-white/20 transition-all placeholder:text-white/5 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full silver-button font-headline font-black text-lg uppercase tracking-[0.2em] py-5 active:scale-[0.98] disabled:opacity-50 disabled:grayscale mt-2 group"
            >
              <span className="group-hover:tracking-[0.3em] transition-all duration-300">
                UNLOCK_ENTRY
              </span>
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-[1px] flex-1 bg-white/5"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">OPTIONAL_OAUTH</span>
            <div className="h-[1px] flex-1 bg-white/5"></div>
          </div>

          <GoogleSignInButton />
        </div>

        {/* Secondary Actions */}
        <div className="text-center mt-10 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            No active identity?{" "}
            <Link href="/signup" className="text-white hover:silver-text-gradient transition-all border-b border-white/10 pb-0.5 ml-1">
              INITIALIZE_NEW
            </Link>
          </div>
          
          <div className="pt-4 flex items-center justify-center gap-4 opacity-10">
             <span className="material-symbols-outlined text-xs">verified_user</span>
             <span className="material-symbols-outlined text-xs">encrypted</span>
             <span className="material-symbols-outlined text-xs">lan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
