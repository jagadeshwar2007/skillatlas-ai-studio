# SKILLATLAS AI STUDIO — API CONFIGURATION & ADAPTERS

## Provider Matrix

| Service | Provider Option | Environment Variable | Current Status | Fallback Mode |
|---------|-----------------|----------------------|----------------|---------------|
| LLM / Intelligence | Google Gemini (2.5 / 1.5) | `GEMINI_API_KEY` | **DETECTED / ACTIVE** | Direct Gemini API calls |
| Alternative LLM | OpenAI / Anthropic | `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | Unconfigured | Gemini or Deterministic Smart Educational Engine |
| Database | Supabase (PostgreSQL) | `SUPABASE_URL`, `SUPABASE_KEY` | Unconfigured | Embedded SQLite / JSON Database Engine |
| Cloud Storage | Supabase Storage | `SUPABASE_URL`, `SUPABASE_STORAGE_BUCKET` | Unconfigured | Local Static Storage with CDN-ready asset URLs |
| AI Video Generation | Google Veo / Luma | `GOOGLE_VEO_API_KEY` / `LUMA_API_KEY` | Unconfigured | High-Resolution Procedural Motion & Atmospheric Generator |
| 3D Asset Generation | Meshy / Tripo | `MESHY_API_KEY` | Unconfigured | Procedural Three.js Geometries & GLTF Synthesizer |
| Voiceover / TTS | ElevenLabs | `ELEVENLABS_API_KEY` | Unconfigured | Edge-TTS / Web Speech API & High-Quality Audio Synthesizer |

## Security & Credential Protection
- All API keys are accessed solely via standard environment variables or `.env.local`.
- Zero credentials are hardcoded or printed in logs.
- When an API key is missing, the application automatically activates high-fidelity simulated/procedural adapters so development, preview, and export continue smoothly without blocking execution.
