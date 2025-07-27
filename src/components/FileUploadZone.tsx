import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image, Film, Music, Archive, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  acceptedTypes?: string;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  acceptedTypes = '*',
  maxFileSize = 10,
  maxFiles = 10,
  disabled = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: FileList): string | null => {
    if (files.length > maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxFileSize * 1024 * 1024) {
        return `File "${file.name}" exceeds ${maxFileSize}MB limit`;
      }
    }

    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    setError(null);

    if (disabled) return;

    const files = e.dataTransfer.files;
    const validationError = validateFiles(files);
    
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }

    onFilesSelected(files);
  }, [disabled, maxFiles, maxFileSize, onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const validationError = validateFiles(e.target.files);
      
      if (validationError) {
        setError(validationError);
        setTimeout(() => setError(null), 5000);
        return;
      }

      onFilesSelected(e.target.files);
    }
  }, [maxFiles, maxFileSize, onFilesSelected]);

  const getFileTypeIcon = (acceptedTypes: string) => {
    if (acceptedTypes.includes('image')) return <Image className="w-8 h-8 text-blue-400" />;
    if (acceptedTypes.includes('video')) return <Film className="w-8 h-8 text-purple-400" />;
    if (acceptedTypes.includes('audio')) return <Music className="w-8 h-8 text-green-400" />;
    if (acceptedTypes.includes('pdf') || acceptedTypes.includes('document')) return <FileText className="w-8 h-8 text-red-400" />;
    if (acceptedTypes.includes('zip') || acceptedTypes.includes('archive')) return <Archive className="w-8 h-8 text-yellow-400" />;
    return <Upload className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className="space-y-3">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${dragOver && !disabled
            ? 'border-blue-400 bg-blue-500/10 scale-105' 
            : error
            ? 'border-red-400 bg-red-500/10'
            : disabled
            ? 'border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedTypes}
          multiple={maxFiles > 1}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
            {getFileTypeIcon(acceptedTypes)}
          </div>
          
          <div>
            <p className="text-white font-medium">
              {dragOver ? 'Drop files here' : 'Drop files here or click to browse'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Maximum {maxFiles} files, {maxFileSize}MB each
            </p>
          </div>
          
          {!disabled && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Select Files
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;