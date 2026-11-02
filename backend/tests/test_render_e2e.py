import asyncio
import os
from app.models.schemas import CreateVideoRequest, TargetAudience, VideoStyle, AspectRatio
from app.services.ai.researcher import EducationalResearcher
from app.services.ai.storyboard import StoryboardGenerator
from app.models.schemas import Project, RenderJob
from app.database import save_project, save_render_job, get_render_job
from app.services.render.compositor import VideoCompositor

async def main():
    print("Testing End-to-End Video Production Pipeline...")
    topic = "How does binary search work?"
    
    # 1. Research
    print("Step 1: Researching topic...")
    analysis = await EducationalResearcher.research_topic(topic, TargetAudience.GENERAL_CURIOUS)
    print(f"-> Metaphor: {analysis.suggested_visual_metaphor}")
    
    # 2. Storyboard
    print("Step 2: Generating storyboard...")
    storyboard = await StoryboardGenerator.create_storyboard(
        analysis=analysis,
        style=VideoStyle.CYBER_SCIENTIFIC,
        aspect_ratio=AspectRatio.PORTRAIT_9_16
    )
    print(f"-> Created {len(storyboard.scenes)} scenes, total duration: {storyboard.total_duration}s")
    
    # 3. Save Project
    project = Project(
        title=topic,
        topic=topic,
        analysis=analysis,
        storyboard=storyboard,
        status="storyboarded"
    )
    save_project(project)
    
    job = RenderJob(
        project_id=project.id,
        status="queued",
        progress=5,
        current_step="Queued"
    )
    save_render_job(job)
    
    # 4. Render
    print("Step 3: Rendering 1080x1920 30FPS MP4 video via Compositor...")
    final_video = await VideoCompositor.render_project(project.id, job.job_id)
    print(f"SUCCESS! Rendered output video: {final_video}")
    print(f"File exists: {os.path.exists(final_video)}, size: {os.path.getsize(final_video)} bytes")

if __name__ == "__main__":
    asyncio.run(main())
