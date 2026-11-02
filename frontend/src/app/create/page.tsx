"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Layers, 
  Tv, 
  Mic2, 
  Palette, 
  Users, 
  ArrowRight, 
  Clock, 
  Check, 
  Sliders,
  Cpu
} from "lucide-react";

const STYLES = [
  { id: "cyber_scientific", name: "Cyber Scientific", desc: "Futuristic neon glows, technical grids, high-contrast dark space", color: "border-cyan-500/50 bg-cyan-950/20 text-cyan-400" },
  { id: "minimal_dark", name: "Minimal Dark", desc: "Understated elegance, sleek monochromatic shadows, clean lines", color: "border-slate-500/50 bg-slate-900/40 text-slate-300" },
  { id: "blueprint_technical", name: "Blueprint Technical", desc: "Schematic lines, architectural measurements, precise geometry", color: "border-sky-500/50 bg-sky-950/20 text-sky-400" },
  { id: "neon_glow", name: "Neon Glow", desc: "Vibrant hyper-luminous cyberpunk accents with deep purples", color: "border-fuchsia-500/50 bg-fuchsia-950/20 text-fuchsia-400" },
  { id: "organic_biology", name: "Organic Biology", desc: "Natural fluid cellular curves, vital crimson and chlorophyll green", color: "border-emerald-500/50 bg-emerald-950/20 text-emerald-400" }
];

const AUDIENCES = [
  { id: "general_curious", name: "General Curious", desc: "Engaging, conversational, vivid analogies" },
  { id: "student_beginner", name: "Student Beginner", desc: "Step-by-step foundational decomposition" },
  { id: "college_technical", name: "College / Technical", desc: "Rigorous scientific terms & mathematical depth" },
  { id: "executive_summary", name: "Executive Summary", desc: "High-level strategic impact & key takeaways" }
];

const VOICES = [
  { id: "en-US-ChristopherNeural", name: "Christopher", desc: "Confident, engaging, authoritative", gender: "Male" },
  { id: "en-US-GuyNeural", name: "Guy", desc: "Deep cinematic documentary narrator", gender: "Male" },
  { id: "en-US-JennyNeural", name: "Jenny", desc: "Warm, crystal clear, educational", gender: "Female" },
  { id: "en-GB-RyanNeural", name: "Ryan", desc: "Refined British technical presenter", gender: "Male" }
];

export default function CreateVideoPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("general_curious");
  const [style, setStyle] = useState("cyber_scientific");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [duration, setDuration] = useState(45);
  const [voiceId, setVoiceId] = useState("en-US-ChristopherNeural");
  const [enginePreference, setEnginePreference] = useState<string>("procedural_3d");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate/create-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          audience,
          style,
          aspect_ratio: aspectRatio,
          duration_seconds: duration,
          voice_id: voiceId,
          engine_preference: enginePreference
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 1: Production Briefing</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Create Educational Video</h1>
        <p className="text-sm text-slate-400 mt-1">
          Specify your educational topic and target parameters. The AI pipeline will classify the domain, formulate a visual metaphor, write the script, and generate 3D scene specifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Topic Input */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <span>Educational Topic</span>
            <span className="text-cyan-400 font-mono text-xs">(Any Concept or Phenomenon)</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. How does ChatGPT work? or How does the human heart work?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          />
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-mono">Suggestions:</span>
            {[
              "How does an AI neural network work?",
              "How does the human heart work?",
              "How does binary search work?",
              "How does an electric motor work?",
              "How does gravity work?"
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTopic(p)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                {p.replace("How does ", "").replace(" work?", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Style Selection */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Visual Metaphor & Aesthetics</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STYLES.map((st) => (
              <div
                key={st.id}
                onClick={() => setStyle(st.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  style === st.id ? st.color + " shadow-md" : "border-border bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span>{st.name}</span>
                  {style === st.id && <Check className="w-4 h-4" />}
                </div>
                <div className="text-xs text-slate-400 mt-1">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Target Audience</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUDIENCES.map((aud) => (
              <div
                key={aud.id}
                onClick={() => setAudience(aud.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  audience === aud.id
                    ? "border-indigo-500 bg-indigo-950/20 text-white shadow-md"
                    : "border-border bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span>{aud.name}</span>
                  {audience === aud.id && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className="text-xs text-slate-400 mt-1">{aud.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aspect Ratio, Duration & Voice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Format */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>Aspect Ratio</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio("9:16")}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                  aspectRatio === "9:16"
                    ? "border-cyan-500 bg-cyan-950/30 text-cyan-300"
                    : "border-border bg-slate-950 text-slate-400"
                }`}
              >
                9:16 Portrait
                <span className="block text-[10px] text-slate-500 font-normal">Reels/Shorts</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio("16:9")}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                  aspectRatio === "16:9"
                    ? "border-cyan-500 bg-cyan-950/30 text-cyan-300"
                    : "border-border bg-slate-950 text-slate-400"
                }`}
              >
                16:9 Landscape
                <span className="block text-[10px] text-slate-500 font-normal">YouTube</span>
              </button>
            </div>
          </div>

          {/* Duration */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Duration</span>
            </label>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{duration} seconds</span>
              <span>5 Scenes</span>
            </div>
            <input
              type="range"
              min={30}
              max={90}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Voice */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
              <Mic2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Voiceover Profile</span>
            </label>
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.desc})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Engine Preference (Hybrid AI Engine) */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Hybrid Rendering Engine Orchestration</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "procedural_3d", title: "Engine A: Programmatic 3D", desc: "Three.js procedural WebGL geometries, camera orbits & dynamic labels" },
              { id: "ai_video", title: "Engine B: AI Video Generation", desc: "Veo / generative video cinematic backgrounds and atmospheric footage" },
              { id: "generated_3d_assets", title: "Engine C: AI 3D Assets", desc: "Meshy / Tripo GLTF custom models and machinery components" }
            ].map((eng) => (
              <div
                key={eng.id}
                onClick={() => setEnginePreference(eng.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  enginePreference === eng.id
                    ? "border-cyan-400 bg-cyan-950/20 text-white shadow-md"
                    : "border-border bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-semibold text-xs text-cyan-300">{eng.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">{eng.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Decomposing Topic & Generating Storyboard...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video Storyboard & 3D Scenes</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
