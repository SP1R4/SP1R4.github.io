// Global Ctrl+K / Cmd+K search modal — backed by Pagefind's static index.
// Loaded on every page; lazy-loads /pagefind/pagefind.js on first activation.
//
// Keyboard: Ctrl/Cmd+K to open · Esc to close · ↑/↓ to navigate · Enter to open.

(function () {
  if (window.__noctisSearchInit) return;
  window.__noctisSearchInit = true;

  const SUGGESTIONS = ['mikrotik', 'hackthebox', 'vlan', 'pentest', 'services'];

  let pagefindMod = null;
  let pagefindLoading = null;
  let modal = null;
  let input = null;
  let results = null;
  let currentResults = [];
  let activeIndex = -1;
  let debounceId = null;
  let lastReq = 0;

  const ICON = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16" y2="16"/></svg>',
    writeup: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
    services: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    projects: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    blog: '<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    privacy: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  };

  function iconForUrl(url) {
    if (!url) return ICON.home;
    if (/\/writeups\//.test(url)) return ICON.writeup;
    if (/services\.html/.test(url)) return ICON.services;
    if (/projects\.html/.test(url)) return ICON.projects;
    if (/blog\.html/.test(url)) return ICON.blog;
    if (/privacy\.html/.test(url)) return ICON.privacy;
    return ICON.home;
  }

  function labelForUrl(url) {
    if (!url) return 'Page';
    if (/\/writeups\//.test(url)) return 'Writeup';
    if (/services\.html/.test(url)) return 'Page · Services';
    if (/projects\.html/.test(url)) return 'Page · Projects';
    if (/blog\.html/.test(url)) return 'Page · Blog';
    if (/privacy\.html/.test(url)) return 'Page · Privacy';
    return 'Page';
  }

  function injectStyles() {
    if (document.getElementById('noctis-search-style')) return;
    const css = `
      .noctis-search-overlay {
        position: fixed; inset: 0; z-index: 10002;
        background: radial-gradient(ellipse at top, rgba(0,0,0,0.55), rgba(0,0,0,0.7));
        backdrop-filter: blur(8px) saturate(1.1);
        -webkit-backdrop-filter: blur(8px) saturate(1.1);
        display: flex; align-items: flex-start; justify-content: center;
        padding: 14vh 20px 20px;
        opacity: 0;
        transition: opacity 0.18s ease;
      }
      .noctis-search-overlay.open { opacity: 1; }

      .noctis-search-modal {
        width: 100%; max-width: 640px;
        background: var(--card-bg, #fff);
        border: 0.5px solid var(--card-border, #e0deda);
        border-radius: 14px;
        box-shadow:
          0 30px 80px rgba(0,0,0,0.45),
          0 0 0 1px rgba(255,255,255,0.04),
          0 0 60px rgba(198,61,31,0.06);
        overflow: hidden;
        font-family: 'Inter', system-ui, sans-serif;
        transform: translateY(-12px) scale(0.985); opacity: 0;
        transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity 0.18s ease;
        position: relative;
      }
      .noctis-search-overlay.open .noctis-search-modal {
        transform: translateY(0) scale(1); opacity: 1;
      }
      .noctis-search-modal::before {
        content: ''; position: absolute; top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(198,61,31,0) 15%,
          rgba(198,61,31,0.55) 50%,
          rgba(198,61,31,0) 85%,
          transparent 100%);
        pointer-events: none;
      }

      .noctis-search-input-wrap {
        display: flex; align-items: center; gap: 12px;
        padding: 18px 22px;
        border-bottom: 0.5px solid var(--card-border, #e0deda);
      }
      .noctis-search-input-wrap > svg {
        width: 18px; height: 18px;
        stroke: var(--text-secondary, #888); fill: none;
        stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
        flex-shrink: 0;
      }
      .noctis-search-input {
        flex: 1; min-width: 0;
        border: none; outline: none; background: transparent;
        font-family: inherit; font-size: 16px; font-weight: 500;
        color: var(--text-primary, #0f0f0f);
        padding: 4px 0;
        letter-spacing: -0.01em;
      }
      .noctis-search-input::placeholder {
        color: var(--text-muted, #888); font-weight: 400;
      }
      .noctis-kbd {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 22px; height: 22px;
        padding: 0 7px;
        font-family: 'JetBrains Mono','SF Mono',Menlo,monospace;
        font-size: 10px; font-weight: 600;
        background: var(--icon-bg, #f0efe9);
        border: 0.5px solid var(--icon-border, #e0deda);
        border-radius: 5px;
        color: var(--text-secondary, #666);
        box-shadow: 0 1px 0 rgba(0,0,0,0.04);
        letter-spacing: 0.04em;
        flex-shrink: 0;
      }

      .noctis-search-results {
        max-height: 56vh;
        overflow-y: auto;
        padding: 6px 6px 4px;
        scrollbar-width: thin;
      }
      .noctis-search-results::-webkit-scrollbar { width: 8px; }
      .noctis-search-results::-webkit-scrollbar-thumb {
        background: var(--card-border, #e0deda);
        border-radius: 4px;
      }

      .noctis-search-section-label {
        font-size: 9px; font-weight: 700;
        letter-spacing: 0.22em; text-transform: uppercase;
        color: var(--text-muted, #888);
        padding: 14px 16px 8px;
      }

      .noctis-search-result {
        display: flex; align-items: flex-start; gap: 14px;
        padding: 12px 14px; border-radius: 8px;
        margin: 2px 0;
        text-decoration: none;
        cursor: pointer;
        position: relative;
        transition: background 0.12s, transform 0.18s;
      }
      .noctis-search-result:hover {
        background: var(--icon-bg, #f0efe9);
      }
      .noctis-search-result.active {
        background: rgba(198,61,31,0.10);
      }
      .noctis-search-result.active::before {
        content: '';
        position: absolute; left: 0; top: 10px; bottom: 10px;
        width: 2.5px; border-radius: 2px;
        background: var(--accent, #c63d1f);
      }

      .noctis-search-result-icon {
        width: 32px; height: 32px;
        border-radius: 7px;
        background: var(--icon-bg, #f0efe9);
        border: 0.5px solid var(--icon-border, #e0deda);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: background 0.15s, border-color 0.15s;
      }
      .noctis-search-result-icon svg {
        width: 15px; height: 15px;
        stroke: var(--icon-stroke, #555); fill: none;
        stroke-width: 1.6;
        stroke-linecap: round; stroke-linejoin: round;
        transition: stroke 0.15s;
      }
      .noctis-search-result.active .noctis-search-result-icon {
        background: var(--accent, #c63d1f);
        border-color: var(--accent, #c63d1f);
      }
      .noctis-search-result.active .noctis-search-result-icon svg {
        stroke: #fff;
      }

      .noctis-search-result-body { flex: 1; min-width: 0; }
      .noctis-search-result-title {
        font-size: 14px; font-weight: 600;
        color: var(--text-primary, #0f0f0f);
        margin-bottom: 3px;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .noctis-search-result-excerpt {
        font-size: 12px; font-weight: 400; line-height: 1.5;
        color: var(--text-secondary, #555);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .noctis-search-result-excerpt mark {
        background: rgba(198,61,31,0.16);
        color: inherit; font-weight: 600;
        padding: 1px 3px; border-radius: 3px;
      }
      .noctis-search-result-kind {
        font-size: 9px; font-weight: 700;
        letter-spacing: 0.16em; text-transform: uppercase;
        color: var(--text-muted, #888);
        margin-bottom: 4px;
      }
      .noctis-search-result.active .noctis-search-result-kind {
        color: var(--accent, #c63d1f);
      }
      .noctis-search-result-arrow {
        flex-shrink: 0; align-self: center;
        width: 16px; height: 16px;
        opacity: 0;
        transition: opacity 0.15s, transform 0.15s;
      }
      .noctis-search-result-arrow svg {
        width: 14px; height: 14px;
        stroke: var(--accent, #c63d1f); fill: none;
        stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
      }
      .noctis-search-result.active .noctis-search-result-arrow {
        opacity: 1; transform: translateX(2px);
      }

      .noctis-search-empty, .noctis-search-loading, .noctis-search-error {
        padding: 42px 24px;
        text-align: center;
      }
      .noctis-search-empty-icon {
        width: 52px; height: 52px;
        margin: 0 auto 16px;
        border-radius: 14px;
        background: var(--icon-bg, #f0efe9);
        border: 0.5px solid var(--icon-border, #e0deda);
        display: flex; align-items: center; justify-content: center;
      }
      .noctis-search-empty-icon svg {
        width: 22px; height: 22px;
        stroke: var(--text-muted, #888); fill: none;
        stroke-width: 1.6;
      }
      .noctis-search-empty-text {
        font-size: 13px; font-weight: 600;
        color: var(--text-secondary, #555);
        margin-bottom: 4px;
      }
      .noctis-search-empty-sub {
        font-size: 11px; font-weight: 400;
        color: var(--text-muted, #888);
        margin-bottom: 18px;
      }
      .noctis-search-suggestions {
        display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;
      }
      .noctis-search-suggestion {
        font-family: inherit; font-size: 11px; font-weight: 500;
        padding: 6px 14px; border-radius: 999px;
        background: transparent;
        border: 0.5px solid var(--card-border, #e0deda);
        color: var(--text-secondary, #666);
        cursor: pointer;
        transition: all 0.15s;
        letter-spacing: 0.02em;
      }
      .noctis-search-suggestion:hover {
        background: var(--accent, #c63d1f);
        border-color: var(--accent, #c63d1f);
        color: #fff;
        transform: translateY(-1px);
      }
      .noctis-search-loading-dots {
        display: inline-flex; gap: 6px;
        margin-bottom: 8px;
      }
      .noctis-search-loading-dots span {
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--accent, #c63d1f);
        opacity: 0.4;
        animation: noctisSearchPulse 1.1s ease-in-out infinite;
      }
      .noctis-search-loading-dots span:nth-child(2) { animation-delay: 0.18s; }
      .noctis-search-loading-dots span:nth-child(3) { animation-delay: 0.36s; }
      @keyframes noctisSearchPulse {
        0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
        40% { opacity: 1; transform: scale(1); }
      }

      .noctis-search-hint {
        padding: 11px 18px;
        font-size: 10px;
        color: var(--text-muted, #888);
        border-top: 0.5px solid var(--card-border, #e0deda);
        display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
      }
      .noctis-search-hint-group {
        display: inline-flex; align-items: center; gap: 6px;
        letter-spacing: 0.04em;
      }
      .noctis-search-hint-group .noctis-kbd {
        min-width: 18px; height: 18px;
        font-size: 9px;
        padding: 0 5px;
      }
      .noctis-search-hint-brand {
        margin-left: auto;
        font-size: 9px; font-weight: 800;
        letter-spacing: 0.22em; color: var(--text-muted, #888);
      }
      .noctis-search-hint-brand strong {
        color: var(--text-secondary, #666);
        font-weight: 900;
      }

      @media (max-width: 540px) {
        .noctis-search-overlay { padding: 8vh 12px 12px; }
        .noctis-search-modal { border-radius: 10px; }
        .noctis-search-input-wrap { padding: 14px 16px; }
        .noctis-search-input { font-size: 15px; }
        .noctis-search-result { padding: 10px 12px; gap: 11px; }
        .noctis-search-hint-brand { display: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        .noctis-search-overlay,
        .noctis-search-modal,
        .noctis-search-result,
        .noctis-search-suggestion,
        .noctis-search-loading-dots span {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
    const s = document.createElement('style');
    s.id = 'noctis-search-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function ensurePagefind() {
    if (pagefindMod) return Promise.resolve(pagefindMod);
    if (pagefindLoading) return pagefindLoading;
    pagefindLoading = import('/pagefind/pagefind.js')
      .then(async (m) => {
        if (m.options) await m.options({ baseUrl: '/' });
        pagefindMod = m;
        return m;
      })
      .catch((err) => {
        pagefindLoading = null;
        throw err;
      });
    return pagefindLoading;
  }

  function buildModal() {
    if (modal) return modal;
    injectStyles();

    const overlay = document.createElement('div');
    overlay.className = 'noctis-search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search NOCTIS');

    overlay.innerHTML = `
      <div class="noctis-search-modal">
        <div class="noctis-search-input-wrap">
          ${ICON.search}
          <input type="search" class="noctis-search-input" placeholder="Search writeups, pages, anything…" autocomplete="off" spellcheck="false">
          <span class="noctis-kbd">ESC</span>
        </div>
        <div class="noctis-search-results"></div>
        <div class="noctis-search-hint">
          <span class="noctis-search-hint-group"><span class="noctis-kbd">↑</span><span class="noctis-kbd">↓</span> navigate</span>
          <span class="noctis-search-hint-group"><span class="noctis-kbd">↵</span> open</span>
          <span class="noctis-search-hint-group"><span class="noctis-kbd">esc</span> close</span>
          <span class="noctis-search-hint-brand"><strong>NOCTIS</strong> · SEARCH</span>
        </div>
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    input = overlay.querySelector('.noctis-search-input');
    results = overlay.querySelector('.noctis-search-results');
    showEmptyState();

    input.addEventListener('input', () => {
      if (debounceId) clearTimeout(debounceId);
      const q = input.value.trim();
      if (!q) { showEmptyState(); return; }
      showLoading();
      debounceId = setTimeout(() => runSearch(q), 140);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveActive(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveActive(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const r = currentResults[activeIndex] || currentResults[0];
        if (r) window.location.href = r.url;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    document.body.appendChild(overlay);
    modal = overlay;
    return overlay;
  }

  function showEmptyState() {
    currentResults = []; activeIndex = -1;
    const chips = SUGGESTIONS.map(s =>
      '<button type="button" class="noctis-search-suggestion" data-suggest="' + escapeHtml(s) + '">' + escapeHtml(s) + '</button>'
    ).join('');
    results.innerHTML =
      '<div class="noctis-search-empty">' +
        '<div class="noctis-search-empty-icon">' + ICON.search + '</div>' +
        '<div class="noctis-search-empty-text">Search NOCTIS</div>' +
        '<div class="noctis-search-empty-sub">Find writeups, services, and pages.</div>' +
        '<div class="noctis-search-suggestions">' + chips + '</div>' +
      '</div>';
    results.querySelectorAll('.noctis-search-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!input) return;
        input.value = btn.dataset.suggest;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      });
    });
  }
  function showLoading() {
    results.innerHTML =
      '<div class="noctis-search-loading">' +
        '<div class="noctis-search-loading-dots"><span></span><span></span><span></span></div>' +
        '<div class="noctis-search-empty-sub">Searching the index…</div>' +
      '</div>';
  }
  function showError(msg) {
    results.innerHTML =
      '<div class="noctis-search-error">' +
        '<div class="noctis-search-empty-text">' + escapeHtml(msg) + '</div>' +
      '</div>';
  }

  async function runSearch(query) {
    const reqId = ++lastReq;
    let pf;
    try {
      pf = await ensurePagefind();
    } catch (e) {
      if (reqId !== lastReq) return;
      showError('Search is unavailable on this page.');
      return;
    }
    let res;
    try {
      res = await pf.search(query);
    } catch (e) {
      if (reqId !== lastReq) return;
      showError('Search failed.');
      return;
    }
    if (reqId !== lastReq) return;

    const top = res.results.slice(0, 8);
    if (!top.length) {
      results.innerHTML =
        '<div class="noctis-search-empty">' +
          '<div class="noctis-search-empty-icon">' + ICON.search + '</div>' +
          '<div class="noctis-search-empty-text">No matches for &ldquo;' + escapeHtml(query) + '&rdquo;</div>' +
          '<div class="noctis-search-empty-sub">Try a different keyword or browse the blog.</div>' +
        '</div>';
      currentResults = []; activeIndex = -1;
      return;
    }
    const datas = await Promise.all(top.map(r => r.data().catch(() => null)));
    if (reqId !== lastReq) return;

    currentResults = datas.filter(Boolean).map(d => ({
      url: d.url,
      title: (d.meta && d.meta.title) || d.url,
      excerpt: d.excerpt || '',
    }));
    activeIndex = currentResults.length ? 0 : -1;
    render();
  }

  function render() {
    results.innerHTML = '';

    const writeups = currentResults.map((r, i) => ({ r, i })).filter(x => /\/writeups\//.test(x.r.url));
    const pages = currentResults.map((r, i) => ({ r, i })).filter(x => !/\/writeups\//.test(x.r.url));

    if (writeups.length) {
      const lbl = document.createElement('div');
      lbl.className = 'noctis-search-section-label';
      lbl.textContent = 'Writeups';
      results.appendChild(lbl);
      writeups.forEach(({ r, i }) => results.appendChild(renderRow(r, i)));
    }
    if (pages.length) {
      const lbl = document.createElement('div');
      lbl.className = 'noctis-search-section-label';
      lbl.textContent = 'Pages';
      results.appendChild(lbl);
      pages.forEach(({ r, i }) => results.appendChild(renderRow(r, i)));
    }
  }

  function renderRow(r, i) {
    const a = document.createElement('a');
    a.className = 'noctis-search-result' + (i === activeIndex ? ' active' : '');
    a.href = r.url;
    a.dataset.idx = String(i);
    a.innerHTML =
      '<div class="noctis-search-result-icon">' + iconForUrl(r.url) + '</div>' +
      '<div class="noctis-search-result-body">' +
        '<div class="noctis-search-result-kind">' + escapeHtml(labelForUrl(r.url)) + '</div>' +
        '<div class="noctis-search-result-title">' + escapeHtml(r.title) + '</div>' +
        '<div class="noctis-search-result-excerpt">' + r.excerpt + '</div>' +
      '</div>' +
      '<div class="noctis-search-result-arrow">' + ICON.arrow + '</div>';
    a.addEventListener('mouseenter', () => {
      activeIndex = i;
      results.querySelectorAll('.noctis-search-result').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.idx, 10) === i);
      });
    });
    return a;
  }

  function moveActive(delta) {
    if (!currentResults.length) return;
    activeIndex = (activeIndex + delta + currentResults.length) % currentResults.length;
    const cards = results.querySelectorAll('.noctis-search-result');
    cards.forEach(el => el.classList.toggle('active', parseInt(el.dataset.idx, 10) === activeIndex));
    const active = results.querySelector('.noctis-search-result.active');
    if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function open() {
    buildModal();
    requestAnimationFrame(() => {
      modal.classList.add('open');
      setTimeout(() => input && input.focus(), 50);
    });
    ensurePagefind().catch(() => {});
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => { if (modal) modal.remove(); modal = null; input = null; results = null; }, 200);
  }

  document.addEventListener('keydown', (e) => {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal) close(); else open();
    }
  });
})();
