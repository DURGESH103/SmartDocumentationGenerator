import os
import subprocess
from fastapi import HTTPException
from app.core.config import settings
import uuid
import re

class GitHubService:
    @staticmethod
    async def clone_repository(repo_url: str) -> str:
        if not GitHubService._is_valid_github_url(repo_url):
            raise HTTPException(status_code=400, detail="Invalid GitHub URL")
        
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        unique_id = str(uuid.uuid4())
        clone_path = os.path.join(settings.UPLOAD_DIR, unique_id)
        
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", repo_url, clone_path],
                check=True,
                capture_output=True,
                timeout=60
            )
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=400, detail=f"Failed to clone repository: {e.stderr.decode()}")
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=408, detail="Repository clone timeout")
        
        return clone_path
    
    @staticmethod
    def _is_valid_github_url(url: str) -> bool:
        pattern = r'^https?://github\.com/[\w-]+/[\w.-]+/?$'
        return bool(re.match(pattern, url))
