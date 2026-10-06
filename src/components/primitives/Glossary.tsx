import React from 'react';

export interface GlossaryEntry {
  term: React.ReactNode;
  definition: React.ReactNode;
}

export interface GlossaryProps {
  items?: GlossaryEntry[];
  children?: React.ReactNode;
}

export const Glossary: React.FC<GlossaryProps> = ({ items, children }) => {
  return (
    <dl className="gloss">
      {items &&
        items.map((item, idx) => (
          <React.Fragment key={idx}>
            <dt>{item.term}</dt>
            <dd>{item.definition}</dd>
          </React.Fragment>
        ))}
      {children}
    </dl>
  );
};

export interface GlossaryItemProps {
  term: React.ReactNode;
  children: React.ReactNode;
}

export const GlossaryItem: React.FC<GlossaryItemProps> = ({
  term,
  children,
}) => {
  return (
    <>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </>
  );
};
