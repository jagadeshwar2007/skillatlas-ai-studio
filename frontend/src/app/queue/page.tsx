"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ListOrdered, 
  RotateCcw, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  ExternalLink,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";

export default function RenderingQueuePage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = () => {
    fetch("/api/render/queue")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Autonomous Render Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Rendering Queue</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time pipeline monitoring: Voiceover synthesis, 1080×1920 visual rendering, and FFmpeg MP4 composition.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Queue List */}
      {loading && jobs.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-cyan-400 font-mono text-sm">
          <Activity className="w-4 h-4 animate-spin mr-2" />
          <span>Checking rendering pipeline...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-surface/30 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-base font-semibold text-white">All queues are clear</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No videos currently rendering. Create a new topic or trigger a render from the Storyboard editor.
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Video</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isCompleted = job.status === "completed";
            const isFailed = job.status === "failed";
            const isRunning = !isCompleted && !isFailed;

            return (
              <div
                key={job.job_id}
                className={`p-6 rounded-2xl border transition-all ${
                  isRunning
                    ? "bg-slate-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                    : isCompleted
                    ? "bg-surface border-border hover:border-slate-700"
                    : "bg-rose-950/20 border-rose-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        JOB #{job.job_id}
                      </span>
                      <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full capitalize font-semibold ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : isFailed
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse"
                      }`}>
                        {job.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Project: {job.project_id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {job.current_step}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {job.output_video_path && (
                      <a
                        href={job.output_video_path}
                        download
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download 1080×1920 MP4</span>
                      </a>
                    )}
                    <Link
                      href={`/studio/${job.project_id}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      Inspect in Studio
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Render Progress</span>
                    <span className="text-cyan-400 font-bold">{job.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-emerald-400"
                          : isFailed
                          ? "bg-rose-500"
                          : "bg-gradient-to-r from-cyan-400 to-indigo-500"
                      }`}
                      style={{ width: `${Math.max(5, job.progress)}%` }}
                    />
                  </div>
                </div>

                {isFailed && job.error_message && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-xs text-rose-300 font-mono">
                    Error: {job.error_message}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
