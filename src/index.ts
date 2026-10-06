// Core Compiler & Renderer
export { compileReport } from './compiler/compile.js';
export { renderReportToHtml } from './compiler/render.js';
export { getFullReportCss, getBaseInkblotCss } from './compiler/css.js';
export * from './compiler/types.js';

// Component Library
export * from './components/index.js';
export {
  ReportViewer,
  ReportProvider,
  useReport,
} from './components/viewer/ReportViewer.js';

// Theme Engine
export * from './themes/index.js';

// Client Micro-Runtime
export { INKBLOT_CLIENT_SCRIPT } from './runtime/client.js';
