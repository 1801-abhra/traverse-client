import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    studentId: '', vehicleNumber: '', phone: '',
    carName: '', carModel: '', vehicleType: '4+1'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [verificationSent, setVerificationSent] = useState(false);
  const [driverPending, setDriverPending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.clear();
      await axios.post(
        'https://traverse-unicab-backend-2df13b58c562.herokuapp.com/api/auth/register',
        form,
        { withCredentials: false }
      );
      setError('');
      if (form.role === 'driver') {
        setDriverPending(true);
      } else {
        setVerificationSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const commonStyleSheet = `
    @keyframes bgGradientMove {
      0% {
        background-position: 0% 0%;
      }
      50% {
        background-position: 100% 100%;
      }
      100% {
        background-position: 0% 0%;
      }
    }
    @keyframes floatTaxi {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-7px) rotate(-3deg);
      }
    }
    @keyframes slideUpIn {
      0% {
        opacity: 0;
        transform: translateY(32px) scale(0.98);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @keyframes pulseGlow {
      0%, 100% {
        opacity: 0.4;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.08);
      }
    }
    .traverse-input:focus {
      border-color: #e63946 !important;
      box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.25), 0 0 16px rgba(230, 57, 70, 0.4) !important;
      background: #202020 !important;
      outline: none !important;
    }
    .traverse-btn-primary:hover:not(:disabled) {
      box-shadow: 0 8px 24px rgba(230, 57, 70, 0.6) !important;
      filter: brightness(1.08);
    }
    .traverse-btn-primary:active:not(:disabled) {
      transform: scale(0.97) translateY(1px) !important;
      box-shadow: 0 3px 10px rgba(230, 57, 70, 0.4) !important;
    }
    .traverse-btn-outline:hover {
      border-color: #e63946 !important;
      background: rgba(230, 57, 70, 0.12) !important;
      box-shadow: 0 0 16px rgba(230, 57, 70, 0.2) !important;
    }
    .traverse-btn-outline:active {
      transform: scale(0.98) !important;
    }
    .role-tab:hover:not(.active) {
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.05) !important;
    }
    
    @media (max-width: 480px) {
      .mobile-peek-container {
        padding-top: 88px !important;
      }
      .mobile-glass-card {
        background: rgba(10, 10, 10, 0.75) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(230, 57, 70, 0.15) !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.9), 0 0 24px rgba(230, 57, 70, 0.08) !important;
      }
      .mobile-peek-header {
        margin-bottom: 22px !important;
      }
    }

    .role-tab.active {
      background: linear-gradient(135deg, #e63946 0%, #b81d2c 100%) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(230, 57, 70, 0.45) !important;
    }
  `;

  if (driverPending) {
    return (
      <div style={styles.pageWrapper}>
        <style>{commonStyleSheet}</style>
        {/* HIMACHAL HERITAGE & MOUNTAIN NIGHT SILHOUETTE BACKGROUND */}
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
        {/* Subtle Ambient Night Sky Vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '420px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(230, 57, 70, 0.16) 0%, rgba(10, 10, 10, 0) 70%)',
            opacity: 0.9
          }}
        />

        {/* Night Stars / Himalayan Sky Sparkles */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '340px',
            backgroundImage: `
              radial-gradient(1px 1px at 80px 45px, rgba(255,255,255,0.55) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 220px 85px, rgba(255,255,255,0.7) 50%, transparent 100%),
              radial-gradient(1px 1px at 380px 30px, rgba(255,255,255,0.45) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 540px 110px, rgba(255,255,255,0.6) 50%, transparent 100%),
              radial-gradient(1px 1px at 720px 50px, rgba(255,255,255,0.5) 50%, transparent 100%),
              radial-gradient(2px 2px at 890px 95px, rgba(255,255,255,0.65) 50%, transparent 100%),
              radial-gradient(1px 1px at 1040px 40px, rgba(255,255,255,0.45) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 1200px 75px, rgba(255,255,255,0.6) 50%, transparent 100%),
              radial-gradient(1px 1px at 1360px 120px, rgba(255,255,255,0.5) 50%, transparent 100%)
            `,
            backgroundSize: '1440px 340px',
            animation: 'starPulse 7s ease-in-out infinite'
          }}
        />

        {/* Vector Mountain Skyline & Himachal Landmarks */}
        <svg
          viewBox="0 0 1440 640"
          preserveAspectRatio="xMidYMax slice"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            maxHeight: '680px',
            opacity: 1
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="peakDistantGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c333e" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#1a1e24" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="snowCapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="midRidgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#232832" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="foregroundRidgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1e24" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#080808" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="roadSurface" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1c2027" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#2e3540" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1c2027" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* 1. DISTANT HIMALAYAN SNOW PEAKS (Rohtang Pass range) */}
          <path
            d="M0 360 L110 260 L230 330 L380 180 L490 280 L620 200 L740 310 L880 150 L1010 270 L1140 190 L1280 300 L1440 210 L1440 640 L0 640 Z"
            fill="url(#peakDistantGrad)"
          />

          {/* Snow highlights on major peaks */}
          <polygon points="380,180 340,230 420,230" fill="url(#snowCapGrad)" />
          <polygon points="620,200 585,245 655,245" fill="url(#snowCapGrad)" />
          <polygon points="880,150 835,215 925,215" fill="url(#snowCapGrad)" />
          <polygon points="1140,190 1105,240 1175,240" fill="url(#snowCapGrad)" />

          {/* 2. MID-GROUND MOUNTAIN RIDGE WITH LANDMARKS & PINE FORESTS */}
          <path
            d="M0 410 Q180 370 340 390 T700 400 Q950 350 1180 390 T1440 400 L1440 640 L0 640 Z"
            fill="url(#midRidgeGrad)"
          />

          {/* HADIMBA PAGODA TEMPLE SILHOUETTE (Kullu/Manali wooden pagoda - Left midground) */}
          <g opacity="0.32" transform="translate(180, 265)">
            <rect x="20" y="70" width="40" height="30" fill="#363c47" />
            <polygon points="10,70 40,48 70,70" fill="#464e5c" />
            <polygon points="20,48 40,32 60,48" fill="#525b6b" />
            <polygon points="28,32 40,18 52,32" fill="#616c7d" />
            <line x1="40" y1="18" x2="40" y2="8" stroke="#a0abbd" strokeWidth="1.5" />
            <circle cx="40" cy="8" r="1.5" fill="#e63946" opacity="0.8" />
          </g>

          {/* SHIMLA RIDGE & CHRIST CHURCH SILHOUETTE (Center-Right midground) */}
          <g opacity="0.35" transform="translate(1080, 235)">
            <polygon points="0,110 0,85 50,70 100,85 100,110" fill="#383e4a" />
            <rect x="65" y="30" width="28" height="80" fill="#454c59" />
            <rect x="63" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="73" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="83" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="91" y="27" width="6" height="5" fill="#545d6e" />
            <polygon points="72,27 79,8 86,27" fill="#626d7f" />
            <line x1="79" y1="8" x2="79" y2="0" stroke="#9aa5b8" strokeWidth="1.5" />
            <circle cx="79" cy="45" r="4.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="#20242c" />
            <path d="M75 62 Q79 55 83 62 L83 72 L75 72 Z" fill="#1e222a" />
            <path d="M18 90 Q24 82 30 90 L30 100 L18 100 Z" fill="#1e222a" />
          </g>

          {/* KULLU / SHIMLA DEODAR & PINE TREE SILHOUETTES */}
          <g opacity="0.38" fill="#282e38">
            <polygon points="70,410 77,360 84,410" />
            <polygon points="68,390 77,345 86,390" />
            <polygon points="72,365 77,330 82,365" />
            <polygon points="95,415 103,355 111,415" />
            <polygon points="93,390 103,340 113,390" />
            <polygon points="97,360 103,320 109,360" />
            <polygon points="125,420 131,375 137,420" />
            <polygon points="123,400 131,360 139,400" />
            <polygon points="280,425 287,370 294,425" />
            <polygon points="278,400 287,355 296,400" />
            <polygon points="282,375 287,340 292,375" />
            <polygon points="460,430 467,375 474,430" />
            <polygon points="458,405 467,360 476,405" />
            <polygon points="490,435 496,385 502,435" />
            <polygon points="860,430 868,365 876,430" />
            <polygon points="858,398 868,350 878,398" />
            <polygon points="862,370 868,335 874,370" />
            <polygon points="890,435 896,380 902,435" />
            <polygon points="1240,425 1247,370 1254,425" />
            <polygon points="1238,398 1247,350 1256,398" />
            <polygon points="1270,430 1276,380 1282,430" />
            <polygon points="1350,425 1358,360 1366,425" />
            <polygon points="1348,395 1358,340 1368,395" />
          </g>

          {/* 3. FOREGROUND MOUNTAIN ROAD & HILL SLOPES */}
          <path
            d="M0 480 Q220 445 480 465 T980 455 Q1220 445 1440 485 L1440 640 L0 640 Z"
            fill="url(#foregroundRidgeGrad)"
          />

          {/* WINDING MOUNTAIN HIGHWAY RIBBON */}
          <path
            d="M-20 535 Q 260 490, 520 515 T 1020 500 Q 1260 490, 1460 525"
            stroke="url(#roadSurface)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M-20 519 Q 260 474, 520 499 T 1020 484 Q 1260 474, 1460 509"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-20 535 Q 260 490, 520 515 T 1020 500 Q 1260 490, 1460 525"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="14 18"
            fill="none"
          />

          {/* 4. VEHICLE SILHOUETTES */}
          {/* Primary Sedan Cab Profile on Mountain Road */}
          <g opacity="0.45" transform="translate(680, 476)">
            <path
              d="M0 18 L14 9 Q26 0 46 0 L72 0 Q84 0 94 9 L106 18 L116 19 Q120 20 120 25 L120 31 L0 31 Z"
              fill="#3e4654"
            />
            <path
              d="M22 9 L35 2 L56 2 L56 9 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <path
              d="M60 2 L78 2 L86 9 L60 9 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <rect x="48" y="-4" width="14" height="4" rx="1.5" fill="#e63946" opacity="0.95" />
            <polygon points="120,22 165,16 165,30 120,26" fill="rgba(255,255,255,0.1)" />
            <circle cx="2" cy="22" r="2.5" fill="#e63946" opacity="0.9" />
            <circle cx="26" cy="31" r="8" fill="#14171d" stroke="#353c48" strokeWidth="2.5" />
            <circle cx="26" cy="31" r="3" fill="#8895aa" />
            <circle cx="94" cy="31" r="8" fill="#14171d" stroke="#353c48" strokeWidth="2.5" />
            <circle cx="94" cy="31" r="3" fill="#8895aa" />
          </g>

          {/* Distant Small Cab */}
          <g opacity="0.32" transform="translate(240, 468) scale(0.72)">
            <path
              d="M0 16 L10 8 Q20 0 38 0 L58 0 Q70 0 78 8 L88 16 L96 17 L96 26 L0 26 Z"
              fill="#38404d"
            />
            <rect x="36" y="-3" width="10" height="3" rx="1" fill="#e63946" opacity="0.85" />
            <circle cx="20" cy="26" r="6" fill="#12151a" stroke="#2c333e" strokeWidth="1.5" />
            <circle cx="76" cy="26" r="6" fill="#12151a" stroke="#2c333e" strokeWidth="1.5" />
          </g>

          {/* 5. SUBTLE CULTURAL & GEOGRAPHIC TYPOGRAPHY WATERMARK */}
          <text
            x="720"
            y="612"
            textAnchor="middle"
            fill="#323842"
            fontSize="11.5"
            fontWeight="700"
            letterSpacing="5"
            fontFamily="'Inter', -apple-system, sans-serif"
          >
            BUILT FOR THE HILLS • HIMACHAL KI APNI CAB SERVICE
          </text>
        </svg>
      </div>

        <div className="mobile-peek-container" style={styles.mobileContainer}>
          <div style={styles.cardPerspective}>
            <div className="mobile-glass-card" style={{ ...styles.formCard, textAlign: 'center' }}>
              <div style={styles.statusBadgeWarning}>
                <span style={{ fontSize: '38px', lineHeight: 1 }}>⏳</span>
              </div>
              <h2 style={{ ...styles.cardTitle, textAlign: 'center', fontSize: '24px', marginTop: '12px' }}>
                Registration Submitted!
              </h2>
              <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6', margin: '12px 0 20px 0' }}>
                Your driver account is pending admin verification. You will be notified once approved. This usually takes up to 24 hours.
              </p>
              <div style={styles.infoBox}>
                <span style={{ color: '#777777', fontSize: '13px' }}>Need help? </span>
                <a href="mailto:traverseuni@gmail.com" style={styles.errorLink}>
                  traverseuni@gmail.com
                </a>
              </div>
              <a href="/login" className="traverse-btn-primary" style={{ ...styles.btnPrimary, textDecoration: 'none', display: 'block', boxSizing: 'border-box' }}>
                Go to Login →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationSent) {
    return (
      <div style={styles.pageWrapper}>
        <style>{commonStyleSheet}</style>
        {/* HIMACHAL HERITAGE & MOUNTAIN NIGHT SILHOUETTE BACKGROUND */}
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
        {/* Subtle Ambient Night Sky Vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '420px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(230, 57, 70, 0.16) 0%, rgba(10, 10, 10, 0) 70%)',
            opacity: 0.9
          }}
        />

        {/* Night Stars / Himalayan Sky Sparkles */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '340px',
            backgroundImage: `
              radial-gradient(1px 1px at 80px 45px, rgba(255,255,255,0.55) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 220px 85px, rgba(255,255,255,0.7) 50%, transparent 100%),
              radial-gradient(1px 1px at 380px 30px, rgba(255,255,255,0.45) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 540px 110px, rgba(255,255,255,0.6) 50%, transparent 100%),
              radial-gradient(1px 1px at 720px 50px, rgba(255,255,255,0.5) 50%, transparent 100%),
              radial-gradient(2px 2px at 890px 95px, rgba(255,255,255,0.65) 50%, transparent 100%),
              radial-gradient(1px 1px at 1040px 40px, rgba(255,255,255,0.45) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 1200px 75px, rgba(255,255,255,0.6) 50%, transparent 100%),
              radial-gradient(1px 1px at 1360px 120px, rgba(255,255,255,0.5) 50%, transparent 100%)
            `,
            backgroundSize: '1440px 340px',
            animation: 'starPulse 7s ease-in-out infinite'
          }}
        />

        {/* Vector Mountain Skyline & Himachal Landmarks */}
        <svg
          viewBox="0 0 1440 640"
          preserveAspectRatio="xMidYMax slice"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            maxHeight: '680px',
            opacity: 1
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="peakDistantGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c333e" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#1a1e24" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="snowCapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="midRidgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#232832" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="foregroundRidgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1e24" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#080808" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="roadSurface" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1c2027" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#2e3540" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1c2027" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* 1. DISTANT HIMALAYAN SNOW PEAKS (Rohtang Pass range) */}
          <path
            d="M0 360 L110 260 L230 330 L380 180 L490 280 L620 200 L740 310 L880 150 L1010 270 L1140 190 L1280 300 L1440 210 L1440 640 L0 640 Z"
            fill="url(#peakDistantGrad)"
          />

          {/* Snow highlights on major peaks */}
          <polygon points="380,180 340,230 420,230" fill="url(#snowCapGrad)" />
          <polygon points="620,200 585,245 655,245" fill="url(#snowCapGrad)" />
          <polygon points="880,150 835,215 925,215" fill="url(#snowCapGrad)" />
          <polygon points="1140,190 1105,240 1175,240" fill="url(#snowCapGrad)" />

          {/* 2. MID-GROUND MOUNTAIN RIDGE WITH LANDMARKS & PINE FORESTS */}
          <path
            d="M0 410 Q180 370 340 390 T700 400 Q950 350 1180 390 T1440 400 L1440 640 L0 640 Z"
            fill="url(#midRidgeGrad)"
          />

          {/* HADIMBA PAGODA TEMPLE SILHOUETTE (Kullu/Manali wooden pagoda - Left midground) */}
          <g opacity="0.32" transform="translate(180, 265)">
            <rect x="20" y="70" width="40" height="30" fill="#363c47" />
            <polygon points="10,70 40,48 70,70" fill="#464e5c" />
            <polygon points="20,48 40,32 60,48" fill="#525b6b" />
            <polygon points="28,32 40,18 52,32" fill="#616c7d" />
            <line x1="40" y1="18" x2="40" y2="8" stroke="#a0abbd" strokeWidth="1.5" />
            <circle cx="40" cy="8" r="1.5" fill="#e63946" opacity="0.8" />
          </g>

          {/* SHIMLA RIDGE & CHRIST CHURCH SILHOUETTE (Center-Right midground) */}
          <g opacity="0.35" transform="translate(1080, 235)">
            <polygon points="0,110 0,85 50,70 100,85 100,110" fill="#383e4a" />
            <rect x="65" y="30" width="28" height="80" fill="#454c59" />
            <rect x="63" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="73" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="83" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="91" y="27" width="6" height="5" fill="#545d6e" />
            <polygon points="72,27 79,8 86,27" fill="#626d7f" />
            <line x1="79" y1="8" x2="79" y2="0" stroke="#9aa5b8" strokeWidth="1.5" />
            <circle cx="79" cy="45" r="4.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="#20242c" />
            <path d="M75 62 Q79 55 83 62 L83 72 L75 72 Z" fill="#1e222a" />
            <path d="M18 90 Q24 82 30 90 L30 100 L18 100 Z" fill="#1e222a" />
          </g>

          {/* KULLU / SHIMLA DEODAR & PINE TREE SILHOUETTES */}
          <g opacity="0.38" fill="#282e38">
            <polygon points="70,410 77,360 84,410" />
            <polygon points="68,390 77,345 86,390" />
            <polygon points="72,365 77,330 82,365" />
            <polygon points="95,415 103,355 111,415" />
            <polygon points="93,390 103,340 113,390" />
            <polygon points="97,360 103,320 109,360" />
            <polygon points="125,420 131,375 137,420" />
            <polygon points="123,400 131,360 139,400" />
            <polygon points="280,425 287,370 294,425" />
            <polygon points="278,400 287,355 296,400" />
            <polygon points="282,375 287,340 292,375" />
            <polygon points="460,430 467,375 474,430" />
            <polygon points="458,405 467,360 476,405" />
            <polygon points="490,435 496,385 502,435" />
            <polygon points="860,430 868,365 876,430" />
            <polygon points="858,398 868,350 878,398" />
            <polygon points="862,370 868,335 874,370" />
            <polygon points="890,435 896,380 902,435" />
            <polygon points="1240,425 1247,370 1254,425" />
            <polygon points="1238,398 1247,350 1256,398" />
            <polygon points="1270,430 1276,380 1282,430" />
            <polygon points="1350,425 1358,360 1366,425" />
            <polygon points="1348,395 1358,340 1368,395" />
          </g>

          {/* 3. FOREGROUND MOUNTAIN ROAD & HILL SLOPES */}
          <path
            d="M0 480 Q220 445 480 465 T980 455 Q1220 445 1440 485 L1440 640 L0 640 Z"
            fill="url(#foregroundRidgeGrad)"
          />

          {/* WINDING MOUNTAIN HIGHWAY RIBBON */}
          <path
            d="M-20 535 Q 260 490, 520 515 T 1020 500 Q 1260 490, 1460 525"
            stroke="url(#roadSurface)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M-20 519 Q 260 474, 520 499 T 1020 484 Q 1260 474, 1460 509"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-20 535 Q 260 490, 520 515 T 1020 500 Q 1260 490, 1460 525"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="14 18"
            fill="none"
          />

          {/* 4. VEHICLE SILHOUETTES */}
          {/* Primary Sedan Cab Profile on Mountain Road */}
          <g opacity="0.45" transform="translate(680, 476)">
            <path
              d="M0 18 L14 9 Q26 0 46 0 L72 0 Q84 0 94 9 L106 18 L116 19 Q120 20 120 25 L120 31 L0 31 Z"
              fill="#3e4654"
            />
            <path
              d="M22 9 L35 2 L56 2 L56 9 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <path
              d="M60 2 L78 2 L86 9 L60 9 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <rect x="48" y="-4" width="14" height="4" rx="1.5" fill="#e63946" opacity="0.95" />
            <polygon points="120,22 165,16 165,30 120,26" fill="rgba(255,255,255,0.1)" />
            <circle cx="2" cy="22" r="2.5" fill="#e63946" opacity="0.9" />
            <circle cx="26" cy="31" r="8" fill="#14171d" stroke="#353c48" strokeWidth="2.5" />
            <circle cx="26" cy="31" r="3" fill="#8895aa" />
            <circle cx="94" cy="31" r="8" fill="#14171d" stroke="#353c48" strokeWidth="2.5" />
            <circle cx="94" cy="31" r="3" fill="#8895aa" />
          </g>

          {/* Distant Small Cab */}
          <g opacity="0.32" transform="translate(240, 468) scale(0.72)">
            <path
              d="M0 16 L10 8 Q20 0 38 0 L58 0 Q70 0 78 8 L88 16 L96 17 L96 26 L0 26 Z"
              fill="#38404d"
            />
            <rect x="36" y="-3" width="10" height="3" rx="1" fill="#e63946" opacity="0.85" />
            <circle cx="20" cy="26" r="6" fill="#12151a" stroke="#2c333e" strokeWidth="1.5" />
            <circle cx="76" cy="26" r="6" fill="#12151a" stroke="#2c333e" strokeWidth="1.5" />
          </g>

          {/* 5. SUBTLE CULTURAL & GEOGRAPHIC TYPOGRAPHY WATERMARK */}
          <text
            x="720"
            y="612"
            textAnchor="middle"
            fill="#323842"
            fontSize="11.5"
            fontWeight="700"
            letterSpacing="5"
            fontFamily="'Inter', -apple-system, sans-serif"
          >
            BUILT FOR THE HILLS • HIMACHAL KI APNI CAB SERVICE
          </text>
        </svg>
      </div>

        <div style={styles.mobileContainer}>
          <div style={styles.cardPerspective}>
            <div style={{ ...styles.formCard, textAlign: 'center' }}>
              <div style={styles.statusBadgeSuccess}>
                <span style={{ fontSize: '38px', lineHeight: 1 }}>📧</span>
              </div>
              <h2 style={{ ...styles.cardTitle, textAlign: 'center', fontSize: '24px', marginTop: '12px' }}>
                Check Your Email!
              </h2>
              <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6', margin: '12px 0 16px 0' }}>
                We sent a verification link to <b style={{ color: '#e63946' }}>{form.email}</b>.
                Click the link to activate your Traverse account.
              </p>
              <div style={styles.infoBox}>
                <span style={{ color: '#888888', fontSize: '12px' }}>
                  ⏳ Link expires in 24 hours. Please check your spam folder if not found.
                </span>
              </div>
              <a href="/login" className="traverse-btn-primary" style={{ ...styles.btnPrimary, textDecoration: 'none', display: 'block', boxSizing: 'border-box' }}>
                Go to Login →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <style>{commonStyleSheet}</style>

      {/* Animated Dark Red Ambient Gradient Glow Background */}
      {/* HIMACHAL HERITAGE & MOUNTAIN NIGHT SILHOUETTE BACKGROUND */}
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
        {/* Subtle Ambient Night Sky Vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '420px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(230, 57, 70, 0.16) 0%, rgba(10, 10, 10, 0) 70%)',
            opacity: 0.9
          }}
        />

        {/* Night Stars / Himalayan Sky Sparkles */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '340px',
            backgroundImage: `
              radial-gradient(1px 1px at 80px 45px, rgba(255,255,255,0.55) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 220px 85px, rgba(255,255,255,0.7) 50%, transparent 100%),
              radial-gradient(1px 1px at 380px 30px, rgba(255,255,255,0.45) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 540px 110px, rgba(255,255,255,0.6) 50%, transparent 100%),
              radial-gradient(1px 1px at 720px 50px, rgba(255,255,255,0.5) 50%, transparent 100%),
              radial-gradient(2px 2px at 890px 95px, rgba(255,255,255,0.65) 50%, transparent 100%),
              radial-gradient(1px 1px at 1040px 40px, rgba(255,255,255,0.45) 50%, transparent 100%),
              radial-gradient(1.5px 1.5px at 1200px 75px, rgba(255,255,255,0.6) 50%, transparent 100%),
              radial-gradient(1px 1px at 1360px 120px, rgba(255,255,255,0.5) 50%, transparent 100%)
            `,
            backgroundSize: '1440px 340px',
            animation: 'starPulse 7s ease-in-out infinite'
          }}
        />

        {/* Vector Mountain Skyline & Himachal Landmarks */}
        <svg
          viewBox="0 0 1440 640"
          preserveAspectRatio="xMidYMax slice"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            maxHeight: '680px',
            opacity: 1
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="peakDistantGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c333e" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#1a1e24" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="snowCapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="midRidgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#232832" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="foregroundRidgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1e24" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#080808" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="roadSurface" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1c2027" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#2e3540" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1c2027" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* 1. DISTANT HIMALAYAN SNOW PEAKS (Rohtang Pass range) */}
          <path
            d="M0 360 L110 260 L230 330 L380 180 L490 280 L620 200 L740 310 L880 150 L1010 270 L1140 190 L1280 300 L1440 210 L1440 640 L0 640 Z"
            fill="url(#peakDistantGrad)"
          />

          {/* Snow highlights on major peaks */}
          <polygon points="380,180 340,230 420,230" fill="url(#snowCapGrad)" />
          <polygon points="620,200 585,245 655,245" fill="url(#snowCapGrad)" />
          <polygon points="880,150 835,215 925,215" fill="url(#snowCapGrad)" />
          <polygon points="1140,190 1105,240 1175,240" fill="url(#snowCapGrad)" />

          {/* 2. MID-GROUND MOUNTAIN RIDGE WITH LANDMARKS & PINE FORESTS */}
          <path
            d="M0 410 Q180 370 340 390 T700 400 Q950 350 1180 390 T1440 400 L1440 640 L0 640 Z"
            fill="url(#midRidgeGrad)"
          />

          {/* HADIMBA PAGODA TEMPLE SILHOUETTE (Kullu/Manali wooden pagoda - Left midground) */}
          <g opacity="0.32" transform="translate(180, 265)">
            <rect x="20" y="70" width="40" height="30" fill="#363c47" />
            <polygon points="10,70 40,48 70,70" fill="#464e5c" />
            <polygon points="20,48 40,32 60,48" fill="#525b6b" />
            <polygon points="28,32 40,18 52,32" fill="#616c7d" />
            <line x1="40" y1="18" x2="40" y2="8" stroke="#a0abbd" strokeWidth="1.5" />
            <circle cx="40" cy="8" r="1.5" fill="#e63946" opacity="0.8" />
          </g>

          {/* SHIMLA RIDGE & CHRIST CHURCH SILHOUETTE (Center-Right midground) */}
          <g opacity="0.35" transform="translate(1080, 235)">
            <polygon points="0,110 0,85 50,70 100,85 100,110" fill="#383e4a" />
            <rect x="65" y="30" width="28" height="80" fill="#454c59" />
            <rect x="63" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="73" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="83" y="27" width="6" height="5" fill="#545d6e" />
            <rect x="91" y="27" width="6" height="5" fill="#545d6e" />
            <polygon points="72,27 79,8 86,27" fill="#626d7f" />
            <line x1="79" y1="8" x2="79" y2="0" stroke="#9aa5b8" strokeWidth="1.5" />
            <circle cx="79" cy="45" r="4.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="#20242c" />
            <path d="M75 62 Q79 55 83 62 L83 72 L75 72 Z" fill="#1e222a" />
            <path d="M18 90 Q24 82 30 90 L30 100 L18 100 Z" fill="#1e222a" />
          </g>

          {/* KULLU / SHIMLA DEODAR & PINE TREE SILHOUETTES */}
          <g opacity="0.38" fill="#282e38">
            <polygon points="70,410 77,360 84,410" />
            <polygon points="68,390 77,345 86,390" />
            <polygon points="72,365 77,330 82,365" />
            <polygon points="95,415 103,355 111,415" />
            <polygon points="93,390 103,340 113,390" />
            <polygon points="97,360 103,320 109,360" />
            <polygon points="125,420 131,375 137,420" />
            <polygon points="123,400 131,360 139,400" />
            <polygon points="280,425 287,370 294,425" />
            <polygon points="278,400 287,355 296,400" />
            <polygon points="282,375 287,340 292,375" />
            <polygon points="460,430 467,375 474,430" />
            <polygon points="458,405 467,360 476,405" />
            <polygon points="490,435 496,385 502,435" />
            <polygon points="860,430 868,365 876,430" />
            <polygon points="858,398 868,350 878,398" />
            <polygon points="862,370 868,335 874,370" />
            <polygon points="890,435 896,380 902,435" />
            <polygon points="1240,425 1247,370 1254,425" />
            <polygon points="1238,398 1247,350 1256,398" />
            <polygon points="1270,430 1276,380 1282,430" />
            <polygon points="1350,425 1358,360 1366,425" />
            <polygon points="1348,395 1358,340 1368,395" />
          </g>

          {/* 3. FOREGROUND MOUNTAIN ROAD & HILL SLOPES */}
          <path
            d="M0 480 Q220 445 480 465 T980 455 Q1220 445 1440 485 L1440 640 L0 640 Z"
            fill="url(#foregroundRidgeGrad)"
          />

          {/* WINDING MOUNTAIN HIGHWAY RIBBON */}
          <path
            d="M-20 535 Q 260 490, 520 515 T 1020 500 Q 1260 490, 1460 525"
            stroke="url(#roadSurface)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M-20 519 Q 260 474, 520 499 T 1020 484 Q 1260 474, 1460 509"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-20 535 Q 260 490, 520 515 T 1020 500 Q 1260 490, 1460 525"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            strokeDasharray="14 18"
            fill="none"
          />

          {/* 4. VEHICLE SILHOUETTES */}
          {/* Primary Sedan Cab Profile on Mountain Road */}
          <g opacity="0.45" transform="translate(680, 476)">
            <path
              d="M0 18 L14 9 Q26 0 46 0 L72 0 Q84 0 94 9 L106 18 L116 19 Q120 20 120 25 L120 31 L0 31 Z"
              fill="#3e4654"
            />
            <path
              d="M22 9 L35 2 L56 2 L56 9 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <path
              d="M60 2 L78 2 L86 9 L60 9 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <rect x="48" y="-4" width="14" height="4" rx="1.5" fill="#e63946" opacity="0.95" />
            <polygon points="120,22 165,16 165,30 120,26" fill="rgba(255,255,255,0.1)" />
            <circle cx="2" cy="22" r="2.5" fill="#e63946" opacity="0.9" />
            <circle cx="26" cy="31" r="8" fill="#14171d" stroke="#353c48" strokeWidth="2.5" />
            <circle cx="26" cy="31" r="3" fill="#8895aa" />
            <circle cx="94" cy="31" r="8" fill="#14171d" stroke="#353c48" strokeWidth="2.5" />
            <circle cx="94" cy="31" r="3" fill="#8895aa" />
          </g>

          {/* Distant Small Cab */}
          <g opacity="0.32" transform="translate(240, 468) scale(0.72)">
            <path
              d="M0 16 L10 8 Q20 0 38 0 L58 0 Q70 0 78 8 L88 16 L96 17 L96 26 L0 26 Z"
              fill="#38404d"
            />
            <rect x="36" y="-3" width="10" height="3" rx="1" fill="#e63946" opacity="0.85" />
            <circle cx="20" cy="26" r="6" fill="#12151a" stroke="#2c333e" strokeWidth="1.5" />
            <circle cx="76" cy="26" r="6" fill="#12151a" stroke="#2c333e" strokeWidth="1.5" />
          </g>

          {/* 5. SUBTLE CULTURAL & GEOGRAPHIC TYPOGRAPHY WATERMARK */}
          <text
            x="720"
            y="612"
            textAnchor="middle"
            fill="#323842"
            fontSize="11.5"
            fontWeight="700"
            letterSpacing="5"
            fontFamily="'Inter', -apple-system, sans-serif"
          >
            BUILT FOR THE HILLS • HIMACHAL KI APNI CAB SERVICE
          </text>
        </svg>
      </div>

      {/* Main Mobile-First App Shell */}
      <div style={styles.mobileContainer}>
        {/* Header Branding Area consistent with Login.js */}
        <header className="mobile-peek-header" style={styles.header}>
          <div style={styles.logoBadge}>
            <img
              src="/3d-taxi.webp"
              alt="Traverse 3D Taxi"
              style={styles.floatingTaxiImg}
            />
          </div>
          <h1 style={styles.brandTitle}>TRAVERSE</h1>
          <p style={styles.brandTagline}>
            Campus Travel, <span style={styles.redText}>Simplified.</span>
          </p>

          {/* Feature Badges */}
          <div style={styles.featurePills}>
            <span style={styles.pill}>✅ Verified Drivers</span>
            <span style={styles.pill}>📍 Live Tracking</span>
            <span style={styles.pill}>💰 Best Fares</span>
          </div>
        </header>

        {/* 3D Form Card with Perspective */}
        <div style={styles.cardPerspective}>
          <div className="mobile-glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Create Account</h2>
              <p style={styles.cardSubtitle}>Fill in your details to get started</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                ⚠️ {error}
              </div>
            )}

            {/* Role Tab Switcher */}
            <div style={styles.roleTabContainer}>
              <button
                type="button"
                className={`role-tab ${form.role === 'student' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'student' })}
                style={form.role === 'student' ? styles.roleTabActive : styles.roleTabInactive}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`role-tab ${form.role === 'faculty' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'faculty' })}
                style={form.role === 'faculty' ? styles.roleTabActive : styles.roleTabInactive}
              >
                👨‍🏫 Faculty
              </button>
              <button
                type="button"
                className={`role-tab ${form.role === 'driver' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'driver' })}
                style={form.role === 'driver' ? styles.roleTabActive : styles.roleTabInactive}
              >
                🚗 Driver
              </button>
            </div>

            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>FULL NAME</label>
                <input
                  className="traverse-input"
                  style={styles.input}
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>EMAIL ADDRESS</label>
                <input
                  className="traverse-input"
                  style={styles.input}
                  name="email"
                  type="email"
                  placeholder={form.role === 'student' ? 'RollNo@juitsolan.in' : 'Personal Email'}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>PASSWORD</label>
                <input
                  className="traverse-input"
                  style={styles.input}
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {form.role === 'student' && (
                <>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>STUDENT ID</label>
                    <input
                      className="traverse-input"
                      style={styles.input}
                      name="studentId"
                      placeholder="Your enrollment number"
                      value={form.studentId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>PHONE NUMBER</label>
                    <input
                      className="traverse-input"
                      style={styles.input}
                      name="phone"
                      placeholder="+91 Phone Number"
                      value={form.phone || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {form.role === 'faculty' && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>PHONE NUMBER</label>
                  <input
                    className="traverse-input"
                    style={styles.input}
                    name="phone"
                    placeholder="+91 Phone Number"
                    value={form.phone || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {form.role === 'driver' && (
                <>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>VEHICLE NUMBER</label>
                    <input
                      className="traverse-input"
                      style={styles.input}
                      name="vehicleNumber"
                      placeholder="e.g. HP01AB1234"
                      value={form.vehicleNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>CAR NAME</label>
                    <input
                      className="traverse-input"
                      style={styles.input}
                      name="carName"
                      placeholder="e.g. Maruti Suzuki"
                      value={form.carName || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>CAR MODEL</label>
                    <input
                      className="traverse-input"
                      style={styles.input}
                      name="carModel"
                      placeholder="e.g. Swift Dzire"
                      value={form.carModel || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>VEHICLE TYPE</label>
                    <div style={styles.vehicleTypeContainer}>
                      <button
                        type="button"
                        className={`role-tab ${form.vehicleType === '4+1' ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, vehicleType: '4+1' })}
                        style={form.vehicleType === '4+1' ? styles.roleTabActive : styles.roleTabInactive}
                      >
                        🚗 Sedan (4+1)
                      </button>
                      <button
                        type="button"
                        className={`role-tab ${form.vehicleType === '6+1' ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, vehicleType: '6+1' })}
                        style={form.vehicleType === '6+1' ? styles.roleTabActive : styles.roleTabInactive}
                      >
                        🚐 SUV (6+1)
                      </button>
                    </div>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>PHONE NUMBER</label>
                    <input
                      className="traverse-input"
                      style={styles.input}
                      name="phone"
                      placeholder="+91 Phone Number"
                      value={form.phone || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              <button
                className="traverse-btn-primary"
                style={loading ? styles.btnLoading : styles.btnPrimary}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>Already have an account?</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Outlined Sign In Button */}
            <Link to="/login" className="traverse-btn-outline" style={styles.btnOutline}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0a0a0a',
    backgroundImage: `
      radial-gradient(circle at 50% 15%, rgba(230, 57, 70, 0.28) 0%, rgba(18, 5, 8, 0.85) 45%, #0a0a0a 85%),
      linear-gradient(135deg, rgba(230, 57, 70, 0.08) 0%, transparent 50%, rgba(230, 57, 70, 0.08) 100%)
    `,
    backgroundSize: '200% 200%',
    animation: 'bgGradientMove 14s ease infinite',
    color: '#ffffff',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px 16px',
    boxSizing: 'border-box',
    position: 'relative',
    overflowX: 'hidden'
  },
  ambientGlow: {
    position: 'absolute',
    top: '5%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '320px',
    height: '240px',
    background: 'radial-gradient(ellipse, rgba(230, 57, 70, 0.35) 0%, rgba(230, 57, 70, 0) 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'pulseGlow 6s ease-in-out infinite'
  },
  mobileContainer: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #1f1416 0%, #12090b 100%)',
    border: '1px solid rgba(230, 57, 70, 0.45)',
    boxShadow: '0 10px 30px rgba(230, 57, 70, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    marginBottom: '12px',
    overflow: 'hidden',
    padding: '3px'
  },
  floatingTaxiImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '16px',
    animation: 'floatTaxi 3.2s ease-in-out infinite'
  },
  brandTitle: {
    margin: '0 0 6px 0',
    fontSize: '32px',
    fontWeight: '900',
    letterSpacing: '5px',
    color: '#ffffff',
    textShadow: '0 0 20px rgba(230, 57, 70, 0.75), 0 0 40px rgba(230, 57, 70, 0.35)'
  },
  brandTagline: {
    margin: '0 0 14px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#b0b0b0',
    letterSpacing: '0.5px'
  },
  redText: {
    color: '#e63946',
    fontWeight: '700'
  },
  featurePills: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '4px'
  },
  pill: {
    background: 'rgba(26, 26, 26, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '5px 11px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#d0d0d0',
    letterSpacing: '0.2px'
  },
  cardPerspective: {
    perspective: '1000px',
    width: '100%'
  },
  formCard: {
    background: 'linear-gradient(165deg, rgba(26, 26, 26, 0.94) 0%, rgba(14, 14, 14, 0.97) 100%)',
    border: '1px solid rgba(230, 57, 70, 0.22)',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 35px rgba(230, 57, 70, 0.12)',
    borderRadius: '20px',
    padding: '28px 22px',
    backdropFilter: 'blur(12px)',
    transform: 'rotateX(1.5deg)',
    transformStyle: 'preserve-3d',
    animation: 'slideUpIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    boxSizing: 'border-box'
  },
  cardHeader: {
    marginBottom: '18px',
    textAlign: 'left'
  },
  cardTitle: {
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.3px'
  },
  cardSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#777777'
  },
  statusBadgeWarning: {
    width: '72px',
    height: '72px',
    borderRadius: '24px',
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  statusBadgeSuccess: {
    width: '72px',
    height: '72px',
    borderRadius: '24px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  infoBox: {
    background: '#161616',
    border: '1px solid #282828',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '22px',
    textAlign: 'center'
  },
  errorBox: {
    background: 'rgba(50, 8, 12, 0.75)',
    border: '1px solid #e63946',
    color: '#ff7a85',
    padding: '12px 14px',
    borderRadius: '12px',
    marginBottom: '18px',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  errorLink: {
    color: '#e63946',
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: '600'
  },
  roleTabContainer: {
    display: 'flex',
    gap: '6px',
    background: '#141414',
    border: '1px solid #262626',
    borderRadius: '14px',
    padding: '4px',
    marginBottom: '20px'
  },
  vehicleTypeContainer: {
    display: 'flex',
    gap: '6px',
    background: '#141414',
    border: '1px solid #262626',
    borderRadius: '12px',
    padding: '3px'
  },
  roleTabActive: {
    flex: 1,
    padding: '10px 8px',
    background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(230, 57, 70, 0.45)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit'
  },
  roleTabInactive: {
    flex: 1,
    padding: '10px 8px',
    background: 'transparent',
    color: '#777777',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    color: '#888888',
    fontSize: '11px',
    fontWeight: '700',
    marginBottom: '7px',
    letterSpacing: '1.2px'
  },
  input: {
    width: '100%',
    padding: '13px 15px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.25s ease',
    outline: 'none',
    fontFamily: 'inherit'
  },
  btnPrimary: {
    width: '100%',
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    boxShadow: '0 6px 20px rgba(230, 57, 70, 0.45)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '6px',
    fontFamily: 'inherit',
    textAlign: 'center'
  },
  btnLoading: {
    width: '100%',
    padding: '14px 16px',
    background: '#4a1218',
    color: '#a07075',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '6px',
    fontFamily: 'inherit'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '22px 0 16px 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.09)'
  },
  dividerText: {
    color: '#666666',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  btnOutline: {
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(230, 57, 70, 0.05)',
    color: '#ffffff',
    border: '1.5px solid rgba(230, 57, 70, 0.55)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
    fontFamily: 'inherit'
  }
};

export default Register;