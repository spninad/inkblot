import React from 'react';

export interface AsideProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Aside: React.FC<AsideProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <aside className={`aside ${className}`.trim()}>
      {title && <h4>{title}</h4>}
      {children}
    </aside>
  );
};
