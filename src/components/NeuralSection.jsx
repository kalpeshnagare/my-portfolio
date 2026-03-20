import React, { useEffect, useRef } from 'react';
import { IS_MOBILE } from '../device.js';

const SKILLS = [
  { n: 'JavaScript',    c: 0 }, { n: 'TypeScript',  c: 0 }, { n: 'React.js',   c: 0 },
  { n: 'Redux Toolkit', c: 0 }, { n: 'Redux Saga',  c: 0 }, { n: 'HTML5',       c: 0 },
  { n: 'CSS3',          c: 0 }, { n: 'SCSS',         c: 0 }, { n: 'Material UI', c: 0 },
  { n: 'Node.js',       c: 1 }, { n: 'NestJS',       c: 1 }, { n: 'REST APIs',   c: 1 },
  { n: 'Authentication',c: 1 }, { n: 'Stripe API',   c: 1 },
  { n: 'MongoDB',       c: 2 }, { n: 'SQL',           c: 2 },
  { n: 'Git',           c: 3 }, { n: 'GitHub',        c: 3 }, { n: 'Bitbucket',  c: 3 },
  { n: 'Jira',          c: 3 }, { n: 'Postman',       c: 3 }, { n: 'VS Code',    c: 3 },
];

const COLS = ['#00e5a0', '#06b6d4', '#7c3aed', '#f59e0b'];

function nodeWidth(n) { return Math.max(76, n.length * 7.1 + 22); }
const NH = 27;

function noise(x, y) {
  return Math.sin(x * 1.3 + y * 0.7) * 0.5 + Math.sin(x * 0.8 - y * 1.1) * 0.5;
}

