import { getBuiltinThemes, getTheme } from './index.js';
import type { ThemeConfig, ThemePickerConfig } from './types.js';
export interface AppearanceConfig {
  theme: string;
  themes: { name: string; label: string }[];
  scope?: string;
}

export function resolveAppearance(
  theme: string | ThemeConfig = 'academic',
  picker: ThemePickerConfig = false,
  scope?: string,
): AppearanceConfig {
  const selected = getTheme(theme);
  if (!picker) return { theme: selected.name, themes: [], scope };
  const known = [...getBuiltinThemes(), selected];
  const names =
    typeof picker === 'object' && picker.themes !== undefined
      ? picker.themes
      : [...new Set(known.map((t) => t.name))];
  if (!names.length || !names.includes(selected.name))
    throw new Error('themePicker.themes must include the configured default theme.');
  const themes = [...new Set(names)].map((name) => {
    const found = known.find((t) => t.name === name) || getTheme(name);
    if (found.name !== name) throw new Error(`Unknown theme in themePicker: ${name}`);
    return { name, label: found.label };
  });
  return { theme: selected.name, themes, scope };
}

/** Uses the same key in the pre-paint script and React controls. */
export function appearanceKey(scope?: string): string {
  return (
    'inkblot-appearance:' +
    (scope
      ? 'site:' + new URL(scope, location.href).pathname.replace(/\/$/, '')
      : 'report:' + location.pathname)
  );
}
// A literal source keeps SSR bootstrap markup identical in minified browser bundles.
const restoreSource = `(function(c,target){
  try {
    var key='inkblot-appearance:'+(c.scope?'site:'+new URL(c.scope,location.href).pathname.replace(/\\/$/,''):'report:'+location.pathname);
    var saved=JSON.parse(localStorage.getItem(key)||'{}');
    var theme=c.themes.some(function(t){return t.name===saved.theme})?saved.theme:c.theme;
    var mode=['light','dark','system'].includes(saved.mode)?saved.mode:'system';
    var root=target==='scope'?document.currentScript?.parentElement?.closest('[data-inkblot-root]'):document.documentElement;
    if(!root)return;
    root.setAttribute(target==='scope'?'data-inkblot-theme':'data-theme',theme);
    if(mode==='system')root.removeAttribute('data-color-mode');else root.setAttribute('data-color-mode',mode);
  }catch(e){}
})`;
export function appearanceInit(
  config: AppearanceConfig,
  target: 'document' | 'scope' = 'document',
): string {
  return `${restoreSource}(${JSON.stringify(config).replace(/</g, '\\u003c')}, ${JSON.stringify(target)});`;
}

export function readAppearance(config: AppearanceConfig): {
  theme: string;
  mode: 'light' | 'dark' | 'system';
} {
  let saved: { theme?: string; mode?: string } = {};
  try {
    saved = JSON.parse(localStorage.getItem(appearanceKey(config.scope)) || '{}');
  } catch {}
  return {
    theme: config.themes.some((t) => t.name === saved.theme) ? saved.theme! : config.theme,
    mode: saved.mode === 'light' || saved.mode === 'dark' ? saved.mode : 'system',
  };
}
