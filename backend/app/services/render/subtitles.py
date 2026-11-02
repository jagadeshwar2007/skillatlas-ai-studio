from pathlib import Path
from typing import List, Dict, Any

class SubtitleEngine:
    @classmethod
    def generate_srt(cls, scenes_audio: List[Dict[str, Any]], output_path: Path) -> str:
        """
        Generates standard SRT subtitles with timestamps.
        scenes_audio: list of {"start_time": float, "end_time": float, "text": str}
        """
        srt_lines = []
        for idx, item in enumerate(scenes_audio, start=1):
            start = cls._format_time_srt(item["start_time"])
            end = cls._format_time_srt(item["end_time"])
            text = item["text"].strip()
            
            srt_lines.append(f"{idx}")
            srt_lines.append(f"{start} --> {end}")
            srt_lines.append(f"{text}\n")

        content = "\n".join(srt_lines)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return str(output_path)

    @classmethod
    def generate_ass(cls, scenes_audio: List[Dict[str, Any]], output_path: Path) -> str:
        """
        Generates styled Advanced SubStation Alpha (.ass) subtitles
        Optimized for 1080x1920 (9:16 portrait) with bold centered captions.
        """
        header = """[Script Info]
Title: SkillAtlas Captions
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: SkillAtlas,Arial,58,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3.5,2.0,2,80,80,320,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
        dialogue_lines = []
        for item in scenes_audio:
            start = cls._format_time_ass(item["start_time"])
            end = cls._format_time_ass(item["end_time"])
            text = item["text"].strip()
            # Split long text into max 6 words per line for mobile viewing
            words = text.split()
            chunks = [" ".join(words[i:i+6]) for i in range(0, len(words), 6)]
            formatted_text = "\\N".join(chunks)
            dialogue_lines.append(f"Dialogue: 0,{start},{end},SkillAtlas,,0,0,0,,{formatted_text}")

        full_ass = header + "\n".join(dialogue_lines) + "\n"
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_ass)
        return str(output_path)

    @staticmethod
    def _format_time_srt(seconds: float) -> str:
        hrs = int(seconds // 3600)
        mins = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds - int(seconds)) * 1000)
        return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

    @staticmethod
    def _format_time_ass(seconds: float) -> str:
        hrs = int(seconds // 3600)
        mins = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        centis = int((seconds - int(seconds)) * 100)
        return f"{hrs:01d}:{mins:02d}:{secs:02d}.{centis:02d}"
