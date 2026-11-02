"use client";

import React, { useState } from "react";
import { 
  Mic2, 
  Volume2, 
  Play, 
  Pause, 
  Check, 
  Sparkles, 
  Settings2,
  Headphones
} from "lucide-react";

const VOICES = [
  {
    id: "en-US-ChristopherNeural",
    name: "Christopher",
    gender: "Male",
    accent: "American",
    tone: "Confident, engaging, authoritative",
    bestFor: "Computer Science, AI, Algorithms, Math",
    sampleText: "What if artificial intelligence isn't thinking at all, but calculating billions of tiny mathematical vibrations?"
  },
  {
    id: "en-US-GuyNeural",
    name: "Guy",
    gender: "Male",
    accent: "American",
    tone: "Deep, cinematic, BBC documentary",
    bestFor: "Cosmology, Relativity, Gravitational Physics",
    sampleText: "What if gravity isn't a force pulling you down, but the universe itself bending around you?"
  },
  {
    id: "en-US-JennyNeural",
    name: "Jenny",
    gender: "Female",
    accent: "American",
    tone: "Clear, warm, highly educational",
    bestFor: "Human Anatomy, Biology, Genetics, Chemistry",
    sampleText: "Right now, your heart is beating with enough hydraulic pressure to circulate blood through thousands of miles of vessels."
  },
  {
    id: "en-GB-RyanNeural",
    name: "Ryan",
    gender: "Male",
    accent: "British",
    tone: "Refined, articulate, technical",
    bestFor: "Mechanical Engineering, Electric Motors, Aviation",
    sampleText: "By reversing the current direction twice every turn, the split-ring commutator keeps the rotor spinning in perpetual harmony."
  },
  {
    id: "en-US-AriaNeural",
    name: "Aria",
    gender: "Female",
    accent: "American",
    tone: "Vibrant, dynamic, social-first",
    bestFor: "TikTok / Reels viral hooks, quick factoids",
    sampleText: "How can a computer find one single name out of four billion records in just thirty-two steps?"
  }
];

export default function VoiceLibraryPage() {
  const [selectedVoice, setSelectedVoice] = useState("en-US-ChristopherNeural");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleTestVoice = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    setTimeout(() => {
      setPlayingId(null);
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <Mic2 className="w-3.5 h-3.5" />
          <span>Neural Voiceover Engine</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Voice Library & Synthesis</h1>
        <p className="text-sm text-slate-400 mt-1">
          Select and preview natural neural narration voices. High-clarity pronunciation tuned for rapid mobile educational retention.
        </p>
      </div>

      {/* Mode Indicator Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Headphones className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="font-bold text-white">Active Voice Engine: </span>
            <span className="text-emerald-400 font-mono">Edge-TTS Neural Synthesizer (Active & Ready)</span>
          </div>
        </div>
        <span className="text-slate-500 font-mono">ElevenLabs Adapter: Configurable</span>
      </div>

      {/* Voice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VOICES.map((v) => {
          const isSelected = selectedVoice === v.id;
          const isPlaying = playingId === v.id;

          return (
            <div
              key={v.id}
              className={`p-6 rounded-2xl border transition-all ${
                isSelected
                  ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10"
                  : "border-border bg-surface hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <span>{v.name}</span>
                    <span className="text-xs font-mono text-slate-400 font-normal">
                      ({v.accent} • {v.gender})
                    </span>
                  </h3>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">{v.tone}</div>
                </div>

                <button
                  onClick={() => setSelectedVoice(v.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400 text-black"
                      : "border-slate-700 bg-slate-900 text-transparent hover:border-slate-500"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sample Quote */}
              <div className="my-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic">
                "{v.sampleText}"
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-[11px] font-mono text-slate-400">
                  Best For: <span className="text-slate-200">{v.bestFor}</span>
                </div>

                <button
                  onClick={() => handleTestVoice(v.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="text-cyan-400 font-mono">Playing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
