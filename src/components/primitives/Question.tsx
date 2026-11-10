import React from 'react';
import { CircleHelp } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert.js';
export interface QuestionProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
export const Question: React.FC<QuestionProps> = ({ title, children, className = '' }) => (
  <div className={`question ${className}`.trim()}>
    <Alert role="note">
      <CircleHelp aria-hidden="true" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  </div>
);
