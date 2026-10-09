import React from 'react';

export type AsideType = 'note' | 'tip' | 'info' | 'warning' | 'caution' | 'important';

export interface AsideProps {
  type?: AsideType;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AsideIcons: Record<AsideType, React.ReactNode> = {
  note: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  tip: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  caution: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  important: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

export const Aside: React.FC<AsideProps> = ({
  type,
  title,
  children,
  className = '',
}) => {
  const effectiveType = type || 'note';
  const icon = AsideIcons[effectiveType] || AsideIcons.note;
  const defaultTitles: Record<AsideType, string> = {
    note: 'Note',
    info: 'Info',
    tip: 'Tip',
    warning: 'Warning',
    caution: 'Caution',
    important: 'Important',
  };

  const displayTitle = title ?? defaultTitles[effectiveType];
  const typeClass = type ? `aside-${type}` : '';

  return (
    <aside className={`aside ${typeClass} ${className}`.replace(/\s+/g, ' ').trim()}>
      <div className="aside-head">
        <span className="aside-icon" aria-hidden="true">{icon}</span>
        {displayTitle && <h4 className="aside-title">{displayTitle}</h4>}
      </div>
      <div className="aside-body">{children}</div>
    </aside>
  );
};
