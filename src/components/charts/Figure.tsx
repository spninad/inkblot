import React from 'react';

export interface LegendItem {
  color: string;
  label: string;
}

export interface FigureProps {
  id?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  legend?: LegendItem[] | boolean;
  caption?: React.ReactNode;
  sideBySide?: boolean;
  dataTable?: React.ReactNode;
  children: React.ReactNode;
}

export const Figure: React.FC<FigureProps> = ({
  id,
  title,
  subtitle,
  legend,
  caption,
  sideBySide = false,
  dataTable,
  children,
}) => {
  return (
    <figure id={id}>
      {(title || subtitle) && (
        <div className="fig-head">
          {title && <b>{title} </b>}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}

      {Array.isArray(legend) && legend.length > 0 && (
        <div className="legend">
          {legend.map((item, idx) => (
            <span key={idx}>
              <i style={{ background: item.color.startsWith('--') ? `var(${item.color})` : item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )}

      <div className={`panels ${sideBySide ? 'side' : ''}`.trim()}>{children}</div>

      {caption && <figcaption>{caption}</figcaption>}

      {dataTable && (
        <details className="tv">
          <summary>Show data table</summary>
          {dataTable}
        </details>
      )}
    </figure>
  );
};
