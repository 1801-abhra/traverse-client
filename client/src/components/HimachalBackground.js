import React from 'react';

/* 3D Faceted Deodar Pine Tree (Grounded on Plain) */
function Tree3D({ x, y, scale = 1, opacity = 0.9 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Ground shadow */}
      <ellipse cx="0" cy="2" rx="12" ry="3.5" fill="#080c14" opacity="0.8" />
      {/* Trunk */}
      <polygon points="-2,-2 2,-2 1.5,3 -1.5,3" fill="#1b2333" />

      {/* Tier 3 (Bottom) */}
      <polygon points="0,-14 -18,-2 -1.5,-4" fill="#64748b" />
      <polygon points="0,-14 1.5,-4 18,-2" fill="#334155" />
      <line x1="0" y1="-14" x2="0" y2="-4" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

      {/* Tier 2 */}
      <polygon points="0,-28 -14,-13 -1.5,-15" fill="#718096" />
      <polygon points="0,-28 1.5,-15 14,-13" fill="#3a485a" />
      <line x1="0" y1="-28" x2="0" y2="-15" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

      {/* Tier 1 (Top) */}
      <polygon points="0,-44 -9,-26 -1.5,-28" fill="#8494aa" />
      <polygon points="0,-44 1.5,-28 9,-26" fill="#445468" />
      <line x1="0" y1="-44" x2="0" y2="-28" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />

      {/* Snow Tip */}
      <polygon points="0,-44 -2.5,-36 0,-34" fill="#ffffff" opacity="0.95" />
      <polygon points="0,-44 0,-34 2.5,-36" fill="#cbd5e1" opacity="0.75" />
    </g>
  );
}

/* 3D Mountain Wooden House with Glowing Window */
function MountainCottage3D({ x, y, scale = 1, opacity = 0.92 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Ground Shadow */}
      <ellipse cx="14" cy="22" rx="20" ry="5" fill="#080c14" opacity="0.8" />

      {/* Front Wall */}
      <polygon points="0,8 24,8 24,22 0,22" fill="#334155" stroke="#475569" strokeWidth="0.8" />
      {/* Depth Side Wall */}
      <polygon points="24,8 34,2 34,16 24,22" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />

      {/* 3D Pitched Roof - Left Lit Slope */}
      <polygon points="-4,8 12,-4 28,8" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.8" />
      {/* 3D Pitched Roof - Right Shadow Slope */}
      <polygon points="12,-4 38,-10 38,2 28,8" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
      {/* Snow on Roof Crest */}
      <line x1="12" y1="-4" x2="38" y2="-10" stroke="#f8fafc" strokeWidth="1.8" strokeLinecap="round" />

      {/* Chimney */}
      <rect x="26" y="-8" width="4" height="6" fill="#1e293b" />
      <rect x="25" y="-9" width="6" height="1.5" fill="#64748b" />

      {/* Warm Golden Glowing Window */}
      <rect x="6" y="11" width="8" height="7" rx="1" fill="#f59e0b" />
      <line x1="10" y1="11" x2="10" y2="18" stroke="#78350f" strokeWidth="0.8" />
      <line x1="6" y1="14.5" x2="14" y2="14.5" stroke="#78350f" strokeWidth="0.8" />
      {/* Ambient Golden Glow Halo */}
      <circle cx="10" cy="14.5" r="9" fill="rgba(245, 158, 11, 0.3)" />

      {/* Cabin Door */}
      <rect x="17" y="13" width="5" height="9" fill="#1e293b" />
    </g>
  );
}

/* 3D Faceted Himachali Wooden Pagoda Temple with Golden Spire */
function PagodaTemple3D({ x, y, scale = 1, opacity = 0.92 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Ground Shadow */}
      <ellipse cx="20" cy="38" rx="28" ry="6" fill="#080c14" opacity="0.8" />

      {/* Base Hall - Front Wall */}
      <polygon points="4,22 36,22 36,38 4,38" fill="#334155" stroke="#475569" strokeWidth="0.8" />
      {/* Base Hall - Side Depth Wall */}
      <polygon points="36,22 46,16 46,32 36,38" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />

      {/* Tier 1 Roof (Bottom Pagoda Eaves) */}
      <polygon points="-2,22 20,8 42,22" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="20,8 52,2 52,14 42,22" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
      <line x1="20" y1="8" x2="52" y2="2" stroke="#f8fafc" strokeWidth="1.5" />

      {/* Tier 2 Middle Wall */}
      <polygon points="8,8 32,8 32,16 8,16" fill="#2d3748" />
      <polygon points="32,8 40,3 40,11 32,16" fill="#1a202c" />

      {/* Tier 2 Roof */}
      <polygon points="4,8 20,-2 36,8" fill="#8494aa" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="20,-2 46,-7 46,3 36,8" fill="#3f4d63" stroke="#5a6b82" strokeWidth="0.8" />
      <line x1="20" y1="-2" x2="46" y2="-7" stroke="#f8fafc" strokeWidth="1.5" />

      {/* Tier 3 Top Roof Peak */}
      <polygon points="10,-2 20,-12 30,-2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="20,-12 40,-16 40,-6 30,-2" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
      <line x1="20" y1="-12" x2="40" y2="-16" stroke="#f8fafc" strokeWidth="1.5" />

      {/* Golden Kalash / Brass Spire Finial */}
      <line x1="20" y1="-12" x2="20" y2="-22" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="-22" r="3.5" fill="#f59e0b" />
      <circle cx="20" cy="-22" r="7" fill="rgba(245, 158, 11, 0.35)" />

      {/* Temple Entrance with Warm Golden Light */}
      <polygon points="16,28 24,28 24,38 16,38" fill="#f59e0b" />
      <circle cx="20" cy="33" r="6" fill="rgba(245, 158, 11, 0.25)" />
    </g>
  );
}

function HimachalBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: '#0a0a0a'
      }}
      aria-hidden="true"
    >
      {/* Subtle Ambient Crimson Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '420px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(230, 57, 70, 0.12) 0%, rgba(10, 10, 10, 0) 70%)',
          opacity: 0.85
        }}
      />

      {/* Himalayan Night Starfield */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '320px',
          backgroundImage: `
            radial-gradient(1px 1px at 50px 45px, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 120px 85px, rgba(255,255,255,0.85) 50%, transparent 100%),
            radial-gradient(1px 1px at 200px 30px, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(2px 2px at 250px 70px, rgba(255,255,255,0.9) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 320px 110px, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1px 1px at 390px 50px, rgba(255,255,255,0.65) 50%, transparent 100%),
            radial-gradient(2px 2px at 450px 95px, rgba(255,255,255,0.85) 50%, transparent 100%)
          `,
          backgroundSize: '500px 320px',
          opacity: 0.85
        }}
      />

      {/* PERFECTLY PROPORTIONED VECTOR SCENE */}
      <svg
        viewBox="0 0 500 540"
        preserveAspectRatio="xMidYMax slice"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          maxHeight: '580px'
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Mountain Peak Lit Face (Moonlit Slate Grey) */}
          <linearGradient id="peakLitGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.95" />
          </linearGradient>

          {/* Mountain Peak Shadow Face (Deep Slate) */}
          <linearGradient id="peakShadowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
          </linearGradient>

          {/* 3D Snow Cap Lit Face (Bright Silvery White) */}
          <linearGradient id="snowLitGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.85" />
          </linearGradient>

          {/* 3D Snow Cap Shadow Face (Subtle Cool Grey) */}
          <linearGradient id="snowShadowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.75" />
          </linearGradient>

          {/* Mid Ridge Plain Gradient */}
          <linearGradient id="midRidgeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#1e293b" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
          </linearGradient>

          {/* Foreground Slopes Gradient */}
          <linearGradient id="foreRidgeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.92" />
            <stop offset="60%" stopColor="#1e293b" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#080808" stopOpacity="1" />
          </linearGradient>

          {/* Highway Surface */}
          <linearGradient id="roadSurfaceGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.6" />
          </linearGradient>

          {/* Headlight Beam */}
          <linearGradient id="headlightBeamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. DISTANT HIMALAYAN PEAKS (Extended Deeply Behind Plain)
            ======================================================== */}
        {/* Left Side Peak (x=80, y=240) */}
        <polygon points="80,240 -20,410 80,410" fill="url(#peakLitGrad)" />
        <polygon points="80,240 80,410 180,410" fill="url(#peakShadowGrad)" />
        {/* Left Peak 3D Snow Cap */}
        <polygon points="80,240 45,285 65,275 80,285" fill="url(#snowLitGrad)" />
        <polygon points="80,240 80,285 95,275 115,285" fill="url(#snowShadowGrad)" />
        <line x1="80" y1="240" x2="80" y2="285" stroke="#ffffff" strokeWidth="1" />

        {/* Right Side Peak (x=420, y=240) */}
        <polygon points="420,240 320,410 420,410" fill="url(#peakLitGrad)" />
        <polygon points="420,240 420,410 520,410" fill="url(#peakShadowGrad)" />
        {/* Right Peak 3D Snow Cap */}
        <polygon points="420,240 385,285 405,275 420,285" fill="url(#snowLitGrad)" />
        <polygon points="420,240 420,285 435,275 455,285" fill="url(#snowShadowGrad)" />
        <line x1="420" y1="240" x2="420" y2="285" stroke="#ffffff" strokeWidth="1" />

        {/* BIG PROMINENT CENTER ROHTANG PEAK (x=250, y=160) */}
        <polygon points="250,160 50,420 250,420" fill="url(#peakLitGrad)" />
        <polygon points="250,160 250,420 450,420" fill="url(#peakShadowGrad)" />
        <line x1="250" y1="160" x2="250" y2="335" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />

        {/* Multi-Faceted 3D Snow Cap on Big Center Peak */}
        <polygon points="250,160 180,255 215,240 235,260 250,245" fill="url(#snowLitGrad)" />
        <polygon points="250,160 250,245 265,260 285,240 320,255" fill="url(#snowShadowGrad)" />
        <line x1="250" y1="160" x2="250" y2="245" stroke="#ffffff" strokeWidth="1.5" />

        {/* ========================================================
            2. MID-GROUND MOUNTAIN RIDGE & PLAIN
            ======================================================== */}
        <path
          d="M0 375 Q125 325 250 348 T500 358 L500 540 L0 540 Z"
          fill="url(#midRidgeGrad)"
          stroke="rgba(148, 163, 184, 0.35)"
          strokeWidth="1"
        />

        {/* 3D PAGODA TEMPLE (Left Plain - Full 3D Faceted Structure) */}
        <PagodaTemple3D x={40} y={335} scale={0.82} />

        {/* 3D MOUNTAIN WOODEN COTTAGE 1 (Left Plain with Glowing Golden Window) */}
        <MountainCottage3D x={115} y={355} scale={0.85} />

        {/* 3D MOUNTAIN WOODEN COTTAGE 2 (Right Plain with Glowing Golden Window - Moved Down to Plain) */}
        <MountainCottage3D x={365} y={358} scale={0.85} />

        {/* MINIMAL 3D DEODAR TREES (Grounded on Plain) */}
        {/* Left Plain Trees */}
        <Tree3D x={20} y={375} scale={0.75} opacity={0.88} />
        <Tree3D x={165} y={378} scale={0.72} opacity={0.88} />

        {/* Right Plain Trees (Moved Down to Plain) */}
        <Tree3D x={325} y={380} scale={0.72} opacity={0.88} />
        <Tree3D x={465} y={375} scale={0.75} opacity={0.88} />

        {/* ========================================================
            3. FOREGROUND MOUNTAIN ROAD & HILL SLOPES
            ======================================================== */}
        <path
          d="M0 435 Q140 395 260 420 T500 430 L500 540 L0 540 Z"
          fill="url(#foreRidgeGrad)"
        />

        {/* 2 Foreground Slope Pines (Rooted on Lower Slope) */}
        <Tree3D x={45} y={438} scale={0.95} opacity={0.95} />
        <Tree3D x={455} y={438} scale={0.95} opacity={0.95} />

        {/* WINDING HIGHWAY RIBBON */}
        <path
          d="M-20 480 Q 130 440, 260 463 T 520 473"
          stroke="url(#roadSurfaceGrad)"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          d="M-20 464 Q 130 424, 260 447 T 520 457"
          stroke="rgba(148, 163, 184, 0.4)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 480 Q 130 440, 260 463 T 520 473"
          stroke="#f8fafc"
          strokeWidth="2"
          strokeDasharray="12 16"
          fill="none"
          opacity="0.75"
        />

        {/* TRAVERSE CAB ON MOUNTAIN HIGHWAY */}
        <g opacity="0.95" transform="translate(205, 428) scale(0.92)">
          <path
            d="M0 16 L14 8 Q26 0 46 0 L72 0 Q84 0 96 8 L108 16 L118 17 Q124 18 124 23 L124 30 L0 30 Z"
            fill="#64748b"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <path d="M22 8 L35 2 L56 2 L56 8 Z" fill="#cbd5e1" opacity="0.5" />
          <path d="M60 2 L78 2 L88 8 L60 8 Z" fill="#cbd5e1" opacity="0.5" />
          <rect x="48" y="-4" width="18" height="4.5" rx="1.5" fill="#e63946" />
          <circle cx="57" cy="-2" r="6" fill="rgba(230, 57, 70, 0.55)" />
          <polygon points="124,20 180,12 180,28 124,24" fill="url(#headlightBeamGrad)" />
          <circle cx="123" cy="22" r="2.5" fill="#ffffff" />
          <circle cx="2" cy="22" r="2.5" fill="#ef4444" />
          <circle cx="2" cy="22" r="6" fill="rgba(239, 68, 68, 0.45)" />
          <circle cx="26" cy="30" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="26" cy="30" r="3" fill="#e2e8f0" />
          <circle cx="96" cy="30" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="96" cy="30" r="3" fill="#e2e8f0" />
        </g>
      </svg>

      {/* CULTURAL WATERMARK FOOTER (Responsive & 100% Readable) */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 12px',
          boxSizing: 'border-box',
          pointerEvents: 'none'
        }}
      >
        <span
          className="himachal-tagline-text"
          style={{
            color: '#94a3b8',
            fontSize: '10.5px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            textAlign: 'center',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            textShadow: '0 1px 6px rgba(0, 0, 0, 0.95)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            opacity: 0.9
          }}
        >
          BUILT FOR THE HILLS • HIMACHAL KI APNI CAB SERVICE
        </span>
      </div>
    </div>
  );
}

export default HimachalBackground;
