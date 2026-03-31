"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AVATARS = [
  "https://ik.imagekit.io/DEMOPROJECT/clickme/hoddie__boy.png?updatedAt=1774962424608",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/calm_boy-removebg-preview.png?updatedAt=1774962424575",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/machine_boy.png?updatedAt=1774962327479",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/coder_boy.png?updatedAt=1774962357849",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/hustler_boy.png?updatedAt=1774962372415",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/grinder_boy.png?updatedAt=1774962361895",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/street_boy.png?updatedAt=1774962365821",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/aggresive_boy.png?updatedAt=1774962296833",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/lazy_boy.png?updatedAt=1774962368950",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/genius_boy.png?updatedAt=1774962271934",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/cool_boy.png?updatedAt=1774962271299",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/smart_boy.png?updatedAt=1774962269541",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/rich_boy.png?updatedAt=1774962269163",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/sweet_boy.png?updatedAt=1774962257817",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/hoddie_boy.png?updatedAt=1774962235923",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/tech_boy.png?updatedAt=1774962222676",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/candey_girl.png?updatedAt=1774962220202",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/leader_boy.png?updatedAt=1774962214530",
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const ERROR_MAP: Record<string, string> = {
    "PASSWORD_MIN_8_CHARS": "Must be 8+ characters",
    "PASSWORD_NEED_UPPERCASE": "Need 1 Uppercase letter",
    "PASSWORD_NEED_NUMBER": "Need 1 Number",
    "PASSWORD_NEED_SPECIAL_CHAR": "Need 1 Special char",
    "EMAIL_RECOGNIZED: ALREADY_MAPPED": "Email already registered",
    "IDENTITY_TAKEN: USERNAME_ASSIGNED": "Username taken",
    "INVALID_EMAIL_FORMAT": "Use a valid email",
    "MUST_START_WITH_@": "Insta handle must start with @",
  };

  const getFriendlyError = (err: string) => ERROR_MAP[err] || err;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          instagramUsername,
          avatarUrl: randomAvatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(getFriendlyError(data.error) || "REGISTRATION_FAILURE: System Overload");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("REGISTRY_READY: LOGIN_REQUIRED");
        setLoading(false);
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("NETWORK_DISCONNECT: Please retry");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-silver-matte flex items-center justify-center px-6 py-12 font-body relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="material-symbols-outlined absolute top-[5%] right-[20%] text-6xl text-white/5 animate-float opacity-20">person_add</span>
        <span className="material-symbols-outlined absolute top-[25%] left-[10%] text-4xl text-white/5 animate-float-delayed opacity-10">fingerprint</span>
        <span className="material-symbols-outlined absolute bottom-[10%] right-[15%] text-5xl text-white/5 animate-float-slow opacity-15">verified</span>
        <span className="material-symbols-outlined absolute bottom-[30%] left-[5%] text-7xl text-white/5 animate-float opacity-10">vpn_key</span>
        <span className="material-symbols-outlined absolute top-[45%] right-[5%] text-3xl text-white/5 animate-float-delayed opacity-5">shield</span>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-headline font-black tracking-tighter uppercase mb-1">
            <span className="silver-text-gradient">CLICK</span>
            <span className="text-white opacity-40">ME</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-white/10">
            <div className="h-px w-8 bg-white/5"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">INITIALIZE_IDENTITY_v3</span>
            <div className="h-px w-8 bg-white/5"></div>
          </div>
        </div>

        {/* The Silver Vault Card */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-xl silver-border p-8 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-950/20 border border-red-500/30 text-red-400 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center animate-in shake-in duration-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-1">
                  Alias
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" aria-hidden="true">
                    <span className="material-symbols-outlined text-sm">person</span>
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-white/20 transition-all placeholder:text-white/5 text-sm uppercase"
                    placeholder="PLAYER_ONE"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-insta" className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-1">
                  Social Handle
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" aria-hidden="true">
                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                  </div>
                  <input
                    id="signup-insta"
                    type="text"
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-white/20 transition-all placeholder:text-white/5 text-sm"
                    placeholder="@ID"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-1">
                Security Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" aria-hidden="true">
                  <span className="material-symbols-outlined text-sm">mail</span>
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-white/20 transition-all placeholder:text-white/5 text-sm"
                  placeholder="ID@VAULT.SYS"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-1">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" aria-hidden="true">
                  <span className="material-symbols-outlined text-sm">lock</span>
                </div>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-white/20 transition-all placeholder:text-white/5 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-2 flex-wrap mt-2 px-1 opacity-40">
                {['8+ Chars', 'Uppercase', 'Digital'].map(tag => (
                  <span key={tag} className="text-[7px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 text-white/60 silver-border rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full silver-button font-headline font-black text-lg uppercase tracking-[0.2em] py-5 active:scale-[0.98] disabled:opacity-50 disabled:grayscale mt-2 group"
            >
              <span className="group-hover:tracking-[0.3em] transition-all duration-300">
                {loading ? "INITIALIZING..." : "JOIN_ARENA"}
              </span>
            </button>
          </form>
        </div>

        {/* Secondary Actions */}
        <div className="text-center mt-10">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
            Identity already mapped?{" "}
            <Link href="/login" className="text-white hover:silver-text-gradient transition-all border-b border-white/10 pb-0.5 ml-1">
              LOGIN_VAULT
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
