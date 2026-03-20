import React, { useEffect, useRef } from 'react';

const LINES = [
  { t: 'g', s: '> EXECUTE: bio.exe' }, { t: 'br', s: '' },
  { t: 'b', s: 'Name: Kalpesh Nagare' }, { t: 'w', s: 'Location: Pune, India' },
  { t: 'w', s: 'Role: Software Developer' }, { t: 'w', s: 'Experience: 2+ Years — SaaS & OTT.' },
  { t: 'br', s: '' }, { t: 'b', s: 'Expertise:' },
  { t: 'w', s: '> Frontend architecture' }, { t: 'w', s: '> React.js & TypeScript' },
  { t: 'w', s: '> Secure payment systems' }, { t: 'w', s: '> API design & backend integration' },
];

const COLOR_MAP = { g: 'var(--g)', b: 'var(--b)', w: 'rgba(255,255,255,.82)' };

function SrvDots({ pattern }) {
  return (
    <div className="srv-dots">
      {pattern.map((on, i) => (
        <div key={i} className={`srv-dot ${on ? 'on' : 'off'}`} />
      ))}
    </div>
  );
}

export default function ServerSection() {
  const bioRef = useRef(null);

  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;

    let started = false, li = 0, ci = 0;
    let tid;

    function type() {
      if (li >= LINES.length) {
        const c = document.createElement('span');
        c.className = 't-cursor'; el.appendChild(c); return;
      }
      const L = LINES[li];
      if (L.t === 'br') {
        el.appendChild(document.createElement('br'));
        li++; ci = 0; type(); return;
      }
      let sp = el.querySelector('.cl');
      if (!sp) {
        sp = document.createElement('span');
        sp.style.color = COLOR_MAP[L.t] || '#fff';
        sp.className = 'cl';
        el.appendChild(sp);
        el.appendChild(document.createElement('br'));
      }
      if (ci <= L.s.length) {
        sp.textContent = L.s.slice(0, ci++);
        tid = setTimeout(type, L.t === 'g' ? 50 : 16);
      } else {
        sp.classList.remove('cl'); li++; ci = 0;
        tid = setTimeout(type, 65);
      }
    }

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true; el.innerHTML = '';
        tid = setTimeout(type, 400);
      }
    }, { threshold: 0.3 });

    const section = document.getElementById('server');
    if (section) obs.observe(section);

    return () => {
      obs.disconnect();
      clearTimeout(tid);
    };
  }, []);

  return (
    <section id="server">
      <div className="sec-label rv">Section 02</div>
      <div className="sec-title rv d1">Server Shaft</div>
      <div className="sec-sub rv d2">// Accessing developer biographical data...</div>
      <div className="sec-content rv d3">
        <div className="server-cards">
          <div className="srv-card">
            <span className="srv-card-icon">🗄</span>
            <div className="srv-info">
              <div className="srv-label">DATA_SERVER</div>
              <div className="srv-status">ONLINE</div>
            </div>
            <SrvDots pattern={[1,1,1,1,1,1,1,0,0]} />
          </div>
          <div className="srv-card">
            <span className="srv-card-icon">⚙</span>
            <div className="srv-info">
              <div className="srv-label">PROCESSOR</div>
              <div className="srv-status">ACTIVE</div>
            </div>
            <SrvDots pattern={[1,1,1,1,1,1,1,1,0]} />
          </div>
          <div className="srv-card">
            <span className="srv-card-icon" style={{ color: 'var(--b)' }}>~</span>
            <div className="srv-info">
              <div className="srv-label">UPTIME</div>
              <div className="srv-status">99.9%</div>
            </div>
            <SrvDots pattern={[1,1,1,1,1,1,1,1,1]} />
          </div>
        </div>

        <div className="bio-terminal">
          <div className="bio-bar">
            <div className="h-dots">
              <div className="h-dot" /><div className="h-dot" /><div className="h-dot" />
            </div>
            <div className="bio-title">terminal@kalpesh ~ bio.exe</div>
          </div>
          <div className="bio-body" id="bioBody" ref={bioRef} />
        </div>
      </div>
    </section>
  );
}
