/* Amro Academy prototype: makes every control respond (demo only, no data is saved). */
(function () {
  var toastEl, toastTimer;
  function toast(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#0F172A;color:#fff;' +
        'padding:12px 18px;border-radius:12px;font:600 14px "Plus Jakarta Sans",system-ui,sans-serif;z-index:9999;' +
        'box-shadow:0 8px 24px rgba(15,23,42,.25);max-width:90vw;transition:opacity .2s;opacity:0';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.style.opacity = '0'; }, 2200);
  }
  function label(el) {
    return (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  }
  var done = {
    'approve': 'Approved', 'save': 'Saved', 'send': 'Sent', 'submit': 'Submitted', 'confirm': 'Confirmed',
    'record': 'Recorded', 'assign': 'Assigned', 'start': 'Started', 'invite': 'Invitation sent', 'export': 'Export ready',
    'download': 'Download started', 'request': 'Request sent', 'book': 'Booked', 'join': 'Opening meeting'
  };
  function message(text) {
    var t = text.toLowerCase();
    for (var k in done) if (t.indexOf(k) === 0) return done[k] + ' ✓  (demo)';
    return '“' + text + '” — works in the full system (demo)';
  }

  document.addEventListener('submit', function (e) { e.preventDefault(); toast('Saved ✓  (demo)'); });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button, .slot');
    if (!el) return;

    // Tabs: move the underline
    if (el.classList.contains('tab')) {
      e.preventDefault();
      el.parentElement.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('on'); });
      el.classList.add('on');
      toast('Showing “' + label(el) + '” (demo data)');
      return;
    }
    // Toggles
    if (el.classList.contains('toggle')) {
      var on = el.classList.toggle('on');
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      toast((el.getAttribute('aria-label') || 'Setting') + (on ? ' turned on' : ' turned off'));
      return;
    }
    // Answer / option cards
    if (el.classList.contains('choice')) {
      el.parentElement.querySelectorAll('.choice').forEach(function (c) { c.classList.remove('sel'); c.setAttribute('aria-pressed', 'false'); });
      el.classList.add('sel'); el.setAttribute('aria-pressed', 'true');
      return;
    }
    // Weekly time grid cells
    if (el.classList.contains('slot')) {
      if (el.tagName !== 'BUTTON') return;
      el.classList.toggle('on');
      return;
    }
    // Segmented button groups (one primary among sibling small buttons)
    if (el.tagName === 'BUTTON' && el.classList.contains('sm') && el.parentElement.querySelector('button.btn.sm.primary') && !el.classList.contains('primary')
        && el.parentElement.querySelectorAll('button.btn.sm').length > 1 && !/approve|preview|review/i.test(label(el))) {
      el.parentElement.querySelectorAll('button.btn.sm').forEach(function (b) { b.classList.remove('primary'); });
      el.classList.add('primary');
      toast('Selected: ' + label(el));
      return;
    }
    // Conversation list items: highlight
    if (el.classList.contains('li') && el.getAttribute('href') === '#') {
      e.preventDefault();
      el.parentElement.querySelectorAll('a.li').forEach(function (a) { a.style.background = ''; });
      el.style.background = '#E0F2FE'; el.style.borderRadius = '10px';
      toast('Opened conversation (demo)');
      return;
    }
    // Dead links and plain buttons: give feedback
    var href = el.getAttribute('href');
    if ((el.tagName === 'A' && href === '#') || (el.tagName === 'BUTTON' && el.type !== 'submit')) {
      e.preventDefault();
      var text = label(el);
      if (/^approve$/i.test(text) && el.tagName === 'BUTTON') { el.textContent = 'Approved ✓'; el.disabled = true; }
      toast(message(text || 'Action'));
    }
  });
})();
