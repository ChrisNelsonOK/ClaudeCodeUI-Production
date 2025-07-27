import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { themes } from '../types/theme';

export const useTheme = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTheme must be used within an AppProvider');
  }

  const { theme: currentThemeId, setTheme } = context;
  const currentTheme = themes[currentThemeId] || themes['dark-pro'];

  const applyTheme = (themeId: string) => {
    const theme = themes[themeId];
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    
    root.style.setProperty('--bg-primary', theme.colors.background.primary);
    root.style.setProperty('--bg-secondary', theme.colors.background.secondary);
    root.style.setProperty('--bg-tertiary', theme.colors.background.tertiary);
    
    root.style.setProperty('--text-primary', theme.colors.text.primary);
    root.style.setProperty('--text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--text-muted', theme.colors.text.muted);
    
    root.style.setProperty('--border-primary', theme.colors.border.primary);
    root.style.setProperty('--border-secondary', theme.colors.border.secondary);
    
    root.style.setProperty('--status-success', theme.colors.status.success);
    root.style.setProperty('--status-warning', theme.colors.status.warning);
    root.style.setProperty('--status-error', theme.colors.status.error);
    root.style.setProperty('--status-info', theme.colors.status.info);

    setTheme(themeId);
    localStorage.setItem('claude-theme', themeId);
  };

  return {
    currentTheme,
    currentThemeId,
    themes,
    applyTheme,
  };
};