// Privacy-friendly analytics via GoatCounter — no cookies, GDPR-safe, open source.
//
// To enable:
//   1. Sign up at https://www.goatcounter.com (free for personal use)
//   2. Set NOCTIS_GC_CODE below to your site code (e.g. 'noctis' if your
//      account lives at noctis.goatcounter.com).
//   3. That's it. CSP on all pages permits gc.zgo.at (count.js) and
//      *.goatcounter.com (the count beacon endpoint).
//
// Honors the Do-Not-Track signal.

const NOCTIS_GC_CODE = '';

if (NOCTIS_GC_CODE && navigator.doNotTrack !== '1' && location.hostname !== 'localhost') {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + NOCTIS_GC_CODE + '.goatcounter.com/count');
  document.head.appendChild(s);
}
