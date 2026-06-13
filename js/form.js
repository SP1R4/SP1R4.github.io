// Starlink site-survey form -> Web3Forms (AJAX, no page reload, no inline script).
(function () {
  const form = document.getElementById('survey-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const btn = form.querySelector('button[type="submit"]');
  const t = (k, fb) => (window.NoctisI18n ? window.NoctisI18n.t(k) : fb);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.botcheck && form.botcheck.value) return;          // honeypot tripped
    if (status) { status.className = 'form-status sending'; status.textContent = t('starlink.form.sending', 'Sending…'); }
    if (btn) btn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) throw new Error(res.message || 'error');
        form.reset();
        if (status) { status.className = 'form-status ok'; status.textContent = t('starlink.form.success', "Thanks — I'll get back to you shortly."); }
      })
      .catch(() => {
        if (status) { status.className = 'form-status err'; status.textContent = t('starlink.form.error', 'Something went wrong — please email me directly.'); }
      })
      .finally(() => { if (btn) btn.disabled = false; });
  });
})();
