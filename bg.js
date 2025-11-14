// bg.js - Canvas background animation
(function(){
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = innerWidth, h = innerHeight, t = 0;
  function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  addEventListener('resize', resize);
  resize();

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function getPalette() {
    const cs = getComputedStyle(document.body);
    const s = cs.getPropertyValue('--surface-alt').trim() || '#163832';
    const sa = cs.getPropertyValue('--accent').trim() || '#235347';
    const a = cs.getPropertyValue('--highlight').trim() || '#8eb69b';
    const hi = cs.getPropertyValue('--text').trim() || '#daf1de';
    return { s, sa, a, hi };
  }

  function drawWave(offset, amp, freq, color, speed) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 12) {
      const y = h * 0.6 + Math.sin(x * freq + t * speed + offset) * amp + Math.cos(x * (freq*0.6) + t * speed*0.7) * (amp*0.4);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function animate() {
    t += 0.018;
    ctx.clearRect(0,0,w,h);
    const pal = getPalette();
    drawWave(120, 44, 0.011, hexToRgba(pal.hi || '#daf1de', 0.06), 1.0);
    drawWave(20, 88, 0.009, hexToRgba(pal.a || '#8eb69b', 0.055), 0.75);
    drawWave(-60, 140, 0.007, hexToRgba(pal.sa || '#235347', 0.05), 0.6);
    requestAnimationFrame(animate);
  }

  // observe changes in body class to restart palette if theme changes
  const observer = new MutationObserver(() => { /* palette will be re-read each frame */ });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  animate();
})();
