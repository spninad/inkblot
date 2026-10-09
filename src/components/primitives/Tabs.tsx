import React from 'react';

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

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab = 0,
  children,
}) => {
  // If items are provided as an array
  if (items && items.length > 0) {
    return (
      <div className="inkblot-tabs">
        <div className="inkblot-tab-nav" role="tablist">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={`inkblot-tab-btn ${idx === defaultTab ? 'active' : ''}`}
              role="tab"
              aria-selected={idx === defaultTab}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="inkblot-tab-panels">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`inkblot-tab-panel ${idx === defaultTab ? 'active' : ''}`}
              role="tabpanel"
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If children are Tab components
  const validChildren = React.Children.toArray(children) as React.ReactElement<any>[];
  return (
    <div className="inkblot-tabs">
      <div className="inkblot-tab-nav" role="tablist">
        {validChildren.map((child, idx) => {
          const label = child.props?.label || child.props?.title || `Tab ${idx + 1}`;
          return (
            <button
              key={idx}
              type="button"
              className={`inkblot-tab-btn ${idx === defaultTab ? 'active' : ''}`}
              role="tab"
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="inkblot-tab-panels">
        {validChildren.map((child, idx) => (
          <div
            key={idx}
            className={`inkblot-tab-panel ${idx === defaultTab ? 'active' : ''}`}
            role="tabpanel"
          >
            {child.props?.children}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface TabProps {
  label: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

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
  const displaySummary = summary ?? title ?? 'Details';
  return (
    <details className={`inkblot-collapse ${className}`.trim()} open={open}>
      <summary>{displaySummary}</summary>
      <div className="inkblot-collapse-content">{children}</div>
    </details>
  );
};
