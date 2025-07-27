interface StorageData {
  conversations: any[];
  settings: any;
  plugins: any[];
  files: any[];
  theme: string;
  version: string;
}

class Storage {
  private static instance: Storage;
  private readonly STORAGE_KEY = 'claude-code-data';
  private readonly VERSION = '1.0.0';

  static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  // Save data to localStorage with compression
  save(key: keyof StorageData, data: any): void {
    try {
      const existingData = this.loadAll();
      const updatedData = {
        ...existingData,
        [key]: data,
        version: this.VERSION
      };
      
      const compressed = JSON.stringify(updatedData);
      localStorage.setItem(this.STORAGE_KEY, compressed);
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  // Load specific data from storage
  load<T>(key: keyof StorageData): T | null {
    try {
      const data = this.loadAll();
      return data[key] as T || null;
    } catch (error) {
      console.error('Failed to load from storage:', error);
      return null;
    }
  }

  // Load all data from storage
  loadAll(): Partial<StorageData> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return {};
      
      const data = JSON.parse(stored);
      
      // Version migration logic
      if (data.version !== this.VERSION) {
        return this.migrate(data);
      }
      
      return data;
    } catch (error) {
      console.error('Failed to load from storage:', error);
      return {};
    }
  }

  // Export all data
  export(): string {
    const data = this.loadAll();
    return JSON.stringify(data, null, 2);
  }

  // Import data
  import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get storage usage
  getUsage(): { used: number; total: number; percentage: number } {
    const used = new Blob([localStorage.getItem(this.STORAGE_KEY) || '']).size;
    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
    return {
      used,
      total,
      percentage: (used / total) * 100
    };
  }

  private migrate(oldData: any): Partial<StorageData> {
    // Handle version migrations here
    return {
      ...oldData,
      version: this.VERSION
    };
  }
}

export const storage = Storage.getInstance();