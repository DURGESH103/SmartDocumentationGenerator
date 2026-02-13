import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadZip, uploadGithub } from '../services/api';
import Loading from '../components/Loading';

const UploadPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('zip');
  const [file, setFile] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.name.endsWith('.zip')) {
      setError('Please select a ZIP file');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleZipUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await uploadZip(file);
      navigate(`/documentation/${response.doc_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubUpload = async (e) => {
    e.preventDefault();
    if (!githubUrl) {
      setError('Please enter a GitHub URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await uploadGithub(githubUrl);
      navigate(`/documentation/${response.doc_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to clone repository');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Analyzing your project..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Your Project</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('zip')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'zip'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload ZIP
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'github'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            GitHub Repository
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'zip' ? (
          <form onSubmit={handleZipUpload}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Select ZIP File
              </label>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Generate Documentation
            </button>
          </form>
        ) : (
          <form onSubmit={handleGithubUpload}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter the full URL of a public GitHub repository
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Generate Documentation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
