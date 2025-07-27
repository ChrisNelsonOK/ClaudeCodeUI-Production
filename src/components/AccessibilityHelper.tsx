import React, { useEffect } from 'react';

const AccessibilityHelper: React.FC = () => {
  useEffect(() => {
    // Skip links for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management
    const handleRouteChange = () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    };

    // Announce page changes to screen readers
    const announcePageChange = (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Listen for custom events to announce changes
    const handleAnnouncement = (event: CustomEvent) => {
      announcePageChange(event.detail.message);
    };

    document.addEventListener('announce', handleAnnouncement as EventListener);
    document.addEventListener('route-change', handleRouteChange);

    // High contrast mode detection
    const checkHighContrast = () => {
      const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      document.documentElement.classList.toggle('high-contrast', isHighContrast);
    };

    checkHighContrast();
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', checkHighContrast);

    // Reduced motion preference
    const checkReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion);
    };

    checkReducedMotion();
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkReducedMotion);

    return () => {
      document.removeEventListener('announce', handleAnnouncement as EventListener);
      document.removeEventListener('route-change', handleRouteChange);
    };
  }, []);

  return null;
};

export default AccessibilityHelper;