from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.summarization_engine import summarize_document
from app.auth.routes import get_current_user
import PyPDF2
import docx
import io

router = APIRouter()

@router.post("/summarize")
async def summarize_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Summarize uploaded document (PDF, DOCX, TXT)"""
    
    try:
        # Extract text based on file type
        content = await file.read()
        
        if file.filename.endswith('.pdf'):
            text = extract_pdf_text(content)
        elif file.filename.endswith('.docx'):
            text = extract_docx_text(content)
        elif file.filename.endswith('.txt'):
            text = content.decode('utf-8', errors='ignore')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT")
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Document contains insufficient text for summarization")
        
        # Generate summary
        summary = summarize_document(text)
        
        return {
            "filename": file.filename,
            "summary": summary,
            "workspace_id": current_user["workspace_id"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")


def extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF"""
    try:
        pdf_file = io.BytesIO(content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF text: {str(e)}")


def extract_docx_text(content: bytes) -> str:
    """Extract text from DOCX"""
    try:
        doc_file = io.BytesIO(content)
        doc = docx.Document(doc_file)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract DOCX text: {str(e)}")
