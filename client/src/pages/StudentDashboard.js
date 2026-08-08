import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { requestNotificationPermission } from '../firebase';
import Spinner from '../components/Spinner';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getNightSurgeFare = (baseFare, scheduledTime = null) => {
  const checkTime = scheduledTime ? new Date(scheduledTime) : new Date();
  const hour = checkTime.getHours();
  const isNightTime = hour >= 21 || hour < 7;
  return isNightTime ? Math.round(baseFare * 1.5) : baseFare;
};

const ROUTES = [
  {
    destination: 'Waknaghat',
    fare4: getNightSurgeFare(200),
    fare6: getNightSurgeFare(300),
    disc4: null,
    disc6: null,
    coords: [30.8826, 77.1490]
  },
  { destination: 'Shoghi', fare4: 600, fare6: 800, disc4: null, disc6: null, coords: [31.0167, 77.1833] },
  { destination: 'Shimla', fare4: 1200, fare6: 1400, disc4: 1080, disc6: 1260, coords: [31.1048, 77.1734] },
  { destination: 'Kandaghat', fare4: 600, fare6: 800, disc4: null, disc6: null, coords: [30.9833, 77.1167] },
  { destination: 'Solan', fare4: 1200, fare6: 1400, disc4: 1080, disc6: 1260, coords: [30.9045, 77.0967] },
  { destination: 'Heritage Park Solan', fare4: 1500, fare6: 1800, disc4: 1350, disc6: 1620, coords: [30.9045, 77.0967] },
  { destination: 'Chail', fare4: 2000, fare6: 2500, disc4: 1800, disc6: 2250, coords: [30.9667, 77.2000] },
  { destination: 'Sadhupul', fare4: 1400, fare6: 1800, disc4: 1260, disc6: 1620, coords: [30.9500, 77.1667] },
  { destination: 'Kufri', fare4: 2000, fare6: 2500, disc4: 1800, disc6: 2250, coords: [31.0833, 77.2667] },
  { destination: 'Mashobra', fare4: 2000, fare6: 2500, disc4: 1800, disc6: 2250, coords: [31.1333, 77.2167] },
  { destination: 'Tatapani', fare4: 3500, fare6: 4500, disc4: 3150, disc6: 4050, coords: [31.2833, 77.2000] },
  { destination: 'Narkanda', fare4: 3500, fare6: 4500, disc4: 3150, disc6: 4050, coords: [31.4167, 77.4500] },
];

const JUIT_COORDS = [30.8826, 77.1490];

let socket;

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15);
  }, [coords, map]);
  return null;
}

function StudentDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(JUIT_COORDS);
  const [destCoords, setDestCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [rideType, setRideType] = useState('private');
  const [sharedRides, setSharedRides] = useState([]);
  const [matchMessage, setMatchMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [message, setMessage] = useState('');
  const [fare, setFare] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const API = 'https://traverse-app.onrender.com';

  useEffect(() => {
    fetchActiveRide();
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchActiveRide();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (activeRide?.status !== 'completed') {
      setRated(false);
      setRating(0);
    }
  }, [activeRide]);

  useEffect(() => {
    if (socket) socket.disconnect();
    socket = io(API, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    socket.emit('join', { userId: user._id, role: 'student' });
    requestNotificationPermission().then(fcmToken => {
      if (fcmToken) {
        axios.post(
          `${API}/api/auth/save-token`,
          { fcmToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    });
    socket.on('ride:accepted', (ride) => {
      setActiveRide(ride);
      setDriverLocation(null);
    });
    socket.on('ride:updated', (ride) => {
      setActiveRide(prev => ({ ...prev, ...ride }));
      setMessage(`Status: ${ride.status.toUpperCase()}`);
      if (ride.status === 'completed' || ride.status === 'cancelled') {
        setDriverLocation(null);
        fetchActiveRide();
      }
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
  useEffect(() => {
    if (selectedRoute?.destination === 'Waknaghat' && selectedVehicle) {
      const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
      const hour = checkTime.getHours();
      const isNight = hour >= 21 || hour < 7;
      if (selectedVehicle === '4+1') {
        setFare(isNight ? 300 : 200);
      } else {
        setFare(isNight ? 450 : 300);
      }
    }
  }, [scheduledTime, isScheduled, selectedRoute, selectedVehicle]);
  const bookRide = async (e) => {
    e.preventDefault();
    if (!selectedRoute || !selectedVehicle) {
      setMessage('Please select destination and vehicle type');
      return;
    }

    // Calculate surge fare for Waknaghat based on scheduled time
    let finalFare = fare;
    if (selectedRoute.destination === 'Waknaghat') {
      const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
      const hour = checkTime.getHours();
      const isNight = hour >= 21 || hour < 7;
      if (selectedVehicle === '4+1') {
        finalFare = isNight ? 300 : 200;
      } else {
        finalFare = isNight ? 450 : 300;
      }
    }

    try {
      const pickup = 'JUIT Campus, Waknaghat';
      const dropoff = selectedRoute.destination;
      if (rideType === 'shared') {
        const res = await axios.post(
          `${API}/api/rides/book-shared`,
          { pickup, dropoff, fare: finalFare, vehicleType: selectedVehicle },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.ride) setActiveRide(res.data.ride);
        setMessage(res.data.message || 'Looking for someone to share with...');
        if (res.data.matched) setMatchMessage(res.data.message);
      } else {
        const res = await axios.post(
          `${API}/api/rides/book`,
          { pickup, dropoff, fare: finalFare, vehicleType: selectedVehicle, scheduledTime: isScheduled ? new Date(scheduledTime).toISOString() : null },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActiveRide(res.data);
        setMessage(isScheduled ? `Ride scheduled for ${new Date(scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}` : 'Searching for a driver...');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };
  const cancelRide = async () => {
    try {
      await axios.put(`${API}/api/rides/cancel/${activeRide._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setActiveRide(null);
      setMessage('Ride cancelled');
      setFare(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot cancel');
    }
  };

  const fetchSharedRides = async () => {
    try {
      const res = await axios.get(`${API}/api/rides/shared/available`, { headers: { Authorization: `Bearer ${token}` } });
      setSharedRides(res.data);
    } catch (err) {
      console.log('Failed to fetch shared rides');
    }
  };

  const fetchActiveRide = async () => {
    try {
      const res = await axios.get(
        `${API}/api/rides/active`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        setActiveRide(res.data);
        setFare(res.data.fare);
        setRated(false);
        setRating(0);
      }
    } catch (err) {
      console.log('No active ride');
    } finally {
      setPageLoading(false);
    }
  };
  const joinSharedRide = async (rideId) => {
    try {
      const res = await axios.put(
        `${API}/api/rides/join-shared/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatchMessage(res.data.message);
      setActiveRide(res.data.ride);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to join ride');
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const rateRide = async (stars) => {
    try {
      await axios.put(`${API}/api/rides/rate/${activeRide._id}`, { rating: stars }, { headers: { Authorization: `Bearer ${token}` } });
      setRating(stars);
      setRated(true);
      setMessage('Thanks for rating!');
    } catch (err) {
      setMessage('Rating failed');
    }
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
  const getWaknaFare = (base4, base6, vehicleType) => {
    const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
    const hour = checkTime.getHours();
    const isNight = hour >= 21 || hour < 7;
    if (vehicleType === '4+1') return isNight ? 300 : 200;
    return isNight ? 450 : 300;
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
        <Spinner text='Loading your dashboard...' />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🚖</span>
          <span style={styles.navTitle}>TRAVERSE</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {user.name}</span>
          <button onClick={fetchActiveRide} style={styles.navBtn}>🔄</button>
          <button onClick={() => navigate('/history')} style={styles.navBtn}>History</button>
          <button onClick={logout} style={styles.navBtnRed}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {message && (
          <div style={styles.messagebox}>
            <span style={styles.messageIcon}>ℹ️</span> {message}
          </div>
        )}

        {activeRide && (
          <div style={styles.rideCard}>
            <div style={styles.rideCardHeader}>
              <h3 style={styles.rideCardTitle}>Active Ride</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={fetchActiveRide} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '18px' }}>🔄</button>
                <span style={{ ...styles.statusBadge, background: statusColor[activeRide.status] + '22', color: statusColor[activeRide.status], border: `1px solid ${statusColor[activeRide.status]}` }}>
                  {statusLabel[activeRide.status]}
                </span>
              </div>
            </div>

            <div style={styles.routeInfo}>
              <div style={styles.routePoint}>
                <span>🟢</span>
                <span>{activeRide.pickup}</span>
              </div>
              <div style={styles.routeLine}>|</div>
              <div style={styles.routePoint}>
                <span>🔴</span>
                <span>{activeRide.dropoff}</span>
              </div>
            </div>

            {activeRide.driver && (
              <div style={styles.driverCard}>
                <div style={styles.driverInfo}>
                  <div style={styles.driverAvatar}>🧑</div>
                  <div>
                    <p style={styles.driverName}>{activeRide.driver?.name}</p>
                    <p style={styles.driverDetails}>
                      {activeRide.driver?.vehicleNumber}
                      {activeRide.driver?.carName && ` • ${activeRide.driver.carName} ${activeRide.driver.carModel}`}
                      {activeRide.vehicleType && ` • ${activeRide.vehicleType}`}
                    </p>
                  </div>
                </div>
                {activeRide.driver?.phone && (
                  <a href={`tel:${activeRide.driver.phone}`} style={styles.callBtn}>📞 Call Driver</a>
                )}
              </div>
            )}

            {activeRide.status !== 'searching' && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '8px' }}>
                  🚗 Driver Live Location {!driverLocation && <span style={{ color: '#f59e0b' }}>— Waiting for GPS...</span>}
                </p>
                {driverLocation && (
                  <MapContainer center={driverLocation} zoom={15} style={{ height: '220px', borderRadius: '12px' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={driverLocation}><Popup>Your Driver 🚗</Popup></Marker>
                    <FlyTo coords={driverLocation} />
                  </MapContainer>
                )}
              </div>
            )}

            {activeRide.fare > 0 && (
              <div style={styles.fareInfo}>
                <span>💰 Fare: <b>₹{activeRide.fare}</b></span>
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
                <button onClick={() => setActiveRide(null)}
                  style={{ ...styles.cancelBtn, marginTop: '12px', color: '#666', borderColor: '#333', fontSize: '13px' }}>
                  Skip Rating
                </button>
              </div>
            )}
            {rated && (
              <div>
                <p style={{ color: '#10b981', marginTop: '8px' }}>✅ Rated {rating} stars!</p>
                <button onClick={() => setActiveRide(null)}
                  style={{ ...styles.cancelBtn, marginTop: '12px', color: '#10b981', borderColor: '#10b981' }}>
                  Done ✓
                </button>
              </div>
            )}
          </div>
        )}

        {!activeRide && (
          <div style={styles.bookCard}>
            <h3 style={styles.bookTitle}>Book a Ride</h3>

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
                <p style={{ color: '#999', marginBottom: '8px', fontSize: '14px' }}>
                  👥 People going your way — choose to join:
                </p>
                {sharedRides.map(ride => (
                  <div key={ride._id} style={styles.sharedCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0' }}>👤 <b>{ride.student?.name}</b> → <b>{ride.dropoff}</b></p>
                        <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>🚗 {ride.vehicleType} • ₹{Math.ceil(ride.fare / 2)} each</p>
                      </div>
                      <button
                        type='button'
                        onClick={() => joinSharedRide(ride._id)}
                        style={styles.joinBtn}
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {matchMessage && (
              <div style={{ ...styles.messagebox, borderColor: '#10b981' }}>🎉 {matchMessage}</div>
            )}

            <form onSubmit={bookRide}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pickup Location</label>
                <div style={styles.fixedLocation}>📍 JUIT Campus, Waknaghat</div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Destination</label>
                <select
                  style={styles.select}
                  value={selectedRoute ? selectedRoute.destination : ''}
                  onChange={e => {
                    const route = ROUTES.find(r => r.destination === e.target.value);
                    setSelectedRoute(route || null);
                    setSelectedVehicle(null);
                    setFare(null);
                    if (route) {
                      setDestCoords(route.coords);
                      setMapCenter(route.coords);
                      setDistance(calculateDistance(JUIT_COORDS, route.coords));
                    } else {
                      setDestCoords(null);
                      setDistance(null);
                    }
                  }}
                  required
                >
                  <option value=''>Choose destination...</option>
                  {ROUTES.map(route => (
                    <option key={route.destination} value={route.destination}>
                      {route.destination}
                    </option>
                  ))}
                </select>
              </div>
              {destCoords && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Route Preview
                    {distance && <span style={{ color: '#e63946', marginLeft: '8px' }}>~{distance} km</span>}
                  </label>
                  <MapContainer
                    center={mapCenter}
                    zoom={11}
                    style={{ height: '220px', borderRadius: '12px' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={JUIT_COORDS}>
                      <Popup>📍 JUIT Campus (Pickup)</Popup>
                    </Marker>
                    <Marker position={destCoords}>
                      <Popup>🏁 {selectedRoute?.destination} (Drop)</Popup>
                    </Marker>
                    <FlyTo coords={destCoords} />
                  </MapContainer>
                </div>
              )}
              {selectedRoute && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Select Vehicle Type</label>
                  <div style={styles.vehicleCards}>
                    <div
                      onClick={() => { setSelectedVehicle('4+1'); setFare(selectedRoute.disc4 || selectedRoute.fare4); }}
                      style={{ ...styles.vehicleCard, ...(selectedVehicle === '4+1' ? styles.vehicleCardActive : {}) }}
                    >
                      <div style={styles.vehicleIcon}>
                        <svg width="72" height="40" viewBox="0 0 72 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12,28 L12,32 Q12,34 14,34 L18,34 Q20,34 20,32 L20,28 Z" fill="#333" />
                          <circle cx="16" cy="32" r="5" fill="#222" stroke="#555" stroke-width="1.5" />
                          <circle cx="16" cy="32" r="2.5" fill="#444" />
                          <path d="M52,28 L52,32 Q52,34 54,34 L58,34 Q60,34 60,32 L60,28 Z" fill="#333" />
                          <circle cx="56" cy="32" r="5" fill="#222" stroke="#555" stroke-width="1.5" />
                          <circle cx="56" cy="32" r="2.5" fill="#444" />
                          <path d="M8,28 L10,18 Q11,16 13,16 L20,16 L26,10 Q28,8 31,8 L42,8 Q45,8 47,10 L54,16 L62,16 Q64,16 65,18 L66,22 L66,28 Q66,30 64,30 L8,30 Q6,30 6,28 Z" fill="#e63946" />
                          <path d="M26,10 L22,16 L50,16 L46,10 Z" fill="#c0102020" />
                          <path d="M26,10 Q28,8 31,8 L42,8 Q45,8 47,10 L50,16 L22,16 Z" fill="#cc2233" />
                          <rect x="23" y="10" width="10" height="6" rx="1" fill="#1a2a3a" opacity="0.7" />
                          <rect x="35" y="10" width="13" height="6" rx="1" fill="#1a2a3a" opacity="0.7" />
                          <path d="M10,20 L14,16 L22,16 L20,20 Z" fill="#1a2a3a" opacity="0.6" />
                          <path d="M62,20 L60,16 L52,16 L54,20 Z" fill="#1a2a3a" opacity="0.6" />
                          <rect x="6" y="24" width="60" height="4" rx="1" fill="#cc2233" />
                          <rect x="64" y="20" width="3" height="3" rx="1" fill="#ffdd88" opacity="0.9" />
                          <rect x="5" y="20" width="3" height="3" rx="1" fill="#ff4444" opacity="0.7" />
                          <path d="M8,28 L64,28" stroke="#aa1122" stroke-width="0.5" />
                        </svg>
                      </div>
                      <div style={styles.vehicleInfo}>
                        <p style={styles.vehicleTypeTxt}>4+1 Sedan</p>
                        <p style={styles.vehicleSeats}>Up to 4 passengers</p>
                      </div>
                      <div style={styles.vehicleFare}>
                        {selectedRoute.destination === 'Waknaghat' ? (
                          <span style={styles.discountedFare}>
                            ₹{(() => {
                              const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
                              const hour = checkTime.getHours();
                              return (hour >= 21 || hour < 7) ? 300 : 200;
                            })()}
                          </span>
                        ) : selectedRoute.disc4 ? (
                          <>
                            <span style={styles.originalFare}>₹{selectedRoute.fare4}</span>
                            <span style={styles.discountedFare}>₹{selectedRoute.disc4}</span>
                            <span style={styles.discountBadge}>10% OFF</span>
                          </>
                        ) : (
                          <span style={styles.discountedFare}>₹{selectedRoute.fare4}</span>
                        )}
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedVehicle('6+1');
                        if (selectedRoute.destination === 'Waknaghat') {
                          const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
                          const hour = checkTime.getHours();
                          setFare((hour >= 21 || hour < 7) ? 450 : 300);
                        } else {
                          setFare(selectedRoute.disc6 || selectedRoute.fare6);
                        }
                      }}
                      style={{ ...styles.vehicleCard, ...(selectedVehicle === '6+1' ? styles.vehicleCardActive : {}) }}
                    >
                      <div style={styles.vehicleIcon}>🚐</div>
                      <div style={styles.vehicleInfo}>
                        <p style={styles.vehicleTypeTxt}>6+1 SUV</p>
                        <p style={styles.vehicleSeats}>Up to 6 passengers</p>
                      </div>
                      <div style={styles.vehicleFare}>
                        {selectedRoute.destination === 'Waknaghat' ? (
                          <span style={styles.discountedFare}>
                            ₹{(() => {
                              const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
                              const hour = checkTime.getHours();
                              return (hour >= 21 || hour < 7) ? 450 : 300;
                            })()}
                          </span>
                        ) : selectedRoute.disc6 ? (
                          <>
                            <span style={styles.originalFare}>₹{selectedRoute.fare6}</span>
                            <span style={styles.discountedFare}>₹{selectedRoute.disc6}</span>
                            <span style={styles.discountBadge}>10% OFF</span>
                          </>
                        ) : (
                          <span style={styles.discountedFare}>₹{selectedRoute.fare6}</span>
                        )}
                      </div>
                    </div>
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
                  min={new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16)}
                  required={isScheduled} />
              )}

              <button
                style={selectedVehicle ? styles.bookBtn : styles.bookBtnDisabled}
                type='submit'
                disabled={!selectedVehicle}
              >
                {selectedVehicle ? `🚖 Request ${selectedVehicle} Ride — ₹${fare}` : 'Select vehicle to continue'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div >
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
  messagebox: { background: '#111', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', borderLeft: '3px solid #e63946', fontSize: '14px', color: '#ccc' },
  messageIcon: { marginRight: '8px' },
  rideCard: {
    background: '#111',
    border: '1px solid #1a1a1a',
    padding: window.innerWidth <= 768 ? '16px' : '24px',
    borderRadius: '16px',
    marginBottom: '24px'
  },
  rideCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  rideCardTitle: { fontSize: '18px', fontWeight: '700', margin: 0 },
  statusBadge: { padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  routeInfo: { background: '#0a0a0a', padding: '16px', borderRadius: '10px', marginBottom: '16px' },
  routePoint: { display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' },
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
  bookCard: {
    background: '#111',
    border: '1px solid #1a1a1a',
    padding: window.innerWidth <= 768 ? '16px' : '24px',
    borderRadius: '16px'
  },
  bookTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '20px', marginTop: 0 },
  rideTypeRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  rideTypeActive: { flex: 1, padding: '12px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  rideTypeInactive: { flex: 1, padding: '12px', background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  sharedList: { marginBottom: '16px' },
  sharedCard: { background: '#1a1a1a', padding: '12px', borderRadius: '8px', marginBottom: '8px', fontSize: '14px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', color: '#999', fontSize: '12px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
  fixedLocation: { background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '14px 16px', borderRadius: '10px', color: '#666', fontSize: '14px' },
  select: { width: '100%', padding: '14px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: 'white', fontSize: '15px', outline: 'none', cursor: 'pointer' },
  vehicleCards: { display: 'flex', flexDirection: 'column', gap: '12px' },
  vehicleCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' },
  vehicleCardActive: { border: '2px solid #e63946', background: '#2a0000' },
  vehicleIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px'
  },
  vehicleInfo: { flex: 1 },
  vehicleTypeTxt: { fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' },
  vehicleSeats: { color: '#666', fontSize: '13px', margin: 0 },
  vehicleFare: { textAlign: 'right' },
  originalFare: { display: 'block', color: '#666', fontSize: '13px', textDecoration: 'line-through' },
  discountedFare: { display: 'block', color: '#e63946', fontSize: '20px', fontWeight: '700' },
  discountBadge: { display: 'inline-block', background: '#e6394622', color: '#e63946', border: '1px solid #e63946', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', marginTop: '4px' },
  scheduleRow: { marginBottom: '12px' },
  scheduleLabel: { color: '#999', fontSize: '14px', cursor: 'pointer' },
  joinBtn: { padding: '8px 16px', background: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' },
  dateInput: { width: '100%', padding: '12px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' },
  bookBtn: { width: '100%', padding: '14px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' },
  bookBtnDisabled: { width: '100%', padding: '14px', background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a', borderRadius: '10px', fontSize: '16px', cursor: 'not-allowed' },
};

export default StudentDashboard;