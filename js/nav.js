// Renders the shared site nav into <nav id="site-nav"></nav>. Active link is
// determined by the current path. Wires up hamburger and theme toggle without
// inline event handlers (so the page can ship a strict CSP).

(function () {
  const NAV_LINKS = [
    { href: 'services.html', i18n: 'nav.services' },
    { href: 'projects.html', i18n: 'nav.projects' },
    { href: 'blog.html', i18n: 'nav.blog' },
  ];

  const SUN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const MOON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function currentPage() {
    const path = location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  function buildNav(target) {
    const here = currentPage();
    const links = NAV_LINKS.map(l => {
      const active = l.href === here ? ' active' : '';
      return `<a href="${l.href}" class="nav-link${active}" data-i18n="${l.i18n}"></a>`;
    }).join('');

    target.classList.add('site-nav');
    target.setAttribute('data-i18n-attr-aria-label', 'nav.main');
    target.innerHTML = `
      <a href="index.html" class="nav-brand">NOCTIS</a>
      <button class="nav-hamburger" data-i18n-attr-aria-label="nav.toggleMenu" type="button">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links">${links}</div>
      <button class="nav-lang" data-i18n-attr-aria-label="nav.toggleLang" type="button"></button>
      <div class="nav-toggle" data-i18n-attr-aria-label="nav.toggleTheme" role="button" tabindex="0">
        <span class="toggle-icon">${SUN}</span>
        <div class="toggle-track"><div class="toggle-knob"></div></div>
        <span class="toggle-icon">${MOON}</span>
      </div>
    `;

    target.querySelector('.nav-hamburger').addEventListener('click', () => {
      target.classList.toggle('nav-open');
    });

    const langBtn = target.querySelector('.nav-lang');
    function updateLangBtn() {
      langBtn.textContent = (window.NoctisI18n && window.NoctisI18n.getLang() === 'el') ? 'EN' : 'EL';
    }
    updateLangBtn();
    langBtn.addEventListener('click', () => {
      if (window.NoctisI18n) {
        window.NoctisI18n.toggleLang();
        updateLangBtn();
      }
    });
    // Keep the label in sync when language changes automatically (e.g. geo detection).
    document.addEventListener('langchange', updateLangBtn);

    const toggle = target.querySelector('.nav-toggle');
    toggle.addEventListener('click', () => window.toggleTheme && window.toggleTheme());
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.toggleTheme && window.toggleTheme();
      }
    });

    if (window.NoctisI18n) window.NoctisI18n.applyTranslations(target);
  }

  function init() {
    const target = document.getElementById('site-nav');
    if (target) buildNav(target);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
