/* =========================================================
   UrbanHaven | Home page behaviour
   Theme toggle, RTL toggle, mobile menu, reveal animations,
   counters, touch "tap" states for cards
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

  /* ---------- Animated counters ---------- */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
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
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

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