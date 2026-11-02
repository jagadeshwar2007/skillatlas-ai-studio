"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  Video, 
  Trash2, 
  Play, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Search,
  Sparkles,
  Download
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadProjects = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this educational video project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Project Management</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Educational Video Projects</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, manage, edit storyboards, preview 3D scenes, and download rendered 1080×1920 MP4 files.
          </p>
        </div>

        <Link
          href="/create"
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>New Video Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["all", "completed", "storyboarded", "rendering", "draft"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === st
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-surface/30 space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-base font-semibold text-white">No projects found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get started by entering an educational topic in the creator to formulate your first kinetic video storyboard.
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create First Video</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              {/* Card Top Preview Box */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    proj.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : proj.status === "rendering"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  }`}>
                    {proj.status}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{proj.storyboard?.total_duration || 45}s</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {proj.analysis?.suggested_visual_metaphor || proj.topic}
                  </p>
                </div>

                {/* Scene pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.storyboard?.scenes?.slice(0, 3).map((s: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {s.title}
                    </span>
                  ))}
                  {proj.storyboard?.scenes?.length > 3 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500">
                      +{proj.storyboard.scenes.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/storyboard/${proj.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Storyboard
                  </Link>
                  <Link
                    href={`/studio/${proj.id}`}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition-colors"
                  >
                    3D Studio
                  </Link>
                  {proj.video_url && (
                    <a
                      href={proj.video_url}
                      download
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                      title="Download 1080x1920 MP4"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={(e) => handleDelete(proj.id, e)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
