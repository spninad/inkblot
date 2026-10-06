import React from 'react';
import katex from 'katex';

export interface EquationProps {
  math?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Equation: React.FC<EquationProps> = ({
  math,
  children,
  className = '',
}) => {
  if (math) {
    try {
      const html = katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
      });
      return (
        <div
          className={`eq ${className}`.trim()}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      // Fallback if KaTeX fails
      return <div className={`eq ${className}`.trim()}>{math}</div>;
    }
  }

  return <div className={`eq ${className}`.trim()}>{children}</div>;
};
