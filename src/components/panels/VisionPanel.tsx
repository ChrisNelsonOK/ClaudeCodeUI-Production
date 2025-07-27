import React, { useState } from 'react';
import { Image, Camera, Eye, Zap, Layers, Palette, Search, Filter } from 'lucide-react';
import FileUploadZone from '../FileUploadZone';
import FileGrid from '../FileGrid';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useApp } from '../../context/AppContext';

const VisionPanel: React.FC = () => {
  const [analysisMode, setAnalysisMode] = useState<'basic' | 'detailed' | 'creative'>('basic');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'images' | 'processed'>('all');
  
  const { files, isUploading, uploadFiles, removeFile, retryProcessing, clearAll } = useFileUpload();
  const { addNotification } = useApp();

  const handleFilesSelected = (fileList: FileList) => {
    const imageFiles = Array.from(fileList).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length !== fileList.length) {
      addNotification({
        type: 'warning',
        title: 'File Type Warning',
        message: 'Only image files are supported in Vision panel',
        duration: 4000
      });
    }

    if (imageFiles.length > 0) {
      const imageFileList = new DataTransfer();
      imageFiles.forEach(file => imageFileList.items.add(file));
      uploadFiles(imageFileList.files);
    }
  };

  const handleBatchAnalysis = () => {
    const completedImages = files.filter(f => 
      f.status === 'completed' && f.type.startsWith('image/')
    );

    if (completedImages.length === 0) {
      addNotification({
        type: 'info',
        title: 'No Images',
        message: 'Upload some images first to run batch analysis',
        duration: 3000
      });
      return;
    }

    addNotification({
      type: 'success',
      title: 'Batch Analysis Started',
      message: `Processing ${completedImages.length} images with ${analysisMode} analysis`,
      duration: 4000
    });

    // Simulate batch processing
    setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Batch Analysis Complete',
        message: 'All images have been analyzed successfully',
        duration: 3000
      });
    }, 2000);
  };

  const filteredFiles = files.filter(file => {
    if (filterType === 'all') return true;
    if (filterType === 'images') return file.type.startsWith('image/');
    if (filterType === 'processed') return file.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <FileUploadZone
        onFilesSelected={handleFilesSelected}
        acceptedTypes="image/*"
        maxFileSize={10}
        maxFiles={20}
        disabled={isUploading}
      />

      {/* Analysis Settings */}
      <div className="space-y-4">
        <h3 className="text-white font-medium flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <span>Analysis Settings</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Analysis Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'basic', label: 'Basic', icon: Eye },
                { id: 'detailed', label: 'Detailed', icon: Search },
                { id: 'creative', label: 'Creative', icon: Palette }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setAnalysisMode(id as any)}
                  className={`p-2 rounded-lg text-xs transition-all duration-200 flex items-center justify-center space-x-1 ${
                    analysisMode === id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Auto-analyze uploads</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={autoAnalyze}
                onChange={(e) => setAutoAnalyze(e.target.checked)}
              />
              <div className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${
                autoAnalyze ? 'bg-blue-500' : 'bg-gray-600'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full ml-1 transform transition-transform duration-200 ${
                  autoAnalyze ? 'translate-x-4' : ''
                }`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleBatchAnalysis}
          disabled={files.filter(f => f.type.startsWith('image/') && f.status === 'completed').length === 0}
          className="p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30"
        >
          <Layers className="w-4 h-4" />
          <span>Batch Analysis</span>
        </button>
        
        <button 
          onClick={() => {
            // Simulate screen capture
            addNotification({
              type: 'info',
              title: 'Screen Capture',
              message: 'Screen capture feature coming soon!',
              duration: 3000
            });
          }}
          className="p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all duration-200 flex items-center justify-center space-x-2 border border-green-500/30"
        >
          <Camera className="w-4 h-4" />
          <span>Screen Capture</span>
        </button>
      </div>

      {/* File Management */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium flex items-center space-x-2">
              <Image className="w-5 h-5 text-green-400" />
              <span>Images ({filteredFiles.length})</span>
            </h3>
            
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
              >
                <option value="all">All Files</option>
                <option value="images">Images Only</option>
                <option value="processed">Processed</option>
              </select>
              
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 hover:bg-red-500/10 rounded transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <FileGrid
            files={filteredFiles}
            onRemove={removeFile}
            onRetry={retryProcessing}
          />
        </div>
      )}

      {/* Vision Processing Stats */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-semibold text-blue-400">
              {files.filter(f => f.type.startsWith('image/')).length}
            </div>
            <div className="text-xs text-gray-400">Images</div>
          </div>
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-semibold text-green-400">
              {files.filter(f => f.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-400">Processed</div>
          </div>
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-semibold text-yellow-400">
              {Math.round(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024))}MB
            </div>
            <div className="text-xs text-gray-400">Total Size</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionPanel;