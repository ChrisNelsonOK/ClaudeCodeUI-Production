import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Clock, Star, Settings, MessageSquare, Image, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useApp();

  const commands: Command[] = [
    {
      id: 'new-chat',
      title: 'New Chat',
      description: 'Start a new conversation',
      icon: MessageSquare,
      category: 'Chat',
      action: () => {
        document.dispatchEvent(new CustomEvent('new-chat'));
        onClose();
      },
      keywords: ['new', 'chat', 'conversation', 'start']
    },
    {
      id: 'open-vision',
      title: 'Open Vision Panel',
      description: 'Upload and analyze images',
      icon: Image,
      category: 'Tools',
      action: () => {
        document.dispatchEvent(new CustomEvent('open-panel', { detail: 'vision' }));
        onClose();
      },
      keywords: ['vision', 'image', 'analyze', 'upload', 'picture']
    },
    {
      id: 'open-documents',
      title: 'Open Documents Panel',
      description: 'Process and manage documents',
      icon: FileText,
      category: 'Tools',
      action: () => {
        document.dispatchEvent(new CustomEvent('open-panel', { detail: 'documents' }));
        onClose();
      },
      keywords: ['documents', 'files', 'pdf', 'text', 'process']
    },
    {
      id: 'open-settings',
      title: 'Open Settings',
      description: 'Configure application preferences',
      icon: Settings,
      category: 'Navigation',
      action: () => {
        document.dispatchEvent(new CustomEvent('open-panel', { detail: 'settings' }));
        onClose();
      },
      keywords: ['settings', 'preferences', 'configure', 'options']
    },
    {
      id: 'toggle-theme',
      title: 'Switch Theme',
      description: 'Change application theme',
      icon: Star,
      category: 'Appearance',
      action: () => {
        addNotification({
          type: 'info',
          title: 'Theme Switcher',
          message: 'Open Settings > Appearance to change themes',
          duration: 3000
        });
        onClose();
      },
      keywords: ['theme', 'dark', 'light', 'appearance', 'color']
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download all your data',
      icon: Clock,
      category: 'Data',
      action: () => {
        addNotification({
          type: 'info',
          title: 'Export Started',
          message: 'Preparing your data for download...',
          duration: 3000
        });
        onClose();
      },
      keywords: ['export', 'download', 'backup', 'data', 'save']
    }
  ];

  const filteredCommands = commands.filter(command => {
    const searchTerm = query.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.category.toLowerCase().includes(searchTerm) ||
      command.keywords.some(keyword => keyword.includes(searchTerm))
    );
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-32">
      <div className="bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands..."
              className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-gray-400 text-lg outline-none"
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No commands found</p>
              <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((command, index) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={command.action}
                    className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-left ${
                      index === selectedIndex
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium">{command.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{command.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                        {command.category}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700/50 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;