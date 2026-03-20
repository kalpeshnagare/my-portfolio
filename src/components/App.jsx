import React from 'react';
import '../styles/sections.css';

import useScrollState   from '../hooks/useScrollState.js';
import useScrollReveal  from '../hooks/useScrollReveal.js';
import useCursor        from '../hooks/useCursor.js';
import useGlitchEvents  from '../hooks/useGlitchEvents.js';
import useSectionPulse  from '../hooks/useSectionPulse.js';

import ParticleBackground from './ParticleBackground.jsx';
import PostFX             from './PostFX.jsx';
import Nav                from './Nav.jsx';
import HeroSection        from './HeroSection.jsx';
import ServerSection      from './ServerSection.jsx';
import NeuralSection      from './NeuralSection.jsx';
import TimelineSection    from './TimelineSection.jsx';
import DatabaseSection    from './DatabaseSection.jsx';
import ArchiveSection     from './ArchiveSection.jsx';
import CoreSection        from './CoreSection.jsx';

export default function App() {
  /* ── Global systems (write to KN singleton, no re-renders) ── */
  useScrollState();
  useScrollReveal();
  useCursor();
  useGlitchEvents();
  useSectionPulse();

  return (
    <>
      {/* ── Fixed WebGL / 2D canvas background layers ── */}
      <ParticleBackground />

      {/* ── Screen-space post-processing + HUD overlays ── */}
      <PostFX />

      {/* ── Fixed navigation ── */}
      <Nav />

      {/* ── Scrollable page content ── */}
      <div className="page">
        <HeroSection />
        <ServerSection />
        <NeuralSection />
        <TimelineSection />
        <DatabaseSection />
        <ArchiveSection />
        <CoreSection />

        <footer>
          <span style={{ color: 'var(--g)' }}>KN://system</span>
          &nbsp;&middot;&nbsp;
          Kalpesh Nagare &nbsp;&middot;&nbsp; Pune, India &nbsp;&middot;&nbsp; &copy; 2025
        </footer>
      </div>
    </>
  );
}
