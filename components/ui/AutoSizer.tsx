import React, { useRef, useState, useEffect } from 'react';

interface Size {
    width: number;
    height: number;
}

interface AutoSizerProps {
    children: (size: Size) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const AutoSizer: React.FC<AutoSizerProps> = ({ children, className, style }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Use contentRect or contentBoxSize to get precise dimensions
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            }
        });

        resizeObserver.observe(containerRef.current);

        // Initial measure
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}>
            {/* 
        Only render children when we have a valid size to prevent initial 0-size render issues 
        with some virtualization libraries, although react-window usually handles 0 gracefully.
      */}
            {size.width > 0 && size.height > 0 && children(size)}
        </div>
    );
};
