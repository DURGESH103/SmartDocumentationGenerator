from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.database import Documentation
from app.models.schemas import DocumentationResponse
from typing import List
import tempfile
import os

router = APIRouter()

@router.get("/{doc_id}", response_model=DocumentationResponse)
def get_documentation(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Documentation).filter(Documentation.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documentation not found")
    return doc

@router.get("/", response_model=List[DocumentationResponse])
def list_documentations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    docs = db.query(Documentation).offset(skip).limit(limit).all()
    return docs

@router.get("/{doc_id}/download")
def download_readme(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Documentation).filter(Documentation.id == doc_id).first()
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
