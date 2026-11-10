'use client';
import React from 'react';
import { AppearanceScope } from '../../interactive/scope.js';
import { StaticControlsContext } from '../../interactive/context.js';
import { AppearanceControls } from '../../interactive/toolbar.js';
import { resolveAppearance } from '../../themes/appearance.js';
import type { ThemeConfig, ThemePickerConfig } from '../../themes/types.js';
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
  theme?: string | ThemeConfig;
  themePicker?: ThemePickerConfig;
  embedded?: boolean;
  children?: React.ReactNode;
}

export const Report: React.FC<ReportProps> = ({
  title,
  date,
  abstract,
  toc = [],
  children,
  embedded = false,
  theme = 'academic',
  themePicker = false,
}) => {
  const context = React.useContext(StaticControlsContext);
  const appearance = resolveAppearance(theme, themePicker);
  const controls =
    !embedded &&
    themePicker &&
    (context ? (
      context.enabled && context.island('appearance', { appearance })
    ) : (
      <AppearanceControls appearance={appearance} />
    ));
  const Scope = embedded ? React.Fragment : AppearanceScope;
  const Main = embedded ? 'div' : 'main';
  return (
    <Scope {...(embedded ? {} : { theme, themePicker })}>
      {controls && <div className="inkblot-report-toolbar">{controls}</div>}
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

        <Main className="inkblot-main">
          {(title || date || abstract) && (
            <header className="masthead">
              {title && <h1>{title}</h1>}
              {date && <p className="date">{date}</p>}

              {abstract &&
                (typeof abstract === 'string' ? (
                  <Abstract>
                    <p>{abstract}</p>
                  </Abstract>
                ) : (
                  abstract
                ))}
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
        </Main>
      </div>
    </Scope>
  );
};
