from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Project, Storyboard
from app.database import list_projects, get_project, save_project, delete_project

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=List[Project])
async def get_all_projects():
    return list_projects()

@router.get("/{project_id}", response_model=Project)
async def get_single_project(project_id: str):
    p = get_project(project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

@router.put("/{project_id}/storyboard", response_model=Project)
async def update_project_storyboard(project_id: str, storyboard: Storyboard):
    p = get_project(project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    p.storyboard = storyboard
    save_project(p)
    return p

@router.delete("/{project_id}")
async def remove_project(project_id: str):
    success = delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully", "id": project_id}
