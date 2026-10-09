import React from 'react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string; // CSS color or variable e.g. '--s1'
  showEndpoints?: boolean;
  showMinMax?: boolean;
  highlightLast?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 64,
  height = 16,
  color = '--s1',
  showEndpoints = false,
  showMinMax = false,
  highlightLast = true,
  className = '',
  ariaLabel,
}) => {
  if (!data || data.length < 2) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padX = 2;
  const padY = 2;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const points = data.map((val, idx) => {
    const x = padX + (idx / (data.length - 1)) * plotW;
    const y = height - padY - ((val - min) / range) * plotH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polylinePts = points.join(' ');
  const lastX = padX + plotW;
  const lastY = height - padY - ((data[data.length - 1] - min) / range) * plotH;
  const firstX = padX;
  const firstY = height - padY - ((data[0] - min) / range) * plotH;

  const strokeColor = color.startsWith('--') ? `var(${color})` : color;

  return (
    <span
      className={`inkblot-sparkline-wrap ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        marginInline: '4px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel || `Sparkline trend: ${data[0]} to ${data[data.length - 1]}`}
        style={{ display: 'inline-block', overflow: 'visible' }}
      >
        <polyline
          points={polylinePts}
          style={{
            fill: 'none',
            stroke: strokeColor,
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        />

        {showEndpoints && (
          <circle cx={firstX} cy={firstY} r={2} style={{ fill: strokeColor }} />
        )}

        {highlightLast && (
          <circle cx={lastX} cy={lastY} r={2.5} style={{ fill: 'var(--s2)' }} />
        )}
      </svg>
    </span>
  );
};
