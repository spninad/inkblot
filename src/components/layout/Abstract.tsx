import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert.js';
export interface AbstractProps {
  children: React.ReactNode;
  title?: string;
  id?: string;
}
export const Abstract: React.FC<AbstractProps> = ({
  children,
  title = 'Abstract',
  id = 'abstract',
}) => (
  <section className="abstract" id={id} aria-label={title}>
    <Alert role="note">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="ib:text-base ib:leading-relaxed">{children}</AlertDescription>
    </Alert>
  </section>
);
