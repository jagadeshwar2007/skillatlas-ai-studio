"use client";

import React, { useState } from "react";
import { 
  Boxes, 
  Layers, 
  Sparkles, 
  Video, 
  Volume2, 
  Box, 
  Cpu, 
  Search, 
  Filter,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

const ASSETS = [
  { id: "neural_net_3d", name: "Synaptic Neural Network Graph", type: "procedural_3d", engine: "Engine A (Three.js)", vertices: 48, format: "BufferGeometry", tags: ["AI", "Calculus", "Neurons"], color: "border-cyan-500/30 bg-cyan-950/20 text-cyan-400" },
  { id: "heart_cardioid", name: "4-Chamber Cardioid Muscle", type: "procedural_3d", engine: "Engine A (Three.js)", vertices: 1024, format: "Deformed Mesh", tags: ["Biology", "Cardiology", "Pumping"], color: "border-rose-500/30 bg-rose-950/20 text-rose-400" },
  { id: "binary_blocks", name: "Sorted Array Prism Blocks", type: "procedural_3d", engine: "Engine A (Three.js)", vertices: 96, format: "InstancedBox", tags: ["Algorithms", "O(log n)", "Search"], color: "border-sky-500/30 bg-sky-950/20 text-sky-400" },
  { id: "electric_motor", name: "Dual-Pole Armature & Stator", type: "procedural_3d", engine: "Engine A (Three.js)", vertices: 256, format: "Cylinder/Torus", tags: ["Electromagnet", "Physics", "Torque"], color: "border-amber-500/30 bg-amber-950/20 text-amber-400" },
  { id: "spacetime_warp", name: "Curved Metric Geodesic Grid", type: "procedural_3d", engine: "Engine A (Three.js)", vertices: 625, format: "Parametric Grid", tags: ["Relativity", "Gravity", "Einstein"], color: "border-indigo-500/30 bg-indigo-950/20 text-indigo-400" },
  { id: "veo_motion_plasma", name: "Atmospheric Cosmic Particle Flow", type: "ai_video", engine: "Engine B (Veo Adapter)", vertices: 0, format: "1080x1920 MP4", tags: ["Atmospheric", "Background", "Veo"], color: "border-purple-500/30 bg-purple-950/20 text-purple-400" },
  { id: "drone_synth_c_minor", name: "Harmonic Ambient Tech Pulse", type: "audio", engine: "Audio Synthesizer", vertices: 0, format: "44.1kHz Stereo MP3", tags: ["Royalty-Free", "Low-Pass", "Soundtrack"], color: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" }
];

export default function AssetLibraryPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ASSETS.filter((a) => {
    const matchesFilter = filter === "all" || a.type === filter;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <Boxes className="w-3.5 h-3.5" />
          <span>Asset & Material Repository</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Studio Asset Library</h1>
        <p className="text-sm text-slate-400 mt-1">
          Catalog of 3D procedural geometries, AI video atmospheric backgrounds, audio soundscapes, and shader materials.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search assets or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Assets" },
            { id: "procedural_3d", label: "Programmatic 3D" },
            { id: "ai_video", label: "AI Video" },
            { id: "audio", label: "Soundscapes" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === btn.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className={`p-6 rounded-2xl border ${asset.color} flex flex-col justify-between space-y-4 shadow-sm hover:border-white/30 transition-all`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10">
                  {asset.engine}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {asset.format}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{asset.name}</h3>
                {asset.vertices > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Complexity: {asset.vertices} geometry vertices
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {asset.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-slate-300 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Status: <span className="text-emerald-400 font-bold">Ready</span></span>
              <span className="text-cyan-300">Procedural Instant</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
