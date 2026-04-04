/* intro.js — cinematic space intro for index.html */
(function () {

  if (sessionStorage.getItem('hs-intro-played') === 'true') {
    // If yes, instantly remove the overlay and show the site
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-done');
    const overlay = document.getElementById('intro-overlay');
    if (overlay) overlay.remove();
    return; // Stop the rest of the script from running
  }

  const overlay   = document.getElementById('intro-overlay');
  const iCanvas   = document.getElementById('intro-canvas');
  if (!overlay || !iCanvas) return;

  const iCtx      = iCanvas.getContext('2d');
  const introText = document.getElementById('intro-text');
  const introBar  = document.getElementById('intro-bar');
  const coordsEl  = document.getElementById('intro-coords');
  const isLight   = document.body.classList.contains('light');

  let iW, iH;
  function resize() { iW = iCanvas.width = window.innerWidth; iH = iCanvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  /* ── Stars ── */
  const NUM_STARS = 300;
  const stars = Array.from({ length: NUM_STARS }, () => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: Math.random(),
    size: Math.random() * 1.4 + 0.3,
    speed: Math.random() * 0.0008 + 0.0003,
    bright: Math.random() * 0.5 + 0.5,
    twinkle: Math.random() * Math.PI * 2,
  }));

  let warpActive = false, warpProgress = 0, warpStart = null;
  const WARP_DURATION = 850;
  let introEnded = false;

  /* ── Light mode: aurora background ── */
  let auroraT = 0;
  function drawAurora(cx, cy) {
    auroraT += 0.008;
    for (let i = 0; i < 3; i++) {
      const off = (i / 3) * Math.PI * 2;
      const g = iCtx.createRadialGradient(
        cx + Math.sin(auroraT + off) * iW * 0.3,
        cy + Math.cos(auroraT * 0.7 + off) * iH * 0.3,
        0,
        cx, cy, iW * 0.8
      );
      const colors = [
        ['rgba(160,255,130,0.06)', 'rgba(160,255,130,0)'],
        ['rgba(100,200,255,0.05)', 'rgba(100,200,255,0)'],
        ['rgba(200,240,160,0.04)', 'rgba(200,240,160,0)'],
      ];
      g.addColorStop(0, colors[i][0]);
      g.addColorStop(1, colors[i][1]);
      iCtx.fillStyle = g;
      iCtx.fillRect(0, 0, iW, iH);
    }
  }

  function drawFrame() {
    const cx = iW / 2, cy = iH / 2;

    // Background
    if (isLight) {
      iCtx.fillStyle = '#f0f4ef';
      iCtx.fillRect(0, 0, iW, iH);
      drawAurora(cx, cy);
    } else {
      iCtx.fillStyle = '#00000a';
      iCtx.fillRect(0, 0, iW, iH);
    }

    // Warp progress
    if (warpActive) {
      if (!warpStart) warpStart = performance.now();
      warpProgress = Math.min((performance.now() - warpStart) / WARP_DURATION, 1);
    }
    const easeWarp = warpProgress * warpProgress;

    stars.forEach(s => {
      s.z -= s.speed + easeWarp * 0.05;
      if (s.z <= 0) { s.z = 1; s.x = (Math.random() - 0.5) * 2; s.y = (Math.random() - 0.5) * 2; }

      const persp = 1 - s.z;
      const sx = cx + s.x * iW * persp * 0.7;
      const sy = cy + s.y * iH * persp * 0.7;
      s.twinkle += 0.04;
      const twinkle = 0.7 + 0.3 * Math.sin(s.twinkle);
      const alpha = persp * s.bright * twinkle;

      if (warpActive) {
        const pp = Math.max(0, persp - 0.07 - easeWarp * 0.28);
        const px = cx + s.x * iW * pp * 0.7;
        const py = cy + s.y * iH * pp * 0.7;
        const sAlpha = Math.min(alpha * (0.4 + easeWarp * 0.6), 1);
        const g = iCtx.createLinearGradient(px, py, sx, sy);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        const streakColor = isLight ? `rgba(26,143,0,${sAlpha})` : `rgba(180,255,160,${sAlpha})`;
        g.addColorStop(1, streakColor);
        iCtx.beginPath(); iCtx.moveTo(px, py); iCtx.lineTo(sx, sy);
        iCtx.strokeStyle = g;
        iCtx.lineWidth = s.size * (1 + easeWarp * 3);
        iCtx.stroke();
      } else {
        iCtx.beginPath();
        iCtx.arc(sx, sy, s.size * (0.5 + persp * 0.8), 0, Math.PI * 2);
        iCtx.fillStyle = isLight
          ? `rgba(26,100,0,${alpha * 0.7})`
          : (s.bright > 0.85 ? `rgba(180,255,160,${alpha})` : `rgba(255,255,255,${alpha})`);
        iCtx.fill();
      }
    });

    // Vignette
    if (!isLight) {
      const vig = iCtx.createRadialGradient(cx, cy, iH * 0.2, cx, cy, iH * 0.85);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,8,0.7)');
      iCtx.fillStyle = vig;
      iCtx.fillRect(0, 0, iW, iH);
    }

    if (!introEnded) requestAnimationFrame(drawFrame);
  }
  requestAnimationFrame(drawFrame);

  /* ── Coord ticker ── */
  const targets = ['37.2296° N', '80.4139° W', 'ALT: 412KM', 'LOCKED'];
  let coordIdx = 0;
  function cycleCoords() {
    if (introEnded) return;
    coordsEl.style.opacity = '0.2';
    setTimeout(() => {
      coordsEl.textContent = targets[coordIdx];
      coordsEl.style.opacity = '1';
      coordIdx++;
      if (coordIdx < targets.length) setTimeout(cycleCoords, 420);
    }, 140);
  }

  /* ── Sequence ── */
  setTimeout(() => { introText.classList.add('show'); cycleCoords(); }, 280);
  setTimeout(() => { introBar.classList.add('grow'); }, 560);
  setTimeout(() => { warpActive = true; }, 1850);
  setTimeout(() => { introText.classList.add('hide'); }, 2050);
  setTimeout(() => {
    introEnded = true;
    overlay.classList.add('fade-out');
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-done');
    sessionStorage.setItem('hs-intro-played', 'true');
  }, 2650);
  setTimeout(() => { overlay.remove(); }, 3600);
})();
