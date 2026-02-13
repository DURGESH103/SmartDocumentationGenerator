const Loading = ({ message = "Processing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default Loading;
