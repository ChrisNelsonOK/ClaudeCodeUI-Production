import React from 'react';
import { X } from 'lucide-react';
import VisionPanel from './panels/VisionPanel';
import DocumentsPanel from './panels/DocumentsPanel';
import PluginsPanel from './panels/PluginsPanel';
import MemoryPanel from './panels/MemoryPanel';
import SystemPanel from './panels/SystemPanel';
import SettingsPanel from './panels/SettingsPanel';

interface FlyoutPanelProps {
  isOpen: boolean;
  type: string | null;
  onClose: () => void;
}

const FlyoutPanel: React.FC<FlyoutPanelProps> = ({ isOpen, type, onClose }) => {
  const renderContent = () => {
    switch (type) {
      case 'vision':
        return <VisionPanel />;
      case 'documents':
        return <DocumentsPanel />;
      case 'plugins':
        return <PluginsPanel />;
      case 'memory':
        return <MemoryPanel />;
      case 'system':
        return <SystemPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <div>Panel content for {type}</div>;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'vision':
        return 'Vision & Image Analysis';
      case 'documents':
        return 'Document Processing';
      case 'plugins':
        return 'Plugins & Extensions';
      case 'memory':
        return 'Memory Management';
      case 'system':
        return 'System Administration';
      case 'settings':
        return 'Settings & Configuration';
      default:
        return 'Panel';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 animate-fade-in-up"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-96 bg-gray-800/95 backdrop-blur-xl border-l border-gray-700/50 
          shadow-2xl z-50 transform transition-all duration-300 ease-out glass-effect
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gray-900/50 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{getTitle()}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover-glow"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default FlyoutPanel;