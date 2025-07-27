import React, { useState, useEffect } from 'react';
import { Database, Trash2, Download, RefreshCw, HardDrive, Clock } from 'lucide-react';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface MemoryStats {
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  cacheSize: number;
  conversationCount: number;
  documentCount: number;
}

interface Session {
  id: string;
  title: string;
  messageCount: number;
  size: number;
  lastAccessed: string;
  createdAt: string;
}

const MemoryPanel: React.FC = () => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const fetchMemoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [memoryResponse, sessionsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/system/memory`),
        fetch(`${API_BASE_URL}/sessions/recent`)
      ]);

      if (!memoryResponse.ok || !sessionsResponse.ok) {
        throw new Error('Failed to fetch memory data');
      }

      const memoryData = await memoryResponse.json();
      const sessionsData = await sessionsResponse.json();

      setMemoryStats(memoryData);
      setRecentSessions(sessionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memory data');
      console.error('Error fetching memory data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      await fetchMemoryData();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const clearCache = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/system/cache`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear cache');
      }

      await fetchMemoryData();
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/system/memory`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear all memory');
      }

      await fetchMemoryData();
    } catch (err) {
      console.error('Error clearing all memory:', err);
    }
  };

  const downloadSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download session');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading session:', err);
    }
  };

  useEffect(() => {
    fetchMemoryData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (!memoryStats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Memory Overview */}
      <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-400" />
          <span>Memory Overview</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Total Memory</span>
            <span className="text-white">{memoryStats.totalMemory}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Used Memory</span>
            <span className="text-yellow-400">{memoryStats.usedMemory}</span>
          </div>
          
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '52%' }}></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Cache Size</span>
            <span className="text-green-400">{memoryStats.cacheSize}</span>
          </div>
        </div>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-700/30 rounded-lg text-center">
          <div className="text-lg font-semibold text-blue-400">1,247</div>
          <div className="text-xs text-gray-400">Messages</div>
        </div>
        <div className="p-3 bg-gray-700/30 rounded-lg text-center">
          <div className="text-lg font-semibold text-green-400">156</div>
          <div className="text-xs text-gray-400">Documents</div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-white font-medium mb-3">Recent Sessions</h3>
        <div className="space-y-3">
          {recentSessions.map((session) => (
            <div key={session.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white text-sm font-medium">{session.title}</h4>
                <button 
                  onClick={() => clearSession(session.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{session.messageCount} messages</span>
                <span>{formatBytes(session.size)}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">{formatTimeAgo(session.lastAccessed)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Actions */}
      <div className="space-y-3">
        <button 
          onClick={() => {
            // Export all sessions
            const exportData = {
              sessions: recentSessions,
              memoryStats,
              exportDate: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `memory-export-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }}
          className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Memory</span>
        </button>
        
        <button 
          onClick={clearCache}
          className="w-full p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Clear Cache</span>
        </button>
        
        <button 
          onClick={clearAll}
          className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <HardDrive className="w-4 h-4" />
          <span>Clear All Memory</span>
        </button>
      </div>

      {/* Auto-cleanup Settings */}
      <div>
        <h3 className="text-white font-medium mb-3">Auto-cleanup</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Clear old sessions (30 days)</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" defaultChecked />
              <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center">
                <div className="w-4 h-4 bg-white rounded-full ml-1 transform translate-x-4 transition-transform duration-200"></div>
              </div>
            </div>
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Auto-compress documents</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-10 h-6 bg-gray-600 rounded-full flex items-center">
                <div className="w-4 h-4 bg-white rounded-full ml-1 transition-transform duration-200"></div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MemoryPanel;