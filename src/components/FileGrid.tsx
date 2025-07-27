import React from 'react';
import { 
  FileText, 
  Image, 
  Film, 
  Music, 
  Archive, 
  File, 
  Trash2, 
  Eye, 
  Download, 
  RefreshCw,
  Check,
  X,
  Clock
} from 'lucide-react';
import { UploadedFile } from '../hooks/useFileUpload';

interface FileGridProps {
  files: UploadedFile[];
  onRemove: (fileId: string) => void;
  onRetry: (fileId: string) => void;
  onPreview?: (file: UploadedFile) => void;
}

const FileGrid: React.FC<FileGridProps> = ({ files, onRemove, onRetry, onPreview }) => {
  const getFileIcon = (file: UploadedFile) => {
    const { type, name } = file;
    
    if (type.startsWith('image/')) return <Image className="w-6 h-6 text-blue-400" />;
    if (type.startsWith('video/')) return <Film className="w-6 h-6 text-purple-400" />;
    if (type.startsWith('audio/')) return <Music className="w-6 h-6 text-green-400" />;
    if (type === 'application/pdf') return <FileText className="w-6 h-6 text-red-400" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive className="w-6 h-6 text-yellow-400" />;
    if (name.endsWith('.md') || name.endsWith('.txt')) return <FileText className="w-6 h-6 text-gray-400" />;
    
    return <File className="w-6 h-6 text-gray-400" />;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'error':
        return <X className="w-4 h-4 text-red-400" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'processing':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'uploading':
        return 'border-blue-500/50 bg-blue-500/10';
      default:
        return 'border-gray-600/50 bg-gray-700/30';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <File className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No files uploaded yet</p>
        <p className="text-gray-500 text-sm mt-1">Upload some files to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${getStatusColor(file.status)}`}
        >
          {/* File Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {getFileIcon(file)}
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-medium text-sm truncate" title={file.name}>
                  {file.name}
                </h4>
                <p className="text-gray-400 text-xs">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              {getStatusIcon(file.status)}
              <div className="flex space-x-1">
                {file.status === 'completed' && onPreview && (
                  <button
                    onClick={() => onPreview(file)}
                    className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors duration-200"
                    title="Preview"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                )}
                
                {file.status === 'completed' && (
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = file.url;
                      a.download = file.name;
                      a.click();
                    }}
                    className="p-1 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors duration-200"
                    title="Download"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                )}
                
                {file.status === 'error' && (
                  <button
                    onClick={() => onRetry(file.id)}
                    className="p-1 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors duration-200"
                    title="Retry"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
                
                <button
                  onClick={() => onRemove(file.id)}
                  className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors duration-200"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {(file.status === 'uploading' || file.status === 'processing') && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>
                  {file.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                </span>
                <span>{file.progress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    file.status === 'uploading' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {file.analysis && file.status === 'completed' && (
            <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs text-gray-300">
              <p className="font-medium text-blue-400 mb-1">Analysis:</p>
              <p>{file.analysis}</p>
            </div>
          )}

          {/* Error Message */}
          {file.status === 'error' && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs">
              <p className="text-red-400">Processing failed. Click retry to try again.</p>
            </div>
          )}

          {/* Image Preview */}
          {file.type.startsWith('image/') && file.status === 'completed' && (
            <div className="mt-3">
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-32 object-cover rounded border border-gray-600/50"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileGrid;