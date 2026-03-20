import { useEffect } from 'react';
import { IS_TOUCH } from '../device.js';
import KN from '../kn.js';

export default function useCursor() {
  useEffect(() => {
    if (IS_TOUCH) return;

    const dot   = document.getElementById('cur-dot');
    const ring  = document.getElementById('cur-ring');
    const tc    = document.getElementById('trail-canvas');
    if (!dot || !ring || !tc) return;

    const ctx = tc.getContext('2d');
    let mx = 0, my = 0, rx = 0, ry = 0;
    const trail = [];

    function resize() {
      tc.width  = window.innerWidth;
      tc.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      KN.mouseX = mx; KN.mouseY = my;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      trail.unshift({ x: mx, y: my, l: 1 });
      if (trail.length > 16) trail.pop();
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    // Hover class on interactive elements
    const interactiveSelectors = 'a,button,.proj-card,.srv-card,.contact-row,.arc-card,.tl-entry';
    const interactive = document.querySelectorAll(interactiveSelectors);
    const addHover    = () => document.body.classList.add('hovering');
    const removeHover = () => document.body.classList.remove('hovering');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    let rafId;
    function loop() {
      rx += (mx - rx) / 7;
      ry += (my - ry) / 7;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;

      ctx.clearRect(0, 0, tc.width, tc.height);
      trail.forEach((p) => {
        p.l -= 0.055;
        if (p.l < 0) p.l = 0;
        const r = p.l * 3.2;
        if (r < 0.2 || p.l < 0.01) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,160,${p.l * 0.42})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);
}
