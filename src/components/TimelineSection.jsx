import React from 'react';

export default function TimelineSection() {
  return (
    <section id="timeline">
      <div className="sec-label rv">Section 04</div>
      <div className="sec-title rv d1">Developer Timeline</div>
      <div className="sec-sub rv d2">// Rendering career path data...</div>

      <div className="tl-wrap rv d3">
        <div style={{ position: 'relative', paddingLeft: '26px' }}>
          {/* Vertical connector line */}
          <div style={{
            position: 'absolute', left: '6px', top: '14px', width: '1px', bottom: '14px',
            background: 'linear-gradient(to bottom,var(--g),rgba(6,182,212,.3),rgba(0,229,160,.04))',
          }} />

          {/* Entry 1 — active dot */}
          <div style={{
            position: 'absolute', left: 0, top: '14px',
            width: '13px', height: '13px', borderRadius: '50%',
            background: 'var(--g)',
            boxShadow: '0 0 0 4px rgba(0,229,160,.14),0 0 18px var(--g)',
          }} />

          <div className="tl-entry" style={{ marginBottom: '32px' }}>
            <div className="tl-entry-head">
              <div>
                <div className="tl-role">Software Developer</div>
                <div className="tl-company">Tudip Technologies</div>
              </div>
              <div className="tl-badge" style={{ background: 'rgba(0,229,160,.08)', borderColor: 'rgba(0,229,160,.25)', color: 'var(--g)' }}>
                ◗&nbsp;Apr 2025 &ndash; Present
              </div>
            </div>
            <div className="tl-points">
              <div className="tl-point"><span className="tl-arrow">&gt;</span>Architected scalable multi-portal SaaS platform (BoomCloud) supporting membership enrollment and recurring revenue workflows.</div>
              <div className="tl-point"><span className="tl-arrow">&gt;</span>Built end-to-end Stripe subscription and billing flows &mdash; 3D Secure, recurring payments, automated invoicing.</div>
              <div className="tl-point"><span className="tl-arrow">&gt;</span>Designed modularised RESTful APIs with NestJS and implemented RBAC authentication across frontend and backend.</div>
              <div className="tl-point"><span className="tl-arrow">&gt;</span>Improved system performance via API restructuring, rendering optimisation, and state management refinements.</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '16px' }}>
              {['React.js','TypeScript','NestJS','Stripe API','RBAC'].map(t => <span key={t} className="proj-tag">{t}</span>)}
            </div>
          </div>

          {/* Entry 2 — hollow dot */}
          <div style={{
            position: 'absolute', left: '1px', top: 'calc(14px + 32px + 260px)',
            width: '11px', height: '11px', borderRadius: '50%',
            background: 'transparent', border: '2px solid var(--b)',
            boxShadow: '0 0 12px rgba(6,182,212,.4)',
          }} />

          <div className="tl-entry">
            <div className="tl-entry-head">
              <div>
                <div className="tl-role">Associate Software Developer</div>
                <div className="tl-company">Tudip Technologies</div>
              </div>
              <div className="tl-badge" style={{ background: 'rgba(6,182,212,.07)', borderColor: 'rgba(6,182,212,.22)', color: 'var(--b)' }}>
                Nov 2023 &ndash; Mar 2025 &middot; 1 yr 5 mos
              </div>
            </div>
            <div className="tl-points">
              <div className="tl-point"><span className="tl-arrow" style={{ color: 'var(--b)' }}>&gt;</span>Developed and maintained features for Northwestel TV Plus OTT web app using React.js and Redux Toolkit.</div>
              <div className="tl-point"><span className="tl-arrow" style={{ color: 'var(--b)' }}>&gt;</span>Implemented Live TV, PPV, On-Demand, and rental content workflows with seamless user experience.</div>
              <div className="tl-point"><span className="tl-arrow" style={{ color: 'var(--b)' }}>&gt;</span>Integrated analytics and monitoring tools to track user behaviour metrics and improve engagement.</div>
              <div className="tl-point"><span className="tl-arrow" style={{ color: 'var(--b)' }}>&gt;</span>Resolved 100+ production issues including EPG sync bugs, UI rendering glitches, and performance bottlenecks.</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '16px' }}>
              {['React.js','Redux Toolkit','JavaScript','REST APIs'].map(t => (
                <span key={t} className="proj-tag" style={{ borderColor: 'rgba(6,182,212,.25)', color: 'var(--b)', background: 'rgba(6,182,212,.05)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
