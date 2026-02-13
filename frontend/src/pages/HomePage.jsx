import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listDocumentations } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await listDocumentations();
        setRecentDocs(docs);
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Auto Documentation Generator
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Automatically generate comprehensive documentation from your codebase
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">Upload ZIP</h3>
          <p className="text-gray-600">
            Upload your project as a ZIP file and get instant documentation
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">🔗</div>
          <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
          <p className="text-gray-600">
            Paste a GitHub repository URL for automatic analysis
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">Download README</h3>
          <p className="text-gray-600">
            Get a professionally formatted README.md file
          </p>
        </div>
      </div>

      {!loading && recentDocs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Documentation</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/documentation/${doc.id}`)}
                className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
              >
                <h3 className="font-semibold text-lg text-gray-900">{doc.project_name}</h3>
                <p className="text-gray-600 text-sm mt-1">{doc.summary}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
