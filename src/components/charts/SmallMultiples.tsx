import React from 'react';

export interface MicroChartPanel {
  title: string;
  subtitle?: string;
  data: number[];
  color?: string;
  highlight?: boolean;
}

export interface SmallMultiplesProps {
  title?: string;
  subtitle?: string;
  panels: MicroChartPanel[];
  columns?: number;
  yMin?: number;
  yMax?: number;
  height?: number;
  className?: string;
}

export const SmallMultiples: React.FC<SmallMultiplesProps> = ({
  title,
  subtitle,
  panels,
  columns = 3,
  yMin,
  yMax,
  height = 90,
  className = '',
}) => {
  const allVals = panels.flatMap((p) => p.data);
  const actualMin = yMin != null ? yMin : Math.min(...allVals);
  const actualMax = yMax != null ? yMax : Math.max(...allVals);
  const range = actualMax - actualMin || 1;

  return (
    <div className={`inkblot-small-multiples ${className}`.trim()} style={{ margin: '24px 0' }}>
      {title && <p className="panel-title">{title}</p>}
      {subtitle && <p className="panel-sub">{subtitle}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
          gap: '16px',
          marginTop: '12px',
        }}
      >
        {panels.map((p, idx) => {
          const strokeColor = p.color
            ? p.color.startsWith('--')
              ? `var(${p.color})`
              : p.color
            : p.highlight
            ? 'var(--s1)'
            : 'var(--ink-2)';
          const padY = 8;
          const plotH = height - padY * 2;
          const width = 200;

          const points = p.data.map((val, dIdx) => {
            const x = 8 + (dIdx / (p.data.length - 1)) * (width - 16);
            const y = height - padY - ((val - actualMin) / range) * plotH;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          });

          return (
            <div
              key={idx}
              style={{
                border: '1px solid var(--rule)',
                borderRadius: '6px',
                padding: '10px 12px',
                background: 'var(--surface)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                  {p.title}
                </span>
                {p.subtitle && (
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {p.subtitle}
                  </span>
                )}
              </div>

              <svg
                viewBox={`0 0 ${width} ${height}`}
                style={{ width: '100%', height: 'auto', display: 'block', marginTop: '4px' }}
                role="img"
                aria-label={`Trend for ${p.title}`}
              >
                {/* Baseline reference */}
                <line
                  x1={8}
                  x2={width - 8}
                  y1={height - padY}
                  y2={height - padY}
                  style={{ stroke: 'var(--rule)', strokeWidth: 1 }}
                />

                {/* Micro trend curve */}
                <polyline
                  points={points.join(' ')}
                  style={{
                    fill: 'none',
                    stroke: strokeColor,
                    strokeWidth: p.highlight ? 2 : 1.5,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                  }}
                />

                {/* End dot */}
                {p.data.length > 0 && (
                  <circle
                    cx={8 + (width - 16)}
                    cy={height - padY - ((p.data[p.data.length - 1] - actualMin) / range) * plotH}
                    r={p.highlight ? 3 : 2}
                    style={{ fill: strokeColor }}
                  />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
