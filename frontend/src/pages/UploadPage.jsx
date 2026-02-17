import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadZip, uploadGithub } from '../services/api';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const UploadPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('zip');
  const [file, setFile] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleZipUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(30);

    try {
      setTimeout(() => setProgress(60), 500);
      const response = await uploadZip(file);
      setProgress(100);
      setTimeout(() => navigate(`/projects/${response.project_id}`), 500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
      setProgress(0);
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
    setProgress(30);

    try {
      setTimeout(() => setProgress(60), 500);
      const response = await uploadGithub(githubUrl);
      setProgress(100);
      setTimeout(() => navigate(`/projects/${response.project_id}`), 500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to clone repository');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center py-12 sm:py-16 space-y-4 sm:space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Analyzing your project...</h3>
            <p className="text-sm sm:text-base text-gray-600">This may take a few moments</p>
          </div>
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">{progress}% complete</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-20 sm:pb-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">Upload Your Project</h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">Choose your preferred method to analyze your codebase</p>
      </div>

      <Card className="p-4 sm:p-6 lg:p-8">
        <div className="flex border-b mb-6 sm:mb-8 -mx-4 sm:mx-0">
          <button
            onClick={() => setActiveTab('zip')}
            className={`flex-1 px-4 sm:px-6 py-3 font-semibold transition-all relative text-sm sm:text-base ${
              activeTab === 'zip'
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg sm:text-xl">📦</span>
              <span className="hidden sm:inline">Upload ZIP</span>
              <span className="sm:hidden">ZIP</span>
            </span>
            {activeTab === 'zip' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 px-4 sm:px-6 py-3 font-semibold transition-all relative text-sm sm:text-base ${
              activeTab === 'github'
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg sm:text-xl">🔗</span>
              <span className="hidden sm:inline">GitHub Repository</span>
              <span className="sm:hidden">GitHub</span>
            </span>
            {activeTab === 'github' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500" />
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
            <p className="text-red-700 text-xs sm:text-sm font-medium">{error}</p>
          </div>
        )}

        {activeTab === 'zip' ? (
          <form onSubmit={handleZipUpload} className="space-y-4 sm:space-y-6">
            <FileUpload onFileSelect={setFile} />
            <Button type="submit" className="w-full" size="lg" disabled={!file}>
              Generate Documentation
            </Button>
          </form>
        ) : (
          <form onSubmit={handleGithubUpload} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                ℹ️ Enter the full URL of a public GitHub repository
              </p>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={!githubUrl}>
              Analyze Repository
            </Button>
          </form>
        )}
      </Card>

      <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="text-center p-3 sm:p-4">
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⚡</div>
          <p className="text-xs sm:text-sm text-gray-600">Fast Analysis</p>
        </div>
        <div className="text-center p-3 sm:p-4">
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔒</div>
          <p className="text-xs sm:text-sm text-gray-600">Secure Processing</p>
        </div>
        <div className="text-center p-3 sm:p-4">
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🎯</div>
          <p className="text-xs sm:text-sm text-gray-600">Accurate Detection</p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
