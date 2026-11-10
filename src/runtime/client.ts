/**
 * Scientific report enhancements: chart tooltips and scroll-synchronized contents.
 * UI controls use the separate React/shadcn runtime.
 */

export const INKBLOT_CLIENT_SCRIPT = `
(function() {
  // 1. Tooltip System
  var tip = document.getElementById('inkblot-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'inkblot-tip';
    tip.className = 'inkblot-tip';
    tip.hidden = true;
    document.body.appendChild(tip);
  }

  function showTip(evt, html) {
    var scope = evt.target.closest('.inkblot-root');
    if (scope && tip.parentElement !== scope) scope.appendChild(tip);
    tip.innerHTML = html;
    tip.hidden = false;
    moveTip(evt);
  }

  function moveTip(evt) {
    var x, y;
    if (evt.clientX != null && evt.type.startsWith('pointer')) {
      x = evt.clientX;
      y = evt.clientY;
    } else {
      var r = evt.target.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top;
    }
    var w = tip.offsetWidth;
    var h = tip.offsetHeight;
    var left = x + 14;
    var top = y - h - 10;
    if (left + w > window.innerWidth - 8) {
      left = x - w - 14;
    }
    if (top < 8) {
      top = y + 16;
    }
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - h - 8));
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function hideTip() {
    tip.hidden = true;
  }

  function initTooltips() {
    var hits = document.querySelectorAll('.hit[data-tip]');
    hits.forEach(function(node) {
      if (node._tipBound) return;
      node._tipBound = true;
      var html = node.getAttribute('data-tip');
      if (!html) return;
      node.addEventListener('pointerenter', function(e) { showTip(e, html); });
      node.addEventListener('pointermove', moveTip);
      node.addEventListener('pointerleave', hideTip);
      node.addEventListener('focus', function(e) { showTip(e, html); });
      node.addEventListener('blur', hideTip);
    });
  }

  // 2. TOC Active State Highlighting (IntersectionObserver)
  function initTocSpy() {
    if (!('IntersectionObserver' in window)) return;
    document.querySelectorAll('.inkblot-toc').forEach(function(nav) {
      if (nav._tocBound) return;
      nav._tocBound = true;
      var page = nav.closest('.inkblot-page');
      if (!page) return;
      var links = Array.from(nav.querySelectorAll('a[href^="#"]'));
      var map = new Map();
      links.forEach(function(a) { map.set(a.getAttribute('href').slice(1), a); });
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function(a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
          var active = map.get(entry.target.id);
          if (active) { active.classList.add('active'); active.setAttribute('aria-current', 'location'); }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      map.forEach(function(a, id) {
        var target = page.querySelector('#' + CSS.escape(id));
        if (target) observer.observe(target);
      });
      var mobile = page.querySelector('.inkblot-toc-mobile');
      if (mobile) mobile.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() { mobile.removeAttribute('open'); });
      });
    });
  }

  function initAll() {
    initTooltips();
    initTocSpy();
  }

  document.addEventListener('inkblot:content-ready', initAll);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
`.trim();
