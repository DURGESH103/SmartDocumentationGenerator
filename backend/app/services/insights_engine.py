import os
from pathlib import Path
from typing import List, Dict

class InsightsEngine:
    @staticmethod
    def generate_insights(project_path: str, dependencies: Dict, health_score: Dict) -> List[Dict]:
        insights = []
        path = Path(project_path)
        
        # Framework insights
        if dependencies.get('frontend_framework') and dependencies.get('backend_framework'):
            insights.append({
                "type": "architecture",
                "icon": "🏗️",
                "message": f"Full-stack application detected: {dependencies['frontend_framework']} + {dependencies['backend_framework']}",
                "severity": "info"
            })
        elif dependencies.get('frontend_framework'):
            insights.append({
                "type": "architecture",
                "icon": "⚛️",
                "message": f"Modern frontend framework detected: {dependencies['frontend_framework']}",
                "severity": "info"
            })
        elif dependencies.get('backend_framework'):
            insights.append({
                "type": "architecture",
                "icon": "🔧",
                "message": f"Backend framework detected: {dependencies['backend_framework']}",
                "severity": "info"
            })
        
        # Structure insights
        if InsightsEngine._has_mvc_structure(path):
            insights.append({
                "type": "structure",
                "icon": "📁",
                "message": "This project follows MVC architecture pattern",
                "severity": "success"
            })
        
        # Database insights
        if dependencies.get('database'):
            insights.append({
                "type": "database",
                "icon": "🗄️",
                "message": f"Database integration: {dependencies['database']}",
                "severity": "info"
            })
        
        # Security insights
        security_check = InsightsEngine._check_security(path)
        if security_check['has_env']:
            insights.append({
                "type": "security",
                "icon": "🔒",
                "message": "Environment configuration detected - Good security practice",
                "severity": "success"
            })
        else:
            insights.append({
                "type": "security",
                "icon": "⚠️",
                "message": "No environment config found - Consider adding .env file",
                "severity": "warning"
            })
        
        # Health insights
        if health_score['score'] >= 80:
            insights.append({
                "type": "health",
                "icon": "✅",
                "message": "Excellent project health - Well structured and documented",
                "severity": "success"
            })
        elif health_score['score'] >= 60:
            insights.append({
                "type": "health",
                "icon": "⚡",
                "message": "Good project health - Minor improvements recommended",
                "severity": "info"
            })
        else:
            insights.append({
                "type": "health",
                "icon": "🔴",
                "message": "Project needs attention - Multiple issues detected",
                "severity": "error"
            })
        
        # Documentation insights
        if (path / "README.md").exists():
            insights.append({
                "type": "documentation",
                "icon": "📚",
                "message": "Documentation present - README.md found",
                "severity": "success"
            })
        
        # Testing insights
        if InsightsEngine._has_tests(path):
            insights.append({
                "type": "testing",
                "icon": "🧪",
                "message": "Test files detected - Good testing practices",
                "severity": "success"
            })
        else:
            insights.append({
                "type": "testing",
                "icon": "⚠️",
                "message": "No test files found - Consider adding tests",
                "severity": "warning"
            })
        
        # Package manager insights
        if dependencies.get('package_manager'):
            insights.append({
                "type": "tooling",
                "icon": "📦",
                "message": f"Package manager: {dependencies['package_manager']}",
                "severity": "info"
            })
        
        return insights
    
    @staticmethod
    def _has_mvc_structure(path: Path) -> bool:
        mvc_folders = ["models", "views", "controllers"]
        found = sum(1 for folder in mvc_folders if (path / folder).exists())
        return found >= 2
    
    @staticmethod
    def _check_security(path: Path) -> Dict:
        env_files = [".env", ".env.example", "config.py"]
        has_env = any((path / f).exists() for f in env_files)
        
        gitignore = path / ".gitignore"
        has_gitignore = gitignore.exists()
        
        return {
            "has_env": has_env,
            "has_gitignore": has_gitignore
        }
    
    @staticmethod
    def _has_tests(path: Path) -> bool:
        test_patterns = ["test", "tests", "__tests__", "spec"]
        
        for item in path.rglob("*"):
            if item.is_dir() and any(pattern in item.name.lower() for pattern in test_patterns):
                return True
            if item.is_file() and any(pattern in item.name.lower() for pattern in ["test_", "_test.", ".spec.", ".test."]):
                return True
        
        return False
