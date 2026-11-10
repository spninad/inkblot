'use client';
import React from 'react';
import { StaticControlsContext } from '../../interactive/context.js';
import { TabsControl, CollapseControl } from '../../interactive/tabs.js';

export interface TabItem {
  id?: string;
  label: string;
  content: React.ReactNode;
}
export interface TabsProps {
  items?: TabItem[];
  defaultTab?: number;
  children?: React.ReactNode;
}
export const Tabs: React.FC<TabsProps> = ({ items, defaultTab = 0, children }) => {
  const context = React.useContext(StaticControlsContext);
  const tabs = items?.length
    ? items
    : React.Children.toArray(children)
        .filter(React.isValidElement)
        .map((child: any, i) => ({
          label: child.props.label || child.props.title || `Tab ${i + 1}`,
          content: child.props.children,
        }));
  if (!context) return <TabsControl items={tabs} defaultTab={defaultTab} />;
  if (!context.enabled)
    return (
      <div className="inkblot-tabs-static">
        {tabs.map((tab, i) => (
          <section key={i}>
            <h3>{tab.label}</h3>
            {tab.content}
          </section>
        ))}
      </div>
    );
  return context.island('tabs', {
    items: tabs.map((tab) => ({ label: tab.label, html: context.content(tab.content) })),
    defaultTab,
  });
};
export interface TabProps {
  label: string;
  children: React.ReactNode;
}
export const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;
export interface CollapseProps {
  summary?: React.ReactNode;
  title?: React.ReactNode;
  open?: boolean;
  children: React.ReactNode;
  className?: string;
}
export const Collapse: React.FC<CollapseProps> = ({
  summary,
  title,
  open = false,
  children,
  className = '',
}) => {
  const context = React.useContext(StaticControlsContext);
  const label = summary ?? title ?? 'Details';
  if (!context)
    return (
      <CollapseControl summary={label} open={open} className={className}>
        {children}
      </CollapseControl>
    );
  if (!context.enabled)
    return (
      <details open className={className}>
        <summary>{label}</summary>
        {children}
      </details>
    );
  return context.island('collapse', {
    summaryHtml: context.content(label),
    html: context.content(children),
    open,
    className,
  });
};
