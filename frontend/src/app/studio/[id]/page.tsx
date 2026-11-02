"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ThreeCanvas } from "@/components/ThreeCanvas";
import { 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Video, 
  Volume2, 
  Maximize2, 
  Box, 
  Sliders, 
  Download,
  Layers,
  ChevronRight,
  Eye,
  CheckCircle2
} from "lucide-react";

export default function StudioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<any>(null);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  const handleStartRender = async () => {
    setRendering(true);
    try {
      await fetch("/api/render/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId })
      });
      router.push("/queue");
    } catch (err) {
      console.error(err);
      setRendering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span>Initializing 3D WebGL Studio...</span>
        </div>
      </div>
    );
  }

  if (!project || !project.storyboard) {
    return (
      <div className="p-8 text-center text-slate-400">
        Project or Storyboard not found. <Link href="/projects" className="text-cyan-400 underline">Return</Link>
      </div>
    );
  }

  const scenes = project.storyboard.scenes || [];
  const activeScene = scenes[currentSceneIdx] || scenes[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Link
            href={`/storyboard/${projectId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storyboard Editor</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              3D Animation Studio & Compositor
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              1080×1920 (9:16)
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Topic: {project.topic} • Active Scene: 0{activeScene.scene_number} ({activeScene.title})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {project.video_url && (
            <a
              href={project.video_url}
              download
              className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 hover:bg-emerald-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download MP4</span>
            </a>
          )}
          <button
            onClick={handleStartRender}
            disabled={rendering}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Video className="w-4 h-4 text-black" />
            <span>{rendering ? "Rendering..." : "Render Final Video"}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport (Left: 9:16 3D Canvas; Right: Scene Inspector & Audio Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 9:16 Portrait Canvas (Mobile Reels Aspect Ratio) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-[340px] h-[604px] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl relative bg-black">
            {/* The 3D Canvas */}
            <ThreeCanvas
              topic={project.topic}
              sceneNumber={activeScene.scene_number}
              interactive={true}
            />

            {/* Overlaid TikTok/Instagram Style Captions Preview */}
            <div className="absolute bottom-16 inset-x-4 z-20 pointer-events-none text-center">
              <span className="inline-block px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white font-bold text-sm tracking-wide shadow-lg">
                {activeScene.narration_text?.slice(0, 75)}...
              </span>
            </div>

            {/* Brand Watermark Overlay */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-cyan-500/20">
                SKILLATLAS AI
              </span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs font-mono text-slate-500">
            Previewing: 1080×1920 portrait canvas @ 30 FPS
          </div>
        </div>

        {/* Right: Scene Inspector & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Scene Controls Card */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Scene Parameters</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-500/30">
                Scene {activeScene.scene_number} of {scenes.length}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono">Title: </span>
                <span className="text-white font-semibold">{activeScene.title}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Engine: </span>
                <span className="text-cyan-300 font-mono uppercase font-bold">{activeScene.scene_type}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Camera: </span>
                <span className="text-slate-200 capitalize">{activeScene.camera?.trajectory || "orbit_slow"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Narration: </span>
                <p className="text-slate-300 italic mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  "{activeScene.narration_text}"
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Directives: </span>
                <span className="text-slate-300">{activeScene.visual_description}</span>
              </div>
            </div>
          </div>

          {/* Multi-Scene Selector Strip */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Scene Sequence Timeline</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Click scene to inspect in 3D
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
              {scenes.map((s: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSceneIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentSceneIdx === idx
                      ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md scale-105"
                      : "border-border bg-slate-950/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold">Scene 0{s.scene_number}</div>
                  <div className="text-xs font-semibold text-white line-clamp-1 mt-0.5">{s.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{s.duration}s</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Subtitle Sync Panel */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Soundtrack & Voiceover Synchronization</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                Audio Engine Synchronized
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Voice Profile: {project.storyboard?.voice_id || "Christopher Neural"}</span>
                <span>Background Music: Harmonic Drone (Ducked -14dB)</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-cyan-400 w-1/3" />
                <div className="h-full bg-indigo-500 w-1/3" />
                <div className="h-full bg-emerald-400 w-1/3" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>00:00 Hook</span>
                <span>00:16 Mechanism</span>
                <span>00:32 Climax</span>
                <span>00:45 SkillAtlas Outro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
