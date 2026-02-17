from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schemas import GitHubRepoRequest, UploadResponse
from app.services.file_handler import FileHandler
from app.services.github_service import GitHubService
from app.services.analyzer import CodeAnalyzer
from app.services.doc_generator import DocumentationGenerator
from app.services.dependency_detector import DependencyDetector
from app.models.database import Documentation, Project
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

def count_files(path: str) -> int:
    count = 0
    for root, dirs, files in os.walk(path):
        count += len(files)
    return count

@router.post("/zip", response_model=UploadResponse)
async def upload_zip(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only ZIP files are allowed")
    
    try:
        extract_path = await FileHandler.handle_zip_upload(file)
        analysis = CodeAnalyzer.analyze_project(extract_path)
        readme = DocumentationGenerator.generate_readme(analysis)
        dependencies = DependencyDetector.detect_dependencies(extract_path)
        file_count = count_files(extract_path)
        
        # Create Documentation (legacy)
        doc = Documentation(
            project_name=analysis['project_name'],
            summary=analysis['summary'],
            folder_structure=analysis['folder_structure'],
            tech_stack=analysis['tech_stack'],
            detected_language=analysis['detected_language'],
            framework=analysis.get('framework'),
            api_endpoints=analysis.get('api_endpoints'),
            readme_content=readme
        )
        db.add(doc)
        db.flush()
        
        # Create Project
        project = Project(
            user_id="default_user",
            project_name=analysis['project_name'],
            primary_language=analysis['detected_language'],
            file_count=file_count,
            readme_download_count=0,
            dependencies_json=dependencies,
            analytics_json={"file_count": file_count, "language": analysis['detected_language']},
            summary=analysis['summary'],
            folder_structure=analysis['folder_structure'],
            tech_stack=analysis['tech_stack'],
            framework=analysis.get('framework'),
            api_endpoints=analysis.get('api_endpoints'),
            readme_content=readme
        )
        db.add(project)
        db.commit()
        db.refresh(doc)
        db.refresh(project)
        
        return UploadResponse(
            message="Project analyzed successfully",
            doc_id=doc.id,
            project_id=project.id,
            project_name=doc.project_name
        )
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/github", response_model=UploadResponse)
async def upload_github(request: GitHubRepoRequest, db: Session = Depends(get_db)):
    try:
        clone_path = await GitHubService.clone_repository(str(request.repo_url))
        analysis = CodeAnalyzer.analyze_project(clone_path)
        readme = DocumentationGenerator.generate_readme(analysis)
        dependencies = DependencyDetector.detect_dependencies(clone_path)
        file_count = count_files(clone_path)
        
        # Create Documentation (legacy)
        doc = Documentation(
            project_name=analysis['project_name'],
            summary=analysis['summary'],
            folder_structure=analysis['folder_structure'],
            tech_stack=analysis['tech_stack'],
            detected_language=analysis['detected_language'],
            framework=analysis.get('framework'),
            api_endpoints=analysis.get('api_endpoints'),
            readme_content=readme
        )
        db.add(doc)
        db.flush()
        
        # Create Project
        project = Project(
            user_id="default_user",
            project_name=analysis['project_name'],
            primary_language=analysis['detected_language'],
            file_count=file_count,
            readme_download_count=0,
            dependencies_json=dependencies,
            analytics_json={"file_count": file_count, "language": analysis['detected_language']},
            summary=analysis['summary'],
            folder_structure=analysis['folder_structure'],
            tech_stack=analysis['tech_stack'],
            framework=analysis.get('framework'),
            api_endpoints=analysis.get('api_endpoints'),
            readme_content=readme
        )
        db.add(project)
        db.commit()
        db.refresh(doc)
        db.refresh(project)
        
        return UploadResponse(
            message="GitHub repository analyzed successfully",
            doc_id=doc.id,
            project_id=project.id,
            project_name=doc.project_name
        )
    except Exception as e:
        logger.error(f"GitHub upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
