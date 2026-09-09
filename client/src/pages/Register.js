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
        'https://traverse-app.onrender.com/api/auth/register',
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
        <div style={styles.ambientGlow} />

        <div style={styles.mobileContainer}>
          <div style={styles.cardPerspective}>
            <div style={{ ...styles.formCard, textAlign: 'center' }}>
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
        <div style={styles.ambientGlow} />

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
      <div style={styles.ambientGlow} />

      {/* Main Mobile-First App Shell */}
      <div style={styles.mobileContainer}>
        {/* Header Branding Area consistent with Login.js */}
        <header style={styles.header}>
          <div style={styles.logoBadge}>
            <span style={styles.floatingTaxi}>🚖</span>
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
          <div style={styles.formCard}>
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
                        🚗 4+1 Sedan
                      </button>
                      <button
                        type="button"
                        className={`role-tab ${form.vehicleType === '6+1' ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, vehicleType: '6+1' })}
                        style={form.vehicleType === '6+1' ? styles.roleTabActive : styles.roleTabInactive}
                      >
                        🚐 6+1 SUV
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