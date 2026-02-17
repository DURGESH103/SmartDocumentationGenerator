# Static Code Analyzer Implementation

## ✅ Senior-Level Code Analysis Engine

### Core Principles
✅ **NO HALLUCINATIONS** - Only analyze real extracted data
✅ **NO GUESSING** - If not found, explicitly state "Not Found"
✅ **SCAN ALL FILES** - Comprehensive file scanning
✅ **REAL DATA ONLY** - Extract from actual codebase

## Analysis Pipeline

### Step 1: File Extraction
```python
def _scan_all_files(self):
    # Scans ALL source files
    # Skips: node_modules, venv, .git, dist, build
    # Tracks: file count, LOC, language distribution
```

### Step 2: Detection
- **Languages**: From file extensions
- **Frameworks**: From imports + package files
- **Libraries**: From import statements
- **Build Tools**: From config files
- **Package Managers**: From dependency files

### Step 3: Parsing
- `package.json` → Node.js dependencies
- `requirements.txt` → Python dependencies
- `pom.xml` / `build.gradle` → Java dependencies
- `.env.example` → Environment variables
- Config files → Framework detection

### Step 4: Code Scanning
- **Imports**: Extract all import statements
- **Routes**: Detect API endpoints
- **Security**: Find hardcoded secrets
- **TODOs**: Track technical debt
- **Error Handling**: Check try/catch usage

## Analysis Sections

### 1. Overview
```python
{
    "primary_language": "Python",  # Most common language
    "language_distribution": {
        "Python": "65.2%",
        "JavaScript": "34.8%"
    },
    "total_files": 127,
    "estimated_loc": 15420,
    "framework": "FastAPI",  # Or "Not detected in codebase"
    "architecture": "Full-stack (Frontend + Backend)"
}
```

**Detection Rules:**
- Language % from actual file counts
- Framework from real imports/package.json
- Architecture from folder structure
- LOC from actual line counts

### 2. Dependencies
```python
{
    "runtime": ["fastapi", "sqlalchemy", "pydantic"],
    "dev": ["pytest", "black", "flake8"],
    "total_count": 25,
    "source": "requirements.txt"
}
```

**OR if not found:**
```python
{
    "error": "No dependency file found in project"
}
```

**Rules:**
- Read actual dependency files
- Categorize runtime vs dev
- Never guess dependencies
- State source file

### 3. Health Analysis
```python
{
    "score": 85,
    "grade": "B",
    "issues": [
        "Potential hardcoded secret in config.py"
    ],
    "warnings": [
        "15 TODO/FIXME comments found",
        "3 files exceed 100KB"
    ]
}
```

**Checks:**
- ✅ Hardcoded secrets detection
- ✅ TODO/FIXME count
- ✅ Large file warnings
- ✅ Error handling presence
- ✅ Security risks

**Scoring:**
- Start at 100
- -10 per security issue
- -5 per warning category
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 4. Insights
```python
[
    {
        "type": "critical",
        "category": "Security",
        "message": "3 potential security issues found"
    },
    {
        "type": "warning",
        "category": "Dependencies",
        "message": "High dependency count (52) may increase maintenance burden"
    },
    {
        "type": "info",
        "category": "Scale",
        "message": "Large codebase (150 files) - consider modularization"
    }
]
```

**Insight Types:**
- **critical**: Security issues
- **warning**: Performance/maintenance concerns
- **info**: Architectural observations

**Rules:**
- Only from detected patterns
- No generic advice
- Specific to codebase

### 5. Structure
```python
{
    "root": {
        "folders": ["frontend", "backend"],
        "file_count": 5
    },
    "backend": {
        "folders": ["app", "tests"],
        "file_count": 3
    },
    "backend/app": {
        "folders": ["routes", "models", "services"],
        "file_count": 12
    }
}
```

**Rules:**
- Real folder tree only
- Skip ignored directories
- Show actual file counts

