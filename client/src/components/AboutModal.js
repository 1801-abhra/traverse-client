import React, { useState } from 'react';

function AboutModal({ onClose }) {
    const [activeTab, setActiveTab] = useState('about');

    return (
        <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <style>{`
                @keyframes sheetSlideUp {
                    0% { transform: translateY(100%); opacity: 0; }
                    100% { transform: translateY(0%); opacity: 1; }
                }
                @keyframes fadeInOverlay {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .about-sheet {
                    animation: sheetSlideUp 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .about-overlay {
                    animation: fadeInOverlay 0.25s ease forwards;
                }
                .about-close-btn:hover {
                    background: rgba(230, 57, 70, 0.2) !important;
                    color: #ffffff !important;
                    transform: scale(1.08);
                }
                .about-close-btn:active {
                    transform: scale(0.92);
                }
                .about-feature-item {
                    transition: transform 0.2s ease, border-color 0.2s ease;
                }
                .about-feature-item:hover {
                    border-color: rgba(230, 57, 70, 0.3) !important;
                    background: rgba(255, 255, 255, 0.04) !important;
                }
                @media (max-width: 480px) {
                    .about-pill-mobile {
                        padding: 7px 11px !important;
                        font-size: 12px !important;
                    }
                }
            `}</style>

            <div className="about-sheet" style={styles.modal}>
                {/* Drag Indicator Handle */}
                <div style={styles.handleContainer}>
                    <div style={styles.handle} />
                </div>

                {/* Header with glowing TRAVERSE logo & Close button */}
                <div style={styles.header}>
                    <div style={styles.logoRow}>
                        <div style={styles.logoBox}>
                            <span style={styles.logoIcon}>🚖</span>
                        </div>
                        <div>
                            <span style={styles.logoText}>TRAVERSE</span>
                            <span style={styles.logoSubText}>CAMPUS MOBILITY SHEET</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="about-close-btn"
                        style={styles.closeBtn}
                        title="Close Modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Pill Style Tabs */}
                <div style={styles.tabsContainer}>
                    {['about', 'how', 'terms', 'help'].map(tab => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="about-pill-mobile"
                                style={isActive ? styles.tabActive : styles.tabInactive}
                            >
                                {tab === 'about' && 'ℹ️ About'}
                                {tab === 'how' && '⚡ How it Works'}
                                {tab === 'terms' && '📜 Terms'}
                                {tab === 'help' && '🆘 Help & FAQ'}
                            </button>
                        );
                    })}
                </div>

                {/* Scrollable Sheet Content */}
                <div style={styles.content}>

                    {/* ABOUT TAB */}
                    {activeTab === 'about' && (
                        <div>
                            <div style={styles.missionCard}>
                                <span style={styles.missionQuoteMark}>“</span>
                                <p style={styles.missionText}>
                                    Making campus travel safe, affordable and reliable for every student.
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
                                    At the same time, local drivers were frustrated with high commissions charged by platforms like Uber and Ola,
                                    leaving them with little earnings despite long working hours on difficult mountain roads.
                                </p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>
                                    Traverse bridges this gap — connecting university students directly with verified local drivers at
                                    special discounted rates, with zero commission cuts eating into driver earnings.
                                </p>
                            </div>

                            <h3 style={styles.sectionTitle}>
                                <span style={styles.titleAccent}>|</span> Why Traverse?
                            </h3>
                            <div style={styles.featureList}>
                                <div className="about-feature-item" style={styles.feature}>
                                    <div style={styles.featureIconBox}>🔒</div>
                                    <div>
                                        <p style={styles.featureTitle}>Safety First</p>
                                        <p style={styles.featureDesc}>All rides recorded. Driver details stored. Special focus on women's safety.</p>
                                    </div>
                                </div>
                                <div className="about-feature-item" style={styles.feature}>
                                    <div style={styles.featureIconBox}>💰</div>
                                    <div>
                                        <p style={styles.featureTitle}>Student Discounts</p>
                                        <p style={styles.featureDesc}>Special rates negotiated with campus taxi union exclusively for students.</p>
                                    </div>
                                </div>
                                <div className="about-feature-item" style={styles.feature}>
                                    <div style={styles.featureIconBox}>🚗</div>
                                    <div>
                                        <p style={styles.featureTitle}>Verified Drivers</p>
                                        <p style={styles.featureDesc}>All drivers are known, registered with vehicle and license details on record.</p>
                                    </div>
                                </div>
                                <div className="about-feature-item" style={styles.feature}>
                                    <div style={styles.featureIconBox}>⚡</div>
                                    <div>
                                        <p style={styles.featureTitle}>Real-time Tracking</p>
                                        <p style={styles.featureDesc}>Live location sharing and instant ride status updates.</p>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.contactCard}>
                                <div style={styles.contactHeader}>
                                    <span style={{ fontSize: '18px' }}>📧</span>
                                    <span style={styles.contactTitle}>Official Support Desk</span>
                                </div>
                                <a href="mailto:traverseuni@gmail.com" style={styles.contactEmail}>traverseuni@gmail.com</a>
                                <p style={styles.contactDesc}>Direct assistance for queries, fare disputes, or appeals</p>
                            </div>
                        </div>
                    )}

                    {/* HOW IT WORKS TAB */}
                    {activeTab === 'how' && (
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
                                        <p style={styles.stepTitle}>Select Your Route</p>
                                        <p style={styles.stepDesc}>Choose destination and vehicle type (4+1 Sedan or 6+1 SUV)</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>3</div>
                                    <div>
                                        <p style={styles.stepTitle}>Book or Schedule</p>
                                        <p style={styles.stepDesc}>Book instantly or schedule for later — even at night surge rates</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>4</div>
                                    <div>
                                        <p style={styles.stepTitle}>Track Your Driver</p>
                                        <p style={styles.stepDesc}>Get real-time updates and live location of your driver</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>5</div>
                                    <div>
                                        <p style={styles.stepTitle}>Rate Your Ride</p>
                                        <p style={styles.stepDesc}>Rate your experience to help maintain quality service</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ ...styles.userRoleHeader, marginTop: '24px' }}>
                                <span style={{ fontSize: '16px' }}>🚗</span>
                                <h3 style={{ ...styles.sectionTitle, margin: 0 }}>For Campus Drivers & Captains</h3>
                            </div>
                            <div style={styles.steps}>
                                <div style={styles.step}>
                                    <div style={{ ...styles.stepNum, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>1</div>
                                    <div>
                                        <p style={styles.stepTitle}>Register with Vehicle Details</p>
                                        <p style={styles.stepDesc}>Sign up with your personal email, vehicle number and license details</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={{ ...styles.stepNum, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>2</div>
                                    <div>
                                        <p style={styles.stepTitle}>Go Online</p>
                                        <p style={styles.stepDesc}>Toggle online to start receiving ride requests from students</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={{ ...styles.stepNum, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>3</div>
                                    <div>
                                        <p style={styles.stepTitle}>Accept Rides</p>
                                        <p style={styles.stepDesc}>View student details, pickup and drop before accepting</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={{ ...styles.stepNum, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>4</div>
                                    <div>
                                        <p style={styles.stepTitle}>Complete & Earn</p>
                                        <p style={styles.stepDesc}>Zero commission — keep full fare. Build your rating over time</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TERMS TAB */}
                    {activeTab === 'terms' && (
                        <div>
                            <div style={styles.warningCard}>
                                <span style={{ fontSize: '18px' }}>⚠️</span>
                                <span style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                    Please read these terms carefully before using Traverse-Unicab
                                </span>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Eligibility</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• Only students with a valid <b>@juitsolan.in</b> email can register as students</p>
                                <p style={styles.text}>• Drivers must provide valid vehicle registration and license details</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• All users must provide accurate personal information</p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Booking & Cancellation</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• Students can cancel rides <b>for free</b> before a driver accepts</p>
                                <p style={styles.text}>• Cancelling after driver acceptance counts as a strike for both parties</p>
                                <p style={styles.text}>• <b>5 cancellations after acceptance = permanent blacklist</b></p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• Blacklisted users must email <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946', fontWeight: '700' }}>traverseuni@gmail.com</a> to appeal</p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Pricing Policy</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• Fares are fixed as per campus taxi union agreement</p>
                                <p style={styles.text}>• Night surge applies on JUIT → Waknaghat route between 9PM - 7AM</p>
                                <p style={styles.text}>• Shared rides divide fare equally between passengers</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• Scheduled ride fares are calculated based on scheduled time</p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Safety & Privacy</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• All rides are recorded in our database for safety purposes</p>
                                <p style={styles.text}>• Driver details including phone and vehicle number are shared with student on acceptance</p>
                                <p style={styles.text}>• Admin panel monitors all rides for safety compliance</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• Women's safety is a priority — all drivers are verified university-associated drivers</p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> Driver Responsibilities</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• Maintain valid driving license and vehicle documents at all times</p>
                                <p style={styles.text}>• Ensure vehicle is in roadworthy condition</p>
                                <p style={styles.text}>• Treat all students with respect and professionalism</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• Do not share student contact details with third parties</p>
                            </div>

                            <div style={styles.contactCard}>
                                <p style={styles.contactTitle}>📧 Contact Us</p>
                                <a href="mailto:traverseuni@gmail.com" style={styles.contactEmail}>traverseuni@gmail.com</a>
                                <p style={styles.contactDesc}>For support, appeals or complaints</p>
                            </div>
                        </div>
                    )}

                    {/* HELP TAB */}
                    {activeTab === 'help' && (
                        <div>
                            <div style={styles.warningCard}>
                                <span style={{ fontSize: '18px' }}>📬</span>
                                <span style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                    Verification emails may land in <b>Spam/Junk</b> folder — please check there first!
                                </span>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> 📧 Email & Verification</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• Verification email not received? Check your <b>Spam/Junk</b> folder</p>
                                <p style={styles.text}>• Mark our email as <b>"Not Spam"</b> to receive future emails</p>
                                <p style={styles.text}>• Verification link expires in <b>24 hours</b> — request a new one from login page</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• Make sure you registered with correct email address</p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> 🔑 Login & Access Issues</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• Students must use <b>@juitsolan.in</b> email only</p>
                                <p style={styles.text}>• Faculty must use <b>@juitsolan.in</b> email only</p>
                                <p style={styles.text}>• Drivers must use <b>personal email</b> — not JUIT email</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• Forgot password? Email us at <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946', fontWeight: '700' }}>traverseuni@gmail.com</a></p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> 🚗 Booking & Dispatch Troubleshooting</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• No drivers showing? All drivers may be offline — try again later</p>
                                <p style={styles.text}>• Ride stuck on searching? Pull down to refresh or tap 🔄</p>
                                <p style={styles.text}>• Can't cancel? Cancellation only available before driver accepts</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• App showing old status? Tap 🔄 refresh button on dashboard</p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> 🔔 Notifications</h3>
                            <div style={styles.termsBox}>
                                <p style={styles.text}>• Allow notifications when prompted for best experience</p>
                                <p style={styles.text}>• Add app to home screen for better notification support</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• iPhone users — use Safari browser for notifications</p>
                            </div>

                            <h3 style={styles.sectionTitle}><span style={styles.titleAccent}>|</span> 📱 How to Install Progressive Web App</h3>
                            <div style={styles.termsBox}>
                                <p style={{ ...styles.text, fontWeight: '700', color: '#ffffff' }}>iPhone (Safari):</p>
                                <p style={styles.text}>• Open site in Safari → tap Share button → "Add to Home Screen"</p>
                                <p style={{ ...styles.text, fontWeight: '700', color: '#ffffff', marginTop: '10px' }}>Android (Chrome):</p>
                                <p style={{ ...styles.text, marginBottom: 0 }}>• Open site in Chrome → tap three dots → "Add to Home Screen"</p>
                            </div>

                            <div style={styles.contactCard}>
                                <p style={styles.contactTitle}>Still need help? 🆘</p>
                                <a href="mailto:traverseuni@gmail.com" style={styles.contactEmail}>traverseuni@gmail.com</a>
                                <p style={styles.contactDesc}>We'll respond within 24 hours</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    modal: {
        background: 'linear-gradient(180deg, #181415 0%, #101010 100%)',
        width: '100%',
        maxWidth: '580px',
        height: '85vh',
        maxHeight: '85vh',
        borderRadius: '24px 24px 0 0',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: 'none',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(230, 57, 70, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    handleContainer: {
        padding: '12px 0 4px',
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0
    },
    handle: {
        width: '42px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '3px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        flexShrink: 0
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    logoBox: {
        width: '34px',
        height: '34px',
        borderRadius: '9px',
        background: 'linear-gradient(135deg, #1c1c1c 0%, #2a1114 100%)',
        border: '1px solid rgba(230, 57, 70, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 10px rgba(230, 57, 70, 0.3)'
    },
    logoIcon: { fontSize: '18px' },
    logoText: {
        fontSize: '16px',
        fontWeight: '900',
        letterSpacing: '2.5px',
        color: '#e63946',
        display: 'block',
        lineHeight: '1.1',
        textShadow: '0 0 12px rgba(230, 57, 70, 0.5)'
    },
    logoSubText: {
        fontSize: '8px',
        fontWeight: '800',
        letterSpacing: '1px',
        color: '#777777',
        display: 'block'
    },
    closeBtn: {
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#aaaaaa',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    },
    tabsContainer: {
        display: 'flex',
        gap: '6px',
        padding: '10px 16px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        overflowX: 'auto',
        flexShrink: 0
    },
    tabActive: {
        padding: '8px 14px',
        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 10px rgba(230, 57, 70, 0.4)',
        transition: 'all 0.2s ease',
        flexShrink: 0
    },
    tabInactive: {
        padding: '8px 14px',
        background: 'rgba(255, 255, 255, 0.04)',
        color: '#888888',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        flexShrink: 0
    },
    content: {
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '18px 20px 30px',
        flex: 1,
        minHeight: 0
    },
    missionCard: {
        background: 'linear-gradient(135deg, #20080a 0%, #151112 100%)',
        border: '1px solid rgba(230, 57, 70, 0.35)',
        padding: '16px 20px',
        borderRadius: '14px',
        marginBottom: '20px',
        position: 'relative',
        boxShadow: '0 4px 18px rgba(230, 57, 70, 0.12)'
    },
    missionQuoteMark: {
        position: 'absolute',
        top: '6px',
        left: '12px',
        fontSize: '28px',
        color: 'rgba(230, 57, 70, 0.3)',
        fontFamily: 'serif',
        lineHeight: 1
    },
    missionText: {
        color: '#ffb3b8',
        fontSize: '14px',
        fontStyle: 'italic',
        margin: 0,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: '1.5'
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '800',
        margin: '22px 0 12px',
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
        padding: '14px 16px',
        borderRadius: '12px',
        marginBottom: '16px'
    },
    text: {
        color: '#a0a0a0',
        fontSize: '13px',
        lineHeight: '1.6',
        marginBottom: '10px'
    },
    featureList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
    },
    feature: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '12px 14px',
        borderRadius: '12px'
    },
    featureIconBox: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(230, 57, 70, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0
    },
    featureTitle: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: '13px',
        margin: '0 0 2px 0'
    },
    featureDesc: {
        color: '#777777',
        fontSize: '12px',
        margin: 0,
        lineHeight: '1.4'
    },
    contactCard: {
        background: 'linear-gradient(135deg, #181415 0%, #121212 100%)',
        border: '1px solid rgba(230, 57, 70, 0.25)',
        padding: '16px',
        borderRadius: '14px',
        textAlign: 'center',
        marginTop: '22px'
    },
    contactHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginBottom: '6px'
    },
    contactTitle: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: '13px',
        margin: 0
    },
    contactEmail: {
        color: '#e63946',
        fontSize: '15px',
        fontWeight: '800',
        display: 'block',
        marginBottom: '4px',
        textDecoration: 'none'
    },
    contactDesc: {
        color: '#777777',
        fontSize: '12px',
        margin: 0
    },
    userRoleHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
    },
    steps: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '16px'
    },
    step: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '12px 14px',
        borderRadius: '12px'
    },
    stepNum: {
        width: '26px',
        height: '26px',
        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '800',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(230, 57, 70, 0.4)'
    },
    stepTitle: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: '13px',
        margin: '0 0 2px 0'
    },
    stepDesc: {
        color: '#777777',
        fontSize: '12px',
        margin: 0,
        lineHeight: '1.4'
    },
    warningCard: {
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        color: '#f59e0b',
        padding: '12px 14px',
        borderRadius: '12px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    termsBox: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '12px 14px',
        borderRadius: '12px',
        marginBottom: '14px'
    }
};

export default AboutModal;