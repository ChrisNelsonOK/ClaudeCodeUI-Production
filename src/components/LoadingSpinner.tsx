import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    white: 'text-white'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeDasharray="31.416" 
          strokeDashoffset="31.416"
          className="animate-spin-slow opacity-30"
        />
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeDasharray="31.416" 
          strokeDashoffset="15.708"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;