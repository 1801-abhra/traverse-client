import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://traverse-unicab-backend-2df13b58c562.herokuapp.com';

function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Platform Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalDrivers: 0,
    pendingDrivers: 0,
    blockedUsers: 0,
    totalRides: 0,
    activeRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    totalRevenue: 0
  });

  // Tab & Filter State
  const [tab, setTab] = useState('rides'); // 'rides' | 'students' | 'faculty' | 'drivers'
  const [subFilter, setSubFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Paginated Data
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(15);
  
  const [dataLoading, setDataLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const navigate = useNavigate();
  const tokenRef = useRef('');

  // Handle Debounce for Search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch System Stats
  const fetchStats = useCallback(async (t) => {
    const authToken = t || tokenRef.current;
    if (!authToken) return;
    setStatsLoading(true);
    try {
      const res = await axios.get(`${API}/api/auth/admin/stats`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setStats(res.data);
    } catch (err) {
      console.log('Stats fetch error:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Paginated Tab Data
  const fetchTabData = useCallback(async (t, tabName, searchStr, pageNum, limitNum, filterVal) => {
    const authToken = t || tokenRef.current;
    if (!authToken) return;
    setDataLoading(true);
    try {
      if (tabName === 'rides') {
        const res = await axios.get(
          `${API}/api/rides/admin/rides?search=${encodeURIComponent(searchStr)}&page=${pageNum}&limit=${limitNum}&status=${filterVal}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setItems(res.data.rides || []);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
        setCurrentPage(res.data.page || pageNum);
      } else {
        const roleMap = { students: 'student', faculty: 'faculty', drivers: 'driver' };
        const role = roleMap[tabName] || 'student';
        const res = await axios.get(
          `${API}/api/auth/admin/users?role=${role}&search=${encodeURIComponent(searchStr)}&page=${pageNum}&limit=${limitNum}&statusFilter=${filterVal}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setItems(res.data.users || []);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
        setCurrentPage(res.data.page || pageNum);
      }
    } catch (err) {
      console.log('Tab data fetch error:', err.message);
      setItems([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Trigger data fetch whenever tab, debouncedSearch, currentPage, limit, or subFilter changes
  useEffect(() => {
    if (isLoggedIn && tokenRef.current) {
      fetchTabData(tokenRef.current, tab, debouncedSearch, currentPage, limit, subFilter);
    }
  }, [isLoggedIn, tab, debouncedSearch, currentPage, limit, subFilter, fetchTabData]);

  // Tab Switcher Handler
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSubFilter('all');
    setCurrentPage(1);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/admin/login`, { email, password });
      setToken(res.data.token);
      tokenRef.current = res.data.token;
      setIsLoggedIn(true);
      fetchStats(res.data.token);
      fetchTabData(res.data.token, tab, '', 1, limit, 'all');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  // Cancel ride
  const cancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to administratively cancel this ride?')) return;
    setActionLoadingId(rideId);
    try {
      await axios.put(`${API}/api/rides/admin/cancel/${rideId}`, {}, {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      });
      fetchTabData(tokenRef.current, tab, debouncedSearch, currentPage, limit, subFilter);
      fetchStats(tokenRef.current);
    } catch (err) {
      console.log('Cancel error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Block/Unblock user
  const blockUser = async (userId) => {
    setActionLoadingId(userId);
    try {
      await axios.put(`${API}/api/auth/admin/block/${userId}`, {}, {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      });
      fetchTabData(tokenRef.current, tab, debouncedSearch, currentPage, limit, subFilter);
      fetchStats(tokenRef.current);
    } catch (err) {
      console.log('Block error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle Driver Online / Offline Status (Admin)
  const toggleDriverAvailability = async (userId) => {
    setActionLoadingId(userId);
    try {
      await axios.put(`${API}/api/auth/admin/toggle-availability/${userId}`, {}, {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      });
      fetchTabData(tokenRef.current, tab, debouncedSearch, currentPage, limit, subFilter);
      fetchStats(tokenRef.current);
    } catch (err) {
      console.log('Toggle availability error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Verify driver
  const verifyDriver = async (userId) => {
    setActionLoadingId(userId);
    try {
      await axios.put(`${API}/api/auth/admin/verify/${userId}`, {}, {
        headers: { Authorization: `Bearer ${tokenRef.current}` }
      });
      fetchTabData(tokenRef.current, tab, debouncedSearch, currentPage, limit, subFilter);
      fetchStats(tokenRef.current);
    } catch (err) {
      console.log('Verify error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Full manual refresh
  const handleFullRefresh = () => {
    fetchStats(tokenRef.current);
    fetchTabData(tokenRef.current, tab, debouncedSearch, currentPage, limit, subFilter);
  };

  const statusColor = {
    searching: '#f59e0b',
    accepted: '#e63946',
    ontheway: '#e63946',
    completed: '#10b981',
    cancelled: '#666666'
  };

  // Dynamic search placeholder
  const getSearchPlaceholder = () => {
    switch (tab) {
      case 'rides':
        return '🔍 Search rides by student, driver, plate, pickup, dropoff...';
      case 'students':
        return '🔍 Search students by name, university email, roll no, phone...';
      case 'faculty':
        return '🔍 Search faculty by name, university email, phone...';
      case 'drivers':
        return '🔍 Search drivers by name, phone, vehicle number, car model...';
      default:
        return '🔍 Search by name, email, phone...';
    }
  };

  // Helper for pagination page range
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift('...');
    if (currentPage + delta < totalPages - 1) range.push('...');
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  // Render Login Form if not logged in
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
              <span style={styles.loginSubBrand}>CENTRAL DISPATCH & ADMIN CONSOLE</span>
            </div>
          </div>

          <div style={styles.loginCard}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={styles.shieldIconBox}>
                <span>🛡️</span>
              </div>
              <h3 style={styles.loginHeading}>Governance Access</h3>
              <p style={styles.loginSubtitle}>Sign in with authorized administrator credentials</p>
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@traverse.com"
                  required
                  className="admin-input"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Access Key / Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="admin-input"
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="admin-btn"
                style={loginLoading ? styles.btnLoading : styles.btn}
              >
                {loginLoading ? 'Authenticating...' : 'Authorize Session →'}
              </button>
            </form>

            <button
              onClick={() => navigate('/login')}
              style={styles.backBtn}
            >
              ← Return to Public Terminal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Admin Panel
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .admin-card-hover {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .admin-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 20px rgba(230, 57, 70, 0.15) !important;
          border-color: rgba(230, 57, 70, 0.35) !important;
        }
        .filter-pill:hover {
          filter: brightness(1.15);
        }
        .nav-btn-hover:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }
        .action-btn-hover:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .action-btn-hover:active:not(:disabled) {
          transform: scale(0.98);
        }
        .search-input:focus {
          border-color: #e63946 !important;
          box-shadow: 0 0 0 2px rgba(230, 57, 70, 0.25), 0 0 16px rgba(230, 57, 70, 0.2) !important;
        }
        .page-btn:hover:not(:disabled) {
          background: #e63946 !important;
          color: #ffffff !important;
          border-color: #e63946 !important;
        }
        @media (max-width: 480px) {
          .nav-title-desktop { display: none !important; }
          .nav-title-mobile { display: inline !important; }
          .nav-btn-text-mobile { display: none !important; }
          .stats-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .filter-pill-mobile {
            font-size: 11px !important;
            padding: 7px 10px !important;
          }
        }
        @media (min-width: 481px) {
          .nav-title-desktop { display: inline !important; }
          .nav-title-mobile { display: none !important; }
          .nav-btn-text-mobile { display: inline !important; }
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
            onClick={handleFullRefresh}
            className="nav-btn-hover nav-btn-mobile"
            style={styles.refreshBtn}
            title="Sync Platform Telemetry"
          >
            <span style={{ display: 'inline-block', animation: (statsLoading || dataLoading) ? 'spin 1s linear infinite' : 'none' }}>🔄</span>
            <span className="nav-btn-text-mobile"> Sync</span>
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setToken('');
              tokenRef.current = '';
            }}
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
          <h2 style={styles.pageTitle}>Platform Control Center</h2>
          <p style={styles.pageSubtitle}>Real-time dispatch telemetry, 2,000+ student directory, and driver verification fleet</p>
        </div>

        {/* Aggregate Stats Grid */}
        <div className="stats-grid-mobile" style={styles.statsGrid}>
          <div className="admin-card-hover" style={styles.statCard}>
            <div style={styles.statIconBox}><span>🎓</span></div>
            <p style={styles.statValue}>{(stats.totalStudents || 0).toLocaleString('en-IN')}</p>
            <p style={styles.statLabel}>Students</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #e63946' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(230, 57, 70, 0.12)', color: '#e63946' }}><span>🚗</span></div>
            <p style={{ ...styles.statValue, color: '#e63946' }}>
              {(stats.totalDrivers || 0).toLocaleString('en-IN')}
              {stats.pendingDrivers > 0 && (
                <span style={{ fontSize: '11px', color: '#f59e0b', marginLeft: '4px', fontWeight: '800' }}>
                  ({stats.pendingDrivers} ⏳)
                </span>
              )}
            </p>
            <p style={styles.statLabel}>Drivers</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #f59e0b' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}><span>⚡</span></div>
            <p style={{ ...styles.statValue, color: '#f59e0b' }}>{(stats.activeRides || 0).toLocaleString('en-IN')}</p>
            <p style={styles.statLabel}>Active Rides</p>
          </div>

          <div className="admin-card-hover" style={styles.statCard}>
            <div style={styles.statIconBox}><span>🗺️</span></div>
            <p style={styles.statValue}>{(stats.totalRides || 0).toLocaleString('en-IN')}</p>
            <p style={styles.statLabel}>Total Trips</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #10b981' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}><span>✅</span></div>
            <p style={{ ...styles.statValue, color: '#10b981' }}>{(stats.completedRides || 0).toLocaleString('en-IN')}</p>
            <p style={styles.statLabel}>Completed</p>
          </div>

          <div className="admin-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #e63946' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(230, 57, 70, 0.12)', color: '#e63946' }}><span>💰</span></div>
            <p style={{ ...styles.statValue, color: '#ffffff' }}>₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</p>
            <p style={styles.statLabel}>Gross Volume</p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div style={styles.tabsContainer}>
          {[
            { id: 'rides', label: 'Rides', icon: '🚖', count: stats.totalRides },
            { id: 'students', label: 'Students', icon: '🎓', count: stats.totalStudents },
            { id: 'faculty', label: 'Faculty', icon: '👨‍🏫', count: stats.totalFaculty },
            { id: 'drivers', label: 'Drivers', icon: '🚗', count: stats.totalDrivers, alert: stats.pendingDrivers }
          ].map(t => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className="filter-pill-mobile"
                style={isActive ? styles.tabActive : styles.tabInactive}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                <span style={isActive ? styles.tabBadgeActive : styles.tabBadgeInactive}>
                  {t.count || 0}
                  {t.alert > 0 && <span style={{ color: '#e63946', marginLeft: '3px' }}>⚠️</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Sub-Filters Header */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                className="search-input"
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 16px',
                  background: '#161616',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                placeholder={getSearchPlaceholder()}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setDebouncedSearch(search);
                    setCurrentPage(1);
                  }
                }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setDebouncedSearch('');
                    setCurrentPage(1);
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#aaaaaa',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px'
                  }}
                  title="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setDebouncedSearch(search);
                setCurrentPage(1);
              }}
              style={{
                padding: '12px 18px',
                background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(230, 57, 70, 0.35)'
              }}
            >
              <span>Search</span>
            </button>
          </div>

          {/* Sub-filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
            {tab === 'rides' && [
              { id: 'all', label: 'All Logs' },
              { id: 'active', label: `⚡ Live / Active (${stats.activeRides || 0})` },
              { id: 'completed', label: `✅ Completed (${stats.completedRides || 0})` },
              { id: 'cancelled', label: `✕ Cancelled (${stats.cancelledRides || 0})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setSubFilter(f.id); setCurrentPage(1); }}
                style={subFilter === f.id ? styles.subFilterActive : styles.subFilterInactive}
              >
                {f.label}
              </button>
            ))}

            {tab === 'students' && [
              { id: 'all', label: `All Students (${stats.totalStudents || 0})` },
              { id: 'at_risk', label: '⚠️ At Risk (3+ Cancels)' },
              { id: 'blocked', label: '🚫 Blocked' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setSubFilter(f.id); setCurrentPage(1); }}
                style={subFilter === f.id ? styles.subFilterActive : styles.subFilterInactive}
              >
                {f.label}
              </button>
            ))}

            {tab === 'drivers' && [
              { id: 'all', label: `All Drivers (${stats.totalDrivers || 0})` },
              { id: 'pending', label: `⏳ Pending Verification (${stats.pendingDrivers || 0})` },
              { id: 'active', label: '✅ Verified & Active' },
              { id: 'blocked', label: '🚫 Restricted / Blocked' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setSubFilter(f.id); setCurrentPage(1); }}
                style={subFilter === f.id ? styles.subFilterActive : styles.subFilterInactive}
              >
                {f.label}
              </button>
            ))}

            {tab === 'faculty' && [
              { id: 'all', label: `All Faculty (${stats.totalFaculty || 0})` },
              { id: 'blocked', label: '🚫 Blocked' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setSubFilter(f.id); setCurrentPage(1); }}
                style={subFilter === f.id ? styles.subFilterActive : styles.subFilterInactive}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header with Total Records and Page Size Selector */}
        <div style={styles.sectionHeader}>
          <div>
            <h3 style={styles.sectionTitle}>
              {tab === 'rides' && 'Ride Logs & Dispatches'}
              {tab === 'students' && 'Enrolled Student Directory'}
              {tab === 'faculty' && 'Faculty Members'}
              {tab === 'drivers' && 'Fleet & Driver Verification'}
            </h3>
            <span style={{ fontSize: '12px', color: '#888888' }}>
              Showing {totalCount > 0 ? (currentPage - 1) * limit + 1 : 0}–{Math.min(currentPage * limit, totalCount)} of {totalCount.toLocaleString('en-IN')} total records
              {debouncedSearch && ` (filtered by "${debouncedSearch}")`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#777777', textTransform: 'uppercase', fontWeight: '700' }}>Per page:</span>
            {[15, 30, 50].map(sz => (
              <button
                key={sz}
                onClick={() => { setLimit(sz); setCurrentPage(1); }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: limit === sz ? '1px solid #e63946' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: limit === sz ? 'rgba(230, 57, 70, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: limit === sz ? '#ff4d5a' : '#888888'
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {dataLoading && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#e63946' }}>
            <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid rgba(230,57,70,0.2)', borderTopColor: '#e63946', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '12px', color: '#999999', marginTop: '8px' }}>Querying database...</p>
          </div>
        )}

        {/* Empty State */}
        {!dataLoading && items.length === 0 && (
          <div className="admin-card-hover" style={styles.empty}>
            <div style={styles.emptyIconBox}>
              <span>{tab === 'rides' ? '🚖' : tab === 'students' ? '🎓' : tab === 'faculty' ? '👨‍🏫' : '🚗'}</span>
            </div>
            <h4 style={styles.emptyTitle}>
              {debouncedSearch ? `No results for "${debouncedSearch}"` : 'No Records Found'}
            </h4>
            <p style={styles.emptySubtitle}>
              {debouncedSearch ? 'Try checking your search spelling or clearing filters.' : 'No entries matching the current filter.'}
            </p>
            {debouncedSearch && (
              <button
                onClick={() => { setSearch(''); setDebouncedSearch(''); setCurrentPage(1); }}
                style={{ marginTop: '14px', padding: '8px 16px', background: 'rgba(230, 57, 70, 0.15)', border: '1px solid #e63946', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}

        {/* TAB: RIDES LIST */}
        {!dataLoading && tab === 'rides' && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map(ride => (
              <div key={ride._id} className="admin-card-hover" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      ...styles.statusBadge,
                      background: `${statusColor[ride.status] || '#666666'}1f`,
                      color: statusColor[ride.status] || '#999999',
                      border: `1px solid ${statusColor[ride.status] || '#666666'}55`
                    }}>
                      {ride.status ? ride.status.toUpperCase() : 'UNKNOWN'}
                    </span>
                    {ride.rideType === 'shared' && (
                      <span style={styles.sharedBadge}>👥 Shared</span>
                    )}
                    {ride.scheduledTime && (
                      <span style={{ ...styles.sharedBadge, background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                        📅 Scheduled
                      </span>
                    )}
                  </div>
                  <span style={styles.dateText}>
                    {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    <span style={{ color: '#777777', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Rider:</span>
                    <p style={styles.entityName}>👤 {ride.student?.name || 'N/A'}</p>
                    <p style={styles.entitySub}>{ride.student?.email || 'No email'}</p>
                    {ride.student?.phone && <p style={styles.entitySub}>📞 {ride.student.phone}</p>}
                  </div>
                  <div style={styles.entityItem}>
                    <span style={{ color: '#777777', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Driver:</span>
                    <p style={styles.entityName}>🚗 {ride.driver?.name || 'Unassigned'}</p>
                    <p style={styles.entitySub}>{ride.driver?.vehicleNumber ? `Plate: ${ride.driver.vehicleNumber}` : 'No plate'}</p>
                    {ride.driver?.carName && <p style={styles.entitySub}>{ride.driver.carName} {ride.driver.carModel}</p>}
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
                      disabled={actionLoadingId === ride._id}
                      className="action-btn-hover"
                      style={styles.cancelBtn}
                    >
                      {actionLoadingId === ride._id ? 'Cancelling...' : '✕ Cancel Ride'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: STUDENTS LIST */}
        {!dataLoading && tab === 'students' && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map(u => (
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
                  <p style={styles.detailRow}>
                    📅 Joined: <b>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</b>
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
                    disabled={actionLoadingId === u._id}
                    className="action-btn-hover"
                    style={{
                      ...styles.blockBtn,
                      background: u.isBlocked
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)'
                    }}
                  >
                    {actionLoadingId === u._id ? 'Updating...' : u.isBlocked ? '✅ Unblock Student' : '🚫 Restrict / Block Student'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: FACULTY LIST */}
        {!dataLoading && tab === 'faculty' && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map(u => (
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
                  <p style={styles.detailRow}>
                    📅 Joined: <b>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</b>
                  </p>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <button
                    onClick={() => blockUser(u._id)}
                    disabled={actionLoadingId === u._id}
                    className="action-btn-hover"
                    style={{
                      ...styles.blockBtn,
                      background: u.isBlocked
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)'
                    }}
                  >
                    {actionLoadingId === u._id ? 'Updating...' : u.isBlocked ? '✅ Unblock Faculty' : '🚫 Block Faculty'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: DRIVERS LIST */}
        {!dataLoading && tab === 'drivers' && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map(u => (
              <div
                key={u._id}
                className="admin-card-hover"
                style={{
                  ...styles.card,
                  border: u.isBlocked ? '1px solid rgba(230, 57, 70, 0.6)' : !u.isVerified ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)'
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
                      background: u.isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                      color: u.isAvailable ? '#10b981' : '#9ca3af',
                      border: `1px solid ${u.isAvailable ? 'rgba(16, 185, 129, 0.4)' : 'rgba(107, 114, 128, 0.4)'}`
                    }}>
                      {u.isAvailable ? '🟢 ONLINE' : '⚫ OFFLINE'}
                    </span>
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
                  <p style={styles.detailRow}>🚘 Vehicle: <b>{u.vehicleNumber || 'N/A'} {u.carName && `• ${u.carName} ${u.carModel || ''}`}</b></p>
                  <p style={styles.detailRow}>🚙 Class: <b>{u.vehicleType ? (u.vehicleType.includes('4+1') ? 'Sedan (4+1)' : u.vehicleType.includes('6+1') ? 'SUV (6+1)' : u.vehicleType) : 'Standard'}</b></p>
                  <p style={styles.detailRow}>📞 Phone: <b>{u.phone || 'N/A'}</b></p>
                  <p style={styles.detailRow}>
                    🟢 Live Status: <b style={{ color: u.isAvailable ? '#10b981' : '#777777' }}>{u.isAvailable ? 'Online (Dispatched)' : 'Offline'}</b>
                  </p>
                  <p style={styles.detailRow}>
                    ❌ Cancellations: <b style={{ color: u.cancelCount >= 3 ? '#e63946' : '#ffffff' }}>{u.cancelCount || 0}</b> / 5
                  </p>
                  <p style={styles.detailRow}>
                    📅 Joined: <b>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</b>
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
                  {/* Admin Online / Offline Toggle Button */}
                  <button
                    onClick={() => toggleDriverAvailability(u._id)}
                    disabled={actionLoadingId === u._id || u.isBlocked}
                    className="action-btn-hover"
                    style={{
                      ...styles.blockBtn,
                      flex: 1,
                      background: u.isAvailable
                        ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: u.isAvailable ? '1px solid #4b5563' : '1px solid #34d399',
                      opacity: u.isBlocked ? 0.5 : 1,
                      cursor: u.isBlocked ? 'not-allowed' : 'pointer'
                    }}
                    title={u.isAvailable ? 'Force switch driver to Offline' : 'Force switch driver to Online'}
                  >
                    {actionLoadingId === u._id ? 'Updating...' : u.isAvailable ? '🔴 Set Offline' : '🟢 Set Online'}
                  </button>

                  <button
                    onClick={() => blockUser(u._id)}
                    disabled={actionLoadingId === u._id}
                    className="action-btn-hover"
                    style={{
                      ...styles.blockBtn,
                      flex: 1,
                      background: u.isBlocked
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)'
                    }}
                  >
                    {actionLoadingId === u._id ? 'Updating...' : u.isBlocked ? '✅ Unblock Driver' : '🚫 Restrict / Block'}
                  </button>

                  {!u.isVerified && (
                    <button
                      onClick={() => verifyDriver(u._id)}
                      disabled={actionLoadingId === u._id}
                      className="action-btn-hover"
                      style={styles.verifyBtn}
                    >
                      {actionLoadingId === u._id ? 'Verifying...' : '✅ Verify & Authorize'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', margin: '24px 0 40px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || dataLoading}
              className="page-btn"
              style={{
                padding: '8px 14px',
                background: currentPage === 1 ? '#161616' : '#222222',
                color: currentPage === 1 ? '#555555' : '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.2s ease'
              }}
            >
              ← Prev
            </button>

            {getPageNumbers().map((p, idx) => (
              p === '...' ? (
                <span key={`dots-${idx}`} style={{ color: '#666666', padding: '0 4px', fontSize: '13px' }}>...</span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => setCurrentPage(p)}
                  disabled={currentPage === p || dataLoading}
                  className="page-btn"
                  style={{
                    padding: '8px 13px',
                    background: currentPage === p ? 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)' : '#1a1a1a',
                    color: currentPage === p ? '#ffffff' : '#aaaaaa',
                    border: currentPage === p ? '1px solid #e63946' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    cursor: currentPage === p ? 'default' : 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    boxShadow: currentPage === p ? '0 2px 10px rgba(230, 57, 70, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {p}
                </button>
              )
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || dataLoading}
              className="page-btn"
              style={{
                padding: '8px 14px',
                background: currentPage === totalPages ? '#161616' : '#222222',
                color: currentPage === totalPages ? '#555555' : '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.2s ease'
              }}
            >
              Next →
            </button>
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
    paddingBottom: '60px',
    boxSizing: 'border-box'
  },
  loginWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  loginBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  loginLogoBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1c1c1c 0%, #2a1114 100%)',
    border: '1px solid rgba(230, 57, 70, 0.4)',
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
    marginBottom: '16px',
    background: '#121212',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
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
  subFilterActive: {
    padding: '6px 12px',
    background: 'rgba(230, 57, 70, 0.2)',
    border: '1px solid #e63946',
    color: '#ffffff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '11.5px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },
  subFilterInactive: {
    padding: '6px 12px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    color: '#888888',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '11.5px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '800',
    margin: '0 0 2px 0',
    color: '#ffffff'
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
