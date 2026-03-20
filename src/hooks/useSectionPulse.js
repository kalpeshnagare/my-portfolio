import { useEffect } from 'react';

const SECTION_IDS = ['system', 'server', 'neural', 'timeline', 'database', 'archive', 'core'];

export default function useSectionPulse() {
  useEffect(() => {
    const pulse   = document.getElementById('section-pulse');
    if (!pulse) return;

    let lastSec = '';

    function firePulse(id) {
      if (id === lastSec) return;
      lastSec = id;

      pulse.classList.remove('fire');
      // Force reflow to restart CSS animation
      void pulse.offsetWidth;
      pulse.classList.add('fire');
    }

    const observers = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) firePulse(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);
}
