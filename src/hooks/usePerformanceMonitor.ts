import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  bundleSize: number;
  networkLatency: number;
  apiResponseTime: number;
  domContentLoaded: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

interface RealTimeMetrics {
  timestamp: number;
  memoryUsage: number;
  fps: number;
  cpuUsage: number;
  networkRequests: number;
  errors: number;
  warnings: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const { addNotification } = useApp();
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      
      // Send real performance data to backend
      if (renderTime > 16) {
        fetch(`${API_BASE_URL}/performance/render`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            component: componentName,
            renderTime,
            timestamp: Date.now(),
            memoryUsage: getMemoryUsage(),
            userAgent: navigator.userAgent
          })
        });
      }
    };
  }, [componentName]);

  const getMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    return 0;
  };

  const measureWebVitals = () => {
    if (!observerRef.current) {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const metrics = {
            name: entry.name,
            value: entry.startTime || entry.duration,
            timestamp: Date.now()
          };
          
          // Send to backend for analysis
          fetch(`${API_BASE_URL}/performance/web-vitals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metrics)
          });
        });
      });
      
      observerRef.current.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  };

  const collectRealTimeMetrics = async () => {
    const metrics: RealTimeMetrics = {
      timestamp: Date.now(),
      memoryUsage: getMemoryUsage(),
      fps: await getFPS(),
      cpuUsage: await getCPUUsage(),
      networkRequests: performance.getEntriesByType('resource').length,
      errors: 0,
      warnings: 0
    };

    setRealTimeMetrics(prev => [...prev.slice(-99), metrics]);

    // Send to backend
    fetch(`${API_BASE_URL}/performance/realtime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    });
  };

  const getFPS = (): Promise<number> => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let startTime = performance.now();
      
      const measureFrame = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - startTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - startTime));
          resolve(fps);
        } else {
          requestAnimationFrame(measureFrame);
        }
      };
      
      requestAnimationFrame(measureFrame);
    });
  };

  const getCPUUsage = async (): Promise<number> => {
    if ('cpu' in navigator) {
      const cpu = (navigator as any).cpu;
      if (cpu && cpu.usage) {
        return cpu.usage();
      }
    }
    return 0;
  };

  const measureMemoryUsage = async () => {
    const memoryUsage = getMemoryUsage();
    
    if (memoryUsage > 100) {
      addNotification({
        type: 'warning',
        title: 'High Memory Usage',
        message: `Memory usage: ${memoryUsage.toFixed(1)}MB`,
        duration: 5000
      });
    }

    // Send memory metrics to backend
    fetch(`${API_BASE_URL}/performance/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memoryUsage,
        timestamp: Date.now(),
        component: componentName
      })
    });
  };

  const measureFPS = () => {
    let frames = 0;
    let startTime = performance.now();
    
    const countFrames = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - startTime >= 1000) {
        metricsRef.current.fps = frames;
        frames = 0;
        startTime = currentTime;
        
        // Warn if FPS is low
        if (metricsRef.current.fps < 30) {
          console.warn(`Low FPS detected: ${metricsRef.current.fps}`);
        }
      }
      
      requestAnimationFrame(countFrames);
    };
    
    requestAnimationFrame(countFrames);
  };

  const getMetrics = (): PerformanceMetrics => {
    measureMemoryUsage();
    return { ...metricsRef.current };
  };

  useEffect(() => {
    measureFPS();
  }, []);

  return { getMetrics };
};

// Global performance utilities
export const logPageLoad = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
        };
        
        console.log('Page Load Metrics:', metrics);
        
        // Log slow page loads
        if (metrics.totalLoadTime > 3000) {
          console.warn(`Slow page load: ${metrics.totalLoadTime}ms`);
        }
      }, 0);
    });
  }
};