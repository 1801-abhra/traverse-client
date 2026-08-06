import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://traverse-app.onrender.com';

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${API}/api/rides/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRides(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const statusColor = {
    searching: '#f59e0b',
    accepted: '#e63946',
    ontheway: '#e63946',
    completed: '#10b981',
    cancelled: '#666'
  };

  const statusLabel = {
    searching: 'Searching',
    accepted: 'Accepted',
    ontheway: 'On The Way',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const filteredRides = filter === 'all' ? rides : rides.filter(r => r.status === filter);

  const stats = {
    total: rides.length,
    completed: rides.filter(r => r.status === 'completed').length,
    cancelled: rides.filter(r => r.status === 'cancelled').length,
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🚖</span>
          <span style={styles.navTitle}>TRAVERSE</span>
        </div>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>Ride History</h2>
        <p style={styles.pageSubtitle}>Your past rides with Traverse</p>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{stats.total}</p>
            <p style={styles.statLabel}>Total Rides</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statValue, color: '#10b981' }}>{stats.completed}</p>
            <p style={styles.statLabel}>Completed</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statValue, color: '#666' }}>{stats.cancelled}</p>
            <p style={styles.statLabel}>Cancelled</p>
          </div>
        </div>

        {/* Filter */}
        <div style={styles.filterRow}>
          {['all', 'completed', 'cancelled', 'searching'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={filter === f ? styles.filterActive : styles.filterInactive}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <p>Loading rides...</p>
          </div>
        )}

        {!loading && filteredRides.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🚖</p>
            <p style={styles.emptyTitle}>No rides found</p>
            <p style={styles.emptySubtitle}>
              {filter === 'all' ? "You haven't taken any rides yet" : `No ${filter} rides found`}
            </p>
          </div>
        )}

        {filteredRides.map(ride => (
          <div key={ride._id} style={{
            ...styles.rideCard,
            cursor: (ride.status === 'searching' || ride.status === 'accepted' || ride.status === 'ontheway') ? 'pointer' : 'default'
          }}
            onClick={() => {
              if (ride.status === 'searching' || ride.status === 'accepted' || ride.status === 'ontheway') {
                navigate('/student');
              }
            }}
          >
            <div style={styles.cardHeader}>
              <div>
                <span style={{ ...styles.statusBadge, background: statusColor[ride.status] + '22', color: statusColor[ride.status], border: `1px solid ${statusColor[ride.status]}` }}>
                  {statusLabel[ride.status]}
                </span>
                {ride.rideType === 'shared' && (
                  <span style={styles.sharedBadge}>👥 Shared</span>
                )}
              </div>
              <span style={styles.date}>
                {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div style={styles.routeInfo}>
              <div style={styles.routePoint}>
                <span>🟢</span>
                <span>{ride.pickup}</span>
              </div>
              <div style={styles.routeLine}>↓</div>
              <div style={styles.routePoint}>
                <span>🔴</span>
                <span>{ride.dropoff}</span>
              </div>
            </div>

            <div style={styles.cardFooter}>
              {ride.driver && user.role === 'student' && (
                <span style={styles.footerInfo}>🧑 {ride.driver.name} • {ride.driver.vehicleNumber}</span>
              )}
              {ride.student && user.role === 'driver' && (
                <span style={styles.footerInfo}>👤 {ride.student.name}</span>
              )}
              {ride.fare > 0 && (
                <span style={styles.fareTag}>₹{ride.fare}</span>
              )}
            </div>

            {ride.rating && (
              <div style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ color: s <= ride.rating ? '#e63946' : '#2a2a2a', fontSize: '16px' }}>★</span>
                ))}
                <span style={{ color: '#666', fontSize: '13px', marginLeft: '4px' }}>You rated this ride</span>
              </div>
            )}

            {ride.isScheduled && ride.scheduledTime && (
              <div style={styles.scheduledInfo}>
                🕐 Was scheduled for: {new Date(ride.scheduledTime).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'Inter, sans-serif' },
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
  navTitle: { fontSize: '20px', fontWeight: '800', letterSpacing: '3px', color: '#e63946' },
  backBtn: { background: 'transparent', color: '#999', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  content: {
    maxWidth: '720px',
    margin: '24px auto',
    padding: '0 16px'
  },
  pageTitle: { fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0' },
  pageSubtitle: { color: '#666', fontSize: '15px', marginBottom: '24px' },
  statsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  statCard: {
    flex: 1,
    minWidth: '80px',
    background: '#111',
    border: '1px solid #1a1a1a',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statValue: { fontSize: '28px', fontWeight: '800', color: '#e63946', margin: '0 0 4px 0' },
  statLabel: { color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  filterActive: { padding: '8px 16px', background: '#e63946', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  filterInactive: { padding: '8px 16px', background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  loadingBox: { textAlign: 'center', padding: '48px', color: '#666' },
  empty: { background: '#111', border: '1px solid #1a1a1a', padding: '48px 24px', borderRadius: '16px', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', margin: '0 0 16px 0' },
  emptyTitle: { fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' },
  emptySubtitle: { color: '#666', fontSize: '14px', margin: 0 },
  rideCard: {
    background: '#111',
    border: '1px solid #1a1a1a',
    padding: window.innerWidth <= 768 ? '16px' : '20px',
    borderRadius: '16px',
    marginBottom: '12px'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  sharedBadge: { background: '#1a0a00', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', marginLeft: '8px' },
  date: { color: '#666', fontSize: '13px' },
  routeInfo: { background: '#0a0a0a', padding: '12px 16px', borderRadius: '10px', marginBottom: '12px' },
  routePoint: { display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0', fontSize: '14px' },
  routeLine: { color: '#333', paddingLeft: '4px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerInfo: { color: '#666', fontSize: '13px' },
  fareTag: { background: '#1a1a1a', color: '#e63946', padding: '4px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '700' },
  ratingRow: { display: 'flex', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #1a1a1a' },
  scheduledInfo: { color: '#f59e0b', fontSize: '13px', marginTop: '8px' },
};

export default RideHistory;