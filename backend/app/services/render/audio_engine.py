import subprocess
from pathlib import Path
from typing import List, Dict, Any
from app.config import AUDIO_DIR, FFMPEG_BIN

class AudioEngine:
    @classmethod
    def generate_ambient_music(cls, duration: float, output_path: Path) -> str:
        """
        Synthesizes an atmospheric electronic educational ambient music track
        using FFmpeg pure sine synthesis with harmonic chords and subtle low-pass warmth.
        100% royalty-free, zero external audio dependency required.
        """
        synth_filter = (
            f"aevalsrc=sin(2*PI*130.81*t)*0.15 + sin(2*PI*155.56*t)*0.12 + "
            f"sin(2*PI*196.00*t)*0.10 + sin(2*PI*261.63*t)*0.08:d={duration}:s=44100,"
            f"lowpass=f=400,volume=0.35,afade=t=in:ss=0:d=2,afade=t=out:st={max(0, duration-3)}:d=3"
        )
        cmd = [
            FFMPEG_BIN, "-y",
            "-f", "lavfi",
            "-i", synth_filter,
            "-acodec", "libmp3lame",
            "-ar", "44100",
            "-ac", "2",
            "-t", str(duration),
            str(output_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return str(output_path)

    @classmethod
    def mix_master_audio(
        cls,
        narration_clips: List[Dict[str, Any]],
        total_duration: float,
        output_path: Path
    ) -> str:
        """
        Concatenates narration clips and mixes with ducked ambient music.
        """
        music_path = AUDIO_DIR / "temp_music.mp3"
        cls.generate_ambient_music(total_duration, music_path)

        if not narration_clips:
            subprocess.run([FFMPEG_BIN, "-y", "-i", str(music_path), "-c", "copy", str(output_path)], check=True)
            return str(output_path)

        cmd = [FFMPEG_BIN, "-y", "-i", str(music_path)]
        for clip in narration_clips:
            cmd.extend(["-i", clip["audio_path"]])

        filter_parts = []
        mix_inputs = []

        for idx, clip in enumerate(narration_clips, start=1):
            delay_ms = int(clip["start_time"] * 1000)
            filter_parts.append(f"[{idx}:a]adelay={delay_ms}|{delay_ms},volume=1.3[v{idx}]")
            mix_inputs.append(f"[v{idx}]")

        if len(mix_inputs) > 1:
            all_voice_filter = "".join(mix_inputs) + f"amix=inputs={len(mix_inputs)}:normalize=0[all_voices]"
            filter_parts.append(all_voice_filter)
            voice_label = "[all_voices]"
        else:
            voice_label = "[v1]"

        filter_parts.append(f"[0:a]volume=0.22[bg]")
        filter_parts.append(f"[bg]{voice_label}amix=inputs=2:duration=first:dropout_transition=2[out_audio]")

        full_filter = ";".join(filter_parts)
        cmd.extend([
            "-filter_complex", full_filter,
            "-map", "[out_audio]",
            "-acodec", "libmp3lame",
            "-ar", "44100",
            "-ac", "2",
            "-t", str(total_duration),
            str(output_path)
        ])

        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        except Exception:
            simple_cmd = [
                FFMPEG_BIN, "-y",
                "-i", narration_clips[0]["audio_path"],
                "-acodec", "libmp3lame",
                str(output_path)
            ]
            subprocess.run(simple_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        return str(output_path)
