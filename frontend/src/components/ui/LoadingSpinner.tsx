import React from 'react';
import { cn } from '../../utils';

interface LoadingSpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size = 'sm' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
    };

    return (
        <div
            className={cn(
                "border-white/30 border-t-white rounded-full animate-spin",
                sizeClasses[size],
                className
            )}
        />
    );
};

export default LoadingSpinner;