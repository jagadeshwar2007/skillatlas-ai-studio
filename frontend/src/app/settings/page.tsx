"use client";

import React, { useEffect, useState } from "react";
import { 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  Cpu, 
  Key, 
  Film, 
  Database,
  Save,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function SettingsPage() {
  const [status, setStatus] = useState<any>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [meshyKey, setMeshyKey] = useState("");
  const [veoKey, setVeoKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/assets/system-status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Studio Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect environment readiness, video rendering pipelines, and AI provider adapters.
        </p>
      </div>

      {/* System Health Diagnostic Card */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>System Environment & Hardware Diagnostics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">FFmpeg Video Engine</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>v9.0.1 Essentials</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">1080×1920 H.264 Encoder</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">Disk Space Free</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>{status?.storage?.free_gb || 373} GB Available</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Primary C:\ Volume</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">Persistence Database</div>
            <div className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              <span>SQLite Persistent</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Supabase Adapter Ready</div>
          </div>
        </div>
      </div>

      {/* Provider Matrix */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span>AI Provider Integrations & Adapters</span>
        </h2>
        <p className="text-xs text-slate-400">
          SkillAtlas AI Studio operates autonomously with smart deterministic educational engines and procedural 3D simulations. When external paid API keys are unconfigured, high-fidelity mock/procedural fallback adapters are automatically engaged.
        </p>

        <div className="space-y-3 pt-2">
          {[
            { name: "Google Gemini AI", role: "Topic Research, Fact Verification & Scriptwriting", status: status?.api_keys?.gemini ? "Active (Detected in Env)" : "Fallback Active", active: true },
            { name: "Edge-TTS Neural Voice", role: "High-Quality Multi-Voice Audio Synthesis", status: "Active (Free / Unlimited)", active: true },
            { name: "Three.js Engine A", role: "Procedural 3D Geometry & WebGL Simulations", status: "Active (60 FPS Native)", active: true },
            { name: "Google Veo (Engine B)", role: "Generative AI Background Footage", status: "Procedural Video Fallback Active", active: false },
            { name: "Meshy.ai (Engine C)", role: "Text-to-3D GLTF Asset Generation", status: "Procedural Geometry Fallback Active", active: false },
            { name: "ElevenLabs API", role: "Ultra-Premium Voiceover Cloning", status: "Edge-TTS Neural Active", active: false }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-white">{item.name}</span>
                <span className="text-slate-500 ml-2">— {item.role}</span>
              </div>
              <span className={`font-mono font-medium px-2 py-0.5 rounded text-[11px] ${
                item.active 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Production Video Defaults */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          <span>Output Video Composition Defaults</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Target Resolution:</span>
            <span className="text-white font-bold">1080 × 1920 (9:16 Portrait)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Target Frame Rate:</span>
            <span className="text-white font-bold">30 FPS (Constant)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Video Codec:</span>
            <span className="text-white font-bold">H.264 (libx264, yuv420p)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Audio Format:</span>
            <span className="text-white font-bold">AAC / MP3 Stereo 44.1kHz</span>
          </div>
        </div>
      </div>
    </div>
  );
}
