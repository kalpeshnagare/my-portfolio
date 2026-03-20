import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import KN from '../kn.js';
import { IS_MOBILE } from '../device.js';

/* roundRect polyfill for older browsers */
function polyfillRoundRect() {
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      this.beginPath();
      this.moveTo(x + r, y); this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r); this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);     this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);         this.quadraticCurveTo(x, y, x + r, y);
      this.closePath();
    };
  }
}

export default function ParticleBackground() {
  const threeRef = useRef(null);  // #cyberCanvas
  const warpRef  = useRef(null);  // #warp-canvas

  /* ── Three.js scene + data dust ── */
  useEffect(() => {
    polyfillRoundRect();
    const M  = IS_MOBILE;
    const cv = threeRef.current;
    if (!cv) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: cv, antialias: false, alpha: false,
      powerPreference: M ? 'low-power' : 'high-performance',
    });
    renderer.setPixelRatio(M ? 1.0 : Math.min(devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x080809, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x080809, 22, 88);
    scene.background = new THREE.Color(0x080809);

    const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
    cam.position.set(0, 0, 15);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const lG = new THREE.PointLight(0x00ff9f, 0.35); lG.position.set(10, 10, 10);   scene.add(lG);
    const lB = new THREE.PointLight(0x00d9ff, 0.25); lB.position.set(-10, -10, 10); scene.add(lB);

    /* ── Data dust ── */
    const dustN    = M ? 120 : 280;
    const dustPos  = new Float32Array(dustN * 3);
    const dustVel  = new Float32Array(dustN);
    const dustPhase= new Float32Array(dustN);
    for (let i = 0; i < dustN; i++) {
      dustPos[i*3]   = (Math.random() - 0.5) * 40;
      dustPos[i*3+1] = (Math.random() - 0.5) * 120;
      dustPos[i*3+2] = (Math.random() - 0.5) * 8 - 4;
      dustVel[i]     = 0.008 + Math.random() * 0.018;
      dustPhase[i]   = Math.random() * Math.PI * 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustPts = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: 0.065, color: 0x00e5a0, transparent: true, opacity: 0.28, sizeAttenuation: true, depthWrite: false,
    }));
    scene.add(dustPts);

    /* ── Stars ── */
    (function() {
      const n = M ? 2000 : 4000;
      const p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const r  = 120 + Math.random() * 80;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        p[i*3]   = r * Math.sin(ph) * Math.cos(th);
        p[i*3+1] = r * Math.sin(ph) * Math.sin(th);
        p[i*3+2] = r * Math.cos(ph);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 0.14, color: 0xffffff, transparent: true, opacity: 0.45, sizeAttenuation: true })));
    })();

    /* ── Micro particle streams ── */
    function makePts(n, spread, speedY, color, size, op) {
      const p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        p[i*3]   = (Math.random() - 0.5) * spread;
        p[i*3+1] = (Math.random() - 0.5) * 300;
        p[i*3+2] = (Math.random() - 0.5) * spread;
      }
      const g   = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ size, color, transparent: true, opacity: op, sizeAttenuation: true }));
      pts.userData = { n, spd: speedY };
      return pts;
    }
    const gPts = makePts(600, 50, 6, 0x00ff9f, 0.07, 0.55);
    const bPts = makePts(300, 60, 3, 0x00d9ff, 0.05, 0.38);
    const pPts = makePts(200, 70, 2, 0x8a2eff, 0.06, 0.32);
    scene.add(gPts); scene.add(bPts); scene.add(pPts);

    /* ── Fragment geometry pool ── */
    const GEO = {
      card:  new THREE.PlaneGeometry(2.2, 1.4),
      panel: new THREE.PlaneGeometry(1.6, 1.0),
      bar:   new THREE.PlaneGeometry(0.06, 1.8),
      cube:  new THREE.BoxGeometry(0.6, 0.6, 0.6),
      line:  new THREE.PlaneGeometry(1.5, 0.055),
    };
    const FRAG_COLORS = [0x00e5a0, 0x00e5a0, 0x00e5a0, 0x06b6d4, 0x06b6d4, 0x7c3aed, 0xf59e0b];

    function mkFrag(layer) {
      const col  = FRAG_COLORS[Math.floor(Math.random() * FRAG_COLORS.length)];
      const type = Math.floor(Math.random() * 5);
      const grp  = new THREE.Group();
      const zMin = [-2, -8, -18][layer];
      const zMax = [4, -4, -10][layer];
      const sMin = [0.7, 0.3, 0.1][layer];
      const sMax = [1.3, 0.7, 0.28][layer];
      const eOp  = [0.62, 0.38, 0.20][layer];
      const fOp  = [0.042, 0.022, 0.009][layer];

      function addMesh(geo, isEdge) {
        const mat = new THREE.MeshBasicMaterial({
          color: col, transparent: true,
          opacity: isEdge ? eOp : fOp,
          wireframe: false, side: THREE.DoubleSide, depthWrite: false,
        });
        mat._base = isEdge ? eOp : fOp;
        return new THREE.Mesh(geo, mat);
      }

      if (type === 0) {
        grp.add(addMesh(GEO.card, true));
        grp.add(addMesh(GEO.card, false));
        const hdr = addMesh(new THREE.PlaneGeometry(2.2, 0.2), false);
        hdr.material.opacity = fOp * 6; hdr.material._base = fOp * 6;
        hdr.position.y = 0.6; grp.add(hdr);
      } else if (type === 1) {
        const bm = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: eOp, side: THREE.DoubleSide, depthWrite: false });
        bm._base = eOp;
        [[0, 0.45, 0.06, 0.12],[0,-0.45,0.06,0.12],[0,0,0.06,0.9],[-0.15,0.45,0.18,0.06],[-0.15,-0.45,0.18,0.06]].forEach(([px,py,pw,ph]) => {
          const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), bm);
          m.position.set(px, py, 0); grp.add(m);
        });
      } else if (type === 2) {
        grp.add(addMesh(GEO.panel, true)); grp.add(addMesh(GEO.panel, false));
        [-0.2, 0, 0.2].forEach((y) => {
          const sl = addMesh(new THREE.PlaneGeometry(1.3, 0.022), true);
          sl.material.opacity = eOp * 0.3; sl.material._base = eOp * 0.3;
          sl.position.set(0, y, 0.001); grp.add(sl);
        });
      } else if (type === 3) {
        grp.add(addMesh(GEO.bar, true)); grp.add(addMesh(GEO.bar, false));
        [-0.6, -0.2, 0.2, 0.6].forEach((y) => {
          const t = addMesh(new THREE.PlaneGeometry(0.18, 0.022), true);
          t.position.set(0, y, 0.001); grp.add(t);
        });
      } else {
        const wf = new THREE.Mesh(GEO.cube, new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: eOp, depthWrite: false }));
        wf.material._base = eOp; grp.add(wf);
        grp.add(addMesh(GEO.cube, false));
      }

      grp.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 80,
        zMin + Math.random() * (zMax - zMin)
      );
      const sc = sMin + Math.random() * (sMax - sMin);
      grp.scale.setScalar(sc);
      const spd = (0.5 + Math.random() * 0.8) * [1.5, 0.9, 0.4][layer];
      grp.userData = {
        layer, spd,
        rx: (Math.random() - 0.5) * 0.0028,
        ry: (Math.random() - 0.5) * 0.0045,
        rz: (Math.random() - 0.5) * 0.002,
        driftSpd:   0.3 + Math.random() * 0.4,
        driftAmt:   (0.08 + Math.random() * 0.1) * [1.3, 0.7, 0.4][layer],
        driftPhase: Math.random() * Math.PI * 2,
        baseX:      grp.position.x,
        density:    1.0,
        glowT:      0,
      };
      return grp;
    }

    const frags = [];
    [25, 30, 25].forEach((n, layer) => {
      for (let i = 0; i < n; i++) { const f = mkFrag(layer); scene.add(f); frags.push(f); }
    });

    /* ── Section density map ── */
    const DENSITY_MAP = { system: 0.12, server: 0.45, neural: 1, timeline: 0.6, database: 0.7, archive: 0.38, core: 0.16 };
    const SECS = Object.keys(DENSITY_MAP);
    let curDensity = 0.12, tgtDensity = 0.12;

    /* ── Cursor repulsion (worldspace) ── */
    let cwX = 9999, cwY = 9999;
    const raycaster  = new THREE.Raycaster();
    const ndcMouse   = new THREE.Vector2();
    const repelPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPt      = new THREE.Vector3();

    const onMouseMove = (e) => {
      ndcMouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      ndcMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', onMouseMove, { passive: true });

    /* ── Animate ── */
    let camY = 0, fov = 60;
    const clock = new THREE.Clock();
    let rafId;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const dt  = Math.min(clock.getDelta(), 0.05);
      const t   = clock.elapsedTime;
      const vel = Math.min(KN.scrollVel / 55, 1);

      // Camera rig
      const tY = -KN.progress * 140;
      camY += (tY - camY) * 0.08;
      cam.position.y = camY;
      cam.position.x = Math.sin(KN.progress * Math.PI * 2) * 3;
      cam.position.z = 15 + Math.sin(KN.progress * Math.PI) * 5;

      // Idle camera breathing
      cam.position.x += Math.sin(t * 0.31 + 1.2) * 0.055;
      cam.position.y += Math.cos(t * 0.23 + 0.8) * 0.038;
      cam.rotation.z  = Math.sin(t * 0.17) * 0.003;

      // FOV warp
      const tFov = Math.min(60 + KN.scrollVel * 0.45, 92);
      fov += (tFov - fov) * 0.09;
      cam.fov = fov; cam.updateProjectionMatrix();

      // Cursor world position
      raycaster.setFromCamera(ndcMouse, cam);
      raycaster.ray.intersectPlane(repelPlane, hitPt);
      cwX = hitPt.x; cwY = hitPt.y;

      // Section density
      let act = SECS[0];
      SECS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.55) act = id;
      });
      tgtDensity  = DENSITY_MAP[act] || 0.5;
      curDensity += (tgtDensity - curDensity) * 0.025;

      // Micro-particles rise
      [gPts, bPts, pPts].forEach((pts) => {
        const arr = pts.geometry.attributes.position.array;
        const n   = pts.userData.n;
        const s   = pts.userData.spd * (1 + vel * 2);
        for (let i = 0; i < n; i++) {
          arr[i*3+1] += dt * s;
          if (arr[i*3+1] > 150) arr[i*3+1] = -150;
        }
        pts.geometry.attributes.position.needsUpdate = true;
      });

      // Fragment physics
      frags.forEach((f) => {
        const ud = f.userData;
        f.position.y += ud.spd * (1 + vel * 2.2) * dt;
        const relY = f.position.y - cam.position.y;
        if (relY > 42)  f.position.y -= 84;
        if (relY < -42) f.position.y += 84;

        f.position.x = ud.baseX + Math.sin(t * ud.driftSpd + ud.driftPhase) * ud.driftAmt * 8;

        const rm = 1 + vel * 3;
        f.rotation.x += ud.rx * rm;
        f.rotation.y += ud.ry * rm;
        f.rotation.z += ud.rz * rm;

        const dx = f.position.x - cwX, dy = f.position.y - cwY;
        const d2 = dx*dx + dy*dy;
        let glow = 0;
        if (d2 < 18 && d2 > 0.01) {
          const d   = Math.sqrt(d2);
          const frc = (1 - d / 4.25) * 0.05;
          f.position.x += (dx / d) * frc;
          f.position.y += (dy / d) * frc;
          glow = (1 - d / 4.25) * 0.5;
          f.rotation.y += 0.022; f.rotation.x += 0.016;
        }
        ud.glowT += (glow - ud.glowT) * 0.1;

        const lb = [1, 0.7, 0.42][ud.layer];
        ud.density += (curDensity * lb - ud.density) * 0.035;
        f.children.forEach((c) => {
          if (!c.material) return;
          const m = c.material;
          if (m._base === undefined) m._base = m.opacity;
          m.opacity = Math.max(0, m._base * ud.density * (1 + ud.glowT * 0.45));
        });
        f.visible = ud.density > 0.01;
      });

      // Warp bar
      const wb = document.getElementById('warp-bar');
      if (wb) KN.scrollVel > 3 ? wb.classList.add('on') : wb.classList.remove('on');

      // Data dust rise
      for (let i = 0; i < dustN; i++) {
        dustPos[i*3+1] += dustVel[i] * (1 + vel * 1.4);
        dustPos[i*3]   += Math.sin(t * 0.6 + dustPhase[i]) * 0.002;
        if (dustPos[i*3+1] > cam.position.y + 62) dustPos[i*3+1] = cam.position.y - 62;
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, cam);
    }
    animate();

    /* ── Resize ── */
    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  /* ── Warp streak canvas ── */
  useEffect(() => {
    if (IS_MOBILE) return;
    const cv = warpRef.current;
    if (!cv) return;

    const ctx = cv.getContext('2d');
    let W, H, cx, cy;

    function resize() {
      W = cv.width  = window.innerWidth;
      H = cv.height = window.innerHeight;
      cx = W / 2; cy = H / 2;
    }
    resize();
    window.addEventListener('resize', resize);

    const streaks = Array.from({ length: 120 }, (_, i) => ({
      ang:   (i / 120) * Math.PI * 2,
      r:     0.3 + Math.random() * 0.7,
      len:   0.02 + Math.random() * 0.07,
      phase: Math.random() * Math.PI * 2,
    }));

    let alpha = 0;
    let rafId;

    function draw() {
      rafId = requestAnimationFrame(draw);
      const vel    = Math.min(KN.scrollVel / 42, 1);
      const target = vel > 0.1 ? Math.min(vel * 0.9, 0.9) : 0;
      alpha += (target - alpha) * 0.07;

      if (alpha < 0.004) { ctx.clearRect(0, 0, W, H); return; }
      ctx.clearRect(0, 0, W, H);

      streaks.forEach((s) => {
        const inner = (0.10 + s.r * 0.36) * Math.min(W, H) * 0.5;
        const outer = inner + (s.len + vel * 0.28) * Math.min(W, H) * 0.5;
        const x1 = cx + Math.cos(s.ang) * inner, y1 = cy + Math.sin(s.ang) * inner;
        const x2 = cx + Math.cos(s.ang) * outer, y2 = cy + Math.sin(s.ang) * outer;
        const g   = ctx.createLinearGradient(x1, y1, x2, y2);
        const col = s.r > 0.65 ? '0,229,160' : s.r > 0.35 ? '6,182,212' : '124,58,237';
        g.addColorStop(0,    `rgba(${col},0)`);
        g.addColorStop(0.45, `rgba(${col},${(alpha * 0.52).toFixed(3)})`);
        g.addColorStop(1,    `rgba(${col},0)`);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = g; ctx.lineWidth = 0.7 + s.r * 0.9; ctx.stroke();
      });
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas id="cyberCanvas" ref={threeRef} />
      <canvas id="warp-canvas" ref={warpRef} />
      <canvas id="data-dust-canvas" style={{ display: 'none' }} />
    </>
  );
}
