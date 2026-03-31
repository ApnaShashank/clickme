"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ThemedLoading from "@/components/ThemedLoading";
import Link from "next/link";

interface VaultUser {
  _id: string;
  name: string;
  email: string;
  instagramUsername: string;
  avatarUrl: string;
  themeColor: string;
  clickCount: number;
  rank: number;
  loginCount: number;
  lastLogin: Date;
  createdAt: Date;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<VaultUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<VaultUser[]>([]);
  const [filter, setFilter] = useState("RANK");
  const [loading, setLoading] = useState(true);

  // Security Gate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session?.user?.email !== "shashank8808108802@gmail.com") {
        router.push("/");
      } else {
        fetchUsers();
      }
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to load vault ledger.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let sorted = [...users];
    if (filter === "RANK") {
      sorted.sort((a, b) => a.rank - b.rank); // 1 = #1
    } else if (filter === "NEWEST") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filter === "OLDEST") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filter === "ACTIVE") {
      sorted.sort((a, b) => b.loginCount - a.loginCount);
    } else if (filter === "RECENT") {
      sorted.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
    }
    setFilteredUsers(sorted);
  }, [filter, users]);

  if (loading || status === "loading") {
    return <ThemedLoading status="DECRYPTING_LEDGER..." fullScreen={true} />;
  }

  // Double check before render
  if (session?.user?.email !== "shashank8808108802@gmail.com") return null;

  return (
    <div className="min-h-screen bg-matte-black text-white font-body pb-20 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} className="w-full h-full" />
      </div>

      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-matte-silver px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-headline font-black tracking-widest uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">shield_person</span>
            VAULT_ADMIN
          </h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">Global Player Ledger</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/" className="silver-button px-4 py-2 font-headline font-black text-[10px] tracking-widest uppercase active:scale-95 transition-transform">
            GO_TO_ARENA
          </Link>
          <button onClick={() => signOut()} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 active:scale-95 transition-all">
            LOGOUT
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
        
        {/* Statistics Board */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden group">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 block mb-1">Total Players</span>
            <span className="text-3xl font-headline font-black tracking-tighter">{users.length}</span>
            <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">groups</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden group">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 block mb-1">Total Clicks</span>
            <span className="text-3xl font-headline font-black tracking-tighter">{users.reduce((acc, u) => acc + u.clickCount, 0).toLocaleString()}</span>
            <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">ads_click</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden group">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 block mb-1">System Status</span>
             <span className="text-3xl font-headline font-black tracking-tighter text-green-500">ONLINE</span>
             <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity text-green-500">wifi</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden group flex items-end">
             <button onClick={fetchUsers} className="w-full bg-white text-black font-headline font-black text-xs uppercase tracking-widest py-3 active:scale-95 transition-all flex items-center justify-center gap-2">
               <span className="material-symbols-outlined text-sm">refresh</span>
               FORCE_SYNC
             </button>
          </div>
        </div>

        {/* Filter Console */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
          {[
            { id: "RANK", label: "HIGHEST RANK" },
            { id: "NEWEST", label: "NEW USERS" },
            { id: "OLDEST", label: "OLD USERS" },
            { id: "ACTIVE", label: "MOST LOGINS" },
            { id: "RECENT", label: "RECENTLY ONLINE" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${
                filter === f.id 
                  ? "bg-white text-black border-white" 
                  : "bg-white/5 text-white/40 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* The Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-[#0f0f0f] border border-[#222] p-5 relative group overflow-hidden hover:border-[#444] transition-colors">
               
               {/* Color Accent Bar */}
               <div className="absolute top-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: user.themeColor || "#fff" }} />
               
               {/* Header: Avatar, Name, Rank */}
               <div className="flex items-start justify-between mb-4 mt-1">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/5 rounded-sm overflow-hidden border border-white/10 relative">
                     <Image src={user.avatarUrl || "https://ik.imagekit.io/DEMOPROJECT/Click%20Me%20Button%20Icon.png"} alt={user.name} fill className="object-cover" />
                   </div>
                   <div>
                     <h2 className="font-headline font-black text-sm uppercase tracking-wider">{user.name}</h2>
                     <div className="flex items-center gap-1 opacity-50">
                       <span className="material-symbols-outlined text-[10px]">alternate_email</span>
                       <span className="text-[9px] font-black uppercase tracking-widest">{user.instagramUsername}</span>
                     </div>
                   </div>
                 </div>
                 <div className="bg-white/10 px-2 py-1 rounded-sm flex items-center gap-1">
                   <span className="text-[8px] font-black uppercase tracking-widest text-[#0066FF]">RANK</span>
                   <span className="font-headline font-black text-xs">#{user.rank}</span>
                 </div>
               </div>

               {/* Email Block */}
               <div className="mb-4">
                 <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">Identity Mail</span>
                 <div className="text-[10px] font-mono tracking-wider break-all bg-black/40 px-2 py-1 border border-white/5">{user.email}</div>
               </div>

               {/* Activity Stats */}
               <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-black/30 border border-white/5 p-2 text-center rounded-sm">
                    <span className="block text-sm font-headline font-black">{user.loginCount}</span>
                    <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mt-0.5 block">Logins</span>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-2 text-center rounded-sm">
                    <span className="block text-sm font-headline font-black text-white/80">{user.clickCount.toLocaleString()}</span>
                    <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mt-0.5 block">Clicks</span>
                  </div>
               </div>

               {/* Dates (Last Login / Joined) */}
               <div className="space-y-1.5 border-t border-white/5 pt-3">
                 <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                   <span>Last Online:</span>
                   <span className="text-white/80 text-[9px]">{new Date(user.lastLogin || user.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                   <span>System Entry (Joined):</span>
                   <span className="text-white/80 text-[9px]">{new Date(user.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                   <span>Theme Swatch:</span>
                   <div className="flex items-center gap-1">
                     <span className="text-white/80 text-[9px]">{user.themeColor}</span>
                     <div className="w-3 h-3 rounded-sm border border-white/20" style={{ backgroundColor: user.themeColor }} />
                   </div>
                 </div>
               </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
             <div className="col-span-full py-12 text-center border border-dashed border-white/10">
                <span className="material-symbols-outlined text-4xl text-white/20 mb-2">find_in_page</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">No matching identities found in Ledger.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
