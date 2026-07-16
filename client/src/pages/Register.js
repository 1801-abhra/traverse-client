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
    carModel: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        form
      );
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      if (data.role === 'student') navigate('/student');
      else navigate('/driver');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚌 Traverse</h1>
        <p style={styles.subtitle}>Create Account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input style={styles.input} name='name' placeholder='Full Name' value={form.name} onChange={handleChange} required />
          <input style={styles.input} name='email' type='email' placeholder='University Email' value={form.email} onChange={handleChange} required />
          <input style={styles.input} name='password' type='password' placeholder='Password' value={form.password} onChange={handleChange} required />
          <select style={styles.input} name='role' value={form.role} onChange={handleChange}>
            <option value='student'>Student</option>
            <option value='driver'>Driver</option>
          </select>
          {form.role === 'student' && (
            <input style={styles.input} name='studentId' placeholder='Student ID' value={form.studentId} onChange={handleChange} required />
          )}
          {form.role === 'driver' && (
            <input style={styles.input} name='vehicleNumber' placeholder='Vehicle Number' value={form.vehicleNumber} onChange={handleChange} required />
          )}
          {form.role === 'driver' && (
            <input style={styles.input} name='carName' placeholder='Car Name (e.g. Suzuki)' value={form.carName || ''} onChange={handleChange} />
          )}
          {form.role === 'driver' && (
            <input style={styles.input} name='carModel' placeholder='Car Model (e.g. Swift)' value={form.carModel || ''} onChange={handleChange} />
          )}
          {form.role === 'driver' && (
            <input style={styles.input} name='phone' placeholder='+91 Phone Number' value={form.phone || ''} onChange={handleChange} />
          )}
          <button style={styles.button} type='submit'>Register</button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card: { background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', color: 'white' },
  title: { textAlign: 'center', fontSize: '28px', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#94a3b8', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  error: { color: '#ef4444', marginBottom: '12px', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '16px', color: '#94a3b8' }
};

export default Register;