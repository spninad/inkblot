import React from 'react';

// Layout
export * from './layout/Report.js';
export * from './layout/Section.js';
export * from './layout/Abstract.js';

// Data
export * from './data/Table.js';
export * from './data/SummaryTable.js';

// Primitives
export * from './primitives/Aside.js';
export * from './primitives/Question.js';
export * from './primitives/Glossary.js';
export * from './primitives/Tabs.js';

// Charts
export * from './charts/Figure.js';
export * from './charts/DotPlot.js';
export * from './charts/XYPlot.js';
export * from './charts/Diagram.js';
export * from './charts/Sparkline.js';
export * from './charts/Slopegraph.js';
export * from './charts/SmallMultiples.js';
export * from './charts/Plot3D.js';

// Math
export * from './math/Equation.js';

// Import references for standard mapping
import { Report } from './layout/Report.js';
import { Section, Subsection } from './layout/Section.js';
import { Abstract } from './layout/Abstract.js';
import { Table } from './data/Table.js';
import { SummaryTable } from './data/SummaryTable.js';
import { Aside } from './primitives/Aside.js';
import { Question } from './primitives/Question.js';
import { Glossary, GlossaryItem } from './primitives/Glossary.js';
import { Tabs, Tab, Collapse } from './primitives/Tabs.js';
import { Figure } from './charts/Figure.js';
import { DotPlot } from './charts/DotPlot.js';
import { XYPlot } from './charts/XYPlot.js';
import { Diagram } from './charts/Diagram.js';
import { Sparkline } from './charts/Sparkline.js';
import { Slopegraph } from './charts/Slopegraph.js';
import { SmallMultiples } from './charts/SmallMultiples.js';
import { Plot3D } from './charts/Plot3D.js';
import { Equation } from './math/Equation.js';

/**
 * Standard component dictionary injected into every MDX compilation scope.
 */
export const defaultComponents: Record<string, React.ComponentType<any>> = {
  // Scientific Components
  Report,
  Section,
  Subsection,
  Abstract,
  Table,
  SummaryTable,
  Aside,
  Callout: Aside, // Alias
  Question,
  Glossary,
  GlossaryItem,
  Tabs,
  Tab,
  Collapse,
  Figure,
  DotPlot,
  XYPlot,
  Diagram,
  Sparkline,
  Slopegraph,
  SmallMultiples,
  Plot3D,
  Equation,
  Math: Equation, // Alias

  // Enhanced HTML primitives
  table: (props: any) => <div className="tablewrap"><table {...props} /></div>,
  blockquote: (props: any) => <div className="question" {...props} />,
};
