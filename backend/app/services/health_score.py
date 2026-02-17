import os
from pathlib import Path
from typing import Dict, List

class HealthScoreCalculator:
    @staticmethod
    def calculate_health(project_path: str) -> Dict:
        score = 0
        issues = []
        
        # Check package.json exists (+20)
        if (Path(project_path) / "package.json").exists():
            score += 20
        elif (Path(project_path) / "requirements.txt").exists():
            score += 20
        else:
            issues.append("Missing dependency file")
            score -= 10
        
        # Check dependencies valid (+20)
        if HealthScoreCalculator._has_valid_dependencies(project_path):
            score += 20
        else:
            issues.append("Invalid or missing dependencies")
        
        # Check environment config exists (+20)
        env_files = [".env", ".env.example", "config.py", "config.js"]
        if any((Path(project_path) / f).exists() for f in env_files):
            score += 20
        else:
            issues.append("Missing environment config")
            score -= 10
        
        # Check README exists (+20)
        readme_files = ["README.md", "README.txt", "readme.md"]
        if any((Path(project_path) / f).exists() for f in readme_files):
            score += 20
        else:
            issues.append("Missing README")
            score -= 10
        
        # Check structured folders (+20)
        if HealthScoreCalculator._has_structured_folders(project_path):
            score += 20
        else:
            issues.append("Poor folder structure")
        
        # Check src folder not empty
        src_path = Path(project_path) / "src"
        if src_path.exists() and not any(src_path.iterdir()):
            issues.append("Empty src folder")
            score -= 10
        
        # Ensure score is between 0 and 100
        score = max(0, min(100, score))
        
        # Calculate grade
        grade = HealthScoreCalculator._calculate_grade(score)
        
        return {
            "score": score,
            "grade": grade,
            "issues": issues
        }
    
    @staticmethod
    def _has_valid_dependencies(project_path: str) -> bool:
        package_json = Path(project_path) / "package.json"
        requirements = Path(project_path) / "requirements.txt"
        
        if package_json.exists():
            try:
                import json
                with open(package_json, 'r') as f:
                    data = json.load(f)
                    return bool(data.get('dependencies') or data.get('devDependencies'))
            except:
                return False
        
        if requirements.exists():
            try:
                with open(requirements, 'r') as f:
                    lines = [l.strip() for l in f if l.strip() and not l.startswith('#')]
                    return len(lines) > 0
            except:
                return False
        
        return False
    
    @staticmethod
    def _has_structured_folders(project_path: str) -> bool:
        common_folders = ["src", "app", "components", "services", "routes", "models", "utils"]
        path = Path(project_path)
        
        found_folders = sum(1 for folder in common_folders if (path / folder).exists())
        return found_folders >= 2
    
    @staticmethod
    def _calculate_grade(score: int) -> str:
        if score >= 90:
            return "A+"
        elif score >= 80:
            return "A"
        elif score >= 70:
            return "B"
        elif score >= 60:
            return "C"
        elif score >= 50:
            return "D"
        else:
            return "F"
