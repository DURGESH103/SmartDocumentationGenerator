import Card from './Card';

const StatsCard = ({ icon, label, value, trend, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <span className="mr-1">↑</span> {trend}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${colors[color]} flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
