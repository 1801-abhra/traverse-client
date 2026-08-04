import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
    vehicleNumber: '',
    phone: '',
    carName: '',
    carModel: '',
    vehicleType: '4+1'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://traverse-app-production.up.railway.app/api/auth/register',
        form,
        { withCredentials: false }
      );
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      if (data.role === 'student') navigate('/student');
      else navigate('/driver');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {window.innerWidth <= 768 && (
        <div style={styles.mobileHeader}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚖</span>
            <span style={styles.logoText}>TRAVERSE</span>
          </div>
          <p style={styles.mobileTagline}>Join the <span style={styles.red}>Community.</span></p>
        </div>
      )}
      {window.innerWidth > 768 && (
        <div style={styles.leftPanel}>
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🚖</span>
              <span style={styles.logoText}>TRAVERSE</span>
            </div>
            <h1 style={styles.tagline}>Join the<br /><span style={styles.red}>Community.</span></h1>
            <p style={styles.subTagline}>Register as a student or driver and start your journey with Traverse</p>
            <div style={styles.features}>
              <div style={styles.feature}>✅ Safe & Verified Drivers</div>
              <div style={styles.feature}>✅ Real-time Tracking</div>
              <div style={styles.feature}>✅ Affordable Fares</div>
              <div style={styles.feature}>✅ 24/7 Available</div>
            </div>
          </div>
        </div>
      )}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Fill in your details to get started</p>

          {error && (
            <div style={styles.errorBox}>⚠️ {error}</div>
          )}

          <form onSubmit={handleRegister}>
            <div style={styles.roleToggle}>
              <button
                type='button'
                onClick={() => setForm({ ...form, role: 'student' })}
                style={form.role === 'student' ? styles.roleActive : styles.roleInactive}
              >
                🎓 Student
              </button>
              <button
                type='button'
                onClick={() => setForm({ ...form, role: 'driver' })}
                style={form.role === 'driver' ? styles.roleActive : styles.roleInactive}
              >
                🚗 Driver
              </button>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                name='name'
                placeholder='Enter your full name'
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                name='email'
                type='email'
                placeholder={form.role === 'student' ? 'RollNo@juitsolan.in' : 'Personal Email'}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                name='password'
                type='password'
                placeholder='Create a password'
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {form.role === 'student' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Student ID</label>
                <input
                  style={styles.input}
                  name='studentId'
                  placeholder='Your enrollment number'
                  value={form.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {form.role === 'driver' && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Vehicle Number</label>
                  <input
                    style={styles.input}
                    name='vehicleNumber'
                    placeholder='e.g. HP01AB1234'
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Car Name</label>
                  <input
                    style={styles.input}
                    name='carName'
                    placeholder='e.g. Suzuki'
                    value={form.carName || ''}
                    onChange={handleChange}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Car Model</label>
                  <input
                    style={styles.input}
                    name='carModel'
                    placeholder='e.g. Swift'
                    value={form.carModel || ''}
                    onChange={handleChange}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={styles.input}
                    name='phone'
                    placeholder='+91 Phone Number'
                    value={form.phone || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {form.role === 'driver' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Vehicle Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type='button'
                    onClick={() => setForm({ ...form, vehicleType: '4+1' })}
                    style={form.vehicleType === '4+1' ? styles.roleActive : styles.roleInactive}
                  >
                    🚗 4+1 Sedan
                  </button>
                  <button
                    type='button'
                    onClick={() => setForm({ ...form, vehicleType: '6+1' })}
                    style={form.vehicleType === '6+1' ? styles.roleActive : styles.roleInactive}
                  >
                    🚐 6+1 SUV
                  </button>
                </div>
              </div>
            )}

            <button
              style={loading ? styles.buttonLoading : styles.button}
              type='submit'
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.divider}>
            <span>Already have an account?</span>
          </div>

          <Link to='/login' style={styles.loginBtn}>
            Sign In
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
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
    background: '#0a0a0a',
    color: 'white'
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a0000 0%, #0a0a0a 50%, #1a0000 100%)',
    display: window.innerWidth <= 768 ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    borderRight: '1px solid #2a0000'
  },
  brandSection: { maxWidth: '400px' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' },
  logoIcon: { fontSize: '36px' },
  logoText: { fontSize: '28px', fontWeight: '800', letterSpacing: '4px', color: '#e63946' },
  tagline: { fontSize: '52px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', color: 'white' },
  red: { color: '#e63946' },
  subTagline: { fontSize: '18px', color: '#666', lineHeight: '1.6', marginBottom: '32px' },
  features: { display: 'flex', flexDirection: 'column', gap: '12px' },
  feature: { color: '#999', fontSize: '16px' },
  rightPanel: {
    width: window.innerWidth <= 768 ? '100%' : '520px',
    display: 'flex',
    alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
    justifyContent: 'center',
    padding: window.innerWidth <= 768 ? '24px 16px' : '40px',
    background: '#111',
    overflowY: 'auto',
    minHeight: window.innerWidth <= 768 ? 'auto' : '100vh'
  },
  card: { width: '100%', maxWidth: '420px', paddingTop: '20px', paddingBottom: '20px' },
  title: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'white' },
  subtitle: { color: '#666', marginBottom: '32px', fontSize: '15px' },
  errorBox: {
    background: '#2a0000', border: '1px solid #e63946',
    color: '#ff6b6b', padding: '12px 16px', borderRadius: '8px',
    marginBottom: '20px', fontSize: '14px'
  },
  roleToggle: { display: 'flex', gap: '8px', marginBottom: '24px' },
  roleActive: {
    flex: 1, padding: '12px', background: '#e63946', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer'
  },
  roleInactive: {
    flex: 1, padding: '12px', background: '#1a1a1a', color: '#666',
    border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer'
  },
  inputGroup: { marginBottom: '16px' },
  label: {
    display: 'block', color: '#999', fontSize: '13px',
    fontWeight: '500', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '1px'
  },
  input: {
    width: '100%', padding: '14px 16px', background: '#1a1a1a',
    border: '1px solid #2a2a2a', borderRadius: '8px', color: 'white',
    fontSize: '15px', boxSizing: 'border-box', outline: 'none'
  },
  button: {
    width: '100%', padding: '14px', background: '#e63946', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px',
    fontWeight: '600', cursor: 'pointer', marginTop: '8px'
  },
  buttonLoading: {
    width: '100%', padding: '14px', background: '#7a1a1a', color: '#999',
    border: 'none', borderRadius: '8px', fontSize: '16px',
    fontWeight: '600', cursor: 'not-allowed', marginTop: '8px'
  },
  mobileHeader: {
    background: 'linear-gradient(135deg, #1a0000 0%, #0a0a0a 100%)',
    padding: '24px 20px',
    borderBottom: '1px solid #2a0000',
    textAlign: 'center'
  },
  mobileTagline: {
    fontSize: '16px',
    color: '#999',
    marginTop: '8px'
  },
  divider: { textAlign: 'center', color: '#444', margin: '24px 0', fontSize: '14px' },
  loginBtn: {
    display: 'block', width: '100%', padding: '14px', background: 'transparent',
    color: '#e63946', border: '1px solid #e63946', borderRadius: '8px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer',
    textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box'
  }
};

export default Register;