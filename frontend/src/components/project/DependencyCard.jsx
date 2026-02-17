export default function DependencyCard({ dependencies }) {
  if (!dependencies) return null;

  const { frontend_framework, backend_framework, database, package_manager, libraries } = dependencies;

  return (
    <div className="space-y-6">
      {/* Framework Badges */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Frameworks</h3>
        <div className="flex flex-wrap gap-2">
          {frontend_framework && (
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium flex items-center gap-2">
              <span>⚛️</span>
              {frontend_framework}
            </span>
          )}
          {backend_framework && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2">
              <span>🔧</span>
              {backend_framework}
            </span>
          )}
          {!frontend_framework && !backend_framework && (
            <span className="text-sm text-gray-500">No frameworks detected</span>
          )}
        </div>
      </div>

      {/* Database Badge */}
      {database && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Database</h3>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium inline-flex items-center gap-2">
            <span>🗄️</span>
            {database}
          </span>
        </div>
      )}

      {/* Package Manager */}
      {package_manager && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Package Manager</h3>
          <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-medium inline-flex items-center gap-2">
            <span>📦</span>
            {package_manager}
          </span>
        </div>
      )}

      {/* Libraries */}
      {libraries && libraries.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Libraries ({libraries.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {libraries.slice(0, 20).map((lib, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {lib}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
