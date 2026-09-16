import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const API = 'https://traverse-app.onrender.com';

function DriverEarnings() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'month' | 'week'
  const navigate = useNavigate();

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user')) || {};
  } catch (e) {
    user = {};
  }
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/rides/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter completed rides driven by the current driver
      const completed = (res.data || []).filter(r => {
        const isCompleted = r.status === 'completed';
        const driverId = r.driver?._id || r.driver;
        const isCurrentDriver = driverId && (driverId.toString() === (user._id || user.id)?.toString());
        return isCompleted && isCurrentDriver;
      });
      setRides(completed);
    } catch (err) {
      console.log('Error fetching driver earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  // Total Lifetime Earnings
  const totalEarnings = rides.reduce((sum, r) => sum + (Number(r.fare) || 0), 0);
  const totalRidesCount = rides.length;

  // Today Earnings
  const todayEarnings = rides
    .filter(r => new Date(r.createdAt).getTime() >= startOfToday)
    .reduce((sum, r) => sum + (Number(r.fare) || 0), 0);

  // This Week Earnings & Count
  const thisWeekRides = rides.filter(r => new Date(r.createdAt).getTime() >= sevenDaysAgo);
  const thisWeekEarnings = thisWeekRides.reduce((sum, r) => sum + (Number(r.fare) || 0), 0);

  // This Month Earnings & Count
  const thisMonthRides = rides.filter(r => new Date(r.createdAt).getTime() >= startOfMonth);
  const thisMonthEarnings = thisMonthRides.reduce((sum, r) => sum + (Number(r.fare) || 0), 0);

  // Average Fare
  const averageFare = totalRidesCount > 0 ? Math.round(totalEarnings / totalRidesCount) : 0;

  // Best Single Day Calculation
  const earningsByDay = {};
  rides.forEach(r => {
    const d = new Date(r.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    earningsByDay[d] = (earningsByDay[d] || 0) + (Number(r.fare) || 0);
  });

  let bestDayEarnings = 0;
  let bestDayDate = 'N/A';
  Object.keys(earningsByDay).forEach(d => {
    if (earningsByDay[d] > bestDayEarnings) {
      bestDayEarnings = earningsByDay[d];
      bestDayDate = d;
    }
  });

  // Filtered rides for list display
  const displayedRides = rides.filter(r => {
    const rideTime = new Date(r.createdAt).getTime();
    if (filter === 'week') return rideTime >= sevenDaysAgo;
    if (filter === 'month') return rideTime >= startOfMonth;
    return true;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideUpIn {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatGlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .earnings-card-hover {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .earnings-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 20px rgba(230, 57, 70, 0.15) !important;
          border-color: rgba(230, 57, 70, 0.35) !important;
        }
        .back-btn-hover:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .filter-pill-btn {
          transition: all 0.2s ease;
        }
        .filter-pill-btn:hover {
          filter: brightness(1.15);
        }
        @media (max-width: 480px) {
          .stats-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-substats-mobile {
            flex-direction: column !important;
            gap: 12px !important;
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

        <div style={styles.navRight}>
          <button
            onClick={() => navigate('/driver')}
            className="back-btn-hover"
            style={styles.backBtn}
          >
            ← Back
          </button>
        </div>
      </nav>

      <main style={styles.content}>
        {/* Header Title Section */}
        <div style={styles.headerSection}>
          <span style={styles.headerTag}>DRIVER REVENUE & METRICS</span>
          <h2 style={styles.pageTitle}>Earnings Dashboard</h2>
          <p style={styles.pageSubtitle}>
            100% direct payouts with zero commission cuts • JUIT Campus Union
          </p>
        </div>

        {loading ? (
          <Spinner text="Loading driver earnings..." />
        ) : (
          <div style={{ animation: 'slideUpIn 0.35s ease-out' }}>
            {/* HERO EARNINGS CARD */}
            <div className="earnings-card-hover" style={styles.heroCard}>
              <div style={styles.heroGlowOverlay} />

              <div style={styles.heroHeaderRow}>
                <div>
                  <span style={styles.heroCardBadge}>💎 DRIVER WALLET & PAYOUTS</span>
                  <p style={styles.heroLabel}>Total Revenue Generated</p>
                </div>
                <div style={styles.heroChipBox}>
                  <span>💰</span>
                </div>
              </div>

              <div style={styles.heroAmountRow}>
                <h1 style={styles.heroAmount}>
                  ₹{totalEarnings.toLocaleString('en-IN')}
                </h1>
                <span style={styles.heroSubTag}>Total Earned</span>
              </div>

              {/* Hero Sub Stats in a Row */}
              <div className="hero-substats-mobile" style={styles.heroSubstatsRow}>
                <div style={styles.heroSubstatItem}>
                  <span style={styles.heroSubstatLabel}>Today</span>
                  <span style={styles.heroSubstatValue}>₹{todayEarnings.toLocaleString('en-IN')}</span>
                </div>
                <div style={styles.heroSubstatDivider} />
                <div style={styles.heroSubstatItem}>
                  <span style={styles.heroSubstatLabel}>This Week</span>
                  <span style={styles.heroSubstatValue}>₹{thisWeekEarnings.toLocaleString('en-IN')}</span>
                </div>
                <div style={styles.heroSubstatDivider} />
                <div style={styles.heroSubstatItem}>
                  <span style={styles.heroSubstatLabel}>This Month</span>
                  <span style={styles.heroSubstatValue}>₹{thisMonthEarnings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* STATS 2x2 GRID (Mobile First) */}
            <div className="stats-grid-mobile" style={styles.statsGrid}>
              {/* Total Rides Completed (Green) */}
              <div className="earnings-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #10b981' }}>
                <div style={{ ...styles.statIconBox, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                  <span>🏁</span>
                </div>
                <p style={{ ...styles.statValue, color: '#10b981' }}>
                  {totalRidesCount}
                </p>
                <p style={styles.statLabel}>Completed Rides</p>
              </div>

              {/* Average Fare Per Ride (Blue) */}
              <div className="earnings-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #3b82f6' }}>
                <div style={{ ...styles.statIconBox, background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                  <span>📊</span>
                </div>
                <p style={{ ...styles.statValue, color: '#3b82f6' }}>
                  ₹{averageFare.toLocaleString('en-IN')}
                </p>
                <p style={styles.statLabel}>Average Fare</p>
              </div>

              {/* This Week Rides (Yellow) */}
              <div className="earnings-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #f59e0b' }}>
                <div style={{ ...styles.statIconBox, background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                  <span>⚡</span>
                </div>
                <p style={{ ...styles.statValue, color: '#f59e0b' }}>
                  {thisWeekRides.length}
                </p>
                <p style={styles.statLabel}>This Week Rides</p>
              </div>

              {/* Best Single Day Earnings (Red) */}
              <div className="earnings-card-hover" style={{ ...styles.statCard, borderTop: '2px solid #e63946' }}>
                <div style={{ ...styles.statIconBox, background: 'rgba(230, 57, 70, 0.12)', color: '#e63946' }}>
                  <span>🏆</span>
                </div>
                <p style={{ ...styles.statValue, color: '#ff4d5a' }}>
                  ₹{bestDayEarnings.toLocaleString('en-IN')}
                </p>
                <p style={styles.statLabel}>
                  Best Single Day {bestDayDate !== 'N/A' && `(${bestDayDate})`}
                </p>
              </div>
            </div>

            {/* FILTER TABS */}
            <div style={styles.filterContainer}>
              <button
                onClick={() => setFilter('all')}
                className="filter-pill-btn"
                style={filter === 'all' ? styles.filterActive : styles.filterInactive}
              >
                <span>🌐 All Time</span>
                <span style={filter === 'all' ? styles.filterBadgeActive : styles.filterBadgeInactive}>
                  {rides.length}
                </span>
              </button>

              <button
                onClick={() => setFilter('month')}
                className="filter-pill-btn"
                style={filter === 'month' ? styles.filterActive : styles.filterInactive}
              >
                <span>📅 This Month</span>
                <span style={filter === 'month' ? styles.filterBadgeActive : styles.filterBadgeInactive}>
                  {thisMonthRides.length}
                </span>
              </button>

              <button
                onClick={() => setFilter('week')}
                className="filter-pill-btn"
                style={filter === 'week' ? styles.filterActive : styles.filterInactive}
              >
                <span>⚡ This Week</span>
                <span style={filter === 'week' ? styles.filterBadgeActive : styles.filterBadgeInactive}>
                  {thisWeekRides.length}
                </span>
              </button>
            </div>

            {/* SECTION LIST HEADER */}
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Completed Trip Receipts</h3>
              <span style={styles.sectionCountTag}>
                {displayedRides.length} Trips
              </span>
            </div>

            {/* RIDE HISTORY LIST */}
            {displayedRides.length === 0 ? (
              <div className="earnings-card-hover" style={styles.empty}>
                <div style={styles.emptyIconBox}>
                  <span>💰</span>
                </div>
                <h4 style={styles.emptyTitle}>No Completed Rides Yet</h4>
                <p style={styles.emptySubtitle}>
                  Completed passenger rides with collected cash and online fares will be recorded here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {displayedRides.map(ride => (
                  <div key={ride._id} className="earnings-card-hover" style={styles.rideCard}>
                    <div style={styles.cardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={styles.completedBadge}>
                          ✅ COMPLETED
                        </span>

                        {ride.rideType === 'shared' ? (
                          <span style={styles.sharedBadge}>👥 Shared</span>
                        ) : (
                          <span style={styles.privateBadge}>⚡ Instant</span>
                        )}

                        {ride.vehicleType && (
                          <span style={styles.vehicleBadge}>
                            🚗 {ride.vehicleType.includes('4+1') ? 'Sedan (4+1)' : ride.vehicleType.includes('6+1') ? 'SUV (6+1)' : ride.vehicleType}
                          </span>
                        )}
                      </div>

                      <span style={styles.date}>
                        {new Date(ride.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })} • {new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

                    {/* Footer */}
                    <div style={styles.cardFooter}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={styles.avatarMini}>🎓</div>
                        <div>
                          <p style={styles.participantName}>
                            {ride.student?.name || 'Student Rider'}
                          </p>
                          <p style={styles.participantSub}>
                            {ride.student?.phone ? `📞 ${ride.student.phone}` : 'Verified Rider'}
                          </p>
                        </div>
                      </div>

                      <div style={styles.fareHighlightBox}>
                        <span style={styles.fareLabel}>FARE EARNED</span>
                        <p style={styles.fareAmount}>₹{ride.fare || 0}</p>
                      </div>
                    </div>

                    {ride.rating && (
                      <div style={styles.ratingRow}>
                        <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                          ⭐ Rated {ride.rating}/5
                        </span>
                        {ride.comment && (
                          <span style={{ fontSize: '11px', color: '#888888', fontStyle: 'italic' }}>
                            "{ride.comment}"
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
    fontSize: '18px',
    fontWeight: '900',
    letterSpacing: '2px',
    color: '#e63946',
    textShadow: '0 0 16px rgba(230, 57, 70, 0.5)'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
  heroCard: {
    background: 'linear-gradient(135deg, #1f0a0d 0%, #2e0e14 45%, #16080a 100%)',
    border: '1px solid rgba(230, 57, 70, 0.45)',
    borderRadius: '20px',
    padding: '24px 22px',
    marginBottom: '20px',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(230, 57, 70, 0.18)',
    position: 'relative',
    overflow: 'hidden'
  },
  heroGlowOverlay: {
    position: 'absolute',
    top: '-40%',
    right: '-20%',
    width: '260px',
    height: '260px',
    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.28) 0%, rgba(230, 57, 70, 0) 70%)',
    pointerEvents: 'none'
  },
  heroHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  heroCardBadge: {
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    color: '#ff4d5a',
    display: 'block',
    marginBottom: '4px'
  },
  heroLabel: {
    fontSize: '13px',
    color: '#bbbbbb',
    margin: 0,
    fontWeight: '600'
  },
  heroChipBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(230, 57, 70, 0.15)',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    boxShadow: '0 0 14px rgba(230, 57, 70, 0.3)'
  },
  heroAmountRow: {
    marginBottom: '20px'
  },
  heroAmount: {
    fontSize: '38px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 2px 0',
    letterSpacing: '-1px',
    lineHeight: '1.1',
    textShadow: '0 0 24px rgba(230, 57, 70, 0.6)'
  },
  heroSubTag: {
    fontSize: '12px',
    color: '#ff8c94',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.8px'
  },
  heroSubstatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '12px 16px'
  },
  heroSubstatItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  heroSubstatLabel: {
    fontSize: '10px',
    color: '#888888',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.6px',
    marginBottom: '3px'
  },
  heroSubstatValue: {
    fontSize: '16px',
    fontWeight: '900',
    color: '#ffffff'
  },
  heroSubstatDivider: {
    width: '1px',
    height: '24px',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  statsGrid: {
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    marginBottom: '6px'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '900',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  filterBadgeActive: {
    background: '#ffffff',
    color: '#c1121f',
    borderRadius: '10px',
    padding: '1px 6px',
    fontSize: '10px',
    fontWeight: '800'
  },
  filterBadgeInactive: {
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
    fontSize: '28px',
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
    marginBottom: '14px',
    flexWrap: 'wrap',
    gap: '6px'
  },
  completedBadge: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    padding: '3px 8px',
    borderRadius: '16px',
    fontSize: '10.5px',
    fontWeight: '800',
    letterSpacing: '0.4px'
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
    color: '#aaaaaa',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600'
  },
  vehicleBadge: {
    background: 'rgba(230, 57, 70, 0.1)',
    color: '#ff8c94',
    border: '1px solid rgba(230, 57, 70, 0.25)',
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
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px'
  },
  participantName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#eeeeee',
    margin: 0
  },
  participantSub: {
    fontSize: '11px',
    color: '#777777',
    margin: 0
  },
  fareHighlightBox: {
    textAlign: 'right',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '5px 12px',
    borderRadius: '10px'
  },
  fareLabel: {
    fontSize: '8px',
    color: '#10b981',
    fontWeight: '900',
    letterSpacing: '0.8px',
    display: 'block',
    marginBottom: '1px'
  },
  fareAmount: {
    fontSize: '16px',
    fontWeight: '900',
    color: '#10b981',
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
  }
};

export default DriverEarnings;
