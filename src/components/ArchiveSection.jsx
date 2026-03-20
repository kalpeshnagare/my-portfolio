import React from 'react';

const CERTS = [
  'Databricks Certified Generative AI Engineer Associate',
  'Databricks Certified Data Engineer Professional',
  'Certified Ethical Hacker (CEH Practical)',
];

export default function ArchiveSection() {
  return (
    <section id="archive">
      <div className="sec-label rv">Section 06</div>
      <div className="sec-title rv d1">Archive</div>
      <div className="sec-sub rv d2">// Accessing education &amp; certification records...</div>

      <div className="arc-grid">
        {/* Education card */}
        <div className="arc-card rv d2">
          <div className="arc-card-head">
            <div className="arc-icon-box edu">🎓</div>
            <div className="arc-label">Education</div>
          </div>
          <div className="edu-title">Bachelor of Engineering in Information Technology</div>
          <div className="edu-uni">Savitribai Phule Pune University</div>
          <div className="edu-gpa">CGPA: 8.2</div>
        </div>

        {/* Certifications card */}
        <div className="arc-card rv d3">
          <div className="arc-card-head">
            <div className="arc-icon-box cert">🏅</div>
            <div className="arc-label">Certifications</div>
          </div>
          <div className="cert-list">
            {CERTS.map((c) => (
              <div key={c} className="cert-row">
                <span className="cert-shield">◎</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
