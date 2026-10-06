import React from 'react';

export interface DotPlotValue {
  v: number;
  lo?: number;
  hi?: number;
  c?: string;
  note?: string;
}

export interface DotPlotSeries {
  name: string;
  color?: string;
  values: (number | DotPlotValue | null)[];
  missing?: Record<number, string>;
}

export interface DotPlotAxis {
  min: number;
  max: number;
  ticks: number[];
  label?: string;
  format?: 'percent' | 'percent1' | 'float2' | 'float3' | 'signed' | ((v: number) => string);
  log?: boolean;
}

export interface DotPlotProps {
  title?: string;
  subtitle?: string;
  rows: string[];
  rowHead?: string;
  metric?: string;
  labelW?: number;
  x: DotPlotAxis;
  series: DotPlotSeries[];
  legend?: boolean;
  legendItems?: [string, string][];
  band?: [number, number];
  refLine?: number;
  refLabel?: string;
  refAnchor?: 'start' | 'middle' | 'end';
  mean?: number;
  meanLabel?: string;
  stems?: boolean;
  stemBase?: number;
  valueLabels?: boolean;
  rowColors?: (string | null)[];
  rowH?: number;
  showDataTable?: boolean;
  ariaLabel?: string;
}

function formatValue(v: number, fmt?: DotPlotAxis['format']): string {
  if (typeof fmt === 'function') return fmt(v);
  if (fmt === 'percent') return `${Math.round(v * 100)}%`;
  if (fmt === 'percent1') return `${(v * 100).toFixed(1)}%`;
  if (fmt === 'float2') return v.toFixed(2);
  if (fmt === 'float3') return v.toFixed(3);
  if (fmt === 'signed') return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1);
  return String(v);
}

function mkScale(ax: DotPlotAxis, a: number, b: number): (v: number) => number {
  if (ax.log) {
    const l0 = Math.log10(ax.min);
    const l1 = Math.log10(ax.max);
    return (v: number) => a + ((Math.log10(Math.max(v, ax.min)) - l0) / (l1 - l0)) * (b - a);
  }
  return (v: number) => a + ((v - ax.min) / (ax.max - ax.min)) * (b - a);
}

