import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

let socket;

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15);
  }, [coords, map]);
  return null;
}

function StudentDashboard() {
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [rideType, setRideType] = useState('private');
  const [sharedRides, setSharedRides] = useState([]);
  const [matchMessage, setMatchMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [message, setMessage] = useState('');
  const [fare, setFare] = useState(null);
  const [eta, setEta] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const API = 'https://traverse-app-production.up.railway.app';

  useEffect(() => {
    socket = io(API, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    socket.emit('join', { userId: user._id, role: 'student' });
    socket.on('ride:accepted', (ride) => {
      setActiveRide(ride);
      setMessage(`Driver ${ride.driver.name} accepted! Vehicle: ${ride.driver.vehicleNumber}`);
    });
    socket.on('ride:updated', (ride) => {
      setActiveRide(ride);
      setMessage(`Status: ${ride.status.toUpperCase()}`);
    });
    socket.on('ride:matched', ({ message, ride }) => {
      setMatchMessage(message);
      setActiveRide(ride);
    });
    socket.on('driver:location', ({ lat, lng }) => {
      setDriverLocation([lat, lng]);
    });
    return () => socket.disconnect();
  }, []);

  const geocode = async (address) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    return null;
  };

  const calculateFareEta = (pickCoords, dropCoords) => {
    const R = 6371;
    const dLat = (dropCoords[0] - pickCoords[0]) * Math.PI / 180;
    const dLon = (dropCoords[1] - pickCoords[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pickCoords[0] * Math.PI / 180) * Math.cos(dropCoords[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setFare(Math.max(30, Math.round(distance * 10)));
    setEta(Math.max(5, Math.round(distance * 3)));
  };

  const handlePickupSearch = async () => {
    const coords = await geocode(pickup);
    if (coords) { setPickupCoords(coords); if (dropoffCoords) calculateFareEta(coords, dropoffCoords); }
    else setMessage('Pickup location not found');
  };

  const handleDropoffSearch = async () => {
    const coords = await geocode(dropoff);
    if (coords) { setDropoffCoords(coords); if (pickupCoords) calculateFareEta(pickupCoords, coords); }
    else setMessage('Dropoff location not found');
  };

  const bookRide = async (e) => {
    e.preventDefault();
    if (!pickupCoords || !dropoffCoords) { setMessage('Please search both locations first'); return; }
    try {
      if (rideType === 'shared') {
        const res = await axios.post(`${API}/api/rides/book-shared`, { pickup, dropoff, fare }, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.ride) setActiveRide(res.data.ride);
        setMessage(res.data.message || 'Looking for someone to share with...');
        if (res.data.matched) setMatchMessage(res.data.message);
      } else {
        const res = await axios.post(`${API}/api/rides/book`,
          { pickup, dropoff, fare, scheduledTime: isScheduled ? scheduledTime : null },
          { headers: { Authorization: `Bearer ${token}` } });
        setActiveRide(res.data);
        setMessage(isScheduled ? `Ride scheduled for ${new Date(scheduledTime).toLocaleString()}` : 'Searching for a driver...');
      }
    } catch (err) { setMessage(err.response?.data?.message || 'Booking failed'); }
  };

  const cancelRide = async () => {
    try {
      await axios.put(`${API}/api/rides/cancel/${activeRide._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setActiveRide(null);
      setMessage('Ride cancelled');
      setFare(null);
      setEta(null);
    } catch (err) { setMessage(err.response?.data?.message || 'Cannot cancel'); }
  };

  const fetchSharedRides = async () => {
    try {
      const res = await axios.get(`${API}/api/rides/shared/available`, { headers: { Authorization: `Bearer ${token}` } });
      setSharedRides(res.data);
    } catch (err) { console.log('Failed to fetch shared rides'); }
  };

  const rateRide = async (stars) => {
    try {
      await axios.put(`${API}/api/rides/rate/${activeRide._id}`, { rating: stars }, { headers: { Authorization: `Bearer ${token}` } });
      setRating(stars);
      setRated(true);
      setMessage('Thanks for rating!');
    } catch (err) { setMessage('Rating failed'); }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const statusColor = {
    searching: '#f59e0b', accepted: '#e63946',
    ontheway: '#e63946', completed: '#10b981', cancelled: '#666'
  };

  const statusLabel = {
    searching: 'Searching for driver...',
    accepted: 'Driver Accepted ✓',
    ontheway: 'Driver On The Way 🚗',
    completed: 'Ride Completed ✓',
    cancelled: 'Cancelled'
  };

  const mapCenter = pickupCoords || [31.3260, 75.5762];

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🚖</span>
          <span style={styles.navTitle}>TRAVERSE</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {user.name}</span>
          <button onClick={() => navigate('/history')} style={styles.navBtn}>History</button>
          <button onClick={logout} style={styles.navBtnRed}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>

        {/* Message */}
        {message && (
          <div style={styles.messagebox}>
            <span style={styles.messageIcon}>ℹ️</span> {message}
          </div>
        )}

        {/* Active Ride Card */}
        {activeRide && (
          <div style={styles.rideCard}>
            <div style={styles.rideCardHeader}>
              <h3 style={styles.rideCardTitle}>Active Ride</h3>
              <span style={{ ...styles.statusBadge, background: statusColor[activeRide.status] + '22', color: statusColor[activeRide.status], border: `1px solid ${statusColor[activeRide.status]}` }}>
                {statusLabel[activeRide.status]}
              </span>
            </div>

            <div style={styles.routeInfo}>
              <div style={styles.routePoint}>
                <span style={styles.routeDot}>🟢</span>
                <span>{activeRide.pickup}</span>
              </div>
              <div style={styles.routeLine}>|</div>
              <div style={styles.routePoint}>
                <span style={styles.routeDot}>🔴</span>
                <span>{activeRide.dropoff}</span>
              </div>
            </div>

            {activeRide.driver && (
              <div style={styles.driverCard}>
                <div style={styles.driverInfo}>
                  <div style={styles.driverAvatar}>🧑</div>
                  <div>
                    <p style={styles.driverName}>{activeRide.driver?.name}</p>
                    <p style={styles.driverDetails}>{activeRide.driver?.vehicleNumber} {activeRide.driver?.carName && `• ${activeRide.driver.carName} ${activeRide.driver.carModel}`}</p>
                  </div>
                </div>
                {activeRide.driver?.phone && (
                  <a href={`tel:${activeRide.driver.phone}`} style={styles.callBtn}>
                    📞 Call Driver
                  </a>
                )}
              </div>
            )}

            {driverLocation && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '8px' }}>🚗 Driver Live Location</p>
                <MapContainer center={driverLocation} zoom={15} style={{ height: '220px', borderRadius: '12px' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={driverLocation}><Popup>Your Driver 🚗</Popup></Marker>
                  {pickupCoords && <Marker position={pickupCoords}><Popup>Your Pickup 📍</Popup></Marker>}
                  <FlyTo coords={driverLocation} />
                </MapContainer>
              </div>
            )}

            {fare && (
              <div style={styles.fareInfo}>
                <span>💰 Fare: <b>₹{fare}</b></span>
              </div>
            )}

            {activeRide.status === 'searching' && (
              <button onClick={cancelRide} style={styles.cancelBtn}>Cancel Ride</button>
            )}

            {activeRide.status === 'completed' && !rated && (
              <div style={styles.ratingBox}>
                <p style={{ color: '#999', marginBottom: '8px' }}>Rate your experience</p>
                <div>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} onClick={() => rateRide(star)}
                      style={{ fontSize: '32px', cursor: 'pointer', color: star <= rating ? '#e63946' : '#333' }}>★</span>
                  ))}
                </div>
              </div>
            )}
            {rated && <p style={{ color: '#10b981', marginTop: '8px' }}>✅ Rated {rating} stars!</p>}
          </div>
        )}

        {/* Book Ride */}
        {!activeRide && (
          <div style={styles.bookCard}>
            <h3 style={styles.bookTitle}>Book a Ride</h3>

            {/* Ride Type */}
            <div style={styles.rideTypeRow}>
              <button type='button'
                onClick={() => { setRideType('private'); setSharedRides([]); }}
                style={rideType === 'private' ? styles.rideTypeActive : styles.rideTypeInactive}>
                🚗 Private Ride
              </button>
              <button type='button'
                onClick={() => { setRideType('shared'); fetchSharedRides(); }}
                style={rideType === 'shared' ? styles.rideTypeActive : styles.rideTypeInactive}>
                👥 Share Ride
              </button>
            </div>

            {rideType === 'shared' && sharedRides.length > 0 && (
              <div style={styles.sharedList}>
                <p style={{ color: '#999', marginBottom: '8px', fontSize: '14px' }}>Available shared rides:</p>
                {sharedRides.map(ride => (
                  <div key={ride._id} style={styles.sharedCard}>
                    <p>👤 {ride.student?.name} → <b>{ride.dropoff}</b></p>
                    <p style={{ color: '#999', fontSize: '13px' }}>📍 From: {ride.pickup}</p>
                  </div>
                ))}
              </div>
            )}

            {matchMessage && (
              <div style={{ ...styles.messagebox, borderColor: '#10b981' }}>🎉 {matchMessage}</div>
            )}

            {/* Map */}
            <div style={styles.mapContainer}>
              <MapContainer center={mapCenter} zoom={13} style={{ height: '280px', borderRadius: '12px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {pickupCoords && <Marker position={pickupCoords}><Popup>Pickup: {pickup}</Popup></Marker>}
                {dropoffCoords && <Marker position={dropoffCoords}><Popup>Drop: {dropoff}</Popup></Marker>}
                {pickupCoords && <FlyTo coords={pickupCoords} />}
                {driverLocation && <Marker position={driverLocation}><Popup>Driver 🚗</Popup></Marker>}
              </MapContainer>
            </div>

            <form onSubmit={bookRide}>
              <div style={styles.searchRow}>
                <input style={styles.searchInput} placeholder='📍 Pickup Location' value={pickup}
                  onChange={e => setPickup(e.target.value)} required />
                <button type='button' onClick={handlePickupSearch} style={styles.searchBtn}>Search</button>
              </div>
              <div style={styles.searchRow}>
                <input style={styles.searchInput} placeholder='📍 Drop Location' value={dropoff}
                  onChange={e => setDropoff(e.target.value)} required />
                <button type='button' onClick={handleDropoffSearch} style={styles.searchBtn}>Search</button>
              </div>

              {fare && eta && (
                <div style={styles.fareBox}>
                  <div style={styles.fareItem}>
                    <span style={styles.fareLabel}>Estimated Fare</span>
                    <span style={styles.fareValue}>₹{fare}</span>
                  </div>
                  <div style={styles.fareDivider} />
                  <div style={styles.fareItem}>
                    <span style={styles.fareLabel}>ETA</span>
                    <span style={styles.fareValue}>{eta} mins</span>
                  </div>
                </div>
              )}

              <div style={styles.scheduleRow}>
                <label style={styles.scheduleLabel}>
                  <input type='checkbox' checked={isScheduled}
                    onChange={e => setIsScheduled(e.target.checked)}
                    style={{ marginRight: '8px', accentColor: '#e63946' }} />
                  🕐 Schedule for Later
                </label>
              </div>

              {isScheduled && (
                <input type='datetime-local' style={styles.dateInput}
                  value={scheduledTime} onChange={e => setScheduledTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)} required={isScheduled} />
              )}

              <button style={styles.bookBtn} type='submit'>
                {rideType === 'shared' ? '👥 Find Shared Ride' : '🚖 Request Ride'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'Inter, sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#111', borderBottom: '1px solid #1a1a1a' },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: { fontSize: '24px' },
  navTitle: { fontSize: '20px', fontWeight: '800', letterSpacing: '3px', color: '#e63946' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  navUser: { color: '#666', fontSize: '14px' },
  navBtn: { background: 'transparent', color: '#999', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  navBtnRed: { background: 'transparent', color: '#e63946', border: '1px solid #e63946', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  content: { maxWidth: '720px', margin: '32px auto', padding: '0 16px' },
  messagebox: { background: '#111', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', borderLeft: '3px solid #e63946', fontSize: '14px', color: '#ccc' },
  messageIcon: { marginRight: '8px' },
  rideCard: { background: '#111', border: '1px solid #1a1a1a', padding: '24px', borderRadius: '16px', marginBottom: '24px' },
  rideCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  rideCardTitle: { fontSize: '18px', fontWeight: '700', margin: 0 },
  statusBadge: { padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  routeInfo: { background: '#0a0a0a', padding: '16px', borderRadius: '10px', marginBottom: '16px' },
  routePoint: { display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' },
  routeDot: { fontSize: '12px' },
  routeLine: { color: '#333', paddingLeft: '6px', fontSize: '18px' },
  driverCard: { background: '#0a0a0a', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  driverInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  driverAvatar: { width: '44px', height: '44px', background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  driverName: { fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' },
  driverDetails: { color: '#666', fontSize: '13px', margin: 0 },
  callBtn: { background: '#e63946', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
  fareInfo: { background: '#0a0a0a', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', color: '#e63946', border: '1px solid #e63946', borderRadius: '8px', cursor: 'pointer', marginTop: '12px', fontSize: '14px' },
  ratingBox: { marginTop: '16px', padding: '16px', background: '#0a0a0a', borderRadius: '10px' },
  bookCard: { background: '#111', border: '1px solid #1a1a1a', padding: '24px', borderRadius: '16px' },
  bookTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '20px', marginTop: 0 },
  rideTypeRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  rideTypeActive: { flex: 1, padding: '12px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  rideTypeInactive: { flex: 1, padding: '12px', background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  sharedList: { marginBottom: '16px' },
  sharedCard: { background: '#1a1a1a', padding: '12px', borderRadius: '8px', marginBottom: '8px', fontSize: '14px' },
  mapContainer: { marginBottom: '16px', borderRadius: '12px', overflow: 'hidden' },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  searchInput: { flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #2a2a2a', background: '#1a1a1a', color: 'white', fontSize: '14px', outline: 'none' },
  searchBtn: { padding: '12px 16px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' },
  fareBox: { background: '#1a1a1a', padding: '16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' },
  fareItem: { textAlign: 'center' },
  fareLabel: { display: 'block', color: '#666', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' },
  fareValue: { fontSize: '22px', fontWeight: '700', color: '#e63946' },
  fareDivider: { width: '1px', height: '40px', background: '#2a2a2a' },
  scheduleRow: { marginBottom: '12px' },
  scheduleLabel: { color: '#999', fontSize: '14px', cursor: 'pointer' },
  dateInput: { width: '100%', padding: '12px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' },
  bookBtn: { width: '100%', padding: '14px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' },
};

export default StudentDashboard;