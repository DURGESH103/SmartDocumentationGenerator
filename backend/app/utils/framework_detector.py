import os
import json
from typing import List, Optional

class FrameworkDetector:
    @staticmethod
    def detect_framework(project_path: str, files: List[str], language: str) -> Optional[str]:
        if language == "Python":
            return FrameworkDetector._detect_python_framework(project_path, files)
        elif language in ["JavaScript", "TypeScript"]:
            return FrameworkDetector._detect_js_framework(project_path, files)
        elif language == "Java":
            return FrameworkDetector._detect_java_framework(files)
        elif language == "C#":
            return FrameworkDetector._detect_csharp_framework(files)
        elif language == "PHP":
            return FrameworkDetector._detect_php_framework(files)
        
        return None
    
    @staticmethod
    def _detect_python_framework(project_path: str, files: List[str]) -> Optional[str]:
        file_names = [os.path.basename(f).lower() for f in files]
        
        if 'manage.py' in file_names or any('django' in f for f in file_names):
            return "Django"
        
        requirements_file = os.path.join(project_path, 'requirements.txt')
        if os.path.exists(requirements_file):
            with open(requirements_file, 'r') as f:
                content = f.read().lower()
                if 'fastapi' in content:
                    return "FastAPI"
                if 'flask' in content:
                    return "Flask"
                if 'django' in content:
                    return "Django"
        
        return None
    
    @staticmethod
    def _detect_js_framework(project_path: str, files: List[str]) -> Optional[str]:
        package_json = os.path.join(project_path, 'package.json')
        if os.path.exists(package_json):
            try:
                with open(package_json, 'r') as f:
                    data = json.load(f)
                    deps = {**data.get('dependencies', {}), **data.get('devDependencies', {})}
                    
                    if 'next' in deps:
                        return "Next.js"
                    if 'react' in deps:
                        return "React"
                    if 'vue' in deps:
                        return "Vue.js"
                    if 'angular' in deps or '@angular/core' in deps:
                        return "Angular"
                    if 'express' in deps:
                        return "Express.js"
                    if 'svelte' in deps:
                        return "Svelte"
            except:
                pass
        
        return None
    
    @staticmethod
    def _detect_java_framework(files: List[str]) -> Optional[str]:
        file_contents = []
        for f in files[:50]:
            if f.endswith('.java') or f.endswith('.xml'):
                try:
                    with open(f, 'r', encoding='utf-8', errors='ignore') as file:
                        file_contents.append(file.read().lower())
                except:
                    pass
        
        content = ' '.join(file_contents)
        if 'springframework' in content or 'spring boot' in content:
            return "Spring Boot"
        
        return None
    
    @staticmethod
    def _detect_csharp_framework(files: List[str]) -> Optional[str]:
        if any('.csproj' in f for f in files):
            return ".NET"
        return None
    
    @staticmethod
    def _detect_php_framework(files: List[str]) -> Optional[str]:
        if any('artisan' in f for f in files):
            return "Laravel"
        if any('composer.json' in f for f in files):
            return "PHP (Composer)"
        return None
