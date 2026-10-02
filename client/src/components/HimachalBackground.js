import React from 'react';

/* Minimal 3D Faceted Deodar / Pine Tree */
function Tree3D({ x, y, scale = 1, opacity = 0.88 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Ground Shadow anchored on mountain */}
      <ellipse cx="0" cy="2" rx="12" ry="3.5" fill="#080c14" opacity="0.75" />
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

/* 3D Mountain Wooden House / Cottage with Glowing Window */
function MountainCottage3D({ x, y, scale = 1, opacity = 0.9 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Ground Shadow */}
      <ellipse cx="14" cy="22" rx="20" ry="5" fill="#080c14" opacity="0.8" />

      {/* Main Cabin Wall (Front) */}
      <polygon points="0,8 24,8 24,22 0,22" fill="#334155" stroke="#475569" strokeWidth="0.8" />
      {/* Cabin Side Wall (Depth facet) */}
      <polygon points="24,8 34,2 34,16 24,22" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />

      {/* 3D Pitched Roof - Left Lit Slope */}
      <polygon points="-4,8 12,-4 28,8" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.8" />
      {/* 3D Pitched Roof - Right Shadow Slope */}
      <polygon points="12,-4 38,-10 38,2 28,8" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
      {/* Snow Ridge on Roof Crest */}
      <line x1="12" y1="-4" x2="38" y2="-10" stroke="#f8fafc" strokeWidth="1.8" strokeLinecap="round" />

      {/* Chimney */}
      <rect x="26" y="-8" width="4" height="6" fill="#1e293b" />
      <rect x="25" y="-9" width="6" height="1.5" fill="#64748b" />

      {/* Cozy Warm Glowing Window (Golden Himachal light) */}
      <rect x="6" y="11" width="8" height="7" rx="1" fill="#f59e0b" />
      {/* Window Crossbar */}
      <line x1="10" y1="11" x2="10" y2="18" stroke="#78350f" strokeWidth="0.8" />
      <line x1="6" y1="14.5" x2="14" y2="14.5" stroke="#78350f" strokeWidth="0.8" />
      {/* Ambient Window Halo Glow */}
      <circle cx="10" cy="14.5" r="9" fill="rgba(245, 158, 11, 0.25)" />

      {/* Cabin Door */}
      <rect x="17" y="13" width="5" height="9" fill="#1e293b" />
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
      {/* Ambient Crimson Glow */}
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
            radial-gradient(1px 1px at 80px 45px, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 220px 85px, rgba(255,255,255,0.85) 50%, transparent 100%),
            radial-gradient(1px 1px at 380px 30px, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(2px 2px at 500px 70px, rgba(255,255,255,0.9) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 640px 110px, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1px 1px at 780px 50px, rgba(255,255,255,0.65) 50%, transparent 100%),
            radial-gradient(2px 2px at 890px 95px, rgba(255,255,255,0.85) 50%, transparent 100%),
            radial-gradient(1px 1px at 980px 40px, rgba(255,255,255,0.6) 50%, transparent 100%)
          `,
          backgroundSize: '1000px 320px',
          opacity: 0.85
        }}
      />

      {/* SINGLE UNIFIED, CLEAN & MAJESTIC VECTOR SCENE */}
      <svg
        viewBox="0 0 1000 520"
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
          <linearGradient id="himaPeakGradClean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="himaSnowCapClean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="himaMidRidgeClean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#1e293b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="himaForeRidgeClean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#1e293b" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#080808" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="himaRoadClean" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="himaHeadlightClean" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* 1. DISTANT HIMALAYAN SNOW PEAKS: One Big Prominent Center Peak + Small Side Peaks */}
        <path
          d="M0 350 L120 270 L260 330 L500 170 L740 330 L880 270 L1000 350 L1000 520 L0 520 Z"
          fill="url(#himaPeakGradClean)"
          stroke="rgba(203, 213, 225, 0.35)"
          strokeWidth="1.2"
        />

        {/* Snow Highlights: Center Big Rohtang Peak + Small Side Peaks */}
        <polygon points="120,270 95,300 145,300" fill="url(#himaSnowCapClean)" />
        <polygon points="500,170 450,235 550,235" fill="url(#himaSnowCapClean)" />
        <polygon points="880,270 855,300 905,300" fill="url(#himaSnowCapClean)" />

        {/* 2. MID-GROUND MOUNTAIN RIDGE */}
        <path
          d="M0 380 Q250 330 500 355 T1000 365 L1000 520 L0 520 Z"
          fill="url(#himaMidRidgeClean)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="1"
        />

        {/* HADIMBA PAGODA TEMPLE (Left-Midground) */}
        <g opacity="0.8" transform="translate(310, 245)">
          <rect x="22" y="72" width="46" height="32" rx="2" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="10,72 45,46 80,72" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
          <polygon points="22,46 45,28 68,46" fill="#cbd5e1" />
          <polygon points="30,28 45,14 60,28" fill="#e2e8f0" />
          <line x1="45" y1="14" x2="45" y2="3" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="45" cy="3" r="3.5" fill="#f59e0b" />
          <circle cx="45" cy="3" r="6" fill="rgba(245, 158, 11, 0.4)" />
        </g>

        {/* 3D MOUNTAIN WOODEN COTTAGE 1 (Left Slope, Cozy Glowing Window) */}
        <MountainCottage3D x={190} y={342} scale={0.9} />

        {/* SHIMLA CHRIST CHURCH (Right-Midground) */}
        <g opacity="0.8" transform="translate(640, 225)">
          <polygon points="0,105 0,78 48,58 96,78 96,105" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
          <rect x="64" y="20" width="28" height="85" rx="1" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="62" y="16" width="6" height="6" fill="#cbd5e1" />
          <rect x="75" y="16" width="6" height="6" fill="#cbd5e1" />
          <rect x="88" y="16" width="6" height="6" fill="#cbd5e1" />
          <polygon points="71,16 77,-2 83,16" fill="#e2e8f0" />
          <line x1="77" y1="-2" x2="77" y2="-10" stroke="#ffffff" strokeWidth="2" />
          <line x1="73" y1="-7" x2="81" y2="-7" stroke="#ffffff" strokeWidth="2" />
          <circle cx="77" cy="38" r="5.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
          <circle cx="77" cy="38" r="9" fill="rgba(255, 255, 255, 0.35)" />
          <path d="M73 56 Q77 48 81 56 L81 68 L73 68 Z" fill="#1e293b" />
          <path d="M16 80 Q22 70 28 80 L28 94 L16 94 Z" fill="#1e293b" />
        </g>

        {/* 3D MOUNTAIN WOODEN COTTAGE 2 (Right Slope, Mountain Cabin) */}
        <MountainCottage3D x={770} y={345} scale={0.82} />

        {/* REDUCED, REFINED 3D DEODAR TREES (Naturally Grounded on Slopes) */}
        {/* Left Slope (by Cottage & Temple) */}
        <Tree3D x={135} y={365} scale={0.8} opacity={0.85} />
        <Tree3D x={265} y={358} scale={0.7} opacity={0.85} />
        <Tree3D x={395} y={355} scale={0.75} opacity={0.88} />

        {/* Right Slope (by Church & Cabin) */}
        <Tree3D x={595} y={355} scale={0.7} opacity={0.85} />
        <Tree3D x={725} y={360} scale={0.8} opacity={0.88} />
        <Tree3D x={855} y={368} scale={0.85} opacity={0.88} />

        {/* 3. FOREGROUND MOUNTAIN ROAD & HILL SLOPES */}
        <path
          d="M0 435 Q280 395 520 420 T1000 430 L1000 520 L0 520 Z"
          fill="url(#himaForeRidgeClean)"
        />

        {/* 2 Foreground Slope Pines (Firmly Rooted on lower hill slope) */}
        <Tree3D x={70} y={425} scale={1.05} opacity={0.95} />
        <Tree3D x={920} y={425} scale={1.05} opacity={0.95} />

        {/* WINDING HIGHWAY RIBBON */}
        <path
          d="M-20 475 Q 260 435, 520 458 T 1020 468"
          stroke="url(#himaRoadClean)"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          d="M-20 459 Q 260 419, 520 442 T 1020 452"
          stroke="rgba(148, 163, 184, 0.4)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 475 Q 260 435, 520 458 T 1020 468"
          stroke="#f8fafc"
          strokeWidth="2"
          strokeDasharray="12 16"
          fill="none"
          opacity="0.75"
        />

        {/* TRAVERSE CAB */}
        <g opacity="0.94" transform="translate(460, 422)">
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
          <polygon points="124,20 180,12 180,28 124,24" fill="url(#himaHeadlightClean)" />
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
