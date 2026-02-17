export default function InsightCard({ insights }) {
  if (!insights || insights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No insights available</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="space-y-3">
      {insights.map((insight, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg border-2 ${getSeverityColor(insight.severity)} transition-all hover:shadow-md`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{insight.icon}</span>
            <div className="flex-1">
              <p className="font-medium">{insight.message}</p>
              <span className="text-xs uppercase font-semibold mt-1 inline-block opacity-70">
                {insight.type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
