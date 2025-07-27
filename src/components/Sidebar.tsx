import React from 'react';
import { 
  MessageSquare, 
  Image, 
  FileText, 
  Puzzle, 
  Database, 
  Settings, 
  Cpu,
  Zap,
  Brain,
  Shield,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  onOpenFlyout: (type: string) => void;
  onToggleConversations: () => void;
  showConversations: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenFlyout, onToggleConversations, showConversations }) => {
  const menuItems = [
    { icon: showConversations ? PanelLeftClose : PanelLeftOpen, label: 'Conversations', id: 'toggle-conversations', action: onToggleConversations },
    { icon: Image, label: 'Vision', id: 'vision' },
    { icon: FileText, label: 'Documents', id: 'documents' },
    { icon: Puzzle, label: 'Plugins', id: 'plugins' },
    { icon: Database, label: 'Memory', id: 'memory' },
    { icon: Cpu, label: 'System', id: 'system' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="w-20 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col items-center py-6 relative">
      {/* Logo */}
      <div className="mb-8 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl">
        <Brain className="w-8 h-8 text-white" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                onOpenFlyout(item.id);
              }
            }}
            className={`
              p-3 rounded-xl transition-all duration-300 group relative
              hover-glow hover:scale-105
              ${item.id === 'toggle-conversations' && showConversations
                ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }
            `}
          >
            <item.icon className="w-6 h-6" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-gray-700 glass-effect animate-fade-in-up">
              {item.label}
            </div>

            {/* Active indicator */}
            {item.id === 'toggle-conversations' && showConversations && (
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-l-full animate-pulse-glow"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Status Indicators */}
      <div className="flex flex-col space-y-3">
        <div className="p-2 bg-green-500/20 rounded-lg hover-glow cursor-pointer">
          <Zap className="w-4 h-4 text-green-400" />
        </div>
        <div className="p-2 bg-blue-500/20 rounded-lg hover-glow cursor-pointer">
          <Shield className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;