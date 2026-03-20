import React, { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { sec: 'system',   label: 'SYSTEM' },
  { sec: 'server',   label: 'SERVER' },
  { sec: 'neural',   label: 'NEURAL WEB' },
  { sec: 'timeline', label: 'TIMELINE' },
  { sec: 'database', label: 'DATABASE' },
  { sec: 'archive',  label: 'ARCHIVE' },
  { sec: 'core',     label: 'CORE' },
];

export default function Nav() {
  const [open, setOpen]         = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef   = useRef(null);
  const drawerRef= useRef(null);

  // Detect mobile width
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawer on outside touch
  useEffect(() => {
    const onTouch = (e) => {
      if (open && navRef.current && !navRef.current.contains(e.target) &&
          drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('touchstart', onTouch, { passive: true });
    return () => document.removeEventListener('touchstart', onTouch);
  }, [open]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  function scrollToSection(sec) {
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sec);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  }

  return (
    <>
      <nav id="mainNav" ref={navRef} className={open ? 'open' : ''}>
        <div className="nav-inner">
          <div className="nav-brand">&gt;_&nbsp;KN://system</div>

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              id="navBurger"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              style={{ display: 'flex' }}
            >
              <span /><span /><span />
            </button>
          )}

          {/* Desktop nav links */}
          {!isMobile && (
            <ul className="nav-links">
              {NAV_ITEMS.map(({ sec, label }) => (
                <li key={sec}>
                  <a href={`#${sec}`} data-sec={sec} className={sec === 'system' ? 'active' : ''}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      {isMobile && (
        <div id="navDrawer" ref={drawerRef} className={open ? 'open' : ''}>
          {NAV_ITEMS.map(({ sec, label }) => (
            <a key={sec} data-sec={sec} href={`#${sec}`}
               onClick={(e) => { e.preventDefault(); scrollToSection(sec); }}>
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
