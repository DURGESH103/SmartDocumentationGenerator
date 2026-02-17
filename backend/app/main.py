from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.routes import upload, documentation, projects, summarization
from app.auth import routes as auth_routes
from app.db.mongo import mongodb
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

@app.on_event("startup")
async def startup_event():
    await mongodb.connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    await mongodb.close_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(documentation.router, prefix="/api/docs", tags=["documentation"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(summarization.router, prefix="/api/summarize", tags=["summarization"])

@app.get("/")
def root():
    return {"message": "Smart Documentation Generator API", "version": settings.VERSION}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
