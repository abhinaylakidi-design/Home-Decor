/* =========================================================
   UrbanHaven | Decor Accessories page behaviour (standalone)
   Theme toggle, RTL toggle, mobile menu, reveal animations,
   shoppable hotspots, style tabs, wishlist hearts + toast,
   newsletter form, counters, image fallback, touch states
   ========================================================= */
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('uh-theme');
    var r = localStorage.getItem('uh-dir');
    if (t) d.setAttribute('data-theme', t);
    if (r) d.setAttribute('dir', r);
  } catch (e) {}
})();

(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  /* ---------- Lucide icons ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  renderIcons();
  window.addEventListener('load', renderIcons);

  /* ---------- Active navigation link ---------- */
  var currentPath = window.location.pathname.replace(/\/+$/, '') || '/index.html';
  if (currentPath === '/') currentPath = '/index.html';
  var navLinks = $$('.main-nav a[href]').filter(function (link) {
    return !link.closest('.mobile-cta');
  });
  navLinks.forEach(function (link) {
    var linkPath = new URL(link.getAttribute('href'), window.location.href).pathname.replace(/\/+$/, '') || '/index.html';
    if (linkPath === '/') linkPath = '/index.html';
    var active = linkPath === currentPath;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  var homeDropdown = $('.nav-dropdown details');
  if (homeDropdown) {
    homeDropdown.querySelector('.nav-dropdown-toggle').classList.toggle(
      'active',
      !!homeDropdown.querySelector('.nav-dropdown-menu a.active')
    );
  }

  /* ---------- Dark / light mode ---------- */
  var themeBtn = $('#themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('uh-theme', next);
    });
  }

  /* ---------- RTL toggle ---------- */
  var rtlBtn = $('#rtlToggle');
  if (rtlBtn) {
    rtlBtn.addEventListener('click', function () {
      var next = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      root.setAttribute('dir', next);
      store('uh-dir', next);
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuToggle');
  var nav = $('#mainNav');
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) setMenu(false); });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = $('#siteHeader');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 10); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Toast ---------- */
  var toast = document.createElement('div');
  toast.className = 'dec-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  /* ---------- Style tabs ---------- */
  var tabs = $$('.dec-tab');
  var panels = $$('.dec-panel');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.setAttribute('tabindex', on ? '0' : '-1');
    });
    panels.forEach(function (p) {
      var on = p.id === tab.getAttribute('aria-controls');
      p.classList.toggle('is-active', on);
      if (on) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var dirRtl = root.getAttribute('dir') === 'rtl';
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + (dirRtl ? -1 : 1) + tabs.length) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i + (dirRtl ? 1 : -1) + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- Wishlist hearts ---------- */
  $$('.dec-heart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var liked = !btn.classList.contains('is-liked');
      btn.classList.toggle('is-liked', liked);
      btn.setAttribute('aria-pressed', String(liked));
      btn.setAttribute('aria-label', liked ? 'Remove from wishlist' : 'Add to wishlist');
      var card = btn.closest('.dec-card');
      var nameEl = card ? card.querySelector('h3') : null;
      var name = nameEl ? nameEl.textContent : 'Item';
      showToast(liked ? name + ' added to wishlist' : name + ' removed from wishlist');
    });
  });

  /* ---------- Newsletter form ---------- */
  var form = $('#joinForm');
  var msg = $('#joinMsg');
  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#joinEmail');
      var value = input.value.trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      msg.className = 'dec-form-msg ' + (valid ? 'ok' : 'err');
      if (valid) {
        msg.textContent = 'Thank you! Your welcome offer is on its way.';
        form.reset();
      } else {
        msg.textContent = 'Please enter a valid email address.';
        input.focus();
      }
    });
  }

  /* ---------- Animated counters ---------- */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1800;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString('en-IN');
    });
  }

  /* ---------- Image fallback if a photo fails to load ---------- */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var box = img.closest('.dec-media, .dec-cat-img, .dec-tip-img, .dec-panel-img, .dec-feature-media, .dec-room-frame');
    if (box) box.classList.add('img-failed');
  }, true);

  /* ---------- Touch devices: tap state instead of hover ---------- */
  var canHover = window.matchMedia('(hover: hover)').matches;
  if (!canHover) {
    var cards = $$('.tap-card');
    cards.forEach(function (card) {
      card.addEventListener('touchstart', function () {
        cards.forEach(function (c) { if (c !== card) c.classList.remove('is-active'); });
        card.classList.add('is-active');
      }, { passive: true });
    });
    document.addEventListener('touchstart', function (e) {
      if (!e.target.closest('.tap-card')) cards.forEach(function (c) { c.classList.remove('is-active'); });
    }, { passive: true });
  }

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();