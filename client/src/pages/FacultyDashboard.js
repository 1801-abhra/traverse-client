import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { requestNotificationPermission } from '../firebase';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import AboutModal from '../components/AboutModal';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const JUIT_COORDS = [30.8826, 77.1490];

const ROUTES = [
    { destination: 'JUIT Campus, Waknaghat', fare4: 200, fare6: 300, disc4: null, disc6: null, coords: [30.8826, 77.1490] },
    { destination: 'Waknaghat', fare4: 200, fare6: 300, disc4: null, disc6: null, coords: [30.8826, 77.1490] },
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

let socket;

function FlyTo({ coords }) {
    const map = useMap();
    useEffect(() => { if (coords) map.flyTo(coords, 15); }, [coords, map]);
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
    const [rating, setRating] = useState(0);
    const [rated, setRated] = useState(false);
    const [activeRide, setActiveRide] = useState(null);
    const [message, setMessage] = useState('');
    const [fare, setFare] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [studentLocation, setStudentLocation] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [driverDistance, setDriverDistance] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [booking, setBooking] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const API = 'https://traverse-app.onrender.com';

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
            if (!completedRide) setActiveRide(null);
        } finally {
            setPageLoading(false);
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
        socket.emit('join', { userId: user._id, role: 'student' });
        requestNotificationPermission().then(fcmToken => {
            if (fcmToken) {
                axios.post(`${API}/api/auth/save-token`, { fcmToken },
                    { headers: { Authorization: `Bearer ${token}` } });
            }
        });
        socket.on('ride:accepted', (ride) => {
            setActiveRide(ride);
            setDriverLocation(null);
            showToast(`🚗 ${ride.driver.name} accepted your ride!`, 'accepted');
        });
        socket.on('ride:updated', (ride) => {
            if (ride.status === 'cancelled') {
                setActiveRide(null);
                setMessage('Ride cancelled.');
                return;
            }
            setActiveRide(ride);
            if (ride.status === 'completed') {
                setCompletedRide(ride);
                showToast('✅ Ride completed! Please rate your experience.', 'success');
                setDriverLocation(null);
            }
            if (ride.status === 'ontheway') {
                showToast('🚗 Driver is on the way!', 'info');
            }
        });
        socket.on('driver:location', ({ lat, lng }) => {
            setDriverLocation([lat, lng]);
            if (studentLocation) getRoute([lat, lng], studentLocation);
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
            if (selectedVehicle === '4+1') setFare(isNight ? 300 : 200);
            else setFare(isNight ? 450 : 300);
        }
    }, [scheduledTime, isScheduled, selectedRoute, selectedVehicle]);

    const bookRide = async (e) => {
        e.preventDefault();
        if (booking) return;
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

    const rateRide = async (stars) => {
        try {
            const rideId = activeRide?._id || completedRide?._id;
            await axios.put(
                `${API}/api/rides/rate/${rideId}`,
                { rating: stars },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRating(stars);
            setRated(true);
            setActiveRide(null);
            setCompletedRide(null);
            setMessage('Thanks for rating! ⭐');
        } catch (err) {
            setMessage('Rating failed');
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
        searching: '#f59e0b', accepted: '#e63946',
        ontheway: '#e63946', completed: '#10b981', cancelled: '#666'
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
                        <span style={styles.navLogo}>🚖</span>
                        <span style={styles.navTitle}>TRAVERSE</span>
                    </div>
                </div>
                <Spinner text='Loading faculty dashboard...' />
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
                    <span style={styles.facultyBadge}>👨‍🏫 Faculty</span>
                    <button onClick={fetchActiveRide} style={styles.navBtn}>🔄 Refresh</button>
                    <button onClick={() => navigate('/history')} style={styles.navBtn}>📋 History</button>
                    <button onClick={() => setShowAbout(true)} style={styles.navBtn}>ℹ️ About</button>
                    <button onClick={logout} style={styles.navBtnRed}>🚪 Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                {message && (
                    <div style={styles.messagebox}>
                        <span>ℹ️</span> {message}
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
                            <div style={styles.routePoint}><span>🟢</span><span>{activeRide.pickup}</span></div>
                            <div style={styles.routeLine}>|</div>
                            <div style={styles.routePoint}><span>🔴</span><span>{activeRide.dropoff}</span></div>
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
                                        </p>
                                    </div>
                                </div>
                                {activeRide.driver?.phone && (
                                    <a href={`tel:${activeRide.driver.phone}`} style={styles.callBtn} onClick={(e) => e.stopPropagation()}>
                                        📞 Call Driver
                                    </a>
                                )}
                            </div>
                        )}

                        {(activeRide.status === 'ontheway' || activeRide.status === 'accepted') && (
                            <div style={{ marginTop: '16px' }}>
                                <p style={{ color: '#999', fontSize: '14px', marginBottom: '8px' }}>
                                    🗺️ Live Tracking
                                    {driverDistance && <span style={{ color: '#e63946', marginLeft: '8px' }}>~{driverDistance} km away</span>}
                                </p>
                                {driverLocation ? (
                                    <MapContainer center={driverLocation} zoom={13} style={{ height: '280px', borderRadius: '12px' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        {routeCoords.length > 0 && (
                                            <Polyline positions={routeCoords} color='#e63946' weight={4} opacity={0.8} />
                                        )}
                                        <Marker position={driverLocation} icon={L.divIcon({ html: '🚗', className: '', iconSize: [32, 32], iconAnchor: [16, 16] })}>
                                            <Popup>Your Driver</Popup>
                                        </Marker>
                                        {studentLocation && (
                                            <Marker position={studentLocation} icon={L.divIcon({ html: '📍', className: '', iconSize: [32, 32], iconAnchor: [16, 32] })}>
                                                <Popup>Your Location</Popup>
                                            </Marker>
                                        )}
                                        <FlyTo coords={driverLocation} />
                                    </MapContainer>
                                ) : (
                                    <div style={{ background: '#1a1a1a', height: '200px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <p style={{ color: '#666' }}>⏳ Waiting for driver location...</p>
                                    </div>
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

                        {activeRide.status === 'accepted' && (
                            <button onClick={() => setShowCancelPopup(true)} style={styles.cancelBtn}>Cancel Ride</button>
                        )}

                        {showCancelPopup && (
                            <div style={styles.popup}>
                                <div style={styles.popupCard}>
                                    <h3 style={{ color: 'white', marginBottom: '8px' }}>⚠️ Cancel Ride?</h3>
                                    <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
                                        Cancelling after driver acceptance may result in blacklisting after 5 times.
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={cancelAcceptedRide} style={{ ...styles.cancelBtn, flex: 1 }}>Yes, Cancel</button>
                                        <button onClick={() => setShowCancelPopup(false)}
                                            style={{ flex: 1, padding: '10px', background: '#1a1a1a', color: '#999', border: '1px solid #2a2a2a', borderRadius: '8px', cursor: 'pointer' }}>
                                            No, Keep Ride
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                <button onClick={() => { setActiveRide(null); setCompletedRide(null); }}
                                    style={{ ...styles.cancelBtn, marginTop: '12px', fontSize: '13px' }}>
                                    Skip Rating
                                </button>
                            </div>
                        )}
                        {rated && (
                            <div>
                                <p style={{ color: '#10b981', marginTop: '8px' }}>✅ Rated {rating} stars!</p>
                                <button onClick={() => { setActiveRide(null); setCompletedRide(null); }}
                                    style={{ ...styles.cancelBtn, marginTop: '12px', color: '#10b981', borderColor: '#10b981' }}>
                                    Done ✓
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!activeRide && completedRide && !rated && (
                    <div style={styles.ratingBox}>
                        <p style={{ color: '#999', marginBottom: '8px' }}>Rate your experience</p>
                        <div>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} onClick={() => rateRide(star)}
                                    style={{ fontSize: '32px', cursor: 'pointer', color: star <= rating ? '#e63946' : '#333' }}>★</span>
                            ))}
                        </div>
                        <button onClick={() => setCompletedRide(null)} style={{ ...styles.cancelBtn, marginTop: '12px' }}>
                            Skip Rating
                        </button>
                    </div>
                )}
                {!activeRide && rated && (
                    <div>
                        <p style={{ color: '#10b981', marginTop: '8px' }}>✅ Rated {rating} stars!</p>
                        <button onClick={() => setCompletedRide(null)}
                            style={{ ...styles.cancelBtn, marginTop: '12px', color: '#10b981', borderColor: '#10b981' }}>
                            Done ✓
                        </button>
                    </div>
                )}

                {!activeRide && !completedRide && (
                    <div style={styles.bookCard}>
                        <h3 style={styles.bookTitle}>Book a Ride</h3>
                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>👨‍🏫 Faculty Priority Booking</p>

                        <form onSubmit={bookRide}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Pickup Location</label>
                                <select style={styles.select} value={selectedPickup}
                                    onChange={e => { setSelectedPickup(e.target.value); setSelectedRoute(null); setSelectedVehicle(null); setFare(null); }} required>
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

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Select Destination</label>
                                <select style={styles.select} value={selectedRoute ? selectedRoute.destination : ''}
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
                                    }} required>
                                    <option value=''>Choose destination...</option>
                                    {ROUTES.filter(r => {
                                        if (selectedPickup === 'JUIT Campus, Waknaghat') return r.destination !== 'JUIT Campus, Waknaghat';
                                        return r.destination === 'JUIT Campus, Waknaghat';
                                    }).map(route => (
                                        <option key={route.destination} value={route.destination}>{route.destination}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedRoute && (
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Select Vehicle Type</label>
                                    <div style={styles.vehicleCards}>
                                        <div onClick={() => {
                                            setSelectedVehicle('4+1'); checkDriversAvailable('4+1');
                                            if (selectedRoute.destination !== 'Waknaghat') setFare(selectedRoute.disc4 || selectedRoute.fare4);
                                        }}
                                            style={{ ...styles.vehicleCard, ...(selectedVehicle === '4+1' ? styles.vehicleCardActive : {}) }}>
                                            <div style={styles.vehicleIcon}>🚗</div>
                                            <div style={styles.vehicleInfo}>
                                                <p style={styles.vehicleTypeTxt}>4+1 Sedan</p>
                                                <p style={styles.vehicleSeats}>Up to 4 passengers</p>
                                            </div>
                                            <div style={styles.vehicleFare}>
                                                {selectedRoute.disc4 ? (
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

                                        <div onClick={() => {
                                            setSelectedVehicle('6+1'); checkDriversAvailable('6+1');
                                            if (selectedRoute.destination !== 'Waknaghat') setFare(selectedRoute.disc6 || selectedRoute.fare6);
                                        }}
                                            style={{ ...styles.vehicleCard, ...(selectedVehicle === '6+1' ? styles.vehicleCardActive : {}) }}>
                                            <div style={styles.vehicleIcon}>🚐</div>
                                            <div style={styles.vehicleInfo}>
                                                <p style={styles.vehicleTypeTxt}>6+1 SUV</p>
                                                <p style={styles.vehicleSeats}>Up to 6 passengers</p>
                                            </div>
                                            <div style={styles.vehicleFare}>
                                                {selectedRoute.disc6 ? (
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

                            {!driversAvailable && selectedVehicle && (
                                <div style={{ background: '#1a0000', border: '1px solid #e63946', color: '#ff6b6b', padding: '12px', borderRadius: '10px', marginBottom: '12px', fontSize: '14px' }}>
                                    🔴 No drivers available right now. Try again later.
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

                            <button
                                style={selectedVehicle && driversAvailable && !booking ? styles.bookBtn : styles.bookBtnDisabled}
                                type='submit'
                                disabled={!selectedVehicle || !driversAvailable || booking}>
                                {booking ? '⏳ Booking...' :
                                    !selectedVehicle ? 'Select vehicle to continue' :
                                        !driversAvailable ? 'No drivers available' :
                                            `🚖 Request ${selectedVehicle} Ride — ₹${fare}`}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'Inter, sans-serif' },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: window.innerWidth <= 768 ? '12px 16px' : '16px 32px', background: '#111', borderBottom: '1px solid #1a1a1a', boxShadow: '0 2px 20px rgba(0,0,0,0.5)', flexWrap: 'wrap', gap: '8px' },
    navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
    navLogo: { fontSize: '24px' },
    navTitle: { fontSize: '20px', fontWeight: '800', letterSpacing: '3px', color: '#e63946' },
    navRight: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
    facultyBadge: { background: '#1a0a00', color: '#f59e0b', border: '1px solid #f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    navBtn: { background: 'transparent', color: '#999', border: '1px solid #2a2a2a', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease' },
    navBtnRed: { background: 'transparent', color: '#e63946', border: '1px solid #e63946', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease' },
    content: { maxWidth: '720px', margin: '24px auto', padding: '0 16px' },
    messagebox: { background: '#111', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', borderLeft: '3px solid #e63946', fontSize: '14px', color: '#ccc', display: 'flex', gap: '8px' },
    rideCard: { background: '#111', border: '1px solid #1a1a1a', padding: window.innerWidth <= 768 ? '16px' : '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' },
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
    cancelBtn: { padding: '10px 20px', background: 'transparent', color: '#e63946', border: '1px solid #e63946', borderRadius: '8px', cursor: 'pointer', marginTop: '12px', fontSize: '14px', width: '100%' },
    popup: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    popupCard: { background: '#111', border: '1px solid #2a2a2a', padding: '24px', borderRadius: '16px', maxWidth: '320px', width: '90%' },
    ratingBox: { marginTop: '16px', padding: '16px', background: '#0a0a0a', borderRadius: '10px', textAlign: 'center' },
    bookCard: { background: '#111', border: '1px solid #1a1a1a', padding: window.innerWidth <= 768 ? '16px' : '24px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' },
    bookTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '8px', marginTop: 0 },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', color: '#555', fontSize: '11px', fontWeight: '600', marginBottom: '8px', letterSpacing: '1.5px' },
    select: { width: '100%', padding: '14px 16px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '10px', color: 'white', fontSize: '15px', outline: 'none', cursor: 'pointer' },
    vehicleCards: { display: 'flex', flexDirection: 'column', gap: '12px' },
    vehicleCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' },
    vehicleCardActive: { border: '2px solid #e63946', background: '#1a0000' },
    vehicleIcon: { fontSize: '28px' },
    vehicleInfo: { flex: 1 },
    vehicleTypeTxt: { fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px' },
    vehicleSeats: { color: '#666', fontSize: '13px', margin: 0 },
    vehicleFare: { textAlign: 'right' },
    originalFare: { display: 'block', color: '#666', fontSize: '13px', textDecoration: 'line-through' },
    discountedFare: { display: 'block', color: '#e63946', fontSize: '20px', fontWeight: '700' },
    discountBadge: { display: 'inline-block', background: '#e6394622', color: '#e63946', border: '1px solid #e63946', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
    scheduleRow: { marginBottom: '12px' },
    scheduleLabel: { color: '#999', fontSize: '14px', cursor: 'pointer' },
    dateInput: { width: '100%', padding: '12px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' },
    bookBtn: { width: '100%', padding: '16px', background: '#e63946', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(230,57,70,0.4)', transition: 'all 0.2s ease' },
    bookBtnDisabled: { width: '100%', padding: '16px', background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a', borderRadius: '10px', fontSize: '16px', cursor: 'not-allowed' },
};

export default FacultyDashboard;