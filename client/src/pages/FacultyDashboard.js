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

function calculateDistance(coord1, coord2) {
    const R = 6371;
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function FacultyDashboard() {
  

    const [completedRide, setCompletedRide] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptRide, setReceiptRide] = useState(null);
    const [selectedPickup, setSelectedPickup] = useState('JUIT Campus, Waknaghat');
    const [toast, setToast] = useState(null);
    const [showAbout, setShowAbout] = useState(false);
    const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
    const [driversAvailable, setDriversAvailable] = useState(true);
    const [availabilityInfo, setAvailabilityInfo] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchExpired, setSearchExpired] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState(JUIT_COORDS);
    const [destCoords, setDestCoords] = useState(null);
    const [distance, setDistance] = useState(null);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledTime, setScheduledTime] = useState('');
    const [rating, setRating] = useState(0);
    const [rated, setRated] = useState(false);
    const [activeRide, setActiveRide] = useState(null);
    const [message, setMessage] = useState('');
    const [fare, setFare] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [studentLocation, setStudentLocation] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [fullRouteCoords, setFullRouteCoords] = useState([]);
    const [driverDistance, setDriverDistance] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

  const getSosWhatsAppUrl = () => {
    if (!activeRide) return '#';
    const driverName = activeRide.driver?.name || 'Assigned Driver';
    const vehicleNo = activeRide.driver?.vehicleNumber || 'N/A';
    const carInfo = activeRide.driver?.carName ? activeRide.driver.carName + ' ' + (activeRide.driver.carModel || '') : '';
    const pickup = activeRide.pickup || 'Pickup Point';
    const dropoff = activeRide.dropoff || 'Dropoff Point';
    const locCoords = driverLocation ? (driverLocation[0] + ',' + driverLocation[1]) : '30.8826,77.1490';
    const mapsLink = 'https://maps.google.com/?q=' + locCoords;

    const text = 
      '🚨 *EMERGENCY SOS ALERT - TRAVERSE RIDE* 🚨\n\n' +
      'I need urgent emergency assistance on my active cab ride!\n\n' +
      '👤 *Driver Name:* ' + driverName + '\n' +
      '🚗 *Vehicle No:* ' + vehicleNo + (carInfo ? ' (' + carInfo.trim() + ')' : '') + '\n' +
      '📍 *Pickup:* ' + pickup + '\n' +
      '🏁 *Destination:* ' + dropoff + '\n' +
      '🗺️ *Live Location / Coordinates:* ' + mapsLink + '\n\n' +
      'Please contact me or emergency authorities (112) immediately!';

    return 'https://wa.me/?text=' + encodeURIComponent(text);
  };

    const [booking, setBooking] = useState(false);
    const arrivalNotifiedRef = React.useRef(false);
    const activeRideRef = React.useRef(null);
    const studentLocationRef = React.useRef(null);
    const selectedVehicleRef = React.useRef(null);

    React.useEffect(() => {
        if (activeRide && activeRide.status === 'searching') {
            const rideCreated = activeRide.createdAt ? new Date(activeRide.createdAt).getTime() : Date.now();
            const elapsed = Date.now() - rideCreated;
            const timeoutMs = 5 * 60 * 1000;
            const remaining = Math.max(0, timeoutMs - elapsed);

            if (remaining === 0) {
                setSearchExpired(true);
            } else {
                setSearchExpired(false);
                const timer = setTimeout(() => {
                    setSearchExpired(true);
                }, remaining);
                setSearchTimeout(timer);
                return () => {
                    clearTimeout(timer);
                };
            }
        } else {
            setSearchExpired(false);
            if (searchTimeout) {
                clearTimeout(searchTimeout);
                setSearchTimeout(null);
            }
        }
    }, [activeRide?.status, activeRide?._id, activeRide?.createdAt]);

    React.useEffect(() => {
        activeRideRef.current = activeRide;
        if (!activeRide) {
            arrivalNotifiedRef.current = false;
        }
    }, [activeRide]);

    React.useEffect(() => {
        selectedVehicleRef.current = selectedVehicle;
    }, [selectedVehicle]);

    React.useEffect(() => {
        studentLocationRef.current = studentLocation;
    }, [studentLocation]);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const API = 'https://traverse-unicab-backend-2df13b58c562.herokuapp.com';

    const showToast = React.useCallback((message, type = 'info') => {
        setToast({ message, type });
    }, []);

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
                if (!completedRide) setActiveRide(null);
            }
        } catch (err) {
            console.log('No active ride');
            // Only clear if we are sure there is no active ride
            // Do not clear if there was a network error
            if (err.response && err.response.status === 404) {
                if (!completedRide) setActiveRide(null);
            }
        } finally {
            setPageLoading(false);
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
                const distanceMeters = data.routes[0].distance;
                const distanceKm = (distanceMeters / 1000).toFixed(1);
                setDriverDistance(distanceKm);

                // Proximity arrival alert (< 500 meters)
                if (distanceMeters <= 500 && !arrivalNotifiedRef.current) {
                    arrivalNotifiedRef.current = true;
                    if (activeRideRef.current?.status === 'accepted') {
                        showToast('🚗 Driver is arriving now (< 500m)! Please be at pickup.', 'info');
                        setMessage('🚗 Driver is arriving now! Please proceed to pickup point.');
                    } else if (activeRideRef.current?.status === 'ontheway') {
                        showToast('📍 Approaching destination (< 500m)! Prepare to deboard.', 'info');
                        setMessage('📍 Approaching destination! Prepare to deboard.');
                    }
                }
            }
        } catch (err) {
            console.log('Route fetch error:', err);
        }
    };

    const getFullRoute = async (pickup, destination) => {
        try {
            const pickupRoute = ROUTES.find(r => r.destination === pickup);
            const destRoute = ROUTES.find(r => r.destination === destination);

            const pickupCoords = pickupRoute ? pickupRoute.coords : JUIT_COORDS;
            const destCoords = destRoute ? destRoute.coords : (destination === 'JUIT Campus, Waknaghat' ? JUIT_COORDS : null);

            if (!destCoords) return;

            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`
            );
            const data = await res.json();
            if (data.routes && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                setFullRouteCoords(coords);
            }
        } catch (err) {
            console.log('Full route error:', err);
        }
    };

    useEffect(() => {
        fetchActiveRide();
        const handleVisibilityChange = () => {
            if (!document.hidden) fetchActiveRide();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
        if (activeRide && (activeRide.status === 'accepted' || activeRide.status === 'ontheway')) {
            if (socket) {
                socket.emit('join:ride', activeRide._id);
            }

            const pickupRoute = ROUTES.find(r => r.destination === activeRide.pickup);
            const defaultPickupCoords = pickupRoute ? pickupRoute.coords : JUIT_COORDS;
            if (!studentLocationRef.current) {
                setStudentLocation(defaultPickupCoords);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    setStudentLocation([pos.coords.latitude, pos.coords.longitude]);
                }, () => {
                    setStudentLocation(defaultPickupCoords);
                }, { enableHighAccuracy: true });
            }

            getFullRoute(activeRide.pickup, activeRide.dropoff);
        }
    }, [activeRide?.status, activeRide?._id]);

    // Auto-poll every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeRide && activeRide.status !== 'completed' && activeRide.status !== 'cancelled') {
                fetchActiveRide();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [activeRide]);

    useEffect(() => {
        if (socket) socket.disconnect();
        socket = io(API, {
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        socket.emit('join', { userId: user?._id, role: 'student' });
        requestNotificationPermission().then(fcmToken => {
            if (fcmToken) {
                axios.post(`${API}/api/auth/save-token`, { fcmToken },
                    { headers: { Authorization: `Bearer ${token}` } });
            }
        });
        socket.on('ride:accepted', (ride) => {
            setActiveRide(ride);
            setDriverLocation(null);
            setMessage(`🚗 ${ride.driver.name} accepted your ride!`);
            showToast(`🚗 ${ride.driver.name} accepted your ride!`, 'accepted');
        });
        socket.on('ride:updated', (ride) => {
            if (ride.status === 'cancelled') {
                setActiveRide(null);
                setMessage('Ride cancelled.');
                return;
            }
            setActiveRide(ride);
            if (ride.status === 'ontheway') {
                setMessage('🚗 Driver is on the way!');
                showToast('🚗 Driver is on the way!', 'info');
            }
            if (ride.status === 'completed') {
        setMessage('✅ Ride completed! Please rate your experience.');
        setCompletedRide(ride);
        setReceiptRide(ride);
                setReceiptRide(ride);
                showToast('✅ Ride completed! Please rate your experience.', 'success');
                setDriverLocation(null);
            }
        });
        socket.on('driver:location', ({ lat, lng }) => {
            if (lat !== undefined && lng !== undefined) {
                const driverCoords = [lat, lng];
                setDriverLocation(driverCoords);
                const currentTarget = studentLocationRef.current || JUIT_COORDS;
                getRoute(driverCoords, currentTarget);
            }
        });
                        socket.on('ride:cancelled', ({ rideId }) => {
            // Only clear activeRide if it matches the cancelled ride
            setActiveRide(prev => {
                if (prev && rideId && prev._id?.toString() === rideId?.toString()) {
                    setMessage('Your ride was cancelled.');
                    return null;
                }
                return prev; // Keep activeRide unchanged if different ride
            });
        });
        socket.on('ride:accepted-by-driver', ({ rideId, driverId }) => {
            // This ride was accepted by another driver - just ignore on student side
            // Student's own ride acceptance is handled by ride:accepted event
            console.log('Another ride accepted:', rideId);
        });
        socket.on('ride:cancelled-by-party', ({ message }) => {
            setActiveRide(null);
            setMessage(message);
            setShowCancelPopup(false);
        });
        socket.on('driver:availability-changed', ({ vehicleType, isAvailable }) => {
            const currentVehicle = selectedVehicleRef.current;
            if (currentVehicle) {
                const normIncoming = (vehicleType || '').toString().replace(/ /g, '+').trim();
                const normCurrent = currentVehicle.toString().replace(/ /g, '+').trim();
                if (normIncoming === normCurrent) {
                    checkDriversAvailable(currentVehicle);
                }
            }
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (selectedRoute?.destination === 'Waknaghat' && selectedVehicle) {
            const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
            const hour = checkTime.getHours();
            const isNight = hour >= 21 || hour < 7;
            if (selectedVehicle === '4+1') setFare(isNight ? 300 : 200);
            else setFare(isNight ? 450 : 300);
        }
    }, [scheduledTime, isScheduled, selectedRoute, selectedVehicle]);

    const bookRide = async (e) => {
        e.preventDefault();
        if (booking) return;
        setRated(false);  // Reset rating state
        setRating(0);     // Reset stars
            if (isScheduled && scheduledTime) {
      const scheduled = new Date(scheduledTime);
      const now = new Date();
      const hoursDiff = (scheduled - now) / (1000 * 60 * 60);
      if (hoursDiff > 48) {
        setMessage('⚠️ Scheduled rides can only be booked up to 48 hours in advance.');
        setBooking(false);
        return;
      }
    }
        if (!selectedRoute || !selectedVehicle) {
            setMessage('Please select destination and vehicle type');
            return;
        }
        setBooking(true);
        let finalFare = fare;
        if (selectedRoute.destination === 'Waknaghat') {
            const checkTime = isScheduled && scheduledTime ? new Date(scheduledTime) : new Date();
            const hour = checkTime.getHours();
            const isNight = hour >= 21 || hour < 7;
            finalFare = selectedVehicle === '4+1' ? (isNight ? 300 : 200) : (isNight ? 450 : 300);
        }
        try {
            const pickup = selectedPickup;
            const dropoff = selectedRoute.destination;
            const res = await axios.post(
                `${API}/api/rides/book`,
                { pickup, dropoff, fare: finalFare, vehicleType: selectedVehicle, scheduledTime: isScheduled ? new Date(scheduledTime).toISOString() : null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setActiveRide(res.data);
            setMessage(isScheduled ? `Ride scheduled for ${new Date(scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}` : 'Searching for a driver...');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    const cancelRide = async () => {
        try {
            const res = await axios.put(
                `${API}/api/rides/cancel/${activeRide._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setActiveRide(null);
            setFare(null);
            setMessage(res.data.message || 'Ride cancelled');
            showToast('Ride cancelled', 'warning');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Cannot cancel');
        }
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
            if (res.data.warning) setMessage(res.data.warning);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Cannot cancel');
            setShowCancelPopup(false);
        }
    };

      const dismissRating = () => {
    setRated(false);
    setRating(0);
    setActiveRide(null);
    setCompletedRide(null);
    setShowReceipt(false);
    setMessage('');
  };

  const rateRide = async (stars) => {
    try {
      const currentRideObj = receiptRide || activeRide || completedRide;
      if (currentRideObj) setReceiptRide(currentRideObj);
      const rideId = currentRideObj?._id;
      if (rideId) {
        await axios.put(
          `${API}/api/rides/rate/${rideId}`,
          { rating: stars },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setRating(stars);
      setRated(true);
      showToast(`⭐ Rated ${stars} stars! Thank you.`, 'success');
      setMessage('');
    } catch (err) {
      console.log('Rating error:', err);
      showToast('Rating submission failed', 'warning');
    }
  };

    // Auto recheck driver availability every 30s when on booking form
    useEffect(() => {
        if (!activeRide && selectedVehicle) {
            const interval = setInterval(() => {
                checkDriversAvailable(selectedVehicle);
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [activeRide, selectedVehicle]);

    // Recheck driver availability when faculty comes back to app
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !activeRideRef.current && selectedVehicleRef.current) {
                checkDriversAvailable(selectedVehicleRef.current);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const checkDriversAvailable = async (vehicleType) => {
        try {
            const res = await axios.get(
                `${API}/api/rides/drivers-available?vehicleType=${encodeURIComponent(vehicleType)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDriversAvailable(res.data.available);
            setAvailabilityInfo(res.data);
        } catch (err) {
            console.log('Failed to check drivers');
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API}/api/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) { console.log('Logout error'); }
        localStorage.clear();
        navigate('/login');
    };

    const statusColor = {
        searching: '#f59e0b',
        accepted: '#e63946',
        ontheway: '#e63946',
        completed: '#10b981',
        cancelled: '#666666'
    };

    const statusLabel = {
        searching: '🔍 Searching for driver...',
        accepted: '✅ Driver Accepted',
        ontheway: '🚗 Driver On The Way',
        completed: '✅ Ride Completed',
        cancelled: 'Cancelled'
    };

    if (pageLoading) {
        return (
            <div style={styles.container}>
                <div style={styles.navbar}>
                    <div style={styles.navBrand}>
                        <div className="nav-brand-box" style={styles.navLogoBox}>
                            <span style={styles.navLogo}>🚖</span>
                        </div>
                        <span className="nav-brand-title" style={styles.navTitle}>TRAVERSE</span>
                    </div>
                </div>
                <Spinner text='Loading faculty dashboard...' />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{`
        /* Smooth Uber-like car marker gliding */
        .driver-live-marker {
          transition: transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
          will-change: transform;
        }
        
        @keyframes sosPulseAnim {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.75), 0 4px 18px rgba(239, 68, 68, 0.45);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0), 0 6px 24px rgba(239, 68, 68, 0.65);
            transform: scale(1.01);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0), 0 4px 18px rgba(239, 68, 68, 0.45);
            transform: scale(1);
          }
        }
        .sos-emergency-btn {
          animation: sosPulseAnim 1.8s infinite ease-in-out;
        }
        .sos-emergency-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .sos-emergency-btn:active {
          transform: scale(0.98);
        }
        @keyframes driverRadarPulse {
          0% { box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.8), 0 0 16px rgba(230, 57, 70, 0.9); }
          70% { box-shadow: 0 0 0 14px rgba(230, 57, 70, 0), 0 0 16px rgba(230, 57, 70, 0.9); }
          100% { box-shadow: 0 0 0 0 rgba(230, 57, 70, 0), 0 0 16px rgba(230, 57, 70, 0.9); }
        }
        .driver-marker-pulse {
          animation: driverRadarPulse 2s infinite ease-out;
        }

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

            {/* Sleek Dark Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navBrand}>
                    <div className="nav-brand-box" style={styles.navLogoBox}>
                        <span style={styles.navLogo}>🚖</span>
                    </div>
                    <span className="nav-brand-title" style={styles.navTitle}>TRAVERSE</span>
                </div>
                <div style={styles.navRight}>
                    <span className="nav-user-desktop" style={styles.navUser}>👤 {user?.name}</span>
                    <span className="nav-user-desktop" style={styles.facultyBadge}>👨‍🏫 Faculty</span>
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

      {/* RIDE RECEIPT MODAL */}
      {showReceipt && (
        <div style={styles.receiptOverlay} onClick={() => { dismissRating(); }}>
          <div style={styles.receiptSheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.receiptDragBar} />
            
            {/* Header */}
            <div style={styles.receiptHeader}>
              <div style={styles.receiptHeaderTop}>
                <div style={styles.receiptLogoBadge}>
                  <img src="/traverse-3d-taxi.png" alt="Traverse" style={{ width: '24px', height: '24px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <div>
                  <span style={styles.receiptTitle}>TRAVERSE RIDE RECEIPT</span>
                  <span style={styles.receiptSubtitle}>Official Ride Summary</span>
                </div>
              </div>
              <button 
                onClick={() => { dismissRating(); }} 
                style={styles.receiptCloseBtn}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Fare Display */}
            {(() => {
              const r = receiptRide || activeRide || completedRide || {};
              const fare = r.fare || r.totalFare || 0;
              const isShared = r.rideType === 'shared';
              const rawVehicleType = r.vehicleType || (r.vehicleDetails ? (r.vehicleDetails.model || r.vehicleDetails.make) : '') || '';
              const displayVehicleType = (rawVehicleType.toLowerCase().includes('suv') || rawVehicleType.includes('6+1')) ? 'SUV (6+1)' : 'Sedan (4+1)';
              const driver = r.driver || (r.vehicleDetails ? { name: r.driverName, phone: r.driverPhone, vehicleNumber: r.vehicleNumber } : {}) || {};
              const driverName = driver.name || r.driverName || 'Traverse Driver';
              const vehicleNumber = driver.vehicleNumber || r.vehicleNumber || (driver.vehicleDetails && driver.vehicleDetails.licensePlate) || 'HP-01-XXXX';
              const carDetails = (driver.carName || driver.carModel) 
                ? `${driver.carName || ''} ${driver.carModel || ''}`.trim() 
                : ((driver.vehicleDetails && (driver.vehicleDetails.make || driver.vehicleDetails.model))
                  ? `${driver.vehicleDetails.make || ''} ${driver.vehicleDetails.model || ''}`.trim()
                  : displayVehicleType);
              const driverPhone = driver.phone || r.driverPhone || '';
              const pickup = r.pickup || r.pickupLocation?.address || r.pickupLocation || 'Pickup Point';
              const dropoff = r.dropoff || r.dropoffLocation?.address || r.dropoffLocation || 'Dropoff Point';
              const rideDate = r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
              const currentRating = rating || r.rating || (r.feedback && r.feedback.rating) || 5;

              const handleShare = async () => {
                const shareText = `I just completed a ride with Traverse!\nFrom: ${pickup}\nTo: ${dropoff}\nFare: ₹${fare}\nBook at: https://traverse-unicab.vercel.app`;
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: 'Traverse Ride Receipt',
                      text: shareText,
                      url: 'https://traverse-unicab.vercel.app'
                    });
                  } catch (err) {
                    if (err.name !== 'AbortError') {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(shareText);
                        showToast('Receipt details copied to clipboard!', 'success');
                      }
                    }
                  }
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(shareText);
                  showToast('Receipt copied to clipboard!', 'success');
                } else {
                  showToast(`From: ${pickup} To: ${dropoff} Fare: ₹${fare}`, 'info');
                }
              };

              return (
                <>
                  {/* Fare Card */}
                  <div style={styles.receiptFareCard}>
                    <span style={styles.receiptFareLabel}>TOTAL FARE PAID</span>
                    <h2 style={styles.receiptFareAmount}>₹{fare}</h2>
                    <div style={styles.receiptFareTagsRow}>
                      <span style={styles.receiptPillGreen}>✓ Completed</span>
                      <span style={styles.receiptPillRed}>{isShared ? 'Shared Ride' : 'Private Ride'}</span>
                      <span style={styles.receiptPillDark}>{displayVehicleType}</span>
                    </div>
                  </div>

                  {/* Route Card */}
                  <div style={styles.receiptSectionBox}>
                    <span style={styles.receiptSectionHeader}>ROUTE DETAILS</span>
                    <div style={styles.receiptRouteContainer}>
                      <div style={styles.receiptRouteTimeline}>
                        <div style={styles.receiptDotPickup} />
                        <div style={styles.receiptRouteVertical} />
                        <div style={styles.receiptDotDropoff} />
                      </div>
                      <div style={styles.receiptRouteDetails}>
                        <div>
                          <span style={styles.receiptTagPickup}>PICKUP</span>
                          <p style={styles.receiptAddressText}>{pickup}</p>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          <span style={styles.receiptTagDropoff}>DROPOFF</span>
                          <p style={styles.receiptAddressText}>{dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Details Card */}
                  <div style={styles.receiptSectionBox}>
                    <span style={styles.receiptSectionHeader}>DRIVER & VEHICLE</span>
                    <div style={styles.receiptDriverCard}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={styles.receiptDriverAvatar}>🚖</div>
                          <div>
                            <h4 style={styles.receiptDriverName}>{driverName}</h4>
                            <p style={styles.receiptDriverPlate}>
                              {vehicleNumber} • {carDetails}
                            </p>
                            {driverPhone && <p style={styles.receiptDriverPhone}>📞 {driverPhone}</p>}
                          </div>
                        </div>
                        {driverPhone && (
                          <a href={`tel:${driverPhone}`} style={styles.receiptCallBtn}>
                            <span>📞</span> Call
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta Details Grid */}
                  <div style={styles.receiptMetaGrid}>
                    <div style={styles.receiptMetaItem}>
                      <span style={styles.receiptMetaLabel}>DATE & TIME</span>
                      <span style={styles.receiptMetaValue}>{rideDate}</span>
                    </div>
                    <div style={styles.receiptMetaItem}>
                      <span style={styles.receiptMetaLabel}>RATING GIVEN</span>
                      <span style={{ ...styles.receiptMetaValue, color: '#e63946', fontWeight: '700' }}>
                        {'⭐'.repeat(Math.min(5, Math.max(1, currentRating)))} ({currentRating}/5)
                      </span>
                    </div>
                    <div style={styles.receiptMetaItem}>
                      <span style={styles.receiptMetaLabel}>RIDE TYPE</span>
                      <span style={styles.receiptMetaValue}>{isShared ? 'Shared Cab' : 'Private Cab'}</span>
                    </div>
                    <div style={styles.receiptMetaItem}>
                      <span style={styles.receiptMetaLabel}>VEHICLE TYPE</span>
                      <span style={styles.receiptMetaValue}>{displayVehicleType}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.receiptActionsRow}>
                    <button 
                      onClick={handleShare} 
                      style={styles.receiptShareBtn}
                      title="Share Receipt"
                    >
                      <span>📤</span> Share Receipt
                    </button>
                    <button 
                      onClick={() => { dismissRating(); }} 
                      style={styles.receiptDoneBtn}
                    >
                      Done ✓
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}


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
                                        <p style={styles.driverName}>
                                            {activeRide.driver?.name}
                                            {activeRide.driver?.isVerified && (
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '3px',
                                                        background: 'rgba(16, 185, 129, 0.12)',
                                                        color: '#34d399',
                                                        border: '1px solid rgba(52, 211, 153, 0.3)',
                                                        padding: '2px 7px',
                                                        borderRadius: '12px',
                                                        fontSize: '10.5px',
                                                        fontWeight: '600',
                                                        lineHeight: '1',
                                                        marginLeft: '6px',
                                                        letterSpacing: '0.2px',
                                                        verticalAlign: 'middle'
                                                    }}
                                                    title="Verified Driver"
                                                >
                                                    <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}>
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Verified
                                                </span>
                                            )}
                                                {/* Driver Star Rating Badge (Uber-style) */}
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '3px',
                                                        background: 'rgba(245, 158, 11, 0.12)',
                                                        color: '#f59e0b',
                                                        border: '1px solid rgba(245, 158, 11, 0.3)',
                                                        padding: '2px 7px',
                                                        borderRadius: '12px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        lineHeight: '1',
                                                        marginLeft: '6px',
                                                        verticalAlign: 'middle'
                                                    }}
                                                    title={`Driver Rating: ${(activeRide.driver?.rating || 5.0).toFixed(1)} ★`}
                                                >
                                                    <span style={{ color: '#f59e0b', fontSize: '11px' }}>★</span>
                                                    <span>{(activeRide.driver?.rating || 5.0).toFixed(1)}</span>
                                                </span>
                                        </p>
                                        <p style={styles.driverDetails}>
                                            {activeRide.driver?.vehicleNumber}
                                            {activeRide.driver?.carName && ` • ${activeRide.driver.carName} ${activeRide.driver.carModel}`}
                                            {activeRide.vehicleType && ` • ${activeRide.vehicleType}`}
                                        </p>
                                    </div>
                                </div>
                                {activeRide.driver?.phone && (
                                    <a href={`tel:${activeRide.driver.phone}`}
                                        style={styles.callBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}>
                                        📞 Call Driver
                                    </a>
                                )}
                            </div>
                        )}

                        
            {/* SOS Emergency Button */}
            {(activeRide.status === 'accepted' || activeRide.status === 'ontheway') && (
              <div style={{ marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowSosModal(true)}
                  className="sos-emergency-btn"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    border: '1.5px solid #f87171',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: '800',
                    fontSize: '14.5px',
                    letterSpacing: '0.6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.45)',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                >
                  <span style={{ fontSize: '18px', display: 'inline-block' }}>🚨</span>
                  <span>SOS Emergency Button</span>
                  <span style={{
                    background: 'rgba(255,255,255,0.25)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.4px',
                    marginLeft: 'auto'
                  }}>
                    112 / WhatsApp
                  </span>
                </button>
              </div>
            )}

            {/* Live Tracking Map */}
                        {(activeRide.status === 'ontheway' || activeRide.status === 'accepted') && (
                            <div style={{ marginTop: '16px' }}>
                                <div style={styles.trackingHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                                        <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.3px' }}>
                                            {activeRide.status === 'accepted' ? '🚗 Driver Heading to Pickup' : '🏁 Trip In Progress'}
                                        </span>
                                    </div>
                                    {driverDistance && (
                                        <span style={{ ...styles.driverDistanceTag, background: 'rgba(230, 57, 70, 0.15)', color: '#e63946', border: '1px solid rgba(230, 57, 70, 0.3)', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>
                                            ~{driverDistance} km away
                                        </span>
                                    )}
                                </div>

                                <div style={styles.mapWrapper}>
                                    <MapContainer
                                        center={driverLocation || (ROUTES.find(r => r.destination === activeRide.pickup)?.coords || JUIT_COORDS)}
                                        zoom={13}
                                        style={{ height: '300px', width: '100%' }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                        {/* Overall Journey Dashed Reference Line (Pickup -> Dropoff) */}
                                        {fullRouteCoords.length > 0 && (
                                            <Polyline
                                                positions={fullRouteCoords}
                                                color='#888888'
                                                weight={3}
                                                opacity={0.5}
                                                dashArray='6 6'
                                            />
                                        )}

                                        {/* Live Active Driving Route Line */}
                                        {routeCoords.length > 0 && (
                                            <Polyline
                                                positions={routeCoords}
                                                color='#e63946'
                                                weight={5}
                                                opacity={0.9}
                                            />
                                        )}

                                        {/* Pickup Marker */}
                                        <Marker
                                            position={(ROUTES.find(r => r.destination === activeRide.pickup)?.coords || JUIT_COORDS)}
                                            icon={L.divIcon({
                                                html: `<div style="background:#10b981;color:white;padding:3px 8px;border-radius:10px;display:flex;align-items:center;gap:4px;box-shadow:0 3px 10px rgba(0,0,0,0.6);border:2px solid #ffffff;font-weight:700;font-size:11px;white-space:nowrap;">🟢 ${activeRide.pickup || 'Pickup'}</div>`,
                                                className: '',
                                                iconSize: [90, 26],
                                                iconAnchor: [45, 13]
                                            })}
                                        >
                                            <Popup>Pickup: {activeRide.pickup}</Popup>
                                        </Marker>

                                        {/* Destination Marker */}
                                        {(ROUTES.find(r => r.destination === activeRide.dropoff)?.coords || (activeRide.dropoff === 'JUIT Campus, Waknaghat' ? JUIT_COORDS : null)) && (
                                            <Marker
                                                position={(ROUTES.find(r => r.destination === activeRide.dropoff)?.coords || (activeRide.dropoff === 'JUIT Campus, Waknaghat' ? JUIT_COORDS : null))}
                                                icon={L.divIcon({
                                                    html: `<div style="background:#ef4444;color:white;padding:3px 8px;border-radius:10px;display:flex;align-items:center;gap:4px;box-shadow:0 3px 10px rgba(0,0,0,0.6);border:2px solid #ffffff;font-weight:700;font-size:11px;white-space:nowrap;">🏁 ${activeRide.dropoff || 'Destination'}</div>`,
                                                    className: '',
                                                    iconSize: [90, 26],
                                                    iconAnchor: [45, 13]
                                                })}
                                            >
                                                <Popup>Destination: {activeRide.dropoff}</Popup>
                                            </Marker>
                                        )}

                                        {/* Live Driver Car Marker */}
                                        {driverLocation ? (
                                            <Marker
                                                position={driverLocation}
                                                icon={L.divIcon({
                                                    html: `<div class="driver-marker-pulse" style="background:#e63946;color:#ffffff;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #ffffff;font-size:20px;">🚗</div>`,
                                                    className: 'driver-live-marker',
                                                    iconSize: [40, 40],
                                                    iconAnchor: [20, 20]
                                                })}
                                            >
                                                <Popup>
                                                    <b>{activeRide.driver?.name || 'Your Driver'}</b><br/>
                                                    {activeRide.driver?.vehicleNumber || ''}
                                                </Popup>
                                            </Marker>
                                        ) : null}

                                        <FlyTo coords={driverLocation || (ROUTES.find(r => r.destination === activeRide.pickup)?.coords || JUIT_COORDS)} />
                                    </MapContainer>
                                </div>
                                {!driverLocation && (
                                    <div style={{ background: 'rgba(230, 57, 70, 0.1)', border: '1px solid rgba(230, 57, 70, 0.3)', borderRadius: '8px', padding: '8px 12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px' }}>📡</span>
                                        <span style={{ color: '#e63946', fontSize: '12px', fontWeight: '500' }}>Connecting to driver live GPS feed...</span>
                                    </div>
                                )}
                            </div>
                        )}}

                        {/* Fare Summary */}
                        {activeRide.fare > 0 && (
                            <div style={styles.fareInfo}>
                                <span style={{ color: '#888', fontSize: '13px' }}>Trip Total Fare</span>
                                <span style={styles.fareAmount}>₹{activeRide.fare}</span>
                            </div>
                        )}

                        {/* Ride Cancellation Actions */}
                        {activeRide.status === 'searching' && (
                            <>
                                {searchExpired && (
                                    <div style={{
                                        background: 'rgba(239, 68, 68, 0.12)',
                                        border: '1px solid rgba(239, 68, 68, 0.4)',
                                        borderRadius: '8px',
                                        padding: '12px 14px',
                                        marginBottom: '12px',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ color: '#f87171', fontSize: '13px', fontWeight: '700', margin: '0 0 4px 0' }}>
                                            ⏳ Search Timeout
                                        </p>
                                        <p style={{ color: '#d1d5db', fontSize: '12px', margin: 0 }}>
                                            No drivers available right now. Please cancel and try again later.
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={cancelRide}
                                    style={{
                                        ...styles.cancelBtn,
                                        ...(searchExpired ? {
                                            background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
                                            borderColor: '#e63946',
                                            color: '#ffffff',
                                            boxShadow: '0 4px 16px rgba(230, 57, 70, 0.45)',
                                            fontWeight: '700'
                                        } : {})
                                    }}
                                >
                                    {searchExpired ? 'Cancel & Try Again' : 'Cancel Ride'}
                                </button>
                            </>
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

                        
            {/* SOS Emergency Modal */}
            {showSosModal && (
              <div style={styles.popup}>
                <div style={{
                  ...styles.popupCard,
                  maxWidth: '380px',
                  border: '2px solid #ef4444',
                  boxShadow: '0 0 35px rgba(239, 68, 68, 0.45), 0 25px 60px rgba(0,0,0,0.95)',
                  background: 'linear-gradient(170deg, #1f1113 0%, #121212 100%)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1.5px solid #ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}>
                      🚨
                    </div>
                    <div>
                      <h3 style={{ color: '#ef4444', margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '0.4px' }}>
                        EMERGENCY SOS
                      </h3>
                      <p style={{ color: '#9ca3af', margin: '2px 0 0 0', fontSize: '11.5px' }}>
                        Safety Alert & Emergency Assistance
                      </p>
                    </div>
                  </div>

                  <p style={{ color: '#e5e7eb', fontSize: '13px', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                    If you feel unsafe or in danger, call emergency services immediately or share your live ride coordinates with trusted contacts.
                  </p>

                  {/* Ride Details Summary */}
                  {activeRide && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      marginBottom: '16px',
                      fontSize: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#9ca3af' }}>Driver:</span>
                        <span style={{ color: '#ffffff', fontWeight: '600' }}>{activeRide.driver?.name || 'Assigned Driver'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#9ca3af' }}>Vehicle:</span>
                        <span style={{ color: '#ffffff', fontWeight: '600' }}>
                          {activeRide.driver?.vehicleNumber || 'N/A'} {activeRide.driver?.carName ? '(' + activeRide.driver.carName + ')' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#9ca3af' }}>Pickup:</span>
                        <span style={{ color: '#ffffff', fontWeight: '500', maxWidth: '180px', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {activeRide.pickup}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>Destination:</span>
                        <span style={{ color: '#ffffff', fontWeight: '500', maxWidth: '180px', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {activeRide.dropoff}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Call 112 Button */}
                    <a
                      href="tel:112"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        padding: '13px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: '800',
                        textAlign: 'center',
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.45)',
                        letterSpacing: '0.3px'
                      }}
                    >
                      <span>📞</span> Call 112 (National Emergency)
                    </a>

                    {/* WhatsApp Share Button */}
                    <a
                      href={getSosWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        color: '#ffffff',
                        padding: '13px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontSize: '14.5px',
                        fontWeight: '700',
                        textAlign: 'center',
                        boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
                        letterSpacing: '0.2px'
                      }}
                    >
                      <span>💬</span> Share Ride on WhatsApp
                    </a>

                    {/* Cancel / Dismiss Button */}
                    <button
                      type="button"
                      onClick={() => setShowSosModal(false)}
                      style={{
                        marginTop: '4px',
                        padding: '11px',
                        background: '#222222',
                        color: '#d1d5db',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '13.5px',
                        fontWeight: '600'
                      }}
                    >
                      ✕ Dismiss / I'm Safe
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Post-ride Rating */}
            {activeRide && activeRide.status === 'completed' && !rated && (
              <div style={styles.ratingBox}>
                <p style={{ color: '#ffffff', fontWeight: '600', margin: '0 0 10px 0' }}>Rate your ride experience</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} onClick={() => rateRide(star)}
                      style={{ fontSize: '32px', cursor: 'pointer', color: star <= rating ? '#e63946' : '#333', transition: 'color 0.2s' }}>⭐</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={dismissRating} style={styles.skipRatingBtn}>
                    Skip Rating
                  </button>
                  <button onClick={() => { if (activeRide || completedRide) setReceiptRide(activeRide || completedRide); setShowReceipt(true); }} style={styles.viewReceiptBtn}>
                    🧾 View Receipt
                  </button>
                </div>
              </div>
            )}
            {rated && (
              <div style={{ textAlign: 'center', margin: '14px 0', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
                <p style={{ color: '#10b981', fontWeight: '700', margin: '0 0 8px 0', fontSize: '15px' }}>✅ Rated {rating} stars!</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={dismissRating} style={styles.doneRatingBtn}>
                    Done ✓
                  </button>
                  <button onClick={() => setShowReceipt(true)} style={styles.viewReceiptBtn}>
                    🧾 View Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rating for completed shared ride passengers */}
        {!activeRide && completedRide && !rated && (
          <div style={styles.ratingBox}>
            <p style={{ color: '#ffffff', fontWeight: '600', margin: '0 0 10px 0' }}>Rate your ride experience</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => rateRide(star)}
                  style={{ fontSize: '32px', cursor: 'pointer', color: star <= rating ? '#e63946' : '#333', transition: 'color 0.2s' }}>⭐</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={dismissRating} style={styles.skipRatingBtn}>
                Skip Rating
              </button>
              <button onClick={() => { if (completedRide) setReceiptRide(completedRide); setShowReceipt(true); }} style={styles.viewReceiptBtn}>
                🧾 View Receipt
              </button>
            </div>
          </div>
        )}
        {!activeRide && rated && (
          <div style={{ textAlign: 'center', margin: '14px 0', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
            <p style={{ color: '#10b981', fontWeight: '700', margin: '0 0 8px 0', fontSize: '15px' }}>✅ Rated {rating} stars!</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={dismissRating} style={styles.doneRatingBtn}>
                Done ✓
              </button>
              <button onClick={() => setShowReceipt(true)} style={styles.viewReceiptBtn}>
                🧾 View Receipt
              </button>
            </div>
          </div>
        )}
        {/* BOOKING INTERFACE */}
                {!activeRide && !completedRide && (
                    <div style={styles.bookCard}>
                        <div style={styles.bookCardHeader}>
                            <h3 style={styles.bookTitle}>Book a Ride</h3>
                            <span style={styles.facultyPriorityTag}>👨‍🏫 Faculty Priority</span>
                        </div>

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

                            {/* Vehicle Cards with Realistic SVG Illustrations */}
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
                                                <svg width="76" height="34" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', marginBottom: '2px' }}>
                          <span style={styles.vehicleTypeTxt}>Sedan (4+1)</span>
                          <span style={styles.capacityBadge}>👥 4 seats</span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', marginBottom: '2px' }}>
                          <span style={styles.vehicleTypeTxt}>SUV (6+1)</span>
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
                                        min={new Date(new Date().getTime() + (30 * 60 * 1000)).toISOString().slice(0, 16)}
                                        max={new Date(new Date().getTime() + (48 * 60 * 60 * 1000)).toISOString().slice(0, 16)}
                                        required={isScheduled}
                                    />
                                </div>
                            )}

                            {/* Dynamic Availability Status Indicator */}
                            {selectedVehicle && availabilityInfo && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    marginBottom: '14px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    background: availabilityInfo.reason === 'no_drivers' ? 'rgba(239, 68, 68, 0.12)' :
                                                availabilityInfo.reason === 'all_busy' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                    border: `1px solid ${availabilityInfo.reason === 'no_drivers' ? 'rgba(239, 68, 68, 0.4)' :
                                                         availabilityInfo.reason === 'all_busy' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                                    color: availabilityInfo.reason === 'no_drivers' ? '#f87171' :
                                           availabilityInfo.reason === 'all_busy' ? '#fbbf24' : '#34d399'
                                }}>
                                    <span>
                                        {availabilityInfo.reason === 'no_drivers' ? '🔴' :
                                         availabilityInfo.reason === 'all_busy' ? '🟠' : '🟢'}
                                    </span>
                                    <span>{availabilityInfo.message}</span>
                                </div>
                            )}

                            {/* Large Bold Red Gradient Button */}
                            <button
                                className={selectedVehicle && driversAvailable && !booking ? "traverse-btn-primary" : ""}
                                style={selectedVehicle && driversAvailable && !booking ? styles.bookBtn : styles.bookBtnDisabled}
                                type='submit'
                                disabled={!selectedVehicle || !driversAvailable || booking}>
                                {booking ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        Booking...
                                    </div>
                                ) : !selectedVehicle ? 'Select vehicle to continue' :
                                    !driversAvailable ? (availabilityInfo?.reason === 'all_busy' ? 'All Drivers Busy' : 'No Drivers Online') :
                                        `🚖 Request ${selectedVehicle} Ride — ₹${fare}`}
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
        marginRight: '4px'
    },
    facultyBadge: {
        background: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        padding: '3px 8px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        marginRight: '4px',
        whiteSpace: 'nowrap'
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
    viewReceiptBtn: {
    padding: '8px 16px',
    background: 'rgba(230, 57, 70, 0.15)',
    color: '#ff4d5a',
    border: '1px solid rgba(230, 57, 70, 0.45)',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  receiptOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.82)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  receiptSheet: {
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'linear-gradient(180deg, #181818 0%, #101010 100%)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderBottom: 'none',
    padding: '16px 20px 32px 20px',
    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(230, 57, 70, 0.15)',
    animation: 'slideUpSheet 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    boxSizing: 'border-box'
  },
  receiptDragBar: {
    width: '42px',
    height: '4px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.2)',
    margin: '0 auto 14px auto'
  },
  receiptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  receiptHeaderTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  receiptLogoBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.25) 0%, rgba(20, 20, 20, 0.9) 100%)',
    border: '1px solid rgba(230, 57, 70, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(230, 57, 70, 0.35)'
  },
  receiptTitle: {
    fontSize: '14px',
    fontWeight: '900',
    letterSpacing: '1.2px',
    color: '#ffffff',
    display: 'block',
    lineHeight: '1.2'
  },
  receiptSubtitle: {
    fontSize: '10.5px',
    color: '#888888',
    fontWeight: '600',
    display: 'block'
  },
  receiptCloseBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700'
  },
  receiptFareCard: {
    background: 'linear-gradient(135deg, #1f0a0d 0%, #2a0e12 50%, #150608 100%)',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    borderRadius: '16px',
    padding: '18px 16px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(230, 57, 70, 0.18)',
    marginBottom: '16px'
  },
  receiptFareLabel: {
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    color: '#ff8c94',
    display: 'block',
    marginBottom: '2px'
  },
  receiptFareAmount: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 10px 0',
    lineHeight: '1.1',
    textShadow: '0 0 20px rgba(230, 57, 70, 0.6)'
  },
  receiptFareTagsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    flexWrap: 'wrap'
  },
  receiptPillGreen: {
    fontSize: '10.5px',
    fontWeight: '800',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    padding: '3px 8px',
    borderRadius: '12px'
  },
  receiptPillRed: {
    fontSize: '10.5px',
    fontWeight: '800',
    background: 'rgba(230, 57, 70, 0.15)',
    color: '#ff4d5a',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    padding: '3px 8px',
    borderRadius: '12px'
  },
  receiptPillDark: {
    fontSize: '10.5px',
    fontWeight: '700',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#dddddd',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '3px 8px',
    borderRadius: '12px'
  },
  receiptDashedLine: {
    width: '100%',
    height: '1px',
    borderBottom: '1px dashed rgba(255, 255, 255, 0.15)',
    margin: '16px 0'
  },
  receiptSectionBox: {
    marginBottom: '14px'
  },
  receiptSectionHeader: {
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: '#888888',
    display: 'block',
    marginBottom: '8px'
  },
  receiptRouteContainer: {
    display: 'flex',
    gap: '12px',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  receiptRouteTimeline: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4px',
    paddingBottom: '4px'
  },
  receiptDotPickup: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 6px rgba(16, 185, 129, 0.7)'
  },
  receiptRouteVertical: {
    width: '2px',
    flex: 1,
    minHeight: '22px',
    background: 'linear-gradient(to bottom, #10b981 0%, #e63946 100%)',
    margin: '3px 0'
  },
  receiptDotDropoff: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    background: '#e63946',
    boxShadow: '0 0 6px rgba(230, 57, 70, 0.7)'
  },
  receiptRouteDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  receiptTagPickup: {
    fontSize: '8.5px',
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: '0.8px',
    display: 'block'
  },
  receiptTagDropoff: {
    fontSize: '8.5px',
    fontWeight: '800',
    color: '#e63946',
    letterSpacing: '0.8px',
    display: 'block'
  },
  receiptAddressText: {
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    margin: '1px 0 0 0'
  },
  receiptDriverCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '12px 14px',
    marginBottom: '14px'
  },
  receiptDriverAvatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'rgba(230, 57, 70, 0.12)',
    border: '1px solid rgba(230, 57, 70, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  receiptDriverName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 2px 0'
  },
  receiptDriverPlate: {
    fontSize: '11px',
    color: '#999999',
    margin: 0
  },
  receiptDriverPhone: {
    fontSize: '11px',
    color: '#10b981',
    fontWeight: '600',
    margin: '2px 0 0 0'
  },
  receiptCallBtn: {
    padding: '7px 12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
  },
  receiptMetaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '18px'
  },
  receiptMetaItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  receiptMetaLabel: {
    fontSize: '9px',
    color: '#777777',
    fontWeight: '800',
    letterSpacing: '0.6px',
    marginBottom: '2px'
  },
  receiptMetaValue: {
    fontSize: '11.5px',
    color: '#eeeeee',
    fontWeight: '600'
  },
  receiptActionsRow: {
    display: 'flex',
    gap: '10px'
  },
  receiptShareBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 4px 16px rgba(230, 57, 70, 0.4)'
  },
  receiptDoneBtn: {
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700'
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
    facultyPriorityTag: {
        fontSize: '11px',
        color: '#f59e0b',
        fontWeight: '700',
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '4px 8px',
        borderRadius: '6px'
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
    padding: '12px 14px',
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
    width: '76px',
    flexShrink: 0
  },
    vehicleInfo: {
    flex: 1,
    minWidth: 0
  },
    vehicleTypeTxt: {
    fontWeight: '800',
    margin: 0,
    fontSize: '14px',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.2px'
  },
    capacityBadge: {
    fontSize: '10.5px',
    color: '#999999',
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px'
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
    noDriverNotice: {
        background: 'rgba(230, 57, 70, 0.1)',
        border: '1px solid #e63946',
        color: '#ff6b6b',
        padding: '12px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '600'
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

export default FacultyDashboard;
