// Persisted light/dark theme toggle. Applied as early as possible to avoid FOUC.
(function () {
  const saved = localStorage.getItem('noctis_theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('preload-dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.documentElement.classList.contains('preload-dark')) {
    document.body.classList.add('dark');
    document.documentElement.classList.remove('preload-dark');
  }
});

window.toggleTheme = function () {
  document.body.classList.toggle('dark');
  localStorage.setItem('noctis_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};
