// Global Ctrl+K / Cmd+K search modal — backed by Pagefind's static index.
// Loaded on every page; lazy-loads /pagefind/pagefind.js on first activation.
//
// Keyboard: Ctrl/Cmd+K to open · Esc to close · ↑/↓ to navigate · Enter to open.

(function () {
  if (window.__noctisSearchInit) return;
  window.__noctisSearchInit = true;

  let pagefindMod = null;
  let pagefindLoading = null;
  let modal = null;
  let input = null;
  let results = null;
  let currentResults = [];
  let activeIndex = -1;
  let debounceId = null;
  let lastReq = 0;

  function injectStyles() {
    if (document.getElementById('noctis-search-style')) return;
    const css = `
      .noctis-search-overlay {
        position: fixed; inset: 0; z-index: 10002;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        display: flex; align-items: flex-start; justify-content: center;
        padding: 14vh 20px 20px;
        opacity: 0;
        transition: opacity 0.15s ease;
      }
      .noctis-search-overlay.open { opacity: 1; }
      .noctis-search-modal {
        width: 100%; max-width: 620px;
        background: var(--card-bg, #fff);
        border: 0.5px solid var(--card-border, #e0deda);
        border-radius: 8px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.35);
        overflow: hidden;
        font-family: 'Inter', system-ui, sans-serif;
        transform: translateY(-8px); opacity: 0;
        transition: transform 0.18s ease, opacity 0.18s ease;
      }
      .noctis-search-overlay.open .noctis-search-modal {
        transform: translateY(0); opacity: 1;
      }
      .noctis-search-input-wrap {
        display: flex; align-items: center; gap: 10px;
        padding: 14px 18px;
        border-bottom: 0.5px solid var(--card-border, #e0deda);
      }
      .noctis-search-input-wrap svg {
        width: 16px; height: 16px;
        stroke: var(--text-muted, #888); fill: none;
        stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
        flex-shrink: 0;
      }
      .noctis-search-input {
        flex: 1; min-width: 0;
        border: none; outline: none; background: transparent;
        font-family: inherit; font-size: 15px; font-weight: 400;
        color: var(--text-primary, #0f0f0f);
        padding: 4px 0;
      }
      .noctis-search-input::placeholder { color: var(--text-muted, #888); }
      .noctis-search-kbd {
        font-family: 'JetBrains Mono','Inter',monospace;
        font-size: 10px; font-weight: 500;
        padding: 3px 7px; border-radius: 3px;
        background: var(--icon-bg, #f0efe9);
        border: 0.5px solid var(--icon-border, #e0deda);
        color: var(--text-muted, #888);
        flex-shrink: 0;
      }
      .noctis-search-results {
        max-height: 56vh;
        overflow-y: auto;
        padding: 6px;
      }
      .noctis-search-result {
        display: block; padding: 12px 14px; border-radius: 4px;
        text-decoration: none;
        transition: background 0.12s;
        cursor: pointer;
      }
      .noctis-search-result:hover,
      .noctis-search-result.active {
        background: var(--icon-bg, #f0efe9);
      }
      .noctis-search-result-title {
        font-size: 13px; font-weight: 600;
        color: var(--text-primary, #0f0f0f);
        margin-bottom: 4px;
      }
      .noctis-search-result-excerpt {
        font-size: 11px; font-weight: 300; line-height: 1.55;
        color: var(--text-secondary, #555);
      }
      .noctis-search-result-excerpt mark {
        background: rgba(198,61,31,0.18);
        color: inherit; padding: 0 2px; border-radius: 2px;
      }
      .noctis-search-result-url {
        font-family: 'JetBrains Mono','Inter',monospace;
        font-size: 10px; color: var(--text-muted, #aaa);
        margin-top: 4px;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .noctis-search-empty, .noctis-search-loading, .noctis-search-error {
        padding: 30px 18px; text-align: center;
        color: var(--text-muted, #888);
        font-size: 12px; font-weight: 400;
        letter-spacing: 0.04em;
      }
      .noctis-search-hint {
        padding: 10px 18px; font-size: 10px;
        color: var(--text-muted, #888);
        border-top: 0.5px solid var(--card-border, #e0deda);
        font-family: 'JetBrains Mono','Inter',monospace;
        display: flex; gap: 16px; flex-wrap: wrap;
      }
      .noctis-search-hint span { white-space: nowrap; }

      @media (prefers-reduced-motion: reduce) {
        .noctis-search-overlay, .noctis-search-modal { transition: none !important; }
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
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16" y2="16"/></svg>
          <input type="search" class="noctis-search-input" placeholder="Search NOCTIS…" autocomplete="off" spellcheck="false">
          <span class="noctis-search-kbd">ESC</span>
        </div>
        <div class="noctis-search-results"></div>
        <div class="noctis-search-hint">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
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
    results.innerHTML = '<div class="noctis-search-empty">Start typing to search posts and pages.</div>';
  }
  function showLoading() {
    results.innerHTML = '<div class="noctis-search-loading">Searching…</div>';
  }
  function showError(msg) {
    results.innerHTML = '<div class="noctis-search-error">' + msg + '</div>';
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
      results.innerHTML = '<div class="noctis-search-empty">No results for &ldquo;' + escapeHtml(query) + '&rdquo;.</div>';
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
    currentResults.forEach((r, i) => {
      const a = document.createElement('a');
      a.className = 'noctis-search-result' + (i === activeIndex ? ' active' : '');
      a.href = r.url;
      a.dataset.idx = String(i);
      a.innerHTML =
        '<div class="noctis-search-result-title">' + escapeHtml(r.title) + '</div>' +
        '<div class="noctis-search-result-excerpt">' + r.excerpt + '</div>' +
        '<div class="noctis-search-result-url">' + escapeHtml(r.url) + '</div>';
      a.addEventListener('mouseenter', () => {
        activeIndex = i;
        results.querySelectorAll('.noctis-search-result').forEach((el, j) => {
          el.classList.toggle('active', j === i);
        });
      });
      results.appendChild(a);
    });
  }

  function moveActive(delta) {
    if (!currentResults.length) return;
    activeIndex = (activeIndex + delta + currentResults.length) % currentResults.length;
    const cards = results.querySelectorAll('.noctis-search-result');
    cards.forEach((el, j) => el.classList.toggle('active', j === activeIndex));
    const el = cards[activeIndex];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
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
    setTimeout(() => { if (modal) modal.remove(); modal = null; input = null; results = null; }, 180);
  }

  document.addEventListener('keydown', (e) => {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal) close(); else open();
    }
  });
})();
