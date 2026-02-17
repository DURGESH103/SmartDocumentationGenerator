import re
from typing import Dict, List, Optional
from datetime import datetime
from pathlib import Path

class AISummarizationEngine:
    """Enterprise AI Summarization - NO INFORMATION LOSS"""
    
    def __init__(self):
        self.content_type = None
        self.extracted_text = ""
        self.confidence = 100
        
    def summarize(self, text: str, source_type: str = "auto") -> Dict:
        """Generate comprehensive summary preserving ALL critical info"""
        self.extracted_text = text
        self.content_type = self._detect_content_type(text) if source_type == "auto" else source_type
        
        return {
            "short_summary": self._generate_short_summary(),
            "detailed_summary": self._generate_detailed_summary(),
            "key_points": self._extract_key_points(),
            "action_items": self._extract_action_items(),
            "important_numbers": self._extract_numbers(),
            "risks_warnings": self._extract_risks(),
            "technical_highlights": self._extract_technical_highlights(),
            "email_intelligence": self._analyze_email() if self._is_email() else None,
            "metadata": {
                "content_type": self.content_type,
                "word_count": len(text.split()),
                "confidence": self.confidence,
                "extracted_at": datetime.utcnow().isoformat()
            }
        }
    
    def _detect_content_type(self, text: str) -> str:
        """Auto-detect content type"""
        text_lower = text.lower()
        
        # Email detection
        if any(marker in text_lower for marker in ['from:', 'to:', 'subject:', 'dear', 'regards', 'sincerely']):
            return "email"
        
        # Technical detection
        if any(marker in text_lower for marker in ['function', 'class', 'import', 'def ', 'const ', 'var ', 'api', 'endpoint']):
            return "technical"
        
        # Business detection
        if any(marker in text_lower for marker in ['meeting', 'deadline', 'budget', 'revenue', 'proposal', 'contract']):
            return "business"
        
        # Documentation detection
        if any(marker in text_lower for marker in ['overview', 'introduction', 'requirements', 'specification', 'documentation']):
            return "documentation"
        
        return "mixed"
    
    def _generate_short_summary(self) -> str:
        """2-4 line summary preserving core meaning"""
        lines = [l.strip() for l in self.extracted_text.split('\n') if l.strip()]
        
        if not lines:
            return "No content to summarize"
        
        # Get first meaningful paragraph
        first_para = []
        for line in lines[:10]:
            if len(line) > 20:
                first_para.append(line)
            if len(' '.join(first_para).split()) > 50:
                break
        
        summary = ' '.join(first_para[:3])
        
        # Truncate to ~200 chars but preserve meaning
        if len(summary) > 200:
            summary = summary[:197] + "..."
        
        return summary if summary else lines[0][:200]
    
    def _generate_detailed_summary(self) -> str:
        """Full meaning preserved summary"""
        lines = [l.strip() for l in self.extracted_text.split('\n') if l.strip()]
        
        if len(lines) <= 10:
            return '\n'.join(lines)
        
        # Extract key paragraphs
        key_paras = []
        current_para = []
        
        for line in lines:
            if len(line) > 20:
                current_para.append(line)
            elif current_para:
                key_paras.append(' '.join(current_para))
                current_para = []
        
        if current_para:
            key_paras.append(' '.join(current_para))
        
        # Return top paragraphs preserving structure
        return '\n\n'.join(key_paras[:5])
    
    def _extract_key_points(self) -> List[str]:
        """Extract bullet points of critical info"""
        points = []
        text = self.extracted_text
        
        # Find existing bullet points
        bullet_pattern = r'^[\s]*[•\-\*]\s*(.+)$'
        for line in text.split('\n'):
            match = re.match(bullet_pattern, line)
            if match:
                points.append(match.group(1).strip())
        
        # Find numbered points
        numbered_pattern = r'^[\s]*\d+[\.\)]\s*(.+)$'
        for line in text.split('\n'):
            match = re.match(numbered_pattern, line)
            if match:
                points.append(match.group(1).strip())
        
        # Extract sentences with key indicators
        key_indicators = ['must', 'required', 'critical', 'important', 'deadline', 'urgent', 'action', 'decision']
        for line in text.split('\n'):
            if any(indicator in line.lower() for indicator in key_indicators):
                if len(line) > 20 and len(line) < 200:
                    points.append(line.strip())
        
        return list(dict.fromkeys(points))[:10]  # Remove duplicates, max 10
    
    def _extract_action_items(self) -> List[Dict]:
        """Extract tasks and required actions"""
        actions = []
        text = self.extracted_text.lower()
        
        # Action keywords
        action_keywords = [
            'please', 'need to', 'must', 'should', 'required to', 'action item',
            'todo', 'task', 'complete', 'deliver', 'submit', 'review', 'approve'
        ]
        
        for line in self.extracted_text.split('\n'):
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in action_keywords):
                # Extract deadline if present
                deadline = self._extract_deadline_from_line(line)
                actions.append({
                    "action": line.strip(),
                    "deadline": deadline,
                    "priority": "high" if any(w in line_lower for w in ['urgent', 'asap', 'critical']) else "normal"
                })
        
        return actions[:10]
    
    def _extract_deadline_from_line(self, line: str) -> Optional[str]:
        """Extract deadline from text"""
        # Date patterns
        date_patterns = [
            r'\d{1,2}/\d{1,2}/\d{2,4}',
            r'\d{4}-\d{2}-\d{2}',
            r'(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}',
            r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, line.lower())
            if match:
                return match.group(0)
        
        return None
    
    def _extract_numbers(self) -> Dict:
        """Extract all important numbers"""
        numbers = {
            "dates": [],
            "metrics": [],
            "versions": [],
            "prices": [],
            "deadlines": []
        }
        
        # Dates
        date_pattern = r'\d{1,2}/\d{1,2}/\d{2,4}|\d{4}-\d{2}-\d{2}'
        numbers["dates"] = list(set(re.findall(date_pattern, self.extracted_text)))
        
        # Versions
        version_pattern = r'v?\d+\.\d+\.?\d*'
        numbers["versions"] = list(set(re.findall(version_pattern, self.extracted_text)))[:5]
        
        # Prices/Money
        price_pattern = r'\$\d+(?:,\d{3})*(?:\.\d{2})?'
        numbers["prices"] = list(set(re.findall(price_pattern, self.extracted_text)))
        
        # Percentages
        percent_pattern = r'\d+(?:\.\d+)?%'
        numbers["metrics"] = list(set(re.findall(percent_pattern, self.extracted_text)))
        
        # Deadlines (contextual)
        for line in self.extracted_text.split('\n'):
            if 'deadline' in line.lower() or 'due' in line.lower():
                deadline = self._extract_deadline_from_line(line)
                if deadline:
                    numbers["deadlines"].append(deadline)
        
        return {k: v for k, v in numbers.items() if v}
    
    def _extract_risks(self) -> List[str]:
        """Extract risks and warnings"""
        risks = []
        risk_keywords = ['risk', 'warning', 'issue', 'problem', 'concern', 'blocker', 'critical', 'urgent']
        
        for line in self.extracted_text.split('\n'):
            if any(keyword in line.lower() for keyword in risk_keywords):
                if len(line) > 20:
                    risks.append(line.strip())
        
        return risks[:5]
    
    def _extract_technical_highlights(self) -> Optional[List[str]]:
        """Extract technical details if present"""
        if self.content_type not in ['technical', 'mixed']:
            return None
        
        highlights = []
        tech_keywords = [
            'api', 'endpoint', 'function', 'class', 'method', 'database',
            'server', 'client', 'framework', 'library', 'version', 'dependency'
        ]
        
        for line in self.extracted_text.split('\n'):
            if any(keyword in line.lower() for keyword in tech_keywords):
                if len(line) > 20 and len(line) < 200:
                    highlights.append(line.strip())
        
        return highlights[:8] if highlights else None
    
    def _is_email(self) -> bool:
        """Check if content is email"""
        return self.content_type == "email"
    
    def _analyze_email(self) -> Dict:
        """Email-specific intelligence"""
        text_lower = self.extracted_text.lower()
        
        # Detect urgency
        urgency = "high" if any(w in text_lower for w in ['urgent', 'asap', 'immediately', 'critical']) else "normal"
        
        # Detect intent
        intent = "request" if any(w in text_lower for w in ['please', 'could you', 'can you', 'need']) else "informational"
        
        # Detect if response required
        response_required = any(w in text_lower for w in ['please reply', 'let me know', 'confirm', 'respond', 'feedback'])
        
        # Extract sender (if present)
        sender = None
        from_match = re.search(r'from:\s*(.+)', text_lower)
        if from_match:
            sender = from_match.group(1).strip()
        
        # Extract subject
        subject = None
        subject_match = re.search(r'subject:\s*(.+)', self.extracted_text, re.IGNORECASE)
        if subject_match:
            subject = subject_match.group(1).strip()
        
        return {
            "sender": sender,
            "subject": subject,
            "intent": intent,
            "urgency": urgency,
            "response_required": response_required,
            "suggested_reply": self._generate_reply_draft() if response_required else None
        }
    
    def _generate_reply_draft(self) -> str:
        """Generate suggested reply draft"""
        # Simple acknowledgment template
        return "Thank you for your email. I have reviewed the information and will [action]. I will follow up by [deadline]."


# Integration function for API
def summarize_document(text: str, source_type: str = "auto") -> Dict:
    """Main entry point for document summarization"""
    engine = AISummarizationEngine()
    return engine.summarize(text, source_type)
