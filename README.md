# Smart Auto Documentation Generator

A production-quality full-stack web application that automatically generates comprehensive documentation from codebases.

## Features

- 📦 Upload project ZIP files
- 🔗 Clone and analyze GitHub repositories
- 🔍 Automatic language and framework detection
- 📊 Project structure visualization
- 🚀 API endpoint detection
- 📄 Generate and download README.md files
- 💾 SQLite database for documentation storage
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **SQLite** - Database (easily scalable to PostgreSQL)

### Frontend
- **React 18** - UI library with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
SmartDoc/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── database.py
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── upload.py
│   │   │   └── documentation.py
│   │   ├── services/
│   │   │   ├── analyzer.py
│   │   │   ├── doc_generator.py
│   │   │   ├── file_handler.py
│   │   │   └── github_service.py
│   │   ├── utils/
│   │   │   ├── api_detector.py
│   │   │   ├── framework_detector.py
│   │   │   └── language_detector.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── Loading.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── UploadPage.jsx
    │   │   └── DocumentationPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- Git (for GitHub repository cloning feature)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file (optional, defaults work fine):
```bash
copy .env.example .env
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Access the Application**: Open `http://localhost:3000` in your browser

2. **Upload a Project**:
   - Click "Get Started" or "Upload Project"
   - Choose between ZIP upload or GitHub URL
   - For ZIP: Select your project ZIP file
   - For GitHub: Enter the repository URL (e.g., `https://github.com/username/repo`)

3. **View Documentation**:
   - After processing, you'll be redirected to the documentation page
   - View project summary, tech stack, folder structure, and API endpoints
   - Download the generated README.md file

## API Endpoints

### Upload Endpoints
- `POST /api/upload/zip` - Upload ZIP file
- `POST /api/upload/github` - Clone GitHub repository

### Documentation Endpoints
- `GET /api/docs/{doc_id}` - Get documentation by ID
- `GET /api/docs/` - List all documentations
- `GET /api/docs/{doc_id}/download` - Download README.md

### Health Check
- `GET /` - API info
- `GET /health` - Health check

## Environment Variables

### Backend (.env)
```
PROJECT_NAME=Smart Documentation Generator
VERSION=1.0.0
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
DATABASE_URL=sqlite:///./smartdoc.db
```

## Production Deployment

### Backend
1. Set environment variables for production
2. Use a production ASGI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
3. Consider using PostgreSQL instead of SQLite
4. Set up proper CORS origins

### Frontend
1. Build the production bundle:
```bash
npm run build
```
2. Serve the `dist` folder using a web server (Nginx, Apache, etc.)

## Security Features

- File size validation (50MB limit)
- ZIP file validation
- GitHub URL validation
- Input sanitization
- CORS configuration
- Error handling middleware

## Supported Languages

Python, JavaScript, TypeScript, Java, C++, C, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Dart, HTML, CSS, SQL

## Supported Frameworks

- **Python**: Django, Flask, FastAPI
- **JavaScript/TypeScript**: React, Next.js, Vue.js, Angular, Express.js, Svelte
- **Java**: Spring Boot
- **C#**: .NET
- **PHP**: Laravel

## Future Enhancements

- AI-powered documentation generation using LLM APIs
- Support for more languages and frameworks
- Code quality metrics
- Dependency analysis
- Multi-language support
- User authentication
- Project comparison features

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
