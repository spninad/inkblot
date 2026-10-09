import React from 'react';
import katex from 'katex';

export interface EquationProps {
  math?: string;
  caption?: React.ReactNode;
  display?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Equation: React.FC<EquationProps> = ({
  math,
  caption,
  display = true,
  children,
  className = '',
}) => {
  if (math) {
    try {
      const html = katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
      });
      return (
        <div className={`eq ${className}`.trim()}>
          <div className="eq-body" dangerouslySetInnerHTML={{ __html: html }} />
          {caption && <div className="eq-caption">{caption}</div>}
        </div>
      );
    } catch {
      // Fallback if KaTeX fails
      return (
        <div className={`eq ${className}`.trim()}>
          <div className="eq-body">{math}</div>
          {caption && <div className="eq-caption">{caption}</div>}
        </div>
      );
    }
  }

  return (
    <div className={`eq ${className}`.trim()}>
      <div className="eq-body">{children}</div>
      {caption && <div className="eq-caption">{caption}</div>}
    </div>
  );
};
