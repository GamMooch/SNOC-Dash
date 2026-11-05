'use strict';

(() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const STORE = {
    checks: 'snocHub.checks.v7',
    widgets: 'snocHub.widgets.v7',
    side: 'snocHub.side.v7',
    onCall: 'snocHub.onCall.v7'
  };

  const checks = [
    'Check SNOC rota',
    'Check handover',
    'Log into Remedy',
    'Log into Genesys',
    'Log into StableNet',
    'Check on-call coverage',
    'Check planned changes',
    'Review outstanding escalations'
  ];

  const widgetNames = {
    notices: 'Operational Notices',
    glance: 'Today at a Glance',
    rota: 'SNOC Rota',
    handover: 'Shift Handover',
    oncall: 'NESO On-Call Coverage',
    changes: 'Change Tracker',
    dailyReport: 'Daily Report',
    sherlock: 'Sherlock',
    neso: 'NESO Operations',
    checklist: 'Shift Checklist',
    procedures: 'Procedures',
    quicklinks: 'Quick Links'
  };

  const quickLinks = [
    ['remedy', 'Remedy'],
    ['serviceNow', 'ServiceNow'],
    ['stableNet', 'StableNet'],
    ['genesys', 'Genesys'],
    ['changeTracker', 'Change Tracker'],
    ['sharePoint', 'SharePoint'],
    ['ciscoIq', 'Cisco IQ'],
    ['nesoResources', 'NESO Resources'],
    ['equinix', 'Equinix'],
    ['documentation', 'Documentation'],
    ['changeManagement', 'Change Management']
  ];

  const noticePriority = {
    critical: 4,
    attention: 3,
    information: 2,
    normal: 1
  };

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const safeUrl = url => {
    try {
      return ['http:', 'https:'].includes(new URL(url).protocol);
    } catch {
      return false;
    }
  };

  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { element.hidden = true; }, 3000);
  }

  function openLink(key) {
    const url = SNOC_CONFIG[key];
    if (!url) return toast('Link not configured');
    if (!safeUrl(url)) return toast('Configured link is invalid');
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      const next = text[index + 1];

      if (character === '"' && quoted && next === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (character === ',' && !quoted) {
        row.push(value.trim());
        value = '';
      } else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && next === '\n') index += 1;
        row.push(value.trim());
        if (row.some(cell => cell !== '')) rows.push(row);
        row = [];
        value = '';
      } else {
        value += character;
      }
    }

    row.push(value.trim());
    if (row.some(cell => cell !== '')) rows.push(row);

    const [headers, ...records] = rows;
    if (!headers) return [];
    const keys = headers.map(header => header.toLowerCase().trim());

    return records.map(record => Object.fromEntries(keys.map((key, index) => [key, record[index] || ''])));
  }

  async function renderNotices() {
    const container = $('#noticeContent');
    const badge = $('#noticeBadge');
    if (!container || !badge) return;

    let notices = Array.isArray(SNOC_CONFIG.notices) ? SNOC_CONFIG.notices : [];

    if (SNOC_CONFIG.noticesDocument) {
      try {
        const response = await fetch(SNOC_CONFIG.noticesDocument, { credentials: 'include', cache: 'no-store' });
        if (!response.ok) throw new Error(`Notice document returned ${response.status}`);
        notices = parseCsv(await response.text()).filter(notice => notice.title || notice.message);
      } catch (error) {
        console.warn('Unable to load the shared notice document.', error);
      }
    }

    if (!notices.length) {
      container.innerHTML = `
        <div class="empty">
          ✓
          <span>
            <b>No active notices configured</b>
            <small>Awaiting approved operational source</small>
          </span>
        </div>
      `;
      badge.textContent = 'INFORMATION';
      badge.className = 'notice-information';
      return;
    }

    container.innerHTML = '';
    let highest = 'normal';

    notices.forEach(notice => {
      const level = noticePriority[notice.level] ? notice.level : 'information';
      if (noticePriority[level] > noticePriority[highest]) highest = level;

      const item = document.createElement('article');
      item.className = `notice-item notice-${level}`;

      const indicator = document.createElement('i');
      indicator.setAttribute('aria-hidden', 'true');

      const content = document.createElement('span');
      const title = document.createElement('b');
      const message = document.createElement('small');

      title.textContent = notice.title || 'Operational notice';
      message.textContent = notice.message || '';
      content.append(title, message);
      item.append(indicator, content);
      container.appendChild(item);
    });

    const labels = {
      critical: 'CRITICAL',
      attention: 'ATTENTION',
      normal: 'NORMAL',
      information: 'INFORMATION'
    };

    badge.textContent = labels[highest];
    badge.className = `notice-${highest}`;
  }

  function tick() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB');
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const day = now.toLocaleDateString('en-GB', { weekday: 'long' });

    $('#time').textContent = time;
    $('#glanceTime').textContent = time;
    $('#date').textContent = date;
    $('#day').textContent = day.toUpperCase();
    $('#today').textContent = `${day}, ${date}`;
  }

  function renderChecks() {
    const state = read(STORE.checks, {});
    $('#checks').innerHTML = checks.map((text, index) => `
      <label>
        <input type="checkbox" data-check="${index}" ${state[index] ? 'checked' : ''}>
        ${text}
      </label>
    `).join('');
    updateProgress();
  }

  function updateProgress() {
    $('#progress').textContent = `${$$('#checks input:checked').length} / ${checks.length}`;
  }

  function renderQuickLinks() {
    $('#quick').innerHTML = quickLinks.map(([key, name]) => `
      <button data-link="${key}">${name}</button>
    `).join('');
  }

  function renderOnCallCoverage() {
    const saved = read(STORE.onCall, {});

    $$('.on-call-dropdown').forEach(dropdown => {
      const coverage = dropdown.dataset.onCall;
      const names = SNOC_CONFIG.onCallCoverage?.[coverage] || [];
      const options = $('.on-call-options', dropdown);
      const summary = $('summary b', dropdown);
      const selected = names.filter(name => saved[coverage]?.includes(name));

      options.innerHTML = names.length ? names.map(name => `
        <label>
          <input type="checkbox" value="${escapeHtml(name)}" ${selected.includes(name) ? 'checked' : ''}>
          <span>${escapeHtml(name)}</span>
        </label>
      `).join('') : '<small class="on-call-empty">No names configured</small>';

      summary.textContent = selected.length ? selected.join(', ') : 'Select names';
    });
  }

  function applyWidgets() {
    const defaults = SNOC_CONFIG.widgets || {};
    const overrides = read(STORE.widgets, {});

    $$('[data-widget]').forEach(element => {
      const key = element.dataset.widget;
      const visible = overrides[key] !== undefined ? overrides[key] : defaults[key] !== false;
      element.classList.toggle('widget-hidden', !visible);
    });
  }

  function openSettings() {
    const defaults = SNOC_CONFIG.widgets || {};
    const overrides = read(STORE.widgets, {});

    $('#widgetSettings').innerHTML = Object.entries(widgetNames).map(([key, name]) => {
      const visible = overrides[key] !== undefined ? overrides[key] : defaults[key] !== false;
      return `<label class="widgetOption"><span>${name}</span><input type="checkbox" data-widget-setting="${key}" ${visible ? 'checked' : ''}></label>`;
    }).join('');

    $('#settings').showModal();
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('[data-link]');
    if (link) openLink(link.dataset.link);

    const nav = event.target.closest('[data-go]');
    if (nav) {
      document.getElementById(nav.dataset.go)?.scrollIntoView({ behavior: 'smooth' });
      $$('.nav').forEach(item => item.classList.toggle('active', item === nav));
      $('#sidebar').classList.remove('open');
      $('#overlay').hidden = true;
    }

    if (event.target.closest('[data-settings]')) openSettings();
  });

  $('#search').addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    let visible = 0;

    $$('.searchable').forEach(element => {
      const keywords = `${element.textContent} ${element.dataset.search || ''}`.toLowerCase();
      const match = !query || keywords.includes(query);
      element.classList.toggle('hidden', !match);
      if (match && !element.classList.contains('widget-hidden')) visible += 1;
    });

    $('#none').hidden = visible !== 0;
  });

  $('#checks').addEventListener('change', () => {
    const state = {};
    $$('#checks input').forEach(input => { state[input.dataset.check] = input.checked; });
    localStorage.setItem(STORE.checks, JSON.stringify(state));
    updateProgress();
  });

  $('#resetChecklist').addEventListener('click', () => {
    localStorage.removeItem(STORE.checks);
    renderChecks();
    toast('Checklist reset');
  });

  $('#oncall').addEventListener('change', event => {
    const dropdown = event.target.closest('.on-call-dropdown');
    if (!dropdown) return;

    const coverage = dropdown.dataset.onCall;
    const selected = $$('.on-call-options input:checked', dropdown).map(input => input.value);
    const state = read(STORE.onCall, {});
    state[coverage] = selected;
    localStorage.setItem(STORE.onCall, JSON.stringify(state));
    $('summary b', dropdown).textContent = selected.length ? selected.join(', ') : 'Select names';
  });

  $('#oncall').addEventListener('toggle', event => {
    const opened = event.target.closest('.on-call-dropdown');
    if (!opened?.open) return;
    $$('.on-call-dropdown', $('#oncall')).forEach(dropdown => {
      if (dropdown !== opened) dropdown.open = false;
    });
  }, true);

  $('#widgetSettings').addEventListener('change', () => {
    const state = {};
    $$('[data-widget-setting]').forEach(input => { state[input.dataset.widgetSetting] = input.checked; });
    localStorage.setItem(STORE.widgets, JSON.stringify(state));
    applyWidgets();
  });

  $('#resetWidgets').addEventListener('click', () => {
    localStorage.removeItem(STORE.widgets);
    applyWidgets();
    openSettings();
    toast('Widget visibility reset');
  });

  $('#nesoToggle').addEventListener('click', event => {
    const grid = $('#nesoGrid');
    grid.classList.toggle('hidden');
    event.currentTarget.textContent = grid.classList.contains('hidden') ? 'EXPAND ⌄' : 'COLLAPSE ⌃';
  });

  $('#collapse').addEventListener('click', () => {
    document.body.classList.toggle('collapsed');
    localStorage.setItem(STORE.side, JSON.stringify(document.body.classList.contains('collapsed')));
  });

  $('#mobileMenu').addEventListener('click', () => {
    $('#sidebar').classList.add('open');
    $('#overlay').hidden = false;
  });

  $('#overlay').addEventListener('click', () => {
    $('#sidebar').classList.remove('open');
    $('#overlay').hidden = true;
  });

  document.addEventListener('keydown', event => {
    if (event.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
      event.preventDefault();
      $('#search').focus();
    }
  });

  document.body.classList.toggle('collapsed', read(STORE.side, false));
  renderNotices();
  setInterval(renderNotices, 60000);
  renderChecks();
  renderQuickLinks();
  renderOnCallCoverage();
  applyWidgets();
  tick();
  setInterval(tick, 1000);
})();
