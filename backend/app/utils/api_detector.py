import os
import re
from typing import List, Optional

class APIDetector:
    @staticmethod
    def detect_api_endpoints(project_path: str, files: List[str]) -> Optional[List[str]]:
        endpoints = []
        
        python_files = [f for f in files if f.endswith('.py')]
        for file_path in python_files[:30]:
            endpoints.extend(APIDetector._extract_python_endpoints(file_path))
        
        js_files = [f for f in files if f.endswith(('.js', '.ts'))]
        for file_path in js_files[:30]:
            endpoints.extend(APIDetector._extract_js_endpoints(file_path))
        
        return list(set(endpoints)) if endpoints else None
    
    @staticmethod
    def _extract_python_endpoints(file_path: str) -> List[str]:
        endpoints = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                flask_routes = re.findall(r'@app\.route\(["\']([^"\']+)["\']', content)
                endpoints.extend([f"Flask: {route}" for route in flask_routes])
                
                fastapi_routes = re.findall(r'@router\.(get|post|put|delete|patch)\(["\']([^"\']+)["\']', content)
                endpoints.extend([f"FastAPI {method.upper()}: {route}" for method, route in fastapi_routes])
                
                fastapi_app_routes = re.findall(r'@app\.(get|post|put|delete|patch)\(["\']([^"\']+)["\']', content)
                endpoints.extend([f"FastAPI {method.upper()}: {route}" for method, route in fastapi_app_routes])
        except:
            pass
        
        return endpoints
    
    @staticmethod
    def _extract_js_endpoints(file_path: str) -> List[str]:
        endpoints = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                express_routes = re.findall(r'app\.(get|post|put|delete|patch)\(["\']([^"\']+)["\']', content)
                endpoints.extend([f"Express {method.upper()}: {route}" for method, route in express_routes])
                
                router_routes = re.findall(r'router\.(get|post|put|delete|patch)\(["\']([^"\']+)["\']', content)
                endpoints.extend([f"Express {method.upper()}: {route}" for method, route in router_routes])
        except:
            pass
        
        return endpoints
