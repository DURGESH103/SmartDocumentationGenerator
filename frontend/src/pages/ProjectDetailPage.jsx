import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, downloadReadme, getProjectDependencies, getProjectHealth, getProjectInsights } from '../services/api';
import HealthScore from '../components/project/HealthScore';
import DependencyCard from '../components/project/DependencyCard';
import InsightCard from '../components/project/InsightCard';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dependencies, setDependencies] = useState(null);
  const [health, setHealth] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loadingExtras, setLoadingExtras] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await getProject(id);
      setProject(data);
      loadExtras(id);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExtras = async (projectId) => {
    setLoadingExtras(true);
    try {
      const [depsData, healthData, insightsData] = await Promise.all([
        getProjectDependencies(projectId),
        getProjectHealth(projectId),
        getProjectInsights(projectId)
      ]);
      setDependencies(depsData);
      setHealth(healthData);
      setInsights(insightsData.insights || []);
    } catch (error) {
      console.error('Failed to load extras:', error);
    } finally {
      setLoadingExtras(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadReadme(project.id, project.project_name);
      setProject({ ...project, readme_download_count: project.readme_download_count + 1 });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
          <button onClick={() => navigate('/projects')} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/projects')} className="text-blue-600 hover:text-blue-700 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.project_name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                {project.primary_language}
              </span>
              <span>{project.file_count} files</span>
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download README
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Downloads</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{project.readme_download_count}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Files</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{project.file_count}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Framework</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{project.framework || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Language</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{project.primary_language}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'dependencies', 'health', 'insights', 'structure', 'apis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{project.summary}</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(project.tech_stack || {}).map(([key, value]) => (
                  <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {key}: {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>
              {loadingExtras ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DependencyCard dependencies={dependencies} />
              )}
            </div>
          )}

          {activeTab === 'health' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Health Score</h3>
              {loadingExtras ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : health ? (
                <div>
                  <div className="flex justify-center mb-8">
                    <HealthScore score={health.score} grade={health.grade} />
                  </div>
                  {health.issues && health.issues.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Issues Found</h4>
                      <div className="space-y-2">
                        {health.issues.map((issue, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <span className="text-yellow-600">⚠️</span>
                            <span className="text-sm text-yellow-800">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Health data not available</p>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Insights</h3>
              {loadingExtras ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <InsightCard insights={insights} />
              )}
            </div>
          )}

          {activeTab === 'structure' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Folder Structure</h3>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                {project.folder_structure}
              </pre>
            </div>
          )}

          {activeTab === 'apis' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
              {project.api_endpoints && project.api_endpoints.length > 0 ? (
                <div className="space-y-2">
                  {project.api_endpoints.map((endpoint, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm text-gray-900">{endpoint}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No API endpoints detected</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
