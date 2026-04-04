/* site.js — shared across all pages */

/* ── Apply saved theme immediately (toggler text sync) ── */
(function () {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const saved = localStorage.getItem('hs-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    toggle.textContent = '🌙 Dark';
  }
  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    toggle.textContent = isLight ? '🌙 Dark' : '☀ Light';
    localStorage.setItem('hs-theme', isLight ? 'light' : 'dark');
  });
})();

/* ── Scroll Reveal ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    obs.observe(el);
  });
})();

/* ── Page Transition Links ── */
(function () {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only intercept same-origin, non-anchor, html page links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('//')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('leaving');
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });
  // Fade in on arrival
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('leaving');
  });
})();

/* ── Particle Canvas (index.html only) ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() * 1.5 + 0.5
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = !document.body.classList.contains('light');
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(127,255,110,0.55)' : 'rgba(0,100,0,0.35)';
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = (particles[i].x - particles[j].x) * W;
        const dy = (particles[i].y - particles[j].y) * H;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x * W, particles[i].y * H);
          ctx.lineTo(particles[j].x * W, particles[j].y * H);
          ctx.strokeStyle = isDark
            ? `rgba(127,255,110,${0.12 * (1 - dist / 120)})`
            : `rgba(0,100,0,${0.07 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  canvas.style.opacity = document.body.classList.contains('light') ? '0.2' : '0.35';
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    canvas.style.opacity = document.body.classList.contains('light') ? '0.2' : '0.35';
  });
})();
