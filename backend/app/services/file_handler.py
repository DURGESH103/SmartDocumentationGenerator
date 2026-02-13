import os
import zipfile
import shutil
from fastapi import UploadFile, HTTPException
from app.core.config import settings
import uuid

class FileHandler:
    @staticmethod
    async def handle_zip_upload(file: UploadFile) -> str:
        if file.size and file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        unique_id = str(uuid.uuid4())
        zip_path = os.path.join(settings.UPLOAD_DIR, f"{unique_id}.zip")
        extract_path = os.path.join(settings.UPLOAD_DIR, unique_id)
        
        with open(zip_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)
        except zipfile.BadZipFile:
            raise HTTPException(status_code=400, detail="Invalid ZIP file")
        finally:
            os.remove(zip_path)
        
        return extract_path
    
    @staticmethod
    def cleanup_directory(path: str):
        if os.path.exists(path):
            shutil.rmtree(path)
