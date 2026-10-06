import React from 'react';
import { Abstract } from './Abstract.js';

export interface TocItem {
  id: string;
  title: string;
  number?: string | number;
  level?: number;
  sub?: boolean;
}

export interface ReportProps {
  title?: string;
  date?: string;
  abstract?: React.ReactNode;
  toc?: TocItem[];
  theme?: string;
  children?: React.ReactNode;
}

export const Report: React.FC<ReportProps> = ({
  title,
  date,
  abstract,
  toc = [],
  children,
}) => {
  return (
    <div className="inkblot-page page">
      {toc && toc.length > 0 && (
        <nav className="inkblot-toc toc" aria-label="Contents">
          <h2>Contents</h2>
          <ol>
            {abstract && (
              <li>
                <a href="#abstract">
                  <span></span>Abstract
                </a>
              </li>
            )}
            {toc.map((item) => (
              <li key={item.id} className={item.sub || item.level === 3 ? 'sub' : undefined}>
                <a href={`#${item.id}`}>
                  <span>{item.number != null ? item.number : ''}</span>
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main className="inkblot-main">
        {(title || date || abstract) && (
          <header className="masthead">
            {title && <h1>{title}</h1>}
            {date && <p className="date">{date}</p>}

            {abstract && (
              typeof abstract === 'string' ? (
                <Abstract>
                  <p>{abstract}</p>
                </Abstract>
              ) : (
                abstract
              )
            )}
          </header>
        )}

        {toc && toc.length > 0 && (
          <details className="inkblot-toc-mobile toc-mobile">
            <summary>Contents</summary>
            <ol>
              {abstract && (
                <li>
                  <a href="#abstract">Abstract</a>
                </li>
              )}
              {toc.map((item) => (
                <li key={`mob-${item.id}`}>
                  <a href={`#${item.id}`}>
                    {item.number != null ? `${item.number} ` : ''}
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        )}

        {children}
      </main>
    </div>
  );
};
