import { useNavigate } from 'react-router-dom'
import {
    CheckCircle, MapPin, Car, Train, Bus,
    Calendar, Clock, User, Share2,
    Download, ArrowRight, Copy
} from 'lucide-react'
import { useJourney } from '../context/JourneyContext'

function Confirmation() {
    const navigate = useNavigate()
    const { journey, totalCost } = useJourney()

    const legs = [
        {
            icon: Car, mode: journey.leg1.label,
            route: journey.leg1.desc,
            time: '08:30 → 09:00 · 30m',
            price: journey.leg1.price
        },
        {
            icon: journey.leg2.key === 'bus' ? Bus : Car,
            mode: journey.leg2.label,
            route: journey.leg2.desc,
            time: '09:15 → 11:00 · 1h 45m',
            price: journey.leg2.price
        },
        {
            icon: Train, mode: journey.leg3.label,
            route: journey.leg3.desc,
            time: '11:30 → 5:00 PM · 5h 30m',
            price: journey.leg3.price,
            confirmed: journey.leg3.key !== 'flight'
        },
        {
            icon: Car, mode: journey.leg4.label,
            route: journey.leg4.desc,
            time: '5:15 PM → 5:45 PM · 30m',
            price: journey.leg4.price
        },
    ]

    return (
        <div style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff', minHeight: '100vh'
        }}>

            <div style={{
                maxWidth: '680px', margin: '0 auto',
                padding: '32px 24px'
            }}>

                {/* BREADCRUMB */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '6px',
                    fontSize: '13px', color: '#94A3B8',
                    marginBottom: '32px', flexWrap: 'wrap'
                }}>
                    {['Search Results', 'Journey Builder',
                        'Order Summary', 'Payment'].map((item, i) => (
                            <>
                                <span key={item}>{item}</span>
                                <span key={`s-${i}`}
                                    style={{ color: '#CBD5E1' }}>/</span>
                            </>
                        ))}
                    <span style={{
                        color: '#1A56DB',
                        fontWeight: '700'
                    }}>Confirmation</span>
                </div>

                {/* SUCCESS HERO */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', marginBottom: '32px'
                }}>
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '999px',
                        backgroundColor: '#22C55E',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 0 12px #DCFCE7',
                        marginBottom: '20px'
                    }}>
                        <CheckCircle size={40} color="#fff" />
                    </div>
                    <h1 style={{
                        fontSize: '36px', fontWeight: '800',
                        color: '#0F172A', letterSpacing: '-1px',
                        margin: '0 0 8px'
                    }}>
                        Booking Confirmed!
                    </h1>
                    <p style={{
                        fontSize: '16px', color: '#64748B',
                        margin: 0
                    }}>
                        Your journey is all set.
                    </p>
                </div>

                {/* BOOKING REFERENCE CARD */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px', overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        height: '4px',
                        backgroundColor: '#22C55E'
                    }} />
                    <div style={{
                        padding: '24px', display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: '700', color: '#94A3B8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginBottom: '6px'
                            }}>
                                Booking ID
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', gap: '8px'
                            }}>
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: '24px', fontWeight: '800',
                                    color: '#0F172A', letterSpacing: '2px'
                                }}>
                                    TRV-2024-8821
                                </span>
                                <button
                                    onClick={() => navigator.clipboard
                                        .writeText('TRV-2024-8821')}
                                    style={{
                                        background: 'none',
                                        border: 'none', cursor: 'pointer',
                                        padding: '4px'
                                    }}>
                                    <Copy size={16} color="#94A3B8" />
                                </button>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', gap: '6px',
                                marginTop: '8px', fontSize: '13px',
                                color: '#64748B'
                            }}>
                                <CheckCircle size={14} color="#22C55E" />
                                Show this at boarding or check-in
                            </div>
                        </div>

                        {/* QR CODE */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', gap: '6px'
                        }}>
                            <div style={{
                                width: '90px', height: '90px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '12px', padding: '8px',
                                border: '1px solid #E2E8F0'
                            }}>
                                <svg viewBox="0 0 100 100"
                                    style={{ width: '100%', height: '100%' }}>
                                    <rect x="0" y="0" width="28" height="28"
                                        rx="2" fill="#0F172A" />
                                    <rect x="4" y="4" width="20" height="20"
                                        rx="1" fill="white" />
                                    <rect x="8" y="8" width="12" height="12"
                                        fill="#0F172A" />
                                    <rect x="72" y="0" width="28" height="28"
                                        rx="2" fill="#0F172A" />
                                    <rect x="76" y="4" width="20" height="20"
                                        rx="1" fill="white" />
                                    <rect x="80" y="8" width="12" height="12"
                                        fill="#0F172A" />
                                    <rect x="0" y="72" width="28" height="28"
                                        rx="2" fill="#0F172A" />
                                    <rect x="4" y="76" width="20" height="20"
                                        rx="1" fill="white" />
                                    <rect x="8" y="80" width="12" height="12"
                                        fill="#0F172A" />
                                    <rect x="36" y="6" width="6" height="6"
                                        fill="#0F172A" />
                                    <rect x="46" y="6" width="6" height="6"
                                        fill="#0F172A" />
                                    <rect x="58" y="6" width="6" height="6"
                                        fill="#0F172A" />
                                    <rect x="36" y="18" width="8" height="6"
                                        fill="#0F172A" />
                                    <rect x="52" y="16" width="10" height="8"
                                        fill="#0F172A" />
                                    <rect x="8" y="36" width="8" height="8"
                                        fill="#0F172A" />
                                    <rect x="22" y="38" width="6" height="12"
                                        fill="#0F172A" />
                                    <rect x="36" y="34" width="12" height="12"
                                        fill="#0F172A" />
                                    <rect x="56" y="36" width="8" height="6"
                                        fill="#0F172A" />
                                    <rect x="70" y="38" width="10" height="8"
                                        fill="#0F172A" />
                                    <rect x="86" y="36" width="8" height="10"
                                        fill="#0F172A" />
                                    <rect x="44" y="52" width="14" height="6"
                                        fill="#0F172A" />
                                    <rect x="34" y="64" width="8" height="14"
                                        fill="#0F172A" />
                                    <rect x="48" y="66" width="12" height="6"
                                        fill="#0F172A" />
                                    <rect x="66" y="56" width="8" height="16"
                                        fill="#0F172A" />
                                    <rect x="82" y="54" width="12" height="8"
                                        fill="#0F172A" />
                                    <rect x="80" y="70" width="8" height="10"
                                        fill="#0F172A" />
                                    <rect x="46" y="82" width="16" height="10"
                                        fill="#0F172A" />
                                </svg>
                            </div>
                            <span style={{
                                fontSize: '11px',
                                color: '#94A3B8', fontWeight: '600'
                            }}>
                                Scan for pass
                            </span>
                        </div>
                    </div>
                </div>

                {/* JOURNEY SUMMARY CARD */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px', padding: '24px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    marginBottom: '20px'
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
                        <span style={{
                            backgroundColor: '#EFF6FF',
                            color: '#1A56DB', fontSize: '12px',
                            fontWeight: '700', padding: '4px 12px',
                            borderRadius: '999px'
                        }}>
                            Multi-Modal Pass
                        </span>
                    </div>

                    {/* Compact route visual */}
                    <div style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px', padding: '16px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: '24px', right: '24px', top: '16px',
                                height: '2px', borderTop: '2px dashed #CBD5E1',
                                zIndex: 0
                            }} />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', zIndex: 1
                            }}>
                                <div style={{
                                    width: '32px', height: '32px',
                                    borderRadius: '999px',
                                    backgroundColor: '#EFF6FF',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MapPin size={16} color="#1A56DB" />
                                </div>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '800', color: '#0F172A',
                                    marginTop: '6px'
                                }}>JUIT</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', zIndex: 1
                            }}>
                                <div style={{
                                    width: '32px', height: '32px',
                                    borderRadius: '999px',
                                    backgroundColor: '#1A56DB',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Train size={16} color="#fff" />
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    color: '#64748B', marginTop: '6px'
                                }}>
                                    CDG Hub
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', zIndex: 1
                            }}>
                                <div style={{
                                    width: '32px', height: '32px',
                                    borderRadius: '999px',
                                    backgroundColor: '#22C55E',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MapPin size={16} color="#fff" />
                                </div>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '800', color: '#0F172A',
                                    marginTop: '6px'
                                }}>New Delhi</span>
                            </div>
                        </div>

                        {/* Metadata pills */}
                        <div style={{
                            display: 'flex', gap: '8px',
                            flexWrap: 'wrap', justifyContent: 'center',
                            marginTop: '16px'
                        }}>
                            {[
                                { icon: Calendar, label: 'Thu, 24 Oct' },
                                { icon: Clock, label: '~7h 30m total' },
                                { icon: User, label: '1 Traveller (Rahul Sharma)' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} style={{
                                    display: 'inline-flex',
                                    alignItems: 'center', gap: '6px',
                                    backgroundColor: '#E2E8F0',
                                    padding: '6px 12px', borderRadius: '999px',
                                    fontSize: '12px', fontWeight: '600',
                                    color: '#475569'
                                }}>
                                    <Icon size={13} color="#1A56DB" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legs */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', gap: '10px'
                    }}>
                        {legs.map((leg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 16px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '12px', gap: '12px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '12px',
                                    minWidth: 0
                                }}>
                                    <div style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '999px',
                                        backgroundColor: '#EFF6FF',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <leg.icon size={18} color="#1A56DB" />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: '700', color: '#0EA5E9',
                                                textTransform: 'uppercase'
                                            }}>
                                                {leg.mode}
                                            </span>
                                            <span style={{
                                                fontSize: '13px',
                                                fontWeight: '700', color: '#0F172A'
                                            }}>
                                                {leg.route}
                                            </span>
                                            {leg.confirmed && (
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '700', color: '#16A34A',
                                                    backgroundColor: '#DCFCE7',
                                                    padding: '2px 8px',
                                                    borderRadius: '999px'
                                                }}>
                                                    Confirmed Seat
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#94A3B8', marginTop: '2px'
                                        }}>
                                            {leg.time}
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '900', color: '#0EA5E9',
                                    flexShrink: 0
                                }}>
                                    ₹{leg.price}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div style={{
                        height: '1px',
                        backgroundColor: '#E2E8F0', margin: '16px 0'
                    }} />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center', padding: '0 4px'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '15px',
                                fontWeight: '700', color: '#0F172A'
                            }}>
                                Total Paid
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#94A3B8'
                            }}>
                                Includes all taxes & student rebate
                            </div>
                        </div>
                        <span style={{
                            fontSize: '28px',
                            fontWeight: '900', color: '#0EA5E9',
                            letterSpacing: '-1px'
                        }}>
                            ₹{totalCost + 29}
                        </span>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column', gap: '12px',
                    marginBottom: '20px'
                }}>
                    <button
                        onClick={() => navigate('/my-trips')}
                        style={{
                            width: '100%',
                            backgroundColor: '#1A56DB', color: '#fff',
                            padding: '16px', borderRadius: '14px',
                            fontWeight: '700', fontSize: '15px',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px',
                            boxShadow: '0 4px 16px rgba(26,86,219,0.3)'
                        }}>
                        View Full Itinerary <ArrowRight size={18} />
                    </button>
                    <button
                        onClick={() => window.print()}
                        style={{
                            width: '100%',
                            backgroundColor: '#fff', color: '#0EA5E9',
                            padding: '14px', borderRadius: '14px',
                            fontWeight: '700', fontSize: '15px',
                            border: '1.5px solid #E2E8F0', cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px'
                        }}>
                        <Download size={18} />
                        Download Ticket & Passes
                    </button>
                </div>

                {/* SHARE */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center', marginBottom: '24px'
                }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center', gap: '6px',
                        color: '#94A3B8', background: 'none',
                        border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: '600'
                    }}>
                        <Share2 size={16} />
                        Share journey details with family or campus
                    </button>
                </div>

                {/* WHAT HAPPENS NEXT */}
                <div style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px', padding: '24px',
                    border: '1px solid #E2E8F0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', gap: '8px',
                        marginBottom: '16px'
                    }}>
                        <CheckCircle size={20} color="#1A56DB" />
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '800', color: '#0F172A'
                        }}>
                            What happens next?
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', gap: '12px'
                    }}>
                        {[
                            'Tickets sent to rahul@juitsolan.ac.in and SMS.',
                            'First cab confirmed — driver contact and OTP sent 30 mins before departure (08:00 AM).',
                            'Live journey assistant and rebooking guarantee active in My Trips.',
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start', gap: '10px'
                            }}>
                                <div style={{
                                    width: '20px', height: '20px',
                                    borderRadius: '999px',
                                    backgroundColor: '#DCFCE7',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', flexShrink: 0,
                                    marginTop: '1px'
                                }}>
                                    <CheckCircle size={12} color="#16A34A" />
                                </div>
                                <span style={{
                                    fontSize: '13px',
                                    color: '#64748B', lineHeight: '1.6'
                                }}>
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirmation