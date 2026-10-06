import React from 'react';

export interface XYPlotAxis {
  min: number;
  max: number;
  ticks: number[];
  label?: string;
  format?: 'percent' | 'float1' | 'float2' | ((v: number) => string);
  tfmt?: (v: number) => string;
  log?: boolean;
}

export interface XYPoint {
  x: number;
  y: number;
  name?: string;
  label?: string;
  dx?: number;
  dy?: number;
  anchor?: 'start' | 'middle' | 'end';
  color?: string;
}

export interface XYPlotProps {
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
  x: XYPlotAxis;
  y: XYPlotAxis;
  points: XYPoint[];
  extra?: XYPoint[];
  connectPoints?: boolean;
  legendItems?: [string, string][];
  showDataTable?: boolean;
}

function formatAxis(v: number, fmt?: XYPlotAxis['format']): string {
  if (typeof fmt === 'function') return fmt(v);
  if (fmt === 'percent') return `${v}%`;
  if (fmt === 'float1') return v.toFixed(1);
  if (fmt === 'float2') return v.toFixed(2);
  return String(v);
}

function mkScale(ax: XYPlotAxis, a: number, b: number): (v: number) => number {
  if (ax.log) {
    const l0 = Math.log10(ax.min);
    const l1 = Math.log10(ax.max);
    return (v: number) => a + ((Math.log10(Math.max(v, ax.min)) - l0) / (l1 - l0)) * (b - a);
  }
  return (v: number) => a + ((v - ax.min) / (ax.max - ax.min)) * (b - a);
}

export const XYPlot: React.FC<XYPlotProps> = ({
  title,
  subtitle,
  ariaLabel,
  x,
  y,
  points,
  extra = [],
  connectPoints = true,
  legendItems,
  showDataTable = true,
}) => {
  const W = 600;
  const H = 300;
  const m = { l: 56, r: 24, t: 24, b: 48 };

  const sx = mkScale(x, m.l, W - m.r);
  const sy = mkScale(y, H - m.b, m.t);

  const allPoints = [
    ...points.map((p) => ({ ...p, color: p.color || '--s1' })),
    ...extra.map((p) => ({ ...p, color: p.color || '--s2' })),
  ];

  const polylinePts = points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ');

  return (
    <div className="inkblot-chart-wrapper">
      {title && <p className="panel-title">{title}</p>}
      {subtitle && <p className="panel-sub">{subtitle}</p>}

      {legendItems && legendItems.length > 0 && (
        <div className="legend">
          {legendItems.map(([color, label], idx) => (
            <span key={idx}>
              <i style={{ background: color.startsWith('--') ? `var(${color})` : color }} />
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="chart">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={ariaLabel || title || 'XY plot'}
          style={{ width: '100%', height: 'auto' }}
        >
          {/* Y Grid lines and ticks */}
          {y.ticks.map((t, idx) => {
            const py = sy(t);
            return (
              <g key={idx}>
                <line x1={m.l} x2={W - m.r} y1={py} y2={py} className="grid" />
                <text x={m.l - 8} y={py + 4} className="tick" textAnchor="end">
                  {formatAxis(t, y.format)}
                </text>
              </g>
            );
          })}

          {/* X Grid lines and ticks */}
          {x.ticks.map((t, idx) => {
            const px = sx(t);
            return (
              <g key={idx}>
                <line x1={px} x2={px} y1={m.t} y2={H - m.b} className="grid" />
                <text x={px} y={H - m.b + 16} className="tick" textAnchor="middle">
                  {formatAxis(t, x.format)}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} className="axis" />
          <line x1={m.l} x2={m.l} y1={m.t} y2={H - m.b} className="axis" />

          {/* X axis label */}
          {x.label && (
            <text x={(m.l + W - m.r) / 2} y={H - 8} className="axlabel" textAnchor="middle">
              {x.label}
            </text>
          )}

          {/* Y axis label */}
          {y.label && (
            <text
              x={14}
              y={(m.t + H - m.b) / 2}
              className="axlabel"
              textAnchor="middle"
              transform={`rotate(-90 14 ${(m.t + H - m.b) / 2})`}
            >
              {y.label}
            </text>
          )}

          {/* Polyline */}
          {connectPoints && points.length > 1 && (
            <polyline
              points={polylinePts}
              style={{
                fill: 'none',
                stroke: 'var(--s1)',
                strokeWidth: 2,
                strokeLinejoin: 'round',
                strokeLinecap: 'round',
              }}
            />
          )}

          {/* Points */}
          {allPoints.map((p, idx) => {
            const cx = sx(p.x);
            const cy = sy(p.y);
            const colorVar = p.color.startsWith('--') ? `var(${p.color})` : p.color;
            const dx = p.dx != null ? p.dx : 10;
            const dy = p.dy != null ? p.dy : -8;
            const pointName = p.name || p.label || `Point ${idx + 1}`;

            const tipHtml = [
              `<b>${pointName}</b>`,
              x.label ? `<br>${x.label}: <b>${formatAxis(p.x, x.tfmt || x.format)}</b>` : '',
              y.label ? `<br>${y.label}: <b>${formatAxis(p.y, y.tfmt || y.format)}</b>` : '',
            ].join('');

            return (
              <g key={idx}>
                <circle cx={cx} cy={cy} r={5} className="dot" style={{ fill: colorVar }} />
                {p.label && (
                  <text
                    x={cx + dx}
                    y={cy + dy}
                    className="vlabel"
                    textAnchor={p.anchor || 'start'}
                  >
                    {p.label}
                  </text>
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={12}
                  className="hit"
                  tabIndex={0}
                  data-tip={tipHtml}
                  aria-label={`${pointName}: ${p.x}, ${p.y}`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {showDataTable && (
        <details className="tv">
          <summary>Show data table</summary>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Setting</th>
                  <th className="num">{x.label || 'X'}</th>
                  <th className="num">{y.label || 'Y'}</th>
                </tr>
              </thead>
              <tbody>
                {allPoints.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.name || p.label || `Point ${idx + 1}`}</td>
                    <td className="num">{formatAxis(p.x, x.tfmt || x.format)}</td>
                    <td className="num">{formatAxis(p.y, y.tfmt || y.format)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
};
