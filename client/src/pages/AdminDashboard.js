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
      await axios.put(`${API}/api/auth/admin/verify/${userId}`, {}, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
      fetchData(tokenRef.current);
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
        <style>{`
          @keyframes slideUpIn {
            0% { opacity: 0; transform: translateY(18px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes floatLogo {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .admin-input:focus {
            border-color: #e63946 !important;
            box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.25), 0 0 16px rgba(230, 57, 70, 0.35) !important;
            background: #202020 !important;
            outline: none !important;
          }
          .admin-btn:hover:not(:disabled) {
            box-shadow: 0 8px 24px rgba(230, 57, 70, 0.6) !important;
            filter: brightness(1.08);
          }
          .admin-btn:active:not(:disabled) {
            transform: scale(0.98);
          }
        `}</style>

        <div style={styles.loginWrapper}>
          <div style={styles.loginBrand}>
            <div style={styles.loginLogoBox}>
              <span style={styles.loginLogo}>🚖</span>
            </div>
            <div>
              <span style={styles.loginTitle}>TRAVERSE</span>
              <span style={styles.loginSubBrand}>ADMIN CONTROL CENTER</span>
            </div>
          </div>

          <div style={styles.loginCard}>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={styles.shieldIconBox}>
                <span>🛡️</span>
              </div>
              <h2 style={styles.loginHeading}>Admin Portal</h2>
              <p style={styles.loginSubtitle}>Authorized dispatch and platform management</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Admin Email</label>
                <input
                  className="admin-input"
                  style={styles.input}
                  type='email'
                  placeholder='admin@traverse.com'
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Secret Password</label>
                <input
                  className="admin-input"
                  style={styles.input}
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                />
              </div>

              <button
                className="admin-btn"
                style={loading ? styles.btnLoading : styles.btn}
                type='submit'
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Console →'}
              </button>
            </form>

            <button onClick={() => navigate('/login')} style={styles.backBtn}>
              ← Return to Client App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideUpIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .admin-card-hover {
          animation: slideUpIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .admin-card-hover:hover {
          border-color: rgba(230, 57, 70, 0.35) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(230, 57, 70, 0.1) !important;
        }
        .nav-btn-hover:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border-color: #444 !important;
        }
        .action-btn-hover:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .action-btn-hover:active {
          transform: scale(0.97);
        }
        @media (max-width: 480px) {
          .stats-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .nav-title-desktop {
            display: none !important;
          }
          .nav-title-mobile {
            display: inline !important;
          }
          .nav-btn-text-mobile {
            display: none !important;
          }
          .nav-btn-mobile {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
          .filter-pill-mobile {
            padding: 8px 12px !important;
            font-size: 12px !important;
          }
        }
        @media (min-width: 481px) {
          .nav-title-desktop {
            display: inline !important;
          }
          .nav-title-mobile {
            display: none !important;
          }
          .nav-btn-text-mobile {
            display: inline !important;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navLogoBox}>
            <span style={styles.navLogo}>🚖</span>
          </div>
          <div>
            <span className="nav-title-desktop" style={styles.navTitle}>TRAVERSE ADMIN</span>
            <span className="nav-title-mobile" style={styles.navTitle}>ADMIN</span>
          </div>
        </div>

        <div style={styles.navRight}>
          <button
            onClick={() => fetchData(tokenRef.current)}
            className="nav-btn-hover nav-btn-mobile"
            style={styles.refreshBtn}
            title="Refresh Database"
          >
            <span>🔄</span>
            <span className="nav-btn-text-mobile"> Sync</span>
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="nav-btn-mobile"
            style={styles.navBtnRed}
            title="Exit Session"
          >
            <span>🚪</span>
            <span className="nav-btn-text-mobile"> Logout</span>
          </button>
        </div>
      </nav>

      <main style={styles.content}>
        {/* Top Control Banner */}
        <div style={styles.headerSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={styles.badgePulseDot} />
            <span style={styles.headerTag}>SYSTEM DISPATCH & GOVERNANCE</span>
          </div>
          <h2 style={styles.pageTitle}>Platform Overview</h2>
          <p style={styles.pageSubtitle}>Live telemetry, ride audits, student directory, and driver verification</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-mobile" style={styles.statsGrid}>
          <div className="admin-card-hover" style={styles.statCard}>
            <div style={styles.statIconBox}><span>🎓</span></div>
            <p style={styles.statValue}>{students.length}</p>
            <p style={styles.statLabel}>Students</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #e63946' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(230, 57, 70, 0.12)', color: '#e63946' }}><span>🚗</span></div>
            <p style={{ ...styles.statValue, color: '#e63946' }}>{drivers.length}</p>
            <p style={styles.statLabel}>Drivers</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #f59e0b' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}><span>⚡</span></div>
            <p style={{ ...styles.statValue, color: '#f59e0b' }}>{activeRides.length}</p>
            <p style={styles.statLabel}>Active Rides</p>
          </div>

          <div className="admin-card-hover" style={styles.statCard}>
            <div style={styles.statIconBox}><span>🗺️</span></div>
            <p style={styles.statValue}>{rides.length}</p>
            <p style={styles.statLabel}>Total Trips</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #10b981' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}><span>✅</span></div>
            <p style={{ ...styles.statValue, color: '#10b981' }}>{completedRides.length}</p>
            <p style={styles.statLabel}>Completed</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #e63946' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(230, 57, 70, 0.12)', color: '#e63946' }}><span>💰</span></div>
            <p style={{ ...styles.statValue, color: '#ffffff' }}>₹{totalRevenue}</p>
            <p style={styles.statLabel}>Gross Volume</p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div style={styles.tabsContainer}>
          {['rides', 'students', 'faculty', 'drivers'].map(t => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="filter-pill-mobile"
                style={isActive ? styles.tabActive : styles.tabInactive}
              >
                <span>{t === 'rides' ? '🚖' : t === 'students' ? '🎓' : t === 'faculty' ? '👨‍🏫' : '🚗'}</span>
                <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                <span style={isActive ? styles.tabBadgeActive : styles.tabBadgeInactive}>
                  {t === 'rides' ? rides.length : t === 'students' ? students.length : t === 'faculty' ? faculty.length : drivers.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIDES TAB */}
        {tab === 'rides' && (
          <div>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Ride Logs & Live Dispatches</h3>
              <span style={styles.sectionCountTag}>{rides.length} Total</span>
            </div>

            {rides.length === 0 && (
              <div className="admin-card-hover" style={styles.empty}>
                <div style={styles.emptyIconBox}><span>🚖</span></div>
                <h4 style={styles.emptyTitle}>No Rides in System</h4>
                <p style={styles.emptySubtitle}>Dispatched rides will appear here in real time.</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {rides.map(ride => (
                <div key={ride._id} className="admin-card-hover" style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        ...styles.statusBadge,
                        background: `${statusColor[ride.status] || '#666'}1f`,
                        color: statusColor[ride.status] || '#999',
                        border: `1px solid ${statusColor[ride.status] || '#666'}55`
                      }}>
                        {ride.status.toUpperCase()}
                      </span>
                      {ride.rideType === 'shared' && (
                        <span style={styles.sharedBadge}>👥 Shared</span>
                      )}
                    </div>
                    <span style={styles.dateText}>
                      {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Route Box */}
                  <div style={styles.routeContainer}>
                    <div style={styles.routeTimeline}>
                      <div style={styles.routeDotPickup} />
                      <div style={styles.routeVerticalLine} />
                      <div style={styles.routeDotDropoff} />
                    </div>
                    <div style={styles.routeDetails}>
                      <div style={styles.routeStop}>
                        <span style={styles.routeTagPickup}>PICKUP</span>
                        <p style={styles.routeAddress}>{ride.pickup}</p>
                      </div>
                      <div style={styles.routeStop}>
                        <span style={styles.routeTagDropoff}>DROPOFF</span>
                        <p style={styles.routeAddress}>{ride.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  {/* Entities */}
                  <div style={styles.rideDetailsGrid}>
                    <div style={styles.entityItem}>
                      <span style={{ color: '#777', fontSize: '11px' }}>Rider:</span>
                      <p style={styles.entityName}>👤 {ride.student?.name || 'N/A'}</p>
                      <p style={styles.entitySub}>{ride.student?.email || 'No email'}</p>
                    </div>
                    <div style={styles.entityItem}>
                      <span style={{ color: '#777', fontSize: '11px' }}>Driver:</span>
                      <p style={styles.entityName}>🚗 {ride.driver?.name || 'Unassigned'}</p>
                      <p style={styles.entitySub}>{ride.driver?.vehicleNumber || 'No plate'}</p>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {ride.fare > 0 && (
                        <span style={styles.fareTag}>₹{ride.fare}</span>
                      )}
                      {ride.rating && (
                        <span style={styles.ratingTag}>⭐ {ride.rating}/5</span>
                      )}
                    </div>

                    {(ride.status === 'searching' || ride.status === 'accepted' || ride.status === 'ontheway') && (
                      <button
                        onClick={() => cancelRide(ride._id)}
                        className="action-btn-hover"
                        style={styles.cancelBtn}
                      >
                        ✕ Cancel Ride
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === 'students' && (
          <div>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Enrolled Student Directory</h3>
              <span style={styles.sectionCountTag}>{students.length} Students</span>
            </div>

            {students.length === 0 && (
              <div className="admin-card-hover" style={styles.empty}>
                <div style={styles.emptyIconBox}><span>🎓</span></div>
                <h4 style={styles.emptyTitle}>No Students Found</h4>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {students.map(u => (
                <div
                  key={u._id}
                  className="admin-card-hover"
                  style={{
                    ...styles.card,
                    border: u.isBlocked ? '1px solid rgba(230, 57, 70, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.userInfo}>
                      <div style={styles.userAvatar}>🎓</div>
                      <div>
                        <p style={styles.userName}>{u.name}</p>
                        <p style={styles.userEmail}>{u.email}</p>
                      </div>
                    </div>
                    <span style={{
                      ...styles.statusPill,
                      background: u.isBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: u.isBlocked ? '#ef4444' : '#10b981',
                      border: `1px solid ${u.isBlocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                    }}>
                      {u.isBlocked ? '🚫 BLOCKED' : '✅ ACTIVE'}
                    </span>
                  </div>

                  <div style={styles.userMetaGrid}>
                    <p style={styles.detailRow}>🆔 Student ID: <b>{u.studentId || 'N/A'}</b></p>
                    <p style={styles.detailRow}>📞 Phone: <b>{u.phone || 'N/A'}</b></p>
                    <p style={styles.detailRow}>
                      ❌ Cancellations: <b style={{ color: u.cancelCount >= 3 ? '#e63946' : '#ffffff' }}>{u.cancelCount || 0}</b> / 5
                    </p>
                  </div>

                  {u.cancelCount >= 3 && !u.isBlocked && (
                    <div style={styles.warningBox}>
                      ⚠️ At risk — {5 - u.cancelCount} cancellations remaining before auto-restriction
                    </div>
                  )}

                  {u.isBlocked && (
                    <div style={styles.blockedBox}>
                      🚫 Account Restricted — Subject must appeal to administrator
                    </div>
                  )}

                  <div style={{ marginTop: '12px' }}>
                    <button
                      onClick={() => blockUser(u._id)}
                      className="action-btn-hover"
                      style={{
                        ...styles.blockBtn,
                        background: u.isBlocked
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)'
                      }}
                    >
                      {u.isBlocked ? '✅ Unblock Student' : '🚫 Restrict / Block Student'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FACULTY TAB */}
        {tab === 'faculty' && (
          <div>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Faculty & Staff Directory</h3>
              <span style={styles.sectionCountTag}>{faculty.length} Faculty</span>
            </div>

            {faculty.length === 0 && (
              <div className="admin-card-hover" style={styles.empty}>
                <div style={styles.emptyIconBox}><span>👨‍🏫</span></div>
                <h4 style={styles.emptyTitle}>No Faculty Registered</h4>
                <p style={styles.emptySubtitle}>Registered faculty accounts will appear here.</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faculty.map(u => (
                <div
                  key={u._id}
                  className="admin-card-hover"
                  style={{
                    ...styles.card,
                    border: u.isBlocked ? '1px solid rgba(230, 57, 70, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.userInfo}>
                      <div style={styles.userAvatar}>👨‍🏫</div>
                      <div>
                        <p style={styles.userName}>{u.name}</p>
                        <p style={styles.userEmail}>{u.email}</p>
                      </div>
                    </div>
                    <span style={{
                      ...styles.statusPill,
                      background: u.isBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: u.isBlocked ? '#ef4444' : '#10b981',
                      border: `1px solid ${u.isBlocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                    }}>
                      {u.isBlocked ? '🚫 BLOCKED' : '✅ ACTIVE'}
                    </span>
                  </div>

                  <div style={styles.userMetaGrid}>
                    <p style={styles.detailRow}>📞 Phone: <b>{u.phone || 'N/A'}</b></p>
                    <p style={styles.detailRow}>
                      ❌ Cancellations: <b style={{ color: u.cancelCount >= 3 ? '#e63946' : '#ffffff' }}>{u.cancelCount || 0}</b> / 5
                    </p>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <button
                      onClick={() => blockUser(u._id)}
                      className="action-btn-hover"
                      style={{
                        ...styles.blockBtn,
                        background: u.isBlocked
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)'
                      }}
                    >
                      {u.isBlocked ? '✅ Unblock Faculty' : '🚫 Block Faculty'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DRIVERS TAB */}
        {tab === 'drivers' && (
          <div>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Fleet & Driver Verification</h3>
              <span style={styles.sectionCountTag}>{drivers.length} Drivers</span>
            </div>

            {drivers.length === 0 && (
              <div className="admin-card-hover" style={styles.empty}>
                <div style={styles.emptyIconBox}><span>🚗</span></div>
                <h4 style={styles.emptyTitle}>No Drivers Registered</h4>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {drivers.map(u => (
                <div
                  key={u._id}
                  className="admin-card-hover"
                  style={{
                    ...styles.card,
                    border: u.isBlocked ? '1px solid rgba(230, 57, 70, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.userInfo}>
                      <div style={styles.userAvatar}>🚗</div>
                      <div>
                        <p style={styles.userName}>{u.name}</p>
                        <p style={styles.userEmail}>{u.email}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {!u.isVerified && (
                        <span style={styles.pendingBadge}>
                          ⏳ PENDING
                        </span>
                      )}
                      <span style={{
                        ...styles.statusPill,
                        background: u.isBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: u.isBlocked ? '#ef4444' : '#10b981',
                        border: `1px solid ${u.isBlocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                      }}>
                        {u.isBlocked ? '🚫 BLOCKED' : '✅ ACTIVE'}
                      </span>
                    </div>
                  </div>

                  <div style={styles.userMetaGrid}>
                    <p style={styles.detailRow}>🚘 Vehicle: <b>{u.vehicleNumber || 'N/A'} {u.carName && `• ${u.carName} ${u.carModel}`}</b></p>
                    <p style={styles.detailRow}>🚙 Class: <b>{u.vehicleType || 'Standard'}</b></p>
                    <p style={styles.detailRow}>📞 Phone: <b>{u.phone || 'N/A'}</b></p>
                    <p style={styles.detailRow}>
                      🟢 Live Status: <b style={{ color: u.isAvailable ? '#10b981' : '#777' }}>{u.isAvailable ? 'Online (Dispatched)' : 'Offline'}</b>
                    </p>
                    <p style={styles.detailRow}>
                      ❌ Cancellations: <b style={{ color: u.cancelCount >= 3 ? '#e63946' : '#ffffff' }}>{u.cancelCount || 0}</b> / 5
                    </p>
                  </div>

                  {u.cancelCount >= 3 && !u.isBlocked && (
                    <div style={styles.warningBox}>
                      ⚠️ At risk — {5 - u.cancelCount} cancellations remaining
                    </div>
                  )}

                  {u.isBlocked && (
                    <div style={styles.blockedBox}>
                      🚫 Driver Suspended — Contact dispatch support
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => blockUser(u._id)}
                      className="action-btn-hover"
                      style={{
                        ...styles.blockBtn,
                        flex: 1,
                        background: u.isBlocked
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)'
                      }}
                    >
                      {u.isBlocked ? '✅ Unblock Driver' : '🚫 Restrict / Block'}
                    </button>

                    {!u.isVerified && (
                      <button
                        onClick={() => verifyDriver(u._id)}
                        className="action-btn-hover"
                        style={styles.verifyBtn}
                      >
                        ✅ Verify & Authorize
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundImage: 'radial-gradient(circle at 50% 0%, #20080a 0%, #0a0a0a 65%)',
    backgroundAttachment: 'fixed',
    paddingBottom: '40px'
  },
  loginWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  loginBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px'
  },
  loginLogoBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1f1f1f 0%, #2a1114 100%)',
    border: '1px solid rgba(230, 57, 70, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px rgba(230, 57, 70, 0.4)'
  },
  loginLogo: { fontSize: '24px' },
  loginTitle: {
    fontSize: '22px',
    fontWeight: '900',
    letterSpacing: '3px',
    color: '#e63946',
    display: 'block',
    lineHeight: '1.1'
  },
  loginSubBrand: {
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '1.5px',
    color: '#888888',
    display: 'block'
  },
  shieldIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(230, 57, 70, 0.1)',
    border: '1px solid rgba(230, 57, 70, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginBottom: '10px'
  },
  loginCard: {
    background: 'linear-gradient(145deg, #161616 0%, #111111 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '32px 28px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.8), 0 0 24px rgba(230, 57, 70, 0.1)',
    animation: 'slideUpIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  },
  loginHeading: {
    fontSize: '22px',
    fontWeight: '800',
    margin: '0 0 4px 0',
    color: '#ffffff'
  },
  loginSubtitle: {
    color: '#777777',
    marginBottom: '20px',
    fontSize: '13px',
    margin: 0
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#ff6b6b',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    color: '#888888',
    fontSize: '11px',
    fontWeight: '700',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: '6px',
    boxShadow: '0 4px 16px rgba(230, 57, 70, 0.45)',
    transition: 'all 0.2s ease'
  },
  btnLoading: {
    width: '100%',
    padding: '13px',
    background: '#4a151b',
    color: '#999999',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'not-allowed',
    marginTop: '6px'
  },
  backBtn: {
    width: '100%',
    padding: '11px',
    background: 'transparent',
    color: '#777777',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'all 0.2s ease'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 18px',
    background: 'rgba(17, 17, 17, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  navLogoBox: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    background: 'linear-gradient(135deg, #1c1c1c 0%, #2a1114 100%)',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(230, 57, 70, 0.3)'
  },
  navLogo: { fontSize: '18px' },
  navTitle: {
    fontSize: '16px',
    fontWeight: '900',
    letterSpacing: '2px',
    color: '#e63946',
    textShadow: '0 0 14px rgba(230, 57, 70, 0.4)'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  refreshBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#a0a0a0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '7px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease'
  },
  navBtnRed: {
    background: 'rgba(230, 57, 70, 0.12)',
    color: '#e63946',
    border: '1px solid rgba(230, 57, 70, 0.35)',
    padding: '7px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease'
  },
  content: {
    maxWidth: '840px',
    margin: '20px auto 0',
    padding: '0 14px'
  },
  headerSection: {
    marginBottom: '20px'
  },
  badgePulseDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#e63946',
    boxShadow: '0 0 8px #e63946'
  },
  headerTag: {
    color: '#e63946',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '1.2px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '900',
    margin: '4px 0 2px 0',
    color: '#ffffff',
    letterSpacing: '-0.5px'
  },
  pageSubtitle: {
    color: '#777777',
    fontSize: '13px',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '22px'
  },
  statCard: {
    background: 'linear-gradient(145deg, #161616 0%, #111111 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '14px 10px',
    borderRadius: '14px',
    textAlign: 'center',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIconBox: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    marginBottom: '6px'
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 2px 0',
    lineHeight: '1.1'
  },
  statLabel: {
    color: '#777777',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: '700',
    margin: 0
  },
  tabsContainer: {
    display: 'flex',
    gap: '6px',
    marginBottom: '20px',
    background: '#121212',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    overflowX: 'auto'
  },
  tabActive: {
    flex: 1,
    padding: '9px 12px',
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 10px rgba(230, 57, 70, 0.4)',
    transition: 'all 0.2s ease'
  },
  tabInactive: {
    flex: 1,
    padding: '9px 12px',
    background: 'transparent',
    color: '#777777',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },
  tabBadgeActive: {
    background: '#ffffff',
    color: '#c1121f',
    borderRadius: '10px',
    padding: '1px 6px',
    fontSize: '10px',
    fontWeight: '800'
  },
  tabBadgeInactive: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#888888',
    borderRadius: '10px',
    padding: '1px 6px',
    fontSize: '10px',
    fontWeight: '700'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '800',
    margin: 0,
    color: '#ffffff'
  },
  sectionCountTag: {
    fontSize: '11px',
    color: '#888888',
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '3px 8px',
    borderRadius: '6px',
    fontWeight: '600'
  },
  card: {
    background: 'linear-gradient(145deg, #161616 0%, #111111 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '16px',
    borderRadius: '16px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
    position: 'relative'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  statusBadge: {
    padding: '4px 9px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.3px'
  },
  sharedBadge: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700'
  },
  dateText: {
    color: '#777777',
    fontSize: '12px',
    fontWeight: '500'
  },
  routeContainer: {
    display: 'flex',
    gap: '12px',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '12px 14px',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  routeTimeline: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4px',
    paddingBottom: '4px'
  },
  routeDotPickup: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)'
  },
  routeVerticalLine: {
    width: '2px',
    flex: 1,
    minHeight: '20px',
    background: 'linear-gradient(to bottom, #10b981 0%, #e63946 100%)',
    margin: '3px 0'
  },
  routeDotDropoff: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    background: '#e63946',
    boxShadow: '0 0 6px rgba(230, 57, 70, 0.6)'
  },
  routeDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '8px'
  },
  routeStop: {
    display: 'flex',
    flexDirection: 'column'
  },
  routeTagPickup: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: '0.8px'
  },
  routeTagDropoff: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#e63946',
    letterSpacing: '0.8px'
  },
  routeAddress: {
    color: '#f0f0f0',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0
  },
  rideDetailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '10px 12px',
    borderRadius: '10px',
    marginBottom: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)'
  },
  entityItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  entityName: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '2px 0 0 0'
  },
  entitySub: {
    fontSize: '11px',
    color: '#777777',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
  },
  fareTag: {
    background: 'rgba(230, 57, 70, 0.12)',
    color: '#e63946',
    border: '1px solid rgba(230, 57, 70, 0.3)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '800'
  },
  ratingTag: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700'
  },
  cancelBtn: {
    padding: '7px 14px',
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.2s ease'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  userName: {
    fontWeight: '700',
    margin: '0 0 2px 0',
    fontSize: '14px',
    color: '#ffffff'
  },
  userEmail: {
    color: '#777777',
    fontSize: '12px',
    margin: 0
  },
  statusPill: {
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.4px'
  },
  pendingBadge: {
    background: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    padding: '4px 9px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.4px'
  },
  userMetaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '6px',
    background: 'rgba(0, 0, 0, 0.35)',
    padding: '10px 12px',
    borderRadius: '10px',
    marginBottom: '10px',
    border: '1px solid rgba(255, 255, 255, 0.04)'
  },
  detailRow: {
    color: '#aaaaaa',
    fontSize: '12px',
    margin: '2px 0'
  },
  warningBox: {
    background: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    color: '#f59e0b',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    marginBottom: '8px'
  },
  blockedBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ff6b6b',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    marginBottom: '8px'
  },
  blockBtn: {
    width: '100%',
    padding: '10px 14px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.2px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
  },
  verifyBtn: {
    flex: 1,
    padding: '10px 14px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '800',
    boxShadow: '0 3px 10px rgba(59, 130, 246, 0.4)'
  },
  empty: {
    background: 'linear-gradient(145deg, #141414 0%, #0f0f0f 100%)',
    border: '1px dashed rgba(255, 255, 255, 0.12)',
    padding: '40px 20px',
    borderRadius: '18px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  emptyIconBox: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: 'rgba(230, 57, 70, 0.08)',
    border: '1px solid rgba(230, 57, 70, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '12px'
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#ffffff'
  },
  emptySubtitle: {
    color: '#777777',
    fontSize: '12px',
    margin: 0
  }
};

export default AdminDashboard;