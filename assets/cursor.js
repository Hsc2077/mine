/* cursor.js */
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function anim() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(anim);
  })();
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, details summary, .tag, input, textarea'))
      document.body.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, details summary, .tag, input, textarea'))
      document.body.classList.remove('hovering');
  });
})();
