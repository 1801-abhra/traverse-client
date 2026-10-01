import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MapPin, Mail, Lock, Eye, EyeOff,
    Train, Car, Home, ArrowRight, CheckCircle
} from 'lucide-react'

function Login() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => navigate('/'), 1000)
    }

    const stops = [
        {
            icon: Home, label: 'Your Home / Campus',
            sub: '08:00 AM · Main Gate Terminal',
            tag: 'Origin', color: '#1A56DB'
        },
        {
            icon: Car, label: 'First Mile Transit',
            sub: '15 mins · Metro Station Express',
            tag: 'Auto-linked', color: '#0EA5E9'
        },
        {
            icon: Train, label: 'Main Journey Express',
            sub: 'Confirmed Berth · Platform 4',
            tag: 'IRCTC Pass', color: '#1A56DB'
        },
        {
            icon: MapPin, label: 'Destination Campus',
            sub: '11:45 AM · Gate 2 Drop-off',
            tag: 'Covered', color: '#22C55E'
        },
    ]

    return (
        <div style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff', minHeight: '100vh'
        }}>

            {/* SUB HEADER */}
            <div style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #E2E8F0',
                padding: '0 24px', height: '56px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '1280px', margin: '0 auto'
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex', alignItems: 'center',
                        gap: '6px', color: '#64748B', background: 'none',
                        border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: '600'
                    }}>
                    ← Back to Explore
                </button>
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '6px', backgroundColor: '#F1F5F9',
                    padding: '6px 12px', borderRadius: '999px'
                }}>
                    <div style={{
                        width: '8px', height: '8px',
                        backgroundColor: '#0EA5E9',
                        borderRadius: '999px'
                    }} />
                    <span style={{
                        fontSize: '11px', fontWeight: '700',
                        color: '#0EA5E9', textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        Campus Transit Network Live
                    </span>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{
                maxWidth: '1280px', margin: '0 auto',
                padding: '40px 24px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '5fr 7fr',
                    borderRadius: '20px', overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    minHeight: '680px'
                }}>

                    {/* LEFT PANEL */}
                    <div style={{
                        backgroundColor: '#F8FAFC',
                        padding: '48px 40px',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative', overflow: 'hidden'
                    }}>

                        {/* Logo */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center', gap: '10px'
                        }}>
                            <div style={{
                                width: '36px', height: '36px',
                                backgroundColor: '#1A56DB',
                                borderRadius: '10px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <MapPin size={20} color="#fff" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '800', color: '#1A56DB',
                                    letterSpacing: '-0.5px'
                                }}>
                                    TRAVERSE
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    fontWeight: '700', color: '#64748B',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    One Journey. Every Mode.
                                </div>
                            </div>
                        </div>

                        {/* Journey card */}
                        <div style={{ margin: '32px 0' }}>
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '16px', padding: '24px',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <span style={{
                                        backgroundColor: '#EFF6FF',
                                        color: '#1A56DB', fontSize: '11px',
                                        fontWeight: '700', padding: '4px 10px',
                                        borderRadius: '999px'
                                    }}>
                                        Unified Ticket Matrix
                                    </span>
                                    <span style={{
                                        fontSize: '11px',
                                        color: '#94A3B8'
                                    }}>TRV-8942-IN</span>
                                </div>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '800', color: '#0F172A',
                                    margin: '0 0 4px'
                                }}>
                                    Welcome back, traveller.
                                </h3>
                                <p style={{
                                    fontSize: '13px', color: '#64748B',
                                    margin: '0 0 20px'
                                }}>
                                    Your next seamless journey is one tap away.
                                </p>

                                {/* Timeline */}
                                <div style={{
                                    position: 'relative',
                                    paddingLeft: '28px'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '13px', top: '14px', bottom: '14px',
                                        width: '2px', borderLeft: '2px dashed #CBD5E1',
                                        zIndex: 0
                                    }} />
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column', gap: '16px'
                                    }}>
                                        {stops.map((stop, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start', gap: '12px'
                                            }}>
                                                <div style={{
                                                    width: '28px',
                                                    height: '28px', borderRadius: '999px',
                                                    backgroundColor: stop.color,
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0, zIndex: 1,
                                                    boxShadow: '0 0 0 3px #fff'
                                                }}>
                                                    <stop.icon size={14} color="#fff" />
                                                </div>
                                                <div style={{
                                                    flex: 1, display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <div>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            fontWeight: '700', color: '#0F172A'
                                                        }}>
                                                            {stop.label}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: '#94A3B8'
                                                        }}>
                                                            {stop.sub}
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: '700',
                                                        backgroundColor: '#F1F5F9',
                                                        color: '#475569', padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        flexShrink: 0, marginLeft: '8px'
                                                    }}>
                                                        {stop.tag}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Provider badges */}
                        <div>
                            <div style={{
                                fontSize: '11px', fontWeight: '700',
                                color: '#94A3B8', textTransform: 'uppercase',
                                letterSpacing: '0.08em', marginBottom: '10px'
                            }}>
                                Works Across National Providers
                            </div>
                            <div style={{
                                display: 'flex', gap: '8px',
                                flexWrap: 'wrap'
                            }}>
                                {['IRCTC Rail', 'Metro SmartCard',
                                    'Intercity Bus', 'Campus Cabs'].map(p => (
                                        <span key={p} style={{
                                            fontSize: '12px',
                                            fontWeight: '600', color: '#475569',
                                            backgroundColor: '#fff',
                                            padding: '4px 10px', borderRadius: '6px',
                                            border: '1px solid #E2E8F0'
                                        }}>
                                            {p}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '48px 56px',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            maxWidth: '440px', margin: '0 auto',
                            width: '100%'
                        }}>

                            {/* Tag */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center', gap: '6px',
                                backgroundColor: '#EFF6FF', color: '#1A56DB',
                                fontSize: '12px', fontWeight: '700',
                                padding: '6px 12px', borderRadius: '999px',
                                marginBottom: '16px'
                            }}>
                                Student Exclusive Access
                            </div>

                            <h1 style={{
                                fontSize: '40px', fontWeight: '800',
                                color: '#0F172A', letterSpacing: '-1.5px',
                                margin: '0 0 6px'
                            }}>
                                Welcome back
                            </h1>
                            <p style={{
                                fontSize: '15px', color: '#64748B',
                                margin: '0 0 32px'
                            }}>
                                Log in to continue your seamless journey planning.
                            </p>

                            {/* Google button */}
                            <button style={{
                                width: '100%', padding: '14px',
                                borderRadius: '12px', border: '1.5px solid #E2E8F0',
                                backgroundColor: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '10px',
                                fontSize: '14px', fontWeight: '600',
                                color: '#0F172A', marginBottom: '24px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', gap: '12px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    flex: 1, height: '1px',
                                    backgroundColor: '#E2E8F0'
                                }} />
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '700', color: '#94A3B8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em'
                                }}>
                                    Or login with campus email
                                </span>
                                <div style={{
                                    flex: 1, height: '1px',
                                    backgroundColor: '#E2E8F0'
                                }} />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLogin}>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '6px'
                                    }}>
                                        <label style={{
                                            fontSize: '13px',
                                            fontWeight: '700', color: '#0F172A'
                                        }}>
                                            University Email
                                        </label>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '4px',
                                            fontSize: '12px', fontWeight: '700',
                                            color: '#0EA5E9'
                                        }}>
                                            <CheckCircle size={12} />
                                            Campus Verified
                                        </span>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} color="#94A3B8"
                                            style={{
                                                position: 'absolute', left: '14px',
                                                top: '50%', transform: 'translateY(-50%)'
                                            }} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="yourname@juitsolan.ac.in"
                                            style={{
                                                width: '100%',
                                                padding: '14px 14px 14px 44px',
                                                borderRadius: '12px',
                                                border: '1.5px solid #E2E8F0',
                                                backgroundColor: '#F8FAFC',
                                                fontSize: '14px', color: '#0F172A',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{
                                        fontSize: '13px',
                                        fontWeight: '700', color: '#0F172A',
                                        display: 'block', marginBottom: '6px'
                                    }}>
                                        Password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} color="#94A3B8"
                                            style={{
                                                position: 'absolute', left: '14px',
                                                top: '50%', transform: 'translateY(-50%)'
                                            }} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Your password"
                                            style={{
                                                width: '100%',
                                                padding: '14px 44px 14px 44px',
                                                borderRadius: '12px',
                                                border: '1.5px solid #E2E8F0',
                                                backgroundColor: '#F8FAFC',
                                                fontSize: '14px', color: '#0F172A',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }} />
                                        <button type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '14px', top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none', border: 'none',
                                                cursor: 'pointer'
                                            }}>
                                            {showPassword
                                                ? <EyeOff size={18} color="#94A3B8" />
                                                : <Eye size={18} color="#94A3B8" />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: '24px'
                                }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center', gap: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        <input type="checkbox"
                                            style={{ accentColor: '#1A56DB' }} />
                                        <span style={{
                                            fontSize: '13px',
                                            color: '#64748B'
                                        }}>
                                            Remember me
                                        </span>
                                    </label>
                                    <button type="button" style={{
                                        color: '#1A56DB', fontWeight: '700',
                                        fontSize: '13px', background: 'none',
                                        border: 'none', cursor: 'pointer'
                                    }}>
                                        Forgot password?
                                    </button>
                                </div>

                                <button type="submit"
                                    style={{
                                        width: '100%',
                                        backgroundColor: loading
                                            ? '#64748B' : '#1A56DB',
                                        color: '#fff', padding: '16px',
                                        borderRadius: '12px', fontWeight: '700',
                                        fontSize: '15px', border: 'none',
                                        cursor: 'pointer', display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center', gap: '8px',
                                        boxShadow: '0 4px 16px rgba(26,86,219,0.3)'
                                    }}>
                                    {loading ? 'Logging in...' : (
                                        <>Log In <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>

                            <div style={{
                                textAlign: 'center',
                                marginTop: '20px', fontSize: '14px',
                                color: '#64748B'
                            }}>
                                New to Traverse?{' '}
                                <button
                                    onClick={() => navigate('/signup')}
                                    style={{
                                        color: '#1A56DB', fontWeight: '700',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', fontSize: '14px'
                                    }}>
                                    Sign Up
                                </button>
                            </div>

                            <div style={{
                                marginTop: '32px',
                                paddingTop: '20px',
                                borderTop: '1px solid #E2E8F0',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '8px'
                            }}>
                                <CheckCircle size={14} color="#0EA5E9" />
                                <span style={{
                                    fontSize: '12px',
                                    color: '#94A3B8', textAlign: 'center'
                                }}>
                                    Secure login. Your data is protected under
                                    ISO/IEC 27001 campus compliance standards.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM TRUST CARDS */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3,1fr)',
                    gap: '20px', marginTop: '24px'
                }}>
                    {[
                        {
                            title: 'Flat 25% Student Rebate',
                            desc: 'Applied automatically at checkout across all connecting bus and metro transit legs.'
                        },
                        {
                            title: 'Guaranteed Connection',
                            desc: 'Missed your leg due to train delays? Instant automated backup rebooking at zero extra cost.'
                        },
                        {
                            title: 'One Universal QR Pass',
                            desc: 'Single dynamic digital ticket scans cleanly at metro gates, intercity rail turnstiles, and auto meters.'
                        },
                    ].map(({ title, desc }) => (
                        <div key={title} style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px', padding: '24px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{
                                fontSize: '15px', fontWeight: '800',
                                color: '#0F172A', marginBottom: '8px'
                            }}>
                                {title}
                            </div>
                            <div style={{
                                fontSize: '13px', color: '#64748B',
                                lineHeight: '1.6'
                            }}>
                                {desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Login