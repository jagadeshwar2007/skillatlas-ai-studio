from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.config import settings, STORAGE_DIR, OUTPUTS_DIR, ASSETS_DIR, AUDIO_DIR
from app.database import init_db
from app.routers import generation, projects, render, assets

init_db()

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Universal AI Educational Animation and Video Production Platform"
)

# Enable CORS for Next.js Studio Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated static assets and videos
app.mount("/api/storage/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="outputs")
app.mount("/api/storage/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")
app.mount("/api/storage/audio", StaticFiles(directory=str(AUDIO_DIR)), name="audio")

# Include Routers
app.include_router(generation.router)
app.include_router(projects.router)
app.include_router(render.router)
app.include_router(assets.router)

@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "tagline": "Learn. Experiment. Build.",
        "status": "online",
        "version": settings.version,
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": settings.app_name}
