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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-12 font-body relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Simple Static Logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-headline font-black text-white tracking-widest uppercase">
            Click<span className="text-primary">Me</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 mb-1 text-white/20">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">INITIALIZE_IDENTITY</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>
        </div>

        {/* Matte Card */}
        <div className="bg-[#111] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-600 border border-red-700 text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-[#0066FF] transition-colors">
                  Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
                    <span className="material-symbols-outlined text-sm" aria-label="Nickname Icon">person</span>
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-sm uppercase"
                    placeholder="STRYKER"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-insta" className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-[#0066FF] transition-colors">
                  Insta
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
                    <span className="material-symbols-outlined text-sm" aria-label="Social Icon">social_distance</span>
                  </div>
                  <input
                    id="signup-insta"
                    type="text"
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-sm"
                    placeholder="@handle"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-[#0066FF] transition-colors">
                Registry Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
                  <span className="material-symbols-outlined text-sm" aria-label="Email Icon">alternate_email</span>
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-sm"
                  placeholder="ID_REGISTRY@EMAIL.COM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-[#0066FF] transition-colors">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
                  <span className="material-symbols-outlined text-sm" aria-label="Password Icon">lock</span>
                </div>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full bg-[#0a0a0a] border border-white/5 pl-11 pr-4 py-3.5 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-2 flex-wrap mt-2 px-1" aria-label="Security Requirements">
                {['8+ Chars', 'Uppercase', 'Number'].map(tag => (
                  <span key={tag} className="text-[7px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 text-white/40 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066FF] text-white font-headline font-black text-lg uppercase tracking-[0.2em] py-4.5 hover:bg-[#0052cc] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-2"
            >
              {loading ? "INITIALIZING..." : "JOIN_ARENA"}
            </button>
          </form>
        </div>

        {/* Muted Footer */}
        <div className="text-center mt-10">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
            Identity already mapped?{" "}
            <Link href="/login" className="text-white hover:text-[#0066FF] transition-colors border-b border-white/10 pb-0.5 ml-1">
              LOGIN_MANUALLY
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
