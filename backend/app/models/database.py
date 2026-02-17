from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from app.core.database import Base
import uuid

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String, index=True, nullable=False)
    user_id = Column(String, index=True, default="default_user")
    project_name = Column(String, index=True)
    primary_language = Column(String)
    file_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    readme_download_count = Column(Integer, default=0)
    dependencies_json = Column(JSON, nullable=True)
    analytics_json = Column(JSON, nullable=True)
    summary = Column(Text)
    folder_structure = Column(Text)
    tech_stack = Column(JSON)
    framework = Column(String, nullable=True)
    api_endpoints = Column(JSON, nullable=True)
    readme_content = Column(Text)

class Documentation(Base):
    __tablename__ = "documentations"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(String, index=True, nullable=False)
    project_name = Column(String, index=True)
    summary = Column(Text)
    folder_structure = Column(Text)
    tech_stack = Column(JSON)
    detected_language = Column(String)
    framework = Column(String, nullable=True)
    api_endpoints = Column(JSON, nullable=True)
    readme_content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
