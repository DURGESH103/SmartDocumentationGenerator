from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from app.core.database import get_db
from app.models.database import Project
from app.models.schemas import ProjectResponse, ProjectDetailResponse
from app.auth.routes import get_current_user
from typing import List, Optional
import os
import shutil

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
def get_projects(
    skip: int = 0,
    limit: int = 20,
    language: Optional[str] = None,
    sort_by: str = Query("newest", regex="^(newest|oldest)$"),
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    query = db.query(Project).filter(Project.workspace_id == workspace_id)
    
    if language:
        query = query.filter(Project.primary_language == language)
    
    if search:
        query = query.filter(Project.project_name.contains(search))
    
    if sort_by == "newest":
        query = query.order_by(desc(Project.created_at))
    else:
        query = query.order_by(asc(Project.created_at))
    
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.get("/user/me", response_model=List[ProjectResponse])
def get_user_projects(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    projects = db.query(Project).filter(Project.workspace_id == workspace_id).order_by(desc(Project.created_at)).all()
    return projects

@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete related files if they exist
    from app.core.config import settings
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    if os.path.exists(project_path):
        try:
            shutil.rmtree(project_path)
        except Exception as e:
            print(f"Error deleting files: {e}")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/download")
def increment_download(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.readme_download_count += 1
    db.commit()
    return {"download_count": project.readme_download_count}

@router.get("/{project_id}/dependencies")
def get_project_dependencies(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.dependencies_json:
        return project.dependencies_json
    
    return {
        "frontend_framework": None,
        "backend_framework": None,
        "database": None,
        "package_manager": None,
        "libraries": [],
        "framework_detected": False,
        "frameworks": []
    }

@router.get("/{project_id}/health")
def get_project_health(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    from app.core.config import settings
    from app.services.health_score import HealthScoreCalculator
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    
    if os.path.exists(project_path):
        health = HealthScoreCalculator.calculate_health(project_path)
        return health
    
    return {
        "score": 50,
        "grade": "D",
        "issues": ["Project files not accessible"]
    }

@router.get("/{project_id}/insights")
def get_project_insights(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    dependencies = project.dependencies_json or {}
    
    from app.core.config import settings
    from app.services.health_score import HealthScoreCalculator
    from app.services.insights_engine import InsightsEngine
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    
    if os.path.exists(project_path):
        health = HealthScoreCalculator.calculate_health(project_path)
        insights = InsightsEngine.generate_insights(project_path, dependencies, health)
        return {"insights": insights}
    
    return {
        "insights": [
            {
                "type": "info",
                "icon": "ℹ️",
                "message": "Project analysis available after upload",
                "severity": "info"
            }
        ]
    }
