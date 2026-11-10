'use client';
import React from 'react';
import { StaticControlsContext } from '../../interactive/context.js';
import { AppearanceScope } from '../../interactive/scope.js';
import { SiteControls } from '../../interactive/toolbar.js';
import { resolveAppearance } from '../../themes/appearance.js';
import { Badge } from '../../ui/badge.js';
import { Button } from '../../ui/button.js';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb.js';
import { Pagination } from '../../ui/pagination.js';
import type { SiteConfig, SitePage, SidebarSection } from '../types.js';

export interface SiteLayoutProps {
  config: SiteConfig;
  page: SitePage;
  sidebar: SidebarSection[];
  basePath?: string;
  children?: React.ReactNode;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({
  config,
  page,
  sidebar,
  basePath = '/',
  children,
}) => {
  const formatHref = (href: string) => {
    if (href.startsWith('http') || href.startsWith('//')) return href;
    const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    const cleanHref = href.startsWith('/') ? href : `/${href}`;
    return `${cleanBase}${cleanHref}` || '/';
  };

  const staticControls = React.useContext(StaticControlsContext);
  const appearance = resolveAppearance(config.theme || 'academic', config.themePicker, basePath);
  const navigation = (
    <>
      {!!config.nav?.length && (
        <nav aria-label="Site links">
          <ul className="inkblot-sidebar-list">
            {config.nav.map((item) => (
              <li key={item.href}>
                <a
                  className="inkblot-sidebar-link"
                  href={formatHref(item.href)}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {sidebar.map((section, i) => (
        <div className="inkblot-sidebar-section" key={i}>
          {section.title && <div className="inkblot-sidebar-title">{section.title}</div>}
          <ul className="inkblot-sidebar-list">
            {section.items.map((item) => (
              <li key={item.href}>
                <a
                  className="inkblot-sidebar-link"
                  href={formatHref(item.href)}
                  aria-current={page.route === item.href ? 'page' : undefined}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
  const controls = staticControls ? (
    staticControls.enabled &&
    staticControls.island('toolbar', {
      appearance,
      basePath,
      search: config.search !== false,
      navigationHtml:
        sidebar.length || config.nav?.length ? staticControls.content(navigation) : undefined,
    })
  ) : (
    <SiteControls
      appearance={appearance}
      basePath={basePath}
      search={config.search !== false}
      navigation={sidebar.length || config.nav?.length ? navigation : undefined}
    />
  );
  return (
    <AppearanceScope
      theme={config.theme}
      themePicker={config.themePicker}
      className="inkblot-site-root"
    >
      <a className="inkblot-skip-link" href="#inkblot-content">
        Skip to content
      </a>
      {/* Top Navigation Bar */}
      <header className="inkblot-site-header">
        <a href={formatHref('/')} className="inkblot-site-brand">
          {config.logo && <img src={config.logo} alt="" style={{ height: '24px' }} />}
          <span>{config.title}</span>
        </a>

        {config.nav && config.nav.length > 0 && (
          <ul className="inkblot-site-nav-links">
            {config.nav.map((item, idx) => (
              <li key={idx}>
                <a
                  href={formatHref(item.href)}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={page.route === item.href ? 'active' : undefined}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}

        {controls}
      </header>

      {/* Main Shell: Sidebar + Content */}
      <div className="inkblot-site-shell">
        {(sidebar.length > 0 || !!config.nav?.length) && (
          <aside
            id="inkblot-site-navigation"
            className="inkblot-site-sidebar"
            aria-label="Site Navigation"
          >
            {!!config.nav?.length && (
              <nav className="inkblot-mobile-nav" aria-label="Site links">
                <ul className="inkblot-sidebar-list">
                  {config.nav.map((item) => (
                    <li key={item.href}>
                      <a
                        className="inkblot-sidebar-link"
                        href={formatHref(item.href)}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {sidebar.map((section, sIdx) => (
              <div key={sIdx} className="inkblot-sidebar-section">
                {section.title && <div className="inkblot-sidebar-title">{section.title}</div>}
                <ul className="inkblot-sidebar-list">
                  {section.items.map((item, iIdx) => {
                    const isActive = page.route === item.href;
                    return (
                      <li key={iIdx}>
                        <a
                          href={formatHref(item.href)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`inkblot-sidebar-link ${isActive ? 'active' : ''}`}
                        >
                          <span>{item.title}</span>
                          {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </aside>
        )}

        {/* Page Content */}
        <main id="inkblot-content" tabIndex={-1} className="inkblot-site-content">
          {page.breadcrumbs && page.breadcrumbs.length > 1 && (
            <Breadcrumb className="inkblot-breadcrumbs">
              <BreadcrumbList>
                {page.breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {idx === page.breadcrumbs!.length - 1 ? (
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={formatHref(crumb.href)}>{crumb.title}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Inner Report Article */}
          <article className="inkblot-site-article">{children}</article>

          {/* Previous / Next Page Pagination */}
          {(page.prevPage || page.nextPage) && (
            <Pagination className="inkblot-pagination" aria-label="Page pagination">
              {page.prevPage && (
                <Button asChild variant="outline" className="inkblot-page-link prev">
                  <a href={formatHref(page.prevPage.href)}>
                    <span className="inkblot-pagination-label">← Previous</span>
                    <span className="inkblot-pagination-title">{page.prevPage.title}</span>
                  </a>
                </Button>
              )}
              {page.nextPage && (
                <Button asChild variant="outline" className="inkblot-page-link next">
                  <a href={formatHref(page.nextPage.href)}>
                    <span className="inkblot-pagination-label">Next →</span>
                    <span className="inkblot-pagination-title">{page.nextPage.title}</span>
                  </a>
                </Button>
              )}
            </Pagination>
          )}
        </main>
      </div>

      {/* Footer */}
      {config.footer && (
        <footer className="inkblot-site-footer">
          {typeof config.footer === 'string' ? (
            <p>{config.footer}</p>
          ) : (
            <>
              {config.footer.copyright && <p>{config.footer.copyright}</p>}
              {config.footer.links && (
                <ul className="inkblot-site-footer-links">
                  {config.footer.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={formatHref(link.href)}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </footer>
      )}
    </AppearanceScope>
  );
};
