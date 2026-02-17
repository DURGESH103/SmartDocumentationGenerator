import json
import os
from pathlib import Path
from typing import Dict, List

class DependencyDetector:
    @staticmethod
    def detect_dependencies(project_path: str) -> Dict:
        dependencies = {
            "frontend_framework": None,
            "backend_framework": None,
            "database": None,
            "package_manager": None,
            "libraries": [],
            "framework_detected": False,
            "frameworks": []
        }
        
        # Check package.json
        package_json = Path(project_path) / "package.json"
        if package_json.exists():
            deps = DependencyDetector._parse_package_json(package_json)
            dependencies.update(deps)
        
        # Check requirements.txt
        requirements = Path(project_path) / "requirements.txt"
        if requirements.exists():
            deps = DependencyDetector._parse_requirements(requirements)
            dependencies.update(deps)
        
        # Check pyproject.toml
        pyproject = Path(project_path) / "pyproject.toml"
        if pyproject.exists():
            deps = DependencyDetector._parse_pyproject(pyproject)
            dependencies.update(deps)
        
        # Set framework detection flags
        frameworks = []
        if dependencies['frontend_framework']:
            frameworks.append(dependencies['frontend_framework'])
        if dependencies['backend_framework']:
            frameworks.append(dependencies['backend_framework'])
        
        dependencies['framework_detected'] = len(frameworks) > 0
        dependencies['frameworks'] = frameworks
        
        return dependencies
    
    @staticmethod
    def _parse_package_json(file_path: Path) -> Dict:
        result = {"libraries": []}
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                deps = {**data.get('dependencies', {}), **data.get('devDependencies', {})}
                
                # Detect frontend framework
                if 'next' in deps:
                    result['frontend_framework'] = 'Next.js'
                elif 'react' in deps:
                    result['frontend_framework'] = 'React'
                elif 'vue' in deps:
                    result['frontend_framework'] = 'Vue.js'
                elif '@angular/core' in deps:
                    result['frontend_framework'] = 'Angular'
                elif 'svelte' in deps:
                    result['frontend_framework'] = 'Svelte'
                
                # Detect backend framework
                if '@nestjs/core' in deps or 'nest' in deps:
                    result['backend_framework'] = 'NestJS'
                elif 'express' in deps:
                    result['backend_framework'] = 'Express'
                elif 'fastify' in deps:
                    result['backend_framework'] = 'Fastify'
                elif 'koa' in deps:
                    result['backend_framework'] = 'Koa'
                
                # Package manager
                result['package_manager'] = 'npm'
                
                # Detect database
                if 'mongoose' in deps:
                    result['database'] = 'MongoDB'
                elif 'pg' in deps:
                    result['database'] = 'PostgreSQL'
                elif 'mysql' in deps or 'mysql2' in deps:
                    result['database'] = 'MySQL'
                elif 'sqlite3' in deps:
                    result['database'] = 'SQLite'
                
                result['libraries'] = list(deps.keys())[:20]
        except:
            pass
        return result
    
    @staticmethod
    def _parse_requirements(file_path: Path) -> Dict:
        result = {"libraries": []}
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = [line.strip().split('==')[0].split('>=')[0].lower() for line in f if line.strip() and not line.startswith('#')]
                
                # Detect backend framework
                if 'django' in lines:
                    result['backend_framework'] = 'Django'
                elif 'flask' in lines:
                    result['backend_framework'] = 'Flask'
                elif 'fastapi' in lines:
                    result['backend_framework'] = 'FastAPI'
                
                # Package manager
                result['package_manager'] = 'pip'
                
                # Detect database
                if 'psycopg2' in lines or 'psycopg2-binary' in lines:
                    result['database'] = 'PostgreSQL'
                elif 'pymongo' in lines:
                    result['database'] = 'MongoDB'
                elif 'mysql-connector-python' in lines or 'pymysql' in lines:
                    result['database'] = 'MySQL'
                elif 'sqlalchemy' in lines:
                    result['database'] = 'SQL (SQLAlchemy)'
                
                result['libraries'] = lines[:20]
        except:
            pass
        return result
    
    @staticmethod
    def _parse_pyproject(file_path: Path) -> Dict:
        result = {"libraries": []}
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'django' in content.lower():
                    result['backend_framework'] = 'Django'
                elif 'flask' in content.lower():
                    result['backend_framework'] = 'Flask'
                elif 'fastapi' in content.lower():
                    result['backend_framework'] = 'FastAPI'
                result['package_manager'] = 'poetry'
        except:
            pass
        return result
