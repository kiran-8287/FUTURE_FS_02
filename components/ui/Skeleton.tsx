import React from 'react';

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={style} />
    );
};

export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="border-b border-gray-200 p-4">
                    <div className="flex gap-4 items-center">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const SkeletonChart: React.FC = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-full" style={{ width: `${Math.random() * 50 + 30}%` }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
