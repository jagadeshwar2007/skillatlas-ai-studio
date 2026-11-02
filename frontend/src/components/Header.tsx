"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Activity, Cpu, HardDrive } from "lucide-react";

export function Header() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/assets/system-status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-300">
          Educational Video Production Workspace
        </span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
          1080×1920 • 9:16 Portrait • 30 FPS
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Live System Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">
            {status?.ffmpeg?.available ? "FFmpeg 9.0 Active" : "Compositor Online"}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-semibold">
            {status?.api_keys?.gemini ? "Gemini AI" : "Smart AI"}
          </span>
        </div>

        <Link
          href="/create"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>New Educational Video</span>
        </Link>
      </div>
    </header>
  );
}
