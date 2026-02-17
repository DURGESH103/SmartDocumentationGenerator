import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SummarizePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Only PDF, DOCX, and TXT files are supported');
        return;
      }
      setFile(selectedFile);
      setError('');
      setSummary(null);
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/summarize/summarize', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Summarization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Document Summarization
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Upload PDF, DOCX, or TXT files for AI-powered summarization
        </p>
      </div>

      {/* Upload Section */}
      <div className="glass rounded-2xl p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Select Document
        </label>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSummarize}
          disabled={!file || loading}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Generate Summary'}
        </button>
      </div>

      {/* Summary Results */}
      {summary && (
        <div className="space-y-4">
          {/* Short Summary */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">📝 Short Summary</h2>
            <p className="text-gray-700">{summary.short_summary}</p>
          </div>

          {/* Detailed Summary */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">📄 Detailed Summary</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{summary.detailed_summary}</p>
          </div>

          {/* Key Points */}
          {summary.key_points && summary.key_points.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">🔑 Key Points</h2>
              <ul className="space-y-2">
                {summary.key_points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {summary.action_items && summary.action_items.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">✅ Action Items</h2>
              <div className="space-y-3">
                {summary.action_items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-gray-800">{item.action}</p>
                    {item.deadline && (
                      <p className="text-sm text-indigo-600 mt-1">Deadline: {item.deadline}</p>
                    )}
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.priority} priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Numbers */}
          {summary.important_numbers && Object.keys(summary.important_numbers).length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">🔢 Important Numbers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(summary.important_numbers).map(([key, values]) => (
                  values.length > 0 && (
                    <div key={key}>
                      <h3 className="text-sm font-medium text-gray-600 mb-2 capitalize">{key}</h3>
                      <div className="space-y-1">
                        {values.map((val, idx) => (
                          <p key={idx} className="text-sm text-gray-800">{val}</p>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Risks/Warnings */}
          {summary.risks_warnings && summary.risks_warnings.length > 0 && (
            <div className="glass rounded-2xl p-6 border-l-4 border-red-500">
              <h2 className="text-lg font-semibold text-red-900 mb-3">⚠️ Risks & Warnings</h2>
              <ul className="space-y-2">
                {summary.risks_warnings.map((risk, idx) => (
                  <li key={idx} className="text-red-700">{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Highlights */}
          {summary.technical_highlights && summary.technical_highlights.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">💻 Technical Highlights</h2>
              <ul className="space-y-2">
                {summary.technical_highlights.map((highlight, idx) => (
                  <li key={idx} className="text-gray-700 font-mono text-sm">{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Email Intelligence */}
          {summary.email_intelligence && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">📧 Email Intelligence</h2>
              <div className="space-y-3">
                {summary.email_intelligence.subject && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Subject:</span>
                    <p className="text-gray-800">{summary.email_intelligence.subject}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Intent:</span>
                    <p className="text-gray-800 capitalize">{summary.email_intelligence.intent}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Urgency:</span>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      summary.email_intelligence.urgency === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {summary.email_intelligence.urgency}
                    </span>
                  </div>
                </div>
                {summary.email_intelligence.response_required && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Response Required</p>
                    {summary.email_intelligence.suggested_reply && (
                      <p className="text-sm text-blue-700">{summary.email_intelligence.suggested_reply}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Content Type: <span className="font-medium capitalize">{summary.metadata.content_type}</span></span>
              <span>Words: <span className="font-medium">{summary.metadata.word_count}</span></span>
              <span>Confidence: <span className="font-medium">{summary.metadata.confidence}%</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
