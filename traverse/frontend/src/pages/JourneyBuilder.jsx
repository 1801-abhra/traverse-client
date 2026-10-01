import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MapPin, Train, Car, Bus, ArrowRight,
    Clock, ChevronLeft, CheckCircle, Plane,
    FootprintsIcon
} from 'lucide-react'
import { useJourney, legOptions } from '../context/JourneyContext'

function JourneyBuilder() {
    const navigate = useNavigate()
    const { journey, updateLeg, totalCost } = useJourney()
    const [selectedRouteInfo, setSelectedRouteInfo] = useState(null)

    useEffect(() => {
        const saved = localStorage.getItem('selectedRoute')
        if (saved) {
            try {
                const route = JSON.parse(saved)
                // Store for display - we just show it as info
                setSelectedRouteInfo(route)
            } catch (e) { }
        }
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem('selectedRoute')
        if (!saved) return
        try {
            const route = JSON.parse(saved)
            if (!route.fullLegs || route.fullLegs.length === 0) return

            // Map the route's full legs to journey context legs
            const legKeys = ['leg1', 'leg2', 'leg3', 'leg4']
            route.fullLegs.forEach((leg, i) => {
                if (i < 4 && legKeys[i]) {
                    updateLeg(legKeys[i], {
                        key: leg.mode || 'cab',
                        label: leg.operator || leg.mode,
                        desc: leg.from + ' → ' + (leg.to || 'Next Stop'),
                        price: leg.cost || 0
                    })
                }
            })
        } catch (e) {
            console.log('Could not load route legs', e)
        }
    }, [])

    const getIcon = (key) => {
        if (key === 'walk') return <FootprintsIcon size={20}
            color="#1A56DB" />
        if (key === 'flight') return <Plane size={20}
            color="#1A56DB" />
        if (key === 'train' || key === 'shatabdi' ||
            key === 'vande') return <Train size={20}
                color="#1A56DB" />
        if (key === 'bus') return <Bus size={20} color="#1A56DB" />
        return <Car size={20} color="#1A56DB" />
    }

    const nodes = [
        {
            label: 'JUIT Campus', sub: 'Starting Point',
            color: '#1A56DB', tag: 'START'
        },
        {
            label: 'Waknaghat Bus Stand',
            sub: journey.leg2.key === 'cab'
                ? 'Skipped — Direct Cab'
                : 'Transfer Point',
            color: '#1A56DB', tag: '25 MIN BUFFER'
        },
        {
            label: journey.leg3.key === 'flight'
                ? 'Chandigarh Airport'
                : 'Chandigarh Railway Station',
            sub: 'Main Departure',
            color: '#0EA5E9', tag: 'CONNECTION'
        },
        {
            label: journey.leg3.key === 'flight'
                ? 'Delhi Airport (IGI T3)'
                : 'New Delhi Railway Station',
            sub: 'Arrival Point',
            color: '#0EA5E9', tag: 'LAST MILE'
        },
        {
            label: 'Final Destination',
            sub: 'New Delhi', color: '#22C55E',
            tag: 'DESTINATION'
        },
    ]

    const legs = [
        {
            key: 'leg1', options: legOptions.leg1,
            departure: '08:30 AM', arrival: '09:00 AM',
            duration: '30m'
        },
        {
            key: 'leg2', options: legOptions.leg2,
            departure: '09:15 AM', arrival: '11:00 AM',
            duration: '1h 45m'
        },
        {
            key: 'leg3', options: legOptions.leg3,
            departure: '11:30 AM', arrival: '5:00 PM',
            duration: '5h 30m'
        },
        {
            key: 'leg4', options: legOptions.leg4,
            departure: '5:15 PM', arrival: '5:45 PM',
            duration: '30m'
        },
    ]

    return (
        <div style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff', minHeight: '100vh',
            paddingBottom: '100px'
        }}>

            {/* TOP BAR */}
            <section style={{
                backgroundColor: '#EFF6FF',
                borderBottom: '1px solid #BFDBFE',
                padding: '16px 24px'
            }}>
                <div style={{
                    maxWidth: '900px', margin: '0 auto',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '16px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', gap: '12px'
                    }}>
                        <div style={{
                            width: '44px', height: '44px',
                            backgroundColor: '#1A56DB', borderRadius: '12px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <MapPin size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', gap: '8px',
                                fontSize: '18px', fontWeight: '800',
                                color: '#0F172A'
                            }}>
                                JUIT Waknaghat
                                <ArrowRight size={18} color="#94A3B8" />
                                New Delhi
                            </div>
                            <div style={{
                                fontSize: '13px',
                                color: '#64748B'
                            }}>
                                Thu, 24 Oct · 08:30 AM departure
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', gap: '24px',
                        flexWrap: 'wrap'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '900', color: '#0EA5E9',
                                letterSpacing: '-1px'
                            }}>
                                ₹{totalCost}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: '700', color: '#94A3B8',
                                textTransform: 'uppercase'
                            }}>
                                Total
                            </div>
                        </div>
                        <div style={{
                            width: '1px', height: '40px',
                            backgroundColor: '#CBD5E1'
                        }} />
                        <div>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '700', color: '#0F172A'
                            }}>
                                ~7h 30m
                            </div>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: '700', color: '#94A3B8',
                                textTransform: 'uppercase'
                            }}>
                                Est. Duration
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <div style={{
                maxWidth: '760px', margin: '0 auto',
                padding: '32px 24px'
            }}>

                {/* Breadcrumb */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '6px', fontSize: '13px', color: '#94A3B8',
                    marginBottom: '20px'
                }}>
                    <button onClick={() => navigate('/search')}
                        style={{
                            display: 'flex', alignItems: 'center',
                            gap: '4px', color: '#94A3B8', background: 'none',
                            border: 'none', cursor: 'pointer',
                            fontSize: '13px', fontWeight: '600'
                        }}>
                        <ChevronLeft size={16} /> Search Results
                    </button>
                    <span>/</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>
                        Journey Builder
                    </span>
                </div>

                {/* Title */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap',
                    gap: '12px', marginBottom: '32px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '36px', fontWeight: '800',
                            color: '#0F172A', letterSpacing: '-1px',
                            margin: '0 0 4px'
                        }}>
                            Customise Your Journey
                        </h1>
                        {selectedRouteInfo && (
                            <div style={{
                                backgroundColor: '#DCFCE7',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid #BBF7D0'
                            }}>
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '700', color: '#16A34A'
                                }}>
                                    ✓ {selectedRouteInfo.label} Route Selected
                                </span>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>
                                    {selectedRouteInfo.total} · {selectedRouteInfo.duration} · TOPSIS Score: {selectedRouteInfo.topsisScore?.toFixed(3)}
                                </span>
                            </div>
                        )}
                        <p style={{
                            fontSize: '15px', color: '#64748B',
                            margin: 0
                        }}>
                            Swap any leg — total updates instantly across
                            all pages
                        </p>
                    </div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '999px',
                        backgroundColor: '#DCFCE7', color: '#166534',
                        fontSize: '12px', fontWeight: '700',
                        border: '1px solid #BBF7D0'
                    }}>
                        <CheckCircle size={14} />
                        Real-time cost updates
                    </div>
                </div>

                {/* TIMELINE */}
                <div style={{
                    position: 'relative',
                    paddingLeft: '56px'
                }}>
                    <div style={{
                        position: 'absolute', left: '20px',
                        top: '24px', bottom: '24px', width: '4px',
                        background:
                            'linear-gradient(to bottom, #1A56DB, #0EA5E9, #22C55E)',
                        borderRadius: '4px'
                    }} />

                    {legs.map((leg, i) => (
                        <>
                            {/* NODE */}
                            <div key={`node-${i}`} style={{
                                position: 'relative', marginBottom: '8px',
                                paddingTop: '4px', paddingLeft: '20px'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '-36px', width: '44px', height: '44px',
                                    backgroundColor: nodes[i].color,
                                    borderRadius: '999px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 0 4px #ffffff, 0 2px 8px rgba(0,0,0,0.12)',
                                    zIndex: 1
                                }}>
                                    <MapPin size={20} color="#fff" />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '8px',
                                    flexWrap: 'wrap', fontSize: '16px',
                                    fontWeight: '800', color: '#0F172A'
                                }}>
                                    {nodes[i].label}
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '3px 10px', borderRadius: '999px',
                                        fontSize: '11px', fontWeight: '700',
                                        backgroundColor: i === 0 ? '#EFF6FF'
                                            : i === legs.length ? '#DCFCE7'
                                                : '#FFFBEB',
                                        color: i === 0 ? '#1A56DB'
                                            : i === legs.length ? '#166534'
                                                : '#D97706',
                                        border: `1px solid ${i === 0 ? '#BFDBFE'
                                            : i === legs.length ? '#BBF7D0'
                                                : '#FDE68A'}`
                                    }}>
                                        {nodes[i].tag}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#94A3B8', marginTop: '2px'
                                }}>
                                    {nodes[i].sub}
                                </div>
                            </div>

                            {/* LEG CARD */}
                            <div key={`leg-${i}`} style={{
                                margin: '16px 0 24px',
                                backgroundColor: '#fff', borderRadius: '16px',
                                border: '1px solid #E2E8F0',
                                borderLeft: '4px solid #1A56DB',
                                padding: '20px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap', gap: '16px'
                                }}>

                                    {/* Left — current selection */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start', gap: '12px'
                                    }}>
                                        <div style={{
                                            width: '40px', height: '40px',
                                            borderRadius: '999px',
                                            backgroundColor: '#EFF6FF',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {getIcon(journey[leg.key].key)}
                                        </div>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center', gap: '8px'
                                            }}>
                                                <span style={{
                                                    fontSize: '16px',
                                                    fontWeight: '800', color: '#0F172A'
                                                }}>
                                                    {journey[leg.key].desc}
                                                </span>
                                                <span style={{
                                                    fontSize: '18px',
                                                    fontWeight: '900', color: '#0EA5E9'
                                                }}>
                                                    ₹{journey[leg.key].price}
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '13px',
                                                color: '#94A3B8', marginTop: '4px'
                                            }}>
                                                {leg.departure} → {leg.arrival}
                                                · {leg.duration}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right — switch options */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end', gap: '8px',
                                        flexShrink: 0, maxWidth: '400px'
                                    }}>
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: '700', color: '#94A3B8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em'
                                        }}>
                                            Switch leg mode
                                        </div>
                                        <div style={{
                                            display: 'flex', gap: '6px',
                                            flexWrap: 'wrap',
                                            justifyContent: 'flex-end', maxWidth: '400px'
                                        }}>
                                            {leg.options.map(opt => {
                                                const active =
                                                    journey[leg.key].key === opt.key
                                                return (
                                                    <button key={opt.key}
                                                        onClick={() => updateLeg(
                                                            leg.key, opt)}
                                                        style={{
                                                            padding: '6px 10px',
                                                            borderRadius: '999px',
                                                            fontSize: '12px',
                                                            fontWeight: '700',
                                                            backgroundColor: active
                                                                ? '#1A56DB' : '#fff',
                                                            color: active
                                                                ? '#fff' : '#64748B',
                                                            border: active
                                                                ? 'none'
                                                                : '1.5px solid #E2E8F0',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                        {active && (
                                                            <CheckCircle size={12} />
                                                        )}
                                                        {opt.label} ₹{opt.price}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}

                    {/* DESTINATION NODE */}
                    <div style={{
                        position: 'relative',
                        marginBottom: '8px', paddingTop: '4px',
                        paddingLeft: '20px'
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: '-36px', width: '44px', height: '44px',
                            backgroundColor: '#22C55E', borderRadius: '999px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 0 4px #ffffff, 0 2px 8px rgba(0,0,0,0.12)',
                            zIndex: 1
                        }}>
                            <MapPin size={20} color="#fff" />
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center', gap: '8px',
                            fontSize: '16px', fontWeight: '800',
                            color: '#0F172A'
                        }}>
                            Final Destination, New Delhi
                            <span style={{
                                display: 'inline-block',
                                padding: '3px 10px', borderRadius: '999px',
                                fontSize: '11px', fontWeight: '700',
                                backgroundColor: '#DCFCE7', color: '#166534',
                                border: '1px solid #BBF7D0'
                            }}>
                                DESTINATION
                            </span>
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: '#94A3B8', marginTop: '2px'
                        }}>
                            Estimated arrival: ~5:45 PM
                        </div>
                    </div>

                    {/* STATS */}
                    <div style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '16px', border: '1px solid #E2E8F0',
                        padding: '24px', marginTop: '32px'
                    }}>
                        <div style={{
                            fontSize: '11px', fontWeight: '700',
                            color: '#94A3B8', textTransform: 'uppercase',
                            letterSpacing: '0.08em', marginBottom: '16px'
                        }}>
                            Journey Summary
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4,1fr)', gap: '16px'
                        }}>
                            {[
                                {
                                    label: 'Distance', value: '~450 km',
                                    sub: 'Approx'
                                },
                                {
                                    label: 'Duration', value: '~7h 30m',
                                    sub: 'Incl. buffer'
                                },
                                {
                                    label: 'Total Cost',
                                    value: `₹${totalCost}`,
                                    sub: 'Updates live', highlight: true
                                },
                                {
                                    label: 'Transfers', value: '3',
                                    sub: 'Legs'
                                },
                            ].map(({ label, value, sub, highlight }) => (
                                <div key={label} style={{
                                    borderRight: '1px solid #E2E8F0',
                                    paddingRight: '16px'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#94A3B8', marginBottom: '4px'
                                    }}>
                                        {label}
                                    </div>
                                    <div style={{
                                        fontSize: '22px',
                                        fontWeight: '800',
                                        color: highlight ? '#0EA5E9' : '#0F172A',
                                        marginBottom: '2px'
                                    }}>
                                        {value}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: highlight ? '#22C55E' : '#94A3B8',
                                        fontWeight: highlight ? '700' : '400'
                                    }}>
                                        {sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY BOTTOM */}
            <div style={{
                position: 'fixed', bottom: 0,
                left: 0, right: 0, backgroundColor: '#fff',
                borderTop: '1px solid #E2E8F0',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
                padding: '16px 24px', zIndex: 50
            }}>
                <div style={{
                    maxWidth: '900px', margin: '0 auto',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', gap: '12px'
                    }}>
                        <div style={{
                            width: '44px', height: '44px',
                            backgroundColor: '#EFF6FF', borderRadius: '12px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CheckCircle size={22} color="#1A56DB" />
                        </div>
                        <div>
                            <div>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '700', color: '#0F172A'
                                }}>
                                    Total:{' '}
                                </span>
                                <span style={{
                                    fontSize: '22px',
                                    fontWeight: '900', color: '#0EA5E9'
                                }}>
                                    ₹{totalCost}
                                </span>
                                <span style={{
                                    fontSize: '14px',
                                    color: '#94A3B8', marginLeft: '8px'
                                }}>
                                    · ~7h 30m · 3 transfers
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', gap: '4px',
                                marginTop: '2px'
                            }}>
                                <CheckCircle size={13} color="#22C55E" />
                                <span style={{
                                    fontSize: '12px',
                                    color: '#94A3B8'
                                }}>
                                    All legs combined into 1 booking
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', gap: '12px'
                    }}>
                        <button onClick={() => navigate('/search')}
                            style={{
                                fontSize: '14px', fontWeight: '600',
                                color: '#94A3B8', background: 'none',
                                border: 'none', cursor: 'pointer'
                            }}>
                            ← Back
                        </button>
                        <button
                            onClick={() => navigate('/order-summary')}
                            style={{
                                backgroundColor: '#1A56DB',
                                color: '#fff', padding: '14px 32px',
                                borderRadius: '12px', fontWeight: '700',
                                fontSize: '15px', border: 'none',
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', gap: '8px',
                                boxShadow: '0 4px 16px rgba(26,86,219,0.3)'
                            }}>
                            Confirm Journey <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JourneyBuilder