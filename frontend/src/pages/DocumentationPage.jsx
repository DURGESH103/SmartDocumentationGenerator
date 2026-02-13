import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDocumentation, downloadReadme } from '../services/api';
import Loading from '../components/Loading';

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
    return <Loading message="Loading documentation..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {doc.project_name}
            </h1>
            <p className="text-gray-600">{doc.summary}</p>
          </div>
          <button
            onClick={() => downloadReadme(doc.id, doc.project_name)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Download README
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Primary Language</h3>
            <p className="text-gray-700">{doc.detected_language}</p>
          </div>
          {doc.framework && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Framework</h3>
              <p className="text-gray-700">{doc.framework}</p>
            </div>
          )}
        </div>

        {Object.keys(doc.tech_stack).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tech Stack</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(doc.tech_stack).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {key.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Structure</h2>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre">
              {doc.folder_structure}
            </pre>
          </div>
        </div>

        {doc.api_endpoints && doc.api_endpoints.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2">
                {doc.api_endpoints.map((endpoint, index) => (
                  <li key={index} className="font-mono text-sm text-gray-700">
                    {endpoint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated README</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {doc.readme_content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
