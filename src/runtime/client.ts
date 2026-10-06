/**
 * Inkblot Micro Client Runtime (<3KB)
 * Handles interactive tooltips, scroll-synchronized TOC spy, and tab switching.
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
    var links = Array.from(document.querySelectorAll('.inkblot-toc a, .toc a'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = new Map();
    links.forEach(function(a) {
      var href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        map.set(href.slice(1), a);
      }
    });

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          links.forEach(function(l) { l.classList.remove('active'); });
          var activeLink = map.get(e.target.id);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    map.forEach(function(a, id) {
      var target = document.getElementById(id);
      if (target) io.observe(target);
    });

    // Auto-close mobile TOC on click
    var mobileToc = document.querySelector('.inkblot-toc-mobile, .toc-mobile');
    if (mobileToc) {
      mobileToc.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          mobileToc.removeAttribute('open');
        });
      });
    }
  }

  // 3. Interactive Tabs
  function initTabs() {
    var containers = document.querySelectorAll('.inkblot-tabs');
    containers.forEach(function(wrap) {
      if (wrap._tabsBound) return;
      wrap._tabsBound = true;
      var btns = wrap.querySelectorAll('.inkblot-tab-btn');
      var panels = wrap.querySelectorAll('.inkblot-tab-panel');

      btns.forEach(function(btn, idx) {
        btn.addEventListener('click', function() {
          btns.forEach(function(b) { b.classList.remove('active'); });
          panels.forEach(function(p) { p.classList.remove('active'); });
          btn.classList.add('active');
          if (panels[idx]) panels[idx].classList.add('active');
        });
      });
    });
  }

  function initAll() {
    initTooltips();
    initTocSpy();
    initTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
`.trim();
