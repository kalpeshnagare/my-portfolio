import React, { useEffect, useRef, useState } from 'react';
import { IS_TOUCH } from '../device.js';

const PROJECTS = [
  {
    id: 'card1',
    icon: '🗄',
    iconStyle: {},
    title: 'BoomCloud',
    cat: 'Multi-Portal Membership SaaS Platform',
    catColor: 'var(--g)',
    desc: 'A scalable multi-portal SaaS platform supporting membership enrollment, subscription automation, and recurring revenue management.',
    tags: ['React.js','TypeScript','NestJS','Stripe','Redux Toolkit'],
    tagStyle: {},
    features: [
      'Stripe payment integration & subscription automation',
      'Role-based dashboards & access control',
      'Reporting modules & analytics',
      'NestJS microservice backend',
      'Recurring revenue management',
      'React frontend interfaces',
    ],
    delay: 'd2',
  },
  {
    id: 'card2',
    icon: '🗄',
    iconStyle: { background: 'rgba(6,182,212,.08)', borderColor: 'rgba(6,182,212,.2)' },
    title: 'Northwestel TV Plus',
    cat: 'OTT Streaming Platform',
    catColor: 'var(--b)',
    desc: 'OTT web streaming platform supporting content playback and analytics with 100+ production issue resolutions.',
    tags: ['React.js','Redux Toolkit','TypeScript','REST APIs'],
    tagStyle: { borderColor: 'rgba(6,182,212,.2)', color: 'var(--b)', background: 'rgba(6,182,212,.04)' },
    features: [
      'Live TV, PPV & On-Demand workflows',
      'Redux Toolkit state management',
      'Analytics & EPG data integration',
      'Content synchronization system',
      '100+ production bug fixes',
      'UI performance optimization',
    ],
    delay: 'd3',
  },
];

function ProjectCard({ project }) {
  const [open, setOpen]     = useState(false);
  const cardRef             = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || IS_TOUCH) return;

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'transform .1s linear';
      card.style.transform  = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateZ(6px)`;
      // Holographic shimmer
      const sx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const sy = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.setProperty('--mx', sx + '%');
      card.style.setProperty('--my', sy + '%');
    };

    const onLeave = () => {
      card.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1)';
      card.style.transform  = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0)';
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const p = project;

  return (
    <div
      ref={cardRef}
      className={`proj-card rv ${p.delay}${open ? ' open' : ''}`}
      id={p.id}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="proj-head">
        <div className="proj-id-wrap">
          <div className="proj-icon-box" style={p.iconStyle}>{p.icon}</div>
          <div>
            <div className="proj-title">{p.title}</div>
            <div className="proj-cat" style={{ color: p.catColor }}>{p.cat}</div>
          </div>
        </div>
        <div className="proj-ext">↗</div>
      </div>
      <div className="proj-desc">{p.desc}</div>
      <div className="proj-tags">
        {p.tags.map((t) => <span key={t} className="proj-tag" style={p.tagStyle}>{t}</span>)}
      </div>
      <div className="proj-features">
        {p.features.map((f) => <div key={f} className="proj-feature">{f}</div>)}
      </div>
      <div className="proj-footer">
        <span>&lt;/&gt; {p.features.length} key features</span>
        <span className="proj-expand">Click to expand</span>
      </div>
    </div>
  );
}

export default function DatabaseSection() {
  return (
    <section id="database">
      <div className="sec-label rv">Section 05</div>
      <div className="sec-title rv d1">Fragmented Database</div>
      <div className="sec-sub rv d2">// Loading project data blocks...</div>
      <div className="proj-grid">
        {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
