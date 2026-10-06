import React, { createContext, useContext, useEffect, useState } from 'react';
import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { defaultComponents } from '../index.js';
import { Report } from '../layout/Report.js';
import { getTheme } from '../../themes/index.js';
import type { ThemeConfig } from '../../themes/types.js';
import type { CompiledReport } from '../../compiler/types.js';

interface ReportContextValue {
  theme: ThemeConfig;
  components: Record<string, React.ComponentType<any>>;
}

const ReportContext = createContext<ReportContextValue>({
  theme: getTheme('academic'),
  components: defaultComponents,
});

export interface ReportProviderProps {
  theme?: string | ThemeConfig;
  components?: Record<string, React.ComponentType<any>>;
  children: React.ReactNode;
}

export const ReportProvider: React.FC<ReportProviderProps> = ({
  theme = 'academic',
  components = {},
  children,
}) => {
  const resolvedTheme = getTheme(theme);
  const mergedComponents = { ...defaultComponents, ...components };

  return (
    <ReportContext.Provider value={{ theme: resolvedTheme, components: mergedComponents }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);

export interface ReportViewerProps {
  report: CompiledReport;
  components?: Record<string, React.ComponentType<any>>;
  theme?: string | ThemeConfig;
}

/**
 * Renders a compiled MDX report directly inside any React or Next.js application.
 */
export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  components: propComponents = {},
  theme: propTheme,
}) => {
  const context = useReport();
  const activeTheme = propTheme ? getTheme(propTheme) : context.theme;
  const mergedComponents = { ...context.components, ...propComponents };

  const [MDXComponent, setMDXComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    let mounted = true;
    run(report.code, runtime)
      .then((mod) => {
        if (mounted) {
          setMDXComponent(() => mod.default);
        }
      })
      .catch((err) => {
        console.error('Failed to run compiled MDX report:', err);
      });

    return () => {
      mounted = false;
    };
  }, [report.code]);

  if (!MDXComponent) {
    return <div className="inkblot-loading">Rendering report...</div>;
  }

  return (
    <Report
      title={report.frontmatter.title}
      date={report.frontmatter.date}
      abstract={report.frontmatter.abstract}
      toc={report.toc}
      theme={activeTheme.name}
    >
      <MDXComponent components={mergedComponents} />
    </Report>
  );
};
