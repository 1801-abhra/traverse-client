import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://traverse-app.onrender.com';

function AdminDashboard() {
  const [rides, setRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tokenRef = React.useRef('');
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/admin/login`, { email, password });
      setToken(res.data.token);
      tokenRef.current = res.data.token;
      setIsLoggedIn(true);
      fetchData(res.data.token);
    } catch (err) {
      setError('Invalid admin credentials');
    }
    setLoading(false);
  };

  const fetchData = async (t) => {
    try {
      const [ridesRes, usersRes] = await Promise.all([
        axios.get(`${API}/api/rides/admin/rides`, { headers: { Authorization: `Bearer ${t}` } }),
        axios.get(`${API}/api/auth/admin/users`, { headers: { Authorization: `Bearer ${t}` } })
      ]);
      setRides(ridesRes.data);
      setUsers(usersRes.data);
    } catch (err) { console.log('Fetch error:', err); }
  };

  const cancelRide = async (rideId) => {
    try {
      await axios.put(`${API}/api/rides/admin/cancel/${rideId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(token);
    } catch (err) { console.log('Cancel error:', err); }
  };

  const blockUser = async (userId) => {
    try {
      await axios.put(`${API}/api/auth/admin/block/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(token);
    } catch (err) { console.log('Block error:', err); }
  };

  const verifyDriver = async (userId) => {
    try {
      await axios.put(`${API}/api/auth/admin/verify/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(token);
    } catch (err) {
      console.log('Verify error:', err);
    }
  };

  const students = users.filter(u => u.role === 'student');
  const faculty = users.filter(u => u.role === 'faculty');
  const drivers = users.filter(u => u.role === 'driver');
  const activeRides = rides.filter(r => r.status === 'accepted' || r.status === 'ontheway');
  const completedRides = rides.filter(r => r.status === 'completed');
  const totalRevenue = completedRides.reduce((acc, r) => acc + (r.fare || 0), 0);

  const statusColor = {
    searching: '#f59e0b', accepted: '#e63946',
    ontheway: '#e63946', completed: '#10b981', cancelled: '#666'
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginWrapper}>
          <div style={styles.loginBrand}>
            <span style={styles.loginLogo}>🚖</span>
            <span style={styles.loginTitle}>TRAVERSE</span>
          </div>
          <div style={styles.loginCard}>
            <h2 style={styles.loginHeading}>Admin Panel</h2>
            <p style={styles.loginSubtitle}>Sign in to manage Traverse</p>
            {error && <div style={styles.errorBox}>⚠️ {error}</div>}
            <form onSubmit={handleLogin}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} type='email' placeholder='admin@traverse.com'
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input style={styles.input} type='password' placeholder='Enter password'
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required />
              </div>
              <button style={loading ? styles.btnLoading : styles.btn} type='submit' disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <button onClick={() => navigate('/login')} style={styles.backBtn}>← Back to App</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🚖</span>
          <span style={styles.navTitle}>TRAVERSE ADMIN</span>
        </div>
        <div style={styles.navRight}>
          <button onClick={() => fetchData(tokenRef.current)} style={styles.refreshBtn}>🔄 Refresh</button>
          <button onClick={() => setIsLoggedIn(false)} style={styles.navBtnRed}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Students</p>
            <p style={styles.statValue}>{students.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Drivers</p>
            <p style={{ ...styles.statValue, color: '#e63946' }}>{drivers.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Rides</p>
            <p style={{ ...styles.statValue, color: '#f59e0b' }}>{activeRides.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Rides</p>
            <p style={styles.statValue}>{rides.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Completed</p>
            <p style={{ ...styles.statValue, color: '#10b981' }}>{completedRides.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Revenue</p>
            <p style={{ ...styles.statValue, color: '#e63946' }}>₹{totalRevenue}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['rides', 'students', 'faculty', 'drivers'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={tab === t ? styles.tabActive : styles.tabInactive}>
              {t === 'rides' ? '🚖' : t === 'students' ? '🎓' : t === 'faculty' ? '👨‍🏫' : '🚗'} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Rides Tab */}
        {tab === 'rides' && (
          <div>
            <p style={styles.tabTitle}>All Rides — {rides.length} total</p>
            {rides.map(ride => (
              <div key={ride._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.statusBadge, background: statusColor[ride.status] + '22', color: statusColor[ride.status], border: `1px solid ${statusColor[ride.status]}` }}>
                    {ride.status.toUpperCase()}
                  </span>
                  <span style={styles.dateText}>
                    {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} {new Date(ride.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div style={styles.rideDetails}>
                  <p style={styles.detailRow}>👤 <b>{ride.student?.name || 'N/A'}</b> — {ride.student?.email}</p>
                  <p style={styles.detailRow}>🚗 <b>{ride.driver?.name || 'Not assigned'}</b> {ride.driver?.vehicleNumber && `— ${ride.driver.vehicleNumber}`}</p>
                  <p style={styles.detailRow}>📍 {ride.pickup} → {ride.dropoff}</p>
                  {ride.fare > 0 && <p style={styles.detailRow}>💰 ₹{ride.fare}</p>}
                  {ride.rating && <p style={styles.detailRow}>⭐ Rated {ride.rating}/5</p>}
                </div>
                {(ride.status === 'searching' || ride.status === 'accepted' || ride.status === 'ontheway') && (
                  <button onClick={() => cancelRide(ride._id)} style={styles.cancelBtn}>Cancel Ride</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Students Tab */}
        {tab === 'students' && (
          <div>
            <p style={styles.tabTitle}>All Students — {students.length} registered</p>
            {students.map(u => (
              <div key={u._id} style={{ ...styles.card, border: u.isBlocked ? '1px solid #e63946' : '1px solid #1a1a1a' }}>
                <div style={styles.cardHeader}>
                  <div style={styles.userInfo}>
                    <span style={styles.userAvatar}>🎓</span>
                    <div>
                      <p style={styles.userName}>{u.name}</p>
                      <p style={styles.userEmail}>{u.email}</p>
                    </div>
                  </div>
                  <span style={{ ...styles.statusPill, background: u.isBlocked ? '#66000022' : '#00660022', color: u.isBlocked ? '#ef4444' : '#10b981', border: `1px solid ${u.isBlocked ? '#ef4444' : '#10b981'}` }}>
                    {u.isBlocked ? '🚫 BLOCKED' : '✅ ACTIVE'}
                  </span>
                </div>
                <p style={styles.detailRow}>🆔 {u.studentId || 'N/A'}</p>
                <p style={styles.detailRow}>📞 {u.phone || 'N/A'}</p>
                <p style={styles.detailRow}>❌ Cancellations: <b style={{ color: u.cancelCount >= 3 ? '#e63946' : 'white' }}>{u.cancelCount || 0}</b> / 5</p>
                {u.cancelCount >= 3 && !u.isBlocked && (
                  <div style={{ background: '#1a0a00', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '8px' }}>
                    ⚠️ At risk — {5 - u.cancelCount} cancellations remaining
                  </div>
                )}
                {u.isBlocked && (
                  <div style={{ background: '#1a0000', border: '1px solid #e63946', color: '#ff6b6b', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '8px' }}>
                    🚫 Must email traverseuni@gmail.com to appeal
                  </div>
                )}
                <button onClick={() => blockUser(u._id)}
                  style={{ ...styles.cancelBtn, background: u.isBlocked ? '#10b981' : '#e63946' }}>
                  {u.isBlocked ? '✅ Unblock User' : '🚫 Block User'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Faculty Tab */}
        {tab === 'faculty' && (
          <div>
            <p style={styles.tabTitle}>All Faculty — {faculty.length} registered</p>
            {faculty.map(u => (
              <div key={u._id} style={{ ...styles.card, border: u.isBlocked ? '1px solid #e63946' : '1px solid #1a1a1a' }}>
                <div style={styles.cardHeader}>
                  <div style={styles.userInfo}>
                    <span style={styles.userAvatar}>👨‍🏫</span>
                    <div>
                      <p style={styles.userName}>{u.name}</p>
                      <p style={styles.userEmail}>{u.email}</p>
                    </div>
                  </div>
                  <span style={{ ...styles.statusPill, background: u.isBlocked ? '#66000022' : '#00660022', color: u.isBlocked ? '#ef4444' : '#10b981', border: `1px solid ${u.isBlocked ? '#ef4444' : '#10b981'}` }}>
                    {u.isBlocked ? '🚫 BLOCKED' : '✅ ACTIVE'}
                  </span>
                </div>
                <p style={styles.detailRow}>📞 {u.phone || 'N/A'}</p>
                <p style={styles.detailRow}>❌ Cancellations: <b style={{ color: u.cancelCount >= 3 ? '#e63946' : 'white' }}>{u.cancelCount || 0}</b> / 5</p>
                <button onClick={() => blockUser(u._id)}
                  style={{ ...styles.cancelBtn, background: u.isBlocked ? '#10b981' : '#e63946' }}>
                  {u.isBlocked ? '✅ Unblock' : '🚫 Block'}
                </button>
              </div>
            ))}
            {faculty.length === 0 && (
              <div style={styles.empty}>
                <p style={styles.emptyTitle}>No faculty registered yet</p>
              </div>
            )}
          </div>
        )}

        {/* Drivers Tab */}
        {tab === 'drivers' && (
          <div>
            <p style={styles.tabTitle}>All Drivers — {drivers.length} registered</p>
            {drivers.map(u => (
              <div key={u._id} style={{ ...styles.card, border: u.isBlocked ? '1px solid #e63946' : '1px solid #1a1a1a' }}>
                <div style={styles.cardHeader}>
                  <div style={styles.userInfo}>
                    <span style={styles.userAvatar}>🚗</span>
                    <div>
                      <p style={styles.userName}>{u.name}</p>
                      <p style={styles.userEmail}>{u.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {!u.isVerified && (
                      <span style={{ background: '#1a0a00', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        ⏳ PENDING
                      </span>
                    )}
                    <span style={{ ...styles.statusPill, background: u.isBlocked ? '#66000022' : '#00660022', color: u.isBlocked ? '#ef4444' : '#10b981', border: `1px solid ${u.isBlocked ? '#ef4444' : '#10b981'}` }}>
                      {u.isBlocked ? '🚫 BLOCKED' : '✅ ACTIVE'}
                    </span>
                  </div>
                </div>
                <p style={styles.detailRow}>🚘 {u.vehicleNumber || 'N/A'} {u.carName && `• ${u.carName} ${u.carModel}`}</p>
                <p style={styles.detailRow}>📞 {u.phone || 'N/A'}</p>
                <p style={styles.detailRow}>🚗 Vehicle Type: <b>{u.vehicleType || 'N/A'}</b></p>
                <p style={styles.detailRow}>⭐ Online: <b style={{ color: u.isAvailable ? '#10b981' : '#666' }}>{u.isAvailable ? 'Yes' : 'No'}</b></p>
                <p style={styles.detailRow}>❌ Cancellations: <b style={{ color: u.cancelCount >= 3 ? '#e63946' : 'white' }}>{u.cancelCount || 0}</b> / 5</p>
                {u.cancelCount >= 3 && !u.isBlocked && (
                  <div style={{ background: '#1a0a00', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '8px' }}>
                    ⚠️ At risk — {5 - u.cancelCount} cancellations remaining
                  </div>
                )}
                {u.isBlocked && (
                  <div style={{ background: '#1a0000', border: '1px solid #e63946', color: '#ff6b6b', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '8px' }}>
                    🚫 Must email traverseuni@gmail.com to appeal
                  </div>
                )}
                <button onClick={() => blockUser(u._id)}
                  style={{ ...styles.cancelBtn, background: u.isBlocked ? '#10b981' : '#e63946' }}>
                  {u.isBlocked ? '✅ Unblock Driver' : '🚫 Block Driver'}
                </button>
                {!u.isVerified && (
                  <button onClick={() => verifyDriver(u._id)}
                    style={{ ...styles.cancelBtn, background: '#3b82f6', marginLeft: '8px' }}>
                    ✅ Verify Driver
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'Inter, sans-serif' },
  loginWrapper: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  loginBrand: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' },
  loginLogo: { fontSize: '32px' },
  loginTitle: { fontSize: '24px', fontWeight: '800', letterSpacing: '4px', color: '#e63946' },
  loginCard: { background: '#111', border: '1px solid #1a1a1a', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px' },
  loginHeading: { fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' },
  loginSubtitle: { color: '#666', marginBottom: '28px', fontSize: '15px' },
  errorBox: { background: '#2a0000', border: '1px solid #e63946', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#999', fontSize: '12px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { width: '100%', padding: '14px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: 'white', fontSize: '15px', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '14px', background: '#e63946', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  btnLoading: { width: '100%', padding: '14px', background: '#7a1a1a', color: '#999', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'not-allowed', marginTop: '8px' },
  backBtn: { width: '100%', padding: '12px', background: 'transparent', color: '#666', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '12px' },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: window.innerWidth <= 768 ? '12px 16px' : '16px 32px',
    background: '#111',
    borderBottom: '1px solid #1a1a1a',
    flexWrap: 'wrap',
    gap: '8px'
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: { fontSize: '24px' },
  navTitle: { fontSize: '16px', fontWeight: '800', letterSpacing: '3px', color: '#e63946' },
  navRight: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  refreshBtn: { background: '#1a1a1a', color: '#999', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  navBtnRed: { background: 'transparent', color: '#e63946', border: '1px solid #e63946', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  content: {
    maxWidth: '960px',
    margin: '24px auto',
    padding: '0 16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '28px'
  },
  statCard: { background: '#111', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center' },
  statLabel: { color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' },
  statValue: { fontSize: '32px', fontWeight: '800', color: 'white', margin: 0 },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  tabActive: { padding: '10px 24px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  tabInactive: { padding: '10px 24px', background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' },
  tabTitle: { color: '#666', fontSize: '14px', marginBottom: '16px' },
  card: {
    background: '#111',
    border: '1px solid #1a1a1a',
    padding: window.innerWidth <= 768 ? '16px' : '20px',
    borderRadius: '14px',
    marginBottom: '12px'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  dateText: { color: '#666', fontSize: '12px' },
  rideDetails: { marginBottom: '8px' },
  detailRow: { color: '#999', fontSize: '14px', margin: '4px 0' },
  cancelBtn: { padding: '8px 16px', background: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px', fontSize: '14px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  userAvatar: { fontSize: '28px' },
  userName: { fontWeight: '600', margin: '0 0 2px 0', fontSize: '15px' },
  userEmail: { color: '#666', fontSize: '13px', margin: 0 },
  statusPill: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
};

export default AdminDashboard;