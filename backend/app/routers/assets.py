import shutil
import subprocess
from fastapi import APIRouter
from app.config import settings, DB_PATH
from app.services.integrations.tts_synthesizer import TTSSynthesizer
from app.services.integrations.meshy import meshy_adapter

router = APIRouter(prefix="/api/assets", tags=["assets"])

@router.get("/voices")
async def get_voices():
    """Returns available educational voiceover profiles."""
    return TTSSynthesizer.AVAILABLE_VOICES

@router.get("/system-status")
async def get_system_status():
    """Reports environment health, API integrations, and system readiness."""
    ffmpeg_ok = False
    ffmpeg_version = "Unknown"
    try:
        res = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        if res.returncode == 0:
            ffmpeg_ok = True
            ffmpeg_version = res.stdout.split("\n")[0]
    except Exception:
        pass

    # Disk usage
    total, used, free = shutil.disk_usage("/")
    free_gb = round(free / (2**30), 2)

    return {
        "status": "healthy",
        "app": "SkillAtlas AI Studio",
        "version": settings.version,
        "ffmpeg": {
            "available": ffmpeg_ok,
            "version": ffmpeg_version
        },
        "storage": {
            "free_gb": free_gb,
            "db_type": "SQLite (Local Persistent Engine) / Supabase Adapter Ready"
        },
        "api_keys": {
            "gemini": bool(settings.gemini_api_key),
            "elevenlabs": bool(settings.elevenlabs_api_key),
            "meshy": bool(settings.meshy_api_key),
            "google_veo": bool(settings.google_veo_api_key),
            "supabase": bool(settings.supabase_url and settings.supabase_key)
        },
        "active_engines": [
            "Engine A: Programmatic 3D (Three.js + Procedural)",
            "Engine B: AI Video Generation (Veo Adapter + Procedural)",
            "Engine C: AI 3D Asset Generation (Meshy Adapter + Procedural)"
        ]
    }
