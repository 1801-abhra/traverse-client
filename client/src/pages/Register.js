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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://traverse-app.onrender.com/api/auth/register',
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

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={styles.container}>
      {/* Brand Panel */}
      <div style={isMobile ? styles.brandMobile : styles.brandDesktop}>
        <div style={styles.brandInner}>
          <div style={styles.logoRow}>
            <div style={styles.logoBox}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#e63946" />
                <path d="M8,14 L32,14 L32,20 L23,20 L23,32 L17,32 L17,20 L8,20 Z" fill="white" />
              </svg>
            </div>
            <span style={styles.brandName}>TRAVERSE</span>
          </div>
          <h1 style={isMobile ? styles.taglineMobile : styles.taglineDesktop}>
            Join the<br /><span style={styles.red}>Community.</span>
          </h1>
          {!isMobile && (
            <p style={styles.subTagline}>
              Register as a student or driver<br />and start your journey today
            </p>
          )}
          <div style={styles.pills}>
            <div style={styles.pill}>✅ Verified Drivers</div>
            <div style={styles.pill}>📍 Live Tracking</div>
            {!isMobile && <div style={styles.pill}>💰 Best Fares</div>}
            {!isMobile && <div style={styles.pill}>⚡ Instant Booking</div>}
          </div>
        </div>
      </div>

      {/* Register Form Panel */}
      <div style={isMobile ? styles.formMobile : styles.formDesktop}>
        <div style={styles.formInner}>
          <h2 style={styles.formTitle}>Create Account</h2>
          <p style={styles.formSubtitle}>Fill in your details to get started</p>

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <form onSubmit={handleRegister}>
            {/* Role Toggle */}
            <div style={styles.roleRow}>
              <button type='button'
                onClick={() => setForm({ ...form, role: 'student' })}
                style={form.role === 'student' ? styles.roleActive : styles.roleInactive}>
                🎓 Student
              </button>
              <button type='button'
                onClick={() => setForm({ ...form, role: 'faculty' })}
                style={form.role === 'faculty' ? styles.roleActive : styles.roleInactive}>
                👨‍🏫 Faculty
              </button>
              <button type='button'
                onClick={() => setForm({ ...form, role: 'driver' })}
                style={form.role === 'driver' ? styles.roleActive : styles.roleInactive}>
                🚗 Driver
              </button>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>FULL NAME</label>
              <input style={styles.input} name='name' placeholder='Enter your full name'
                value={form.name} onChange={handleChange} required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>EMAIL</label>
              <input style={styles.input} name='email' type='email'
                placeholder={form.role === 'student' ? 'RollNo@juitsolan.in' : 'Personal Email'}
                value={form.email} onChange={handleChange} required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input style={styles.input} name='password' type='password'
                placeholder='Create a password' value={form.password}
                onChange={handleChange} required />
            </div>

            {
              form.role === 'student' && (
                <>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>STUDENT ID</label>
                    <input style={styles.input} name='studentId'
                      placeholder='Your enrollment number'
                      value={form.studentId} onChange={handleChange} required />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>PHONE NUMBER</label>
                    <input style={styles.input} name='phone'
                      placeholder='+91 Phone Number'
                      value={form.phone || ''} onChange={handleChange} required />
                  </div>
                </>
              )
            }

            {form.role === 'faculty' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>PHONE NUMBER</label>
                <input style={styles.input} name='phone'
                  placeholder='+91 Phone Number'
                  value={form.phone || ''} onChange={handleChange} required />
              </div>
            )}

            {form.role === 'driver' && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>VEHICLE NUMBER</label>
                  <input style={styles.input} name='vehicleNumber'
                    placeholder='e.g. HP01AB1234'
                    value={form.vehicleNumber} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>CAR NAME</label>
                  <input style={styles.input} name='carName'
                    placeholder='e.g. Suzuki'
                    value={form.carName || ''} onChange={handleChange} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>CAR MODEL</label>
                  <input style={styles.input} name='carModel'
                    placeholder='e.g. Swift'
                    value={form.carModel || ''} onChange={handleChange} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>VEHICLE TYPE</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type='button'
                      onClick={() => setForm({ ...form, vehicleType: '4+1' })}
                      style={form.vehicleType === '4+1' ? styles.roleActive : styles.roleInactive}>
                      🚗 4+1 Sedan
                    </button>
                    <button type='button'
                      onClick={() => setForm({ ...form, vehicleType: '6+1' })}
                      style={form.vehicleType === '6+1' ? styles.roleActive : styles.roleInactive}>
                      🚐 6+1 SUV
                    </button>
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>PHONE NUMBER</label>
                  <input style={styles.input} name='phone'
                    placeholder='+91 Phone Number'
                    value={form.phone || ''} onChange={handleChange} required />
                </div>
              </>
            )}

            <button
              style={loading ? styles.btnLoading : styles.btn}
              type='submit' disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Already have an account?</span>
            <div style={styles.dividerLine} />
          </div>

          <Link to='/login' style={styles.loginBtn}>Sign In</Link>
        </div>
      </div>
    </div >
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
    borderRight: '1px solid #2a0000'
  },
  brandMobile: {
    background: 'linear-gradient(145deg, #1a0000 0%, #0d0d0d 100%)',
    padding: '40px 24px 32px',
    borderBottom: '1px solid #2a0000'
  },
  brandInner: { maxWidth: '420px', width: '100%' },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: isMobile ? '20px' : '48px'
  },
  logoBox: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: {
    fontSize: isMobile ? '22px' : '26px',
    fontWeight: '800', letterSpacing: '5px', color: 'white'
  },
  taglineDesktop: {
    fontSize: '52px', fontWeight: '800', lineHeight: '1.1',
    marginBottom: '20px', color: 'white'
  },
  taglineMobile: {
    fontSize: '28px', fontWeight: '800', lineHeight: '1.2',
    marginBottom: '16px', color: 'white'
  },
  red: { color: '#e63946' },
  subTagline: { fontSize: '17px', color: '#888', lineHeight: '1.7', marginBottom: '40px' },
  pills: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: isMobile ? '16px' : '0' },
  pill: {
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    padding: '8px 14px', borderRadius: '20px', fontSize: '13px', color: '#999'
  },
  formDesktop: {
    width: '480px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px', background: '#111',
    overflowY: 'auto'
  },
  formMobile: { flex: 1, padding: '32px 24px 40px', background: '#111' },
  formInner: { width: '100%', maxWidth: '380px', margin: '0 auto' },
  formTitle: { fontSize: '28px', fontWeight: '700', marginBottom: '6px', color: 'white' },
  formSubtitle: { color: '#666', marginBottom: '24px', fontSize: '15px' },
  errorBox: {
    background: '#1a0000', border: '1px solid #e63946',
    color: '#ff6b6b', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '20px', fontSize: '14px'
  },
  roleRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  roleActive: {
    flex: 1, padding: '11px', background: '#e63946', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer'
  },
  roleInactive: {
    flex: 1, padding: '11px', background: '#1a1a1a', color: '#666',
    border: '1px solid #222', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer'
  },
  inputGroup: { marginBottom: '16px' },
  label: {
    display: 'block', color: '#555', fontSize: '11px',
    fontWeight: '600', marginBottom: '8px', letterSpacing: '1.5px'
  },
  input: {
    width: '100%', padding: '14px 16px', background: '#1a1a1a',
    border: '1px solid #222', borderRadius: '10px', color: 'white',
    fontSize: '15px', boxSizing: 'border-box', outline: 'none'
  },
  btn: {
    width: '100%', padding: '15px', background: '#e63946', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '16px',
    fontWeight: '600', cursor: 'pointer', marginTop: '4px'
  },
  btnLoading: {
    width: '100%', padding: '15px', background: '#6a1520', color: '#999',
    border: 'none', borderRadius: '10px', fontSize: '16px',
    cursor: 'not-allowed', marginTop: '4px'
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' },
  dividerLine: { flex: 1, height: '1px', background: '#222' },
  dividerText: { color: '#555', fontSize: '13px', whiteSpace: 'nowrap' },
  loginBtn: {
    display: 'block', width: '100%', padding: '14px', background: 'transparent',
    color: '#e63946', border: '1px solid #e63946', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', textAlign: 'center',
    textDecoration: 'none', boxSizing: 'border-box'
  }
};

export default Register;