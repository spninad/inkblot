import React from 'react';

export interface AbstractProps {
  children: React.ReactNode;
  title?: string;
  id?: string;
}

export const Abstract: React.FC<AbstractProps> = ({
  children,
  title = 'Abstract',
  id = 'abstract',
}) => {
  return (
    <section className="abstract" id={id} aria-labelledby="abs-h">
      <h2 id="abs-h">{title}</h2>
      {children}
    </section>
  );
};
