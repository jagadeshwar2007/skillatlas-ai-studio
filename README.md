# SKILLATLAS AI STUDIO 🎬🚀

> **Learn. Experiment. Build.**  
> Universal AI-Powered Educational Animation & Kinetic Video Production Platform.

SkillAtlas AI Studio is an autonomous video production suite that transforms **ANY** educational topic into an engaging, high-retention 1080×1920 (9:16 portrait) educational video optimized for Instagram Reels, YouTube Shorts, and TikTok.

---

## 🌟 Key Highlights

- **Universal Topic Understanding**: Enter any topic (e.g., *How does ChatGPT work?*, *How does the human heart work?*, *What is quantum computing?*, *How does binary search work?*, *How does an electric motor work?*, *How does gravity work?*). The AI classifies the domain, fact-checks key principles, identifies misconceptions, and formulates visual metaphors.
- **Hybrid AI Animation Engine**:
  - **Engine A: Programmatic 3D**: Three.js WebGL procedural scenes (Neural networks, 4-chamber cardiovascular systems, binary search blocks, electric motor armatures, curved spacetime grids) running smoothly at 60 FPS.
  - **Engine B: AI Video Generation**: Provider-independent adapter for Google Veo and generative video backends.
  - **Engine C: AI 3D Asset Generation**: Provider-independent adapter for Meshy.ai text-to-3D with procedural fallbacks.
- **Neural Voiceover & Audio Engine**: Microsoft Edge-TTS neural speech synthesis (free, multi-accent, crystal-clear clarity) with word-level boundary detection, ElevenLabs adapter, and dynamic multi-track harmonic ambient music mixing with automatic ducking (-14dB).
- **Automated Video Compositor**: FFmpeg 9.0 pipeline producing 1080×1920 portrait @ 30 FPS MP4 videos with burned-in animated subtitles and SkillAtlas branding.
- **Dual-Mode Persistence**: Local SQLite database with zero setup requirements, architected with a Supabase PostgreSQL migration interface.

---

## 🖥️ Studio Dashboard Pages

1. **Dashboard** (`/`): Metrics, quick educational generator, benchmark showcase, and recent projects.
2. **Create Video** (`/create`): Topic prompt, audience selector, 5 visual styles, aspect ratio (9:16 portrait default), neural voice selector, and engine orchestration.
3. **Projects** (`/projects`): Filter and manage videos, inspect storyboards, and download final MP4 exports.
4. **Storyboard Editor** (`/storyboard/[id]`): Multi-scene beat editor, voiceover script tuning, duration sliders, camera trajectory controls, and scene reordering.
5. **3D Animation & Video Studio** (`/studio/[id]`): Interactive 9:16 WebGL Three.js viewport, scene sequencer, and audio sync track.
6. **Asset Library** (`/assets`): Catalog of 3D procedural geometries, shader materials, and audio soundscapes.
7. **Voice Library** (`/voices`): Natural neural narration profiles with tone tags and audio previews.
8. **Rendering Queue** (`/queue`): Real-time render progress bar (0–100%), pipeline step badges, and direct MP4 download links.
9. **Settings** (`/settings`): Diagnostics, FFmpeg 9.0 status, disk space, and API configuration matrix.

---

## 🚀 How to Run the Platform

### Option 1: One-Click Launch (Windows)
Double-click `start_studio.bat` or run:
```powershell
python run.py
```
This automatically boots:
- **FastAPI Backend**: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)
- **Next.js Studio UI**: `http://localhost:3000`

### Option 2: Running Components Individually

**Backend:**
```powershell
$env:PYTHONPATH = "backend"
backend\venv\Scripts\python -m uvicorn app.main:app --port 8000 --reload
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

---

## 🧪 Automated Test Verification

All unit, integration, and benchmark tests are verified and passing:
```powershell
$env:PYTHONPATH = "backend"
backend\venv\Scripts\pytest -o asyncio_mode=auto backend\tests
```

Benchmark tests covering all 5 mandatory topics:
1. `How does an AI neural network work?` (Computer Science → `NeuralNetworkScene`)
2. `How does the human heart work?` (Biology → `HeartAnatomyScene`)
3. `How does binary search work?` (Algorithms → `BinarySearchScene`)
4. `How does an electric motor work?` (Mechanics → `ElectricMotorScene`)
5. `How does gravity work?` (Physics → `GravitySpacetimeScene`)

---

## 📐 Output Video Specification

- **Resolution**: 1080 × 1920 (9:16 Portrait)
- **Framerate**: 30 FPS Constant
- **Format**: MP4 (H.264 / AAC)
- **Duration**: 30–90 seconds (Default 45s, 5 scenes)
- **Captions**: Styled karaoke subtitles (.ass / .srt)
