import React from 'react';
import { Wifi, Battery, Clock, Cpu, MemoryStick, Zap } from 'lucide-react';

const StatusBar: React.FC = () => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Claude Code
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-green-400" />
              <span>Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>2:34 PM</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-1">
              <Cpu className="w-4 h-4" />
              <span>34%</span>
            </div>
            <div className="flex items-center space-x-1">
              <MemoryStick className="w-4 h-4" />
              <span>2.1GB</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wifi className="w-4 h-4 text-green-400" />
              <span>Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <Battery className="w-4 h-4 text-blue-400" />
              <span>87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;