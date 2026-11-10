'use client';
import React from 'react';
import { Search, Palette, SunMoon, Menu } from 'lucide-react';
import { Button } from '../ui/button.js';
import { Kbd } from '../ui/kbd.js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu.js';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog.js';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet.js';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from '../ui/command.js';
import { PortalContainerContext, ContentSlot } from './context.js';
import { appearanceKey, readAppearance, type AppearanceConfig } from '../themes/appearance.js';
import type { ColorMode } from '../themes/types.js';

export function AppearanceControls({ appearance }: { appearance: AppearanceConfig }) {
  const container = React.useContext(PortalContainerContext);
  const [theme, setTheme] = React.useState(appearance.theme);
  const [mode, setMode] = React.useState<ColorMode>('system');
  const state = React.useRef({ theme: appearance.theme, mode: 'system' as ColorMode });
  React.useEffect(() => {
    const saved = readAppearance(appearance);
    const selected = saved.theme;
    const chosenMode = saved.mode;
    state.current = { theme: selected, mode: chosenMode };
    setTheme(selected);
    setMode(chosenMode);
    const query = matchMedia('(prefers-color-scheme: dark)');
    function apply() {
      const root = container || document.documentElement;
      const effective =
        state.current.mode === 'system' ? (query.matches ? 'dark' : 'light') : state.current.mode;
      root.setAttribute('data-inkblot-theme', state.current.theme);
      root.setAttribute('data-color-mode', effective);
      if (document.documentElement.hasAttribute('data-inkblot-generated')) {
        document.documentElement.setAttribute('data-theme', state.current.theme);
        document.documentElement.setAttribute('data-color-mode', effective);
      }
    }
    apply();
    query.addEventListener('change', apply);
    const sync = () => apply();
    rootEvents.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', apply);
      rootEvents.removeEventListener('change', sync);
    };
  }, [JSON.stringify(appearance), container]);
  function update(next: { theme?: string; mode?: ColorMode }) {
    state.current = { ...state.current, ...next };
    setTheme(state.current.theme);
    setMode(state.current.mode);
    try {
      localStorage.setItem(appearanceKey(appearance.scope), JSON.stringify(state.current));
    } catch {}
    rootEvents.dispatchEvent(new Event('change'));
  }
  return (
    <div className="inkblot-appearance-controls">
      {appearance.themes.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              aria-label="Choose design language"
              className="inkblot-language-trigger"
            >
              <Palette />
              <span>{appearance.themes.find((t) => t.name === theme)?.label || theme}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Design language</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={(theme) => update({ theme })}>
              {appearance.themes.map((t) => (
                <DropdownMenuRadioItem key={t.name} value={t.name}>
                  {t.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Choose color mode">
            <SunMoon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={mode}
            onValueChange={(mode) => update({ mode: mode as ColorMode })}
          >
            {(['light', 'dark', 'system'] as const).map((m) => (
              <DropdownMenuRadioItem key={m} value={m}>
                {m[0].toUpperCase() + m.slice(1)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
// Local event target avoids leaking preferences across independent hosted roots.
const rootEvents = new EventTarget();

interface SearchEntry {
  title: string;
  route: string;
  abstract?: string;
  headings?: { title: string; anchor: string }[];
}
export function SiteControls({
  appearance,
  navigationHtml,
  navigation,
  search = true,
  basePath = '/',
}: {
  appearance: AppearanceConfig;
  navigationHtml?: string;
  navigation?: React.ReactNode;
  search?: boolean;
  basePath?: string;
}) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [commandValue, setCommandValue] = React.useState('');
  const [entries, setEntries] = React.useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [retry, setRetry] = React.useState(0);
  const base = basePath.replace(/\/$/, '') + '/';
  React.useEffect(() => {
    if (!search) return;
    const listener = (e: KeyboardEvent) => {
      const editing = (e.target as HTMLElement)?.closest(
        'input,textarea,select,[contenteditable="true"]',
      );
      if (
        (e.key === '/' && !editing && !e.metaKey && !e.ctrlKey && !e.altKey) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        setMenuOpen(false);
        setQuery('');
        setSearchOpen(true);
        setRetry((n) => n + 1);
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [search]);
  React.useEffect(() => {
    if (!searchOpen || entries) return;
    const abort = new AbortController();
    setFailed(false);
    fetch(base + 'search-index.json', { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Search unavailable');
        return r.json();
      })
      .then(setEntries)
      .catch((e) => {
        if (e.name !== 'AbortError') setFailed(true);
      });
    return () => abort.abort();
  }, [searchOpen, entries, base, retry]);
  React.useEffect(() => {
    const media = matchMedia('(min-width: 960px)');
    const close = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  const q = query.trim().toLowerCase();
  const results = (entries || []).flatMap((entry) => {
    const headings = (entry.headings || []).filter((h) => h.title.toLowerCase().includes(q));
    if (
      !q ||
      !(
        [entry.title, entry.abstract || ''].some((s) => s.toLowerCase().includes(q)) ||
        headings.length
      )
    )
      return [];
    return [
      { title: entry.title, route: entry.route, description: entry.abstract },
      ...headings
        .slice(0, 3)
        .map((h) => ({
          title: h.title,
          route: entry.route + '#' + h.anchor,
          description: 'Section in ' + entry.title,
        })),
    ];
  });
  React.useEffect(() => {
    setCommandValue(results[0] ? `${results[0].route}-0` : '');
  }, [entries, query]);
  function href(route: string) {
    const url = new URL(base + route.replace(/^\//, ''), location.href);
    return url.origin === location.origin && /^https?:$/.test(url.protocol) ? url.href : '#';
  }
  return (
    <div className="inkblot-site-actions">
      {(navigationHtml || navigation) && (
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="inkblot-menu-btn" aria-label="Menu">
              <Menu />
              <span>Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="ib:px-6 ib:pt-6">
              <SheetTitle>Site navigation</SheetTitle>
              <SheetDescription>Browse reports and sections.</SheetDescription>
            </div>
            <nav
              className="inkblot-sheet-navigation"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a')) setMenuOpen(false);
              }}
            >
              <ContentSlot html={navigationHtml}>{navigation}</ContentSlot>
            </nav>
          </SheetContent>
        </Sheet>
      )}
      {search && (
        <Dialog
          open={searchOpen}
          onOpenChange={(open) => {
            setSearchOpen(open);
            if (open) {
              setQuery('');
              setRetry((n) => n + 1);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="inkblot-search-btn" aria-label="Search reports">
              <Search />
              <span>Search reports</span>
              <Kbd>/</Kbd>
            </Button>
          </DialogTrigger>
          <DialogContent className="inkblot-search-dialog" showCloseButton>
            <DialogTitle className="ib:sr-only">Search reports</DialogTitle>
            <DialogDescription className="ib:sr-only">
              Search report titles, abstracts, and section headings.
            </DialogDescription>
            <Command shouldFilter={false} value={commandValue} onValueChange={setCommandValue}>
              <CommandInput
                placeholder="Search reports and sections…"
                aria-label="Search reports and sections"
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                {!q ? (
                  <p className="inkblot-search-message">Type to search reports and sections.</p>
                ) : failed ? (
                  <div role="status" className="inkblot-search-message">
                    Search could not load. Please try again.
                    <Button variant="link" onClick={() => setRetry((n) => n + 1)}>
                      Retry
                    </Button>
                  </div>
                ) : !entries ? (
                  <p role="status" className="inkblot-search-message">
                    Searching…
                  </p>
                ) : !results.length ? (
                  <p role="status" className="inkblot-search-message">
                    No matching reports. Try another search.
                  </p>
                ) : (
                  <CommandGroup heading="Reports and sections">
                    {results.map((r, i) => (
                      <CommandItem
                        key={`${r.route}-${i}`}
                        value={`${r.route}-${i}`}
                        onSelect={() => location.assign(href(r.route))}
                      >
                        <a
                          href={
                            typeof window === 'undefined'
                              ? base + r.route.replace(/^\//, '')
                              : href(r.route)
                          }
                          tabIndex={-1}
                          className="inkblot-search-result-item"
                        >
                          <span>{r.title}</span>
                          {r.description && <small>{r.description.slice(0, 160)}</small>}
                        </a>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      )}
      <AppearanceControls appearance={appearance} />
    </div>
  );
}
