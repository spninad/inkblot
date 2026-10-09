/**
 * Inkblot Site Client Runtime
 * Handles theme toggling, search modal (Ctrl+K or /), and search indexing.
 */

export const INKBLOT_SITE_SCRIPT = `
(function() {
  // 1. Theme Toggle
  var themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme') || 'academic';
      var isDark = current.indexOf('dark') !== -1 || document.documentElement.getAttribute('data-color-mode') === 'dark';
      var next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-color-mode', next);
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('inkblot-theme-mode', next); } catch(e){}
    });
  }

  // Restore saved theme preference
  try {
    var saved = localStorage.getItem('inkblot-theme-mode');
    if (saved) {
      document.documentElement.setAttribute('data-color-mode', saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch(e){}

  // 2. Search Modal
  var searchModal = document.getElementById('inkblot-search-modal');
  var searchInput = document.getElementById('inkblot-search-input');
  var searchResults = document.getElementById('inkblot-search-results');
  var searchTrigger = document.querySelector('[data-search-trigger]');
  var searchIndex = null;

  function loadSearchIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    return fetch('./search-index.json')
      .then(function(res) { return res.json(); })
      .then(function(data) { searchIndex = data; return data; })
      .catch(function(e) { console.error('Failed to load search index:', e); return []; });
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.showModal();
    loadSearchIndex();
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    if (searchResults) searchResults.innerHTML = '<div style=\"padding:12px;color:var(--muted);font-size:13px;\">Type to search reports...</div>';
  }

  function closeSearch() {
    if (searchModal) searchModal.close();
  }

  if (searchTrigger) {
    searchTrigger.addEventListener('click', openSearch);
  }

  // Keyboard shortcut: '/' or Ctrl+K / Cmd+K
  document.addEventListener('keydown', function(e) {
    if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchModal && searchModal.open) {
      closeSearch();
    }
  });

  if (searchModal) {
    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      var query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchResults.innerHTML = '<div style=\"padding:12px;color:var(--muted);font-size:13px;\">Type to search reports...</div>';
        return;
      }

      loadSearchIndex().then(function(items) {
        var matches = [];
        items.forEach(function(item) {
          var titleMatch = item.title && item.title.toLowerCase().indexOf(query) !== -1;
          var abstractMatch = item.abstract && item.abstract.toLowerCase().indexOf(query) !== -1;
          var matchingHeadings = (item.headings || []).filter(function(h) {
            return h.title && h.title.toLowerCase().indexOf(query) !== -1;
          });

          if (titleMatch || abstractMatch || matchingHeadings.length > 0) {
            matches.push({ item: item, headings: matchingHeadings });
          }
        });

        if (matches.length === 0) {
          searchResults.innerHTML = '<div style=\"padding:12px;color:var(--muted);font-size:13px;\">No matching reports found</div>';
          return;
        }

        var html = '';
        matches.forEach(function(m) {
          html += '<a href=\"' + m.item.route + '\" class=\"inkblot-search-result-item\">' +
                  '<div class=\"inkblot-search-result-title\">' + m.item.title + '</div>' +
                  (m.item.abstract ? '<div class=\"inkblot-search-result-abstract\">' + m.item.abstract.slice(0, 120) + '...</div>' : '') +
                  '</a>';
          m.headings.slice(0, 3).forEach(function(h) {
            html += '<a href=\"' + m.item.route + '#' + h.anchor + '\" class=\"inkblot-search-result-item\" style=\"padding-left:24px;\">' +
                    '<div class=\"inkblot-search-result-title\" style=\"font-size:13px;font-weight:500;\"># ' + h.title + '</div>' +
                    '</a>';
          });
        });
        searchResults.innerHTML = html;
      });
    });
  }
})();
`.trim();
