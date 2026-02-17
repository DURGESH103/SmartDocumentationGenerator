from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, List
from datetime import datetime

class GitHubRepoRequest(BaseModel):
    repo_url: HttpUrl

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    project_name: str
    primary_language: str
    file_count: int
    created_at: datetime
    readme_download_count: int
    dependencies_json: Optional[Dict]
    analytics_json: Optional[Dict]
    framework: Optional[str]

    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    summary: str
    folder_structure: str
    tech_stack: Dict
    api_endpoints: Optional[List[str]]
    readme_content: str

class DocumentationResponse(BaseModel):
    id: int
    project_name: str
    summary: str
    folder_structure: str
    tech_stack: Dict[str, str]
    detected_language: str
    framework: Optional[str]
    api_endpoints: Optional[List[str]]
    readme_content: str
    created_at: datetime

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    message: str
    doc_id: int
    project_id: str
    project_name: str
