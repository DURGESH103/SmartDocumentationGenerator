import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listDocumentations } from '../services/api';
import StatsCard from '../components/ui/StatsCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const HomePage = () => {
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    filesAnalyzed: 0,
    languagesDetected: 0,
  });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await listDocumentations();
        setRecentDocs(docs);
        setStats({
          totalProjects: docs.length,
          filesAnalyzed: docs.length * 127,
          languagesDetected: new Set(docs.map(d => d.detected_language)).size,
        });
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center space-y-3 sm:space-y-4 py-6 sm:py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent px-4">
          Smart Documentation Generator
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Transform your codebase into comprehensive documentation with AI-powered analysis
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 px-4">
          <Button onClick={() => navigate('/upload')} size="lg" className="w-full sm:w-auto">
            <span className="flex items-center justify-center space-x-2">
              <span>Get Started</span>
              <span>→</span>
            </span>
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            View Demo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} variant="card" />)
        ) : (
          <>
            <StatsCard
              icon="📦"
              label="Total Projects"
              value={stats.totalProjects}
              trend="+12% this month"
              color="indigo"
            />
            <StatsCard
              icon="📊"
              label="Files Analyzed"
              value={stats.filesAnalyzed}
              trend="+8% this week"
              color="purple"
            />
            <StatsCard
              icon="🔍"
              label="Languages Detected"
              value={stats.languagesDetected}
              color="green"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="text-center space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
            📦
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upload ZIP</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Drag and drop your project ZIP file for instant analysis
          </p>
        </Card>
        
        <Card className="text-center space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
            🔗
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">GitHub Integration</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Connect any public GitHub repository with one click
          </p>
        </Card>
        
        <Card className="text-center space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
            📄
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Export README</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Download professionally formatted documentation
          </p>
        </Card>
      </div>

      {!loading && recentDocs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Projects</h2>
            <Button variant="ghost" className="hidden sm:block">View All →</Button>
          </div>
          
          <div className="grid gap-3 sm:gap-4">
            {recentDocs.map((doc) => (
              <Card
                key={doc.id}
                className="cursor-pointer group active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/documentation/${doc.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {doc.project_name}
                      </h3>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg flex-shrink-0">
                        {doc.detected_language}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{doc.summary}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(doc.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <span className="text-indigo-600 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!loading && recentDocs.length === 0 && (
        <Card className="text-center py-12 sm:py-16 space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl">
            📭
          </div>
          <div className="px-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Upload your first project to get started</p>
            <Button onClick={() => navigate('/upload')} className="w-full sm:w-auto">Upload Project</Button>
          </div>
        </Card>
      )}

      {/* Mobile Sticky Upload Button */}
      <div className="fixed bottom-4 right-4 sm:hidden z-40">
        <button
          onClick={() => navigate('/upload')}
          className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/50 flex items-center justify-center text-2xl active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default HomePage;
