import React from 'react';

export default function PostFX() {
  return (
    <>
      {/* ── Post-processing overlays ── */}
      <div id="vignette" />
      <div id="scanlines" />
      <div id="grain" />

      {/* ── Section transition pulse ring ── */}
      <div id="section-pulse" />

      {/* ── Custom cursor ── */}
      <div id="cur-dot" />
      <div id="cur-ring" />
      <canvas id="trail-canvas" />

      {/* ── Depth HUD ── */}
      <div id="depth-hud">
        <span className="dh-label">DEPTH</span>
        <div className="dh-track">
          <div className="dh-fill" id="dhFill" />
        </div>
        <span className="dh-num" id="dhNum">0m</span>
      </div>

      {/* ── Warp speed bar ── */}
      <div id="warp-bar" />
    </>
  );
}
