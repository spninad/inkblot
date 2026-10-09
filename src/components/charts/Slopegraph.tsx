import React from 'react';

export interface SlopegraphItem {
  label: string;
  leftVal: number;
  rightVal: number;
  color?: string;
  highlight?: boolean;
}

export interface SlopegraphProps {
  title?: string;
  subtitle?: string;
  leftLabel: string;
  rightLabel: string;
  items: SlopegraphItem[];
  valueFormat?: (val: number) => string;
  height?: number;
  width?: number;
  className?: string;
}

export const Slopegraph: React.FC<SlopegraphProps> = ({
  title,
  subtitle,
  leftLabel,
  rightLabel,
  items,
  valueFormat = (v) => `${(v * 100).toFixed(1)}%`,
  height = 380,
  width = 640,
  className = '',
}) => {
  const allVals = items.flatMap((i) => [i.leftVal, i.rightVal]);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const valRange = maxVal - minVal || 1;

  const topPad = 52;
  const bottomPad = 28;
  const leftX = 180;
  const rightX = width - 180;
  const plotH = height - topPad - bottomPad;

  const getY = (val: number) => {
    return height - bottomPad - ((val - minVal) / valRange) * plotH;
  };

  return (
    <div className={`inkblot-slopegraph-wrap ${className}`.trim()}>
      {title && <p className="panel-title">{title}</p>}
      {subtitle && <p className="panel-sub">{subtitle}</p>}

      <div className="chart" style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: '460px', height: 'auto', display: 'block' }}
          role="img"
          aria-label={title || 'Slopegraph comparison'}
        >
          {/* Column Headers */}
          <text
            x={leftX}
            y={topPad - 16}
            className="rowlabel"
            textAnchor="end"
            style={{ fontWeight: 600, fill: 'var(--ink)' }}
          >
            {leftLabel}
          </text>
          <text
            x={rightX}
            y={topPad - 16}
            className="rowlabel"
            textAnchor="start"
            style={{ fontWeight: 600, fill: 'var(--ink)' }}
          >
            {rightLabel}
          </text>

          {/* Guide Vertical Rules */}
          <line
            x1={leftX}
            x2={leftX}
            y1={topPad - 8}
            y2={height - bottomPad}
            style={{ stroke: 'var(--rule)', strokeWidth: 1 }}
          />
          <line
            x1={rightX}
            x2={rightX}
            y1={topPad - 8}
            y2={height - bottomPad}
            style={{ stroke: 'var(--rule)', strokeWidth: 1 }}
          />

          {/* Slopes & Labels */}
          {items.map((item, idx) => {
            const y1 = getY(item.leftVal);
            const y2 = getY(item.rightVal);
            const isHl = item.highlight;
            const strokeColor = item.color
              ? item.color.startsWith('--')
                ? `var(${item.color})`
                : item.color
              : isHl
              ? 'var(--s1)'
              : 'var(--rule-strong)';
            const strokeWidth = isHl ? 2.5 : 1.2;
            const opacity = isHl ? 1 : 0.6;
            const textColor = isHl ? 'var(--ink)' : 'var(--muted)';
            const fontWeight = isHl ? 600 : 400;

            return (
              <g key={idx} opacity={opacity}>
                {/* Connecting Line */}
                <line
                  x1={leftX}
                  y1={y1}
                  x2={rightX}
                  y2={y2}
                  style={{
                    stroke: strokeColor,
                    strokeWidth,
                    strokeLinecap: 'round',
                  }}
                />

                {/* Left Dot & Label */}
                <circle cx={leftX} cy={y1} r={isHl ? 4 : 2.5} style={{ fill: strokeColor }} />
                <text
                  x={leftX - 10}
                  y={y1 + 4}
                  className="vlabel"
                  textAnchor="end"
                  style={{ fill: textColor, fontWeight }}
                >
                  {item.label} <tspan style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{valueFormat(item.leftVal)}</tspan>
                </text>

                {/* Right Dot & Label */}
                <circle cx={rightX} cy={y2} r={isHl ? 4 : 2.5} style={{ fill: strokeColor }} />
                <text
                  x={rightX + 10}
                  y={y2 + 4}
                  className="vlabel"
                  textAnchor="start"
                  style={{ fill: textColor, fontWeight }}
                >
                  <tspan style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{valueFormat(item.rightVal)}</tspan> {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
