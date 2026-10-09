import React from 'react';
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

  return (
    <div className="inkblot-site-root">
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

        <div className="inkblot-site-actions">
          {config.search !== false && (
            <button
              type="button"
              className="inkblot-search-btn"
              data-search-trigger
              aria-label="Search reports"
            >
              <span>Search...</span>
              <kbd>/</kbd>
            </button>
          )}

          <button
            type="button"
            className="inkblot-theme-btn"
            data-theme-toggle
            aria-label="Toggle color theme"
            title="Toggle theme"
          >
            ◐
          </button>
        </div>
      </header>

      {/* Main Shell: Sidebar + Content */}
      <div className="inkblot-site-shell">
        {sidebar.length > 0 && (
          <aside className="inkblot-site-sidebar" aria-label="Site Navigation">
            {sidebar.map((section, sIdx) => (
              <div key={sIdx} className="inkblot-sidebar-section">
                {section.title && (
                  <div className="inkblot-sidebar-title">{section.title}</div>
                )}
                <ul className="inkblot-sidebar-list">
                  {section.items.map((item, iIdx) => {
                    const isActive = page.route === item.href;
                    return (
                      <li key={iIdx}>
                        <a
                          href={formatHref(item.href)}
                          className={`inkblot-sidebar-link ${isActive ? 'active' : ''}`}
                        >
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="inkblot-sidebar-badge">{item.badge}</span>
                          )}
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
        <main className="inkblot-site-content">
          {page.breadcrumbs && page.breadcrumbs.length > 1 && (
            <nav className="inkblot-breadcrumbs" aria-label="Breadcrumb">
              {page.breadcrumbs.map((crumb, idx) => {
                const isLast = idx === page.breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>/</span>}
                    {isLast ? (
                      <span aria-current="page">{crumb.title}</span>
                    ) : (
                      <a href={formatHref(crumb.href)}>{crumb.title}</a>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Inner Report Article */}
          <article className="inkblot-site-article">{children}</article>

          {/* Previous / Next Page Pagination */}
          {(page.prevPage || page.nextPage) && (
            <nav className="inkblot-pagination" aria-label="Page pagination">
              {page.prevPage && (
                <a href={formatHref(page.prevPage.href)} className="prev">
                  <span className="inkblot-pagination-label">← Previous</span>
                  <span className="inkblot-pagination-title">{page.prevPage.title}</span>
                </a>
              )}
              {page.nextPage && (
                <a href={formatHref(page.nextPage.href)} className="next">
                  <span className="inkblot-pagination-label">Next →</span>
                  <span className="inkblot-pagination-title">{page.nextPage.title}</span>
                </a>
              )}
            </nav>
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

      {/* Client Search Dialog Modal */}
      {config.search !== false && (
        <dialog id="inkblot-search-modal" className="inkblot-search-modal">
          <div className="inkblot-search-input-wrap">
            <input
              type="search"
              id="inkblot-search-input"
              className="inkblot-search-input"
              placeholder="Search reports and sections..."
              autoComplete="off"
            />
          </div>
          <div id="inkblot-search-results" className="inkblot-search-results"></div>
        </dialog>
      )}
    </div>
  );
};
