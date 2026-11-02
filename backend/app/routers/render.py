import asyncio
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from app.models.schemas import RenderJob
from app.database import save_render_job, get_render_job, list_render_jobs, get_project, save_project
from app.services.render.compositor import VideoCompositor

router = APIRouter(prefix="/api/render", tags=["render"])

class StartRenderRequest(BaseModel):
    project_id: str

@router.post("/start", response_model=RenderJob)
async def start_rendering(req: StartRenderRequest, background_tasks: BackgroundTasks):
    """Enqueues and initiates background 1080x1920 MP4 video render pipeline."""
    project = get_project(req.project_id)
    if not project or not project.storyboard:
        raise HTTPException(status_code=404, detail="Project or Storyboard not found.")

    job = RenderJob(
        project_id=req.project_id,
        status="queued",
        progress=5,
        current_step="Queued for processing"
    )
    save_render_job(job)

    # Launch background composition task
    async def run_render_task():
        try:
            await VideoCompositor.render_project(project_id=req.project_id, job_id=job.job_id)
        except Exception as e:
            print(f"Background render failed: {e}")

    background_tasks.add_task(run_render_task)
    return job

@router.get("/status/{job_id}", response_model=RenderJob)
async def get_job_status(job_id: str):
    """Returns real-time render progress and completion status."""
    job = get_render_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Render job not found.")
    return job

@router.get("/queue", response_model=List[RenderJob])
async def list_queue():
    """Lists recent rendering jobs."""
    return list_render_jobs()
