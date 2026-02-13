const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    title: 'h-8 w-3/4',
    text: 'h-4 w-full',
    circle: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full',
  };

  return (
    <div
      className={`${variants[variant]} ${className} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-lg`}
      style={{ backgroundSize: '1000px 100%' }}
    />
  );
};

export default Skeleton;
