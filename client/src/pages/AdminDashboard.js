import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [rides, setRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://traverse-app-production.up.railway.app/api/auth/admin/login',
        { email, password }
      );
      setToken(res.data.token);
      setIsLoggedIn(true);
      fetchData(res.data.token);
    } catch (err) {
      setError('Invalid admin credentials');
    }
  };

  const fetchData = async (t) => {
    try {
      const [ridesRes, usersRes] = await Promise.all([
        axios.get('https://traverse-app-production.up.railway.app/api/rides/admin/rides',
          { headers: { Authorization: `Bearer ${t}` } }),
        axios.get('https://traverse-app-production.up.railway.app/api/auth/admin/users',
          { headers: { Authorization: `Bearer ${t}` } })
      ]);
      setRides(ridesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.log('Fetch error:', err);
    }
  };

  const cancelRide = async (rideId) => {
    try {
      await axios.put(
        `https://traverse-app-production.up.railway.app/api/rides/admin/cancel/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(token);
    } catch (err) {
      console.log('Cancel error:', err);
    }
  };

  const blockUser = async (userId) => {
    try {
      await axios.put(
        `https://traverse-app-production.up.railway.app/api/auth/admin/block/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(token);
    } catch (err) {
      console.log('Block error:', err);
    }
  };

  const students = users.filter(u => u.role === 'student');
  const drivers = users.filter(u => u.role === 'driver');
  const activeRides = rides.filter(r => r.status === 'accepted' || r.status === 'ontheway');
  const completedRides = rides.filter(r => r.status === 'completed');
  const totalRevenue = completedRides.reduce((acc, r) => acc + (r.fare || 0), 0);

  const statusColor = {
    searching: '#f59e0b', accepted: '#3b82f6',
    ontheway: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444'
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>🔐 Admin Login</h1>
          <p style={styles.subtitle}>Traverse Admin Panel</p>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleLogin}>
            <input style={styles.input} type='email' placeholder='Admin Email'
              value={email} onChange={e => setEmail(e.target.value)} required />
            <input style={styles.input} type='password' placeholder='Password'
              value={password} onChange={e => setPassword(e.target.value)} required />
            <button style={styles.button} type='submit'>Login</button>
          </form>
          <button onClick={() => navigate('/login')} style={styles.backBtn}>← Back to App</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🚌 Traverse Admin</h2>
        <button onClick={() => setIsLoggedIn(false)} style={styles.navBtn}>Logout</button>
      </div>

      <div style={styles.content}>
        {/* Stats Overview */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Students</p>
            <p style={styles.statValue}>{students.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Drivers</p>
            <p style={styles.statValue}>{drivers.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Rides</p>
            <p style={styles.statValue}>{activeRides.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Revenue</p>
            <p style={styles.statValue}>₹{totalRevenue}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Rides</p>
            <p style={styles.statValue}>{rides.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Completed</p>
            <p style={styles.statValue}>{completedRides.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['rides', 'students', 'drivers'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Rides Tab */}
        {tab === 'rides' && (
          <div>
            <h3>All Rides ({rides.length})</h3>
            {rides.map(ride => (
              <div key={ride._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={{ color: statusColor[ride.status], fontWeight: 'bold' }}>
                    {ride.status.toUpperCase()}
                  </span>
                  <span style={styles.date}>
                    {new Date(ride.createdAt).toLocaleDateString()} {new Date(ride.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p>Student: <b>{ride.student?.name || 'N/A'}</b> | {ride.student?.email}</p>
                <p>Driver: <b>{ride.driver?.name || 'Not assigned'}</b> | {ride.driver?.vehicleNumber}</p>
                <p>From: <b>{ride.pickup}</b> → To: <b>{ride.dropoff}</b></p>
                {ride.fare > 0 && <p>Fare: <b>₹{ride.fare}</b></p>}
                {ride.rating && <p>Rating: <b>⭐ {ride.rating}/5</b></p>}
                {(ride.status === 'searching' || ride.status === 'accepted' || ride.status === 'ontheway') && (
                  <button onClick={() => cancelRide(ride._id)} style={styles.cancelBtn}>
                    Cancel Ride
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Students Tab */}
        {tab === 'students' && (
          <div>
            <h3>All Students ({students.length})</h3>
            {students.map(user => (
              <div key={user._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <b>{user.name}</b>
                  <span style={{ color: user.isBlocked ? '#ef4444' : '#10b981' }}>
                    {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                  </span>
                </div>
                <p>Email: {user.email}</p>
                <p>Student ID: {user.studentId || 'N/A'}</p>
                <p>Phone: {user.phone || 'N/A'}</p>
                <button onClick={() => blockUser(user._id)}
                  style={{ ...styles.cancelBtn, background: user.isBlocked ? '#10b981' : '#ef4444' }}>
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drivers Tab */}
        {tab === 'drivers' && (
          <div>
            <h3>All Drivers ({drivers.length})</h3>
            {drivers.map(user => (
              <div key={user._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <b>{user.name}</b>
                  <span style={{ color: user.isBlocked ? '#ef4444' : '#10b981' }}>
                    {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                  </span>
                </div>
                <p>Email: {user.email}</p>
                <p>Vehicle: {user.vehicleNumber || 'N/A'}</p>
                <p>Car: {user.carName} {user.carModel}</p>
                <p>Phone: {user.phone || 'N/A'}</p>
                <button onClick={() => blockUser(user._id)}
                  style={{ ...styles.cancelBtn, background: user.isBlocked ? '#10b981' : '#ef4444' }}>
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', color: 'white' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#1e293b' },
  logo: { margin: 0 },
  navBtn: { background: 'transparent', color: 'white', border: '1px solid #334155', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  content: { maxWidth: '900px', margin: '40px auto', padding: '0 16px' },
  loginCard: { background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', margin: '100px auto', color: 'white' },
  title: { textAlign: 'center', fontSize: '28px', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#94a3b8', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  backBtn: { width: '100%', padding: '10px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '12px' },
  error: { color: '#ef4444', marginBottom: '12px', textAlign: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: { background: '#1e293b', padding: '20px', borderRadius: '12px', textAlign: 'center' },
  statLabel: { color: '#94a3b8', fontSize: '14px', margin: '0 0 8px 0' },
  statValue: { fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#3b82f6' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { padding: '10px 24px', background: '#1e293b', color: '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  activeTab: { background: '#3b82f6', color: 'white' },
  card: { background: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '12px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  date: { color: '#94a3b8', fontSize: '13px' },
  cancelBtn: { padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' }
};

export default AdminDashboard;