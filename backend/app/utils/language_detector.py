import os
from typing import List
from collections import Counter

class LanguageDetector:
    LANGUAGE_EXTENSIONS = {
        'Python': ['.py', '.pyw'],
        'JavaScript': ['.js', '.jsx', '.mjs'],
        'TypeScript': ['.ts', '.tsx'],
        'Java': ['.java'],
        'C++': ['.cpp', '.cc', '.cxx', '.hpp', '.h'],
        'C': ['.c', '.h'],
        'C#': ['.cs'],
        'Go': ['.go'],
        'Rust': ['.rs'],
        'PHP': ['.php'],
        'Ruby': ['.rb'],
        'Swift': ['.swift'],
        'Kotlin': ['.kt', '.kts'],
        'Dart': ['.dart'],
        'HTML': ['.html', '.htm'],
        'CSS': ['.css', '.scss', '.sass'],
        'SQL': ['.sql']
    }
    
    @staticmethod
    def detect_primary_language(files: List[str]) -> str:
        extensions = [os.path.splitext(f)[1].lower() for f in files]
        extension_count = Counter(extensions)
        
        language_count = Counter()
        for lang, exts in LanguageDetector.LANGUAGE_EXTENSIONS.items():
            count = sum(extension_count[ext] for ext in exts)
            if count > 0:
                language_count[lang] = count
        
        if language_count:
            return language_count.most_common(1)[0][0]
        
        return "Unknown"
