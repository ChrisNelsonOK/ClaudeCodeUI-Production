import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  analysis?: string;
  extractedText?: string;
  thumbnailUrl?: string;
}

// Real API service for file upload and processing
class FileUploadService {
  private baseUrl = API_BASE_URL;

  async uploadFile(file: File, onProgress: (progress: number) => void): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid server response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseUrl}/files/upload`);
      xhr.send(formData);
    });
  }

  async processFile(fileId: string): Promise<{ analysis: string; extractedText?: string; thumbnailUrl?: string }> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/process`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Processing failed');
    }

    return response.json();
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: 'DELETE',
    });
    return response.ok;
  }

  async retryProcessing(fileId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/retry`, {
      method: 'POST',
    });
    return response.ok;
  }

  async getFiles(): Promise<UploadedFile[]> {
    const response = await fetch(`${this.baseUrl}/files`);
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    return response.json();
  }
}

const fileUploadService = new FileUploadService();

export const useFileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { addNotification } = useApp();

  const uploadFiles = useCallback(async (fileList: FileList) => {
    setIsUploading(true);

    const newFiles: UploadedFile[] = Array.from(fileList).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      status: 'uploading' as const,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    addNotification({
      type: 'info',
      title: 'Upload Started',
      message: `Processing ${newFiles.length} file(s)`,
      duration: 2000
    });

    // Process each file
    for (const file of newFiles) {
      try {
        const uploadedFile = await fileUploadService.uploadFile(
          fileList[newFiles.indexOf(file)], 
          (progress) => {
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, progress, status: progress === 100 ? 'processing' : 'uploading' } : f
            ));
          }
        );

        // Process the file
        const processingResult = await fileUploadService.processFile(uploadedFile.id);
        
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                ...uploadedFile,
                status: 'completed' as const,
                progress: 100,
                ...processingResult
              }
            : f
        ));

        addNotification({
          type: 'success',
          title: 'File Processed',
          message: `${file.name} has been successfully processed`,
          duration: 3000
        });
      } catch (error) {
        console.error('Error processing file:', error);
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' as const } : f
        ));
        
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: `Failed to process ${file.name}`,
          duration: 4000
        });
      }
    }

    setIsUploading(false);
  }, [addNotification]);

  const removeFile = useCallback(async (fileId: string) => {
    try {
      const success = await fileUploadService.deleteFile(fileId);
      if (success) {
        setFiles(prev => {
          const file = prev.find(f => f.id === fileId);
          if (file?.url) {
            URL.revokeObjectURL(file.url);
          }
          return prev.filter(f => f.id !== fileId);
        });

        addNotification({
          type: 'success',
          title: 'File Removed',
          message: 'File has been deleted from your library',
          duration: 2000
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Removal Failed',
          message: 'Failed to remove file',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error removing file:', error);
      addNotification({
        type: 'error',
        title: 'Removal Failed',
        message: 'Failed to remove file',
        duration: 3000
      });
    }
  }, [addNotification]);

  const retryProcessing = useCallback(async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing' as const } : f
    ));

    try {
      const processingResult = await fileUploadService.processFile(fileId);
      
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'completed' as const, ...processingResult }
          : f
      ));

      addNotification({
        type: 'success',
        title: 'Processing Retried',
        message: `${file.name} has been successfully reprocessed`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error retrying processing:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error' as const } : f
      ));
      
      addNotification({
        type: 'error',
        title: 'Processing Failed',
        message: `Failed to reprocess ${file.name}`,
        duration: 4000
      });
    }
  }, [files, addNotification]);

  const clearAll = useCallback(async () => {
    try {
      const currentFiles = [...files];
      
      // Delete each file from server
      await Promise.all(currentFiles.map(file => 
        fileUploadService.deleteFile(file.id)
      ));

      // Clean up local state
      currentFiles.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
      setFiles([]);

      addNotification({
        type: 'success',
        title: 'Files Cleared',
        message: 'All files have been removed',
        duration: 2000
      });
    } catch (error) {
      console.error('Error clearing files:', error);
      addNotification({
        type: 'error',
        title: 'Clear Failed',
        message: 'Failed to clear all files',
        duration: 3000
      });
    }
  }, [files, addNotification]);

  // Load existing files on mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const existingFiles = await fileUploadService.getFiles();
        setFiles(existingFiles);
      } catch (error) {
        console.error('Error loading files:', error);
        addNotification({
          type: 'error',
          title: 'Load Failed',
          message: 'Failed to load existing files',
          duration: 3000
        });
      }
    };

    loadFiles();
  }, [addNotification]);

  return {
    files,
    isUploading,
    uploadFiles,
    removeFile,
    retryProcessing,
    clearAll,
  };
};