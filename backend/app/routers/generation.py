from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    CreateVideoRequest, TopicAnalysis, Storyboard, Project
)
from app.services.ai.researcher import EducationalResearcher
from app.services.ai.storyboard import StoryboardGenerator
from app.database import save_project, get_project

router = APIRouter(prefix="/api/generate", tags=["generation"])

@router.post("/analyze", response_model=TopicAnalysis)
async def analyze_topic(req: CreateVideoRequest):
    """Researches facts, misconceptions, and determines visual metaphor."""
    try:
        analysis = await EducationalResearcher.research_topic(req.topic, req.audience)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/storyboard", response_model=Storyboard)
async def create_storyboard(req: CreateVideoRequest):
    """Generates complete multi-scene storyboard with 3D scene specifications."""
    try:
        analysis = await EducationalResearcher.research_topic(req.topic, req.audience)
        storyboard = await StoryboardGenerator.create_storyboard(
            analysis=analysis,
            style=req.style,
            aspect_ratio=req.aspect_ratio,
            engine_preference=req.engine_preference,
            voice_id=req.voice_id or "en-US-ChristopherNeural"
        )
        return storyboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-video", response_model=Project)
async def create_video_project(req: CreateVideoRequest):
    """End-to-end pipeline: Analysis -> Storyboard -> Saved Project."""
    try:
        analysis = await EducationalResearcher.research_topic(req.topic, req.audience)
        storyboard = await StoryboardGenerator.create_storyboard(
            analysis=analysis,
            style=req.style,
            aspect_ratio=req.aspect_ratio,
            engine_preference=req.engine_preference,
            voice_id=req.voice_id or "en-US-ChristopherNeural"
        )
        project = Project(
            title=f"{req.topic}",
            topic=req.topic,
            analysis=analysis,
            storyboard=storyboard,
            status="storyboarded"
        )
        save_project(project)
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
