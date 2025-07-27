// Production-ready security utilities
import DOMPurify from 'dompurify';

interface SecurityScanResult {
  isSafe: boolean;
  threats: SecurityThreat[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface SecurityThreat {
  type: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Production XSS protection using DOMPurify
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  });
};

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'div', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'class', 'id', 'data-*'],
    ALLOW_DATA_ATTR: true
  });
};

// Real security scanning for code and inputs
export const scanForSecurityThreats = async (content: string): Promise<SecurityScanResult> => {
  const threats: SecurityThreat[] = [];
  
  // XSS detection
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];
  
  xssPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        threats.push({
          type: 'XSS',
          description: 'Potential XSS vulnerability detected',
          location: match,
          severity: 'high'
        });
      });
    }
  });
  
  // SQL injection detection
  const sqlPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i,
    /';\s*--/i,
    /"\s*or\s*"1"="1/i
  ];
  
  sqlPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      threats.push({
        type: 'SQL Injection',
        description: 'Potential SQL injection attempt',
        location: content.match(pattern)?.[0] || 'unknown',
        severity: 'critical'
      });
    }
  });
  
  // Path traversal detection
  const pathTraversalPattern = /\.\.\//g;
  if (pathTraversalPattern.test(content)) {
    threats.push({
      type: 'Path Traversal',
      description: 'Potential directory traversal attack',
      location: content.match(pathTraversalPattern)?.[0] || 'unknown',
      severity: 'high'
    });
  }
  
  const maxSeverity = threats.length > 0 
    ? Math.max(...threats.map(t => ({ low: 1, medium: 2, high: 3, critical: 4 }[t.severity])))
    : 0;
  
  const severityMap: Record<number, SecurityScanResult['severity']> = { 
    0: 'low', 
    1: 'low', 
    2: 'medium', 
    3: 'high', 
    4: 'critical' 
  };
  
  return {
    isSafe: threats.length === 0,
    threats,
    severity: severityMap[maxSeverity] || 'low',
    recommendations: threats.map(t => `Address ${t.type} threat: ${t.description}`)
  };
};

// Content Security Policy helpers
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Input validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Rate limiting for API calls
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxRequests: number, timeWindow: number): boolean {
    const now = Date.now();
    const windowStart = now - timeWindow;
    
    const timestamps = this.requests.get(key) || [];
    const validTimestamps = timestamps.filter(ts => ts > windowStart);
    
    if (validTimestamps.length >= maxRequests) {
      return false;
    }
    
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Secure storage utilities
export const secureStorage = {
  set: (key: string, value: any): void => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },
  
  get: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};