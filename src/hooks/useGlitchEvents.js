import { useEffect } from 'react';
import { IS_MOBILE } from '../device.js';

const GLITCH_CHARS = '!@#$%<>/|█▓▒░';

export default function useGlitchEvents() {
  useEffect(() => {
    if (IS_MOBILE) return;

    const heroName = document.querySelector('.hero-name');

    function fireGlitch() {
      if (!heroName) return;
      heroName.classList.add('glitching');
      document.body.classList.add('glitch-env');

      // Corrupt a random nav link for 300 ms
      const links  = document.querySelectorAll('.nav-links a');
      const target = links[Math.floor(Math.random() * links.length)];
      if (target) {
        const orig = target.textContent;
        target.textContent = orig
          .split('')
          .map((c) =>
            Math.random() < 0.5
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : c
          )
          .join('');
        setTimeout(() => { target.textContent = orig; }, 320);
      }

      setTimeout(() => {
        heroName.classList.remove('glitching');
        document.body.classList.remove('glitch-env');
      }, 420);

      scheduleNext();
    }

    let tid;
    function scheduleNext() {
      tid = setTimeout(fireGlitch, 14000 + Math.random() * 14000);
    }

    // First glitch after 9–14 s
    tid = setTimeout(fireGlitch, 9000 + Math.random() * 5000);

    return () => clearTimeout(tid);
  }, []);
}
