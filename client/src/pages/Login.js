import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCarAnimation, setShowCarAnimation] = useState(true);
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

  return (
    <div style={styles.pageWrapper}>
      <style>{`
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
          0% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes wheelSpinAnim {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
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
          background: rgba(230, 57, 70, 0.15) !important;
          border-color: #e63946 !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .traverse-btn-outline:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* 3D Car Driving Animation Scene (One-time on page load, behind login card) */}
      {showCarAnimation && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden',
            animation: 'fadeOutRoadScene 4.8s ease-out forwards'
          }}
        >
          {/* Perspective Asphalt Road at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '-10%',
              width: '120%',
              height: '95px',
              background: 'linear-gradient(180deg, #161616 0%, #0d0d0d 100%)',
              transform: 'perspective(500px) rotateX(16deg)',
              transformOrigin: 'bottom center',
              borderTop: '2px solid rgba(255, 255, 255, 0.18)',
              boxShadow: 'inset 0 12px 30px rgba(0, 0, 0, 0.9), 0 -8px 25px rgba(230, 57, 70, 0.08)'
            }}
          >
            {/* Dashed Center Road Line */}
            <div
              style={{
                position: 'absolute',
                top: '48%',
                left: 0,
                width: '100%',
                height: '3px',
                background: 'repeating-linear-gradient(90deg, #e63946 0px, #e63946 32px, transparent 32px, transparent 64px)',
                opacity: 0.85,
                boxShadow: '0 0 10px rgba(230, 57, 70, 0.4)'
              }}
            />
            {/* Subtle Road Edge White Line */}
            <div
              style={{
                position: 'absolute',
                top: '12%',
                left: 0,
                width: '100%',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.2)'
              }}
            />
          </div>

          {/* 3D Moving Car Track */}
          <div
            style={{
              position: 'absolute',
              bottom: '22px',
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
                    background: 'linear-gradient(90deg, # silver, #ffffff, #888888)',
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

      {/* Subtle Ambient Red Glow Behind Login Card */}
      <div style={styles.ambientGlow} />

      {/* Main Login Card Container */}
      <div style={styles.mobileContainer}>
        {/* Header with floating Taxi and glow */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <span style={styles.floatingTaxi}>🚖</span>
          </div>
          <h1 style={styles.brandTitle}>TRAVERSE</h1>
          <p style={styles.brandTagline}>
            University Cab Service <span style={styles.redText}>•</span> JUIT Solan
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
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, #1f1416 0%, #12090b 100%)',
    border: '1px solid rgba(230, 57, 70, 0.35)',
    boxShadow: '0 8px 24px rgba(230, 57, 70, 0.25)',
    marginBottom: '12px'
  },
  floatingTaxi: {
    fontSize: '28px',
    display: 'inline-block',
    animation: 'floatTaxi 3.2s ease-in-out infinite',
    lineHeight: 1
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
  errorLink: {
    color: '#e63946',
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: '600'
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
    flexDirection: 'column'
  },
  label: {
    color: '#888888',
    fontSize: '11px',
    fontWeight: '700',
    marginBottom: '7px',
    letterSpacing: '1.2px'
  },
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '7px'
  },
  forgotLink: {
    color: '#e63946',
    fontSize: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    letterSpacing: '0.2px'
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
    fontFamily: 'inherit'
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
  }
};

export default Login;
