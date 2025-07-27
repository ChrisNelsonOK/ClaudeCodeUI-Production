export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: PluginCategory;
  tags: string[];
  enabled: boolean;
  installed: boolean;
  size: string;
  downloads: string;
  rating: number;
  lastUpdated: string;
  icon?: string;
  screenshots?: string[];
  dependencies?: string[];
  permissions: PluginPermission[];
  settings?: PluginSetting[];
  status: PluginStatus;
  installPath?: string;
  mcpCompatible: boolean;
}

export interface PluginSetting {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  defaultValue: any;
  options?: { label: string; value: any }[];
  required: boolean;
  description?: string;
}

export interface PluginPermission {
  type: 'api' | 'filesystem' | 'network' | 'ui' | 'data';
  description: string;
  required: boolean;
}

export type PluginCategory = 
  | 'ai-models'
  | 'development' 
  | 'vision' 
  | 'documents' 
  | 'productivity' 
  | 'integrations'
  | 'ui-themes'
  | 'security'
  | 'experimental';

export type PluginStatus = 
  | 'available'
  | 'installing' 
  | 'installed' 
  | 'updating'
  | 'error'
  | 'incompatible';

export interface PluginRepository {
  id: string;
  name: string;
  url: string;
  trusted: boolean;
  lastSync: string;
  pluginCount: number;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities: string[];
  connected: boolean;
  lastSeen: string;
}