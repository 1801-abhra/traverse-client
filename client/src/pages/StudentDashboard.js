import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { requestNotificationPermission } from '../firebase';
import Spinner from '../components/Spinner';
import AboutModal from '../components/AboutModal';
import Toast from '../components/Toast';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';

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
  { destination: 'JUIT Campus, Waknaghat', fare4: getNightSurgeFare(200), fare6: getNightSurgeFare(300), disc4: null, disc6: null, coords: [30.8826, 77.1490] },
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
  const [sharedPassengers, setSharedPassengers] = useState([]);
  const [fullRouteCoords, setFullRouteCoords] = useState([]);
  const [studentLocation, setStudentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [driverDistance, setDriverDistance] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState('JUIT Campus, Waknaghat');
  const [toast, setToast] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [driversAvailable, setDriversAvailable] = useState(true);
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
  const showToast = React.useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    fetchActiveRide();
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchActiveRide();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (activeRide && activeRide.status === 'ontheway') {
      navigator.geolocation.getCurrentPosition((pos) => {
        setStudentLocation([pos.coords.latitude, pos.coords.longitude]);
      });
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
      showToast(`🚗 ${ride.driver.name} accepted your ride!`, 'accepted');
      // Get full route from pickup to destination
      getFullRoute(ride.pickup, ride.dropoff);
    });
    socket.on('ride:shared-cancelled', ({ message }) => {
      fetchActiveRide();
      showToast(message, 'warning');
      setMessage(message);
    });
    socket.on('ride:updated', (ride) => {
      if (ride.status === 'cancelled') {
        setActiveRide(null);
        setMessage('Ride cancelled.');
        return;
      }
      setActiveRide(ride);
      setMessage(`Status: ${ride.status.toUpperCase()}`);
      if (ride.status === 'ontheway') {
        showToast('🚗 Driver is on the way!', 'info');
      }
      if (ride.status === 'completed') {
        showToast('✅ Ride completed! Please rate your experience.', 'success');
        setDriverLocation(null);
      }
    });
    socket.on('ride:matched', ({ message, ride }) => {
      setMatchMessage(message);
      setActiveRide(ride);
      showToast(message, 'match');
    });
    socket.on('driver:location', ({ lat, lng }) => {
      setDriverLocation([lat, lng]);
      if (studentLocation) {
        getRoute([lat, lng], studentLocation);
      }
    });
    socket.on('ride:passenger-joined', ({ message, ride }) => {
      setActiveRide(ride);
      setMessage(message);
      showToast(message, 'match');
    });

    socket.on('ride:passenger-left', ({ message, ride }) => {
      setActiveRide(ride);
      setMessage(message);
      showToast(message, 'warning');
    });
    socket.on('ride:cancelled-by-party', ({ message }) => {
      setActiveRide(null);
      setMessage(message);
      setShowCancelPopup(false);
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
      const pickup = selectedPickup;
      const dropoff = selectedRoute.destination;
      if (rideType === 'shared') {
        const res = await axios.post(
          `${API}/api/rides/book-shared`,
          { pickup, dropoff, fare: finalFare, vehicleType: selectedVehicle, scheduledTime: isScheduled ? new Date(scheduledTime).toISOString() : null },
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

  const getRoute = async (from, to) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
        const distanceKm = (data.routes[0].distance / 1000).toFixed(1);
        setDriverDistance(distanceKm);
      }
    } catch (err) {
      console.log('Route fetch error:', err);
    }
  };

  const getFullRoute = async (pickup, destination) => {
    try {
      // Get coordinates for pickup and destination
      const pickupRoute = ROUTES.find(r => r.destination === destination);
      if (!pickupRoute) return;

      const destCoords = pickupRoute.coords;
      const pickupCoords = JUIT_COORDS;

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
      }
    } catch (err) {
      console.log('Full route error:', err);
    }
  };
  const checkDriversAvailable = async (vehicleType) => {
    try {
      const res = await axios.get(
        `${API}/api/rides/drivers-available?vehicleType=${vehicleType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDriversAvailable(res.data.available);
    } catch (err) {
      console.log('Failed to check drivers');
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
      } else {
        setActiveRide(null);
      }
    } catch (err) {
      console.log('No active ride');
      setActiveRide(null);
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
      setActiveRide(res.data.ride);
      setMatchMessage(res.data.message);
      showToast(res.data.message, 'match');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to join ride');
    }
  };

  const leaveSharedRide = async () => {
    try {
      const res = await axios.put(
        `${API}/api/rides/leave-shared/${activeRide._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveRide(null);
      setMessage('Left shared ride successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to leave ride');
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

  const cancelAcceptedRide = async () => {
    try {
      const res = await axios.put(
        `${API}/api/rides/cancel-accepted/${activeRide._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveRide(null);
      setShowCancelPopup(false);
      setMessage('Ride cancelled successfully.');
      if (res.data.warning) {
        setMessage(res.data.warning);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot cancel');
      setShowCancelPopup(false);
    }
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

  const logout = async () => {
    try {
      await axios.post(
        `${API}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log('Logout error:', err);
    }
    localStorage.clear();
    navigate('/login');
  };

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
      <style>{`
        @keyframes bgGradientMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes pulseSearching {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
          50% { transform: scale(1.1); opacity: 0.85; box-shadow: 0 0 0 9px rgba(245, 158, 11, 0); }
        }
        @keyframes pulseActive {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.7); }
          50% { transform: scale(1.1); opacity: 0.85; box-shadow: 0 0 0 9px rgba(230, 57, 70, 0); }
        }
        @keyframes slideUpIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .traverse-select:focus, .traverse-input:focus {
          border-color: #e63946 !important;
          box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.25), 0 0 16px rgba(230, 57, 70, 0.35) !important;
          background: #202020 !important;
          outline: none !important;
        }
        .traverse-btn-primary:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.6) !important;
          filter: brightness(1.08);
        }
        .traverse-btn-primary:active:not(:disabled) {
          transform: scale(0.97) translateY(1px) !important;
          box-shadow: 0 3px 10px rgba(230, 57, 70, 0.4) !important;
        }
        .vehicle-card-hover:hover {
          border-color: rgba(230, 57, 70, 0.5) !important;
          background: rgba(28, 18, 20, 0.85) !important;
        }
        .nav-btn-hover:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border-color: #444 !important;
        }
        @media (max-width: 480px) {
          .nav-user-desktop { display: none !important; }
          .nav-brand-title { font-size: 13px !important; letter-spacing: 1.2px !important; }
          .nav-brand-box { width: 26px !important; height: 26px !important; }
          .nav-btn-mobile { padding: 4px 6px !important; font-size: 10.5px !important; gap: 3px !important; }
          .nav-btn-red-mobile { padding: 4px 6px !important; font-size: 10.5px !important; gap: 3px !important; }
        }
        @media (min-width: 481px) {
          .nav-user-desktop { display: block !important; }
          .nav-brand-title { font-size: 15px !important; letter-spacing: 2px !important; }
          .nav-brand-box { width: 30px !important; height: 30px !important; }
          .nav-btn-mobile { padding: 6px 9px !important; font-size: 12px !important; gap: 4px !important; }
          .nav-btn-red-mobile { padding: 6px 10px !important; font-size: 12px !important; gap: 4px !important; }
        }
      `}</style>

      {/* Sleek Dark Navbar - spacious, clean brand separation and single-line buttons */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div className="nav-brand-box" style={styles.navLogoBox}>
            <span style={styles.navLogo}>🚖</span>
          </div>
          <span className="nav-brand-title" style={styles.navTitle}>TRAVERSE</span>
        </div>
        <div style={styles.navRight}>
          <span className="nav-user-desktop" style={styles.navUser}>👤 {user.name}</span>
          <button onClick={fetchActiveRide} className="nav-btn-hover nav-btn-mobile" style={styles.navBtn} title="Refresh Ride">
            <span>🔄</span><span>Refresh</span>
          </button>
          <button onClick={() => navigate('/history')} className="nav-btn-hover nav-btn-mobile" style={styles.navBtn} title="Trip History">
            <span>📋</span><span>History</span>
          </button>
          <button onClick={() => setShowAbout(true)} className="nav-btn-hover nav-btn-mobile" style={styles.navBtn} title="About Traverse">
            <span>ℹ️</span><span>About</span>
          </button>
          <button onClick={logout} className="nav-btn-red-mobile" style={styles.navBtnRed} title="Logout">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </nav>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <main style={styles.content}>
        {message && (
          <div style={styles.messagebox}>
            <span style={styles.messageIcon}>ℹ️</span> {message}
          </div>
        )}

        {/* ACTIVE RIDE SCREEN */}
        {activeRide && (
          <div style={styles.rideCard}>
            <div style={styles.rideCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    ...styles.statusDot,
                    background: statusColor[activeRide.status],
                    animation: activeRide.status === 'searching' ? 'pulseSearching 1.8s infinite' : 'pulseActive 2s infinite'
                  }}
                />
                <h3 style={styles.rideCardTitle}>Active Ride</h3>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={fetchActiveRide} style={styles.iconRefreshBtn} title="Refresh">🔄</button>
                <span style={{
                  ...styles.statusBadge,
                  background: statusColor[activeRide.status] + '22',
                  color: statusColor[activeRide.status],
                  border: `1px solid ${statusColor[activeRide.status]}`
                }}>
                  {statusLabel[activeRide.status]}
                </span>
              </div>
            </div>

            {/* Shared Ride Info Panel */}
            {activeRide.rideType === 'shared' && (
              <div style={styles.sharedInfoPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '600' }}>
                    👥 Shared Ride — {activeRide.passengers?.length || 1}/{activeRide.maxPassengers || 4} passengers
                  </span>
                  {activeRide.isFull && (
                    <span style={styles.fullBadge}>FULL</span>
                  )}
                </div>

                {/* Passenger list */}
                {activeRide.passengers && activeRide.passengers.map((p, i) => (
                  <div key={i} style={styles.passengerRow}>
                    <span style={{ color: '#d0d0d0', fontSize: '13px' }}>👤 {p.name}</span>
                    {p.phone && (
                      <a href={`tel:${p.phone}`} style={styles.passengerCall}>📞 Call</a>
                    )}
                  </div>
                ))}

                {activeRide.isScheduled && activeRide.scheduledTime && (
                  <p style={{ color: '#f59e0b', fontSize: '12px', margin: '8px 0 0' }}>
                    🕐 {new Date(activeRide.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
                )}

                {/* Leave ride button - only for non-original students */}
                {activeRide.student?._id !== user._id && activeRide.status === 'searching' && (
                  <button onClick={leaveSharedRide} style={styles.leaveRideBtn}>
                    Leave Shared Ride
                  </button>
                )}
              </div>
            )}

            {/* Visual Route Points */}
            <div style={styles.routeInfo}>
              <div style={styles.routePoint}>
                <div style={styles.greenDot} />
                <div>
                  <div style={styles.routeSub}>PICKUP</div>
                  <div style={styles.routeMain}>{activeRide.pickup}</div>
                </div>
              </div>
              <div style={styles.routeLineContainer}>
                <div style={styles.routeLineDashed} />
              </div>
              <div style={styles.routePoint}>
                <div style={styles.redDot} />
                <div>
                  <div style={styles.routeSub}>DESTINATION</div>
                  <div style={styles.routeMain}>{activeRide.dropoff}</div>
                </div>
              </div>
            </div>

            {/* Driver Details Card */}
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
                  <a href={`tel:${activeRide.driver.phone}`} className="traverse-btn-primary" style={styles.callBtn}>
                    📞 Call Driver
                  </a>
                )}
              </div>
            )}

            {/* Live Tracking Map */}
            {(activeRide.status === 'ontheway' || activeRide.status === 'accepted') && (
              <div style={{ marginTop: '16px' }}>
                <div style={styles.trackingHeader}>
                  <span style={{ color: '#d0d0d0', fontSize: '13px', fontWeight: '600' }}>🗺️ Live Driver Tracking</span>
                  {driverDistance && <span style={styles.driverDistanceTag}>~{driverDistance} km away</span>}
                </div>
                {driverLocation ? (
                  <div style={styles.mapWrapper}>
                    <MapContainer
                      center={driverLocation}
                      zoom={13}
                      style={{ height: '280px', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      {/* Full route dashed line */}
                      {routeCoords.length > 0 && (
                        <Polyline
                          positions={routeCoords}
                          color='#e63946'
                          weight={4}
                          opacity={0.6}
                          dashArray='8 4'
                        />
                      )}

                      {/* Driver to student solid line */}
                      {studentLocation && driverLocation && (
                        <Polyline
                          positions={[driverLocation, studentLocation]}
                          color='#e63946'
                          weight={4}
                          opacity={0.9}
                        />
                      )}

                      {/* Driver marker */}
                      <Marker position={driverLocation}
                        icon={L.divIcon({
                          html: '🚗',
                          className: '',
                          iconSize: [32, 32],
                          iconAnchor: [16, 16]
                        })}>
                        <Popup>Your Driver</Popup>
                      </Marker>

                      {/* Student location */}
                      {studentLocation && (
                        <Marker position={studentLocation}
                          icon={L.divIcon({
                            html: '📍',
                            className: '',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                          })}>
                          <Popup>Your Location</Popup>
                        </Marker>
                      )}

                      {/* Destination marker */}
                      {activeRide.dropoff && ROUTES.find(r => r.destination === activeRide.dropoff) && (
                        <Marker
                          position={ROUTES.find(r => r.destination === activeRide.dropoff).coords}
                          icon={L.divIcon({
                            html: '🏁',
                            className: '',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                          })}>
                          <Popup>Destination: {activeRide.dropoff}</Popup>
                        </Marker>
                      )}

                      <FlyTo coords={driverLocation} />
                    </MapContainer>
                  </div>
                ) : (
                  <div style={styles.mapWaitingBox}>
                    <span style={{ fontSize: '24px', marginBottom: '6px' }}>📡</span>
                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Connecting to driver's GPS live location...</p>
                  </div>
                )}
              </div>
            )}

            {/* Fare Summary */}
            {activeRide.fare > 0 && (
              <div style={styles.fareInfo}>
                <span style={{ color: '#888', fontSize: '13px' }}>Trip Total Fare</span>
                <span style={styles.fareAmount}>₹{activeRide.fare}</span>
              </div>
            )}

            {/* Ride Cancellation Actions */}
            {activeRide.status === 'searching' && (
              <button onClick={cancelRide} style={styles.cancelBtn}>Cancel Ride Search</button>
            )}
            {activeRide.status === 'accepted' && (
              <button onClick={() => setShowCancelPopup(true)} style={styles.cancelBtn}>
                Cancel Ride
              </button>
            )}

            {/* Cancel Popup Modal */}
            {showCancelPopup && (
              <div style={styles.popup}>
                <div style={styles.popupCard}>
                  <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '18px' }}>⚠️ Cancel Ride?</h3>
                  <p style={{ color: '#999', fontSize: '13px', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                    Cancelling after driver acceptance may result in blacklisting after 5 times. Are you sure you want to cancel?
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={cancelAcceptedRide} style={{ ...styles.cancelBtn, flex: 1, marginTop: 0 }}>
                      Yes, Cancel
                    </button>
                    <button onClick={() => setShowCancelPopup(false)} style={styles.keepRideBtn}>
                      No, Keep Ride
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Post-ride Rating */}
            {activeRide.status === 'completed' && !rated && (
              <div style={styles.ratingBox}>
                <p style={{ color: '#ffffff', fontWeight: '600', margin: '0 0 10px 0' }}>Rate your ride experience</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} onClick={() => rateRide(star)}
                      style={{ fontSize: '32px', cursor: 'pointer', color: star <= rating ? '#e63946' : '#333', transition: 'color 0.2s' }}>★</span>
                  ))}
                </div>
                <button onClick={() => setActiveRide(null)} style={styles.skipRatingBtn}>
                  Skip Rating
                </button>
              </div>
            )}
            {rated && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <p style={{ color: '#10b981', fontWeight: '600', margin: '0 0 10px 0' }}>✅ Rated {rating} stars!</p>
                <button onClick={() => setActiveRide(null)} style={styles.doneRatingBtn}>
                  Done ✓
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOOKING INTERFACE */}
        {!activeRide && (
          <div style={styles.bookCard}>
            <div style={styles.bookCardHeader}>
              <h3 style={styles.bookTitle}>Book a Ride</h3>
              <span style={styles.quickTag}>⚡ Instant & Scheduled</span>
            </div>

            {/* Ride Type Switcher */}
            <div style={styles.rideTypeContainer}>
              <button
                type='button'
                onClick={() => { setRideType('private'); setSharedRides([]); }}
                style={rideType === 'private' ? styles.rideTypeActive : styles.rideTypeInactive}
              >
                🚗 Private Ride
              </button>
              <button
                type='button'
                onClick={() => { setRideType('shared'); fetchSharedRides(); }}
                style={rideType === 'shared' ? styles.rideTypeActive : styles.rideTypeInactive}
              >
                👥 Share Ride
              </button>
            </div>

            {/* Shared Available Rides List */}
            {rideType === 'shared' && sharedRides.length > 0 && (
              <div style={styles.sharedList}>
                <p style={styles.sharedListTitle}>
                  👥 Passengers heading your way — tap to join:
                </p>
                {sharedRides.map(ride => (
                  <div key={ride._id} style={styles.sharedCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                          👤 <b>{ride.student?.name}</b> → <b style={{ color: '#e63946' }}>{ride.dropoff}</b>
                        </p>
                        <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
                          🚗 {ride.vehicleType} • <span style={{ color: '#10b981', fontWeight: '700' }}>₹{Math.ceil(ride.originalFare / ((ride.passengers?.length || 1) + 1))} each</span>
                        </p>
                        <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0' }}>
                          👥 {ride.passengers?.length || 1}/{ride.maxPassengers || 4} passengers
                        </p>
                        {ride.isScheduled && ride.scheduledTime && (
                          <p style={{ color: '#f59e0b', fontSize: '12px', margin: '4px 0 0' }}>
                            🕐 {new Date(ride.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </p>
                        )}
                      </div>
                      {ride.isFull ? (
                        <span style={styles.fullBadge}>FULL</span>
                      ) : (
                        <button
                          type='button'
                          onClick={() => joinSharedRide(ride._id)}
                          className="traverse-btn-primary"
                          style={styles.joinBtn}
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {matchMessage && (
              <div style={{ ...styles.messagebox, borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
                🎉 {matchMessage}
              </div>
            )}

            <form onSubmit={bookRide} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Pickup Selector */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>PICKUP LOCATION</label>
                <div style={styles.selectWrapper}>
                  <select
                    className="traverse-select"
                    style={styles.select}
                    value={selectedPickup}
                    onChange={e => {
                      setSelectedPickup(e.target.value);
                      setSelectedRoute(null);
                      setSelectedVehicle(null);
                      setFare(null);
                      setDestCoords(null);
                      setDistance(null);
                    }}
                    required
                  >
                    <option value='JUIT Campus, Waknaghat'>📍 JUIT Campus, Waknaghat</option>
                    <option value='Waknaghat'>Waknaghat</option>
                    <option value='Shoghi'>Shoghi</option>
                    <option value='Shimla'>Shimla</option>
                    <option value='Kandaghat'>Kandaghat</option>
                    <option value='Solan'>Solan</option>
                    <option value='Heritage Park Solan'>Heritage Park Solan</option>
                    <option value='Chail'>Chail</option>
                    <option value='Sadhupul'>Sadhupul</option>
                    <option value='Kufri'>Kufri</option>
                    <option value='Mashobra'>Mashobra</option>
                    <option value='Tatapani'>Tatapani</option>
                    <option value='Narkanda'>Narkanda</option>
                  </select>
                </div>
              </div>

              {/* Destination Selector */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>DROP-OFF DESTINATION</label>
                <div style={styles.selectWrapper}>
                  <select
                    className="traverse-select"
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
                    {ROUTES.filter(r => {
                      if (selectedPickup === 'JUIT Campus, Waknaghat') {
                        return r.destination !== 'JUIT Campus, Waknaghat';
                      }
                      return r.destination === 'JUIT Campus, Waknaghat';
                    }).map(route => (
                      <option key={route.destination} value={route.destination}>
                        {route.destination}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Route Map Preview */}
              {destCoords && (
                <div style={styles.inputGroup}>
                  <div style={styles.routeHeader}>
                    <label style={styles.label}>ROUTE PREVIEW</label>
                    {distance && <span style={styles.distanceBadge}>~{distance} km</span>}
                  </div>
                  <div style={styles.mapWrapper}>
                    <MapContainer
                      center={mapCenter}
                      zoom={11}
                      style={{ height: '200px', width: '100%' }}
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
                </div>
              )}

              {/* Uber-Style Vehicle Cards with Realistic SVG Illustrations */}
              {selectedRoute && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>SELECT VEHICLE</label>
                  <div style={styles.vehicleCards}>
                    {/* 4+1 Sedan Card with Realistic Sedan SVG */}
                    <div
                      onClick={() => {
                        setSelectedVehicle('4+1');
                        checkDriversAvailable('4+1');
                        if (selectedRoute.destination === 'Waknaghat') {
                          const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
                          const hour = checkTime.getHours();
                          setFare((hour >= 21 || hour < 7) ? 300 : 200);
                        } else {
                          setFare(selectedRoute.disc4 || selectedRoute.fare4);
                        }
                      }}
                      className="vehicle-card-hover"
                      style={{
                        ...styles.vehicleCard,
                        ...(selectedVehicle === '4+1' ? styles.vehicleCardActive : {})
                      }}
                    >
                      <div style={styles.vehicleIcon}>
                        <svg width="86" height="38" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <ellipse cx="60" cy="46" rx="52" ry="3" fill="black" opacity="0.6" />
                          <path d="M12,38 C8,38 6,36 6,32 C6,27 10,25 18,24 L34,22 L48,11 C51,9 56,8 64,8 L84,8 C91,8 96,11 100,16 L108,22 C114,23 118,26 118,30 C118,34 116,38 112,38 C110,38 108,34 103,34 C97,34 94,38 90,38 L42,38 C38,38 35,34 29,34 C24,34 21,38 12,38 Z" fill="url(#sedanGrad)" />
                          <path d="M37,21 L49,12 C52,10 55,9.5 62,9.5 L68,9.5 L68,21 Z" fill="#141c24" stroke="#222" strokeWidth="0.8" />
                          <path d="M71,9.5 L83,9.5 C88,9.5 92,11.5 95,15 L101,21 L71,21 Z" fill="#141c24" stroke="#222" strokeWidth="0.8" />
                          <path d="M43,18 L50,12 L53,12 L47,18 Z" fill="white" opacity="0.2" />
                          <path d="M74,18 L80,11 L83,11 L77,18 Z" fill="white" opacity="0.2" />
                          <line x1="69.5" y1="9.5" x2="69.5" y2="36" stroke="#8a101c" strokeWidth="1" />
                          <line x1="40" y1="21" x2="40" y2="36" stroke="#8a101c" strokeWidth="1" />
                          <line x1="97" y1="21" x2="97" y2="35" stroke="#8a101c" strokeWidth="1" />
                          <rect x="58" y="23" width="7" height="2" rx="1" fill="#1a1a1a" />
                          <rect x="85" y="23" width="7" height="2" rx="1" fill="#1a1a1a" />
                          <path d="M112,25 C116,26 117,28 117,30 L111,30 Z" fill="#fff8e7" opacity="0.9" />
                          <path d="M7,26 C6,27 6,29 7,31 L12,31 Z" fill="#ff2a3b" />
                          <circle cx="26" cy="38" r="9" fill="#111111" stroke="#333" strokeWidth="1.5" />
                          <circle cx="26" cy="38" r="6" fill="#1f1f1f" stroke="#e63946" strokeWidth="0.8" />
                          <circle cx="26" cy="38" r="2.5" fill="#888" />
                          <circle cx="98" cy="38" r="9" fill="#111111" stroke="#333" strokeWidth="1.5" />
                          <circle cx="98" cy="38" r="6" fill="#1f1f1f" stroke="#e63946" strokeWidth="0.8" />
                          <circle cx="98" cy="38" r="2.5" fill="#888" />
                          <defs>
                            <linearGradient id="sedanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff4d5a" />
                              <stop offset="40%" stopColor="#e63946" />
                              <stop offset="100%" stopColor="#9e1522" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div style={styles.vehicleInfo}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <p style={styles.vehicleTypeTxt}>4+1 Sedan</p>
                          <span style={styles.capacityBadge}>👤 4 seats</span>
                        </div>
                        <p style={styles.vehicleSeats}>Sporty & fast campus ride</p>
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

                    {/* 6+1 SUV Card with Realistic SUV SVG */}
                    <div
                      onClick={() => {
                        setSelectedVehicle('6+1');
                        checkDriversAvailable('6+1');
                        if (selectedRoute.destination === 'Waknaghat') {
                          const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
                          const hour = checkTime.getHours();
                          setFare((hour >= 21 || hour < 7) ? 450 : 300);
                        } else {
                          setFare(selectedRoute.disc6 || selectedRoute.fare6);
                        }
                      }}
                      className="vehicle-card-hover"
                      style={{
                        ...styles.vehicleCard,
                        ...(selectedVehicle === '6+1' ? styles.vehicleCardActive : {})
                      }}
                    >
                      <div style={styles.vehicleIcon}>
                        <svg width="90" height="40" viewBox="0 0 120 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <ellipse cx="60" cy="50" rx="54" ry="3.5" fill="black" opacity="0.6" />
                          <line x1="38" y1="5" x2="88" y2="5" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                          <line x1="44" y1="5" x2="44" y2="7.5" stroke="#666" strokeWidth="2" />
                          <line x1="82" y1="5" x2="82" y2="7.5" stroke="#666" strokeWidth="2" />
                          <path d="M10,40 C6,40 5,38 5,32 C5,25 8,23 16,22 L32,20 L40,8 C42,6.5 46,6 52,6 L94,6 C98,6 102,7.5 104,10 L110,18 C115,20 118,23 118,28 C118,34 116,40 111,40 C109,40 106,34 100,34 C94,34 91,40 86,40 L44,40 C39,40 36,34 30,34 C24,34 21,40 10,40 Z" fill="url(#suvGrad)" />
                          <path d="M35,19 L42,9.5 C44,8 47,7.5 53,7.5 L64,7.5 L64,19 Z" fill="#141c24" stroke="#222" strokeWidth="0.8" />
                          <path d="M67,7.5 L84,7.5 L84,19 L67,19 Z" fill="#141c24" stroke="#222" strokeWidth="0.8" />
                          <path d="M87,7.5 L95,7.5 C98,7.5 101,9 103,11.5 L107,19 L87,19 Z" fill="#141c24" stroke="#222" strokeWidth="0.8" />
                          <path d="M42,17 L47,10 L50,10 L45,17 Z" fill="white" opacity="0.2" />
                          <path d="M72,17 L78,9 L81,9 L75,17 Z" fill="white" opacity="0.2" />
                          <line x1="65.5" y1="7.5" x2="65.5" y2="38" stroke="#8a101c" strokeWidth="1" />
                          <line x1="85.5" y1="7.5" x2="85.5" y2="38" stroke="#8a101c" strokeWidth="1" />
                          <line x1="37" y1="19" x2="37" y2="38" stroke="#8a101c" strokeWidth="1" />
                          <rect x="53" y="22" width="7" height="2" rx="1" fill="#1a1a1a" />
                          <rect x="74" y="22" width="7" height="2" rx="1" fill="#1a1a1a" />
                          <path d="M112,23 C116,24 117,27 117,29 L111,29 Z" fill="#fff8e7" opacity="0.95" />
                          <path d="M6,24 C5,25 5,30 6,32 L11,32 Z" fill="#ff2a3b" />
                          <circle cx="27" cy="40" r="10.5" fill="#111111" stroke="#333" strokeWidth="1.8" />
                          <circle cx="27" cy="40" r="7" fill="#1e1e1e" stroke="#e63946" strokeWidth="1" />
                          <circle cx="27" cy="40" r="3" fill="#888" />
                          <circle cx="95" cy="40" r="10.5" fill="#111111" stroke="#333" strokeWidth="1.8" />
                          <circle cx="95" cy="40" r="7" fill="#1e1e1e" stroke="#e63946" strokeWidth="1" />
                          <circle cx="95" cy="40" r="3" fill="#888" />
                          <defs>
                            <linearGradient id="suvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff525f" />
                              <stop offset="40%" stopColor="#e63946" />
                              <stop offset="100%" stopColor="#94121e" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div style={styles.vehicleInfo}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <p style={styles.vehicleTypeTxt}>6+1 SUV</p>
                          <span style={styles.capacityBadge}>👥 6 seats</span>
                        </div>
                        <p style={styles.vehicleSeats}>Tall & spacious for groups</p>
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

              {/* Schedule Ride Toggle Switch */}
              <div style={styles.scheduleContainer}>
                <label style={styles.scheduleLabel}>
                  <input
                    type='checkbox'
                    checked={isScheduled}
                    onChange={e => setIsScheduled(e.target.checked)}
                    style={styles.checkboxInput}
                  />
                  <span>🕐 Schedule ride for later</span>
                </label>
              </div>

              {isScheduled && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>SELECT PICKUP TIME</label>
                  <input
                    type='datetime-local'
                    className="traverse-input"
                    style={styles.dateInput}
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    min={new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16)}
                    required={isScheduled}
                  />
                </div>
              )}

              {/* Rapido-Style Large Bold Red Gradient Button */}
              <button
                className={selectedVehicle ? "traverse-btn-primary" : ""}
                style={selectedVehicle ? styles.bookBtn : styles.bookBtnDisabled}
                type='submit'
                disabled={!selectedVehicle}
              >
                {selectedVehicle ? `🚖 Request ${selectedVehicle} Ride — ₹${fare}` : 'Select a Vehicle to Continue'}
              </button>
            </form>
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
    backgroundImage: `
      radial-gradient(circle at 50% 10%, rgba(230, 57, 70, 0.16) 0%, rgba(14, 5, 8, 0.95) 45%, #0a0a0a 85%)
    `,
    color: '#ffffff',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: '32px'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: 'rgba(15, 15, 15, 0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'nowrap',
    overflow: 'hidden'
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
    marginRight: '8px'
  },
  navLogoBox: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: 'linear-gradient(145deg, #241315 0%, #12090b 100%)',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navLogo: { fontSize: '15px', lineHeight: 1 },
  navTitle: {
    fontSize: '15px',
    fontWeight: '900',
    letterSpacing: '2px',
    color: '#ffffff',
    textShadow: '0 0 12px rgba(230, 57, 70, 0.6)'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'nowrap',
    flexShrink: 0
  },
  navUser: {
    color: '#a0a0a0',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '6px'
  },
  navBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#d0d0d0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '5px 8px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px'
  },
  navIconBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#d0d0d0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '5px 8px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '11px',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px'
  },
  navBtnRed: {
    background: 'rgba(230, 57, 70, 0.12)',
    color: '#e63946',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    padding: '5px 9px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px'
  },
  content: {
    width: '100%',
    maxWidth: '430px',
    margin: '16px auto 0',
    padding: '0 14px',
    boxSizing: 'border-box'
  },
  messagebox: {
    background: 'rgba(28, 28, 28, 0.9)',
    border: '1px solid rgba(230, 57, 70, 0.3)',
    borderLeft: '4px solid #e63946',
    padding: '12px 14px',
    borderRadius: '12px',
    marginBottom: '14px',
    fontSize: '13px',
    color: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
  },
  messageIcon: { marginRight: '8px', fontSize: '16px' },
  rideCard: {
    background: 'linear-gradient(165deg, rgba(26, 26, 26, 0.95) 0%, rgba(14, 14, 14, 0.98) 100%)',
    border: '1px solid rgba(230, 57, 70, 0.25)',
    padding: '20px 16px',
    borderRadius: '20px',
    marginBottom: '20px',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(230, 57, 70, 0.12)',
    animation: 'slideUpIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  rideCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  rideCardTitle: {
    fontSize: '17px',
    fontWeight: '800',
    margin: 0,
    color: '#ffffff',
    letterSpacing: '-0.2px'
  },
  iconRefreshBtn: {
    background: 'transparent',
    border: 'none',
    color: '#888888',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px'
  },
  statusBadge: {
    padding: '5px 11px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.2px'
  },
  sharedInfoPanel: {
    background: '#121212',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    padding: '12px 14px',
    borderRadius: '12px',
    marginBottom: '14px'
  },
  fullBadge: {
    background: '#e63946',
    color: '#ffffff',
    padding: '2px 7px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800'
  },
  passengerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px'
  },
  passengerCall: {
    color: '#e63946',
    fontSize: '12px',
    textDecoration: 'none',
    fontWeight: '600'
  },
  leaveRideBtn: {
    marginTop: '8px',
    width: '100%',
    padding: '8px',
    background: 'rgba(230, 57, 70, 0.08)',
    color: '#e63946',
    border: '1px solid #e63946',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  routeInfo: {
    background: '#121212',
    border: '1px solid #222222',
    padding: '14px 16px',
    borderRadius: '14px',
    marginBottom: '14px'
  },
  routePoint: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  greenDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
  },
  redDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#e63946',
    boxShadow: '0 0 10px rgba(230, 57, 70, 0.6)'
  },
  routeLineContainer: {
    paddingLeft: '5px',
    margin: '3px 0'
  },
  routeLineDashed: {
    width: '2px',
    height: '16px',
    background: '#333333'
  },
  routeSub: {
    fontSize: '10px',
    color: '#666666',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  routeMain: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff'
  },
  driverCard: {
    background: '#141414',
    border: '1px solid #282828',
    padding: '14px 16px',
    borderRadius: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  driverInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  driverAvatar: {
    width: '44px',
    height: '44px',
    background: 'linear-gradient(145deg, #241315 0%, #151515 100%)',
    border: '1px solid rgba(230, 57, 70, 0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  driverName: {
    fontWeight: '700',
    margin: '0 0 3px 0',
    fontSize: '15px',
    color: '#ffffff'
  },
  driverDetails: {
    color: '#888888',
    fontSize: '12px',
    margin: 0
  },
  callBtn: {
    background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
    color: '#ffffff',
    padding: '9px 14px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '700',
    boxShadow: '0 4px 14px rgba(230, 57, 70, 0.4)',
    display: 'inline-block'
  },
  trackingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  driverDistanceTag: {
    color: '#e63946',
    fontSize: '12px',
    fontWeight: '700',
    background: 'rgba(230, 57, 70, 0.12)',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  mapWrapper: {
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
    boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
  },
  mapWaitingBox: {
    background: '#141414',
    border: '1px dashed #333333',
    height: '180px',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fareInfo: {
    background: 'linear-gradient(145deg, #181112 0%, #111111 100%)',
    border: '1px solid rgba(230, 57, 70, 0.25)',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fareAmount: {
    color: '#e63946',
    fontSize: '18px',
    fontWeight: '800'
  },
  cancelBtn: {
    width: '100%',
    padding: '12px',
    background: 'rgba(230, 57, 70, 0.08)',
    color: '#e63946',
    border: '1.5px solid rgba(230, 57, 70, 0.6)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.2s ease',
    marginTop: '6px'
  },
  ratingBox: {
    marginTop: '16px',
    padding: '16px',
    background: '#141414',
    border: '1px solid #282828',
    borderRadius: '14px',
    textAlign: 'center'
  },
  skipRatingBtn: {
    marginTop: '12px',
    background: 'transparent',
    color: '#777777',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  doneRatingBtn: {
    background: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700'
  },
  bookCard: {
    background: 'linear-gradient(165deg, rgba(26, 26, 26, 0.95) 0%, rgba(14, 14, 14, 0.98) 100%)',
    border: '1px solid rgba(230, 57, 70, 0.22)',
    padding: '22px 18px',
    borderRadius: '20px',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 35px rgba(230, 57, 70, 0.12)',
    animation: 'slideUpIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  bookCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  bookTitle: {
    fontSize: '20px',
    fontWeight: '800',
    margin: 0,
    color: '#ffffff'
  },
  quickTag: {
    fontSize: '11px',
    color: '#e63946',
    fontWeight: '700',
    background: 'rgba(230, 57, 70, 0.1)',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  rideTypeContainer: {
    display: 'flex',
    gap: '6px',
    background: '#141414',
    border: '1px solid #262626',
    borderRadius: '14px',
    padding: '4px',
    marginBottom: '16px'
  },
  rideTypeActive: {
    flex: 1,
    padding: '11px 8px',
    background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(230, 57, 70, 0.45)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit'
  },
  rideTypeInactive: {
    flex: 1,
    padding: '11px 8px',
    background: 'transparent',
    color: '#777777',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  sharedList: {
    background: '#121212',
    border: '1px solid #252525',
    padding: '14px',
    borderRadius: '14px',
    marginBottom: '16px'
  },
  sharedListTitle: {
    color: '#a0a0a0',
    marginBottom: '10px',
    fontSize: '13px',
    fontWeight: '600'
  },
  sharedCard: {
    background: '#181818',
    border: '1px solid #2a2a2a',
    padding: '12px 14px',
    borderRadius: '10px',
    marginBottom: '8px'
  },
  joinBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(230, 57, 70, 0.4)'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    color: '#888888',
    fontSize: '11px',
    fontWeight: '700',
    marginBottom: '7px',
    letterSpacing: '1.2px'
  },
  selectWrapper: {
    position: 'relative'
  },
  select: {
    width: '100%',
    padding: '13px 15px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.25s ease',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer'
  },
  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '7px'
  },
  distanceBadge: {
    color: '#e63946',
    fontSize: '12px',
    fontWeight: '700'
  },
  vehicleCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  vehicleCard: {
    background: 'linear-gradient(145deg, #181818 0%, #121212 100%)',
    border: '1.5px solid #282828',
    padding: '14px 16px',
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative'
  },
  vehicleCardActive: {
    border: '2px solid #e63946',
    background: 'linear-gradient(145deg, rgba(42, 14, 18, 0.95) 0%, rgba(20, 8, 10, 0.95) 100%)',
    boxShadow: '0 6px 20px rgba(230, 57, 70, 0.35)'
  },
  vehicleIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '88px',
    flexShrink: 0
  },
  vehicleInfo: {
    flex: 1
  },
  vehicleTypeTxt: {
    fontWeight: '800',
    margin: 0,
    fontSize: '15px',
    color: '#ffffff'
  },
  capacityBadge: {
    fontSize: '11px',
    color: '#999999',
    background: 'rgba(255,255,255,0.06)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  vehicleSeats: {
    color: '#777777',
    fontSize: '12px',
    margin: '3px 0 0 0'
  },
  vehicleFare: {
    textAlign: 'right',
    flexShrink: 0
  },
  originalFare: {
    display: 'block',
    color: '#666666',
    fontSize: '12px',
    textDecoration: 'line-through'
  },
  discountedFare: {
    display: 'block',
    color: '#e63946',
    fontSize: '18px',
    fontWeight: '800'
  },
  discountBadge: {
    display: 'inline-block',
    background: 'rgba(230, 57, 70, 0.15)',
    color: '#e63946',
    border: '1px solid #e63946',
    padding: '1px 5px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
    marginTop: '2px'
  },
  scheduleContainer: {
    background: '#141414',
    border: '1px solid #252525',
    padding: '12px 14px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center'
  },
  scheduleLabel: {
    color: '#d0d0d0',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%'
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    accentColor: '#e63946',
    cursor: 'pointer'
  },
  dateInput: {
    width: '100%',
    padding: '13px 15px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  bookBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    letterSpacing: '0.4px',
    boxShadow: '0 8px 24px rgba(230, 57, 70, 0.45)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '6px',
    fontFamily: 'inherit'
  },
  bookBtnDisabled: {
    width: '100%',
    padding: '16px',
    background: '#1c1c1c',
    color: '#555555',
    border: '1px solid #2a2a2a',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '6px',
    fontFamily: 'inherit'
  },
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px'
  },
  popupCard: {
    background: 'linear-gradient(165deg, #1a1a1a 0%, #111111 100%)',
    border: '1px solid rgba(230, 57, 70, 0.35)',
    padding: '24px 20px',
    borderRadius: '18px',
    maxWidth: '340px',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
  },
  keepRideBtn: {
    flex: 1,
    padding: '12px',
    background: '#222222',
    color: '#b0b0b0',
    border: '1px solid #333333',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default StudentDashboard;