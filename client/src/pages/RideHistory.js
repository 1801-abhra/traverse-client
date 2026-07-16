import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/rides/history`,
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
    accepted: '#3b82f6',
    ontheway: '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444'
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🚌 Traverse</h2>
        <button onClick={() => navigate(-1)} style={styles.navBtn}>Back</button>
      </div>

      <div style={styles.content}>
        <h2>Ride History</h2>
        {loading && <p>Loading...</p>}
        {!loading && rides.length === 0 && (
          <div style={styles.empty}>No rides yet.</div>
        )}
        {rides.map(ride => (
          <div key={ride._id} style={styles.rideCard}>
            <div style={styles.cardHeader}>
              <span style={styles.date}>
                {new Date(ride.createdAt).toLocaleDateString()} {new Date(ride.createdAt).toLocaleTimeString()}
              </span>
              <span style={{ color: statusColor[ride.status], fontWeight: 'bold' }}>
                {ride.status.toUpperCase()}
              </span>
            </div>
            <p>From: <b>{ride.pickup}</b></p>
            <p>To: <b>{ride.dropoff}</b></p>
            {ride.driver && <p>Driver: <b>{ride.driver.name}</b> | Vehicle: <b>{ride.driver.vehicleNumber}</b></p>}
            {ride.student && user.role === 'driver' && <p>Student: <b>{ride.student.name}</b></p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', color: 'white' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#1e293b' },
  logo: { margin: 0 },
  navBtn: { background: 'transparent', color: 'white', border: '1px solid #334155', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  content: { maxWidth: '700px', margin: '40px auto', padding: '0 16px' },
  rideCard: { background: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  date: { color: '#94a3b8', fontSize: '14px' },
  empty: { background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8' }
};

export default RideHistory;