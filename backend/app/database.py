import sqlite3
import json
from typing import List, Optional, Dict, Any
from pathlib import Path
from app.config import DB_PATH
from app.models.schemas import Project, RenderJob

def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        topic TEXT NOT NULL,
        data JSON NOT NULL,
        status TEXT NOT NULL,
        created_at REAL NOT NULL,
        updated_at REAL NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS render_jobs (
        job_id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER NOT NULL,
        current_step TEXT NOT NULL,
        data JSON NOT NULL,
        created_at REAL NOT NULL,
        completed_at REAL
    )
    """)
    conn.commit()
    conn.close()

def save_project(project: Project) -> Project:
    conn = get_connection()
    cursor = conn.cursor()
    project.updated_at = project.created_at
    data_json = json.dumps(project.model_dump())
    cursor.execute("""
    INSERT INTO projects (id, title, topic, data, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        topic = excluded.topic,
        data = excluded.data,
        status = excluded.status,
        updated_at = excluded.updated_at
    """, (project.id, project.title, project.topic, data_json, project.status, project.created_at, project.updated_at))
    conn.commit()
    conn.close()
    return project

def get_project(project_id: str) -> Optional[Project]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM projects WHERE id = ?", (project_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return Project(**json.loads(row["data"]))

def list_projects() -> List[Project]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM projects ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [Project(**json.loads(row["data"])) for row in rows]

def delete_project(project_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def save_render_job(job: RenderJob) -> RenderJob:
    conn = get_connection()
    cursor = conn.cursor()
    data_json = json.dumps(job.model_dump())
    cursor.execute("""
    INSERT INTO render_jobs (job_id, project_id, status, progress, current_step, data, created_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(job_id) DO UPDATE SET
        status = excluded.status,
        progress = excluded.progress,
        current_step = excluded.current_step,
        data = excluded.data,
        completed_at = excluded.completed_at
    """, (job.job_id, job.project_id, job.status, job.progress, job.current_step, data_json, job.created_at, job.completed_at))
    conn.commit()
    conn.close()
    return job

def get_render_job(job_id: str) -> Optional[RenderJob]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM render_jobs WHERE job_id = ?", (job_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return RenderJob(**json.loads(row["data"]))

def list_render_jobs() -> List[RenderJob]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM render_jobs ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [RenderJob(**json.loads(row["data"])) for row in rows]

# Auto initialize database on module import
init_db()
