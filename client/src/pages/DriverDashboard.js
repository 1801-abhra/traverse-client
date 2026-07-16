import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

let socket;

function DriverDashboard() {
  const [myRating, setMyRating] = useState({ average: 0, total: 0 });
  const [rides, setRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAvailableRides();
    fetchMyRating();
    socket = io('https://traverse-app-production.up.railway.app', {
      transports: ['websocket', 'polling']
    });
    socket.emit('join', { userId: user._id, role: 'driver' });

    socket.on('new:ride', (ride) => {
      setRides(prev => [ride, ...prev]);
    });
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((pos) => {
        if (activeRide) {
          socket.emit('driver:location', {
            rideId: activeRide._id,
            studentId: activeRide.student,
            sharedWithId: activeRide.sharedWith || null,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        }
      });
      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.disconnect();
      };
    }

    return () => socket.disconnect();
  }, []);

  const fetchAvailableRides = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/rides/available`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRides(res.data);
    } catch (err) {
      setMessage('Failed to fetch rides');
    }
  };
  const fetchMyRating = async () => {
    try {
      const res = await axios.get(
        'https://traverse-app-production.up.railway.app/api/rides/my-rating',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyRating(res.data);
    } catch (err) {
      console.log('Rating fetch failed');
    }
  };
  const acceptRide = async (rideId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/rides/accept/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveRide(res.data);
      setRides([]);
      setMessage('Ride accepted! Head to pickup location.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot accept ride');
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/rides/status/${activeRide._id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveRide(res.data);
      if (status === 'completed') {
        setActiveRide(null);
        setMessage('Ride completed!');
        fetchAvailableRides();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const statusColor = {
    searching: '#f59e0b',
    accepted: '#3b82f6',
    ontheway: '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444'
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🚌 Traverse</h2>
        <div>
          <button onClick={() => navigate('/history')} style={styles.navBtn}>History</button>
          <button onClick={logout} style={styles.navBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2>Welcome, {user.name}!</h2>
        <div style={styles.ratingCard}>
          <span>⭐ Your Rating</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
            {myRating.average > 0 ? `${myRating.average}/5` : 'No ratings yet'}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>
            {myRating.total} rides rated
          </span>
        </div>
        {message && <div style={styles.messagebox}>{message}</div>}

        {activeRide && (
          <div style={styles.rideCard}>
            <h3>Active Ride</h3>
            <p>Student: <b>{activeRide.student?.name}</b></p>
            <p>From: <b>{activeRide.pickup}</b></p>
            <p>To: <b>{activeRide.dropoff}</b></p>
            <p>Status: <span style={{ color: statusColor[activeRide.status], fontWeight: 'bold' }}>
              {activeRide.status.toUpperCase()}
            </span></p>
            <div style={styles.btnRow}>
              {activeRide.status === 'accepted' && (
                <button onClick={() => updateStatus('ontheway')} style={styles.button}>
                  Start Ride
                </button>
              )}
              {activeRide.status === 'ontheway' && (
                <button onClick={() => updateStatus('completed')} style={styles.button}>
                  Complete Ride
                </button>
              )}
            </div>
          </div>
        )}

        {!activeRide && (
          <div>
            <div style={styles.header}>
              <h3>Available Rides ({rides.length})</h3>
              <button onClick={fetchAvailableRides} style={styles.refreshBtn}>Refresh</button>
            </div>
            {rides.length === 0 && (
              <div style={styles.empty}>No rides available. Waiting for requests...</div>
            )}
            {rides.map(ride => (
              <div key={ride._id} style={styles.rideCard}>
                <p>Student: <b>{ride.student?.name}</b>
                  {ride.rideType === 'shared' && (
                    <span style={{ color: '#f59e0b', marginLeft: '8px' }}>
                      👥 Shared {ride.sharedWith ? `+ ${ride.sharedWith.name}` : '(waiting for match)'}
                    </span>
                  )}
                </p>
                <p>From: <b>{ride.pickup}</b></p>
                <p>To: <b>{ride.dropoff}</b></p>
                <p>Time: <b>{new Date(ride.createdAt).toLocaleTimeString()}</b></p>
                <button onClick={() => acceptRide(ride._id)} style={styles.button}>
                  Accept Ride
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
  navBtn: { background: 'transparent', color: 'white', border: '1px solid #334155', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginLeft: '8px' },
  content: { maxWidth: '700px', margin: '40px auto', padding: '0 16px' },
  messagebox: { background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #3b82f6' },
  rideCard: { background: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '16px' },
  button: { padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '12px' },
  btnRow: { display: 'flex', gap: '12px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  refreshBtn: { background: '#334155', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  ratingCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1e293b',
    padding: '16px 24px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  empty: { background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8' }
};

export default DriverDashboard;