// NOCTIS visual FX — all opt-in to prefers-reduced-motion.
//   1. Constellation: a drifting network mesh on a fixed background canvas.
//   2. Scroll-reveal: below-the-fold blocks fade up as they enter the viewport.
//   3. Spotlight: a faint accent glow tracks the cursor across cards.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Constellation ─────────────────────────────────────────────── */
  function constellation() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fx-constellation';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, nodes = [], lineRGB = '15,15,15', accent = '#c63d1f', raf = 0;
    const MAXD = 132;

    function readColors() {
      lineRGB = document.body.classList.contains('dark') ? '244,243,239' : '15,15,15';
      accent = (getComputedStyle(document.body).getPropertyValue('--accent').trim()) || '#c63d1f';
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(14, Math.min(72, Math.floor((w * h) / 22000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        accent: i % 9 === 0,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < MAXD) {
            ctx.strokeStyle = `rgba(${lineRGB},${(1 - d / MAXD) * 0.16})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.accent ? 1.7 : 1.1, 0, 7);
        ctx.fillStyle = n.accent ? accent : `rgba(${lineRGB},0.4)`;
        ctx.fill();
      }
    }
    function step() {
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    readColors(); resize();
    if (reduce) { draw(); }
    else { step(); }
    addEventListener('resize', () => { readColors(); resize(); if (reduce) draw(); }, { passive: true });
    new MutationObserver(readColors).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) step();
    });
  }

  /* ── 2. Scroll-reveal ─────────────────────────────────────────────── */
  function reveal() {
    if (reduce) return;
    const SEL = '.section-label,.intro,.areas,.why,.why-list,.service-card,.uc-card,'
      + '.step,.pkg,.pkg-note,.faq-item,.cta,.credential-card,.cert-card,.credentials,.certs';
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('reveal-in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const fold = innerHeight * 0.92;
    document.querySelectorAll(SEL).forEach((el) => {
      if (el.getBoundingClientRect().top > fold) {
        el.style.animation = 'none';     // cancel the one-shot load animation
        el.classList.add('reveal');
        io.observe(el);
      }
    });
  }

  /* ── 3. Cursor spotlight ──────────────────────────────────────────── */
  function spotlight() {
    if (reduce || matchMedia('(hover: none)').matches) return;
    const SEL = '.service-card,.uc-card,.pkg,.project-card,.cert-card';
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest(SEL);
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }, { passive: true });
  }

  function start() { constellation(); reveal(); spotlight(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
