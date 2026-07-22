import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon
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
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    socket = io('https://traverse-app-production.up.railway.app', {
      transports: ['websocket', 'polling']
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
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  };

  const calculateFareEta = (pickCoords, dropCoords) => {
    const R = 6371;
    const dLat = (dropCoords[0] - pickCoords[0]) * Math.PI / 180;
    const dLon = (dropCoords[1] - pickCoords[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pickCoords[0] * Math.PI / 180) * Math.cos(dropCoords[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const calculatedFare = Math.max(30, Math.round(distance * 10));
    const calculatedEta = Math.max(5, Math.round(distance * 3));
    setFare(calculatedFare);
    setEta(calculatedEta);
  };

  const handlePickupSearch = async () => {
    const coords = await geocode(pickup);
    if (coords) {
      setPickupCoords(coords);
      if (dropoffCoords) calculateFareEta(coords, dropoffCoords);
    } else {
      setMessage('Pickup location not found');
    }
  };

  const handleDropoffSearch = async () => {
    const coords = await geocode(dropoff);
    if (coords) {
      setDropoffCoords(coords);
      if (pickupCoords) calculateFareEta(pickupCoords, coords);
    } else {
      setMessage('Dropoff location not found');
    }
  };

  const bookRide = async (e) => {
    e.preventDefault();
    if (!pickupCoords || !dropoffCoords) {
      setMessage('Please search both locations first');
      return;
    }
    try {
      if (rideType === 'shared') {
        const res = await axios.post(
          'https://traverse-app-production.up.railway.app/api/rides/book-shared',
          { pickup, dropoff, fare },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.ride) {
          setActiveRide(res.data.ride);
        }
        setMessage(res.data.message || 'Looking for someone to share with...');
        if (res.data.matched) {
          setMatchMessage(res.data.message);
        }
      } else {
        const res = await axios.post(
          'https://traverse-app-production.up.railway.app/api/rides/book',
          { pickup, dropoff, fare, scheduledTime: isScheduled ? scheduledTime : null },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActiveRide(res.data);
        setMessage(isScheduled ? `Ride scheduled for ${new Date(scheduledTime).toLocaleString()}` : 'Searching for a driver...');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };
  const cancelRide = async () => {
    try {
      await axios.put(
        `https://traverse-app-production.up.railway.app/api/rides/cancel/${activeRide._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveRide(null);
      setSearching(false);
      setMessage('Ride cancelled');
      setFare(null);
      setEta(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot cancel');
    }
  };

  const fetchSharedRides = async () => {
    try {
      const res = await axios.get(
        'https://traverse-app-production.up.railway.app/api/rides/shared/available',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSharedRides(res.data);
    } catch (err) {
      console.log('Failed to fetch shared rides');
    }
  };
  const rateRide = async (stars) => {
    try {
      await axios.put(
        `https://traverse-app-production.up.railway.app/api/rides/rate/${activeRide._id}`,
        { rating: stars },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(stars);
      setRated(true);
      setMessage('Thanks for rating!');
    } catch (err) {
      setMessage('Rating failed');
    }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const statusColor = {
    searching: '#f59e0b', accepted: '#3b82f6',
    ontheway: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444'
  };

  const mapCenter = pickupCoords || [31.3260, 75.5762];

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

        {message && <div style={styles.messagebox}>{message}</div>}

        {activeRide && (
          <div style={styles.rideCard}>
            <h3>Active Ride</h3>
            <p>From: <b>{activeRide.pickup}</b></p>
            <p>To: <b>{activeRide.dropoff}</b></p>
            <p>Status: <span style={{ color: statusColor[activeRide.status], fontWeight: 'bold' }}>
              {activeRide.status.toUpperCase()}
            </span></p>
            {activeRide.driver && (
              <div>
                <p>Driver: <b>{activeRide.driver.name}</b> | Vehicle: <b>{activeRide.driver.vehicleNumber}</b></p>
                {activeRide.driver.phone && (
                  <p>📞 Contact Driver: <a href={`tel:${activeRide.driver.phone}`} style={{ color: '#3b82f6' }}>{activeRide.driver.phone}</a></p>
                )}
              </div>
            )}
            {driverLocation && (
              <div style={{ marginTop: '16px' }}>
                <p>🚗 Driver Live Location:</p>
                <MapContainer
                  center={driverLocation}
                  zoom={15}
                  style={{ height: '250px', borderRadius: '8px' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={driverLocation}>
                    <Popup>Your Driver is here 🚗</Popup>
                  </Marker>
                  {pickupCoords && (
                    <Marker position={pickupCoords}>
                      <Popup>Your Pickup 📍</Popup>
                    </Marker>
                  )}
                  <FlyTo coords={driverLocation} />
                </MapContainer>
              </div>
            )}
            {fare && <p>Fare: <b>₹{fare}</b></p>}
            {activeRide.status === 'searching' && (
              <button onClick={cancelRide} style={styles.cancelBtn}>Cancel Ride</button>
            )}
            {activeRide.status === 'completed' && !rated && (
              <div style={styles.ratingBox}>
                <p>Rate your ride:</p>
                <div>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      onClick={() => rateRide(star)}
                      style={{ fontSize: '28px', cursor: 'pointer', color: star <= rating ? '#f59e0b' : '#334155' }}
                    >★</span>
                  ))}
                </div>
              </div>
            )}
            {rated && <p style={{ color: '#10b981' }}>✅ Rated {rating} stars!</p>}
          </div>
        )}

        {!activeRide && (
          <div style={styles.bookCard}>
            <h3>Book a Ride</h3>
            <div style={styles.rideTypeRow}>
              <button
                type='button'
                onClick={() => { setRideType('private'); setSharedRides([]); }}
                style={{ ...styles.rideTypeBtn, ...(rideType === 'private' ? styles.activeRideType : {}) }}
              >
                🚗 Private Ride
              </button>
              <button
                type='button'
                onClick={() => { setRideType('shared'); fetchSharedRides(); }}
                style={{ ...styles.rideTypeBtn, ...(rideType === 'shared' ? styles.activeRideType : {}) }}
              >
                👥 Share Ride
              </button>
            </div>

            {rideType === 'shared' && sharedRides.length > 0 && (
              <div style={styles.sharedList}>
                <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Available shared rides:</p>
                {sharedRides.map(ride => (
                  <div key={ride._id} style={styles.sharedCard}>
                    <p>👤 {ride.student?.name} going to <b>{ride.dropoff}</b></p>
                    <p>📍 Pickup: {ride.pickup}</p>
                  </div>
                ))}
              </div>
            )}

            {matchMessage && (
              <div style={{ ...styles.messagebox, borderColor: '#10b981' }}>
                🎉 {matchMessage}
              </div>
            )}
            <div style={styles.mapContainer}>
              <MapContainer center={mapCenter} zoom={13} style={{ height: '300px', borderRadius: '8px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {pickupCoords && (
                  <Marker position={pickupCoords}>
                    <Popup>Pickup: {pickup}</Popup>
                  </Marker>
                )}
                {dropoffCoords && (
                  <Marker position={dropoffCoords}>
                    <Popup>Drop: {dropoff}</Popup>
                  </Marker>
                )}
                {pickupCoords && <FlyTo coords={pickupCoords} />}
                {driverLocation && (
                  <Marker position={driverLocation}>
                    <Popup>Driver is here 🚗</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            <form onSubmit={bookRide}>
              <div style={styles.searchRow}>
                <input
                  style={styles.searchInput}
                  placeholder='Pickup Location'
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  required
                />
                <button type='button' onClick={handlePickupSearch} style={styles.searchBtn}>📍</button>
              </div>
              <div style={styles.searchRow}>
                <input
                  style={styles.searchInput}
                  placeholder='Drop Location'
                  value={dropoff}
                  onChange={e => setDropoff(e.target.value)}
                  required
                />
                <button type='button' onClick={handleDropoffSearch} style={styles.searchBtn}>📍</button>
              </div>

              {fare && eta && (
                <div style={styles.fareBox}>
                  <span>💰 Estimated Fare: <b>₹{fare}</b></span>
                  <span>⏱ ETA: <b>{eta} mins</b></span>
                </div>
              )}

              <button style={styles.button} type='submit'>Request Ride</button>
            </form>
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
  rideCard: { background: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '24px' },
  bookCard: { background: '#1e293b', padding: '24px', borderRadius: '12px' },
  mapContainer: { marginBottom: '16px' },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '14px' },
  searchBtn: { padding: '12px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' },
  fareBox: { display: 'flex', justifyContent: 'space-between', background: '#0f172a', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' },
  button: { width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  cancelBtn: { padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '12px' },
  ratingBox: { marginTop: '16px', padding: '12px', background: '#0f172a', borderRadius: '8px' },
  rideTypeRow: { display: 'flex', gap: '8px', marginBottom: '16px' },
  rideTypeBtn: { flex: 1, padding: '10px', background: '#0f172a', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  activeRideType: { background: '#3b82f6', color: 'white', border: '1px solid #3b82f6' },
  sharedList: { marginBottom: '16px' },
  sharedCard: { background: '#0f172a', padding: '12px', borderRadius: '8px', marginBottom: '8px', fontSize: '14px' },
};

export default StudentDashboard;