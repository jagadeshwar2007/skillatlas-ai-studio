import os
import subprocess
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.config import OUTPUTS_DIR, AUDIO_DIR, settings, FFMPEG_BIN, FFPROBE_BIN
from app.models.schemas import Storyboard, RenderJob, Project
from app.services.integrations.tts_synthesizer import TTSSynthesizer
from app.services.render.audio_engine import AudioEngine
from app.services.render.subtitles import SubtitleEngine
from app.database import save_render_job, get_render_job, save_project, get_project

class VideoCompositor:
    @classmethod
    async def render_project(cls, project_id: str, job_id: str) -> str:
        """
        Asynchronously executes full 1080x1920 30FPS MP4 video render pipeline:
        1. Voiceover Synthesis (Scene by scene)
        2. Master Audio Mixing with Ambient Music
        3. Subtitle Generation (SRT & ASS)
        4. Scene Visual Synthesis (1080x1920 30fps)
        5. FFmpeg Video Stitching & Subtitle Burn-In
        """
        job = get_render_job(job_id)
        project = get_project(project_id)
        if not job or not project or not project.storyboard:
            raise ValueError(f"Invalid render job or project: {project_id}")

        storyboard = project.storyboard
        work_dir = OUTPUTS_DIR / f"job_{job_id}"
        work_dir.mkdir(parents=True, exist_ok=True)

        try:
            # Step 1: Synthesize Audio
            job.status = "generating_audio"
            job.current_step = "Synthesizing Neural Voiceover"
            job.progress = 15
            save_render_job(job)

            scenes_audio_info: List[Dict[str, Any]] = []
            audio_clips: List[Dict[str, Any]] = []
            current_time = 0.0

            for idx, scene in enumerate(storyboard.scenes):
                voice_filename = f"voice_{job_id}_scene_{idx+1}.mp3"
                audio_path, timestamps = await TTSSynthesizer.synthesize(
                    text=scene.narration_text,
                    output_filename=voice_filename,
                    voice_id=storyboard.voice_id
                )
                
                # Probe audio length with ffprobe
                duration = cls._probe_duration(audio_path)
                if duration <= 0:
                    duration = scene.duration

                scenes_audio_info.append({
                    "start_time": current_time,
                    "end_time": current_time + duration,
                    "text": scene.narration_text,
                    "scene_title": scene.title
                })
                audio_clips.append({
                    "audio_path": audio_path,
                    "start_time": current_time,
                    "duration": duration
                })
                # Adjust scene duration to match narration if needed
                scene.duration = max(scene.duration, duration + 0.5)
                current_time += scene.duration

            total_duration = current_time

            # Step 2: Mix Audio & Generate Subtitles
            job.status = "generating_audio"
            job.current_step = "Mixing Multi-Track Audio and Subtitles"
            job.progress = 35
            save_render_job(job)

            master_audio_path = work_dir / "master_audio.mp3"
            AudioEngine.mix_master_audio(audio_clips, total_duration, master_audio_path)

            ass_subtitles_path = work_dir / "subtitles.ass"
            SubtitleEngine.generate_ass(scenes_audio_info, ass_subtitles_path)

            # Step 3: Render Scene Visuals
            job.status = "rendering_frames"
            job.current_step = "Generating 1080x1920 30FPS Educational Visuals"
            job.progress = 55
            save_render_job(job)

            scene_video_paths = []
            for idx, scene in enumerate(storyboard.scenes):
                scene_video_path = work_dir / f"scene_{idx+1}.mp4"
                cls._render_scene_video(
                    scene=scene,
                    duration=scene.duration,
                    output_path=scene_video_path,
                    topic=storyboard.topic,
                    style=storyboard.style.value
                )
                scene_video_paths.append(scene_video_path)
                job.progress = 55 + int(20 * (idx + 1) / len(storyboard.scenes))
                save_render_job(job)

            # Step 4: Concatenate Scenes & Composite with Audio
            job.status = "compositing"
            job.current_step = "Compositing Final MP4 with Audio and Captions"
            job.progress = 80
            save_render_job(job)

            # Concat file
            concat_list_file = work_dir / "concat_list.txt"
            with open(concat_list_file, "w", encoding="utf-8") as f:
                for svp in scene_video_paths:
                    # Escape path for ffmpeg concat
                    norm_path = str(svp).replace('\\', '/')
                    f.write(f"file '{norm_path}'\n")

            temp_video = work_dir / "temp_video.mp4"
            concat_cmd = [
                FFMPEG_BIN, "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", str(concat_list_file),
                "-c", "copy",
                str(temp_video)
            ]
            subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

            # Final export with audio and burned-in subtitles
            final_output_file = OUTPUTS_DIR / f"{project_id}.mp4"
            
            # Formulate final ffmpeg burn command
            escaped_ass = str(ass_subtitles_path).replace('\\', '/').replace(':', '\\:')
            final_cmd = [
                FFMPEG_BIN, "-y",
                "-i", str(temp_video),
                "-i", str(master_audio_path),
                "-vf", f"subtitles='{escaped_ass}'",
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-crf", "22",
                "-pix_fmt", "yuv420p",
                "-c:a", "aac",
                "-b:a", "192k",
                "-shortest",
                str(final_output_file)
            ]
            
            # Execute final composition
            res = subprocess.run(final_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if res.returncode != 0:
                # If subtitles filter failed (e.g. font missing), compile without subtitles filter
                fallback_cmd = [
                    FFMPEG_BIN, "-y",
                    "-i", str(temp_video),
                    "-i", str(master_audio_path),
                    "-c:v", "libx264",
                    "-preset", "veryfast",
                    "-crf", "22",
                    "-pix_fmt", "yuv420p",
                    "-c:a", "aac",
                    "-b:a", "192k",
                    "-shortest",
                    str(final_output_file)
                ]
                subprocess.run(fallback_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

            # Mark Completed
            job.status = "completed"
            job.progress = 100
            job.current_step = "Video Production Complete"
            job.output_video_path = f"/api/storage/outputs/{project_id}.mp4"
            save_render_job(job)

            project.status = "completed"
            project.video_url = f"/api/storage/outputs/{project_id}.mp4"
            save_project(project)

            return str(final_output_file)

        except Exception as e:
            job.status = "failed"
            job.error_message = str(e)
            job.current_step = f"Rendering error: {e}"
            save_render_job(job)
            project.status = "failed"
            save_project(project)
            print(f"Render error: {e}")
            raise e

    @staticmethod
    def _probe_duration(filepath: str) -> float:
        """Probes exact duration in seconds using ffprobe."""
        try:
            cmd = [
                FFPROBE_BIN, "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                filepath
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return float(res.stdout.strip())
        except Exception:
            return 8.0

    @classmethod
    def _render_scene_video(
        cls,
        scene: Any,
        duration: float,
        output_path: Path,
        topic: str,
        style: str
    ):
        """
        Renders an educational 1080x1920 30FPS scene clip with dynamic visual patterns,
        procedural graphics, and topic branding.
        """
        topic_lower = topic.lower()
        num = scene.scene_number
        safe_title = scene.title.replace("'", "").replace(":", "-")

        # Color schemes based on domain
        if "neural" in topic_lower or "ai" in topic_lower:
            bg_c = "0x050c1e"
            accent_c = "0x00f2fe"
        elif "heart" in topic_lower or "cardiac" in topic_lower:
            bg_c = "0x1a0508"
            accent_c = "0xef4444"
        elif "search" in topic_lower or "algorithm" in topic_lower:
            bg_c = "0x031826"
            accent_c = "0x38bdf8"
        elif "motor" in topic_lower or "electric" in topic_lower:
            bg_c = "0x1c1304"
            accent_c = "0xf59e0b"
        elif "gravity" in topic_lower:
            bg_c = "0x0c0721"
            accent_c = "0x818cf8"
        else:
            bg_c = "0x070b19"
            accent_c = "0x06b6d4"

        # Generate animated video clip using FFmpeg filters
        filter_complex = (
            f"color=c={bg_c}:s=1080x1920:d={duration}:r=30[bg];"
            # Animated pulse ring
            f"nullsrc=s=1080x1920:d={duration}:r=30,format=rgba,"
            f"geq=r='if(lt(abs(hypot(X-540,Y-960)-mod(t*180,600)), 14), 60, 0)':"
            f"g='if(lt(abs(hypot(X-540,Y-960)-mod(t*180,600)), 14), 220, 0)':"
            f"b='if(lt(abs(hypot(X-540,Y-960)-mod(t*180,600)), 14), 255, 0)':"
            f"a='if(lt(abs(hypot(X-540,Y-960)-mod(t*180,600)), 14), 160, 0)'[ring];"
            # Blend ring onto background
            f"[bg][ring]overlay=0:0[v1];"
            # SkillAtlas Top Badge
            f"[v1]drawtext=text='SKILLATLAS AI STUDIO':fontcolor=white@0.9:fontsize=36:x=(w-text_w)/2:y=180,"
            f"drawtext=text='PART {num} • {safe_title}':fontcolor={accent_c}:fontsize=52:x=(w-text_w)/2:y=260,"
            # Bottom Progress bar
            f"drawbox=y=ih-16:x=0:w='iw*(t/{duration})':h=16:color={accent_c}@0.9:t=fill[v_final]"
        )

        cmd = [
            FFMPEG_BIN, "-y",
            "-filter_complex", filter_complex,
            "-map", "[v_final]",
            "-t", str(duration),
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-pix_fmt", "yuv420p",
            str(output_path)
        ]

        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        except Exception:
            # Fallback simple generator
            simple_filter = (
                f"color=c={bg_c}:s=1080x1920:d={duration}:r=30,"
                f"drawtext=text='{safe_title}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=300"
            )
            simple_cmd = [
                FFMPEG_BIN, "-y",
                "-f", "lavfi",
                "-i", simple_filter,
                "-t", str(duration),
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-pix_fmt", "yuv420p",
                str(output_path)
            ]
            subprocess.run(simple_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
