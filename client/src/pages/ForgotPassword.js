import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'https://traverse-app.onrender.com';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
            setMessage(res.data.message);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
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

                {sent ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
                        <h2 style={styles.title}>Check Your Email!</h2>
                        <p style={styles.subtitle}>We sent a password reset link to <b style={{ color: '#e63946' }}>{email}</b></p>
                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '24px' }}>Link expires in 1 hour. Check spam folder if not found.</p>
                        <Link to='/login' style={styles.btn}>Back to Login</Link>
                    </div>
                ) : (
                    <>
                        <h2 style={styles.title}>Forgot Password?</h2>
                        <p style={styles.subtitle}>Enter your email and we'll send you a reset link</p>

                        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

                        <form onSubmit={handleSubmit}>
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
                            <button style={loading ? styles.btnLoading : styles.btn} type='submit' disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Link to='/login' style={{ color: '#e63946', fontSize: '14px' }}>← Back to Login</Link>
                        </div>
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

export default ForgotPassword;