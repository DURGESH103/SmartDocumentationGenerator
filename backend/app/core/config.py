from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Documentation Generator"
    VERSION: str = "1.0.0"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024
    DATABASE_URL: str = "sqlite:///./smartdoc.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
