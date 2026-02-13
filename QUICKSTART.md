# Quick Start Guide

## Run Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on: http://localhost:8000

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

## Test the Application

1. Open http://localhost:3000
2. Click "Get Started"
3. Upload a ZIP file or enter a GitHub URL
4. View generated documentation
5. Download README.md

## API Documentation

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI)
