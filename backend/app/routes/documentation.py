from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.database import Documentation
from app.models.schemas import DocumentationResponse
from app.auth.routes import get_current_user
from typing import List
import tempfile
import os

router = APIRouter()

@router.get("/{doc_id}", response_model=DocumentationResponse)
def get_documentation(
    doc_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    doc = db.query(Documentation).filter(
        Documentation.id == doc_id,
        Documentation.workspace_id == workspace_id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documentation not found")
    return doc

@router.get("/", response_model=List[DocumentationResponse])
def list_documentations(
    skip: int = 0,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    docs = db.query(Documentation).filter(
        Documentation.workspace_id == workspace_id
    ).offset(skip).limit(limit).all()
    return docs

@router.get("/{doc_id}/download")
def download_readme(
    doc_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]
    doc = db.query(Documentation).filter(
        Documentation.id == doc_id,
        Documentation.workspace_id == workspace_id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documentation not found")
    
    temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.md')
    temp_file.write(doc.readme_content)
    temp_file.close()
    
    return FileResponse(
        temp_file.name,
        media_type='text/markdown',
        filename=f"{doc.project_name}_README.md"
    )
