"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CurvedFooter from "@/components/CurvedFooter";

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
  "https://ik.imagekit.io/DEMOPROJECT/clickme/rich_boy.png?updatedAt=1774962269163",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/sweet_boy.png?updatedAt=1774962257817",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/hoddie_boy.png?updatedAt=1774962235923",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/tech_boy.png?updatedAt=1774962222676",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/candey_girl.png?updatedAt=1774962220202",
  "https://ik.imagekit.io/DEMOPROJECT/clickme/leader_boy.png?updatedAt=1774962214530",
];

interface LeaderboardUser {
  id: string;
  name: string;
  instagramUsername: string;
  clickCount: number;
  avatarUrl: string;
  themeColor: string;
  customLink: string;
  rank: number;
  rankChange?: "up" | "down" | "none";
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  instagramUsername: string;
  clickCount: number;
  avatarUrl: string;
  themeColor: string;
  customLink: string;
  rank: number;
}

function formatClicks(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function ensureAbsoluteUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

// ──────────────────────────────────────
// LEADERBOARD PAGE
// ──────────────────────────────────────
function LeaderboardPage({
  leaderboard,
  currentUserId,
  userThemeColor,
}: {
  leaderboard: LeaderboardUser[];
  currentUserId: string;
  userThemeColor: string;
}) {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const clickTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleInteraction = (user: LeaderboardUser, type: "single" | "double") => {
    if (type === "double") {
      // Clear single click timer if it exists
      if (clickTimers.current[user.id]) {
        clearTimeout(clickTimers.current[user.id]);
        delete clickTimers.current[user.id];
      }
      
      const link = user.customLink 
        ? ensureAbsoluteUrl(user.customLink) 
        : `https://instagram.com/${user.instagramUsername.replace("@", "")}`;
      window.open(link, "_blank");
    } else {
      // Set a timer to wait for a potential double click
      clickTimers.current[user.id] = setTimeout(() => {
        const link = `https://instagram.com/${user.instagramUsername.replace("@", "")}`;
        window.open(link, "_blank");
        delete clickTimers.current[user.id];
      }, 250);
    }
  };

  const getDefaultAvatar = (index: number) => AVATARS[index % AVATARS.length];

  return (
    <>
      <header className="pt-8 pb-10 text-center relative z-20 overflow-hidden">
        {/* Hidden H1 for SEO/Accessibility 100 Score */}
        <h1 className="sr-only">ClickMe Arena - Multiplayer Clicker Leaderboard</h1>
        <h2 className="text-white font-headline font-black text-4xl tracking-widest uppercase mt-2">
          Leaderboard
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-80" aria-hidden="true">
          <div className="h-px w-12 bg-white/20"></div>
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
          <div className="h-px w-12 bg-white/20"></div>
        </div>
      </header>

      <main className="px-5 space-y-12 pb-24 relative">
        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <section className="relative pt-16 pb-8">
            <div className="flex items-end justify-center gap-4">
              {/* Rank 2 */}
              {top3[1] && (
                <div 
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                  onClick={() => handleInteraction(top3[1], "single")}
                  onDoubleClick={() => handleInteraction(top3[1], "double")}
                >
                  <div className="relative mb-3 transition-transform hover:-translate-y-1">
                    {/* Glowing ring for ME */}
                    {top3[1].id === currentUserId && (
                      <div className="absolute -inset-1 rounded border-2 animate-pulse z-0" style={{ borderColor: top3[1].themeColor, opacity: 0.5 }}></div>
                    )}
                    <div className="w-20 h-20 overflow-hidden border-2 rounded relative z-10" style={{ borderColor: top3[1].themeColor, backgroundColor: "#1a1a1a" }}>
                      <Image 
                        src={top3[1].avatarUrl || getDefaultAvatar(1)} 
                        alt={`Avatar of Rank 2 player ${top3[1].name}`} 
                        fill 
                        sizes="80px"
                        className="object-cover object-top" 
                      />
                    </div>
                    {top3[1].id === currentUserId && (
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter z-30 shadow-lg">You</div>
                    )}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 font-headline font-bold px-3 py-0.5 text-xs z-20 border flex items-center gap-1" style={{ backgroundColor: "#0d0d0f", color: top3[1].themeColor, borderColor: top3[1].themeColor }}>
                      {top3[1].rankChange === "up" && <span className="text-[10px] text-green-500 animate-bounce">▲</span>}
                      {top3[1].rankChange === "down" && <span className="text-[10px] text-red-500 animate-bounce">▼</span>}
                      #2
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-white/80 mt-1">{top3[1].name}</span>
                  <span className="text-xs font-headline mt-0.5" style={{ color: top3[1].themeColor }}>{formatClicks(top3[1].clickCount)}</span>
                </div>
              )}

              {/* Rank 1 */}
              {top3[0] && (
                <div 
                  className="flex-1 flex flex-col items-center -mt-8 z-10 scale-110 group cursor-pointer"
                  onClick={() => handleInteraction(top3[0], "single")}
                  onDoubleClick={() => handleInteraction(top3[0], "double")}
                >
                  <div className="relative mb-4 transition-transform hover:-translate-y-1">
                    {/* Glowing ring for ME */}
                    {top3[0].id === currentUserId && (
                      <div className="absolute -inset-1.5 rounded border-2 animate-pulse z-0" style={{ borderColor: top3[0].themeColor, opacity: 0.8 }}></div>
                    )}
                    {/* Crown */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30">
                      <span className="material-symbols-outlined text-3xl" style={{ color: top3[0].themeColor, fontVariationSettings: "'FILL' 1" }} aria-label="Champion Trophy">emoji_events</span>
                    </div>
                    <div className="w-28 h-28 overflow-hidden border-3 rounded relative z-10" style={{ borderColor: top3[0].themeColor, borderWidth: "3px", backgroundColor: "#1a1a1a" }}>
                      <Image 
                        src={top3[0].avatarUrl || getDefaultAvatar(0)} 
                        alt={`Avatar of Rank 1 Champion ${top3[0].name}`} 
                        fill 
                        priority
                        sizes="112px"
                        className="object-cover object-top" 
                      />
                    </div>
                    {top3[0].id === currentUserId && (
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter z-30 shadow-lg">You</div>
                    )}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-headline font-black px-6 py-1 text-xl z-20 flex items-center gap-2" style={{ backgroundColor: top3[0].themeColor, color: "#000" }}>
                      {top3[0].rankChange === "up" && <span className="text-sm animate-bounce">▲</span>}
                      {top3[0].rankChange === "down" && <span className="text-sm animate-bounce">▼</span>}
                      #1
                    </div>
                  </div>
                  <span className="font-bold text-lg mt-1 tracking-wide" style={{ color: top3[0].themeColor }}>{top3[0].name}</span>
                  <span className="text-sm font-headline mt-0.5 text-white/60">{formatClicks(top3[0].clickCount)}</span>
                </div>
              )}

              {/* Rank 3 */}
              {top3[2] && (
                <div 
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                  onClick={() => handleInteraction(top3[2], "single")}
                  onDoubleClick={() => handleInteraction(top3[2], "double")}
                >
                  <div className="relative mb-3 transition-transform hover:-translate-y-1">
                    {/* Glowing ring for ME */}
                    {top3[2].id === currentUserId && (
                      <div className="absolute -inset-1 rounded border-2 animate-pulse z-0" style={{ borderColor: top3[2].themeColor, opacity: 0.5 }}></div>
                    )}
                    <div className="w-20 h-20 overflow-hidden border-2 rounded relative z-10" style={{ borderColor: top3[2].themeColor, backgroundColor: "#1a1a1a" }}>
                      <Image 
                        src={top3[2].avatarUrl || getDefaultAvatar(2)} 
                        alt={`Avatar of Rank 3 player ${top3[2].name}`} 
                        fill 
                        sizes="80px"
                        className="object-cover object-top" 
                      />
                    </div>
                    {top3[2].id === currentUserId && (
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter z-30 shadow-lg">You</div>
                    )}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 font-headline font-bold px-3 py-0.5 text-xs z-20 border flex items-center gap-1" style={{ backgroundColor: "#0d0d0f", color: top3[2].themeColor, borderColor: top3[2].themeColor }}>
                      {top3[2].rankChange === "up" && <span className="text-[10px] text-green-500 animate-bounce">▲</span>}
                      {top3[2].rankChange === "down" && <span className="text-[10px] text-red-500 animate-bounce">▼</span>}
                      #3
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-white/80 mt-1">{top3[2].name}</span>
                  <span className="text-xs font-headline mt-0.5" style={{ color: top3[2].themeColor }}>{formatClicks(top3[2].clickCount)}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Rankings List */}
        <section className="mt-16 px-6 pb-48 relative z-10 max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-8 opacity-20">
            <div className="h-[1px] flex-1 bg-white"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">Top Players</span>
            <div className="h-[1px] flex-1 bg-white"></div>
          </div>
          <div className="space-y-2">
            {rest.map((user) => {
              const isMe = user.id === currentUserId;
              const userThemeColor = user.themeColor || "#FFAA00";
              return (
                <div
                  key={user.id}
                  onClick={() => handleInteraction(user, "single")}
                  onDoubleClick={() => handleInteraction(user, "double")}
                  className={`flex items-center gap-4 p-3 transition-all hover:bg-white/5 cursor-pointer group rounded-sm border-l-4 shadow-lg ${
                    isMe
                      ? ""
                      : "bg-transparent"
                  }`}
                  style={{ 
                    borderLeftColor: user.themeColor, 
                    backgroundColor: isMe ? "rgba(255,255,255,0.05)" : "transparent",
                    borderTop: `1px solid ${user.themeColor}15`,
                    borderRight: `1px solid ${user.themeColor}15`,
                    borderBottom: `1px solid ${user.themeColor}15`
                  }}
                >
                  <span className={`w-12 font-headline font-bold text-center flex items-center justify-center gap-1`} style={{ color: isMe ? userThemeColor : "rgba(255,255,255,0.5)" }}>
                    {user.rankChange === "up" && <span className="text-green-500 text-[10px] animate-bounce">▲</span>}
                    {user.rankChange === "down" && <span className="text-red-500 text-[10px] animate-bounce">▼</span>}
                    {user.rank}
                  </span>
                  <div className="w-10 h-10 rounded-sm border border-white/10 relative overflow-hidden bg-surface-container-low">
                    <Image 
                      src={user.avatarUrl || getDefaultAvatar(user.rank)} 
                      alt={`Avatar of ${user.name}`} 
                      fill 
                      sizes="40px"
                      className="object-cover object-top" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`block font-bold tracking-wide text-md ${isMe ? "text-white" : "text-white/80"}`}>{user.name}</span>
                    </div>
                    {isMe && <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: user.themeColor }}>Your Position</span>}
                  </div>
                  <span className="font-headline font-bold text-sm tracking-widest" style={{ color: isMe ? userThemeColor : "rgba(255,255,255,0.6)" }}>{formatClicks(user.clickCount)}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

// ──────────────────────────────────────
// PROFILE PAGE
// ──────────────────────────────────────
function ProfilePage({
  profile,
  onProfileUpdate,
  themeColor,
}: {
  profile: UserProfile;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
  themeColor: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [avatarIndex, setAvatarIndex] = useState(() => {
    const idx = AVATARS.indexOf(profile.avatarUrl);
    return idx === -1 ? 0 : idx;
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [customLink, setCustomLink] = useState(profile.customLink || "");
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setEditName(profile.name);
    const idx = AVATARS.indexOf(profile.avatarUrl);
    setAvatarIndex(idx === -1 ? 0 : idx);
    setCustomLink(profile.customLink || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updates: Partial<UserProfile> = {
      name: editName,
      avatarUrl: AVATARS[avatarIndex],
      customLink: customLink,
    };
    onProfileUpdate(updates);
    setIsEditing(false);
    setShowLinkInput(false);
  };

  const prevAvatar = () => {
    setAvatarIndex((prev) => (prev - 1 + AVATARS.length) % AVATARS.length);
  };

  const nextAvatar = () => {
    setAvatarIndex((prev) => (prev + 1) % AVATARS.length);
  };

  const currentAvatar = isEditing ? AVATARS[avatarIndex] : (profile.avatarUrl || AVATARS[0]);

  const handleDoubleClick = () => {
    setShowLinkInput((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-96 px-5 min-h-screen">
      {/* Top Header: Edit [Edit Icon] [PROFILE] [Logout Icon] Logout */}
      <header className="w-full flex items-center justify-between mb-12 relative">
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm font-headline font-black text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 z-20"
          style={isEditing ? { backgroundColor: themeColor, color: "#000" } : { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
          aria-label={isEditing ? "Save changes" : "Edit profile"}
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isEditing ? "check" : "edit_square"}
          </span>
          {isEditing ? "SAVE" : "EDIT"}
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">IDENTITY</span>
          <h2 className="text-white text-xs font-headline font-black tracking-[0.2em] -mt-1 uppercase">Profile</h2>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95 z-20"
          aria-label="Logout"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          LOGOUT
        </button>
      </header>




      {/* Avatar Section */}
      <div className="relative flex items-center justify-center gap-4 mb-6">
        {isEditing && (
          <button onClick={prevAvatar} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90" aria-label="Previous Avatar">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>chevron_left</span>
          </button>
        )}

        <div 
          onDoubleClick={isEditing ? handleDoubleClick : undefined}
          className={`relative transition-all duration-500 ${isEditing ? 'cursor-pointer group/avatar' : ''}`} 
          style={isEditing ? { filter: `drop-shadow(0 0 20px ${themeColor}30)` } : {}}
        >
          <div className="w-48 h-64 relative">
            <Image 
              src={currentAvatar} 
              alt="Your current avatar identity" 
              fill 
              sizes="192px"
              className="object-contain transition-all duration-500 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
              priority 
            />
          </div>
          {isEditing && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 border border-white/10 px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest text-[#0066FF] animate-pulse pointer-events-none group-hover/avatar:opacity-0 transition-opacity">
              Double-tap to add link
            </div>
          )}
        </div>

        {isEditing && (
          <button onClick={nextAvatar} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90" aria-label="Next Avatar">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>chevron_right</span>
          </button>
        )}
      </div>

      {/* Username / Identity Hierarchy */}
      <div className="text-center mb-6 space-y-1">
        {isEditing ? (
          <div className="space-y-3">
             <input
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-transparent border-b-2 text-white text-4xl font-headline font-black tracking-[0.1em] text-center outline-none pb-1 w-full max-w-xs transition-all focus:border-primary"
              style={{ borderColor: themeColor, caretColor: themeColor }}
              placeholder="DISPLAY_NAME"
              maxLength={20}
              id="profile-name-edit"
              aria-label="Edit display name"
            />
            <div className="flex items-center justify-center gap-1.5 text-white/30 font-black text-xs uppercase tracking-[0.2em] opacity-80">
              <span className="material-symbols-outlined text-sm">alternate_email</span>
              {profile.instagramUsername}
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-white text-4xl font-headline font-black tracking-[0.05em] uppercase">{profile.name}</h1>
            <div className="flex items-center justify-center gap-1.5 text-white/30 font-black text-xs uppercase tracking-[0.4em] mt-1 pt-1 border-t border-white/5 inline-flex px-4 mx-auto leading-none">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {profile.instagramUsername}
            </div>
          </>
        )}
      </div>

      {/* Stats - Grouped tightly above the footer area */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-2 mt-0 mb-8 relative z-20">
        <div className="bg-white/5 border border-white/10 p-2 text-center rounded-sm">
          <span className="block text-sm font-headline font-black tracking-tight text-white">{formatClicks(profile.clickCount)}</span>
          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-0.5 block">Clicks</span>
        </div>
        <div className="bg-[#0066FF10] border border-[#0066FF30] p-2 text-center rounded-sm">
          <span className="block text-sm font-headline font-black text-[#0066FF] tracking-tight">#{profile.rank}</span>
          <span className="text-[8px] font-black text-[#0066FF] uppercase tracking-[0.2em] mt-0.5 block opacity-50">Rank</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-2 text-center rounded-sm">
          <span className="block text-sm font-headline font-black text-white/50">
            <span className="material-symbols-outlined text-base align-middle" style={{ fontVariationSettings: "'FILL' 1", color: themeColor }}>bolt</span>
          </span>
          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-0.5 block">Active</span>
        </div>
      </div>

      {/* Custom Link Display / Editor (shown after double-clicking the avatar) */}
      {isEditing && showLinkInput ? (
        <div className="w-full max-w-sm mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <label htmlFor="custom-link-edit" className="block text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-2 px-1">Global Target Link</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#0066FF] transition-colors" aria-hidden="true">
              <span className="material-symbols-outlined text-sm">link</span>
            </div>
            <input
              id="custom-link-edit"
              type="url"
              value={customLink}
              onChange={(e) => setCustomLink(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-white/10 px-11 py-4 text-white font-bold outline-none focus:border-[#0066FF] transition-all placeholder:text-white/5 text-xs"
              placeholder="HTTPS://YOUR-CUSTOM-URL.COM"
            />
          </div>
        </div>
      ) : !isEditing && profile.customLink && (
        <a
          href={profile.customLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 mb-10 px-8 py-3 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.34em] hover:bg-white/10 hover:border-[#0066FF] transition-all active:scale-[0.98] group"
        >
          <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform" style={{ color: themeColor, fontVariationSettings: "'FILL' 1" }}>link</span>
          Launch Profile
        </a>
      )}




    </div>
  );
}

// ──────────────────────────────────────
// HOME PAGE (MAIN CONTROLLER)
// ──────────────────────────────────────
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<"leaderboard" | "profile">("leaderboard");
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setClickCount(data.clickCount);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }, []);

  // 1. Handle Auth Redirects
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 2. Initial Data Fetching
  useEffect(() => {
    if (status === "authenticated") {
      fetchLeaderboard();
      fetchProfile();
    }
  }, [status, fetchLeaderboard, fetchProfile]);

  // 3. Real-time SSE Connection
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        setLeaderboard((prev) => {
          // Handle Profile Updates
          if (data.type === "profile-update") {
            return prev.map(u => u.id === data.userId ? { ...u, ...data } : u);
          }

          // Handle Click Updates
          // 1. Create a map of old ranks for quick lookup
          const oldRanks: { [key: string]: number } = {};
          prev.forEach(u => { oldRanks[u.id] = u.rank; });

          // 2. Update the user who clicked and keep others the same
          const updated = prev.map((user) => {
            if (user.id === data.userId) {
              return { ...user, clickCount: data.clickCount };
            }
            return user;
          });

          // 3. Re-sort and determine NEW ranks
          const sorted = [...updated].sort((a, b) => b.clickCount - a.clickCount);
          
          // 4. Compare new vs old rank for movement indicators
          const finalized = sorted.map((u, i) => {
            const newRank = i + 1;
            const oldRank = oldRanks[u.id] || newRank;
            
            let rankChange: "up" | "down" | "none" = "none";
            if (newRank < oldRank) rankChange = "up";
            else if (newRank > oldRank) rankChange = "down";

            return { ...u, rank: newRank, rankChange };
          });

          // 5. Clear markers after 4 seconds
          setTimeout(() => {
            setLeaderboard(current => 
              current.map(u => ({ ...u, rankChange: "none" }))
            );
          }, 4000);

          return finalized;
        });

        // 2. If it's my own update, sync my profile count
        if (data.userId === session?.user?.id) {
          if (data.type === "profile-update") {
            fetchProfile(); // Full re-fetch for profile
          } else {
            setClickCount(data.clickCount);
            setProfile(p => p ? { ...p, clickCount: data.clickCount } : null);
          }
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [status, session?.user?.id, fetchProfile]);

  const handleClick = async () => {
    // Optimistic update
    setClickCount((prev) => prev + 1);

    try {
      const res = await fetch("/api/clicks", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setClickCount(data.clickCount);
      }
    } catch (err) {
      console.error("Click failed:", err);
      setClickCount((prev) => prev - 1);
    }

    // Refresh leaderboard periodically (every 5 clicks)
    if (clickCount % 5 === 0) {
      fetchLeaderboard();
    }
  };

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchProfile();
        fetchLeaderboard(); // Sync leaderboard immediately
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const goToProfile = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("left");
    setTimeout(() => {
      setCurrentPage("profile");
      setSlideDirection(null);
      setIsAnimating(false);
      fetchProfile();
    }, 300);
  };

  const goToLeaderboard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("right");
    setTimeout(() => {
      setCurrentPage("leaderboard");
      setSlideDirection(null);
      setIsAnimating(false);
      fetchLeaderboard();
    }, 300);
  };

  const getSlideClass = () => {
    if (slideDirection === "left") return "animate-slide-out-left";
    if (slideDirection === "right") return "animate-slide-out-right";
    return "animate-slide-in";
  };

  if (status === "loading" || !profile) {
    return (
      <div className="bg-[#0d0d0f] text-white min-h-screen flex items-center justify-center font-body">
        <div className="text-center">
          <h1 className="text-3xl font-headline font-black tracking-widest uppercase mb-4">
            Click<span style={{ color: "#0066FF" }}>Me</span>
          </h1>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const themeColor = profile.themeColor || "#FFAA00";

  return (
    <div className="bg-[#0d0d0f] text-white min-h-screen font-body overflow-x-hidden relative">
      <div className={`transition-all duration-300 ${getSlideClass()}`}>
        {currentPage === "leaderboard" ? (
          <LeaderboardPage
            leaderboard={leaderboard}
            currentUserId={profile.id}
            userThemeColor={themeColor}
          />
        ) : (
          <ProfilePage
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            themeColor={themeColor}
          />
        )}
      </div>

      <CurvedFooter
        currentPage={currentPage}
        onGoLeft={goToLeaderboard}
        onGoRight={goToProfile}
        onClickMe={handleClick}
        clickCount={clickCount}
        themeColor={themeColor}
      />
    </div>
  );
}
