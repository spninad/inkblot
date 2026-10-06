import React from 'react';

export interface DiagramProps {
  viewBox?: string;
  minWidth?: number | string;
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const Diagram: React.FC<DiagramProps> = ({
  viewBox = '0 0 780 320',
  minWidth = 640,
  ariaLabel = 'Architecture diagram',
  children,
  className = '',
}) => {
  return (
    <div className={`diagram ${className}`.trim()}>
      <svg
        viewBox={viewBox}
        role="img"
        aria-label={ariaLabel}
        style={{ minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }}
      >
        <defs>
          <marker
            id="ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" className="dg-arrow" />
          </marker>
          <marker
            id="aha"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" className="dg-arrow-accent" />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
};
