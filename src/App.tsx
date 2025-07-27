import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import CommandPalette from './components/CommandPalette';
import AccessibilityHelper from './components/AccessibilityHelper';
import Sidebar from './components/Sidebar';
import ConversationSidebar from './components/ConversationSidebar';
import MainContent from './components/MainContent';
import FlyoutPanel from './components/FlyoutPanel';
import NotificationSystem from './components/NotificationSystem';
import { AppProvider } from './context/AppContext';
import { useTheme } from './hooks/useTheme';
import { useGlobalShortcuts } from './hooks/useKeyboardShortcuts';
import { usePerformanceMonitor, logPageLoad } from './hooks/usePerformanceMonitor';
import { storage } from './utils/storage';

const AppContent: React.FC = () => {
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const [showConversations, setShowConversations] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { applyTheme, currentThemeId } = useTheme();
  const { getMetrics } = usePerformanceMonitor('App');

  // Apply theme on mount and when theme changes
  React.useEffect(() => {
    applyTheme(currentThemeId);
  }, [currentThemeId, applyTheme]);

  // Initialize global shortcuts
  useGlobalShortcuts();

  // Handle custom events
  React.useEffect(() => {
    const handleNewChat = () => {
      // Implementation would trigger new chat in chat system
      console.log('New chat triggered');
    };

    const handleCommandPalette = () => {
      setShowCommandPalette(true);
    };

    const handleOpenSettings = () => {
      setActiveFlyout('settings');
    };

    const handleOpenPanel = (event: CustomEvent) => {
      setActiveFlyout(event.detail);
    };

    const handleEscapePressed = () => {
      if (showCommandPalette) {
        setShowCommandPalette(false);
      } else if (activeFlyout) {
        setActiveFlyout(null);
      }
    };

    document.addEventListener('new-chat', handleNewChat);
    document.addEventListener('command-palette', handleCommandPalette);
    document.addEventListener('open-settings', handleOpenSettings);
    document.addEventListener('open-panel', handleOpenPanel as EventListener);
    document.addEventListener('escape-pressed', handleEscapePressed);

    return () => {
      document.removeEventListener('new-chat', handleNewChat);
      document.removeEventListener('command-palette', handleCommandPalette);
      document.removeEventListener('open-settings', handleOpenSettings);
      document.removeEventListener('open-panel', handleOpenPanel as EventListener);
      document.removeEventListener('escape-pressed', handleEscapePressed);
    };
  }, [showCommandPalette, activeFlyout]);

  // Initialize performance monitoring
  React.useEffect(() => {
    logPageLoad();
    
    // Log performance metrics every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const metrics = getMetrics();
        console.log('Performance Metrics:', metrics);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [getMetrics]);
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden transition-all duration-300" id="main-content" tabIndex={-1}>
      <AccessibilityHelper />
      <div className="flex h-screen">
        <Sidebar 
          onOpenFlyout={setActiveFlyout} 
          onToggleConversations={() => setShowConversations(!showConversations)}
          showConversations={showConversations}
        />
        {showConversations && <ConversationSidebar />}
        <MainContent onOpenFlyout={setActiveFlyout} />
        <FlyoutPanel 
          isOpen={!!activeFlyout} 
          type={activeFlyout} 
          onClose={() => setActiveFlyout(null)} 
        />
      </div>
      
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
      />
      
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <NotificationSystem />
    </div>
  );
};

function App() {

  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;