### 6. API Analysis
```python
{
    "total_endpoints": 15,
    "by_method": {
        "GET": [
            {"path": "/api/projects", "file": "projects.py"},
            {"path": "/api/docs/:id", "file": "documentation.py"}
        ],
        "POST": [
            {"path": "/api/upload/zip", "file": "upload.py"}
        ]
    },
    "files_with_routes": 5
}
```

**OR if not found:**
```python
{
    "message": "No API endpoints detected in codebase"
}
```

**Detection:**
- Python: `@app.get()`, `@router.post()`
- JavaScript: `router.get()`, `app.post()`
- Extract method, path, file
- Never guess endpoints

## Confidence Scoring

```python
{
    "score": 90,
    "warnings": None  # Or list of warnings
}
```

**Confidence Calculation:**
- Start at 100%
- -30 if < 5 files scanned
- -10 if no dependency file
- -10 if no routes detected

**Warning Threshold:**
- If confidence < 80% → Add warning:
  "Some results may be incomplete due to limited project data"

## Anti-Hallucination Rules

### Rule 1: No Guessing
```python
# WRONG ❌
framework = "Probably Express.js"

# CORRECT ✅
framework = "Not detected in codebase"
```

### Rule 2: Explicit Not Found
```python
# WRONG ❌
dependencies = ["express", "react"]  # Guessed

# CORRECT ✅
dependencies = {"error": "No dependency file found in project"}
```

### Rule 3: Real Data Only
```python
# WRONG ❌
apis = ["/api/users", "/api/posts"]  # Generic

# CORRECT ✅
apis = []  # If none detected
# OR
apis = [{"path": "/api/projects", "file": "projects.py"}]  # Real
```

### Rule 4: Source Attribution
```python
# CORRECT ✅
{
    "dependencies": [...],
    "source": "requirements.txt"  # Always state source
}
```

## Integration

### Usage in CodeAnalyzer
```python
from app.services.static_analyzer import StaticCodeAnalyzer

static_analyzer = StaticCodeAnalyzer(project_path)
analysis = static_analyzer.analyze()

# Returns complete analysis with:
# - overview
# - dependencies
# - health
# - insights
# - structure
# - apis
# - confidence
```

### Output Format
```python
{
    "project_name": "SmartDoc",
    "summary": "This is a Python project built with FastAPI...",
    "folder_structure": "...",
    "tech_stack": {...},
    "detected_language": "Python",
    "framework": "FastAPI",
    "api_endpoints": {...},
    "dependencies": {...},
    "health": {...},
    "insights": [...],
    "confidence": {...}
}
```

## Quality Standards

### Feels Like:
✅ Senior Developer Manual Code Audit Report
✅ Professional static analysis tool
✅ Accurate, data-driven insights

### Does NOT Feel Like:
❌ AI-generated generic summary
❌ Guesswork or assumptions
❌ Marketing copy

## Example Output

```
OVERVIEW
--------
Primary Language: Python (65.2%)
Framework: FastAPI
Total Files: 127
Estimated LOC: 15,420
Architecture: Full-stack (Frontend + Backend)

DEPENDENCIES
------------
Source: requirements.txt
Runtime: 18 packages
Dev: 7 packages
Total: 25 dependencies

HEALTH REPORT
-------------
Score: 85/100 (Grade: B)
Issues:
  • Potential hardcoded secret in config.py
Warnings:
  • 15 TODO/FIXME comments found
  • 3 files exceed 100KB

KEY INSIGHTS
------------
[CRITICAL] Security: 1 potential security issue found
[WARNING] Dependencies: 25 dependencies detected
[INFO] API: 15 endpoints detected - ensure proper documentation

API MAP
-------
Total Endpoints: 15
GET: 8 endpoints
POST: 5 endpoints
DELETE: 2 endpoints
Files with routes: 5

CONFIDENCE
----------
Analysis Confidence: 90%
```

## Summary

✅ Comprehensive static code analysis
✅ Zero hallucinations
✅ Real data extraction only
✅ Explicit "not found" statements
✅ Confidence scoring
✅ Security analysis
✅ Health scoring
✅ API detection
✅ Dependency analysis
✅ Professional output quality
