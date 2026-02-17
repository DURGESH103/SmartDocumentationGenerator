from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from app.core.database import get_db
from app.models.database import Project
from app.models.schemas import ProjectResponse, ProjectDetailResponse
from app.services.dependency_detector import DependencyDetector
from app.services.health_score import HealthScoreCalculator
from app.services.insights_engine import InsightsEngine
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
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    
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
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(Project.user_id == user_id).order_by(desc(Project.created_at)).all()
    return projects

@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
def delete_project(project_id: str, user_id: str = "default_user", db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Security: Verify project ownership
    if project.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    
    # Delete related files if they exist
    from app.core.config import settings
    import shutil
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    if os.path.exists(project_path):
        try:
            shutil.rmtree(project_path)
        except Exception as e:
            # Log error but continue with database deletion
            print(f"Error deleting files: {e}")
    
    # Delete from database
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/download")
def increment_download(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.readme_download_count += 1
    db.commit()
    return {"download_count": project.readme_download_count}

@router.get("/{project_id}/dependencies")
def get_project_dependencies(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Return cached dependencies if available
    if project.dependencies_json:
        return project.dependencies_json
    
    # Otherwise return empty structure
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
def get_project_health(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Try to find project path in uploads
    from app.core.config import settings
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    
    if os.path.exists(project_path):
        health = HealthScoreCalculator.calculate_health(project_path)
        return health
    
    # Return default health if path not found
    return {
        "score": 50,
        "grade": "D",
        "issues": ["Project files not accessible"]
    }

@router.get("/{project_id}/insights")
def get_project_insights(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get dependencies and health
    dependencies = project.dependencies_json or {}
    
    # Try to find project path
    from app.core.config import settings
    project_path = os.path.join(settings.UPLOAD_DIR, project_id)
    
    if os.path.exists(project_path):
        health = HealthScoreCalculator.calculate_health(project_path)
        insights = InsightsEngine.generate_insights(project_path, dependencies, health)
        return {"insights": insights}
    
    # Return basic insights if path not found
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
