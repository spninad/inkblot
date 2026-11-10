import React from 'react';
import { Button } from '../../ui/button.js';

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
  const generatedId = React.useId();
  const containerId = id || `inkblot-3d-${generatedId}`;
  const dataPayload = data ? JSON.stringify(data) : '';

  return (
    <figure className={`inkblot-3d-figure ${className}`.trim()}>
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
          borderRadius: 'var(--card-radius)',
          overflow: 'hidden',
          border: 0,
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
          <div>Drag to rotate • Ctrl + scroll to zoom</div>
        </div>

        {/* Floating control buttons */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="inkblot-3d-btn"
            data-3d-action="rotate"
            title="Toggle Auto-Rotation"
          >
            Auto-Rotate
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="inkblot-3d-btn"
            data-3d-action="reset"
            title="Reset Camera"
          >
            Reset
          </Button>
        </div>
      </div>

      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};
