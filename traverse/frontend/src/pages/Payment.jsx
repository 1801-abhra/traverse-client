import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Lock, Shield, CheckCircle, ArrowRight,
    Car, Train, Bus, Plane, ChevronRight, Clock,
    CreditCard, Landmark, Wallet
} from 'lucide-react'
import { useJourney } from '../context/JourneyContext'

function Payment() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('upi')
    const [selectedUpi, setSelectedUpi] = useState('gpay')
    const [upiId, setUpiId] = useState('')
    const [verified, setVerified] = useState(false)
    const [paying, setPaying] = useState(false)
    const [timer, setTimer] = useState(12 * 60 + 45)
    const { journey, totalCost } = useJourney()

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(t => t > 0 ? t - 1 : 0)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTimer = () => {
        const m = Math.floor(timer / 60).toString().padStart(2, '0')
        const s = (timer % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const handlePay = () => {
        setPaying(true)
        setTimeout(() => navigate('/confirmation'), 1500)
    }

    const tabs = [
        { key: 'upi', label: 'UPI Instant', icon: '⚡' },
        {
            key: 'card', label: 'Credit / Debit Card',
            icon: '💳'
        },
        { key: 'netbanking', label: 'Net Banking', icon: '🏦' },
        { key: 'wallet', label: 'Wallets', icon: '👛' },
    ]

    const upiApps = [
        {
            key: 'gpay', label: 'Google Pay',
            sub: 'Instant Auth', letter: 'G',
            color: '#4285F4'
        },
        {
            key: 'phonepe', label: 'PhonePe',
            sub: 'Direct UPI', letter: 'P',
            color: '#5F259F'
        },
        {
            key: 'paytm', label: 'Paytm UPI',
            sub: 'Fast Transfer', letter: 'T',
            color: '#002970'
        },
    ]

    return (
        <div style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff', minHeight: '100vh'
        }}>

            <div style={{
                maxWidth: '1200px', margin: '0 auto',
                padding: '32px 24px'
            }}>

                {/* BREADCRUMB */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '6px', fontSize: '13px', color: '#94A3B8',
                    marginBottom: '24px'
                }}>
                    {['Search Results', 'Journey Builder',
                        'Order Summary'].map((item, i) => (
                            <>
                                <button key={item} style={{
                                    color: '#94A3B8',
                                    background: 'none', border: 'none',
                                    cursor: 'pointer', fontSize: '13px',
                                    fontWeight: '600'
                                }}>
                                    {item}
                                </button>
                                <ChevronRight key={`c-${i}`} size={14} />
                            </>
                        ))}
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>
                        Payment
                    </span>
                </div>

                {/* HEADER */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-end', marginBottom: '32px',
                    flexWrap: 'wrap', gap: '12px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '36px', fontWeight: '800',
                            color: '#0F172A', letterSpacing: '-1px', margin: 0
                        }}>
                            Complete Payment
                        </h1>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '8px', marginTop: '6px'
                        }}>
                            <div style={{
                                width: '8px', height: '8px',
                                backgroundColor: '#0EA5E9',
                                borderRadius: '999px'
                            }} />
                            <span style={{ fontSize: '13px', color: '#64748B' }}>
                                Secure encrypted checkout
                            </span>
                            <span style={{ color: '#CBD5E1' }}>·</span>
                            <Shield size={14} color="#22C55E" />
                            <span style={{
                                fontSize: '13px', fontWeight: '700',
                                color: '#22C55E'
                            }}>
                                256-bit Bank Grade Security
                            </span>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: '6px', backgroundColor: '#F8FAFC',
                        padding: '8px 16px', borderRadius: '999px',
                        border: '1px solid #E2E8F0'
                    }}>
                        <Lock size={14} color="#64748B" />
                        <span style={{ fontSize: '12px', color: '#64748B' }}>
                            Session ID: <strong style={{ color: '#0F172A' }}>
                                TRV-984210
                            </strong>
                        </span>
                    </div>
                </div>

                {/* TWO COLUMN */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 380px',
                    gap: '32px', alignItems: 'start'
                }}>

                    {/* LEFT COLUMN */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', gap: '20px'
                    }}>

                        {/* PROGRESS STEPS */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px', padding: '20px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', justifyContent: 'space-between',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute', left: '32px',
                                    right: '32px', top: '16px', height: '2px',
                                    backgroundColor: '#E2E8F0', zIndex: 0
                                }} />
                                <div style={{
                                    position: 'absolute', left: '32px',
                                    width: '55%', top: '16px', height: '2px',
                                    backgroundColor: '#0EA5E9', zIndex: 0
                                }} />
                                {[
                                    { label: '1. Journey', done: true },
                                    { label: '2. Review', done: true },
                                    { label: '3. Payment', done: false },
                                ].map(({ label, done }) => (
                                    <div key={label} style={{
                                        display: 'flex',
                                        flexDirection: 'column', alignItems: 'center',
                                        zIndex: 1
                                    }}>
                                        <div style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '999px',
                                            backgroundColor: done ? '#22C55E' : '#1A56DB',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: done
                                                ? 'none'
                                                : '0 0 0 4px #DBEAFE'
                                        }}>
                                            {done
                                                ? <CheckCircle size={16} color="#fff" />
                                                : <span style={{
                                                    color: '#fff',
                                                    fontWeight: '800', fontSize: '14px'
                                                }}>
                                                    3
                                                </span>
                                            }
                                        </div>
                                        <span style={{
                                            fontSize: '12px',
                                            fontWeight: done ? '600' : '800',
                                            color: done ? '#64748B' : '#1A56DB',
                                            marginTop: '6px'
                                        }}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PAYMENT METHOD CARD */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0', overflow: 'hidden',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{ padding: '24px 24px 16px' }}>
                                <h2 style={{
                                    fontSize: '20px', fontWeight: '800',
                                    color: '#0F172A', margin: '0 0 4px'
                                }}>
                                    Choose Payment Method
                                </h2>
                                <p style={{
                                    fontSize: '13px', color: '#64748B',
                                    margin: 0
                                }}>
                                    Select your preferred mode to confirm all
                                    transit segments.
                                </p>
                            </div>

                            {/* TABS */}
                            <div style={{
                                display: 'flex', gap: '4px',
                                backgroundColor: '#F8FAFC',
                                padding: '8px 24px 0',
                                borderTop: '1px solid #E2E8F0',
                                overflowX: 'auto'
                            }}>
                                {tabs.map(tab => (
                                    <button key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        style={{
                                            display: 'flex', alignItems: 'center',
                                            gap: '6px', padding: '10px 16px',
                                            borderRadius: '8px 8px 0 0',
                                            fontSize: '13px', fontWeight: '700',
                                            border: 'none', cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            backgroundColor: activeTab === tab.key
                                                ? '#fff' : 'transparent',
                                            color: activeTab === tab.key
                                                ? '#1A56DB' : '#64748B',
                                            borderBottom: activeTab === tab.key
                                                ? '2px solid #1A56DB' : 'none'
                                        }}>
                                        <span>{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* UPI TAB */}
                            {activeTab === 'upi' && (
                                <div style={{
                                    padding: '24px',
                                    display: 'flex', flexDirection: 'column',
                                    gap: '20px'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: '700', color: '#94A3B8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            marginBottom: '12px'
                                        }}>
                                            Fast UPI Checkout via Mobile App
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3,1fr)',
                                            gap: '12px'
                                        }}>
                                            {upiApps.map(app => (
                                                <div key={app.key}
                                                    onClick={() => setSelectedUpi(app.key)}
                                                    style={{
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        border: selectedUpi === app.key
                                                            ? `2px solid #1A56DB`
                                                            : '1px solid #E2E8F0',
                                                        backgroundColor: selectedUpi === app.key
                                                            ? '#EFF6FF' : '#fff',
                                                        cursor: 'pointer',
                                                        display: 'flex', gap: '12px',
                                                        alignItems: 'center'
                                                    }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px', borderRadius: '999px',
                                                        backgroundColor: app.color,
                                                        display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff', fontWeight: '800',
                                                        fontSize: '16px', flexShrink: 0
                                                    }}>
                                                        {app.letter}
                                                    </div>
                                                    <div>
                                                        <div style={{
                                                            fontSize: '14px',
                                                            fontWeight: '700', color: '#0F172A'
                                                        }}>
                                                            {app.label}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '12px',
                                                            color: '#94A3B8'
                                                        }}>
                                                            {app.sub}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center', gap: '12px'
                                    }}>
                                        <div style={{
                                            flex: 1, height: '1px',
                                            backgroundColor: '#E2E8F0'
                                        }} />
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700', color: '#94A3B8',
                                            textTransform: 'uppercase'
                                        }}>
                                            Or enter UPI ID
                                        </span>
                                        <div style={{
                                            flex: 1, height: '1px',
                                            backgroundColor: '#E2E8F0'
                                        }} />
                                    </div>

                                    {/* UPI Input */}
                                    <div>
                                        <label style={{
                                            fontSize: '12px',
                                            fontWeight: '700', color: '#64748B',
                                            display: 'block', marginBottom: '8px'
                                        }}>
                                            Virtual Payment Address (VPA)
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{
                                                position: 'absolute',
                                                left: '14px', top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '16px', color: '#94A3B8'
                                            }}>
                                                @
                                            </span>
                                            <input
                                                value={upiId}
                                                onChange={e => {
                                                    setUpiId(e.target.value)
                                                    setVerified(false)
                                                }}
                                                placeholder="username@upi"
                                                style={{
                                                    width: '100%', padding: '12px 90px 12px 36px',
                                                    borderRadius: '10px', fontSize: '14px',
                                                    border: '1.5px solid #E2E8F0',
                                                    backgroundColor: '#F8FAFC',
                                                    outline: 'none', boxSizing: 'border-box',
                                                    color: '#0F172A'
                                                }}
                                            />
                                            <button
                                                onClick={() => setVerified(true)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '8px', top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    padding: '6px 14px',
                                                    backgroundColor: verified
                                                        ? '#DCFCE7' : '#fff',
                                                    color: verified ? '#16A34A' : '#1A56DB',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '8px', cursor: 'pointer',
                                                    fontSize: '13px', fontWeight: '700'
                                                }}>
                                                {verified ? 'Verified ✓' : 'Verify'}
                                            </button>
                                        </div>
                                        {verified && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center', gap: '6px',
                                                marginTop: '8px', fontSize: '13px',
                                                color: '#16A34A', fontWeight: '600'
                                            }}>
                                                <CheckCircle size={14} />
                                                UPI ID Verified successfully
                                            </div>
                                        )}
                                    </div>

                                    {/* Saved UPI */}
                                    <div style={{
                                        backgroundColor: '#F8FAFC',
                                        borderRadius: '10px', padding: '14px 16px',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '10px'
                                        }}>
                                            <CheckCircle size={20} color="#0EA5E9" />
                                            <div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: '700', color: '#0F172A'
                                                }}>
                                                    rahul@okhdfcbank
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#94A3B8'
                                                }}>
                                                    Verified student account
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setUpiId('rahul@okhdfcbank')
                                                setVerified(true)
                                            }}
                                            style={{
                                                color: '#1A56DB', fontWeight: '700',
                                                fontSize: '13px', background: 'none',
                                                border: 'none', cursor: 'pointer'
                                            }}>
                                            Use Saved
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CARD TAB */}
                            {activeTab === 'card' && (
                                <div style={{
                                    padding: '24px',
                                    display: 'flex', flexDirection: 'column',
                                    gap: '16px'
                                }}>
                                    <div>
                                        <label style={{
                                            fontSize: '12px',
                                            fontWeight: '700', color: '#64748B',
                                            display: 'block', marginBottom: '8px'
                                        }}>
                                            Cardholder Name
                                        </label>
                                        <input placeholder="As printed on card"
                                            style={{
                                                width: '100%', padding: '12px 16px',
                                                borderRadius: '10px', fontSize: '14px',
                                                border: '1.5px solid #E2E8F0',
                                                backgroundColor: '#F8FAFC', outline: 'none',
                                                boxSizing: 'border-box'
                                            }} />
                                    </div>
                                    <div>
                                        <label style={{
                                            fontSize: '12px',
                                            fontWeight: '700', color: '#64748B',
                                            display: 'block', marginBottom: '8px'
                                        }}>
                                            Card Number
                                        </label>
                                        <input placeholder="•••• •••• •••• ••••"
                                            style={{
                                                width: '100%', padding: '12px 16px',
                                                borderRadius: '10px', fontSize: '14px',
                                                border: '1.5px solid #E2E8F0',
                                                backgroundColor: '#F8FAFC', outline: 'none',
                                                boxSizing: 'border-box'
                                            }} />
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr', gap: '16px'
                                    }}>
                                        <div>
                                            <label style={{
                                                fontSize: '12px',
                                                fontWeight: '700', color: '#64748B',
                                                display: 'block', marginBottom: '8px'
                                            }}>
                                                Expiry Date
                                            </label>
                                            <input placeholder="MM / YY"
                                                style={{
                                                    width: '100%', padding: '12px 16px',
                                                    borderRadius: '10px', fontSize: '14px',
                                                    border: '1.5px solid #E2E8F0',
                                                    backgroundColor: '#F8FAFC', outline: 'none',
                                                    boxSizing: 'border-box'
                                                }} />
                                        </div>
                                        <div>
                                            <label style={{
                                                fontSize: '12px',
                                                fontWeight: '700', color: '#64748B',
                                                display: 'block', marginBottom: '8px'
                                            }}>
                                                CVV
                                            </label>
                                            <input placeholder="•••" type="password"
                                                style={{
                                                    width: '100%', padding: '12px 16px',
                                                    borderRadius: '10px', fontSize: '14px',
                                                    border: '1.5px solid #E2E8F0',
                                                    backgroundColor: '#F8FAFC', outline: 'none',
                                                    boxSizing: 'border-box'
                                                }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NET BANKING TAB */}
                            {activeTab === 'netbanking' && (
                                <div style={{
                                    padding: '24px',
                                    display: 'flex', flexDirection: 'column',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4,1fr)',
                                        gap: '10px'
                                    }}>
                                        {['HDFC Bank', 'State Bank', 'ICICI Bank',
                                            'Axis Bank'].map(bank => (
                                                <button key={bank} style={{
                                                    padding: '12px', borderRadius: '10px',
                                                    border: '1.5px solid #E2E8F0',
                                                    backgroundColor: '#F8FAFC',
                                                    fontSize: '13px', fontWeight: '700',
                                                    color: '#0F172A', cursor: 'pointer'
                                                }}>
                                                    {bank}
                                                </button>
                                            ))}
                                    </div>
                                    <div>
                                        <label style={{
                                            fontSize: '12px',
                                            fontWeight: '700', color: '#64748B',
                                            display: 'block', marginBottom: '8px'
                                        }}>
                                            Or choose other bank
                                        </label>
                                        <select style={{
                                            width: '100%',
                                            padding: '12px 16px', borderRadius: '10px',
                                            fontSize: '14px', border: '1.5px solid #E2E8F0',
                                            backgroundColor: '#F8FAFC', outline: 'none',
                                            boxSizing: 'border-box'
                                        }}>
                                            <option>Select from 50+ banks</option>
                                            <option>Punjab National Bank</option>
                                            <option>Bank of Baroda</option>
                                            <option>Kotak Mahindra Bank</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* WALLET TAB */}
                            {activeTab === 'wallet' && (
                                <div style={{
                                    padding: '24px',
                                    display: 'flex', flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    {['Amazon Pay Balance', 'Paytm Wallet'].map(w => (
                                        <label key={w} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '16px', borderRadius: '12px',
                                            backgroundColor: '#F8FAFC',
                                            border: '1.5px solid #E2E8F0',
                                            cursor: 'pointer'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center', gap: '12px'
                                            }}>
                                                <Wallet size={22} color="#0EA5E9" />
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '700', color: '#0F172A'
                                                }}>
                                                    {w}
                                                </span>
                                            </div>
                                            <input type="radio" name="wallet"
                                                style={{ accentColor: '#1A56DB' }} />
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SECURITY STRIP */}
                        <div style={{
                            backgroundColor: '#F8FAFC',
                            borderRadius: '12px', padding: '16px',
                            border: '1px solid #E2E8F0',
                            display: 'flex', flexWrap: 'wrap', gap: '16px',
                            justifyContent: 'space-between'
                        }}>
                            {[
                                { icon: Shield, label: '256-bit SSL' },
                                { icon: CheckCircle, label: 'PCI-DSS Level 1' },
                                { icon: CreditCard, label: 'Visa & RuPay 3DS' },
                                { icon: Landmark, label: 'RBI Certified' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '6px'
                                }}>
                                    <Icon size={16} color="#22C55E" />
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600', color: '#64748B'
                                    }}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div style={{ position: 'sticky', top: '80px' }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px', padding: '24px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            display: 'flex', flexDirection: 'column',
                            gap: '16px'
                        }}>

                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: '800', color: '#0F172A'
                                }}>
                                    Booking Summary
                                </span>
                                <button
                                    onClick={() => navigate('/order-summary')}
                                    style={{
                                        color: '#1A56DB', fontWeight: '600',
                                        fontSize: '13px', background: 'none',
                                        border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center',
                                        gap: '2px'
                                    }}>
                                    Edit Trip <ChevronRight size={14} />
                                </button>
                            </div>

                            {/* Route */}
                            <div style={{
                                backgroundColor: '#F8FAFC',
                                borderRadius: '12px', padding: '16px',
                                border: '1px solid #E2E8F0'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: '6px'
                                }}>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '800', color: '#0F172A'
                                    }}>
                                        JUIT → New Delhi
                                    </span>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '700', color: '#64748B',
                                        backgroundColor: '#E2E8F0',
                                        padding: '2px 8px', borderRadius: '999px'
                                    }}>
                                        3 Segments
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#94A3B8', marginBottom: '8px'
                                }}>
                                    Thu, 24 Oct · 08:30 AM Departure
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '6px',
                                    fontSize: '12px', color: '#64748B'
                                }}>
                                    <Clock size={14} color="#0EA5E9" />
                                    6h 30m · 2 seamless transfers
                                </div>
                            </div>

                            {/* Legs */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column', gap: '10px'
                            }}>
                                {[
                                    {
                                        icon: Car,
                                        label: journey.leg1.desc,
                                        price: `₹${journey.leg1.price}`
                                    },
                                    {
                                        icon: journey.leg2.key === 'bus' ? Bus : Car,
                                        label: journey.leg2.desc,
                                        price: `₹${journey.leg2.price}`
                                    },
                                    {
                                        icon: journey.leg3.key === 'flight' ? Plane : Train,
                                        label: journey.leg3.desc,
                                        price: `₹${journey.leg3.price}`
                                    },
                                    {
                                        icon: Car,
                                        label: journey.leg4.desc,
                                        price: `₹${journey.leg4.price}`
                                    },
                                    {
                                        icon: CreditCard,
                                        label: 'Gateway Fee',
                                        price: '₹29'
                                    },
                                ].map(({ icon: Icon, label, price }) => (
                                    <div key={label} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '8px'
                                        }}>
                                            <Icon size={16} color="#0EA5E9" />
                                            <span style={{
                                                fontSize: '13px',
                                                color: '#64748B'
                                            }}>{label}</span>
                                        </div>
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: '700', color: '#0F172A'
                                        }}>
                                            {price}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div style={{
                                backgroundColor: '#F8FAFC',
                                borderRadius: '12px', padding: '16px',
                                border: '1px solid #E2E8F0',
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '11px',
                                        fontWeight: '700', color: '#94A3B8',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        marginBottom: '4px'
                                    }}>
                                        Final Total Due
                                    </div>
                                    <div style={{
                                        fontSize: '36px',
                                        fontWeight: '900', color: '#1A56DB',
                                        letterSpacing: '-1px', lineHeight: 1
                                    }}>
                                        ₹{totalCost + 29}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#94A3B8', marginTop: '4px'
                                    }}>
                                        Incl. GST, insurance & toll
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        backgroundColor: '#DCFCE7',
                                        padding: '6px 12px', borderRadius: '999px',
                                        fontSize: '12px', fontWeight: '700',
                                        color: '#16A34A', marginBottom: '4px'
                                    }}>
                                        ₹200 Saved
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#16A34A', fontWeight: '600'
                                    }}>
                                        Student Pass Applied
                                    </div>
                                </div>
                            </div>

                            {/* TIMER */}
                            <div style={{
                                backgroundColor: '#FFF7ED',
                                borderRadius: '10px', padding: '12px 16px',
                                border: '1px solid #FED7AA',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '8px'
                                }}>
                                    <Clock size={18} color="#D97706" />
                                    <div>
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: '700', color: '#0F172A'
                                        }}>
                                            Time remaining:{' '}
                                            <span style={{ color: '#D97706' }}>
                                                {formatTimer()}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#94A3B8'
                                        }}>
                                            Seats & cab slots held
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '8px', height: '8px',
                                    backgroundColor: '#D97706',
                                    borderRadius: '999px'
                                }} />
                            </div>

                            {/* PAY BUTTON */}
                            <button
                                onClick={handlePay}
                                disabled={paying}
                                style={{
                                    width: '100%',
                                    backgroundColor: paying ? '#94A3B8' : '#1A56DB',
                                    color: '#fff', padding: '18px',
                                    borderRadius: '12px', fontWeight: '800',
                                    fontSize: '18px', border: 'none',
                                    cursor: paying ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '8px',
                                    boxShadow: '0 4px 16px rgba(26,86,219,0.3)',
                                    letterSpacing: '-0.5px'
                                }}>
                                {paying ? 'Processing...' : <>Pay ₹{totalCost + 29} <ArrowRight size={20} /></>}
                            </button>

                            {/* Razorpay + Cancel */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', gap: '6px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '6px',
                                    fontSize: '12px', color: '#94A3B8'
                                }}>
                                    <Lock size={13} color="#94A3B8" />
                                    Encrypted processing partner
                                    <strong style={{ color: '#0F172A' }}>
                                        Razorpay
                                    </strong>
                                </div>
                                <button
                                    onClick={() => navigate('/order-summary')}
                                    style={{
                                        fontSize: '12px', color: '#94A3B8',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer'
                                    }}>
                                    ← Cancel and return
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment