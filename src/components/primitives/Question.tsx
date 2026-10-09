import React from 'react';

export interface QuestionProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Question: React.FC<QuestionProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`question ${className}`.trim()}>
      {title && (
        <div className="question-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>{title}</span>
        </div>
      )}
      <div className="question-body">
        {typeof children === 'string' ? <p>{children}</p> : children}
      </div>
    </div>
  );
};
