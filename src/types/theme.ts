export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  gradient: string;
}

export const themes: Record<string, Theme> = {
  'dark-pro': {
    id: 'dark-pro',
    name: 'Dark Pro',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      background: {
        primary: '#111827',
        secondary: '#1F2937',
        tertiary: '#374151',
      },
      text: {
        primary: '#F9FAFB',
        secondary: '#D1D5DB',
        muted: '#9CA3AF',
      },
      border: {
        primary: '#374151',
        secondary: '#4B5563',
      },
      status: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
    },
    gradient: 'from-blue-500 to-purple-600',
  },
  'blue-night': {
    id: 'blue-night',
    name: 'Blue Night',
    colors: {
      primary: '#1E40AF',
      secondary: '#3730A3',
      accent: '#0EA5E9',
      background: {
        primary: '#0F172A',
        secondary: '#1E293B',
        tertiary: '#334155',
      },
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        muted: '#94A3B8',
      },
      border: {
        primary: '#334155',
        secondary: '#475569',
      },
      status: {
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        info: '#0284C7',
      },
    },
    gradient: 'from-blue-600 to-indigo-700',
  },
  'crimson-dark': {
    id: 'crimson-dark',
    name: 'Crimson Dark',
    colors: {
      primary: '#DC2626',
      secondary: '#991B1B',
      accent: '#F59E0B',
      background: {
        primary: '#1A0B0B',
        secondary: '#2D1B1B',
        tertiary: '#451A1A',
      },
      text: {
        primary: '#FEF2F2',
        secondary: '#FECACA',
        muted: '#FCA5A5',
      },
      border: {
        primary: '#451A1A',
        secondary: '#7F1D1D',
      },
      status: {
        success: '#059669',
        warning: '#D97706',
        error: '#EF4444',
        info: '#3B82F6',
      },
    },
    gradient: 'from-red-600 to-red-800',
  },
  'cyber-green': {
    id: 'cyber-green',
    name: 'Cyber Green',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: {
        primary: '#0A1F0A',
        secondary: '#1A2F1A',
        tertiary: '#2A3F2A',
      },
      text: {
        primary: '#F0FDF4',
        secondary: '#BBF7D0',
        muted: '#86EFAC',
      },
      border: {
        primary: '#2A3F2A',
        secondary: '#4ADF4A',
      },
      status: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
    },
    gradient: 'from-green-500 to-emerald-600',
  },
};