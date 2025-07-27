import { useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const { addNotification } = useApp();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
      const shiftMatch = !!shortcut.shift === event.shiftKey;
      const altMatch = !!shortcut.alt === event.altKey;
      const metaMatch = !!shortcut.meta === event.metaKey;

      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const showShortcutsHelp = useCallback(() => {
    const helpText = shortcuts
      .reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) acc[shortcut.category] = [];
        acc[shortcut.category].push(shortcut);
        return acc;
      }, {} as Record<string, ShortcutConfig[]>);

    // Create help content
    let content = 'Keyboard Shortcuts:\n\n';
    Object.entries(helpText).forEach(([category, categoryShortcuts]) => {
      content += `${category}:\n`;
      categoryShortcuts.forEach(shortcut => {
        const keys = [];
        if (shortcut.ctrl) keys.push('Ctrl');
        if (shortcut.meta) keys.push('Cmd');
        if (shortcut.shift) keys.push('Shift');
        if (shortcut.alt) keys.push('Alt');
        keys.push(shortcut.key.toUpperCase());
        content += `  ${keys.join(' + ')}: ${shortcut.description}\n`;
      });
      content += '\n';
    });

    addNotification({
      type: 'info',
      title: 'Keyboard Shortcuts',
      message: content,
      duration: 10000
    });
  }, [shortcuts, addNotification]);

  return { showShortcutsHelp };
};

// Global shortcuts hook
export const useGlobalShortcuts = () => {
  const { addNotification } = useApp();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'n',
      ctrl: true,
      action: () => {
        // Trigger new chat
        const event = new CustomEvent('new-chat');
        document.dispatchEvent(event);
      },
      description: 'New chat',
      category: 'Chat'
    },
    {
      key: 'k',
      ctrl: true,
      action: () => {
        // Trigger command palette
        const event = new CustomEvent('command-palette');
        document.dispatchEvent(event);
      },
      description: 'Command palette',
      category: 'Navigation'
    },
    {
      key: ',',
      ctrl: true,
      action: () => {
        // Open settings
        const event = new CustomEvent('open-settings');
        document.dispatchEvent(event);
      },
      description: 'Settings',
      category: 'Navigation'
    },
    {
      key: 'f',
      ctrl: true,
      action: () => {
        // Focus search
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      },
      description: 'Focus search',
      category: 'Navigation'
    },
    {
      key: 'Escape',
      action: () => {
        // Close modals/panels
        const event = new CustomEvent('escape-pressed');
        document.dispatchEvent(event);
      },
      description: 'Close modals/panels',
      category: 'Navigation'
    },
    {
      key: '?',
      shift: true,
      action: () => {
        addNotification({
          type: 'info',
          title: 'Keyboard Shortcuts',
          message: 'Press Ctrl+K for command palette, Ctrl+N for new chat, Ctrl+, for settings',
          duration: 5000
        });
      },
      description: 'Show help',
      category: 'Help'
    }
  ];

  useKeyboardShortcuts(shortcuts);
};