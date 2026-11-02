"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Video, 
  Boxes, 
  Play, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Activity,
  Flame,
  ExternalLink
} from "lucide-react";

const BENCHMARKS = [
  { topic: "How does an AI neural network work?", category: "Computer Science", engine: "Procedural 3D", badge: "Neural WebGL", color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400" },
  { topic: "How does the human heart work?", category: "Biology", engine: "Cardio Simulation", badge: "Organ 3D", color: "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400" },
  { topic: "How does binary search work?", category: "Algorithms", engine: "Procedural 3D", badge: "O(log n)", color: "from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-400" },
  { topic: "How does an electric motor work?", category: "Mechanics", engine: "Lorentz Force 3D", badge: "Electromagnet", color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400" },
  { topic: "How does gravity work?", category: "Physics", engine: "Spacetime Warp", badge: "Relativity", color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [quickTopic, setQuickTopic] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => {});
  }, []);

  const handleCreate = async (topicToUse?: string) => {
    const t = topicToUse || quickTopic;
    if (!t.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate/create-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: t,
          audience: "general_curious",
          style: "cyber_scientific",
          aspect_ratio: "9:16",
          duration_seconds: 45
        })
      });
      const data = await res.json();
      router.push(`/storyboard/${data.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-border bg-gradient-to-br from-surface via-slate-900 to-black">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal AI Educational Video Studio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Turn Any Concept into a{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Kinetic 3D Video
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Powered by Three.js procedural animation, neural voiceover, and automated video composition.
            Optimized for 1080×1920 (9:16 portrait) Instagram Reels, YouTube Shorts, and TikTok.
          </p>

          {/* Quick Input Box */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Enter ANY educational topic (e.g. How does quantum computing work?)"
                value={quickTopic}
                onChange={(e) => setQuickTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="w-full px-5 py-4 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
              />
            </div>
            <button
              onClick={() => handleCreate()}
              disabled={loading || !quickTopic.trim()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Total Projects</div>
            <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Render Resolution</div>
            <div className="text-2xl font-bold text-white mt-1">1080×1920</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">FPS / Aspect Ratio</div>
            <div className="text-2xl font-bold text-white mt-1">30 FPS • 9:16</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">3D Engines Online</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">3 Ready</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Benchmark Demonstrations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Benchmark Educational Visualizations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant generation across distinct domains with custom 3D scene generators
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENCHMARKS.map((b, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border bg-gradient-to-br ${b.color} flex flex-col justify-between group hover:border-white/30 transition-all cursor-pointer`}
              onClick={() => handleCreate(b.topic)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-md bg-black/40 border border-white/10">
                    {b.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    {b.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {b.topic}
                </h3>
                <p className="text-xs text-slate-400">
                  Engine: <span className="text-slate-200 font-semibold">{b.engine}</span>
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                <span>Generate Video</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Educational Videos</h2>
          <Link href="/projects" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface/40 space-y-3">
            <Video className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm text-slate-400">No educational videos created yet.</div>
            <button
              onClick={() => handleCreate("How does an AI neural network work?")}
              className="text-xs px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 font-medium transition-colors"
            >
              Generate First Benchmark Video
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-xs font-mono uppercase text-slate-400 border-b border-border">
                <tr>
                  <th className="px-6 py-4">Topic & Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Scenes</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{p.title}</div>
                      <div className="text-xs text-slate-500">{p.topic}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === "completed" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : p.status === "rendering"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      {p.storyboard?.scenes?.length || 5} scenes
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      {p.storyboard?.total_duration || 45}s
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/storyboard/${p.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                      >
                        Storyboard
                      </Link>
                      <Link
                        href={`/studio/${p.id}`}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-colors"
                      >
                        Open Studio
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
