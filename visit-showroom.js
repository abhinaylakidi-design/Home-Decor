/* =========================================================
   UrbanHaven | Visit Showroom page behaviour (standalone)
   Theme toggle, RTL toggle, date + time-slot logic,
   form validation and success state
   ========================================================= */
(function () {
  var d = document.documentElement;
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

  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  /* ---------- Lucide icons ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  renderIcons();
  window.addEventListener('load', renderIcons);

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

  /* ---------- Date + time slots ---------- */
  var dateInput = $('#vDate');
  var timeSelect = $('#vTime');
  var SLOTS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; /* showroom is open 10 AM to 8 PM */

  function pad(n) { return ('0' + n).slice(-2); }
  function toISO(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }
  function slotLabel(h) {
    var ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 === 0 ? 12 : h % 12;
    return hh + ':00 ' + ap;
  }

  var today = new Date();
  var maxDate = new Date();
  maxDate.setDate(today.getDate() + 90);
  dateInput.min = toISO(today);
  dateInput.max = toISO(maxDate);

  function buildSlots() {
    var chosen = dateInput.value;
    var previous = timeSelect.value;
    timeSelect.innerHTML = '';

    if (!chosen) {
      timeSelect.appendChild(new Option('Choose a date first', '', true, true));
      timeSelect.options[0].disabled = true;
      return;
    }

    var now = new Date();
    var isToday = chosen === toISO(now);
    var available = 0;

    var placeholder = new Option('Select a time slot', '', true, true);
    placeholder.disabled = true;
    timeSelect.appendChild(placeholder);

    SLOTS.forEach(function (h) {
      var opt = new Option(slotLabel(h), slotLabel(h));
      /* today: only slots at least one hour ahead */
      if (isToday && h <= now.getHours()) {
        opt.disabled = true;
        opt.textContent = slotLabel(h) + ' (passed)';
      } else {
        available++;
      }
      timeSelect.appendChild(opt);
    });

    if (available === 0) {
      placeholder.textContent = 'No slots left today, pick another date';
    } else if (previous) {
      var keep = Array.prototype.filter.call(timeSelect.options, function (o) { return o.value === previous && !o.disabled; })[0];
      if (keep) timeSelect.value = previous;
    }
  }
  buildSlots();
  dateInput.addEventListener('change', buildSlots);

  /* ---------- Validation ---------- */
  var form = $('#visitForm');
  var card = $('#vsCard');

  function setError(fieldId, errId, message) {
    var el = $(fieldId);
    var field = el.closest('.vs-field');
    field.classList.toggle('has-error', !!message);
    el.setAttribute('aria-invalid', message ? 'true' : 'false');
    $(errId).textContent = message || '';
    return !message;
  }

  var validators = {
    vFirst: function () {
      var v = $('#vFirst').value.trim();
      return setError('#vFirst', '#errFirst', v.length < 2 ? 'Please enter your first name.' : '');
    },
    vLast: function () {
      var v = $('#vLast').value.trim();
      return setError('#vLast', '#errLast', v.length < 1 ? 'Please enter your last name.' : '');
    },
    vEmail: function () {
      var v = $('#vEmail').value.trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      return setError('#vEmail', '#errEmail', ok ? '' : 'Please enter a valid email address.');
    },
    vPhone: function () {
      var v = $('#vPhone').value.trim();
      var digits = v.replace(/\D/g, '');
      var ok = digits.length >= 8 && digits.length <= 15 && !/[^\d+\s()-]/.test(v);
      return setError('#vPhone', '#errPhone', ok ? '' : 'Please enter a valid phone number.');
    },
    vDate: function () {
      var v = dateInput.value;
      var msg = '';
      if (!v) msg = 'Please choose a date.';
      else if (v < dateInput.min) msg = 'Please choose today or a future date.';
      else if (v > dateInput.max) msg = 'Please choose a date within the next 90 days.';
      return setError('#vDate', '#errDate', msg);
    },
    vTime: function () {
      return setError('#vTime', '#errTime', timeSelect.value ? '' : 'Please choose a time slot.');
    },
    vGuests: function () {
      return setError('#vGuests', '#errGuests', $('#vGuests').value ? '' : 'Please select the number of visitors.');
    },
    vInterest: function () {
      return setError('#vInterest', '#errInterest', $('#vInterest').value ? '' : 'Please choose what you are looking for.');
    },
    vConsent: function () {
      return setError('#vConsent', '#errConsent', $('#vConsent').checked ? '' : 'Please tick the box so we can confirm your visit.');
    }
  };

  Object.keys(validators).forEach(function (id) {
    var el = $('#' + id);
    var evt = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'date') ? 'change' : 'blur';
    el.addEventListener(evt, validators[id]);
    el.addEventListener('input', function () {
      if (el.closest('.vs-field').classList.contains('has-error')) validators[id]();
    });
  });
  dateInput.addEventListener('change', function () {
    if (timeSelect.closest('.vs-field').classList.contains('has-error')) validators.vTime();
  });

  /* ---------- Submit ---------- */
  var formWrap = $('#vsFormWrap');
  var success = $('#vsSuccess');
  var summary = $('#vsSummary');
  var successMsg = $('#vsSuccessMsg');

  function prettyDate(iso) {
    var parts = iso.split('-');
    var dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    try {
      return dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(validators).forEach(function (id) {
      var ok = validators[id]();
      if (!ok && !firstInvalid) firstInvalid = $('#' + id);
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    /* Front-end only: send the data to your backend / email service here. */
    var name = $('#vFirst').value.trim();
    successMsg.textContent = 'Thank you, ' + name + '. We will call or email you shortly to confirm your visit.';
    summary.innerHTML =
      '<li><span>Date</span><strong>' + prettyDate(dateInput.value) + '</strong></li>' +
      '<li><span>Time</span><strong>' + timeSelect.value + '</strong></li>' +
      '<li><span>Visitors</span><strong>' + $('#vGuests').value + '</strong></li>' +
      '<li><span>Interested in</span><strong>' + $('#vInterest').value + '</strong></li>';

    formWrap.hidden = true;
    success.hidden = false;
    success.focus();
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  var again = $('#vsAgain');
  if (again) {
    again.addEventListener('click', function () {
      form.reset();
      buildSlots();
      success.hidden = true;
      formWrap.hidden = false;
      $('#vFirst').focus();
    });
  }
})();