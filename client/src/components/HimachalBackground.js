import React from 'react';

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
      {/* Subtle Ambient Crimson-Night Glow */}
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

      {/* SVG HIMACHAL VECTOR ART (Light Grey, Crisp, Aesthetic) */}
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
          {/* Distant Peaks Gradient (Light Slate Grey) */}
          <linearGradient id="himaPeakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
          </linearGradient>

          {/* Snow Cap Highlights */}
          <linearGradient id="himaSnowCap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.4" />
          </linearGradient>

          {/* Mid Ridge Gradient (Medium Slate Grey) */}
          <linearGradient id="himaMidRidge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#1e293b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
          </linearGradient>

          {/* Foreground Slopes Gradient (Defined Dark-Slate Grey) */}
          <linearGradient id="himaForeRidge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#1e293b" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#080808" stopOpacity="1" />
          </linearGradient>

          {/* Road Surface Gradient */}
          <linearGradient id="himaRoadSurface" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.6" />
          </linearGradient>

          {/* Headlight Beam Gradient */}
          <linearGradient id="himaHeadlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* 1. DISTANT HIMALAYAN SNOW PEAKS (Rohtang Pass and Pir Panjal Range) */}
        <path
          d="M0 350 L75 260 L170 320 L275 195 L375 285 L500 170 L620 280 L725 185 L825 295 L915 215 L1000 285 L1000 520 L0 520 Z"
          fill="url(#himaPeakGrad)"
          stroke="rgba(203, 213, 225, 0.35)"
          strokeWidth="1.2"
        />

        {/* Snow Cap Highlights on Mountain Peaks */}
        <polygon points="75,260 55,290 95,290" fill="url(#himaSnowCap)" />
        <polygon points="275,195 245,235 305,235" fill="url(#himaSnowCap)" />
        <polygon points="500,170 460,225 540,225" fill="url(#himaSnowCap)" />
        <polygon points="725,185 695,230 755,230" fill="url(#himaSnowCap)" />
        <polygon points="915,215 890,250 940,250" fill="url(#himaSnowCap)" />

        {/* 2. MID-GROUND MOUNTAIN RIDGE */}
        <path
          d="M0 385 Q250 335 500 355 T1000 365 L1000 520 L0 520 Z"
          fill="url(#himaMidRidge)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="1"
        />

        {/* HADIMBA PAGODA TEMPLE SILHOUETTE (Left-Center, Kullu/Manali wooden pagoda) */}
        <g opacity="0.75" transform="translate(310, 240)">
          {/* Base structure */}
          <rect x="22" y="72" width="46" height="32" rx="2" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
          {/* Tier 1 roof */}
          <polygon points="10,72 45,46 80,72" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
          {/* Tier 2 roof */}
          <polygon points="22,46 45,28 68,46" fill="#cbd5e1" />
          {/* Tier 3 top roof */}
          <polygon points="30,28 45,14 60,28" fill="#e2e8f0" />
          {/* Kalash / Golden Finial */}
          <line x1="45" y1="14" x2="45" y2="3" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="45" cy="3" r="3.5" fill="#f59e0b" />
          <circle cx="45" cy="3" r="6" fill="rgba(245, 158, 11, 0.4)" />
        </g>

        {/* SHIMLA RIDGE AND CHRIST CHURCH SILHOUETTE (Right-Center, Shimla Neo-Gothic landmark) */}
        <g opacity="0.8" transform="translate(630, 220)">
          {/* Main Church Hall */}
          <polygon points="0,105 0,78 48,58 96,78 96,105" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
          {/* Central Bell / Clock Tower */}
          <rect x="64" y="20" width="28" height="85" rx="1" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
          {/* Crenellations */}
          <rect x="62" y="16" width="6" height="6" fill="#cbd5e1" />
          <rect x="75" y="16" width="6" height="6" fill="#cbd5e1" />
          <rect x="88" y="16" width="6" height="6" fill="#cbd5e1" />
          {/* Spire with Cross */}
          <polygon points="71,16 77,-2 83,16" fill="#e2e8f0" />
          <line x1="77" y1="-2" x2="77" y2="-10" stroke="#ffffff" strokeWidth="2" />
          <line x1="73" y1="-7" x2="81" y2="-7" stroke="#ffffff" strokeWidth="2" />
          {/* Glowing Clock Face */}
          <circle cx="77" cy="38" r="5.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
          <circle cx="77" cy="38" r="9" fill="rgba(255, 255, 255, 0.35)" />
          {/* Gothic Windows */}
          <path d="M73 56 Q77 48 81 56 L81 68 L73 68 Z" fill="#1e293b" />
          <path d="M16 80 Q22 70 28 80 L28 94 L16 94 Z" fill="#1e293b" />
        </g>

        {/* KULLU / SHIMLA DEODAR AND PINE TREE GROVES (Light slate grey) */}
        <g opacity="0.7" fill="#64748b" stroke="#94a3b8" strokeWidth="0.6">
          {/* Left Forest Group */}
          <polygon points="70,390 77,330 84,390" />
          <polygon points="68,365 77,315 86,365" />
          <polygon points="72,340 77,300 82,340" />
          <polygon points="95,395 103,325 111,395" />
          <polygon points="93,360 103,305 113,360" />
          <polygon points="125,400 131,345 137,400" />

          {/* Center-Left Cluster */}
          <polygon points="260,395 268,335 276,395" />
          <polygon points="258,365 268,315 278,365" />
          <polygon points="395,400 402,340 409,400" />
          <polygon points="393,370 402,320 411,370" />

          {/* Center-Right Cluster */}
          <polygon points="560,400 568,335 576,400" />
          <polygon points="558,370 568,315 578,370" />
          <polygon points="745,400 753,330 761,400" />
          <polygon points="743,365 753,310 763,365" />

          {/* Right Forest Group */}
          <polygon points="860,395 868,330 876,395" />
          <polygon points="858,360 868,310 878,360" />
          <polygon points="930,405 938,340 946,405" />
          <polygon points="928,370 938,320 948,370" />
        </g>

        {/* 3. FOREGROUND MOUNTAIN ROAD AND HILL SLOPES */}
        <path
          d="M0 435 Q280 395 520 420 T1000 430 L1000 520 L0 520 Z"
          fill="url(#himaForeRidge)"
        />

        {/* WINDING MOUNTAIN HIGHWAY RIBBON */}
        <path
          d="M-20 475 Q 260 435, 520 458 T 1020 468"
          stroke="url(#himaRoadSurface)"
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
          opacity="0.7"
        />

        {/* 4. VEHICLE SILHOUETTES */}
        {/* Primary Sedan Cab Profile on Highway (Center, visible on all screens!) */}
        <g opacity="0.92" transform="translate(460, 422)">
          {/* Cab body */}
          <path
            d="M0 16 L14 8 Q26 0 46 0 L72 0 Q84 0 96 8 L108 16 L118 17 Q124 18 124 23 L124 30 L0 30 Z"
            fill="#64748b"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          {/* Windows */}
          <path d="M22 8 L35 2 L56 2 L56 8 Z" fill="#cbd5e1" opacity="0.5" />
          <path d="M60 2 L78 2 L88 8 L60 8 Z" fill="#cbd5e1" opacity="0.5" />
          {/* Crimson / Amber Taxi Roof Sign */}
          <rect x="48" y="-4" width="18" height="4.5" rx="1.5" fill="#e63946" />
          <circle cx="57" cy="-2" r="6" fill="rgba(230, 57, 70, 0.55)" />
          {/* Headlight beam */}
          <polygon points="124,20 180,12 180,28 124,24" fill="url(#himaHeadlight)" />
          <circle cx="123" cy="22" r="2.5" fill="#ffffff" />
          {/* Tail light */}
          <circle cx="2" cy="22" r="2.5" fill="#ef4444" />
          <circle cx="2" cy="22" r="6" fill="rgba(239, 68, 68, 0.45)" />
          {/* Wheels */}
          <circle cx="26" cy="30" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="26" cy="30" r="3" fill="#e2e8f0" />
          <circle cx="96" cy="30" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="96" cy="30" r="3" fill="#e2e8f0" />
        </g>

        {/* Distant Mini Cab on Upper Curve */}
        <g opacity="0.8" transform="translate(210, 412) scale(0.65)">
          <path
            d="M0 16 L10 8 Q20 0 38 0 L58 0 Q70 0 78 8 L88 16 L96 17 L96 26 L0 26 Z"
            fill="#64748b"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <rect x="36" y="-3" width="12" height="3.5" rx="1" fill="#e63946" />
          <circle cx="20" cy="26" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="76" cy="26" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
        </g>
      </svg>

      {/* 5. CULTURAL AND GEOGRAPHIC WATERMARK FOOTER (100% Fit and Readable on Mobile and Desktop) */}
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
