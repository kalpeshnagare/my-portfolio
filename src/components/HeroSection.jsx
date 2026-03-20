import React from 'react';

export default function HeroSection() {
  return (
    <section id="system">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-card rv" id="heroCard">
        <div className="hero-bar">
          <div className="h-dots">
            <div className="h-dot" />
            <div className="h-dot" />
            <div className="h-dot" />
          </div>
          <div className="h-url">💬 kalpesh://portfolio.dev</div>
        </div>
        <div className="hero-body">
          <div className="hero-cmd">&gt;&nbsp;SYSTEM.INITIALIZE()</div>
          <div className="hero-name" data-text="Kalpesh Nagare">Kalpesh Nagare</div>
          <div className="hero-role">Software Developer</div>
          <div className="hero-bio">
            Crafting scalable SaaS platforms and immersive frontend experiences with React,
            TypeScript &amp; NestJS.
          </div>
          <div className="hero-scroll">
            &gt;&nbsp;scroll_to_dive()&nbsp;<span className="hero-caret" />
          </div>
        </div>
      </div>
      <div className="hero-down">⌄</div>
    </section>
  );
}
