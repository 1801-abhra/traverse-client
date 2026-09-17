import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AboutModal from '../components/AboutModal';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCarAnimation, setShowCarAnimation] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [aboutModalTab, setAboutModalTab] = useState('about');
  const animTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up animation elements from DOM after 5 seconds
    animTimerRef.current = setTimeout(() => {
      setShowCarAnimation(false);
    }, 5000);

    return () => {
      if (animTimerRef.current) {
        clearTimeout(animTimerRef.current);
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        'https://traverse-app.onrender.com/api/auth/login',
        { email, password },
        { withCredentials: false }
      );
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('sessionToken', data.sessionToken);
      if (data.role === 'student') navigate('/student');
      else navigate('/driver');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const resendVerification = async () => {
    try {
      await axios.post(
        'https://traverse-app.onrender.com/api/auth/resend-verification',
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
          .footer-grid-container {
            grid-template-columns: 1fr 1fr !important;
            gap: 22px 12px !important;
          }
        }
      `}</style>

      {/* Floating Ambient Light Spots */}
      <div style={styles.glowSpot1} />
      <div style={styles.glowSpot2} />

      {/* 3D Car Driving Animation Scene (Passes seamlessly behind login portal card) */}
      {showCarAnimation && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '290px',
            height: '150px',
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden',
            animation: 'fadeOutRoadScene 4.6s ease-out forwards'
          }}
        >
          {/* Glowing Cyber Highway Track passing behind the login card */}
          <div
            style={{
              position: 'absolute',
              top: '92px',
              left: '-10%',
              width: '120%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(230, 57, 70, 0.3) 15%, #e63946 50%, rgba(230, 57, 70, 0.3) 85%, transparent 100%)',
              boxShadow: '0 0 16px rgba(230, 57, 70, 0.7), 0 0 32px rgba(230, 57, 70, 0.35)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '74px',
              left: '-10%',
              width: '120%',
              height: '24px',
              background: 'linear-gradient(180deg, rgba(230, 57, 70, 0.06) 0%, rgba(230, 57, 70, 0) 100%)',
              borderBottom: '1px dashed rgba(230, 57, 70, 0.25)'
            }}
          />

          {/* 3D Moving Car Track */}
          <div
            style={{
              position: 'absolute',
              top: '36px',
              left: 0,
              width: '100%',
              animation: 'driveAcross3D 3.6s cubic-bezier(0.22, 0.45, 0.35, 0.98) forwards'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '190px',
                height: '65px',
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.95))'
              }}
            >
              {/* Blurred Underbody Shadow */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '-10px',
                  width: '210px',
                  height: '20px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '50%',
                  filter: 'blur(9px)'
                }}
              />

              {/* Headlight Beam Projecting Forward */}
              <div
                style={{
                  position: 'absolute',
                  right: '-160px',
                  bottom: '8px',
                  width: '160px',
                  height: '42px',
                  background: 'linear-gradient(90deg, rgba(255, 255, 230, 0.55) 0%, rgba(255, 240, 180, 0.18) 60%, rgba(255, 240, 180, 0) 100%)',
                  clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                  filter: 'blur(2px)'
                }}
              />

              {/* Speed Lines Behind Car */}
              <div
                style={{
                  position: 'absolute',
                  left: '-120px',
                  top: '18px',
                  width: '110px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 75%, transparent 100%)',
                  borderRadius: '2px',
                  filter: 'blur(0.5px)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-150px',
                  top: '28px',
                  width: '140px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(230,57,70,0.6) 80%, transparent 100%)',
                  borderRadius: '2px',
                  filter: 'blur(0.5px)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-95px',
                  top: '38px',
                  width: '85px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
                  borderRadius: '2px',
                  filter: 'blur(0.5px)'
                }}
              />

              {/* Main 3D Car Body */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: 0,
                  width: '175px',
                  height: '34px',
                  background: 'linear-gradient(180deg, #ff4d5a 0%, #e63946 45%, #9e1522 100%)',
                  borderRadius: '14px 30px 6px 8px',
                  boxShadow: 'inset 0 2.5px 5px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.55), 0 0 16px rgba(230,57,70,0.4)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {/* Subtle Reflection Highlight Stripe */}
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '8px',
                    width: '140px',
                    height: '4px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)',
                    borderRadius: '2px'
                  }}
                />

                {/* Chrome Side Trim Accent */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '42px',
                    width: '80px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #aaaaaa, #ffffff, #888888)',
                    boxShadow: '0 0 4px rgba(255,255,255,0.5)'
                  }}
                />

                {/* Front Headlight */}
                <div
                  style={{
                    position: 'absolute',
                    right: '3px',
                    top: '8px',
                    width: '9px',
                    height: '9px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    boxShadow: '0 0 12px #ffffff, 0 0 24px #ffd166, 0 0 35px #e63946'
                  }}
                />

                {/* Rear Glowing Taillight */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0px',
                    top: '6px',
                    width: '6px',
                    height: '12px',
                    background: '#ff2a3b',
                    borderRadius: '3px 0 0 3px',
                    boxShadow: '-4px 0 12px #ff2a3b, -10px 0 24px rgba(255,42,59,0.7)'
                  }}
                />

                {/* Front Bumper Air Vent */}
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    bottom: '4px',
                    width: '16px',
                    height: '5px',
                    background: '#111111',
                    borderRadius: '2px',
                    border: '0.5px solid #333333'
                  }}
                />
              </div>

              {/* 3D Car Cabin & Roof */}
              <div
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '46px',
                  width: '78px',
                  height: '26px',
                  background: 'linear-gradient(180deg, #b81d2c 0%, #87121e 100%)',
                  borderRadius: '14px 24px 0 0',
                  transform: 'perspective(300px) rotateX(6deg) skewX(-11deg)',
                  boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.35)',
                  borderTop: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                {/* Windshield */}
                <div
                  style={{
                    position: 'absolute',
                    right: '-2px',
                    top: '3px',
                    width: '24px',
                    height: '19px',
                    background: 'rgba(17, 21, 28, 0.85)',
                    borderRadius: '2px 9px 0 0',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(2px)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.6)'
                  }}
                />
                {/* Side Windows */}
                <div
                  style={{
                    position: 'absolute',
                    left: '6px',
                    top: '3px',
                    width: '46px',
                    height: '19px',
                    background: 'rgba(17, 21, 28, 0.85)',
                    borderRadius: '7px 2px 0 0',
                    border: '1px solid rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(2px)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.6)'
                  }}
                />
              </div>

              {/* Front Wheel */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '18px',
                  width: '28px',
                  height: '28px',
                  background: 'radial-gradient(circle, #252525 35%, #111111 65%, #000000 100%)',
                  borderRadius: '50%',
                  border: '2px solid #2e2e2e',
                  boxShadow: '0 5px 10px rgba(0,0,0,0.85), inset 0 0 6px rgba(230,57,70,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                {/* 3D Chrome Rim */}
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffffff 15%, #c0c0c0 50%, #444444 100%)',
                    border: '1px solid #ffffff',
                    animation: 'wheelSpinAnim 0.3s linear infinite'
                  }}
                />
              </div>

              {/* Rear Wheel */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '22px',
                  width: '28px',
                  height: '28px',
                  background: 'radial-gradient(circle, #252525 35%, #111111 65%, #000000 100%)',
                  borderRadius: '50%',
                  border: '2px solid #2e2e2e',
                  boxShadow: '0 5px 10px rgba(0,0,0,0.85), inset 0 0 6px rgba(230,57,70,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                {/* 3D Chrome Rim */}
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffffff 15%, #c0c0c0 50%, #444444 100%)',
                    border: '1px solid #ffffff',
                    animation: 'wheelSpinAnim 0.3s linear infinite'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container (Higher z-index so car drives smoothly behind the portal) */}
      <div style={styles.contentContainer}>
        {/* Top Floating Logo & Brand Header */}
        <div style={styles.header}>
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
          <div style={styles.formCard}>
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
    padding: '30px 16px 20px',
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
