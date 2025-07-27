import { useState, useCallback, useEffect } from 'react';
import { Plugin, PluginCategory, MCPServer } from '../types/plugin';
import { useApp } from '../context/AppContext';

// Production API configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Real API service for plugin management
class PluginService {
  private baseUrl = API_BASE_URL;

  async fetchPlugins(): Promise<Plugin[]> {
    try {
      const response = await fetch(`${this.baseUrl}/plugins`);
      if (!response.ok) throw new Error('Failed to fetch plugins');
      return response.json();
    } catch (error) {
      console.error('Error fetching plugins:', error);
      return [];
    }
  }

  async fetchMCPServers(): Promise<MCPServer[]> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp-servers`);
      if (!response.ok) throw new Error('Failed to fetch MCP servers');
      return response.json();
    } catch (error) {
      console.error('Error fetching MCP servers:', error);
      return [];
    }
  }

  async installPlugin(pluginId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/plugins/${pluginId}/install`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error installing plugin:', error);
      return false;
    }
  }

  async uninstallPlugin(pluginId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/plugins/${pluginId}/uninstall`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
      return false;
    }
  }

  async togglePlugin(pluginId: string, enabled: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/plugins/${pluginId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error toggling plugin:', error);
      return false;
    }
  }

  async connectMCPServer(serverId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp-servers/${serverId}/connect`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error connecting MCP server:', error);
      return false;
    }
  }

  async disconnectMCPServer(serverId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp-servers/${serverId}/disconnect`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error disconnecting MCP server:', error);
      return false;
    }
  }
}

const pluginService = new PluginService();

export const usePlugins = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [mcpServers, setMCPServers] = useState<MCPServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PluginCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'installed' | 'available'>('all');
  const { addNotification } = useApp();

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = !searchQuery || 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || plugin.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'installed' && plugin.installed) ||
      (statusFilter === 'available' && !plugin.installed);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const fetchPlugins = useCallback(async () => {
    setIsLoading(true);
    try {
      const plugins = await pluginService.fetchPlugins();
      setPlugins(plugins);
    } catch (error) {
      console.error('Error fetching plugins:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMCPServers = useCallback(async () => {
    setIsLoading(true);
    try {
      const servers = await pluginService.fetchMCPServers();
      setMCPServers(servers);
    } catch (error) {
      console.error('Error fetching MCP servers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const installPlugin = useCallback(async (pluginId: string) => {
    setIsLoading(true);
    try {
      const success = await pluginService.installPlugin(pluginId);
      if (success) {
        addNotification({
          type: 'success',
          title: 'Plugin Installed',
          message: `Plugin ${pluginId} has been successfully installed`,
          duration: 4000
        });
        fetchPlugins();
      } else {
        addNotification({
          type: 'error',
          title: 'Plugin Installation Failed',
          message: `Failed to install plugin ${pluginId}`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error installing plugin:', error);
      addNotification({
        type: 'error',
        title: 'Plugin Installation Failed',
        message: `Failed to install plugin ${pluginId}`,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlugins, addNotification]);

  const uninstallPlugin = useCallback(async (pluginId: string) => {
    setIsLoading(true);
    try {
      const success = await pluginService.uninstallPlugin(pluginId);
      if (success) {
        addNotification({
          type: 'success',
          title: 'Plugin Uninstalled',
          message: `Plugin ${pluginId} has been successfully uninstalled`,
          duration: 4000
        });
        fetchPlugins();
      } else {
        addNotification({
          type: 'error',
          title: 'Plugin Uninstallation Failed',
          message: `Failed to uninstall plugin ${pluginId}`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
      addNotification({
        type: 'error',
        title: 'Plugin Uninstallation Failed',
        message: `Failed to uninstall plugin ${pluginId}`,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlugins, addNotification]);

  const togglePlugin = useCallback(async (pluginId: string) => {
    setIsLoading(true);
    try {
      const success = await pluginService.togglePlugin(pluginId, !plugins.find(plugin => plugin.id === pluginId)?.enabled);
      if (success) {
        addNotification({
          type: 'success',
          title: 'Plugin Toggled',
          message: `Plugin ${pluginId} has been successfully toggled`,
          duration: 4000
        });
        fetchPlugins();
      } else {
        addNotification({
          type: 'error',
          title: 'Plugin Toggle Failed',
          message: `Failed to toggle plugin ${pluginId}`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error toggling plugin:', error);
      addNotification({
        type: 'error',
        title: 'Plugin Toggle Failed',
        message: `Failed to toggle plugin ${pluginId}`,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlugins, plugins, addNotification]);

  const connectMCPServer = useCallback(async (serverId: string) => {
    setIsLoading(true);
    try {
      const success = await pluginService.connectMCPServer(serverId);
      if (success) {
        addNotification({
          type: 'success',
          title: 'MCP Server Connected',
          message: `MCP server ${serverId} has been successfully connected`,
          duration: 4000
        });
        fetchMCPServers();
      } else {
        addNotification({
          type: 'error',
          title: 'MCP Server Connection Failed',
          message: `Failed to connect MCP server ${serverId}`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error connecting MCP server:', error);
      addNotification({
        type: 'error',
        title: 'MCP Server Connection Failed',
        message: `Failed to connect MCP server ${serverId}`,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchMCPServers, addNotification]);

  const disconnectMCPServer = useCallback(async (serverId: string) => {
    setIsLoading(true);
    try {
      const success = await pluginService.disconnectMCPServer(serverId);
      if (success) {
        addNotification({
          type: 'success',
          title: 'MCP Server Disconnected',
          message: `MCP server ${serverId} has been successfully disconnected`,
          duration: 4000
        });
        fetchMCPServers();
      } else {
        addNotification({
          type: 'error',
          title: 'MCP Server Disconnection Failed',
          message: `Failed to disconnect MCP server ${serverId}`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error disconnecting MCP server:', error);
      addNotification({
        type: 'error',
        title: 'MCP Server Disconnection Failed',
        message: `Failed to disconnect MCP server ${serverId}`,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchMCPServers, addNotification]);

  useEffect(() => {
    fetchPlugins();
    fetchMCPServers();
  }, [fetchPlugins, fetchMCPServers]);

  return {
    plugins: filteredPlugins,
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
    connectMCPServer,
    disconnectMCPServer,
  };