export const DotPlot: React.FC<DotPlotProps> = ({
  title,
  subtitle,
  rows,
  rowHead = 'Row',
  metric = 'Value',
  labelW = 160,
  x,
  series,
  legend = false,
  legendItems,
  band,
  refLine,
  refLabel,
  refAnchor,
  mean,
  meanLabel,
  stems = false,
  stemBase,
  valueLabels = false,
  rowColors,
  rowH,
  showDataTable = true,
  ariaLabel,
}) => {
  const W = 700;
  const padR = valueLabels ? 54 : 20;
  const nS = series.length;
  const dodge = nS > 1 ? 11 : 0;
  const actualRowH = rowH || (nS > 1 ? 14 + nS * 11 : 30);
  const top = refLabel || meanLabel ? 24 : 12;
  const plotH = rows.length * actualRowH;
  const H = top + plotH + 28 + (x.label ? 20 : 0);

  const x0 = labelW + 12;
  const x1 = W - padR;
  const sx = mkScale(x, x0, x1);
  const yb = top + plotH;

  const defaultLegendItems: [string, string][] =
    legendItems ||
    (legend
      ? series.map((s, idx) => [s.color || `--s${idx % 4}`, s.name])
      : []);

  return (
    <div className="inkblot-chart-wrapper">
      {title && <p className="panel-title">{title}</p>}
      {subtitle && <p className="panel-sub">{subtitle}</p>}

      {defaultLegendItems.length > 0 && (
        <div className="legend">
          {defaultLegendItems.map(([color, name], idx) => (
            <span key={idx}>
              <i style={{ background: color.startsWith('--') ? `var(${color})` : color }} />
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="chart">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={ariaLabel || title || 'Dot plot chart'}
          style={{ width: '100%', height: 'auto' }}
        >
          {/* Shaded Band */}
          {band && (
            <rect
              x={sx(band[0])}
              y={top - 4}
              width={sx(band[1]) - sx(band[0])}
              height={plotH + 4}
              className="band"
            />
          )}

          {/* Grid lines and ticks */}
          {x.ticks.map((t, idx) => {
            const tx = sx(t);
            return (
              <g key={idx}>
                <line x1={tx} x2={tx} y1={top - 2} y2={yb} className="grid" />
                <text x={tx} y={yb + 15} className="tick" textAnchor="middle">
                  {formatValue(t, x.format)}
                </text>
              </g>
            );
          })}

          {/* Horizontal Axis line */}
          <line x1={x0} x2={x1} y1={yb} y2={yb} className="axis" />
          {x.label && (
            <text x={(x0 + x1) / 2} y={yb + 33} className="axlabel" textAnchor="middle">
              {x.label}
            </text>
          )}

          {/* Reference Line */}
          {refLine != null && (
            <g>
              <line x1={sx(refLine)} x2={sx(refLine)} y1={top - 6} y2={yb} className="ref" />
              {refLabel && (
                <text
                  x={
                    refAnchor === 'end'
                      ? sx(refLine) - 4
                      : refAnchor === 'middle'
                      ? sx(refLine)
                      : sx(refLine) + 4
                  }
                  y={top - 10}
                  className="reflabel"
                  textAnchor={refAnchor || (sx(refLine) > (x0 + x1) / 2 ? 'end' : 'start')}
                >
                  {refLabel}
                </text>
              )}
            </g>
          )}

          {/* Mean Line */}
          {mean != null && (
            <g>
              <line x1={sx(mean)} x2={sx(mean)} y1={top - 6} y2={yb} className="ref" />
              {meanLabel && (
                <text x={sx(mean) - 4} y={top - 10} className="reflabel" textAnchor="end">
                  {meanLabel}
                </text>
              )}
            </g>
          )}

          {/* Rows & Points */}
          {rows.map((rowLabel, i) => {
            const cy0 = top + i * actualRowH + actualRowH / 2;
            return (
              <g key={i}>
                <text x={labelW} y={cy0 + 4} className="rowlabel" textAnchor="end">
                  {rowLabel}
                </text>

                {series.map((s, j) => {
                  const raw = s.values[i];
                  const cy = cy0 + (j - (nS - 1) / 2) * dodge;

                  if (raw == null) {
                    if (s.missing && s.missing[i]) {
                      return (
                        <text key={j} x={x0 + 4} y={cy + 4} className="note">
                          {s.missing[i]}
                        </text>
                      );
                    }
                    return null;
                  }

                  const d: DotPlotValue = typeof raw === 'number' ? { v: raw } : raw;
                  const rowColor = rowColors && rowColors[i];
                  const color = (rowColor || d.c || s.color || `--s${j % 4}`);
                  const colorVar = color.startsWith('--') ? `var(${color})` : color;
                  const cx = sx(d.v);

                  const tooltipHtml = [
                    `<b>${rowLabel}</b>`,
                    nS > 1 ? `<br><span class="m">${s.name}</span>` : '',
                    `<br>${metric}: <b>${formatValue(d.v, x.format)}</b>`,
                    d.lo != null && d.hi != null
                      ? `<br><span class="m">95% interval ${formatValue(d.lo, x.format)} to ${formatValue(d.hi, x.format)}</span>`
                      : '',
                    d.note ? `<br><span class="m">${d.note}</span>` : '',
                  ].join('');

                  return (
                    <g key={j}>
                      {/* Stem */}
                      {stems && (
                        <line
                          x1={sx(stemBase != null ? stemBase : x.min)}
                          x2={cx}
                          y1={cy}
                          y2={cy}
                          className="stem"
                          style={{ stroke: colorVar }}
                        />
                      )}

                      {/* Error bar / CI */}
                      {d.lo != null && d.hi != null && (
                        <line
                          x1={sx(d.lo)}
                          x2={sx(d.hi)}
                          y1={cy}
                          y2={cy}
                          className="ci"
                          style={{ stroke: colorVar }}
                        />
                      )}

                      {/* Dot */}
                      <circle cx={cx} cy={cy} r={5} className="dot" style={{ fill: colorVar }} />

                      {/* Optional inline value label */}
                      {valueLabels && (
                        <text
                          x={(d.hi != null ? Math.max(sx(d.hi), cx) : cx) + 9}
                          y={cy + 4}
                          className="vlabel"
                        >
                          {formatValue(d.v, x.format)}
                        </text>
                      )}

                      {/* Interactive hover hit area */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        className="hit"
                        tabIndex={0}
                        data-tip={tooltipHtml}
                        aria-label={`${rowLabel}${nS > 1 ? ', ' + s.name : ''}: ${formatValue(d.v, x.format)}`}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Accessible data table fallback */}
      {showDataTable && (
        <details className="tv">
          <summary>Show data table</summary>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>{rowHead}</th>
                  {series.map((s, idx) => (
                    <React.Fragment key={idx}>
                      <th className="num">{series.length > 1 ? s.name : metric}</th>
                      {series.some((ss) => ss.values.some((v) => v && typeof v === 'object' && v.lo != null)) && (
                        <th className="num">95% interval</th>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r}</td>
                    {series.map((s, idx) => {
                      const raw = s.values[i];
                      const hasCI = series.some((ss) =>
                        ss.values.some((v) => v && typeof v === 'object' && v.lo != null)
                      );
                      if (raw == null) {
                        return (
                          <React.Fragment key={idx}>
                            <td className="num">{(s.missing && s.missing[i]) || '—'}</td>
                            {hasCI && <td className="num">—</td>}
                          </React.Fragment>
                        );
                      }
                      const d: DotPlotValue = typeof raw === 'number' ? { v: raw } : raw;
                      return (
                        <React.Fragment key={idx}>
                          <td className="num">{formatValue(d.v, x.format)}</td>
                          {hasCI && (
                            <td className="num">
                              {d.lo != null && d.hi != null
                                ? `${formatValue(d.lo, x.format)} to ${formatValue(d.hi, x.format)}`
                                : '—'}
                            </td>
                          )}
                        </React.Fragment>
                      );
                    })}
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
