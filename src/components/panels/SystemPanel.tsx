import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Wifi, Shield, Terminal, Activity, Power, RefreshCw } from 'lucide-react';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface SystemStats {
  cpu: {
    usage: number;
    cores: number;
    loadAvg: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    status: string;
    interfaces: string[];
    ip: string;
  };
  uptime: string;
  processes: Process[];
}

interface Process {
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'idle' | 'stopped';
  pid: number;
}

const SystemPanel: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running':
        return 'text-green-400';
      case 'idle':
        return 'text-yellow-400';
      case 'stopped':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const fetchSystemData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/system/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch system data');
      }

      const data = await response.json();
      setSystemStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system data');
      console.error('Error fetching system data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchSystemData();
  };

  const restartProcess = async (pid: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/system/processes/${pid}/restart`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to restart process');
      }

      await fetchSystemData();
    } catch (err) {
      console.error('Error restarting process:', err);
    }
  };

  const stopProcess = async (pid: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/system/processes/${pid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to stop process');
      }

      await fetchSystemData();
    } catch (err) {
      console.error('Error stopping process:', err);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
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

  if (!systemStats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span>System Status</span>
          </h3>
          <button 
            onClick={refreshData}
            disabled={isRefreshing}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">CPU Usage</span>
              <span className="text-blue-400">{systemStats.cpu.usage}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${systemStats.cpu.usage}%` }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Memory Usage</span>
              <span className="text-green-400">{formatBytes(systemStats.memory.used)} / {formatBytes(systemStats.memory.total)}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${systemStats.memory.usage}%` }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Disk Usage</span>
              <span className="text-yellow-400">{formatBytes(systemStats.disk.used)} / {formatBytes(systemStats.disk.total)}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${systemStats.disk.usage}%` }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Network</span>
              <span className="text-purple-400">{systemStats.network.status}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-600/50">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Uptime: {formatUptime(parseInt(systemStats.uptime))}</span>
            <span>Processes: {systemStats.processes.length}</span>
          </div>
        </div>
      </div>

      {/* Running Processes */}
      <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-yellow-400" />
          <span>Running Processes</span>
        </h3>
        
        <div className="space-y-3">
          {systemStats.processes.map((process) => (
            <div key={process.pid} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">{process.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(process.status)} bg-gray-700`}>
                    {process.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                  <span>CPU: {process.cpu.toFixed(1)}%</span>
                  <span>Memory: {formatBytes(process.memory)}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => restartProcess(process.pid)}
                  className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => stopProcess(process.pid)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Actions */}
      <div className="space-y-3">
        <button className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span>Open Terminal</span>
        </button>
        
        <button className="w-full p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Restart Services</span>
        </button>
      </div>

      {/* Security Status */}
      <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
        <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-400" />
          <span>Security</span>
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Firewall</span>
            <span className="text-green-400">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Encryption</span>
            <span className="text-green-400">Enabled</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Last Scan</span>
            <span className="text-gray-400">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPanel;