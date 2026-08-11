import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { requestNotificationPermission } from '../firebase';
import Spinner from '../components/Spinner';
import AboutModal from '../components/AboutModal';
let socket;

const API = 'https://traverse-app.onrender.com';

function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('instant');
  const [scheduledRides, setScheduledRides] = useState([]);
  const [myScheduledRides, setMyScheduledRides] = useState([]);
  const [scheduledLoading, setScheduledLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const isAvailableRef = React.useRef(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [myRating, setMyRating] = useState({ average: 0, total: 0 });
  const [rides, setRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [accepting, setAccepting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchAvailableRides = async () => {
    try {
      const res = await axios.get(`${API}/api/rides/available`, { headers: { Authorization: `Bearer ${token}` } });
      setRides(res.data);
    } catch (err) {
      setMessage('Failed to fetch rides');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchMyRating = async () => {
    try {
      const res = await axios.get(`${API}/api/rides/my-rating`, { headers: { Authorization: `Bearer ${token}` } });
      setMyRating(res.data);
    } catch (err) { console.log('Rating fetch failed'); }
  };

  const fetchDriverActiveRide = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      console.log('Token exists:', !!currentToken);
      if (!currentToken) {
        setPageLoading(false);
        return;
      }
      const res = await axios.get(
        `${API}/api/rides/driver-active?t=${Date.now()}`,
        { headers: { Authorization: `Bearer ${currentToken}`, 'Cache-Control': 'no-cache' } }
      );
      console.log('Active ride response:', res.data);
      if (res.data) {
        setActiveRide(res.data);
      }
    } catch (err) {
      console.log('Driver active ride error:', err.message);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchScheduledRides = async () => {
    setScheduledLoading(true);
    try {
      const [available, mine] = await Promise.all([
        axios.get(`${API}/api/rides/scheduled`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/rides/my-scheduled`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setScheduledRides(available.data);
      setMyScheduledRides(mine.data);
    } catch (err) {
      console.log('Failed to fetch scheduled rides');
    }
    setScheduledLoading(false);
  };

  useEffect(() => {
    fetchAvailableRides();
    fetchMyRating();
    fetchScheduledRides();
    fetchDriverActiveRide();
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
          `${API}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsAvailable(res.data.isAvailable);
      } catch (err) {
        console.log('Failed to fetch availability');
      }
    };
    fetchAvailability();
    socket = io(API, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    socket.emit('join', { userId: user._id, role: 'driver' });
    // Request notification permission
    requestNotificationPermission().then(fcmToken => {
      if (fcmToken) {
        axios.post(
          `https://traverse-app.onrender.com/api/auth/save-token`,
          { fcmToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    });
    socket.on('new:ride', (ride) => {
      if (isAvailableRef.current) {
        setRides(prev => {
          const exists = prev.some(r => r._id === ride._id);
          if (exists) return prev;
          return [ride, ...prev];
        });
      }
    });
    socket.on('ride:cancelled-by-party', ({ message }) => {
      setActiveRide(null);
      setMessage(message);
      setShowCancelPopup(false);
      fetchAvailableRides();
    });
    socket.on('ride:cancelled', ({ rideId }) => {
      setRides(prev => prev.filter(r => r._id.toString() !== rideId.toString()));
    });
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((pos) => {
        socket.emit('driver:location', {
          rideId: null,
          studentId: null,
          sharedWithId: null,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.disconnect();
      };
    }
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (activeRide && socket) {
      // Get location immediately first
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit('driver:location', {
          rideId: activeRide._id,
          studentId: activeRide.student,
          sharedWithId: activeRide.sharedWith || null,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      }, null, { enableHighAccuracy: true });

      // Then keep watching
      navigator.geolocation.watchPosition((pos) => {
        socket.emit('driver:location', {
          rideId: activeRide._id,
          studentId: activeRide.student,
          sharedWithId: activeRide.sharedWith || null,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      }, null, { enableHighAccuracy: true, maximumAge: 0 });
    }
  }, [activeRide]);

  const preAcceptRide = async (rideId) => {
    try {
      await axios.put(
        `${API}/api/rides/pre-accept/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchScheduledRides();
      setMessage('Scheduled ride confirmed! ✅');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot pre-accept ride');
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await axios.put(
        `${API}/api/rides/toggle-availability`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAvailable(res.data.isAvailable);
      isAvailableRef.current = res.data.isAvailable;
      if (!res.data.isAvailable) {
        setRides([]);
        setMessage('You are now Offline 🔴');
      } else {
        fetchAvailableRides();
        setMessage('You are now Online ✅');
      }
    } catch (err) {
      setMessage('Failed to update availability');
    }
  };
  const rejectRide = async (rideId) => {
    try {
      await axios.put(`${API}/api/rides/reject/${rideId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setRides(prev => prev.filter(r => r._id !== rideId));
      setMessage('Ride rejected');
    } catch (err) { setMessage('Failed to reject ride'); }
  };

  const acceptRide = async (rideId) => {
    if (accepting) return;
    setAccepting(true);
    try {
      const res = await axios.put(
        `${API}/api/rides/accept/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveRide(res.data);
      setRides([]);
      setMessage('Ride accepted! Head to pickup location.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot accept ride');
    }
    setAccepting(false);
  };

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(`${API}/api/rides/status/${activeRide._id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setActiveRide(res.data);
      if (status === 'completed') {
        setActiveRide(null);
        setMessage('Ride completed! ✅');
        fetchAvailableRides();
        fetchMyRating();
      }
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to update status'); }
  };

  const cancelAcceptedRide = async () => {
    try {
      const res = await axios.put(
        `${API}/api/rides/cancel-accepted/${activeRide._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveRide(null);
      setShowCancelPopup(false);
      fetchAvailableRides();
      setMessage('Ride cancelled.');
      if (res.data.warning) {
        setMessage(res.data.warning);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot cancel');
      setShowCancelPopup(false);
    }
  };
  const logout = () => { localStorage.clear(); navigate('/login'); };

  const statusColor = {
    searching: '#f59e0b', accepted: '#e63946',
    ontheway: '#e63946', completed: '#10b981', cancelled: '#666'
  };

  const statusLabel = {
    searching: 'Searching',
    accepted: 'Accepted ✓',
    ontheway: 'On The Way 🚗',
    completed: 'Completed ✓',
    cancelled: 'Cancelled'
  };

  if (pageLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.navbar}>
          <div style={styles.navBrand}>
            <span style={styles.navLogo}>🚖</span>
            <span style={styles.navTitle}>TRAVERSE</span>
          </div>
        </div>
        <Spinner text='Loading driver dashboard...' />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🚖</span>
          <span style={styles.navTitle}>TRAVERSE</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>🚗 {user.name}</span>
          <button onClick={() => navigate('/history')} style={styles.navBtn}>History</button>
          <button onClick={() => setShowAbout(true)} style={styles.navBtn}>About</button>
          <button onClick={toggleAvailability} style={{
            ...styles.navBtn,
            background: isAvailable ? '#10b981' : '#ef4444',
            color: 'white',
            border: 'none'
          }}>
            {isAvailable ? '🟢 Online' : '🔴 Offline'}
          </button>
          <button onClick={logout} style={styles.navBtnRed}>Logout</button>
        </div>
      </div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <div style={styles.content}>

        {/* Rating Card */}
        <div style={styles.ratingCard}>
          <div style={styles.ratingLeft}>
            <p style={styles.ratingLabel}>Your Rating</p>
            <p style={styles.ratingValue}>
              {myRating.average > 0 ? `${myRating.average}` : '—'}
              <span style={styles.ratingMax}>{myRating.average > 0 ? '/5' : ''}</span>
            </p>
          </div>
          <div style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} style={{ color: s <= Math.round(myRating.average) ? '#e63946' : '#2a2a2a', fontSize: '20px' }}>★</span>
            ))}
            <p style={styles.ratingCount}>{myRating.total} rides rated</p>
          </div>
          <div style={styles.ratingRight}>
            <p style={styles.ratingStatus}>{myRating.average >= 4.5 ? '🏆 Top Driver' : myRating.average >= 4 ? '⭐ Great Driver' : myRating.average > 0 ? '👍 Good Driver' : '🆕 New Driver'}</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={styles.messagebox}>
            ℹ️ {message}
          </div>
        )}

        {/* Tabs */}
        {!activeRide && (
          <div style={styles.tabRow}>
            <button
              onClick={() => setActiveTab('instant')}
              style={activeTab === 'instant' ? styles.tabActive : styles.tabInactive}>
              ⚡ Instant Rides
              {rides.length > 0 && <span style={styles.tabBadge}>{rides.length}</span>}
            </button>
            <button
              onClick={() => { setActiveTab('scheduled'); fetchScheduledRides(); }}
              style={activeTab === 'scheduled' ? styles.tabActive : styles.tabInactive}>
              🕐 Scheduled
              {(scheduledRides.length + myScheduledRides.length) > 0 &&
                <span style={styles.tabBadge}>{scheduledRides.length + myScheduledRides.length}</span>}
            </button>
          </div>
        )}
        {/* Active Ride */}
        {activeRide && (
          <div style={styles.rideCard}>
            <div style={styles.rideCardHeader}>
              <h3 style={styles.rideCardTitle}>Active Ride</h3>
              <span style={{ ...styles.statusBadge, background: statusColor[activeRide.status] + '22', color: statusColor[activeRide.status], border: `1px solid ${statusColor[activeRide.status]}` }}>
                {statusLabel[activeRide.status]}
              </span>
            </div>

            <div style={styles.studentCard}>
              <div style={styles.studentAvatar}>👤</div>
              <div style={{ flex: 1 }}>
                <p style={styles.studentName}>{activeRide.student?.name}</p>
                <p style={styles.studentId}>Student</p>
              </div>
              {activeRide.student?.phone && (
                <a href={`tel:${activeRide.student.phone}`} style={styles.callBtn}>
                  📞 Call Student
                </a>
              )}
            </div>

            <div style={styles.routeInfo}>
              <div style={styles.routePoint}>
                <span>🟢</span>
                <span>{activeRide.pickup}</span>
              </div>
              <div style={styles.routeLine}>↓</div>
              <div style={styles.routePoint}>
                <span>🔴</span>
                <span>{activeRide.dropoff}</span>
              </div>
            </div>

            {activeRide.isScheduled && activeRide.scheduledTime && (
              <div style={styles.scheduledBadge}>
                🕐 Scheduled for: <b>{new Date(activeRide.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</b>
              </div>
            )}

            <div style={styles.btnRow}>
              {activeRide.status === 'accepted' && (
                <button onClick={() => updateStatus('ontheway')} style={styles.startBtn}>
                  🚗 Start Ride
                </button>
              )}
              {activeRide.status === 'ontheway' && (
                <button onClick={() => updateStatus('completed')} style={styles.completeBtn}>
                  ✅ Complete Ride
                </button>
              )}
              {activeRide.status === 'accepted' && (
                <button onClick={() => setShowCancelPopup(true)}
                  style={{ padding: '12px 20px', background: 'transparent', color: '#e63946', border: '1px solid #e63946', borderRadius: '10px', cursor: 'pointer', fontSize: '15px' }}>
                  Cancel
                </button>
              )}
            </div>

            {showCancelPopup && (
              <div style={styles.popup}>
                <div style={styles.popupCard}>
                  <h3 style={{ color: 'white', marginBottom: '8px' }}>⚠️ Cancel Ride?</h3>
                  <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
                    Cancelling after accepting may result in blacklisting after 5 times. Are you sure?
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={cancelAcceptedRide}
                      style={{ flex: 1, padding: '12px', background: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      Yes, Cancel
                    </button>
                    <button onClick={() => setShowCancelPopup(false)}
                      style={{ flex: 1, padding: '12px', background: '#1a1a1a', color: '#999', border: '1px solid #2a2a2a', borderRadius: '8px', cursor: 'pointer' }}>
                      Keep Ride
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        )}

        {/* Available Rides */}
        {/* Available Rides */}
        {!activeRide && (
          <div>
            {activeTab === 'instant' && (
              <div>
                <div style={styles.header}>
                  <div>
                    <h3 style={styles.sectionTitle}>Available Rides</h3>
                    <p style={styles.sectionSubtitle}>{rides.length} ride{rides.length !== 1 ? 's' : ''} waiting</p>
                  </div>
                  <button onClick={fetchAvailableRides} style={styles.refreshBtn}>🔄 Refresh</button>
                </div>

                {rides.length === 0 && (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>🚖</p>
                    <p style={styles.emptyTitle}>No rides available</p>
                    <p style={styles.emptySubtitle}>Waiting for ride requests...</p>
                  </div>
                )}

                {rides.map(ride => (
                  <div key={ride._id} style={styles.rideCard}>
                    <div style={styles.rideCardHeader}>
                      <div style={styles.studentInfo}>
                        <span style={styles.studentAvatar2}>👤</span>
                        <div>
                          <p style={styles.studentName}>{ride.student?.name}</p>
                          {ride.rideType === 'shared' && (
                            <span style={styles.sharedBadge}>
                              👥 {ride.sharedWith ? `Shared with ${ride.sharedWith.name}` : 'Looking for match'}
                            </span>
                          )}
                        </div>
                      </div>
                      {ride.isScheduled && (
                        <span style={styles.scheduledTag}>📅 Scheduled</span>
                      )}
                    </div>

                    <div style={styles.routeInfo}>
                      <div style={styles.routePoint}>
                        <span>🟢</span><span>{ride.pickup}</span>
                      </div>
                      <div style={styles.routeLine}>↓</div>
                      <div style={styles.routePoint}>
                        <span>🔴</span><span>{ride.dropoff}</span>
                      </div>
                    </div>

                    {ride.isScheduled && ride.scheduledTime && (
                      <div style={styles.scheduledBadge}>
                        🕐 Scheduled: <b>{new Date(ride.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</b>
                      </div>
                    )}
                    {!ride.isScheduled && (
                      <p style={styles.requestTime}>⏰ Requested at {new Date(ride.createdAt).toLocaleTimeString()}</p>
                    )}

                    <div style={styles.actionBtns}>
                      <button onClick={() => acceptRide(ride._id)} style={styles.acceptBtn} disabled={accepting}>
                        {accepting ? 'Accepting...' : '✓ Accept'}
                      </button>
                      <button onClick={() => rejectRide(ride._id)} style={styles.rejectBtn}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'scheduled' && (
              <div>
                {myScheduledRides.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ ...styles.sectionTitle, color: '#10b981' }}>
                      ✅ My Confirmed Rides ({myScheduledRides.length})
                    </h3>
                    {myScheduledRides.map(ride => (
                      <div key={ride._id} style={{ ...styles.rideCard, border: '1px solid #10b981' }}>
                        <div style={styles.rideCardHeader}>
                          <div style={styles.studentInfo}>
                            <span style={styles.studentAvatar2}>👤</span>
                            <div>
                              <p style={styles.studentName}>{ride.student?.name}</p>
                              {ride.student?.phone && (
                                <a href={`tel:${ride.student.phone}`} style={{ color: '#e63946', fontSize: '13px' }}>
                                  📞 {ride.student.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>CONFIRMED</span>
                        </div>
                        <div style={styles.routeInfo}>
                          <div style={styles.routePoint}><span>🟢</span><span>{ride.pickup}</span></div>
                          <div style={styles.routeLine}>↓</div>
                          <div style={styles.routePoint}><span>🔴</span><span>{ride.dropoff}</span></div>
                        </div>
                        <div style={styles.scheduledBadge}>
                          🕐 {new Date(ride.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.header}>
                  <h3 style={styles.sectionTitle}>🕐 Available Scheduled Rides</h3>
                  <button onClick={fetchScheduledRides} style={styles.refreshBtn}>🔄 Refresh</button>
                </div>

                {scheduledLoading && <Spinner text='Loading...' />}

                {!scheduledLoading && scheduledRides.length === 0 && (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>🕐</p>
                    <p style={styles.emptyTitle}>No scheduled rides</p>
                    <p style={styles.emptySubtitle}>Scheduled rides will appear here</p>
                  </div>
                )}

                {scheduledRides.map(ride => (
                  <div key={ride._id} style={styles.rideCard}>
                    <div style={styles.rideCardHeader}>
                      <div style={styles.studentInfo}>
                        <span style={styles.studentAvatar2}>👤</span>
                        <div>
                          <p style={styles.studentName}>{ride.student?.name}</p>
                          {ride.student?.phone && (
                            <a href={`tel:${ride.student.phone}`} style={{ color: '#e63946', fontSize: '13px' }}>
                              📞 {ride.student.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      {ride.driver && <span style={{ color: '#f59e0b', fontSize: '12px' }}>Already taken</span>}
                    </div>
                    <div style={styles.routeInfo}>
                      <div style={styles.routePoint}><span>🟢</span><span>{ride.pickup}</span></div>
                      <div style={styles.routeLine}>↓</div>
                      <div style={styles.routePoint}><span>🔴</span><span>{ride.dropoff}</span></div>
                    </div>
                    <div style={styles.scheduledBadge}>
                      🕐 {new Date(ride.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </div>
                    <p style={styles.requestTime}>🚗 {ride.vehicleType}</p>
                    {!ride.driver && (
                      <button onClick={() => preAcceptRide(ride._id)} style={styles.acceptBtn}>
                        ✓ Confirm Ride
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
  navLogo: { fontSize: '24px' },
  navTitle: { fontSize: '20px', fontWeight: '800', letterSpacing: '3px', color: '#e63946' },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  navUser: {
    color: '#666',
    fontSize: '13px',
    display: window.innerWidth <= 768 ? 'none' : 'block'
  },
  navBtn: { background: 'transparent', color: '#999', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  navBtnRed: { background: 'transparent', color: '#e63946', border: '1px solid #e63946', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  content: {
    maxWidth: '720px',
    margin: '24px auto',
    padding: '0 16px'
  },
  ratingCard: {
    background: '#111',
    border: '1px solid #1a1a1a',
    padding: '20px 24px',
    borderRadius: '16px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  ratingLabel: { color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' },
  ratingValue: { fontSize: '36px', fontWeight: '800', color: '#e63946', margin: 0 },
  ratingMax: { fontSize: '18px', color: '#666' },
  ratingStars: { textAlign: 'center' },
  ratingCount: { color: '#666', fontSize: '12px', margin: '4px 0 0 0' },
  ratingRight: {},
  ratingStatus: { fontSize: '14px', fontWeight: '600', margin: 0 },
  messagebox: { background: '#111', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', borderLeft: '3px solid #e63946', fontSize: '14px', color: '#ccc' },
  rideCard: {
    background: '#111',
    border: '1px solid #1a1a1a',
    padding: window.innerWidth <= 768 ? '16px' : '24px',
    borderRadius: '16px',
    marginBottom: '16px'
  },
  tabRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tabActive: { flex: 1, padding: '12px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', position: 'relative' },
  tabInactive: { flex: 1, padding: '12px', background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', position: 'relative' },
  tabBadge: { position: 'absolute', top: '-6px', right: '-6px', background: '#f59e0b', color: 'black', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: '6px' },

  rideCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  rideCardTitle: { fontSize: '18px', fontWeight: '700', margin: 0 },
  statusBadge: { padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  studentCard: { display: 'flex', alignItems: 'center', gap: '12px', background: '#0a0a0a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' },
  studentAvatar: { width: '40px', height: '40px', background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  studentName: { fontWeight: '600', margin: '0 0 2px 0', fontSize: '15px' },
  studentId: { color: '#666', fontSize: '12px', margin: 0 },
  routeInfo: { background: '#0a0a0a', padding: '14px 16px', borderRadius: '10px', marginBottom: '16px' },
  routePoint: { display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0', fontSize: '14px' },
  routeLine: { color: '#333', paddingLeft: '4px', fontSize: '16px', lineHeight: '1' },
  scheduledBadge: { background: '#1a0a00', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  btnRow: { display: 'flex', gap: '12px' },
  startBtn: { flex: 1, padding: '12px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  completeBtn: { flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' },
  sectionSubtitle: { color: '#666', fontSize: '14px', margin: 0 },
  refreshBtn: { background: '#1a1a1a', color: '#999', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' },
  empty: { background: '#111', border: '1px solid #1a1a1a', padding: '48px 24px', borderRadius: '16px', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', margin: '0 0 16px 0' },
  emptyTitle: { fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' },
  emptySubtitle: { color: '#666', fontSize: '14px', margin: 0 },
  studentInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  studentAvatar2: { fontSize: '24px' },
  sharedBadge: { background: '#1a0a00', color: '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' },
  scheduledTag: { background: '#1a0a00', color: '#f59e0b', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  requestTime: { color: '#666', fontSize: '13px', margin: '0 0 12px 0' },
  actionBtns: { display: 'flex', gap: '8px', marginTop: '16px' },
  acceptBtn: { flex: 1, padding: '12px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  rejectBtn: { padding: '12px 20px', background: 'transparent', color: '#666', border: '1px solid #2a2a2a', borderRadius: '10px', cursor: 'pointer', fontSize: '15px' },
  popup: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  popupCard: { background: '#111', border: '1px solid #2a2a2a', padding: '24px', borderRadius: '16px', maxWidth: '320px', width: '90%' },
};

export default DriverDashboard;