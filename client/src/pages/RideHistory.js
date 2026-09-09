import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

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
    } catch (err) {
      console.log('Error fetching history');
    } finally {
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
    totalSpent: rides
      .filter(r => r.status === 'completed' && r.fare)
      .reduce((sum, r) => sum + (Number(r.fare) || 0), 0)
  };

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
        .history-card-hover {
          animation: slideUpIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .history-card-hover:hover {
          border-color: rgba(230, 57, 70, 0.4) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(230, 57, 70, 0.12) !important;
          transform: translateY(-2px);
        }
        .nav-btn-hover:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border-color: #444 !important;
        }
        @media (max-width: 480px) {
          .stats-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .filter-pill-mobile {
            padding: 7px 12px !important;
            font-size: 12px !important;
          }
          .nav-back-text {
            display: none !important;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navLogoBox}>
            <span style={styles.navLogo}>🚖</span>
          </div>
          <span style={styles.navTitle}>TRAVERSE</span>
        </div>

        <button onClick={() => navigate(-1)} className="nav-btn-hover" style={styles.backBtn} title="Go Back">
          <span>←</span>
          <span className="nav-back-text"> Back</span>
        </button>
      </nav>

      <main style={styles.content}>
        {/* Header Title */}
        <div style={styles.headerSection}>
          <span style={styles.headerTag}>TRIP LOGS</span>
          <h2 style={styles.pageTitle}>Ride History</h2>
          <p style={styles.pageSubtitle}>Review your completed routes, fares, and journey receipts</p>
        </div>

        {/* Stats Summary Cards (Uber Trips Breakdown Style) */}
        <div className="stats-grid-mobile" style={styles.statsRow}>
          <div className="history-card-hover" style={styles.statCard}>
            <div style={styles.statIconBox}>
              <span>🚗</span>
            </div>
            <p style={styles.statValue}>{stats.total}</p>
            <p style={styles.statLabel}>Total Trips</p>
          </div>

          <div className="history-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #10b981' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
              <span>✅</span>
            </div>
            <p style={{ ...styles.statValue, color: '#10b981' }}>{stats.completed}</p>
            <p style={styles.statLabel}>Completed</p>
          </div>

          <div className="history-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #ef4444' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
              <span>✕</span>
            </div>
            <p style={{ ...styles.statValue, color: '#ef4444' }}>{stats.cancelled}</p>
            <p style={styles.statLabel}>Cancelled</p>
          </div>

          <div className="history-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #e63946' }}>
            <div style={{ ...styles.statIconBox, background: 'rgba(230, 57, 70, 0.12)', color: '#e63946' }}>
              <span>💳</span>
            </div>
            <p style={{ ...styles.statValue, color: '#ffffff', fontSize: '20px' }}>₹{stats.totalSpent}</p>
            <p style={styles.statLabel}>Total Spent</p>
          </div>
        </div>

        {/* Filter Pill Tabs */}
        <div style={styles.filterContainer}>
          {['all', 'completed', 'cancelled', 'searching'].map(f => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="filter-pill-mobile"
                style={isActive ? styles.filterActive : styles.filterInactive}
              >
                {f === 'all' && '🌐 All Trips'}
                {f === 'completed' && '✅ Completed'}
                {f === 'cancelled' && '✕ Cancelled'}
                {f === 'searching' && '⏳ In Progress'}
              </button>
            );
          })}
        </div>

        {loading && <Spinner text='Retrieving journey records...' />}

        {!loading && filteredRides.length === 0 && (
          <div className="history-card-hover" style={styles.empty}>
            <div style={styles.emptyIconBox}>
              <span style={{ fontSize: '32px' }}>🚖</span>
            </div>
            <h4 style={styles.emptyTitle}>No Rides Found</h4>
            <p style={styles.emptySubtitle}>
              {filter === 'all'
                ? "You haven't requested any rides on Traverse yet. Book your first campus trip!"
                : `No ${filter} rides in your account logs.`}
            </p>
          </div>
        )}

        {/* Ride Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredRides.map(ride => {
            const isClickable = ride.status === 'searching' || ride.status === 'accepted' || ride.status === 'ontheway';
            return (
              <div
                key={ride._id}
                className="history-card-hover"
                style={{
                  ...styles.rideCard,
                  cursor: isClickable ? 'pointer' : 'default',
                  border: isClickable ? '1px solid rgba(230, 57, 70, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isClickable
                    ? 'linear-gradient(145deg, #1a1012 0%, #121212 100%)'
                    : 'linear-gradient(145deg, #161616 0%, #111111 100%)'
                }}
                onClick={() => {
                  if (isClickable) {
                    navigate('/student');
                  }
                }}
              >
                {/* Header row: Status badge + Date */}
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      ...styles.statusBadge,
                      background: `${statusColor[ride.status] || '#666'}1f`,
                      color: statusColor[ride.status] || '#999',
                      border: `1px solid ${statusColor[ride.status] || '#666'}55`
                    }}>
                      {statusLabel[ride.status] || ride.status}
                    </span>

                    {ride.rideType === 'shared' ? (
                      <span style={styles.sharedBadge}>👥 Pool Shuttle</span>
                    ) : (
                      <span style={styles.privateBadge}>🔒 Private</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#666' }}>📅</span>
                    <span style={styles.date}>
                      {new Date(ride.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Route Timeline Container */}
                <div style={styles.routeContainer}>
                  <div style={styles.routeTimeline}>
                    <div style={styles.routeDotPickup} />
                    <div style={styles.routeVerticalLine} />
                    <div style={styles.routeDotDropoff} />
                  </div>
                  <div style={styles.routeDetails}>
                    <div style={styles.routeStop}>
                      <div style={styles.routeStopHeader}>
                        <span style={styles.routeTagPickup}>PICKUP</span>
                      </div>
                      <p style={styles.routeAddress}>{ride.pickup}</p>
                    </div>
                    <div style={styles.routeStop}>
                      <div style={styles.routeStopHeader}>
                        <span style={styles.routeTagDropoff}>DROPOFF</span>
                      </div>
                      <p style={styles.routeAddress}>{ride.dropoff}</p>
                    </div>
                  </div>
                </div>

                {/* Footer details: Driver/Passenger name + Fare Tag */}
                <div style={styles.cardFooter}>
                  <div>
                    {ride.driver && user?.role === 'student' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={styles.avatarMini}>🚗</span>
                        <div>
                          <p style={styles.participantName}>{ride.driver.name}</p>
                          <p style={styles.vehicleNumber}>{ride.driver.vehicleNumber || 'Campus Cab'}</p>
                        </div>
                      </div>
                    )}
                    {ride.student && user?.role === 'driver' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={styles.avatarMini}>👤</span>
                        <div>
                          <p style={styles.participantName}>{ride.student.name}</p>
                          <p style={styles.vehicleNumber}>Campus Passenger</p>
                        </div>
                      </div>
                    )}
                    {!ride.driver && !ride.student && (
                      <span style={{ color: '#666', fontSize: '12px' }}>Trip record #{ride._id.slice(-6)}</span>
                    )}
                  </div>

                  {ride.fare > 0 && (
                    <div style={styles.fareHighlightBox}>
                      <span style={styles.fareLabel}>FARE PAID</span>
                      <p style={styles.fareAmount}>₹{ride.fare}</p>
                    </div>
                  )}
                </div>

                {/* Rating Display */}
                {ride.rating && (
                  <div style={styles.ratingRow}>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span
                          key={s}
                          style={{
                            color: s <= ride.rating ? '#e63946' : '#2a2a2a',
                            fontSize: '15px',
                            textShadow: s <= ride.rating ? '0 0 6px rgba(230, 57, 70, 0.4)' : 'none'
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span style={{ color: '#888', fontSize: '11px', fontWeight: '500' }}>
                      Trip Rated ({ride.rating}/5)
                    </span>
                  </div>
                )}

                {/* Scheduled Trip Indicator */}
                {ride.isScheduled && ride.scheduledTime && (
                  <div style={styles.scheduledInfo}>
                    <span>🕐 Scheduled slot:</span>
                    <b>{new Date(ride.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</b>
                  </div>
                )}

                {isClickable && (
                  <div style={styles.liveTrackingHint}>
                    <span>⚡ Trip in progress — Tap to open live dashboard</span>
                    <span>→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #1c1c1c 0%, #2a1114 100%)',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(230, 57, 70, 0.3)'
  },
  navLogo: { fontSize: '20px' },
  navTitle: {
    fontSize: '18px',
    fontWeight: '900',
    letterSpacing: '2.5px',
    color: '#e63946',
    textShadow: '0 0 16px rgba(230, 57, 70, 0.5)'
  },
  backBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#a0a0a0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '7px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  content: {
    maxWidth: '680px',
    margin: '20px auto 0',
    padding: '0 14px'
  },
  headerSection: {
    marginBottom: '20px'
  },
  headerTag: {
    color: '#e63946',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    display: 'block',
    marginBottom: '2px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '900',
    margin: '0 0 4px 0',
    color: '#ffffff',
    letterSpacing: '-0.5px'
  },
  pageSubtitle: {
    color: '#777777',
    fontSize: '13px',
    margin: 0
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
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
  filterContainer: {
    display: 'flex',
    gap: '6px',
    marginBottom: '20px',
    background: '#121212',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    overflowX: 'auto'
  },
  filterActive: {
    flex: 1,
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 10px rgba(230, 57, 70, 0.4)',
    transition: 'all 0.2s ease'
  },
  filterInactive: {
    flex: 1,
    padding: '8px 12px',
    background: 'transparent',
    color: '#777777',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },
  empty: {
    background: 'linear-gradient(145deg, #141414 0%, #0f0f0f 100%)',
    border: '1px dashed rgba(255, 255, 255, 0.12)',
    padding: '44px 20px',
    borderRadius: '18px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  emptyIconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(230, 57, 70, 0.08)',
    border: '1px solid rgba(230, 57, 70, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px'
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    color: '#ffffff'
  },
  emptySubtitle: {
    color: '#777777',
    fontSize: '12px',
    margin: 0,
    maxWidth: '300px',
    lineHeight: '1.4'
  },
  rideCard: {
    padding: '16px',
    borderRadius: '16px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
    position: 'relative',
    transition: 'all 0.2s ease'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
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
  privateBadge: {
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#888888',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600'
  },
  date: {
    color: '#888888',
    fontSize: '12px',
    fontWeight: '500'
  },
  routeContainer: {
    display: 'flex',
    gap: '12px',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '12px 14px',
    borderRadius: '12px',
    marginBottom: '14px',
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
  routeStopHeader: {
    marginBottom: '1px'
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
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatarMini: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px'
  },
  participantName: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#eeeeee',
    margin: 0
  },
  vehicleNumber: {
    fontSize: '10px',
    color: '#777777',
    margin: 0
  },
  fareHighlightBox: {
    textAlign: 'right',
    background: 'rgba(230, 57, 70, 0.08)',
    border: '1px solid rgba(230, 57, 70, 0.25)',
    padding: '4px 10px',
    borderRadius: '8px'
  },
  fareLabel: {
    fontSize: '8px',
    color: '#e63946',
    fontWeight: '800',
    letterSpacing: '0.6px',
    display: 'block'
  },
  fareAmount: {
    fontSize: '15px',
    fontWeight: '900',
    color: '#ffffff',
    margin: 0,
    lineHeight: '1.1'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
  },
  scheduledInfo: {
    color: '#f59e0b',
    fontSize: '11px',
    marginTop: '8px',
    background: 'rgba(245, 158, 11, 0.08)',
    padding: '5px 8px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  liveTrackingHint: {
    marginTop: '10px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(230, 57, 70, 0.2)',
    color: '#e63946',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

export default RideHistory;