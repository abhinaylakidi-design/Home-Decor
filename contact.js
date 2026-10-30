/* =========================================================
   UrbanHaven | Contact page behaviour (standalone)
   Theme toggle, RTL toggle, mobile menu, reveal animations,
   expanding contact tiles, live open status + hours marker,
   form validation, copy-to-clipboard, FAQ accordion, toast
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

  /* ---------- Toast ---------- */
  var toast = document.createElement('div');
  toast.className = 'ct-toast';
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

  /* ---------- Hero tiles: expand the one you hover / focus ---------- */
  var tiles = $$('.ct-tile');
  var canHover = window.matchMedia('(hover: hover)').matches;
  function openTile(tile) {
    tiles.forEach(function (t) { t.classList.toggle('is-open', t === tile); });
  }
  tiles.forEach(function (tile) {
    tile.addEventListener('mouseenter', function () { if (canHover) openTile(tile); });
    tile.addEventListener('focus', function () { openTile(tile); });
  });

  /* ---------- Live open / closed status + "now" marker ---------- */
  var OPEN_H = 10;
  var CLOSE_H = 20;
  function fmtHour(h) {
    var ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 === 0 ? 12 : h % 12;
    return hh + ':00 ' + ap;
  }
  function updateStatus() {
    var now = new Date();
    var h = now.getHours() + now.getMinutes() / 60;
    var isOpen = h >= OPEN_H && h < CLOSE_H;

    var status = $('#ctStatus');
    var text = $('#ctStatusText');
    if (status && text) {
      status.classList.toggle('is-closed', !isOpen);
      text.textContent = isOpen
        ? 'Showroom open now, closes at ' + fmtHour(CLOSE_H)
        : 'Showroom closed, opens at ' + fmtHour(OPEN_H);
    }

    var marker = $('#ctNow');
    var day = $('#ctDay');
    if (marker && day) {
      var track = $('.ct-track', day);
      if (track && h >= 8 && h <= 22) {
        var dayRect = day.getBoundingClientRect();
        var trackRect = track.getBoundingClientRect();
        var pct = (h - 8) / 14;
        marker.style.left = (trackRect.left - dayRect.left + trackRect.width * pct) + 'px';
        marker.classList.add('show');
      } else {
        marker.classList.remove('show');
      }
    }
  }
  updateStatus();
  window.addEventListener('load', updateStatus);
  window.addEventListener('resize', updateStatus);
  setInterval(updateStatus, 60000);

  /* ---------- Contact form validation ---------- */
  var form = $('#contactForm');
  var card = $('#ctFormCard');
  var success = $('#ctSuccess');

  function setError(id, errId, message) {
    var field = $(id).closest('.ct-field');
    var err = $(errId);
    field.classList.toggle('has-error', !!message);
    err.textContent = message || '';
    return !message;
  }

  var validators = {
    cName: function () {
      var v = $('#cName').value.trim();
      return setError('#cName', '#errName', v.length < 2 ? 'Please enter your full name.' : '');
    },
    cEmail: function () {
      var v = $('#cEmail').value.trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      return setError('#cEmail', '#errEmail', ok ? '' : 'Please enter a valid email address.');
    },
    cPhone: function () {
      var v = $('#cPhone').value.trim();
      var digits = v.replace(/\D/g, '');
      var bad = v !== '' && (digits.length < 8 || digits.length > 15 || /[^\d+\s()-]/.test(v));
      return setError('#cPhone', '#errPhone', bad ? 'Please enter a valid phone number.' : '');
    },
    cTopic: function () {
      var v = $('#cTopic').value;
      return setError('#cTopic', '#errTopic', v ? '' : 'Please choose a topic.');
    },
    cMessage: function () {
      var v = $('#cMessage').value.trim();
      return setError('#cMessage', '#errMessage', v.length < 10 ? 'Please write at least a few words (10+ characters).' : '');
    },
    cConsent: function () {
      var ok = $('#cConsent').checked;
      return setError('#cConsent', '#errConsent', ok ? '' : 'Please tick the box so we can contact you.');
    }
  };

  if (form) {
    Object.keys(validators).forEach(function (id) {
      var el = $('#' + id);
      var evt = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'blur';
      el.addEventListener(evt, validators[id]);
      el.addEventListener('input', function () {
        if (el.closest('.ct-field').classList.contains('has-error')) validators[id]();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(validators).forEach(function (id) {
        var ok = validators[id]();
        if (!ok && !firstInvalid) firstInvalid = $('#' + id);
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      /* Front-end only: connect this to your backend / email service here. */
      card.classList.add('is-sent');
      form.reset();
      if (success) success.focus();
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    var again = $('#ctAgain');
    if (again) {
      again.addEventListener('click', function () {
        card.classList.remove('is-sent');
        var first = $('#cName');
        if (first) first.focus();
      });
    }
  }

  /* ---------- Copy email buttons ---------- */
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  $$('.ct-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.getAttribute('data-label') || 'Email';
      function done(ok) {
        if (!ok) { showToast('Could not copy. Please copy it manually.'); return; }
        btn.classList.add('copied');
        showToast(label + ' copied to clipboard');
        setTimeout(function () { btn.classList.remove('copied'); }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
  });

  /* ---------- FAQ accordion (one open at a time) ---------- */
  var faqItems = $$('.ct-faq-item');
  faqItems.forEach(function (item) {
    var btn = $('.ct-faq-q', item);
    btn.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        var isThis = other === item;
        var open = isThis ? willOpen : false;
        other.classList.toggle('is-open', open);
        $('.ct-faq-q', other).setAttribute('aria-expanded', String(open));
      });
    });
  });

  /* ---------- Image fallback if a photo fails to load ---------- */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var box = img.closest('.ct-side-img');
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