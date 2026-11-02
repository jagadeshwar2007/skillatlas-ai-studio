# SKILLATLAS AI STUDIO — ARCHITECTURE SPECIFICATION

## Overview
SkillAtlas AI Studio is an autonomous universal AI-powered educational animation and video production platform that transforms any educational topic into a high-retention, visually captivating 1080x1920 (9:16 portrait) educational video optimized for modern platforms.

## Core Pillars

### 1. Universal Topic Understanding & Visual Metaphor Engine
The platform accepts ANY educational topic (e.g., Quantum Computing, Human Heart, Neural Networks, Binary Search, Jet Engines, Gravity).
- **Topic Classifier**: Identifies domain (Biological, Algorithmic, Mechanical, Astrological, Chemical, Abstract).
- **Fact Verifier & Research Pipeline**: Extracts factual milestones, core definitions, and misconceptions.
- **Visual Metaphor Selection**: Maps abstract concepts to concrete physical systems (e.g., water pipe flow for electrical voltage/current; library indexing for binary search; planetary orbits for gravity).

### 2. Hybrid Animation Engine
- **Engine A: Programmatic 3D (Three.js + Procedural Generators)**:
  - Interactive WebGL/Three.js procedural scene engines with dynamic lighting, camera trajectories, physics/particle fields, and annotations.
  - Dedicated procedural scene builders for:
    - *Neural Networks / Deep Learning*: Layers, node activations, signal propagation, weight gradients.
    - *Human Heart / Biology*: 4-chamber pulsating heart, venous/arterial oxygenated blood flow particle systems, valvular actuation.
    - *Binary Search / Computer Science*: Dynamic sorted array blocks, pointer movements (low, mid, high), elimination highlights.
    - *Electric Motor / Mechanics*: Stator electromagnets, magnetic field flux lines, rotating rotor/armature, commutator brush sparks.
    - *Gravity & Orbital Mechanics / Physics*: Gravitational spacetime curvature grid, central mass, orbiting satellite with velocity vectors.
- **Engine B: AI Video Generation (Veo Adapter + Fallback Generators)**:
  - Integration interface for Google Veo and generative video APIs.
  - Generates cinematic atmospheric establishing shots, backgrounds, and motion textures.
- **Engine C: AI 3D Asset Generation (Meshy Adapter + Procedural Fallback)**:
  - Interface for text-to-3D / image-to-3D GLTF asset pipelines.

### 3. Audio & Voiceover Engine
- Script timing synchronization based on word-per-minute voice cadence.
- ElevenLabs neural TTS adapter + EdgeTTS / Web Speech synthesizer + Mock audio generator.
- Dynamic subtitle generator (SRT/VTT + stylized karaoke captions).
- Multi-track audio mixer (Voiceover + ducked ambient educational soundtrack + SFX cue points).

### 4. Compositor & Export Pipeline
- Headless Three.js canvas frame capture + Remotion integration + FFmpeg rendering engine.
- High-efficiency 1080x1920 30FPS MP4 composition with burned-in animated subtitles and synchronized audio.

### 5. Dual-Mode Storage Architecture
- **Cloud Mode**: Supabase Postgres Database + Supabase S3-compatible Storage.
- **Local/Autonomous Mode**: SQLite / JSON state persistence with identical repository interfaces, ensuring zero-interruption execution when offline or unconfigured.

## System Topology

```
+--------------------------------------------------------------------------+
|                        SKILLATLAS AI STUDIO FRONTEND                     |
|                 (Next.js 15+ / React 19 / Tailwind / Framer Motion)       |
|  - Dashboard         - Topic Creator           - Storyboard Editor       |
|  - 3D Preview Engine - Timeline Video Editor   - Asset & Voice Library   |
|  - Render Queue      - Provider Settings       - Video Player & Export   |
+-----------------------------------+--------------------------------------+
                                    | REST / WebSocket APIs
+-----------------------------------v--------------------------------------+
|                         FASTAPI PYTHON BACKEND                           |
|  - AI Orchestration (Gemini 2.5 / LLM / Topic Classifier / Metaphors)   |
|  - Scene Specification Generator (Structured JSON Schema)                |
|  - Asset & Video Generation Adapters (Veo, Meshy, ElevenLabs, Procedural)|
|  - Audio Synthesizer & Subtitle Timing Engine                            |
|  - FFmpeg Compositor & Export Engine (1080x1920 @ 30 FPS MP4)            |
|  - Storage & Project Database (Supabase + Local SQLite fallback)         |
+--------------------------------------------------------------------------+
```
