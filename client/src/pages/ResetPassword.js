import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API = 'https://traverse-app.onrender.com';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API}/api/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoRow}>
                    <span style={styles.logoIcon}>🚖</span>
                    <span style={styles.logoText}>TRAVERSE</span>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h2 style={styles.title}>Password Reset!</h2>
                        <p style={styles.subtitle}>Your password has been reset successfully. Redirecting to login...</p>
                        <Link to='/login' style={styles.btn}>Go to Login</Link>
                    </div>
                ) : (
                    <>
                        <h2 style={styles.title}>Reset Password</h2>
                        <p style={styles.subtitle}>Enter your new password below</p>

                        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>NEW PASSWORD</label>
                                <input
                                    style={styles.input}
                                    type='password'
                                    placeholder='Enter new password'
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>CONFIRM PASSWORD</label>
                                <input
                                    style={styles.input}
                                    type='password'
                                    placeholder='Confirm new password'
                                    value={confirm}
                                    onChange={e => { setConfirm(e.target.value); setError(''); }}
                                    required
                                />
                            </div>
                            <button style={loading ? styles.btnLoading : styles.btn} type='submit' disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' },
    card: { background: '#111', border: '1px solid #1a1a1a', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', color: 'white' },
    logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' },
    logoIcon: { fontSize: '28px' },
    logoText: { fontSize: '22px', fontWeight: '800', letterSpacing: '4px', color: '#e63946' },
    title: { fontSize: '24px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' },
    subtitle: { color: '#666', marginBottom: '28px', fontSize: '14px', textAlign: 'center' },
    errorBox: { background: '#1a0000', border: '1px solid #e63946', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', color: '#555', fontSize: '11px', fontWeight: '600', marginBottom: '8px', letterSpacing: '1.5px' },
    input: { width: '100%', padding: '14px 16px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '10px', color: 'white', fontSize: '15px', boxSizing: 'border-box', outline: 'none' },
    btn: { display: 'block', width: '100%', padding: '14px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' },
    btnLoading: { width: '100%', padding: '14px', background: '#6a1520', color: '#999', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'not-allowed' },
};

export default ResetPassword;