"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw, 
  Save, 
  Video, 
  Check, 
  Layers, 
  Camera, 
  Mic2,
  Box,
  Sliders,
  Send
} from "lucide-react";

export default function StoryboardEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        if (data.storyboard?.scenes) {
          setScenes(data.storyboard.scenes);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  const handleMove = (index: number, direction: "up" | "down") => {
    const newScenes = [...scenes];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newScenes.length) return;

    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIdx];
    newScenes[targetIdx] = temp;

    // Re-index scene numbers
    newScenes.forEach((s, idx) => (s.scene_number = idx + 1));
    setScenes(newScenes);
  };

  const handleUpdateText = (index: number, field: string, value: any) => {
    const newScenes = [...scenes];
    newScenes[index] = { ...newScenes[index], [field]: value };
    setScenes(newScenes);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedStoryboard = {
        ...project.storyboard,
        scenes,
        total_duration: scenes.reduce((acc, s) => acc + (Number(s.duration) || 0), 0)
      };

      const res = await fetch(`/api/projects/${projectId}/storyboard`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStoryboard)
      });
      const data = await res.json();
      setProject(data);
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const handleStartRender = async () => {
    setRendering(true);
    await handleSave();
    try {
      const res = await fetch("/api/render/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId })
      });
      const job = await res.json();
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
          <span>Loading Storyboard & 3D Specifications...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-400">
        Project not found. <Link href="/projects" className="text-cyan-400 underline">Return to Projects</Link>
      </div>
    );
  }

  const totalDuration = scenes.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Storyboard & Scene Director
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {project.topic} • {scenes.length} Scenes • Total: {Math.round(totalDuration)}s
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Storyboard"}</span>
          </button>

          <Link
            href={`/studio/${projectId}`}
            className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Box className="w-4 h-4" />
            <span>Open 3D Studio</span>
          </Link>

          <button
            onClick={handleStartRender}
            disabled={rendering}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Video className="w-4 h-4 text-black" />
            <span>{rendering ? "Enqueuing..." : "Render 1080×1920 MP4"}</span>
          </button>
        </div>
      </div>

      {/* Visual Metaphor Card */}
      {project.analysis && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-surface to-indigo-950/20 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Metaphor Selected by AI</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            {project.analysis.suggested_visual_metaphor}
          </h2>
          <p className="text-xs text-slate-300">
            {project.analysis.metaphor_explanation}
          </p>
        </div>
      )}

      {/* Scene Cards Sequence */}
      <div className="space-y-6">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id || idx}
            className="p-6 rounded-2xl bg-surface border border-border space-y-5 hover:border-slate-700 transition-all shadow-sm"
          >
            {/* Scene Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center">
                  0{scene.scene_number}
                </span>
                <input
                  type="text"
                  value={scene.title}
                  onChange={(e) => handleUpdateText(idx, "title", e.target.value)}
                  className="font-bold text-base text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 capitalize">
                  {scene.scene_type?.replace("_", " ")}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/20 text-cyan-300">
                  {scene.duration}s
                </span>
                {/* Reordering Controls */}
                <div className="flex items-center pl-2 space-x-1">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === scenes.length - 1}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Narration Script Editor */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Mic2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voiceover Narration Script</span>
              </label>
              <textarea
                rows={2}
                value={scene.narration_text}
                onChange={(e) => handleUpdateText(idx, "narration_text", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* 3D Visual Description & Camera */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3D Animation Directives</span>
                </label>
                <input
                  type="text"
                  value={scene.visual_description}
                  onChange={(e) => handleUpdateText(idx, "visual_description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Camera Trajectory & Duration</span>
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={scene.camera?.trajectory || "orbit_slow"}
                    onChange={(e) => {
                      const newCam = { ...(scene.camera || {}), trajectory: e.target.value };
                      handleUpdateText(idx, "camera", newCam);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="orbit_slow">Slow Cinematic Orbit</option>
                    <option value="dolly_in">Dolly In (Zoom to Focus)</option>
                    <option value="pan_horizontal">Horizontal Track Pan</option>
                    <option value="fly_through">Sub-atomic Fly Through</option>
                  </select>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <input
                      type="number"
                      min={4}
                      max={20}
                      step={0.5}
                      value={scene.duration}
                      onChange={(e) => handleUpdateText(idx, "duration", parseFloat(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs text-white"
                    />
                    <span>sec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
