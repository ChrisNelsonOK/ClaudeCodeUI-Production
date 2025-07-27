import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  Settings, 
  Star, 
  Shield, 
  Zap, 
  Check, 
  X, 
  RefreshCw,
  Eye,
  ChevronRight,
  Clock,
  Users
} from 'lucide-react';
import { Plugin } from '../types/plugin';

interface PluginCardProps {
  plugin: Plugin;
  onInstall: (pluginId: string) => void;
  onUninstall: (pluginId: string) => void;
  onToggle: (pluginId: string) => void;
  onUpdate: (pluginId: string) => void;
  onConfigure?: (pluginId: string) => void;
  isLoading?: boolean;
}

const PluginCard: React.FC<PluginCardProps> = ({
  plugin,
  onInstall,
  onUninstall,
  onToggle,
  onUpdate,
  onConfigure,
  isLoading = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      'ai-models': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      'development': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      'vision': 'text-green-400 bg-green-500/10 border-green-500/30',
      'documents': 'text-red-400 bg-red-500/10 border-red-500/30',
      'productivity': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      'integrations': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      'ui-themes': 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      'security': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      'experimental': 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    };
    return colors[category as keyof typeof colors] || colors.experimental;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'installed': return 'text-green-400';
      case 'installing': return 'text-blue-400 animate-pulse';
      case 'updating': return 'text-yellow-400 animate-pulse';
      case 'error': return 'text-red-400';
      case 'incompatible': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-medium truncate">{plugin.name}</h3>
              <span className="text-xs text-gray-400">v{plugin.version}</span>
              {plugin.mcpCompatible && (
                <div className="flex items-center space-x-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                  <Zap className="w-3 h-3" />
                  <span>MCP</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-2 py-0.5 text-xs rounded border ${getCategoryColor(plugin.category)}`}>
                {plugin.category.replace('-', ' ')}
              </span>
              <div className="flex items-center space-x-1">
                {renderStars(plugin.rating)}
                <span className="text-xs text-gray-400 ml-1">({plugin.rating})</span>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-2">{plugin.description}</p>
          </div>
          
          <div className={`ml-3 ${getStatusColor(plugin.status)}`}>
            {plugin.status === 'installing' || plugin.status === 'updating' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : plugin.installed && plugin.enabled ? (
              <Check className="w-5 h-5" />
            ) : plugin.installed ? (
              <Clock className="w-5 h-5" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{plugin.downloads}</span>
            </div>
            <span>{plugin.size}</span>
            <span>by {plugin.author}</span>
          </div>
          <span>{plugin.lastUpdated}</span>
        </div>

        {/* Tags */}
        {plugin.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {plugin.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded">
                {tag}
              </span>
            ))}
            {plugin.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded">
                +{plugin.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {!plugin.installed ? (
              <button
                onClick={() => onInstall(plugin.id)}
                disabled={isLoading || plugin.status === 'installing'}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm transition-colors flex items-center space-x-1 disabled:cursor-not-allowed"
              >
                <Download className="w-3 h-3" />
                <span>Install</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => onToggle(plugin.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center space-x-1 ${
                    plugin.enabled 
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30' 
                      : 'bg-gray-600/50 text-gray-300 hover:bg-gray-600 border border-gray-600/50'
                  }`}
                >
                  {plugin.enabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>{plugin.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>
                
                {plugin.settings && plugin.settings.length > 0 && (
                  <button
                    onClick={() => onConfigure?.(plugin.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Configure"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => onUpdate(plugin.id)}
                  disabled={plugin.status === 'updating'}
                  className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors disabled:cursor-not-allowed"
                  title="Update"
                >
                  <RefreshCw className={`w-4 h-4 ${plugin.status === 'updating' ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={() => onUninstall(plugin.id)}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Uninstall"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transform transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t border-gray-700/50 p-4 bg-gray-900/30">
          {/* Permissions */}
          {plugin.permissions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span>Permissions</span>
              </h4>
              <div className="space-y-1">
                {plugin.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${permission.required ? 'bg-red-400' : 'bg-green-400'}`}></div>
                    <span>{permission.description}</span>
                    {permission.required && <span className="text-red-400">(Required)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {plugin.dependencies && plugin.dependencies.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2">Dependencies</h4>
              <div className="flex flex-wrap gap-1">
                {plugin.dependencies.map((dep) => (
                  <span key={dep} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full Tags */}
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {plugin.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginCard;