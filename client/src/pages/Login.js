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

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={styles.container}>
      {/* Brand Panel */}
      <div style={isMobile ? styles.brandMobile : styles.brandDesktop}>
        <div style={styles.brandInner}>
          {/* Logo */}
          <div style={styles.logoRow}>
            <div style={styles.logoBox}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#e63946" />
                <path d="M8,14 L32,14 L32,20 L23,20 L23,32 L17,32 L17,20 L8,20 Z" fill="white" />
              </svg>
            </div>
            <span style={styles.brandName}>TRAVERSE</span>
          </div>

          {/* Tagline */}
          <h1 style={isMobile ? styles.taglineMobile : styles.taglineDesktop}>
            Campus Travel,<br />
            <span style={styles.red}>Simplified.</span>
          </h1>

          {!isMobile && (
            <p style={styles.subTagline}>
              Safe, fast and affordable rides<br />for university students
            </p>
          )}

          {/* Feature pills - mobile only shows 2 */}
          <div style={styles.pills}>
            <div style={styles.pill}>⚡ Instant Booking</div>
            <div style={styles.pill}>🔒 Safe Rides</div>
            {!isMobile && <div style={styles.pill}>📍 Live Tracking</div>}
            {!isMobile && <div style={styles.pill}>💰 Best Fares</div>}
          </div>
        </div>
      </div>

      {/* Login Form Panel */}
      <div style={isMobile ? styles.formMobile : styles.formDesktop}>
        <div style={styles.formInner}>
          <h2 style={styles.formTitle}>Welcome back</h2>
          <p style={styles.formSubtitle}>Sign in to continue</p>

          {error && (
            <div style={{
              ...styles.errorBox,
              background: error.includes('blocked') ? '#1a0000' : '#1a0000',
              borderColor: error.includes('blocked') ? '#e63946' : '#e63946'
            }}>
              {error.includes('blocked') ? '🚫' : '⚠️'} {error}
              {error.includes('blocked') && (
                <div style={{ marginTop: '8px' }}>
                  <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946', fontSize: '13px' }}>
                    📧 traverseuni@gmail.com
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>EMAIL</label>
              <input
                style={styles.input}
                type='email'
                placeholder='your@email.com'
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input
                style={styles.input}
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            <button
              style={loading ? styles.btnLoading : styles.btn}
              type='submit'
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>New to Traverse?</span>
            <div style={styles.dividerLine} />
          </div>

          <Link to='/register' style={styles.registerBtn}>
            Create Account
          </Link>

          <p style={styles.adminLink}>
            Admin? <Link to='/admin' style={{ color: '#e63946' }}>Admin Panel</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const isMobile = window.innerWidth <= 768;

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    background: '#0a0a0a',
    color: 'white',
    fontFamily: 'Inter, -apple-system, sans-serif'
  },
  brandDesktop: {
    flex: 1,
    background: 'linear-gradient(145deg, #1a0000 0%, #0d0d0d 40%, #1a0000 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    borderRight: '1px solid #2a0000',
    position: 'relative',
    overflow: 'hidden'
  },
  brandMobile: {
    background: 'linear-gradient(145deg, #1a0000 0%, #0d0d0d 100%)',
    padding: '40px 24px 32px',
    borderBottom: '1px solid #2a0000'
  },
  brandInner: {
    maxWidth: '420px',
    width: '100%'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: isMobile ? '20px' : '48px'
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandName: {
    fontSize: isMobile ? '22px' : '26px',
    fontWeight: '800',
    letterSpacing: '5px',
    color: 'white'
  },
  taglineDesktop: {
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '20px',
    color: 'white'
  },
  taglineMobile: {
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '16px',
    color: 'white'
  },
  red: { color: '#e63946' },
  subTagline: {
    fontSize: '17px',
    color: '#888',
    lineHeight: '1.7',
    marginBottom: '40px'
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: isMobile ? '16px' : '0'
  },
  pill: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#999'
  },
  formDesktop: {
    width: '460px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: '#111'
  },
  formMobile: {
    flex: 1,
    padding: '32px 24px 40px',
    background: '#111'
  },
  formInner: {
    width: '100%',
    maxWidth: '360px',
    margin: '0 auto'
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '6px',
    color: 'white'
  },
  formSubtitle: {
    color: '#666',
    marginBottom: '28px',
    fontSize: '15px'
  },
  errorBox: {
    background: '#1a0000',
    border: '1px solid #e63946',
    color: '#ff6b6b',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  inputGroup: { marginBottom: '18px' },
  label: {
    display: 'block',
    color: '#555',
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '8px',
    letterSpacing: '1.5px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: '10px',
    color: 'white',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  btn: {
    width: '100%',
    padding: '15px',
    background: '#e63946',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    letterSpacing: '0.3px'
  },
  btnLoading: {
    width: '100%',
    padding: '15px',
    background: '#6a1520',
    color: '#999',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'not-allowed',
    marginTop: '4px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#222'
  },
  dividerText: {
    color: '#555',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  registerBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    background: 'transparent',
    color: '#e63946',
    border: '1px solid #e63946',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box'
  },
  adminLink: {
    textAlign: 'center',
    color: '#444',
    fontSize: '13px',
    marginTop: '16px'
  }
};

export default Login;