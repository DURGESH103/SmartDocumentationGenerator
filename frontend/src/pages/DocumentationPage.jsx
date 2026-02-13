import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDocumentation, downloadReadme } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import CodeBlock from '../components/ui/CodeBlock';
import Skeleton from '../components/ui/Skeleton';

const DocumentationPage = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const data = await getDocumentation(id);
        setDoc(data);
      } catch (err) {
        setError('Failed to load documentation');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        <Skeleton variant="title" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <Skeleton variant="card" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12 sm:py-16">
        <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Documentation</h3>
        <p className="text-sm sm:text-base text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-fade-in pb-6">
      <Card className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">{doc.project_name}</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">{doc.summary}</p>
          </div>
          <Button onClick={() => downloadReadme(doc.id, doc.project_name)} className="w-full sm:w-auto flex-shrink-0">
            <span className="flex items-center justify-center space-x-2">
              <span>⬇️</span>
              <span>Download README</span>
            </span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">{doc.detected_language}</Badge>
          {doc.framework && <Badge variant="purple">{doc.framework}</Badge>}
          {Object.entries(doc.tech_stack).map(([key, value]) => (
            <Badge key={key} variant="default">{value}</Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
              💻
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Primary Language</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{doc.detected_language}</p>
            </div>
          </div>
        </Card>

        {doc.framework && (
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                ⚙️
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Framework</h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{doc.framework}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {Object.keys(doc.tech_stack).length > 0 && (
        <Card>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
            <span>📦</span>
            <span>Tech Stack</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(doc.tech_stack).map(([key, value]) => (
              <div key={key} className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                  {key.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 break-words">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
          <span>📁</span>
          <span>Project Structure</span>
        </h2>
        <CodeBlock code={doc.folder_structure} />
      </Card>

      {doc.api_endpoints && doc.api_endpoints.length > 0 && (
        <Card>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
            <span>🚀</span>
            <span>API Endpoints</span>
          </h2>
          <div className="space-y-2">
            {doc.api_endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100 font-mono text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors break-all"
              >
                {endpoint}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <span>📝</span>
            <span>Generated README</span>
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigator.clipboard.writeText(doc.readme_content)}
            className="w-full sm:w-auto"
          >
            Copy
          </Button>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto">
          <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 font-mono break-words">
            {doc.readme_content}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default DocumentationPage;
