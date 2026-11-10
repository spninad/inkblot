import React from 'react';
import { Info, Flame, TriangleAlert, CircleX, Star } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert.js';
export type AsideType = 'note' | 'tip' | 'info' | 'warning' | 'caution' | 'important';
export interface AsideProps {
  type?: AsideType;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
const icons = {
  note: Info,
  info: Info,
  tip: Flame,
  warning: TriangleAlert,
  caution: CircleX,
  important: Star,
};
const titles = {
  note: 'Note',
  info: 'Info',
  tip: 'Tip',
  warning: 'Warning',
  caution: 'Caution',
  important: 'Important',
};
export const Aside: React.FC<AsideProps> = ({ type, title, children, className = '' }) => {
  const kind = type || 'note';
  const Icon = icons[kind] || Info;
  return (
    <aside
      className={`aside ${type ? `aside-${type}` : ''} ${className}`.replace(/\s+/g, ' ').trim()}
    >
      <Alert
        role={kind === 'warning' || kind === 'caution' ? 'alert' : 'note'}
        variant={kind === 'caution' ? 'destructive' : 'default'}
      >
        <Icon aria-hidden="true" />
        <AlertTitle>{title ?? titles[kind]}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    </aside>
  );
};
