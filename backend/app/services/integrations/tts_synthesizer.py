import os
import asyncio
from pathlib import Path
from typing import Dict, Any, List, Tuple
from app.config import AUDIO_DIR, settings

class TTSSynthesizer:
    AVAILABLE_VOICES = [
        {"id": "en-US-ChristopherNeural", "name": "Christopher (Engaging, Confident)", "gender": "Male", "accent": "American"},
        {"id": "en-US-GuyNeural", "name": "Guy (Docu-Narrator, Deep)", "gender": "Male", "accent": "American"},
        {"id": "en-US-JennyNeural", "name": "Jenny (Clear, Educational)", "gender": "Female", "accent": "American"},
        {"id": "en-GB-RyanNeural", "name": "Ryan (Refined, Technical)", "gender": "Male", "accent": "British"},
        {"id": "en-US-AriaNeural", "name": "Aria (Energetic, Dynamic)", "gender": "Female", "accent": "American"}
    ]

    @classmethod
    async def synthesize(
        cls,
        text: str,
        output_filename: str,
        voice_id: str = "en-US-ChristopherNeural"
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Synthesizes text into high-quality MP3 audio with word timestamps.
        Returns: (file_path, word_timestamps)
        """
        output_path = AUDIO_DIR / output_filename
        timestamps: List[Dict[str, Any]] = []

        # If ElevenLabs API key is present, try ElevenLabs first
        if settings.elevenlabs_api_key:
            try:
                import httpx
                headers = {
                    "xi-api-key": settings.elevenlabs_api_key,
                    "Content-Type": "application/json"
                }
                payload = {
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
                }
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
                        headers=headers,
                        json=payload
                    )
                    if resp.status_code == 200:
                        with open(output_path, "wb") as f:
                            f.write(resp.content)
                        return str(output_path), timestamps
            except Exception as e:
                print(f"ElevenLabs failed, falling back to EdgeTTS: {e}")

        # Edge-TTS Neural Synthesis (Built-in, high quality, free, supports word boundaries)
        try:
            import edge_tts
            communicate = edge_tts.Communicate(text, voice_id)
            submaker = edge_tts.SubMaker()
            
            with open(output_path, "wb") as file:
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        file.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        submaker.create_sub((chunk["offset"], chunk["duration"]), chunk["text"])
                        timestamps.append({
                            "word": chunk["text"],
                            "offset_ms": chunk["offset"] / 10000,
                            "duration_ms": chunk["duration"] / 10000
                        })
            return str(output_path), timestamps
        except Exception as e:
            print(f"EdgeTTS failed: {e}. Generating silent placeholder audio via FFmpeg.")
            # Fallback: create silent audio with FFmpeg
            os.system(f'ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 8 -q:a 9 -acodec libmp3lame "{output_path}"')
            return str(output_path), timestamps
