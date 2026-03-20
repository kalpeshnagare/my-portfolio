import { useEffect } from 'react';
import KN from '../kn.js';
import { IS_TOUCH } from '../device.js';

/**
 * Initialises the inertia scroll system.
 * Reads/writes the KN singleton — no React state, zero re-renders.
 * Must be mounted once at App level.
 */
export default function useScrollState() {
  useEffect(() => {
    if (IS_TOUCH) {
      document.body.style.cursor = 'auto';

      const onScroll = () => { KN.scrollY = window.scrollY; };
      window.addEventListener('scroll', onScroll, { passive: true });

      let prev = 0;
      let rafId;
      function mobileLoop() {
        KN.rawVel    = Math.abs(KN.scrollY - prev);
        KN.scrollVel += (KN.rawVel - KN.scrollVel) * 0.18;
        prev          = KN.scrollY;
        KN.maxScroll  = Math.max(1, document.body.scrollHeight - window.innerHeight);
        KN.progress   = KN.scrollY / KN.maxScroll;
        rafId = requestAnimationFrame(mobileLoop);
      }
      mobileLoop();

      return () => {
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(rafId);
      };
    }

    /* ── DESKTOP: Lenis inertia ── */
    const ease = 0.085;

    const onWheel = (e) => {
      KN.targetY = Math.max(
        0,
        Math.min(KN.targetY + e.deltaY, document.body.scrollHeight - window.innerHeight)
      );
      e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    let prev = 0;
    let rafId;
    function loop() {
      const vel = (KN.targetY - KN.scrollY) * ease;
      KN.scrollY += vel;
      if (Math.abs(vel) < 0.05) KN.scrollY = KN.targetY;
      KN.rawVel    = Math.abs(KN.scrollY - prev);
      KN.scrollVel += (KN.rawVel - KN.scrollVel) * 0.15;
      prev          = KN.scrollY;
      KN.maxScroll  = Math.max(1, document.body.scrollHeight - window.innerHeight);
      KN.progress   = KN.scrollY / KN.maxScroll;
      window.scrollTo(0, KN.scrollY);
      rafId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);
}
