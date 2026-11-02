/* =========================================================
   UrbanHaven | Home 2 Premium behaviour (standalone)
   Theme + RTL toggles, mobile menu, hero slider, word-reveal,
   collections rail, product gallery, services accordion,
   testimonials carousel, parallax, counters, toast
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
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

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

  /* ---------- Header shadow, parallax and word reveal on scroll ---------- */
  var header = $('#siteHeader');
  var craft = $('.h2-craft');
  var craftBg = $('#h2CraftBg');
  var wordsEl = $('#h2Words');
  var words = [];
  var ticking = false;

  if (wordsEl) {
    var keys = ['calm', 'personal', 'yours', 'hand', 'solid', 'wood', 'loved'];
    var text = wordsEl.textContent.trim().replace(/\s+/g, ' ');
    wordsEl.setAttribute('aria-label', text);
    wordsEl.textContent = '';
    text.split(' ').forEach(function (w, i, arr) {
      var s = document.createElement('span');
      s.className = 'h2-word';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      var clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (keys.indexOf(clean) !== -1) s.classList.add('is-key');
      wordsEl.appendChild(s);
      if (i < arr.length - 1) wordsEl.appendChild(document.createTextNode(' '));
      words.push(s);
    });
  }

  function onScroll() {
    var vh = window.innerHeight;
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);

    if (craft && craftBg && !reduceMotion) {
      var cr = craft.getBoundingClientRect();
      if (cr.bottom > 0 && cr.top < vh) {
        craftBg.style.transform = 'translate3d(0,' + (cr.top * -0.14).toFixed(1) + 'px,0)';
      }
    }

    if (wordsEl && words.length) {
      var wr = wordsEl.getBoundingClientRect();
      var p = clamp((vh * 0.85 - wr.top) / (wr.height + vh * 0.35), 0, 1);
      var lit = reduceMotion ? words.length : Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) {
        words[i].classList.toggle('is-lit', i < lit);
      }
    }
    ticking = false;
  }
  onScroll();
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);

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
  toast.className = 'h2-toast';
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

  /* ---------- Hero slider ---------- */
  var hero = $('.h2-hero');
  var slides = $$('.h2-slide');
  var progs = $$('.h2-prog');
  var curEl = $('#h2Cur');
  var current = 0;

  function goTo(index) {
    if (!slides.length) return;
    index = (index + slides.length) % slides.length;
    if (index === current && slides[index].classList.contains('is-active')) return;
    current = index;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
    progs.forEach(function (p, i) {
      p.classList.remove('is-active', 'is-done');
      p.setAttribute('aria-selected', String(i === index));
      /* restart the fill animation */
      var bar = p.querySelector('b');
      if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      if (i < index) p.classList.add('is-done');
      if (i === index) p.classList.add('is-active');
    });
    if (curEl) curEl.textContent = ('0' + (index + 1)).slice(-2);
  }

  if (hero && slides.length) {
    var prev = $('#h2Prev');
    var next = $('#h2Next');
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); });
    progs.forEach(function (p) {
      p.addEventListener('click', function () { goTo(parseInt(p.getAttribute('data-i'), 10) || 0); });
    });

    /* autoplay is driven by the progress bar animation finishing */
    progs.forEach(function (p) {
      var bar = p.querySelector('b');
      if (bar) bar.addEventListener('animationend', function () {
        if (p.classList.contains('is-active')) goTo(current + 1);
      });
    });

    hero.addEventListener('mouseenter', function () { hero.classList.add('is-paused'); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('is-paused'); });
    hero.addEventListener('focusin', function () { hero.classList.add('is-paused'); });
    hero.addEventListener('focusout', function () { hero.classList.remove('is-paused'); });

    /* swipe */
    var touchX = null;
    hero.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!hero.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft') goTo(current - 1);
    });
  }

  /* ---------- Collections rail ---------- */
  var rail = $('#h2Rail');
  var railFill = $('#h2RailFill');
  function railStep() {
    var card = $('.h2-coll', rail);
    return card ? card.getBoundingClientRect().width + 24 : 340;
  }
  function updateRail() {
    if (!rail || !railFill) return;
    var max = rail.scrollWidth - rail.clientWidth;
    var ratio = rail.clientWidth / rail.scrollWidth;
    var w = clamp(ratio * 100, 10, 100);
    var pos = max > 0 ? clamp(Math.abs(rail.scrollLeft) / max, 0, 1) : 0;
    railFill.style.width = w + '%';
    railFill.style.insetInlineStart = (pos * (100 - w)) + '%';
  }
  if (rail) {
    var rp = $('#railPrev');
    var rn = $('#railNext');
    var dirSign = function () { return root.getAttribute('dir') === 'rtl' ? -1 : 1; };
    if (rp) rp.addEventListener('click', function () { rail.scrollBy({ left: -railStep() * dirSign(), behavior: 'smooth' }); });
    if (rn) rn.addEventListener('click', function () { rail.scrollBy({ left: railStep() * dirSign(), behavior: 'smooth' }); });
    rail.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    window.addEventListener('load', updateRail);
    updateRail();

    /* mouse drag to scroll */
    var dragging = false, moved = false, startX = 0, startLeft = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false;
      startX = e.clientX; startLeft = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-dragging'); }
      if (moved) rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove('is-dragging');
    });
    rail.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') rail.scrollBy({ left: railStep(), behavior: 'smooth' });
      if (e.key === 'ArrowLeft') rail.scrollBy({ left: -railStep(), behavior: 'smooth' });
    });
  }

  /* ---------- Spotlight: gallery, wishlist ---------- */
  var mainImg = $('#h2Main');
  var thumbs = $$('.h2-thumb');
  thumbs.forEach(function (th) {
    th.addEventListener('click', function () {
      if (th.classList.contains('is-active') || !mainImg) return;
      thumbs.forEach(function (o) { o.classList.toggle('is-active', o === th); });
      mainImg.classList.add('is-swapping');
      setTimeout(function () {
        mainImg.src = th.getAttribute('data-src');
        mainImg.onload = function () { mainImg.classList.remove('is-swapping'); };
        setTimeout(function () { mainImg.classList.remove('is-swapping'); }, 700);
      }, 280);
    });
  });

  var wish = $('#h2Wish');
  if (wish) {
    wish.addEventListener('click', function () {
      var liked = !wish.classList.contains('is-liked');
      wish.classList.toggle('is-liked', liked);
      wish.setAttribute('aria-pressed', String(liked));
      wish.setAttribute('aria-label', liked ? 'Remove from wishlist' : 'Add to wishlist');
      showToast(liked ? 'Haven Cloud Sofa added to wishlist' : 'Removed from wishlist');
    });
  }

  /* ---------- Services accordion ---------- */
  var panels = $$('.h2-panel');
  function openPanel(panel) {
    panels.forEach(function (p) { p.classList.toggle('is-active', p === panel); });
  }
  panels.forEach(function (panel) {
    panel.addEventListener('mouseenter', function () { if (canHover && window.innerWidth > 760) openPanel(panel); });
    panel.addEventListener('focus', function () { openPanel(panel); });
    panel.addEventListener('click', function () { openPanel(panel); });
  });

  /* ---------- Testimonials carousel ---------- */
  var reviews = $('#h2Reviews');
  var quotes = $$('.h2-quote');
  var avatars = $$('.h2-avatar');
  var qi = 0;
  var qTimer = null;
  function showQuote(i) {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, n) { q.classList.toggle('is-active', n === qi); });
    avatars.forEach(function (a, n) {
      a.classList.toggle('is-active', n === qi);
      a.setAttribute('aria-selected', String(n === qi));
    });
  }
  function startQuotes() {
    if (reduceMotion || !quotes.length) return;
    stopQuotes();
    qTimer = setInterval(function () { showQuote(qi + 1); }, 7000);
  }
  function stopQuotes() { if (qTimer) { clearInterval(qTimer); qTimer = null; } }
  if (reviews && quotes.length) {
    var qp = $('#revPrev');
    var qn = $('#revNext');
    if (qp) qp.addEventListener('click', function () { showQuote(qi - 1); startQuotes(); });
    if (qn) qn.addEventListener('click', function () { showQuote(qi + 1); startQuotes(); });
    avatars.forEach(function (a, n) {
      a.addEventListener('click', function () { showQuote(n); startQuotes(); });
    });
    reviews.addEventListener('mouseenter', stopQuotes);
    reviews.addEventListener('mouseleave', startQuotes);
    reviews.addEventListener('focusin', stopQuotes);
    reviews.addEventListener('focusout', startQuotes);
    startQuotes();
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
    var box = img.closest('.h2-media, .h2-coll, .h2-gallery-main, .h2-thumb, .h2-tile, .h2-panel, .h2-craft-bg');
    if (box) box.classList.add('img-failed');
  }, true);

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();