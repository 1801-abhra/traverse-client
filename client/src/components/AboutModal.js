import React, { useState } from 'react';

function AboutModal({ onClose }) {
    const [activeTab, setActiveTab] = useState('about');

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Handle bar */}
                <div style={styles.handle} />

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logoRow}>
                        <span style={styles.logoIcon}>🚖</span>
                        <span style={styles.logoText}>TRAVERSE</span>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    {['about', 'how', 'terms'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={activeTab === tab ? styles.tabActive : styles.tabInactive}>
                            {tab === 'about' ? 'About' : tab === 'how' ? 'How it Works' : 'Terms & Conditions'}
                        </button>
                    ))}
                    {['about', 'how', 'terms', 'help'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={activeTab === tab ? styles.tabActive : styles.tabInactive}>
                            {tab === 'about' ? 'About' : tab === 'how' ? 'How it Works' : tab === 'help' ? 'Help' : 'Terms & Conditions'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={styles.content}>

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div>
                            <div style={styles.missionCard}>
                                <p style={styles.missionText}>
                                    "Making campus travel safe, affordable and reliable for every student."
                                </p>
                            </div>

                            <h3 style={styles.sectionTitle}>Our Story</h3>
                            <p style={styles.text}>
                                Traverse-Unicab was born out of a real problem faced by students in the hill regions of Himachal Pradesh.
                                Getting a taxi in mountain areas is not just expensive — it's unreliable. Students at JUIT often struggled
                                to find safe and affordable transport, especially during odd hours.
                            </p>
                            <p style={styles.text}>
                                At the same time, local drivers were frustrated with high commissions charged by platforms like Uber and Ola,
                                leaving them with little earnings despite long working hours on difficult mountain roads.
                            </p>
                            <p style={styles.text}>
                                Traverse bridges this gap — connecting university students directly with verified local drivers at
                                special discounted rates, with zero commission cuts eating into driver earnings.
                            </p>

                            <h3 style={styles.sectionTitle}>Why Traverse?</h3>
                            <div style={styles.featureList}>
                                <div style={styles.feature}>
                                    <span style={styles.featureIcon}>🔒</span>
                                    <div>
                                        <p style={styles.featureTitle}>Safety First</p>
                                        <p style={styles.featureDesc}>All rides recorded. Driver details stored. Special focus on women's safety.</p>
                                    </div>
                                </div>
                                <div style={styles.feature}>
                                    <span style={styles.featureIcon}>💰</span>
                                    <div>
                                        <p style={styles.featureTitle}>Student Discounts</p>
                                        <p style={styles.featureDesc}>Special rates negotiated with campus taxi union exclusively for students.</p>
                                    </div>
                                </div>
                                <div style={styles.feature}>
                                    <span style={styles.featureIcon}>🚗</span>
                                    <div>
                                        <p style={styles.featureTitle}>Verified Drivers</p>
                                        <p style={styles.featureDesc}>All drivers are known, registered with vehicle and license details on record.</p>
                                    </div>
                                </div>
                                <div style={styles.feature}>
                                    <span style={styles.featureIcon}>⚡</span>
                                    <div>
                                        <p style={styles.featureTitle}>Real-time Tracking</p>
                                        <p style={styles.featureDesc}>Live location sharing and instant ride status updates.</p>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.contactCard}>
                                <p style={styles.contactTitle}>📧 Support</p>
                                <a href="mailto:traverseuni@gmail.com" style={styles.contactEmail}>traverseuni@gmail.com</a>
                                <p style={styles.contactDesc}>For queries, complaints or appeals contact us</p>
                            </div>
                        </div>
                    )}

                    {/* How it Works Tab */}
                    {activeTab === 'how' && (
                        <div>
                            <h3 style={styles.sectionTitle}>For Students 🎓</h3>
                            <div style={styles.steps}>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>1</div>
                                    <div>
                                        <p style={styles.stepTitle}>Register with JUIT Email</p>
                                        <p style={styles.stepDesc}>Sign up using your @juitsolan.in email and student ID</p>
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

                            <h3 style={styles.sectionTitle}>For Drivers 🚗</h3>
                            <div style={styles.steps}>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>1</div>
                                    <div>
                                        <p style={styles.stepTitle}>Register with Vehicle Details</p>
                                        <p style={styles.stepDesc}>Sign up with your personal email, vehicle number and license details</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>2</div>
                                    <div>
                                        <p style={styles.stepTitle}>Go Online</p>
                                        <p style={styles.stepDesc}>Toggle online to start receiving ride requests from students</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>3</div>
                                    <div>
                                        <p style={styles.stepTitle}>Accept Rides</p>
                                        <p style={styles.stepDesc}>View student details, pickup and drop before accepting</p>
                                    </div>
                                </div>
                                <div style={styles.step}>
                                    <div style={styles.stepNum}>4</div>
                                    <div>
                                        <p style={styles.stepTitle}>Complete & Earn</p>
                                        <p style={styles.stepDesc}>Zero commission — keep full fare. Build your rating over time</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terms Tab */}
                    {activeTab === 'terms' && (
                        <div>
                            <div style={styles.warningCard}>
                                ⚠️ Please read these terms carefully before using Traverse-Unicab
                            </div>

                            <h3 style={styles.sectionTitle}>Eligibility</h3>
                            <p style={styles.text}>• Only students with a valid <b>@juitsolan.in</b> email can register as students</p>
                            <p style={styles.text}>• Drivers must provide valid vehicle registration and license details</p>
                            <p style={styles.text}>• All users must provide accurate personal information</p>

                            <h3 style={styles.sectionTitle}>Booking & Cancellation</h3>
                            <p style={styles.text}>• Students can cancel rides <b>for free</b> before a driver accepts</p>
                            <p style={styles.text}>• Cancelling after driver acceptance counts as a strike for both parties</p>
                            <p style={styles.text}>• <b>5 cancellations after acceptance = permanent blacklist</b></p>
                            <p style={styles.text}>• Blacklisted users must email <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946' }}>traverseuni@gmail.com</a> to appeal</p>

                            <h3 style={styles.sectionTitle}>Pricing</h3>
                            <p style={styles.text}>• Fares are fixed as per campus taxi union agreement</p>
                            <p style={styles.text}>• Night surge applies on JUIT → Waknaghat route between 9PM - 7AM</p>
                            <p style={styles.text}>• Shared rides divide fare equally between passengers</p>
                            <p style={styles.text}>• Scheduled ride fares are calculated based on scheduled time</p>

                            <h3 style={styles.sectionTitle}>Safety & Privacy</h3>
                            <p style={styles.text}>• All rides are recorded in our database for safety purposes</p>
                            <p style={styles.text}>• Driver details including phone and vehicle number are shared with student on acceptance</p>
                            <p style={styles.text}>• Admin panel monitors all rides for safety compliance</p>
                            <p style={styles.text}>• Women's safety is a priority — all drivers are verified university-associated drivers</p>

                            <h3 style={styles.sectionTitle}>Driver Responsibilities</h3>
                            <p style={styles.text}>• Maintain valid driving license and vehicle documents at all times</p>
                            <p style={styles.text}>• Ensure vehicle is in roadworthy condition</p>
                            <p style={styles.text}>• Treat all students with respect and professionalism</p>
                            <p style={styles.text}>• Do not share student contact details with third parties</p>

                            <div style={styles.contactCard}>
                                <p style={styles.contactTitle}>📧 Contact Us</p>
                                <a href="mailto:traverseuni@gmail.com" style={styles.contactEmail}>traverseuni@gmail.com</a>
                                <p style={styles.contactDesc}>For support, appeals or complaints</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'help' && (
                        <div>
                            <div style={styles.warningCard}>
                                📧 Verification emails may land in <b>Spam/Junk</b> folder — please check there first!
                            </div>

                            <h3 style={styles.sectionTitle}>📧 Email Issues</h3>
                            <p style={styles.text}>• Verification email not received? Check your <b>Spam/Junk</b> folder</p>
                            <p style={styles.text}>• Mark our email as <b>"Not Spam"</b> to receive future emails</p>
                            <p style={styles.text}>• Verification link expires in <b>24 hours</b> — request a new one from login page</p>
                            <p style={styles.text}>• Make sure you registered with correct email address</p>

                            <h3 style={styles.sectionTitle}>🔑 Login Issues</h3>
                            <p style={styles.text}>• Students must use <b>@juitsolan.in</b> email only</p>
                            <p style={styles.text}>• Faculty must use <b>@juitsolan.in</b> email only</p>
                            <p style={styles.text}>• Drivers must use <b>personal email</b> — not JUIT email</p>
                            <p style={styles.text}>• Forgot password? Email us at <a href="mailto:traverseuni@gmail.com" style={{ color: '#e63946' }}>traverseuni@gmail.com</a></p>

                            <h3 style={styles.sectionTitle}>🚗 Booking Issues</h3>
                            <p style={styles.text}>• No drivers showing? All drivers may be offline — try again later</p>
                            <p style={styles.text}>• Ride stuck on searching? Pull down to refresh or tap 🔄</p>
                            <p style={styles.text}>• Can't cancel? Cancellation only available before driver accepts</p>
                            <p style={styles.text}>• App showing old status? Tap 🔄 refresh button on dashboard</p>

                            <h3 style={styles.sectionTitle}>🔔 Notification Issues</h3>
                            <p style={styles.text}>• Allow notifications when prompted for best experience</p>
                            <p style={styles.text}>• Add app to home screen for better notification support</p>
                            <p style={styles.text}>• iPhone users — use Safari browser for notifications</p>

                            <h3 style={styles.sectionTitle}>📱 How to Install App</h3>
                            <p style={styles.text}><b>iPhone (Safari):</b></p>
                            <p style={styles.text}>• Open site in Safari → tap Share button → "Add to Home Screen"</p>
                            <p style={styles.text}><b>Android (Chrome):</b></p>
                            <p style={styles.text}>• Open site in Chrome → tap three dots → "Add to Home Screen"</p>

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
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    },
    modal: {
        background: '#111', width: '100%', maxWidth: '600px',
        maxHeight: '85vh', borderRadius: '20px 20px 0 0',
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
    },
    handle: {
        width: '40px', height: '4px', background: '#333',
        borderRadius: '2px', margin: '12px auto 0'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', borderBottom: '1px solid #1a1a1a'
    },
    logoRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    logoIcon: { fontSize: '20px' },
    logoText: { fontSize: '16px', fontWeight: '800', letterSpacing: '3px', color: '#e63946' },
    closeBtn: {
        background: '#1a1a1a', border: 'none', color: '#999',
        width: '32px', height: '32px', borderRadius: '50%',
        cursor: 'pointer', fontSize: '14px'
    },
    tabs: {
        display: 'flex', borderBottom: '1px solid #1a1a1a', padding: '0 16px'
    },
    tabActive: {
        padding: '12px 16px', background: 'transparent', color: '#e63946',
        border: 'none', borderBottom: '2px solid #e63946', cursor: 'pointer',
        fontSize: '13px', fontWeight: '600'
    },
    tabInactive: {
        padding: '12px 16px', background: 'transparent', color: '#666',
        border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer',
        fontSize: '13px'
    },
    content: { overflowY: 'auto', padding: '20px', flex: 1 },
    missionCard: {
        background: '#1a0000', border: '1px solid #e63946',
        padding: '16px', borderRadius: '10px', marginBottom: '20px'
    },
    missionText: { color: '#e63946', fontSize: '15px', fontStyle: 'italic', margin: 0, textAlign: 'center' },
    sectionTitle: { color: 'white', fontSize: '15px', fontWeight: '700', margin: '20px 0 10px' },
    text: { color: '#999', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' },
    featureList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
    feature: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
    featureIcon: { fontSize: '20px', marginTop: '2px' },
    featureTitle: { color: 'white', fontWeight: '600', fontSize: '14px', margin: '0 0 2px' },
    featureDesc: { color: '#666', fontSize: '13px', margin: 0 },
    contactCard: {
        background: '#1a1a1a', border: '1px solid #2a2a2a',
        padding: '16px', borderRadius: '10px', textAlign: 'center', marginTop: '20px'
    },
    contactTitle: { color: 'white', fontWeight: '600', margin: '0 0 8px' },
    contactEmail: { color: '#e63946', fontSize: '15px', display: 'block', marginBottom: '4px' },
    contactDesc: { color: '#666', fontSize: '13px', margin: 0 },
    steps: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
    step: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
    stepNum: {
        width: '28px', height: '28px', background: '#e63946', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '13px', fontWeight: '700', flexShrink: 0
    },
    stepTitle: { color: 'white', fontWeight: '600', fontSize: '14px', margin: '0 0 2px' },
    stepDesc: { color: '#666', fontSize: '13px', margin: 0 },
    warningCard: {
        background: '#1a0a00', border: '1px solid #f59e0b', color: '#f59e0b',
        padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px'
    }
};

export default AboutModal;