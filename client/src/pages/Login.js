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
        'https://traverse-app-production.up.railway.app/api/auth/login',
        { email, password }
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

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚖</span>
            <span style={styles.logoText}>TRAVERSE</span>
          </div>
          <h1 style={styles.tagline}>Campus Travel,<br /><span style={styles.red}>Simplified.</span></h1>
          <p style={styles.subTagline}>Safe, fast and affordable rides for university students</p>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
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
              <label style={styles.label}>Password</label>
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
              style={loading ? styles.buttonLoading : styles.button}
              type='submit'
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.divider}>
            <span>Don't have an account?</span>
          </div>

          <Link to='/register' style={styles.registerBtn}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0a0a0a',
    color: 'white',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a0000 0%, #0a0a0a 50%, #1a0000 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    borderRight: '1px solid #2a0000',
  },
  brandSection: {
    maxWidth: '400px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '48px'
  },
  logoIcon: {
    fontSize: '36px'
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '4px',
    color: '#e63946'
  },
  tagline: {
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '24px',
    color: 'white'
  },
  red: {
    color: '#e63946'
  },
  subTagline: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.6'
  },
  rightPanel: {
    width: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: '#111'
  },
  card: {
    width: '100%',
    maxWidth: '380px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: 'white'
  },
  subtitle: {
    color: '#666',
    marginBottom: '32px',
    fontSize: '15px'
  },
  errorBox: {
    background: '#2a0000',
    border: '1px solid #e63946',
    color: '#ff6b6b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: '#999',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: 'white',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#e63946',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  buttonLoading: {
    width: '100%',
    padding: '14px',
    background: '#7a1a1a',
    color: '#999',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '8px'
  },
  divider: {
    textAlign: 'center',
    color: '#444',
    margin: '24px 0',
    fontSize: '14px'
  },
  registerBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    background: 'transparent',
    color: '#e63946',
    border: '1px solid #e63946',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box'
  }
};

export default Login;