import os
import shutil
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"
OUTPUTS_DIR = STORAGE_DIR / "outputs"
ASSETS_DIR = STORAGE_DIR / "assets"
AUDIO_DIR = STORAGE_DIR / "audio"
DB_PATH = STORAGE_DIR / "skillatlas.db"

OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# Auto-resolve FFmpeg binary directory into os.environ["PATH"]
WINGET_PACKAGES = Path(os.path.expanduser("~")) / "AppData" / "Local" / "Microsoft" / "WinGet" / "Packages"
if not shutil.which("ffmpeg"):
    candidate_bins = list(WINGET_PACKAGES.glob("**/ffmpeg-*-essentials_build/bin"))
    if candidate_bins and candidate_bins[0].exists():
        ffmpeg_bin_dir = str(candidate_bins[0])
        os.environ["PATH"] = f"{ffmpeg_bin_dir};" + os.environ.get("PATH", "")

FFMPEG_BIN = shutil.which("ffmpeg") or "ffmpeg"
FFPROBE_BIN = shutil.which("ffprobe") or "ffprobe"

class Settings(BaseModel):
    app_name: str = "SkillAtlas AI Studio"
    version: str = "1.0.0"
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    elevenlabs_api_key: str = os.getenv("ELEVENLABS_API_KEY", "")
    meshy_api_key: str = os.getenv("MESHY_API_KEY", "")
    google_veo_api_key: str = os.getenv("GOOGLE_VEO_API_KEY", "")
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    
    # Defaults
    video_width: int = 1080
    video_height: int = 1920
    fps: int = 30
    default_duration: int = 45 # seconds
    default_voice: str = "en-US-ChristopherNeural"

settings = Settings()
