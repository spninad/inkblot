import React from 'react';

export interface SectionProps {
  id?: string;
  number?: string | number;
  title: string;
  children?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  number,
  title,
  children,
}) => {
  const sectionId = id || (number ? `s${number}` : undefined);

  return (
    <section id={sectionId}>
      <h2 className="sec">
        {number != null && <span className="n">{number}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
};

export interface SubsectionProps {
  id?: string;
  number?: string | number;
  title: string;
  children?: React.ReactNode;
}

export const Subsection: React.FC<SubsectionProps> = ({
  id,
  number,
  title,
  children,
}) => {
  return (
    <div id={id} className="subsection">
      <h3>
        {number != null && <span className="n">{number}</span>}
        {title}
      </h3>
      {children}
    </div>
  );
};
