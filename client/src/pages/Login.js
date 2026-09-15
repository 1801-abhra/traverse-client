import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCarAnimation, setShowCarAnimation] = useState(true);
  const [aboutTab, setAboutTab] = useState('about');
  const animTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up animation elements from DOM after 5 seconds
    animTimerRef.current = setTimeout(() => {
      setShowCarAnimation(false);
    }, 5000);

    return () => {
      if (animTimerRef.current) {
        clearTimeout(animTimerRef.current);
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        'https://traverse-app.onrender.com/api/auth/login',
        { email, password },
        { withCredentials: false }
      );
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('sessionToken', data.sessionToken);
      if (data.role === 'student') navigate('/student');
      else navigate('/driver');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const resendVerification = async () => {
    try {
      await axios.post(
        'https://traverse-app.onrender.com/api/auth/resend-verification',
        { email },
        { withCredentials: false }
      );
      setError('Verification email sent! Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes bgGradientMove {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        @keyframes floatTaxi {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-7px) rotate(-3deg);
          }
        }
        @keyframes slideUpIn {
          0% {
            opacity: 0;
            transform: translateY(32px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.08);
          }
        }
        @keyframes driveAcross3D {
          0% {
            transform: translateX(-340px) perspective(600px) rotateY(-8deg) rotateX(4deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 340px)) perspective(600px) rotateY(-3deg) rotateX(2deg);
            opacity: 0;
          }
        }
        @keyframes fadeOutRoadScene {
          0% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes wheelSpinAnim {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .traverse-input:focus {
          border-color: #e63946 !important;
          box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.25), 0 0 16px rgba(230, 57, 70, 0.4) !important;
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
        .traverse-btn-outline:hover {
          background: rgba(230, 57, 70, 0.15) !important;
          border-color: #e63946 !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .traverse-btn-outline:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* 3D Car Driving Animation Scene (One-time on page load, passes behind login portal card) */}
      {showCarAnimation && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '290px',
            height: '150px',
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden',
            animation: 'fadeOutRoadScene 4.6s ease-out forwards'
          }}
        >
          {/* Glowing Cyber Highway Track passing behind the login card */}
          <div
            style={{
              position: 'absolute',
              top: '92px',
              left: '-10%',
              width: '120%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(230, 57, 70, 0.3) 15%, #e63946 50%, rgba(230, 57, 70, 0.3) 85%, transparent 100%)',
              boxShadow: '0 0 16px rgba(230, 57, 70, 0.7), 0 0 32px rgba(230, 57, 70, 0.35)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '74px',
              left: '-10%',
              width: '120%',
              height: '24px',
              background: 'linear-gradient(180deg, rgba(230, 57, 70, 0.06) 0%, rgba(230, 57, 70, 0) 100%)',
              borderBottom: '1px dashed rgba(230, 57, 70, 0.25)'
            }}
          />

          {/* 3D Moving Car Track - crosses behind the login card from left to right */}
          <div
            style={{
              position: 'absolute',
              top: '36px',
              left: 0,
              width: '100%',
              animation: 'driveAcross3D 3.6s cubic-bezier(0.22, 0.45, 0.35, 0.98) forwards'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '190px',
                height: '65px',
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.95))'
              }}
            >
              {/* Blurred Underbody Shadow */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '-10px',
                  width: '210px',
                  height: '20px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '50%',
                  filter: 'blur(9px)'
                }}
              />

              {/* Headlight Beam Projecting Forward */}
              <div
                style={{
                  position: 'absolute',
                  right: '-160px',
                  bottom: '8px',
                  width: '160px',
                  height: '42px',
                  background: 'linear-gradient(90deg, rgba(255, 255, 230, 0.55) 0%, rgba(255, 240, 180, 0.18) 60%, rgba(255, 240, 180, 0) 100%)',
                  clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                  filter: 'blur(2px)'
                }}
              />

              {/* Speed Lines Behind Car */}
              <div
                style={{
                  position: 'absolute',
                  left: '-120px',
                  top: '18px',
                  width: '110px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 75%, transparent 100%)',
                  borderRadius: '2px',
                  filter: 'blur(0.5px)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-150px',
                  top: '28px',
                  width: '140px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(230,57,70,0.6) 80%, transparent 100%)',
                  borderRadius: '2px',
                  filter: 'blur(0.5px)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-95px',
                  top: '38px',
                  width: '85px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
                  borderRadius: '2px',
                  filter: 'blur(0.5px)'
                }}
              />

              {/* Main 3D Car Body */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: 0,
                  width: '175px',
                  height: '34px',
                  background: 'linear-gradient(180deg, #ff4d5a 0%, #e63946 45%, #9e1522 100%)',
                  borderRadius: '14px 30px 6px 8px',
                  boxShadow: 'inset 0 2.5px 5px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.55), 0 0 16px rgba(230,57,70,0.4)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {/* Subtle Reflection Highlight Stripe */}
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '8px',
                    width: '140px',
                    height: '4px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)',
                    borderRadius: '2px'
                  }}
                />

                {/* Chrome Side Trim Accent */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '42px',
                    width: '80px',
                    height: '2px',
                    background: 'linear-gradient(90deg, # silver, #ffffff, #888888)',
                    boxShadow: '0 0 4px rgba(255,255,255,0.5)'
                  }}
                />

                {/* Front Headlight */}
                <div
                  style={{
                    position: 'absolute',
                    right: '3px',
                    top: '8px',
                    width: '9px',
                    height: '9px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    boxShadow: '0 0 12px #ffffff, 0 0 24px #ffd166, 0 0 35px #e63946'
                  }}
                />

                {/* Rear Glowing Taillight */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0px',
                    top: '6px',
                    width: '6px',
                    height: '12px',
                    background: '#ff2a3b',
                    borderRadius: '3px 0 0 3px',
                    boxShadow: '-4px 0 12px #ff2a3b, -10px 0 24px rgba(255,42,59,0.7)'
                  }}
                />

                {/* Front Bumper Air Vent */}
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    bottom: '4px',
                    width: '16px',
                    height: '5px',
                    background: '#111111',
                    borderRadius: '2px',
                    border: '0.5px solid #333333'
                  }}
                />
              </div>

              {/* 3D Car Cabin & Roof */}
              <div
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '46px',
                  width: '78px',
                  height: '26px',
                  background: 'linear-gradient(180deg, #b81d2c 0%, #87121e 100%)',
                  borderRadius: '14px 24px 0 0',
                  transform: 'perspective(300px) rotateX(6deg) skewX(-11deg)',
                  boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.35)',
                  borderTop: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                {/* Windshield */}
                <div
                  style={{
                    position: 'absolute',
                    right: '-2px',
                    top: '3px',
                    width: '24px',
                    height: '19px',
                    background: 'rgba(17, 21, 28, 0.85)',
                    borderRadius: '2px 9px 0 0',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(2px)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.6)'
                  }}
                />
                {/* Side Windows */}
                <div
                  style={{
                    position: 'absolute',
                    left: '6px',
                    top: '3px',
                    width: '46px',
                    height: '19px',
                    background: 'rgba(17, 21, 28, 0.85)',
                    borderRadius: '7px 2px 0 0',
                    border: '1px solid rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(2px)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.6)'
                  }}
                />
              </div>

              {/* Front Wheel */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '18px',
                  width: '28px',
                  height: '28px',
                  background: 'radial-gradient(circle, #252525 35%, #111111 65%, #000000 100%)',
                  borderRadius: '50%',
                  border: '2px solid #2e2e2e',
                  boxShadow: '0 5px 10px rgba(0,0,0,0.85), inset 0 0 6px rgba(230,57,70,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                {/* 3D Chrome Rim */}
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffffff 15%, #c0c0c0 50%, #444444 100%)',
                    border: '1px solid #ffffff',
                    animation: 'wheelSpinAnim 0.3s linear infinite'
                  }}
                />
              </div>

              {/* Rear Wheel */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '22px',
                  width: '28px',
                  height: '28px',
                  background: 'radial-gradient(circle, #252525 35%, #111111 65%, #000000 100%)',
                  borderRadius: '50%',
                  border: '2px solid #2e2e2e',
                  boxShadow: '0 5px 10px rgba(0,0,0,0.85), inset 0 0 6px rgba(230,57,70,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                {/* 3D Chrome Rim */}
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffffff 15%, #c0c0c0 50%, #444444 100%)',
                    border: '1px solid #ffffff',
                    animation: 'wheelSpinAnim 0.3s linear infinite'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Ambient Red Glow Behind Login Card */}
      <div style={styles.ambientGlow} />

      {/* Main Login Card Container */}
      <div style={styles.mobileContainer}>
        {/* Header with floating Taxi and glow */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <img
              src="/3d-taxi.webp"
              alt="Traverse 3D Taxi"
              style={styles.floatingTaxiImg}
            />
          </div>
          <h1 style={styles.brandTitle}>TRAVERSE</h1>
          <p style={styles.brandTagline}>
            University Cab Service <span style={styles.redText}>•</span> JUIT Solan
          </p>

          {/* Feature Badge Pills */}
          <div style={styles.featurePills}>
            <span style={styles.pill}>⚡ Instant Booking</span>
            <span style={styles.pill}>👥 Share & Save</span>
            <span style={styles.pill}>🛡️ Verified Drivers</span>
          </div>
        </div>

        {/* 3D Perspective Card Wrapper */}
        <div style={styles.cardPerspective}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Welcome Back</h2>
              <p style={styles.cardSubtitle}>Sign in to your Traverse account</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorText}>⚠️ {error}</div>
                {error.includes('verify') && (
                  <button
                    onClick={resendVerification}
                    style={styles.verifyBtn}
                    type="button"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>UNIVERSITY EMAIL</label>
                <input
                  type="email"
                  className="traverse-input"
                  style={styles.input}
                  placeholder="name@juitsolan.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.passwordLabelRow}>
                  <label style={styles.label}>PASSWORD</label>
                  <Link to="/forgot-password" style={styles.forgotLink}>
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  className="traverse-input"
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Bold Primary Gradient Button */}
              <button
                className={loading ? '' : 'traverse-btn-primary'}
                style={loading ? styles.btnLoading : styles.btnPrimary}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In →'}
              </button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>New to Traverse?</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Outlined Register Button */}
            <Link to="/register" className="traverse-btn-outline" style={styles.btnOutline}>
              Create Account
            </Link>

            <div style={styles.adminFooter}>
              <span>Admin portal? </span>
              <Link to="/admin" style={styles.adminLink}>
                Admin Panel
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Brand Tagline Banner */}
        <div style={styles.taglineBanner}>
          <div style={styles.taglineGlowLine} />
          <div style={styles.taglineContent}>
            <div style={styles.tagline3dCarWrap}><img src="/3d-taxi.webp" alt="3D Taxi" style={styles.tagline3dCarImg} /></div>
            <span style={styles.taglineText}>
              TRAVERSE YOURSELF FROM YOUR PICKUP TO DROP LOCATION
            </span>
          </div>
          <div style={styles.taglineGlowLine} />
        </div>

        {/* Bottom About & Terms & Conditions Section */}
        <section style={styles.aboutSection}>
          <div style={styles.aboutHeader}>
            <div style={styles.aboutBrandRow}>
              <div style={styles.aboutLogoBox}>
                <img src="/3d-taxi.webp" alt="Traverse" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }} />
              </div>
              <span style={styles.aboutTitle}>TRAVERSE UNI CAB</span>
            </div>
          </div>

          {/* Interactive Nav Tabs */}
          <div style={styles.aboutTabsContainer}>
            <button
              onClick={() => setAboutTab('about')}
              style={aboutTab === 'about' ? styles.aboutTabActive : styles.aboutTabInactive}
              type="button"
            >
              📖 About Us
            </button>
            <button
              onClick={() => setAboutTab('how')}
              style={aboutTab === 'how' ? styles.aboutTabActive : styles.aboutTabInactive}
              type="button"
            >
              ⚡ How It Works
            </button>
            <button
              onClick={() => setAboutTab('terms')}
              style={aboutTab === 'terms' ? styles.aboutTabActive : styles.aboutTabInactive}
              type="button"
            >
              📜 Terms & Rules
            </button>
            <button
              onClick={() => setAboutTab('help')}
              style={aboutTab === 'help' ? styles.aboutTabActive : styles.aboutTabInactive}
              type="button"
            >
              💬 Help & FAQs
            </button>
          </div>

          {/* Scrollable Tab Content Container */}
          <div style={styles.aboutContentBox}>
            {/* ABOUT TAB */}
            {aboutTab === 'about' && (
              <div>
                <div style={styles.missionCard}>
                  <span style={styles.missionQuoteMark}>“</span>
                  <p style={styles.missionText}>
                    Safe, Affordable & Direct campus mobility — Connecting JUIT university students with trusted local drivers on mountain roads.
                  </p>
                </div>

                <h3 style={styles.sectionTitle}>
                  <span style={styles.titleAccent}>|</span> Our Story
                </h3>
                <div style={styles.storyCard}>
                  <p style={styles.text}>
                    Traverse-Unicab was born out of a real problem faced by students in the hill regions of Himachal Pradesh.
                    Getting a taxi in mountain areas is not just expensive — it's unreliable. Students at JUIT often struggled
                    to find safe and affordable transport, especially during odd hours.
                  </p>
                  <p style={styles.text}>
                    At the same time, local drivers were frustrated with high commissions charged by commercial aggregators,
                    leaving them with minimal earnings despite long hours on tough terrain.
                  </p>
                  <p style={{ ...styles.text, marginBottom: 0 }}>
                    Traverse bridges this gap — connecting university students and faculty directly with verified local drivers at
                    fixed student-friendly union rates, with <b>zero commission cuts</b> eating into driver earnings.
                  </p>
                </div>

                <h3 style={styles.sectionTitle}>
                  <span style={styles.titleAccent}>|</span> Why Traverse?
                </h3>
                <div style={styles.featureList}>
                  <div style={styles.feature}>
                    <div style={styles.featureIconBox}>🔒</div>
                    <div>
                      <p style={styles.featureTitle}>Safety First</p>
                      <p style={styles.featureDesc}>All rides logged in real time. Driver credentials stored. Special focus on student safety.</p>
                    </div>
                  </div>
                  <div style={styles.feature}>
                    <div style={styles.featureIconBox}>🏷️</div>
                    <div>
                      <p style={styles.featureTitle}>Student-Friendly Rates</p>
                      <p style={styles.featureDesc}>Pre-negotiated fixed rates agreed with the campus taxi union exclusively for JUIT.</p>
                    </div>
                  </div>
                  <div style={styles.feature}>
                    <div style={styles.featureIconBox}><img src="/3d-taxi.webp" alt="Taxi" style={{ width: '20px', height: '20px', objectFit: 'contain' }} /></div>
                    <div>
                      <p style={styles.featureTitle}>Verified Drivers</p>
                      <p style={styles.featureDesc}>All drivers are registered with verified vehicle numbers and license credentials on record.</p>
                    </div>
                  </div>
                  <div style={styles.feature}>
                    <div style={styles.featureIconBox}>📡</div>
                    <div>
                      <p style={styles.featureTitle}>Live GPS Tracking</p>
                      <p style={styles.featureDesc}>High-frequency live location sharing, pickup and destination pins, and arrival alerts.</p>
                    </div>
                  </div>
                </div>

                <div style={styles.contactCard}>
                  <div style={styles.contactHeader}>
                    <span style={{ fontSize: '18px' }}>✉️</span>
                    <span style={styles.contactTitle}>Official Support Desk</span>
                  </div>
                  <a href="mailto:traverseuni@gmail.com" style={styles.contactEmail}>traverseuni@gmail.com</a>
                  <p style={styles.contactDesc}>Direct assistance for queries, verification appeals, or general feedback</p>
                </div>
              </div>
            )}

            {/* HOW IT WORKS TAB */}
            {aboutTab === 'how' && (
              <div>
                <div style={styles.userRoleHeader}>
                  <span style={{ fontSize: '16px' }}>🎓</span>
                  <h3 style={{ ...styles.sectionTitle, margin: 0 }}>For Students & Riders</h3>
                </div>
                <div style={styles.steps}>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>1</div>
                    <div>
                      <p style={styles.stepTitle}>Register with JUIT Email</p>
                      <p style={styles.stepDesc}>Sign up using your verified @juitsolan.in email and student ID</p>
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>2</div>
                    <div>
                      <p style={styles.stepTitle}>Choose Destination & Vehicle</p>
                      <p style={styles.stepDesc}>Select destination and vehicle type — Sedan (4+1) or SUV (6+1)</p>
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>3</div>
                    <div>
                      <p style={styles.stepTitle}>Instant or Scheduled Booking</p>
                      <p style={styles.stepDesc}>Book an immediate cab or schedule in advance for trains, flights, or night trips</p>
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>4</div>
                    <div>
                      <p style={styles.stepTitle}>Live Driver Tracking</p>
                      <p style={styles.stepDesc}>Track your driver live on the map as they approach your pickup point</p>
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>5</div>
                    <div>
                      <p style={styles.stepTitle}>Rate & Review</p>
                      <p style={styles.stepDesc}>Leave feedback after trip completion to maintain top service quality</p>
                    </div>
                  </div>
                </div>

                <div style={{ ...styles.userRoleHeader, marginTop: '24px' }}>
                  <img src="/3d-taxi.webp" alt="Driver" style={{ width: '22px', height: '22px', objectFit: 'contain', marginRight: '6px', verticalAlign: 'middle' }} />
                  <h3 style={{ ...styles.sectionTitle, margin: 0 }}>For Campus Drivers & Captains</h3>
                </div>
                <div style={styles.steps}>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>1</div>
                    <div>
                      <p style={styles.stepTitle}>Register Vehicle Profile</p>
                      <p style={styles.stepDesc}>Sign up with your personal email, phone number, vehicle number, and vehicle type</p>
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>2</div>
                    <div>
                      <p style={styles.stepTitle}>Admin Approval</p>
                      <p style={styles.stepDesc}>Traverse administrators verify and activate your driver account</p>
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>3</div>
                    <div>
                      <p style={styles.stepTitle}>Go Online</p>
                      <p style={styles.stepDesc}>Toggle Online to start receiving instant matching requests and scheduled pre-bookings</p>
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepNum}>4</div>
                    <div>
                      <p style={styles.stepTitle}>Accept & Complete Trips</p>
                      <p style={styles.stepDesc}>Accept ride dispatches, navigate with live GPS, and collect full fare directly</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TERMS & CONDITIONS TAB */}
            {aboutTab === 'terms' && (
              <div>
                <div style={styles.warningCard}>
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <span style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    Traverse is a university community platform. Please review the service terms and cancellation policies.
                  </span>
                </div>

                <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Eligibility</h3>
                <div style={styles.termsBox}>
                  <p style={styles.text}>• Only students and faculty with a valid <b>@juitsolan.in</b> email can register as riders</p>
                  <p style={styles.text}>• Drivers must provide authentic vehicle registration and license details</p>
                  <p style={{ ...styles.text, marginBottom: 0 }}>• All users must provide genuine contact information</p>
                </div>

                <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Booking & Cancellation Policy</h3>
                <div style={styles.termsBox}>
                  <p style={styles.text}>• Students can cancel rides <b>free of charge</b> before a driver accepts</p>
                  <p style={styles.text}>• Cancelling after driver acceptance counts as a cancellation strike</p>
                  <p style={styles.text}>• <b>5 cancellations after acceptance = automatic review / account blacklist</b></p>
                  <p style={{ ...styles.text, marginBottom: 0 }}>• Blacklisted users must contact <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946', fontWeight: '700' }}>traverseuni@gmail.com</a> to appeal</p>
                </div>

                <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Fixed Pricing & Night Surge</h3>
                <div style={styles.termsBox}>
                  <p style={styles.text}>• Standard fares are fixed as per campus taxi union agreements</p>
                  <p style={styles.text}>• Night surge applies on JUIT ↔ Waknaghat route between <b>9:00 PM - 7:00 AM</b></p>
                  <p style={styles.text}>• Shared rides automatically split the total fare equally between confirmed passengers</p>
                  <p style={{ ...styles.text, marginBottom: 0 }}>• Scheduled ride fares reflect the selected timing and vehicle type</p>
                </div>

                <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Safety & Privacy</h3>
                <div style={styles.termsBox}>
                  <p style={styles.text}>• All rides and live coordinates are logged for passenger security</p>
                  <p style={styles.text}>• Driver details including phone and vehicle number are shared with riders upon acceptance</p>
                  <p style={{ ...styles.text, marginBottom: 0 }}>• Women's safety is our top priority — drivers are verified university-associated operators</p>
                </div>
              </div>
            )}

            {/* HELP & FAQS TAB */}
            {aboutTab === 'help' && (
              <div>
                <div style={styles.warningCard}>
                  <span style={{ fontSize: '18px' }}>📬</span>
                  <span style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    Verification emails may land in your <b>Spam / Junk</b> folder — please check there first!
                  </span>
                </div>

                <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Email & Verification</h3>
                <div style={styles.termsBox}>
                  <p style={styles.text}>• Verification email not in inbox? Check your <b>Spam/Junk</b> folder</p>
                  <p style={styles.text}>• Mark our email as <b>"Not Spam"</b> to receive future trip confirmations</p>
                  <p style={styles.text}>• Verification links expire in 24 hours — request a new link if needed</p>
                  <p style={{ ...styles.text, marginBottom: 0 }}>• Ensure your email is spelled correctly (@juitsolan.in)</p>
                </div>

                <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Account Access & Support</h3>
                <div style={styles.termsBox}>
                  <p style={styles.text}>• Students and faculty must use <b>@juitsolan.in</b> institutional email</p>
                  <p style={styles.text}>• Drivers must use their personal email address</p>
                  <p style={{ ...styles.text, marginBottom: 0 }}>• For password reset or account recovery, contact <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946', fontWeight: '700' }}>traverseuni@gmail.com</a></p>
                </div>

                <div style={styles.contactCard}>
                  <p style={styles.contactTitle}>📞 Need Urgent Assistance?</p>
                  <a href="mailto:traverseuni@gmail.com" style={styles.contactEmail}>traverseuni@gmail.com</a>
                  <p style={styles.contactDesc}>We respond promptly to student and driver inquiries</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0a0a0a',
    backgroundImage: `
      radial-gradient(circle at 50% 15%, rgba(230, 57, 70, 0.28) 0%, rgba(18, 5, 8, 0.85) 45%, #0a0a0a 85%),
      linear-gradient(135deg, rgba(230, 57, 70, 0.08) 0%, transparent 50%, rgba(230, 57, 70, 0.08) 100%)
    `,
    backgroundSize: '200% 200%',
    animation: 'bgGradientMove 14s ease infinite',
    color: '#ffffff',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '24px 16px 60px 16px',
    boxSizing: 'border-box',
    position: 'relative',
    overflowX: 'hidden'
  },
  tagline3dCarWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '9px',
    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.3) 0%, rgba(25, 12, 14, 0.9) 100%)',
    border: '1px solid rgba(230, 57, 70, 0.5)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(230, 57, 70, 0.4)',
    flexShrink: 0,
    marginRight: '8px'
  },
  tagline3dCarImg: {
    width: '26px',
    height: '26px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.6))'
  },
  taglineBanner: {
    margin: '36px 0 24px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    textAlign: 'center'
  },
  taglineGlowLine: {
    width: '100%',
    height: '1.5px',
    background: 'linear-gradient(90deg, transparent 0%, #e63946 50%, transparent 100%)',
    opacity: 0.7,
    boxShadow: '0 0 10px rgba(230, 57, 70, 0.5)'
  },
  taglineContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '4px 8px'
  },
  taglineText: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '1.5px',
    color: '#ff4d5a',
    textTransform: 'uppercase',
    margin: 0,
    textShadow: '0 0 14px rgba(230, 57, 70, 0.6)'
  },
  aboutSection: {
    width: '100%',
    background: 'rgba(18, 18, 18, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(230, 57, 70, 0.08)',
    boxSizing: 'border-box'
  },
  aboutHeader: {
    padding: '16px 18px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'linear-gradient(135deg, rgba(32, 8, 10, 0.6) 0%, rgba(18, 18, 18, 0.9) 100%)'
  },
  aboutBrandRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  aboutLogoBox: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    background: 'linear-gradient(135deg, #1c1c1c 0%, #2a1114 100%)',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(230, 57, 70, 0.3)',
    overflow: 'hidden'
  },
  aboutTitle: {
    fontSize: '15px',
    fontWeight: '900',
    letterSpacing: '1.8px',
    color: '#e63946',
    display: 'block',
    lineHeight: '1.1',
    textShadow: '0 0 12px rgba(230, 57, 70, 0.45)',
    textAlign: 'center'
  },
  aboutSubtitle: {
    fontSize: '8px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    color: '#888888',
    display: 'block'
  },
  aboutTabsContainer: {
    display: 'flex',
    gap: '6px',
    padding: '10px 14px',
    background: 'rgba(0, 0, 0, 0.35)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  aboutTabActive: {
    padding: '7px 12px',
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 10px rgba(230, 57, 70, 0.4)',
    flexShrink: 0
  },
  aboutTabInactive: {
    padding: '7px 12px',
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#888888',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '9px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  aboutContentBox: {
    padding: '16px 18px 24px',
    color: '#d0d0d0',
    fontSize: '13px'
  },
  missionCard: {
    background: 'linear-gradient(135deg, #20080a 0%, #151112 100%)',
    border: '1px solid rgba(230, 57, 70, 0.35)',
    padding: '14px 16px',
    borderRadius: '12px',
    marginBottom: '18px',
    position: 'relative',
    boxShadow: '0 4px 16px rgba(230, 57, 70, 0.12)'
  },
  missionQuoteMark: {
    position: 'absolute',
    top: '4px',
    left: '10px',
    fontSize: '24px',
    color: 'rgba(230, 57, 70, 0.3)',
    fontFamily: 'serif',
    lineHeight: 1
  },
  missionText: {
    color: '#ffb3b8',
    fontSize: '13px',
    fontStyle: 'italic',
    margin: 0,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: '1.5'
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '800',
    margin: '18px 0 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  titleAccent: {
    color: '#e63946',
    fontWeight: '900'
  },
  storyCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: '12px 14px',
    borderRadius: '11px',
    marginBottom: '14px'
  },
  text: {
    color: '#a0a0a0',
    fontSize: '12.5px',
    lineHeight: '1.6',
    marginBottom: '8px'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '18px'
  },
  feature: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '10px 12px',
    borderRadius: '10px'
  },
  featureIconBox: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: 'rgba(230, 57, 70, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    flexShrink: 0
  },
  featureTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '12.5px',
    margin: '0 0 2px 0'
  },
  featureDesc: {
    color: '#888888',
    fontSize: '11.5px',
    margin: 0,
    lineHeight: '1.4'
  },
  contactCard: {
    background: 'linear-gradient(135deg, #181415 0%, #121212 100%)',
    border: '1px solid rgba(230, 57, 70, 0.25)',
    padding: '14px',
    borderRadius: '12px',
    textAlign: 'center',
    marginTop: '18px'
  },
  contactHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '4px'
  },
  contactTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '12px',
    margin: 0
  },
  contactEmail: {
    color: '#e63946',
    fontSize: '14px',
    fontWeight: '800',
    display: 'block',
    marginBottom: '3px',
    textDecoration: 'none'
  },
  contactDesc: {
    color: '#777777',
    fontSize: '11px',
    margin: 0
  },
  userRoleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '10px'
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '14px'
  },
  step: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '10px 12px',
    borderRadius: '10px'
  },
  stepNum: {
    width: '24px',
    height: '24px',
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '800',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(230, 57, 70, 0.4)'
  },
  stepTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '12.5px',
    margin: '0 0 2px 0'
  },
  stepDesc: {
    color: '#888888',
    fontSize: '11.5px',
    margin: 0,
    lineHeight: '1.4'
  },
  warningCard: {
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    color: '#f59e0b',
    padding: '10px 12px',
    borderRadius: '10px',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  termsBox: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '10px 12px',
    borderRadius: '10px',
    marginBottom: '12px'
  },
  ambientGlow: {
    position: 'absolute',
    top: '5%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '320px',
    height: '240px',
    background: 'radial-gradient(ellipse, rgba(230, 57, 70, 0.35) 0%, rgba(230, 57, 70, 0) 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'pulseGlow 6s ease-in-out infinite'
  },
  mobileContainer: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #1f1416 0%, #12090b 100%)',
    border: '1px solid rgba(230, 57, 70, 0.45)',
    boxShadow: '0 10px 30px rgba(230, 57, 70, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    marginBottom: '12px',
    overflow: 'hidden',
    padding: '3px'
  },
  floatingTaxiImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '16px',
    animation: 'floatTaxi 3.2s ease-in-out infinite'
  },
  brandTitle: {
    margin: '0 0 6px 0',
    fontSize: '32px',
    fontWeight: '900',
    letterSpacing: '5px',
    color: '#ffffff',
    textShadow: '0 0 20px rgba(230, 57, 70, 0.75), 0 0 40px rgba(230, 57, 70, 0.35)'
  },
  brandTagline: {
    margin: '0 0 14px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#b0b0b0',
    letterSpacing: '0.5px'
  },
  redText: {
    color: '#e63946',
    fontWeight: '700'
  },
  featurePills: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '4px'
  },
  pill: {
    background: 'rgba(26, 26, 26, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '5px 11px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#d0d0d0',
    letterSpacing: '0.2px'
  },
  cardPerspective: {
    perspective: '1000px',
    width: '100%'
  },
  formCard: {
    background: 'linear-gradient(165deg, rgba(26, 26, 26, 0.94) 0%, rgba(14, 14, 14, 0.97) 100%)',
    border: '1px solid rgba(230, 57, 70, 0.22)',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 35px rgba(230, 57, 70, 0.12)',
    borderRadius: '20px',
    padding: '28px 22px',
    backdropFilter: 'blur(12px)',
    transform: 'rotateX(1.5deg)',
    transformStyle: 'preserve-3d',
    animation: 'slideUpIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    boxSizing: 'border-box'
  },
  cardHeader: {
    marginBottom: '20px',
    textAlign: 'left'
  },
  cardTitle: {
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.3px'
  },
  cardSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#777777'
  },
  errorBox: {
    background: 'rgba(50, 8, 12, 0.75)',
    border: '1px solid #e63946',
    color: '#ff7a85',
    padding: '12px 14px',
    borderRadius: '12px',
    marginBottom: '18px',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  errorText: {
    wordBreak: 'break-word'
  },
  errorLink: {
    color: '#e63946',
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: '600'
  },
  verifyBtn: {
    display: 'block',
    marginTop: '10px',
    background: 'linear-gradient(135deg, #e63946 0%, #b51725 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '9px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    width: '100%',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
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
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '7px'
  },
  forgotLink: {
    color: '#e63946',
    fontSize: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    letterSpacing: '0.2px'
  },
  input: {
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
    fontFamily: 'inherit'
  },
  btnPrimary: {
    width: '100%',
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #e63946 0%, #b81d2c 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    boxShadow: '0 6px 20px rgba(230, 57, 70, 0.45)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '6px',
    fontFamily: 'inherit'
  },
  btnLoading: {
    width: '100%',
    padding: '14px 16px',
    background: '#4a1218',
    color: '#a07075',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '6px',
    fontFamily: 'inherit'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '22px 0 16px 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.09)'
  },
  dividerText: {
    color: '#666666',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  btnOutline: {
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(230, 57, 70, 0.05)',
    color: '#ffffff',
    border: '1.5px solid rgba(230, 57, 70, 0.55)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
    fontFamily: 'inherit'
  },
  adminFooter: {
    textAlign: 'center',
    color: '#555555',
    fontSize: '12px',
    marginTop: '18px'
  },
  adminLink: {
    color: '#e63946',
    textDecoration: 'none',
    fontWeight: '600'
  }
};

export default Login;
