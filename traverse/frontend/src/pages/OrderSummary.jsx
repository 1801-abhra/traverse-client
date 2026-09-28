import { useNavigate } from 'react-router-dom'
import {
    MapPin, Car, Train, ArrowRight, ChevronRight,
    CheckCircle, Lock, Edit, Info, PartyPopper
} from 'lucide-react'

function OrderSummary() {
    const navigate = useNavigate()

    const legs = [
        {
            icon: Car, mode: 'Cab',
            route: 'JUIT → Chandigarh Station',
            time: '08:30 AM → 09:45 AM · 1h 15m',
            price: 200, confirmed: false
        },
        {
            icon: Train, mode: 'Train',
            route: 'Chandigarh → New Delhi',
            time: '10:10 AM → 2:40 PM · 4h 30m',
            price: 450, confirmed: true
        },
        {
            icon: Car, mode: 'Cab',
            route: 'Delhi Station → Destination',
            time: '2:55 PM → 3:40 PM · 45m',
            price: 300, confirmed: false
        },
    ]

    return (
        <div style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff', minHeight: '100vh'
        }}>

            {/* MAIN CONTENT */}
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
                    <button onClick={() => navigate('/search')}
                        style={{
                            color: '#94A3B8', background: 'none',
                            border: 'none', cursor: 'pointer', fontSize: '13px',
                            fontWeight: '600'
                        }}>
                        Search Results
                    </button>
                    <ChevronRight size={14} />
                    <button onClick={() => navigate('/journey-builder')}
                        style={{
                            color: '#94A3B8', background: 'none',
                            border: 'none', cursor: 'pointer', fontSize: '13px',
                            fontWeight: '600'
                        }}>
                        Journey Builder
                    </button>
                    <ChevronRight size={14} />
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>
                        Order Summary
                    </span>
                </div>

                {/* PAGE TITLE */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '36px', fontWeight: '800',
                        color: '#0F172A', letterSpacing: '-1px',
                        margin: '0 0 4px'
                    }}>
                        Review Your Journey
                    </h1>
                    <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
                        Check everything before you pay.
                    </p>
                </div>

                {/* TWO COLUMN LAYOUT */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 360px',
                    gap: '32px', alignItems: 'start'
                }}>

                    {/* LEFT COLUMN */}
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        gap: '20px'
                    }}>

                        {/* CARD 1 — YOUR JOURNEY */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px', padding: '24px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '8px'
                                }}>
                                    <MapPin size={20} color="#1A56DB" />
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: '800', color: '#0F172A'
                                    }}>
                                        Your Journey
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '6px',
                                    backgroundColor: '#EFF6FF', padding: '6px 12px',
                                    borderRadius: '999px'
                                }}>
                                    <div style={{
                                        width: '6px', height: '6px',
                                        backgroundColor: '#1A56DB',
                                        borderRadius: '999px'
                                    }} />
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '700', color: '#1A56DB'
                                    }}>
                                        Verified Flow
                                    </span>
                                </div>
                            </div>

                            {/* Route Visual */}
                            <div style={{
                                backgroundColor: '#F8FAFC',
                                borderRadius: '12px', padding: '16px',
                                display: 'flex', alignItems: 'center',
                                gap: '8px', flexWrap: 'wrap',
                                marginBottom: '12px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '6px'
                                }}>
                                    <MapPin size={16} color="#1A56DB" />
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '700', color: '#0F172A'
                                    }}>
                                        JUIT Waknaghat
                                    </span>
                                </div>
                                {['Cab', 'Train', 'Cab'].map((mode, i) => (
                                    <>
                                        <div key={`line-${i}`} style={{
                                            height: '2px',
                                            width: '20px', backgroundColor: '#CBD5E1',
                                            borderRadius: '2px'
                                        }} />
                                        <div key={`mode-${i}`} style={{
                                            display: 'flex', alignItems: 'center',
                                            gap: '4px', backgroundColor: '#E2E8F0',
                                            padding: '3px 8px', borderRadius: '999px'
                                        }}>
                                            {mode === 'Train'
                                                ? <Train size={12} color="#1A56DB" />
                                                : <Car size={12} color="#1A56DB" />}
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: '700', color: '#475569'
                                            }}>
                                                {mode}
                                            </span>
                                        </div>
                                        <div key={`line2-${i}`} style={{
                                            height: '2px',
                                            width: '20px', backgroundColor: '#CBD5E1',
                                            borderRadius: '2px'
                                        }} />
                                    </>
                                ))}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '6px'
                                }}>
                                    <MapPin size={16} color="#22C55E" />
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '700', color: '#0F172A'
                                    }}>
                                        New Delhi
                                    </span>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div style={{
                                display: 'flex', gap: '16px',
                                fontSize: '13px', color: '#94A3B8'
                            }}>
                                <span>3 legs</span>
                                <span>·</span>
                                <span>6h 30m</span>
                                <span>·</span>
                                <span>2 transfers</span>
                            </div>
                        </div>

                        {/* CARD 2 — JOURNEY BREAKDOWN */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px', padding: '24px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '20px'
                            }}>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: '800', color: '#0F172A'
                                }}>
                                    Journey Breakdown
                                </span>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '700', color: '#64748B',
                                    backgroundColor: '#F1F5F9',
                                    padding: '4px 10px', borderRadius: '999px'
                                }}>
                                    Full Itinerary
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column', gap: '12px'
                            }}>
                                {legs.map((leg, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px', backgroundColor: '#F8FAFC',
                                        borderRadius: '12px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '12px'
                                        }}>
                                            <div style={{
                                                width: '48px', height: '48px',
                                                borderRadius: '12px',
                                                backgroundColor: '#EFF6FF',
                                                display: 'flex', flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center', gap: '2px'
                                            }}>
                                                <leg.icon size={20} color="#1A56DB" />
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '700', color: '#94A3B8'
                                                }}>
                                                    {leg.mode}
                                                </span>
                                            </div>
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center', gap: '8px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        fontWeight: '700', color: '#0F172A'
                                                    }}>
                                                        {leg.route}
                                                    </span>
                                                    {leg.confirmed && (
                                                        <div style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center', gap: '4px',
                                                            backgroundColor: '#DCFCE7',
                                                            padding: '2px 8px',
                                                            borderRadius: '999px'
                                                        }}>
                                                            <CheckCircle size={11}
                                                                color="#16A34A" />
                                                            <span style={{
                                                                fontSize: '11px',
                                                                fontWeight: '700',
                                                                color: '#16A34A'
                                                            }}>
                                                                Confirmed Seat
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span style={{
                                                    fontSize: '13px',
                                                    color: '#94A3B8'
                                                }}>
                                                    {leg.time}
                                                </span>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '18px',
                                            fontWeight: '900', color: '#0EA5E9',
                                            flexShrink: 0, marginLeft: '16px'
                                        }}>
                                            ₹{leg.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CARD 3 — TRAVELLER DETAILS */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px', padding: '24px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '20px'
                            }}>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: '800', color: '#0F172A'
                                }}>
                                    Traveller Details
                                </span>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '4px',
                                    color: '#1A56DB', fontWeight: '600',
                                    fontSize: '14px', background: 'none',
                                    border: 'none', cursor: 'pointer'
                                }}>
                                    <Edit size={15} /> Edit
                                </button>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px', backgroundColor: '#F8FAFC',
                                borderRadius: '12px', padding: '20px'
                            }}>
                                {[
                                    {
                                        label: 'Primary Passenger',
                                        value: 'Rahul Sharma', large: true
                                    },
                                    {
                                        label: 'Email Address',
                                        value: 'rahul@juitsolan.ac.in',
                                        verified: true
                                    },
                                    {
                                        label: 'Phone',
                                        value: '+91 98765 43210'
                                    },
                                    {
                                        label: 'University Campus',
                                        value: 'JUIT, Waknaghat'
                                    },
                                ].map(({ label, value, large, verified }) => (
                                    <div key={label}>
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: '700', color: '#94A3B8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            marginBottom: '4px'
                                        }}>
                                            {label}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px'
                                        }}>
                                            <span style={{
                                                fontSize: large ? '18px' : '14px',
                                                fontWeight: large ? '800' : '600',
                                                color: '#0F172A'
                                            }}>
                                                {value}
                                            </span>
                                            {verified && (
                                                <CheckCircle size={16} color="#1A56DB" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CARD 4 — IMPORTANT NOTE */}
                        <div style={{
                            backgroundColor: '#FFFBEB',
                            borderRadius: '12px', padding: '16px',
                            border: '1px solid #FDE68A',
                            display: 'flex', gap: '12px',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{
                                backgroundColor: '#FEF3C7',
                                borderRadius: '8px', padding: '8px',
                                flexShrink: 0
                            }}>
                                <Info size={18} color="#D97706" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '14px', fontWeight: '700',
                                    color: '#0F172A', marginBottom: '6px'
                                }}>
                                    Important Policy
                                </div>
                                <ul style={{
                                    fontSize: '13px', color: '#64748B',
                                    lineHeight: '1.6', paddingLeft: '16px',
                                    margin: 0
                                }}>
                                    <li>Booking confirmed only after successful payment.</li>
                                    <li>Free cancellation up to 24hrs before departure.</li>
                                </ul>
                            </div>
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
                                    Price Summary
                                </span>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '700', color: '#94A3B8',
                                    textTransform: 'uppercase'
                                }}>
                                    INR (₹)
                                </span>
                            </div>

                            {/* Itemized */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column', gap: '10px'
                            }}>
                                {[
                                    {
                                        label: 'Cab (JUIT → Chandigarh)',
                                        value: '₹200'
                                    },
                                    {
                                        label: 'Train (Chandigarh → Delhi)',
                                        value: '₹450'
                                    },
                                    {
                                        label: 'Cab (Delhi → Destination)',
                                        value: '₹300'
                                    },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            fontSize: '13px',
                                            color: '#64748B'
                                        }}>{label}</span>
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: '700', color: '#0F172A'
                                        }}>
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Subtotal */}
                            <div style={{
                                backgroundColor: '#F8FAFC',
                                borderRadius: '10px', padding: '12px',
                                display: 'flex', flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{
                                        fontSize: '13px',
                                        color: '#64748B'
                                    }}>Subtotal</span>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '700', color: '#0F172A'
                                    }}>
                                        ₹950
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{
                                        fontSize: '13px',
                                        color: '#64748B'
                                    }}>Convenience Fee</span>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '700', color: '#0F172A'
                                    }}>
                                        ₹29
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                paddingTop: '4px'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '800', color: '#0F172A'
                                    }}>
                                        Total Amount
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#94A3B8'
                                    }}>
                                        Incl. all taxes
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '32px',
                                    fontWeight: '900', color: '#0EA5E9',
                                    letterSpacing: '-1px'
                                }}>
                                    ₹979
                                </span>
                            </div>

                            {/* Savings */}
                            <div style={{
                                backgroundColor: '#DCFCE7',
                                borderRadius: '10px', padding: '12px',
                                display: 'flex', alignItems: 'center',
                                gap: '8px'
                            }}>
                                <CheckCircle size={18} color="#16A34A" />
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '700', color: '#15803D'
                                }}>
                                    You saved ₹320 with student discount
                                </span>
                            </div>

                            {/* Buttons */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column', gap: '10px'
                            }}>
                                <button
                                    onClick={() => navigate('/payment')}
                                    style={{
                                        backgroundColor: '#1A56DB',
                                        color: '#fff', padding: '16px',
                                        borderRadius: '12px', fontWeight: '700',
                                        fontSize: '15px', border: 'none',
                                        cursor: 'pointer', display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center', gap: '8px',
                                        boxShadow: '0 4px 16px rgba(26,86,219,0.3)'
                                    }}>
                                    Confirm & Pay <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={() => navigate('/journey-builder')}
                                    style={{
                                        backgroundColor: '#F1F5F9',
                                        color: '#0F172A', padding: '12px',
                                        borderRadius: '12px', fontWeight: '600',
                                        fontSize: '14px', border: 'none',
                                        cursor: 'pointer', display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center', gap: '6px'
                                    }}>
                                    ← Back
                                </button>
                            </div>

                            {/* Security */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                gap: '6px'
                            }}>
                                <Lock size={14} color="#94A3B8" />
                                <span style={{
                                    fontSize: '12px',
                                    color: '#94A3B8'
                                }}>
                                    100% secure · 256-bit SSL encryption
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary