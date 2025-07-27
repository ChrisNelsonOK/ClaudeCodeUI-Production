import React, { useState } from 'react';
import { 
  Puzzle, 
  Plus, 
  Settings, 
  Search, 
  Filter, 
  RefreshCw,
  Server,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Package
} from 'lucide-react';
import { usePlugins } from '../../hooks/usePlugins';
import { PluginCategory } from '../../types/plugin';
import PluginCard from '../PluginCard';
import { useApp } from '../../context/AppContext';

const PluginsPanel: React.FC = () => {
  const {
    plugins,
    mcpServers,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    installPlugin,
    uninstallPlugin,
    togglePlugin,
    updatePlugin,
    connectMCPServer,
    disconnectMCPServer
  } = usePlugins();
  
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed' | 'mcp'>('marketplace');
  const { addNotification } = useApp();

  const categoryOptions: { value: PluginCategory | 'all'; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'all', label: 'All Categories', icon: Package },
    { value: 'ai-models', label: 'AI Models', icon: Zap },
    { value: 'development', label: 'Development', icon: Settings },
    { value: 'vision', label: 'Vision', icon: Search },
    { value: 'documents', label: 'Documents', icon: Settings },
    { value: 'productivity', label: 'Productivity', icon: TrendingUp },
    { value: 'integrations', label: 'Integrations', icon: Plus },
    { value: 'ui-themes', label: 'UI Themes', icon: Star },
    { value: 'security', label: 'Security', icon: Shield }
  ];

  const installedPlugins = plugins.filter(p => p.installed);
  const availablePlugins = plugins.filter(p => !p.installed);

  const handlePluginConfigure = (pluginId: string) => {
    addNotification({
      type: 'info',
      title: 'Plugin Settings',
      message: 'Plugin configuration panel coming soon!',
      duration: 3000
    });
  };

  const stats = {
    total: plugins.length,
    installed: installedPlugins.length,
    enabled: installedPlugins.filter(p => p.enabled).length,
    available: availablePlugins.length
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/30 p-1 rounded-xl">
        {[
          { id: 'marketplace', label: 'Marketplace', icon: Package },
          { id: 'installed', label: 'Installed', icon: Settings },
          { id: 'mcp', label: 'MCP Servers', icon: Server }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 p-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-gray-700/30 rounded-lg text-center">
          <div className="text-lg font-semibold text-blue-400">{stats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="p-3 bg-gray-700/30 rounded-lg text-center">
          <div className="text-lg font-semibold text-green-400">{stats.installed}</div>
          <div className="text-xs text-gray-400">Installed</div>
        </div>
        <div className="p-3 bg-gray-700/30 rounded-lg text-center">
          <div className="text-lg font-semibold text-yellow-400">{stats.enabled}</div>
          <div className="text-xs text-gray-400">Enabled</div>
        </div>
        <div className="p-3 bg-gray-700/30 rounded-lg text-center">
          <div className="text-lg font-semibold text-purple-400">{stats.available}</div>
          <div className="text-xs text-gray-400">Available</div>
        </div>
      </div>

      {activeTab !== 'mcp' && (
        <>
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex space-x-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              >
                {categoryOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Plugins</option>
                <option value="installed">Installed Only</option>
                <option value="available">Available Only</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Content based on active tab */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-400" />
            <span>Plugin Marketplace ({plugins.length})</span>
          </h3>
          
          <div className="space-y-4">
            {plugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                onInstall={installPlugin}
                onUninstall={uninstallPlugin}
                onToggle={togglePlugin}
                onUpdate={updatePlugin}
                onConfigure={handlePluginConfigure}
                isLoading={isLoading}
              />
            ))}
          </div>
          
          {plugins.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No plugins found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'installed' && (
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center space-x-2">
            <Settings className="w-5 h-5 text-green-400" />
            <span>Installed Plugins ({installedPlugins.length})</span>
          </h3>
          
          <div className="space-y-4">
            {installedPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                onInstall={installPlugin}
                onUninstall={uninstallPlugin}
                onToggle={togglePlugin}
                onUpdate={updatePlugin}
                onConfigure={handlePluginConfigure}
                isLoading={isLoading}
              />
            ))}
          </div>
          
          {installedPlugins.length === 0 && (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No plugins installed</p>
              <p className="text-gray-500 text-sm mt-1">Browse the marketplace to install plugins</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mcp' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium flex items-center space-x-2">
              <Server className="w-5 h-5 text-purple-400" />
              <span>MCP Servers ({mcpServers.length})</span>
            </h3>
            
            <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors border border-purple-500/30">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {mcpServers.map((server) => (
              <div key={server.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-medium">{server.name}</h4>
                      <span className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded">
                        v{server.version}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${server.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{server.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Last seen: {server.lastSeen}</span>
                      <span>{server.capabilities.length} capabilities</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {server.capabilities.map((capability) => (
                        <span key={capability} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {server.connected ? (
                      <button
                        onClick={() => disconnectMCPServer(server.id)}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors border border-red-500/30"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => connectMCPServer(server.id)}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm transition-colors border border-green-500/30"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {mcpServers.length === 0 && (
            <div className="text-center py-8">
              <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No MCP servers configured</p>
              <p className="text-gray-500 text-sm mt-1">Add MCP servers to extend Claude's capabilities</p>
            </div>
          )}
          
          {/* MCP Info */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="text-purple-400 font-medium mb-2 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Model Context Protocol (MCP)</span>
            </h4>
            <p className="text-gray-300 text-sm mb-2">
              MCP enables Claude to connect to external tools, databases, and services through standardized servers.
            </p>
            <div className="text-xs text-gray-400">
              Connected servers: {mcpServers.filter(s => s.connected).length} / {mcpServers.length}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors border border-blue-500/30 flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Update All</span>
          </button>
          <button className="p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors border border-green-500/30 flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Browse Categories</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PluginsPanel;