export default function NeuralSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv  = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext('2d');
    const NM  = IS_MOBILE;

    let W = 0, H = 0, nodes = [], pulses = [], running = false;
    let mouseX = -9999, mouseY = -9999;
    let TIME = 0;
    let rafId;

    // roundRect polyfill
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
        this.beginPath();
        this.moveTo(x+r,y);this.lineTo(x+w-r,y);
        this.quadraticCurveTo(x+w,y,x+w,y+r);
        this.lineTo(x+w,y+h-r);this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
        this.lineTo(x+r,y+h);this.quadraticCurveTo(x,y+h,x,y+h-r);
        this.lineTo(x,y+r);this.quadraticCurveTo(x,y,x+r,y);
        this.closePath();
      };
    }

    function build() {
      W = cv.width  = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      const seed = (i, lo, hi) => lo + (((i * 7919 + 13) % 100) / 100) * (hi - lo);
      nodes = SKILLS.map((s, i) => ({
        n: s.n, c: s.c,
        x: seed(i*3+1, 0.07, 0.93) * W,
        y: seed(i*5+3, 0.09, 0.91) * H,
        vx: 0, vy: 0,
        seedX: i * 0.41 + 0.1,
        seedY: i * 0.37 + 2.3,
        hovered: false,
        glowScale: 1,
      }));
      pulses = [];
    }

    function spawnPulse() {
      if (!nodes.length) return;
      let a, b, dx, dy, d, tries = 0;
      do {
        a = nodes[Math.floor(Math.random() * nodes.length)];
        b = nodes[Math.floor(Math.random() * nodes.length)];
        dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx*dx + dy*dy);
        tries++;
      } while ((d > W * 0.22 || a === b) && tries < 20);
      if (tries >= 20) return;
      pulses.push({ a, b, t: 0, speed: 0.008 + Math.random() * 0.012, col: COLS[a.c] });
    }

    function draw() {
      if (!W) return;
      rafId = requestAnimationFrame(draw);
      TIME += 0.008;

      // Node movement
      nodes.forEach((n) => {
        const nx = noise(n.seedX + TIME, n.seedY);
        const ny = noise(n.seedY + TIME, n.seedX - TIME * 0.7);
        n.vx += nx * 0.018;
        n.vy += ny * 0.018;

        const mdx = n.x - mouseX, mdy = n.y - mouseY;
        const md2 = mdx*mdx + mdy*mdy;
        if (md2 < 7200 && md2 > 1) {
          const md  = Math.sqrt(md2);
          const frc = (1 - md / 85) * 2.2;
          n.vx += (mdx / md) * frc;
          n.vy += (mdy / md) * frc;
        }

        n.vx *= 0.88; n.vy *= 0.88;
        n.x  += n.vx;  n.y  += n.vy;

        const pad = 48;
        if (n.x < pad)   { n.x = pad;   n.vx =  Math.abs(n.vx) * 0.6; }
        if (n.x > W-pad) { n.x = W-pad; n.vx = -Math.abs(n.vx) * 0.6; }
        if (n.y < pad)   { n.y = pad;   n.vy =  Math.abs(n.vy) * 0.6; }
        if (n.y > H-pad) { n.y = H-pad; n.vy = -Math.abs(n.vy) * 0.6; }

        n.glowScale += ((n.hovered ? 1.45 : 1.0) - n.glowScale) * 0.12;
      });

      ctx.clearRect(0, 0, W, H);

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < W * 0.22) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.c === b.c ? COLS[a.c] + '2a' : 'rgba(255,255,255,.04)';
            ctx.lineWidth   = a.c === b.c ? 0.9 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Energy pulses
      pulses = pulses.filter((p) => {
        p.t += p.speed;
        if (p.t >= 1) return false;
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const r = 5 * (1 - Math.abs(p.t - 0.5) * 1.8);
        if (r <= 0) return true;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
        grd.addColorStop(0,    p.col + 'ff');
        grd.addColorStop(0.45, p.col + '88');
        grd.addColorStop(1,    'transparent');
        ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        return true;
      });

      // Nodes
      nodes.forEach((n) => {
        const w = nodeWidth(n.n), h = NH;
        const x = n.x - w/2, y = n.y - h/2;
        const col = COLS[n.c], gs = n.glowScale;

        if (gs > 1.02) {
          const glowR = w * 0.65 * gs;
          const grd2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
          grd2.addColorStop(0, col + '28');
          grd2.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd2; ctx.fill();
        }

        ctx.shadowColor = n.hovered ? col : 'transparent';
        ctx.shadowBlur  = n.hovered ? 22 : 0;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 5);
        ctx.fillStyle   = n.hovered ? col + '28' : 'rgba(255,255,255,.04)';
        ctx.fill();
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 5);
        ctx.strokeStyle = n.hovered ? col : col + '55';
        ctx.lineWidth   = n.hovered ? 1.3 : 1;
        ctx.stroke();
        ctx.shadowBlur  = 0;
        ctx.fillStyle   = n.hovered ? '#fff' : col + 'cc';
        ctx.font        = `${n.hovered ? '600' : '400'} ${NM ? '9.5px' : '11px'} "JetBrains Mono",monospace`;
        ctx.textAlign   = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.n, n.x, n.y);
      });

      if (Math.random() < (NM ? 0.004 : 0.008)) spawnPulse();
    }

    const onMouseMove = (e) => {
      const r = cv.getBoundingClientRect();
      mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
      nodes.forEach((n) => {
        const w = nodeWidth(n.n);
        n.hovered = mouseX >= n.x - w/2 && mouseX <= n.x + w/2 && mouseY >= n.y - NH/2 && mouseY <= n.y + NH/2;
      });
    };
    const onMouseLeave = () => {
      mouseX = -9999; mouseY = -9999;
      nodes.forEach((n) => { n.hovered = false; });
    };
    cv.addEventListener('mousemove', onMouseMove);
    cv.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', () => { if (running) build(); });

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !running) {
        running = true; build(); draw(); obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(document.getElementById('neural'));

    return () => {
      cancelAnimationFrame(rafId);
      obs.disconnect();
      cv.removeEventListener('mousemove', onMouseMove);
      cv.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <section id="neural">
      <div className="sec-label rv">Section 03</div>
      <div className="sec-title rv d1">Neural Web</div>
      <div className="sec-sub rv d2">// Mapping skill neural network...</div>
      <div className="neural-wrap rv d3">
        <canvas id="neuralCanvas" ref={canvasRef} />
      </div>
      <div className="neural-legend rv d4">
        <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--g)' }} />Frontend (9)</div>
        <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--b)' }} />Backend (5)</div>
        <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--p)' }} />Database (2)</div>
        <div className="leg-item"><div className="leg-dot" style={{ background: '#f59e0b' }}  />Tools (6)</div>
      </div>
    </section>
  );
}
