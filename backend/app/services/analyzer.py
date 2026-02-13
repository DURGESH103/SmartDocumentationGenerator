import os
from typing import Dict, List, Optional
from collections import Counter
from app.utils.language_detector import LanguageDetector
from app.utils.framework_detector import FrameworkDetector
from app.utils.api_detector import APIDetector

class CodeAnalyzer:
    @staticmethod
    def analyze_project(project_path: str) -> Dict:
        project_name = os.path.basename(project_path)
        
        files = CodeAnalyzer._get_all_files(project_path)
        folder_structure = CodeAnalyzer._generate_folder_structure(project_path)
        
        detected_language = LanguageDetector.detect_primary_language(files)
        tech_stack = CodeAnalyzer._detect_tech_stack(project_path, files)
        framework = FrameworkDetector.detect_framework(project_path, files, detected_language)
        api_endpoints = APIDetector.detect_api_endpoints(project_path, files)
        
        summary = CodeAnalyzer._generate_summary(
            project_name, detected_language, framework, len(files)
        )
        
        return {
            'project_name': project_name,
            'summary': summary,
            'folder_structure': folder_structure,
            'tech_stack': tech_stack,
            'detected_language': detected_language,
            'framework': framework,
            'api_endpoints': api_endpoints
        }
    
    @staticmethod
    def _get_all_files(path: str) -> List[str]:
        files = []
        exclude_dirs = {'.git', 'node_modules', '__pycache__', 'venv', 'env', 'dist', 'build', '.next'}
        
        for root, dirs, filenames in os.walk(path):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for filename in filenames:
                files.append(os.path.join(root, filename))
        
        return files

    @staticmethod
    def _generate_folder_structure(path: str, prefix: str = "", max_depth: int = 3, current_depth: int = 0) -> str:
        if current_depth >= max_depth:
            return ""
        
        structure = []
        exclude_dirs = {'.git', 'node_modules', '__pycache__', 'venv', 'env', 'dist', 'build', '.next'}
        
        try:
            items = sorted(os.listdir(path))
            dirs = [item for item in items if os.path.isdir(os.path.join(path, item)) and item not in exclude_dirs]
            files = [item for item in items if os.path.isfile(os.path.join(path, item))]
            
            for directory in dirs[:10]:
                structure.append(f"{prefix}├── {directory}/")
                sub_structure = CodeAnalyzer._generate_folder_structure(
                    os.path.join(path, directory),
                    prefix + "│   ",
                    max_depth,
                    current_depth + 1
                )
                if sub_structure:
                    structure.append(sub_structure)
            
            for file in files[:15]:
                structure.append(f"{prefix}├── {file}")
        
        except PermissionError:
            pass
        
        return "\n".join(structure)
    
    @staticmethod
    def _detect_tech_stack(project_path: str, files: List[str]) -> Dict[str, str]:
        tech_stack = {}
        
        if any('package.json' in f for f in files):
            tech_stack['package_manager'] = 'npm/yarn'
        if any('requirements.txt' in f or 'Pipfile' in f for f in files):
            tech_stack['package_manager'] = 'pip/pipenv'
        if any('pom.xml' in f or 'build.gradle' in f for f in files):
            tech_stack['package_manager'] = 'maven/gradle'
        
        if any('Dockerfile' in f for f in files):
            tech_stack['containerization'] = 'Docker'
        
        if any('.github' in f for f in files):
            tech_stack['ci_cd'] = 'GitHub Actions'
        
        return tech_stack
    
    @staticmethod
    def _generate_summary(project_name: str, language: str, framework: Optional[str], file_count: int) -> str:
        summary = f"This is a {language} project"
        if framework:
            summary += f" built with {framework}"
        summary += f". The project contains {file_count} files."
        return summary
