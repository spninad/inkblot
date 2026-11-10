'use client';
import React from 'react';
import { StaticControlsContext, PortalContainerContext } from './context.js';
import { getTheme, generateThemeCssVariables, getBuiltinThemes } from '../themes/index.js';
import { initializeScientificControls } from './science.js';
import { resolveAppearance, readAppearance, appearanceInit } from '../themes/appearance.js';
import type { ThemeConfig, ThemePickerConfig } from '../themes/types.js';

export function AppearanceScope({
  theme = 'academic',
  themePicker = false,
  children,
  className = '',
}: {
  theme?: string | ThemeConfig;
  themePicker?: ThemePickerConfig;
  children: React.ReactNode;
  className?: string;
}) {
  const scopeId = React.useId();
  const isStatic = React.useContext(StaticControlsContext) !== null;
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!isStatic) initializeScientificControls();
  }, [isStatic]);
  const appearance = resolveAppearance(theme, themePicker);
  const resolved = getTheme(theme);
  const scopedThemes = [
    ...new Map(
      [...appearance.themes.map((t) => getTheme(t.name)), resolved].map((t) => [t.name, t]),
    ).values(),
  ].filter(
    (t) =>
      (typeof theme === 'object' && t.name === resolved.name) ||
      getBuiltinThemes().find((b) => b.name === t.name) !== t,
  );
  const customCss = scopedThemes
    .map((t) => generateThemeCssVariables(t, false))
    .join('\n')
    .replace(/\.inkblot-root\[/g, `.inkblot-root[data-inkblot-scope=${JSON.stringify(scopeId)}][`);
  React.useLayoutEffect(() => {
    if (!element || isStatic) return;
    const saved = readAppearance(appearance);
    element.setAttribute('data-inkblot-theme', saved.theme);
    if (saved.mode === 'system') element.removeAttribute('data-color-mode');
    else element.setAttribute('data-color-mode', saved.mode);
  }, [element, resolved.name, JSON.stringify(themePicker), isStatic]);
  return (
    <div
      ref={setElement}
      className={`inkblot-root ${className}`.trim()}
      data-inkblot-root=""
      data-inkblot-scope={scopeId}
      suppressHydrationWarning
      data-inkblot-theme={isStatic ? undefined : resolved.name}
    >
      {!isStatic && (
        <span
          hidden
          dangerouslySetInnerHTML={{
            __html: `<script>${appearanceInit(appearance, 'scope')}</script>`,
          }}
        />
      )}
      {!isStatic && customCss && <style>{customCss}</style>}
      <PortalContainerContext.Provider value={element}>{children}</PortalContainerContext.Provider>
    </div>
  );
}
