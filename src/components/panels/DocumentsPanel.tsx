import React, { useState } from 'react';
import { FileText, Search, BookOpen, FileCheck, Database, Filter, Download } from 'lucide-react';
import FileUploadZone from '../FileUploadZone';
import FileGrid from '../FileGrid';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useApp } from '../../context/AppContext';

const DocumentsPanel: React.FC = () => {
  const [processingOptions, setProcessingOptions] = useState({
    extractText: true,
    generateSummary: true,
    createEmbeddings: false,
    parseStructure: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [documentFilter, setDocumentFilter] = useState<'all' | 'pdf' | 'text' | 'processed'>('all');

  const { files, isUploading, uploadFiles, removeFile, retryProcessing, clearAll } = useFileUpload();
  const { addNotification } = useApp();

  const handleFilesSelected = (fileList: FileList) => {
    const documentFiles = Array.from(fileList).filter(file => 
      file.type === 'application/pdf' ||
      file.type.startsWith('text/') ||
      file.name.endsWith('.md') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc')
    );

    if (documentFiles.length !== fileList.length) {
      addNotification({
        type: 'warning',
        title: 'File Type Warning',
        message: 'Only documents (PDF, TXT, MD, DOCX) are supported',
        duration: 4000
      });
    }

    if (documentFiles.length > 0) {
      const documentFileList = new DataTransfer();
      documentFiles.forEach(file => documentFileList.items.add(file));
      uploadFiles(documentFileList.files);
    }
  };

  const handleBulkExport = () => {
    const processedDocs = files.filter(f => f.status === 'completed' && f.extractedText);
    
    if (processedDocs.length === 0) {
      addNotification({
        type: 'info',
        title: 'No Documents',
        message: 'No processed documents available for export',
        duration: 3000
      });
      return;
    }

    // Create a combined export of all extracted text
    const combinedContent = processedDocs.map(doc => 
      `# ${doc.name}\n\n${doc.extractedText || ''}\n\n---\n\n`
    ).join('');

    const blob = new Blob([combinedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-documents.md';
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Export Complete',
      message: `Exported ${processedDocs.length} documents`,
      duration: 3000
    });
  };

  const handleProcessingOptionChange = (option: keyof typeof processingOptions) => {
    setProcessingOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const filteredFiles = files.filter(file => {
    // Filter by type
    let passesTypeFilter = false;
    switch (documentFilter) {
      case 'all':
        passesTypeFilter = true;
        break;
      case 'pdf':
        passesTypeFilter = file.type === 'application/pdf';
        break;
      case 'text':
        passesTypeFilter = file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt');
        break;
      case 'processed':
        passesTypeFilter = file.status === 'completed';
        break;
    }

    // Filter by search query
    const passesSearchFilter = !searchQuery || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.extractedText && file.extractedText.toLowerCase().includes(searchQuery.toLowerCase()));

    return passesTypeFilter && passesSearchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <FileUploadZone
        onFilesSelected={handleFilesSelected}
        acceptedTypes=".pdf,.txt,.md,.docx,.doc,text/*,application/pdf"
        maxFileSize={25}
        maxFiles={50}
        disabled={isUploading}
      />

      {/* Processing Options */}
      <div className="space-y-4">
        <h3 className="text-white font-medium flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-green-400" />
          <span>Processing Options</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(processingOptions).map(([key, value]) => {
            const labels = {
              extractText: 'Extract Text',
              generateSummary: 'Generate Summary',
              createEmbeddings: 'Create Embeddings',
              parseStructure: 'Parse Structure'
            };

            return (
              <label key={key} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300 text-sm">{labels[key as keyof typeof labels]}</span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={value}
                    onChange={() => handleProcessingOptionChange(key as keyof typeof processingOptions)}
                  />
                  <div className={`w-8 h-5 rounded-full flex items-center transition-colors duration-200 ${
                    value ? 'bg-green-500' : 'bg-gray-600'
                  }`}>
                    <div className={`w-3 h-3 bg-white rounded-full ml-0.5 transform transition-transform duration-200 ${
                      value ? 'translate-x-3' : ''
                    }`}></div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Search and Filter */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents and content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <select
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value as any)}
              className="text-sm bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
            >
              <option value="all">All Documents</option>
              <option value="pdf">PDF Files</option>
              <option value="text">Text Files</option>
              <option value="processed">Processed</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={handleBulkExport}
                disabled={files.filter(f => f.status === 'completed').length === 0}
                className="text-sm px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded border border-blue-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Download className="w-3 h-3" />
                <span>Export All</span>
              </button>
              
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-red-400 hover:text-red-300 px-3 py-1 hover:bg-red-500/10 rounded transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      {filteredFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Documents ({filteredFiles.length})</span>
          </h3>

          <FileGrid
            files={filteredFiles}
            onRemove={removeFile}
            onRetry={retryProcessing}
          />
        </div>
      )}

      {/* Document Processing Stats */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-semibold text-blue-400">
              {files.length}
            </div>
            <div className="text-xs text-gray-400">Total Docs</div>
          </div>
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-semibold text-green-400">
              {files.filter(f => f.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-400">Processed</div>
          </div>
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-semibold text-purple-400">
              {files.filter(f => f.extractedText).length}
            </div>
            <div className="text-xs text-gray-400">Text Extracted</div>
          </div>
        </div>
      )}

      {/* Supported Formats */}
      <div className="p-4 bg-gray-700/20 rounded-lg">
        <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
          <Database className="w-4 h-4 text-gray-400" />
          <span>Supported Formats</span>
        </h4>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {['PDF', 'TXT', 'MD', 'DOCX', 'DOC', 'RTF', 'CSV', 'JSON'].map((format) => (
            <span key={format} className="px-2 py-1 bg-gray-700/50 rounded text-gray-300 text-center">
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPanel;