import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      `}</style>

      {/* Animated Dark Red Ambient Gradient Glow Background */}
      <div style={styles.ambientGlow} />

      {/* Main Mobile-First App Shell */}
      <div style={styles.mobileContainer}>
        {/* Header Branding Area */}
        <header style={styles.header}>
          <div style={styles.logoBadge}>
            <span style={styles.floatingTaxi}>🚖</span>
          </div>
          <h1 style={styles.brandTitle}>TRAVERSE</h1>
          <p style={styles.brandTagline}>
            Campus Travel, <span style={styles.redText}>Simplified.</span>
          </p>

          {/* Quick Ride Feature Badges */}
          <div style={styles.featurePills}>
            <span style={styles.pill}>⚡ Instant Booking</span>
            <span style={styles.pill}>🔒 Safe Rides</span>
            <span style={styles.pill}>💰 Best Fares</span>
          </div>
        </header>

        {/* 3D Form Card with Perspective */}
        <div style={styles.cardPerspective}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Welcome Back</h2>
              <p style={styles.cardSubtitle}>Sign in to book your ride</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorText}>
                  {error.includes('blocked') ? '🚫' : '⚠️'} {error}
                </div>
                {error.includes('blocked') && (
                  <div style={{ marginTop: '8px' }}>
                    <a href="mailto:traverseuni@gmail.com" style={styles.errorLink}>
                      📧 traverseuni@gmail.com
                    </a>
                  </div>
                )}
                {error.includes('verify') && (
                  <button
                    onClick={resendVerification}
                    style={styles.verifyBtn}
                  >
                    📧 Click here to get Verification Link
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>EMAIL ADDRESS</label>
                <input
                  className="traverse-input"
                  style={styles.input}
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
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
                  className="traverse-input"
                  style={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>

              <button
                className="traverse-btn-primary"
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