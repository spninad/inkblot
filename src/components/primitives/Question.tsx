import React from 'react';

export interface QuestionProps {
  children: React.ReactNode;
  className?: string;
}

export const Question: React.FC<QuestionProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`question ${className}`.trim()}>
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  );
};
