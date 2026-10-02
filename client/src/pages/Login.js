import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AboutModal from '../components/AboutModal';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [aboutModalTab, setAboutModalTab] = useState('about');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        'https://traverse-unicab-backend-2df13b58c562.herokuapp.com/api/auth/login',
        { email, password },
        { withCredentials: false }
      );
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('sessionToken', data.sessionToken);
            if (data.role === 'student') navigate('/student');
      else if (data.role === 'faculty') navigate('/faculty');
      else navigate('/driver');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
    setLoading(false);
  };

  const resendVerification = async () => {
    try {
      await axios.post(
        'https://traverse-unicab-backend-2df13b58c562.herokuapp.com/api/auth/resend-verification',
        { email },
        { withCredentials: false }
      );
      setError('Verification email sent! Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend');
    }
  };

  const openAbout = (tabName) => {
    setAboutModalTab(tabName);
    setShowAboutModal(true);
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes bgGradientMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes floatTaxi {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(-3deg); }
        }
        @keyframes slideUpIn {
          0% { opacity: 0; transform: translateY(32px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes driveAcross3D {
          0% {
            transform: translateX(-340px) perspective(600px) rotateY(-8deg) rotateX(4deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 340px)) perspective(600px) rotateY(-3deg) rotateX(2deg);
            opacity: 0;
          }
        }
        @keyframes fadeOutRoadScene {
          0% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes wheelSpinAnim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
          background: rgba(230, 57, 70, 0.15) !important;
          border-color: #e63946 !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .traverse-btn-outline:active {
          transform: scale(0.98);
        }
        .footer-header-btn {
          color: #e63946;
          background: none;
          border: none;
          padding: 0;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          font-family: inherit;
          margin-bottom: 12px;
          text-align: left;
        }
        .footer-header-btn:hover {
          color: #ff5260 !important;
          text-shadow: 0 0 14px rgba(230, 57, 70, 0.7);
          transform: translateX(2px);
        }
        .footer-header-btn:active {
          transform: scale(0.96);
        }
        .footer-header-btn .arrow-icon {
          font-size: 11px;
          opacity: 0.7;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .footer-header-btn:hover .arrow-icon {
          transform: translateX(3px);
          opacity: 1;
        }
        .footer-static-item {
          color: #8e95a5;
          font-size: 13px;
          line-height: 1.9;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: default;
          user-select: text;
        }
        @media (max-width: 768px) {
          .footer-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px 16px !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
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

        @media (max-width: 480px) {
          .footer-grid-container {
            grid-template-columns: 1fr 1fr !important;
            gap: 22px 12px !important;
          }
        }
      `}</style>

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

      {/* Main Content Container (Higher z-index so car drives smoothly behind the portal) */}
      <div className="mobile-peek-container" style={styles.contentContainer}>
        {/* Top Floating Logo & Brand Header */}
        <div className="mobile-peek-header" style={styles.header}>
          <div style={styles.logoBadge}>
            <img src="/3d-taxi.webp" alt="Traverse Logo" style={styles.floatingTaxiImg} />
          </div>
          <h1 style={styles.brandTitle}>TRAVERSE</h1>
          <p style={styles.brandTagline}>
            JUIT SOLAN <span style={styles.redText}>•</span> UNIVERSITY CAB NETWORK
          </p>

          {/* Feature Badge Pills */}
          <div style={styles.featurePills}>
            <span style={styles.pill}>⚡ Instant Booking</span>
            <span style={styles.pill}>👥 Share & Save</span>
            <span style={styles.pill}>🛡️ Verified Drivers</span>
          </div>
        </div>

        {/* 3D Perspective Card Wrapper */}
        <div style={styles.cardPerspective}>
          <div className="mobile-glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Welcome Back</h2>
              <p style={styles.cardSubtitle}>Sign in to your Traverse account</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorText}>⚠️ {error}</div>
                {error.includes('verify') && (
                  <button
                    onClick={resendVerification}
                    style={styles.verifyBtn}
                    type="button"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>UNIVERSITY EMAIL</label>
                <input
                  type="email"
                  className="traverse-input"
                  style={styles.input}
                  placeholder="name@juitsolan.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.passwordLabelRow}>
                  <label style={styles.label}>PASSWORD</label>
                  <Link to="/forgot-password" style={styles.forgotLink}>
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  className="traverse-input"
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Bold Primary Gradient Button */}
              <button
                className={loading ? '' : 'traverse-btn-primary'}
                style={loading ? styles.btnLoading : styles.btnPrimary}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In →'}
              </button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>New to Traverse?</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Outlined Register Button */}
            <Link to="/register" className="traverse-btn-outline" style={styles.btnOutline}>
              Create Account
            </Link>

            <div style={styles.adminFooter}>
              <span>Admin portal? </span>
              <Link to="/admin" style={styles.adminLink}>
                Admin Panel
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Brand Tagline Banner */}
        <div style={styles.taglineBanner}>
          <div style={styles.taglineGlowLine} />
          <div style={styles.taglineContent}>
            <div style={styles.tagline3dCarWrap}>
              <img src="/3d-taxi.webp" alt="3D Taxi" style={styles.tagline3dCarImg} />
            </div>
            <span style={styles.taglineText}>
              TRAVERSE YOURSELF FROM YOUR PICKUP TO DROP LOCATION
            </span>
          </div>
          <div style={styles.taglineGlowLine} />
        </div>
      </div>

      {/* MODERN ENTERPRISE SAAS-STYLE FOOTER */}
      <footer style={styles.footerWrapper}>
        <div style={styles.footerInner}>
          {/* 4-Column Clean Responsive Grid */}
          <div className="footer-grid-container" style={styles.footerGrid}>
            {/* Column 1: About Us (Clicking red header opens About section) */}
            <div style={styles.footerCol}>
              <button onClick={() => openAbout('about')} className="footer-header-btn">
                <span>ABOUT US</span>
                <span className="arrow-icon">↗</span>
              </button>
              <div className="footer-static-item">📖 Mission & Story</div>
              <div className="footer-static-item">🛡️ Why Traverse?</div>
              <div className="footer-static-item">⛰️ JUIT Hill Routes</div>
              <div className="footer-static-item">✉️ Contact Dispatch</div>
            </div>

            {/* Column 2: How It Works (Clicking red header opens How It Works section) */}
            <div style={styles.footerCol}>
              <button onClick={() => openAbout('how')} className="footer-header-btn">
                <span>HOW IT WORKS</span>
                <span className="arrow-icon">↗</span>
              </button>
              <div className="footer-static-item">👤 Student & Rider Flow</div>
              <div className="footer-static-item">🚖 Campus Drivers & Captains</div>
              <div className="footer-static-item">👥 Shared Rides & Fare Split</div>
              <div className="footer-static-item">🧾 Digital Post-Ride Receipts</div>
            </div>

            {/* Column 3: Terms & Rules (Clicking red header opens Terms section) */}
            <div style={styles.footerCol}>
              <button onClick={() => openAbout('terms')} className="footer-header-btn">
                <span>TERMS & RULES</span>
                <span className="arrow-icon">↗</span>
              </button>
              <div className="footer-static-item">🎓 University Eligibility</div>
              <div className="footer-static-item">⚠️ 5-Strike Cancellation Rule</div>
              <div className="footer-static-item">💰 Fixed Pricing & Fares</div>
              <div className="footer-static-item">🔒 Safety & Privacy</div>
            </div>

            {/* Column 4: Help & FAQs (Clicking red header opens Help section) */}
            <div style={styles.footerCol}>
              <button onClick={() => openAbout('help')} className="footer-header-btn">
                <span>HELP & FAQS</span>
                <span className="arrow-icon">↗</span>
              </button>
              <div className="footer-static-item">💬 Rider FAQs</div>
              <div className="footer-static-item">📧 Email Verification Help</div>
              <div className="footer-static-item">📞 Finding Driver Phone</div>
              <div className="footer-static-item">🚨 Campus Emergency Desk</div>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>System Operational</span>
              </div>
            </div>
          </div>

          {/* Sub-Footer Line & Copyright */}
          <div className="footer-bottom-bar" style={styles.footerBottomBar}>
            <div style={styles.footerBrandBlock}>
              <div style={styles.footerLogoWrap}>
                <img src="/3d-taxi.webp" alt="Traverse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span style={styles.footerBrandName}>TRAVERSE UNICAB</span>
                <p style={styles.footerCopyright}>
                  © 2026 Jaypee University of Information Technology. Safe, affordable campus mobility.
                </p>
              </div>
            </div>

            <div style={styles.footerQuickLinks}>
              <button onClick={() => openAbout('about')} style={styles.footerSubLink}>About</button>
              <span style={{ color: '#444' }}>•</span>
              <button onClick={() => openAbout('how')} style={styles.footerSubLink}>How It Works</button>
              <span style={{ color: '#444' }}>•</span>
              <button onClick={() => openAbout('terms')} style={styles.footerSubLink}>Terms</button>
              <span style={{ color: '#444' }}>•</span>
              <button onClick={() => openAbout('help')} style={styles.footerSubLink}>Help</button>
              <span style={{ color: '#444' }}>•</span>
              <Link to="/admin" style={styles.footerSubLink}>Admin</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Official About Modal Component with full rich details */}
      {showAboutModal && (
        <AboutModal
          onClose={() => setShowAboutModal(false)}
          initialTab={aboutModalTab}
        />
      )}
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: '#0a0a0a',
    backgroundImage: `
      radial-gradient(circle at 50% 0%, rgba(230, 57, 70, 0.18) 0%, rgba(10, 10, 10, 0.95) 45%, #080808 100%),
      linear-gradient(180deg, #0e0507 0%, #0a0a0a 100%)
    `,
    backgroundSize: '100% 100%',
    color: '#ffffff',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflowX: 'hidden'
  },
  glowSpot1: {
    position: 'absolute',
    top: '-80px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '450px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.28) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'pulseGlow 4s ease-in-out infinite'
  },
  glowSpot2: {
    position: 'absolute',
    bottom: '80px',
    right: '-100px',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 0
  },
  contentContainer: {
    width: '100%',
    maxWidth: '440px',
    padding: '85px 16px 20px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 10,
    margin: '0 auto',
    flex: '1 0 auto'
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
    letterSpacing: '4px',
    color: '#ffffff',
    textShadow: '0 0 20px rgba(230, 57, 70, 0.7), 0 0 40px rgba(230, 57, 70, 0.3)'
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
    background: 'rgba(10, 10, 10, 0.75)',
    border: '1px solid rgba(230, 57, 70, 0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 35px rgba(230, 57, 70, 0.12)',
    borderRadius: '20px',
    padding: '28px 22px',
    transform: 'rotateX(1.5deg)',
    transformStyle: 'preserve-3d',
    animation: 'slideUpIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    boxSizing: 'border-box'
  },
  cardHeader: {
    marginBottom: '20px',
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
  errorText: {
    wordBreak: 'break-word'
  },
  verifyBtn: {
    display: 'block',
    marginTop: '10px',
    background: 'linear-gradient(135deg, #e63946 0%, #b51725 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '9px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    width: '100%',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#aaaaaa'
  },
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  forgotLink: {
    fontSize: '11px',
    color: '#e63946',
    textDecoration: 'none',
    fontWeight: '600'
  },
  input: {
    background: '#181818',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    boxSizing: 'border-box',
    width: '100%'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #e63946 0%, #ba181b 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 18px rgba(230, 57, 70, 0.45)',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
    fontFamily: 'inherit'
  },
  btnLoading: {
    background: '#3a1215',
    color: '#999999',
    border: 'none',
    borderRadius: '12px',
    padding: '13px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'not-allowed',
    marginTop: '8px',
    fontFamily: 'inherit'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0 16px',
    gap: '12px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.08)'
  },
  dividerText: {
    fontSize: '11px',
    color: '#666666',
    fontWeight: '600'
  },
  btnOutline: {
    display: 'block',
    width: '100%',
    padding: '12px',
    background: 'rgba(230, 57, 70, 0.06)',
    color: '#f87171',
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
  },
  adminFooter: {
    textAlign: 'center',
    color: '#555555',
    fontSize: '12px',
    marginTop: '18px'
  },
  adminLink: {
    color: '#e63946',
    textDecoration: 'none',
    fontWeight: '600'
  },
  taglineBanner: {
    marginTop: '28px',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  taglineGlowLine: {
    width: '90%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(230, 57, 70, 0.6) 50%, transparent 100%)'
  },
  taglineContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '4px 0'
  },
  tagline3dCarWrap: {
    width: '28px',
    height: '28px',
    borderRadius: '7px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    background: 'rgba(230, 57, 70, 0.1)'
  },
  tagline3dCarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  taglineText: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#fca5a5',
    letterSpacing: '1px',
    textShadow: '0 0 12px rgba(230, 57, 70, 0.5)'
  },

  /* ENTERPRISE SAAS FOOTER STYLES */
  footerWrapper: {
    width: '100%',
    background: 'linear-gradient(180deg, rgba(14, 14, 16, 0.95) 0%, #070709 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 -10px 30px rgba(0,0,0,0.6)',
    padding: '40px 20px 24px',
    boxSizing: 'border-box',
    marginTop: 'auto',
    zIndex: 2
  },
  footerInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px 24px',
    marginBottom: '36px'
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  footerBottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
    gap: '16px'
  },
  footerBrandBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  footerLogoWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    background: '#181818',
    flexShrink: 0
  },
  footerBrandName: {
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: '#ffffff',
    display: 'block'
  },
  footerCopyright: {
    fontSize: '11px',
    color: '#666666',
    margin: '2px 0 0 0'
  },
  footerQuickLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  footerSubLink: {
    background: 'none',
    border: 'none',
    color: '#8e95a5',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'none',
    transition: 'color 0.2s',
    fontFamily: 'inherit'
  }
};

export default Login;
