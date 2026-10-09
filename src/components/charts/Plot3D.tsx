import React from 'react';

export interface Plot3DProps {
  id?: string;
  type?: 'loss-surface' | 'latent-manifold';
  title?: string;
  subtitle?: string;
  caption?: string;
  height?: number;
  width?: string | number;
  data?: any;
  className?: string;
}

export const Plot3D: React.FC<Plot3DProps> = ({
  id,
  type = 'loss-surface',
  title,
  subtitle,
  caption,
  height = 420,
  width = '100%',
  data,
  className = '',
}) => {
  const containerId = id || `inkblot-3d-${Math.random().toString(36).slice(2, 8)}`;
  const dataPayload = data ? JSON.stringify(data) : '';

  return (
    <figure className={`inkblot-3d-figure ${className}`.trim()} style={{ margin: '32px 0' }}>
      {(title || subtitle) && (
        <div className="fig-head">
          {title && <b>{title} </b>}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}

      <div
        id={containerId}
        className="inkblot-3d-canvas-wrap"
        data-plot3d={type}
        data-plot3d-payload={dataPayload}
        style={{
          width,
          height: `${height}px`,
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--rule-strong)',
          background: 'var(--surface)',
        }}
      >
        <div
          className="inkblot-3d-fallback"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
            fontFamily: 'var(--sans)',
            fontSize: '13px',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
            Interactive 3D {type === 'loss-surface' ? 'Loss Landscape' : 'Latent Manifold'}
          </div>
          <div>Drag to rotate • Scroll to zoom</div>
        </div>

        {/* Floating control buttons */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <button
            type="button"
            className="inkblot-3d-btn"
            data-3d-action="rotate"
            title="Toggle Auto-Rotation"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--rule)',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: 'var(--sans)',
              color: 'var(--ink-2)',
              cursor: 'pointer',
            }}
          >
            Auto-Rotate
          </button>
          <button
            type="button"
            className="inkblot-3d-btn"
            data-3d-action="reset"
            title="Reset Camera"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--rule)',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: 'var(--sans)',
              color: 'var(--ink-2)',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};
