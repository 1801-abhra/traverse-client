import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCarAnimation, setShowCarAnimation] = useState(true);
  const [modalContent, setModalContent] = useState(null);
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

  // Content catalog for interactive footer items
  const openModal = (type) => {
    switch (type) {
      case 'about':
        setModalContent({
          title: '📖 About Traverse-Unicab',
          badge: 'CAMPUS MOBILITY',
          body: (
            <div>
              <p style={{ color: '#e0e0e0', lineHeight: '1.6', marginBottom: '14px' }}>
                <b>Traverse-Unicab</b> is the dedicated student and faculty cab platform built specifically for <b>Jaypee University of Information Technology (JUIT), Waknaghat</b>.
              </p>
              <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '14px' }}>
                Traverse connects university students and faculty directly with authorized, background-verified local drivers on hill routes, ensuring fixed transparent fares with zero surge exploitation.
              </p>
              <div style={{ background: 'rgba(230, 57, 70, 0.1)', border: '1px solid rgba(230, 57, 70, 0.3)', borderRadius: '10px', padding: '12px 14px', color: '#ffb3b8', fontSize: '13px' }}>
                🌟 <b>Mission:</b> Reliable, secure, and affordable transportation on mountain terrain for the entire university community.
              </div>
            </div>
          )
        });
        break;
      case 'how_it_works':
        setModalContent({
          title: '⚡ How It Works',
          badge: 'STEP BY STEP',
          body: (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <b style={{ color: '#e63946' }}>1. Select Route & Vehicle:</b>
                  <p style={{ color: '#bbb', margin: '4px 0 0', fontSize: '13px' }}>Pick from popular campus destinations (Waknaghat, Solan, Shimla, Chandigarh) and choose 4+1 Sedan or 6+1 SUV.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <b style={{ color: '#e63946' }}>2. Smart FIFO Queue Dispatch:</b>
                  <p style={{ color: '#bbb', margin: '4px 0 0', fontSize: '13px' }}>Ride requests are queued and dispatched fairly to online drivers without overwhelming them.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <b style={{ color: '#e63946' }}>3. Live Ride & Driver Details:</b>
                  <p style={{ color: '#bbb', margin: '4px 0 0', fontSize: '13px' }}>Get driver phone, vehicle number, model, direct call button, and post-ride digital receipt with ratings.</p>
                </div>
              </div>
            </div>
          )
        });
        break;
      case 'terms':
        setModalContent({
          title: '📜 Terms of Service & Campus Rules',
          badge: 'POLICY',
          body: (
            <div>
              <ul style={{ color: '#bbb', lineHeight: '1.7', paddingLeft: '20px', margin: 0, fontSize: '13px' }}>
                <li><b>Eligibility:</b> Registration requires a valid university email (<code>@juitsolan.in</code>).</li>
                <li><b>Fixed Fares:</b> Fares are predetermined by university destination guidelines without surge pricing.</li>
                <li><b>5-Strike Fair Cancellation Policy:</b> Repeatedly cancelling after driver acceptance will result in account restriction.</li>
                <li><b>Driver Verification:</b> Drivers must be authorized by campus dispatch administration.</li>
              </ul>
            </div>
          )
        });
        break;
      case 'cancellation_policy':
        setModalContent({
          title: '⚠️ 5-Strike Cancellation Fair Policy',
          badge: 'SAFETY & DISCIPLINE',
          body: (
            <div>
              <p style={{ color: '#bbb', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px' }}>
                To protect driver fuel, time, and maintain fair dispatch availability:
              </p>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '12px 14px', color: '#fca5a5', fontSize: '13px', lineHeight: '1.6' }}>
                • Free cancellations while searching for a driver.<br/>
                • Warning issued after 3 cancellations post-driver acceptance.<br/>
                • Reaching 5 cancellations triggers automated dispatch suspension pending admin review.
              </div>
            </div>
          )
        });
        break;
      case 'safety':
        setModalContent({
          title: '🛡️ Mountain Safety Standards',
          badge: 'SECURITY',
          body: (
            <div>
              <p style={{ color: '#bbb', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px' }}>
                Your safety on mountain roads is our highest priority:
              </p>
              <ul style={{ color: '#ccc', lineHeight: '1.7', paddingLeft: '20px', margin: 0, fontSize: '13px' }}>
                <li>100% verified local drivers experienced with Waknaghat & Solan hill terrain.</li>
                <li>Instant driver direct calling and digital receipt generation.</li>
                <li>Night travel standards & verified vehicle registrations.</li>
              </ul>
            </div>
          )
        });
        break;
      case 'support':
        setModalContent({
          title: '💬 Help & Support Desk',
          badge: '24/7 ASSISTANCE',
          body: (
            <div>
              <p style={{ color: '#bbb', lineHeight: '1.6', fontSize: '13px', marginBottom: '14px' }}>
                Need help with your account, a previous ride, or lost items?
              </p>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px', color: '#fff', fontSize: '13px' }}>
                <p style={{ margin: '0 0 8px 0' }}>📧 <b>Email:</b> <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946', textDecoration: 'none' }}>traverseuni@gmail.com</a></p>
                <p style={{ margin: '0 0 8px 0' }}>📍 <b>Location:</b> JUIT Campus, Waknaghat, HP - 173234</p>
                <p style={{ margin: 0 }}>⏱️ <b>Dispatch Support:</b> Active across all campus operating hours</p>
              </div>
            </div>
          )
        });
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes bgGradientMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes floatTaxi {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(-3deg); }
        }
        @keyframes slideUpIn {
          0% { opacity: 0; transform: translateY(32px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes carDriveAcross {
          0% { left: -140px; transform: scale(0.75) translateY(0); }
          50% { transform: scale(0.85) translateY(-3px); }
          100% { left: 105%; transform: scale(0.75) translateY(0); }
        }
        @keyframes roadDashes {
          0% { background-position: 0 0; }
          100% { background-position: -200px 0; }
        }
        .traverse-input:focus {
          border-color: #e63946 !important;
          box-shadow: 0 0 14px rgba(230, 57, 70, 0.45) !important;
          background: #242424 !important;
        }
        .traverse-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(230, 57, 70, 0.6) !important;
        }
        .traverse-btn-outline:hover {
          background: rgba(230, 57, 70, 0.15) !important;
          border-color: #e63946 !important;
        }
        .footer-link-item {
          color: #8e95a5;
          text-decoration: none;
          font-size: 13px;
          line-height: 1.8;
          display: block;
          cursor: pointer;
          transition: all 0.2s ease;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          font-family: inherit;
        }
        .footer-link-item:hover {
          color: #ffffff;
          transform: translateX(3px);
        }
        .footer-link-item:focus {
          outline: none;
        }
        @media (max-width: 768px) {
          .footer-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px 16px !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid-container {
            grid-template-columns: 1fr 1fr !important;
            gap: 20px 12px !important;
          }
        }
      `}</style>

      {/* Floating Ambient Light Spots */}
      <div style={styles.glowSpot1} />
      <div style={styles.glowSpot2} />

      {/* Car Drive Animation on First Load */}
      {showCarAnimation && (
        <div style={styles.carDriveTrack}>
          <div style={styles.carRoadDash} />
          <div style={styles.drivingCarWrapper}>
            <svg width="60" height="28" viewBox="0 0 120 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="50" rx="54" ry="3.5" fill="black" opacity="0.6" />
              <path d="M12,38 C8,38 6,36 6,32 C6,27 10,25 18,24 L34,22 L48,11 C51,9 56,8 64,8 L84,8 C91,8 96,11 100,16 L108,22 C114,23 118,26 118,30 C118,34 116,38 112,38 C110,38 108,34 103,34 C97,34 94,38 90,38 L42,38 C38,38 35,34 29,34 C24,34 21,38 12,38 Z" fill="url(#loginTaxiGrad)" />
              <circle cx="26" cy="38" r="9" fill="#111111" stroke="#333" strokeWidth="1.5" />
              <circle cx="26" cy="38" r="6" fill="#e63946" strokeWidth="0.8" />
              <circle cx="98" cy="38" r="9" fill="#111111" stroke="#333" strokeWidth="1.5" />
              <circle cx="98" cy="38" r="6" fill="#e63946" strokeWidth="0.8" />
              <defs>
                <linearGradient id="loginTaxiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4d5a" />
                  <stop offset="40%" stopColor="#e63946" />
                  <stop offset="100%" stopColor="#9e1522" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div style={styles.contentContainer}>
        {/* Top Floating Logo & Brand Header */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <img src="/3d-taxi.webp" alt="Traverse Logo" style={styles.floatingTaxiImg} />
          </div>
          <h1 style={styles.brandTitle}>TRAVERSE</h1>
          <p style={styles.brandTagline}>
            JUIT SOLAN <span style={styles.redText}>•</span> UNIVERSITY CAB NETWORK
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
            <div style={styles.tagline3dCarWrap}>
              <img src="/3d-taxi.webp" alt="3D Taxi" style={styles.tagline3dCarImg} />
            </div>
            <span style={styles.taglineText}>
              TRAVERSE YOURSELF FROM YOUR PICKUP TO DROP LOCATION
            </span>
          </div>
          <div style={styles.taglineGlowLine} />
        </div>
      </div>

      {/* MODERN ENTERPRISE SAAS-STYLE FOOTER (Heroku / GitHub Inspired) */}
      <footer style={styles.footerWrapper}>
        <div style={styles.footerInner}>
          {/* 4-Column Responsive Grid */}
          <div className="footer-grid-container" style={styles.footerGrid}>
            {/* Column 1: Products */}
            <div style={styles.footerCol}>
              <h4 style={styles.colTitle}>PRODUCTS</h4>
              <button onClick={() => openModal('how_it_works')} className="footer-link-item">Sedan Cabs (4+1)</button>
              <button onClick={() => openModal('how_it_works')} className="footer-link-item">SUV Cabs (6+1)</button>
              <button onClick={() => openModal('how_it_works')} className="footer-link-item">Smart Ride Sharing</button>
              <button onClick={() => openModal('how_it_works')} className="footer-link-item">48h Advance Booking</button>
              <button onClick={() => openModal('how_it_works')} className="footer-link-item">Fair Queue Dispatch</button>
              <button onClick={() => openModal('about')} className="footer-link-item">Fixed Campus Rates</button>
            </div>

            {/* Column 2: Resources & Routes */}
            <div style={styles.footerCol}>
              <h4 style={styles.colTitle}>RESOURCES</h4>
              <button onClick={() => openModal('about')} className="footer-link-item">JUIT Waknaghat</button>
              <button onClick={() => openModal('about')} className="footer-link-item">Solan Bus Stands</button>
              <button onClick={() => openModal('about')} className="footer-link-item">Shimla ISBT Routes</button>
              <button onClick={() => openModal('about')} className="footer-link-item">Kalka Railway Hub</button>
              <button onClick={() => openModal('how_it_works')} className="footer-link-item">How Dispatch Works</button>
              <button onClick={() => openModal('support')} className="footer-link-item">Lost & Found Desk</button>
            </div>

            {/* Column 3: About & Policies */}
            <div style={styles.footerCol}>
              <h4 style={styles.colTitle}>ABOUT</h4>
              <button onClick={() => openModal('about')} className="footer-link-item">About Traverse</button>
              <button onClick={() => openModal('terms')} className="footer-link-item">Terms of Service</button>
              <button onClick={() => openModal('cancellation_policy')} className="footer-link-item">Cancellation Policy</button>
              <button onClick={() => openModal('safety')} className="footer-link-item">Safety Standards</button>
              <button onClick={() => openModal('safety')} className="footer-link-item">Driver Guidelines</button>
              <Link to="/register" className="footer-link-item">Register Account</Link>
            </div>

            {/* Column 4: Support & Contact */}
            <div style={styles.footerCol}>
              <h4 style={styles.colTitle}>SUPPORT</h4>
              <button onClick={() => openModal('support')} className="footer-link-item">Help Center & FAQs</button>
              <button onClick={() => openModal('support')} className="footer-link-item">Contact Support</button>
              <a href="mailto:traverseuni@gmail.com" className="footer-link-item">Email Dispatch</a>
              <Link to="/admin" className="footer-link-item">Admin Access</Link>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>System Operational</span>
              </div>
            </div>
          </div>

          {/* Sub-Footer Line & Copyright */}
          <div className="footer-bottom-bar" style={styles.footerBottomBar}>
            <div style={styles.footerBrandBlock}>
              <div style={styles.footerLogoWrap}>
                <img src="/3d-taxi.webp" alt="Traverse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span style={styles.footerBrandName}>TRAVERSE UNICAB</span>
                <p style={styles.footerCopyright}>
                  © 2026 Jaypee University of Information Technology. Built for JUIT students & faculty.
                </p>
              </div>
            </div>

            <div style={styles.footerQuickLinks}>
              <button onClick={() => openModal('terms')} style={styles.footerSubLink}>Terms</button>
              <span style={{ color: '#444' }}>•</span>
              <button onClick={() => openModal('safety')} style={styles.footerSubLink}>Privacy</button>
              <span style={{ color: '#444' }}>•</span>
              <button onClick={() => openModal('support')} style={styles.footerSubLink}>Contact</button>
              <span style={{ color: '#444' }}>•</span>
              <Link to="/admin" style={styles.footerSubLink}>Admin</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Detail Modal Dialog */}
      {modalContent && (
        <div style={styles.modalOverlay} onClick={() => setModalContent(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <span style={styles.modalBadge}>{modalContent.badge}</span>
                <h3 style={styles.modalTitle}>{modalContent.title}</h3>
              </div>
              <button onClick={() => setModalContent(null)} style={styles.modalCloseBtn} title="Close">
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              {modalContent.body}
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setModalContent(null)} style={styles.modalDoneBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: '#0a0a0a',
    backgroundImage: `
      radial-gradient(circle at 50% 0%, rgba(230, 57, 70, 0.18) 0%, rgba(10, 10, 10, 0.95) 45%, #080808 100%),
      linear-gradient(180deg, #0e0507 0%, #0a0a0a 100%)
    `,
    backgroundSize: '100% 100%',
    color: '#ffffff',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflowX: 'hidden'
  },
  glowSpot1: {
    position: 'absolute',
    top: '-80px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '450px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.28) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'pulseGlow 4s ease-in-out infinite'
  },
  glowSpot2: {
    position: 'absolute',
    bottom: '80px',
    right: '-100px',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 0
  },
  carDriveTrack: {
    position: 'fixed',
    top: '14px',
    left: 0,
    width: '100%',
    height: '40px',
    pointerEvents: 'none',
    zIndex: 99,
    overflow: 'hidden'
  },
  carRoadDash: {
    position: 'absolute',
    bottom: '2px',
    left: 0,
    width: '100%',
    height: '2px',
    backgroundImage: 'linear-gradient(to right, rgba(230, 57, 70, 0.6) 50%, rgba(0, 0, 0, 0) 0%)',
    backgroundSize: '24px 2px',
    animation: 'roadDashes 0.6s linear infinite'
  },
  drivingCarWrapper: {
    position: 'absolute',
    bottom: '4px',
    animation: 'carDriveAcross 4.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards'
  },
  contentContainer: {
    width: '100%',
    maxWidth: '440px',
    padding: '30px 16px 20px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto',
    flex: '1 0 auto'
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
  },
  taglineBanner: {
    marginTop: '28px',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  taglineGlowLine: {
    width: '90%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(230, 57, 70, 0.6) 50%, transparent 100%)'
  },
  taglineContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '4px 0'
  },
  tagline3dCarWrap: {
    width: '28px',
    height: '28px',
    borderRadius: '7px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    background: 'rgba(230, 57, 70, 0.1)'
  },
  tagline3dCarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  taglineText: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#fca5a5',
    letterSpacing: '1px',
    textShadow: '0 0 12px rgba(230, 57, 70, 0.5)'
  },

  /* ENTERPRISE FOOTER STYLES */
  footerWrapper: {
    width: '100%',
    background: 'linear-gradient(180deg, rgba(14, 14, 16, 0.95) 0%, #070709 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 -10px 30px rgba(0,0,0,0.6)',
    padding: '40px 20px 24px',
    boxSizing: 'border-box',
    marginTop: 'auto',
    zIndex: 2
  },
  footerInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px 24px',
    marginBottom: '36px'
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  colTitle: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.4px',
    color: '#e63946',
    margin: '0 0 10px 0',
    textTransform: 'uppercase'
  },
  footerBottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
    gap: '16px'
  },
  footerBrandBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  footerLogoWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(230, 57, 70, 0.4)',
    background: '#181818',
    flexShrink: 0
  },
  footerBrandName: {
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: '#ffffff',
    display: 'block'
  },
  footerCopyright: {
    fontSize: '11px',
    color: '#666666',
    margin: '2px 0 0 0'
  },
  footerQuickLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  footerSubLink: {
    background: 'none',
    border: 'none',
    color: '#8e95a5',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'none',
    transition: 'color 0.2s',
    fontFamily: 'inherit'
  },

  /* MODAL STYLES */
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.82)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1000
  },
  modalCard: {
    background: 'linear-gradient(165deg, #18181c 0%, #0d0d10 100%)',
    border: '1px solid rgba(230, 57, 70, 0.35)',
    borderRadius: '16px',
    maxWidth: '520px',
    width: '100%',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(230, 57, 70, 0.15)',
    overflow: 'hidden',
    animation: 'slideUpIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  modalHeader: {
    padding: '18px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: 'rgba(230, 57, 70, 0.06)'
  },
  modalBadge: {
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: '#e63946',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '2px'
  },
  modalTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '700',
    color: '#ffffff'
  },
  modalCloseBtn: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#bbb',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px'
  },
  modalBody: {
    padding: '20px',
    overflowY: 'auto',
    color: '#d0d0d0',
    fontSize: '13px'
  },
  modalFooter: {
    padding: '12px 20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'flex-end',
    background: 'rgba(0, 0, 0, 0.2)'
  },
  modalDoneBtn: {
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    color: 'white',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer'
  }
};

export default Login;
