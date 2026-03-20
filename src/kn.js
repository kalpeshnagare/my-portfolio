/**
 * KN — global scroll/mouse state singleton.
 * All animation systems read from this object each frame.
 * Using a plain object (not React state) avoids any re-render overhead.
 */
const KN = {
  scrollY:   0,
  targetY:   0,
  scrollVel: 0,
  rawVel:    0,
  maxScroll: 1,
  progress:  0,
  mouseX:    0,
  mouseY:    0,
  hovering:  false,
};

export default KN;
