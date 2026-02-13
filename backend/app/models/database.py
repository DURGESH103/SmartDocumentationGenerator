from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from app.core.database import Base

class Documentation(Base):
    __tablename__ = "documentations"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    summary = Column(Text)
    folder_structure = Column(Text)
    tech_stack = Column(JSON)
    detected_language = Column(String)
    framework = Column(String, nullable=True)
    api_endpoints = Column(JSON, nullable=True)
    readme_content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
