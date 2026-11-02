"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  FolderKanban, 
  Layers, 
  Boxes, 
  Mic2, 
  ListOrdered, 
  Settings, 
  Sparkles,
  PlaySquare
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create Video", icon: Sparkles, badge: "AI" },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/queue", label: "Rendering Queue", icon: ListOrdered },
  { href: "/assets", label: "Asset Library", icon: Boxes },
  { href: "/voices", label: "Voice Library", icon: Mic2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              SKILLATLAS
            </span>
            <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-semibold">
              AI STUDIO
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
          Studio Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/25 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-200"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tagline Card */}
      <div className="p-4 border-t border-border">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="text-[11px] font-mono text-cyan-400 font-medium">SKILLATLAS AI</div>
          <div className="text-slate-300 text-xs font-semibold mt-1">Learn. Experiment. Build.</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Autonomous Video Engine</div>
        </div>
      </div>
    </aside>
  );
}
