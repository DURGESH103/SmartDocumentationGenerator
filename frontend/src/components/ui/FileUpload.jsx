import { useState } from 'react';

const FileUpload = ({ onFileSelect, accept = '.zip' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      onFileSelect(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center transition-all duration-300 ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50/50 scale-105'
          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="space-y-3 sm:space-y-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        {file ? (
          <div className="space-y-1 sm:space-y-2">
            <p className="text-sm font-medium text-gray-900 break-all px-2">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-base sm:text-lg font-semibold text-gray-900">Drop your ZIP file here</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">or tap to browse</p>
            </div>
            <p className="text-xs text-gray-400">Maximum file size: 50MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
