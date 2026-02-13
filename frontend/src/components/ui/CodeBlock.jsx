const CodeBlock = ({ code, language = 'text' }) => {
  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1.5 sm:px-3 rounded-lg transition-colors min-h-[44px] sm:min-h-0"
        >
          Copy
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 sm:p-6 rounded-xl overflow-x-auto border border-gray-800 text-xs sm:text-sm">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
