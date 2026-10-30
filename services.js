/* =========================================================
   UrbanHaven | Services page behaviour (standalone)
   Theme + RTL toggles, mobile menu, reveal animations,
   hero counters, FAQ accordion, gallery filter + lightbox,
   touch "tap" states
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
  var canHover = window.matchMedia('(hover: hover)').matches;

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
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  $$('.reveal').forEach(function (el) {
    if (io) io.observe(el); else el.classList.add('in');
  });

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

  /* ---------- FAQ accordion (one open at a time) ---------- */
  var faqItems = $$('.sv-faq-item');
  faqItems.forEach(function (item) {
    var btn = $('.sv-faq-q', item);
    btn.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        var open = other === item ? willOpen : false;
        other.classList.toggle('is-open', open);
        $('.sv-faq-q', other).setAttribute('aria-expanded', String(open));
      });
    });
  });

  /* ---------- Gallery filter ---------- */
  var shots = $$('.sv-shot');
  var filters = $$('.sv-filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      shots.forEach(function (shot) {
        var show = f === 'all' || shot.getAttribute('data-cat') === f;
        if (show) {
          shot.hidden = false;
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { shot.classList.remove('is-out'); });
          });
        } else {
          shot.classList.add('is-out');
          setTimeout(function () {
            if (shot.classList.contains('is-out')) shot.hidden = true;
          }, 380);
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = $('#svLightbox');
  var lbImg = $('#lbImg');
  var lbTitle = $('#lbTitle');
  var lbCount = $('#lbCount');
  var lbList = [];
  var lbIndex = 0;
  var lbTrigger = null;

  function visibleShots() { return shots.filter(function (s) { return !s.hidden; }); }

  function lbShow(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    var shot = lbList[lbIndex];
    lbImg.classList.add('is-loading');
    lbImg.onload = function () { lbImg.classList.remove('is-loading'); };
    lbImg.src = shot.getAttribute('data-full');
    lbImg.alt = $('img', shot).alt;
    lbTitle.textContent = shot.getAttribute('data-title');
    lbCount.textContent = (lbIndex + 1) + ' / ' + lbList.length;
  }
  function lbOpen(shot) {
    lbList = visibleShots();
    lbTrigger = shot;
    lb.hidden = false;
    document.body.classList.add('is-locked');
    lbShow(lbList.indexOf(shot));
    requestAnimationFrame(function () { lb.classList.add('show'); });
    $('#lbClose').focus();
  }
  function lbClose() {
    lb.classList.remove('show');
    document.body.classList.remove('is-locked');
    setTimeout(function () { lb.hidden = true; lbImg.src = ''; }, 400);
    if (lbTrigger) lbTrigger.focus();
  }

  if (lb) {
    shots.forEach(function (shot) {
      shot.addEventListener('click', function () { lbOpen(shot); });
    });
    $('#lbClose').addEventListener('click', lbClose);
    $('#lbPrev').addEventListener('click', function () { lbShow(lbIndex - 1); });
    $('#lbNext').addEventListener('click', function () { lbShow(lbIndex + 1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) lbClose();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') lbShow(lbIndex + (root.getAttribute('dir') === 'rtl' ? -1 : 1));
      if (e.key === 'ArrowLeft') lbShow(lbIndex + (root.getAttribute('dir') === 'rtl' ? 1 : -1));
    });
    var lx = null;
    lb.addEventListener('touchstart', function (e) { lx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (lx === null) return;
      var dx = e.changedTouches[0].clientX - lx;
      if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
      lx = null;
    }, { passive: true });
  }

  /* ---------- Image fallback if a photo fails to load ---------- */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var box = img.closest('.sv-card-media, .sv-shot, .sv-cta-media');
    if (box) box.classList.add('img-failed');
  }, true);

  /* ---------- Touch devices: tap state instead of hover ---------- */
  if (!canHover) {
    var cards = $$('.tap-card');
    cards.forEach(function (c) {
      c.addEventListener('touchstart', function () {
        cards.forEach(function (o) { if (o !== c) o.classList.remove('is-active'); });
        c.classList.add('is-active');
      }, { passive: true });
    });
    document.addEventListener('touchstart', function (e) {
      if (!e.target.closest('.tap-card')) cards.forEach(function (o) { o.classList.remove('is-active'); });
    }, { passive: true });
  }

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();