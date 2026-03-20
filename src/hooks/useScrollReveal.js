import { useEffect } from 'react';
import KN from '../kn.js';

const SECTION_IDS = ['system', 'server', 'neural', 'timeline', 'database', 'archive', 'core'];

export default function useScrollReveal() {
  useEffect(() => {
    function check() {
      // Reveal elements
      document.querySelectorAll('.rv').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.87) {
          el.classList.add('on');
        }
      });

      // Active nav link
      let cur = SECTION_IDS[0];
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id;
      });
      document.querySelectorAll('.nav-links a').forEach((a) => {
        a.classList.toggle('active', a.dataset.sec === cur);
      });

      // Depth HUD
      const fill = document.getElementById('dhFill');
      const num  = document.getElementById('dhNum');
      const p    = KN.progress;
      if (fill) fill.style.height = p * 100 + '%';
      if (num)  num.textContent   = Math.round(p * 1200) + 'm';
    }

    window.addEventListener('scroll', check, { passive: true });

    // Initial trigger
    setTimeout(() => {
      check();
      const hero = document.querySelector('#system .rv');
      if (hero) hero.classList.add('on');
    }, 300);

    return () => window.removeEventListener('scroll', check);
  }, []);
}
