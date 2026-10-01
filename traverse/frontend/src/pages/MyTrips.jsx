import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Car, Train, Bus, MapPin, Calendar,
    Clock, ArrowRight, CheckCircle,
    Plus, RefreshCw, Copy
} from 'lucide-react'
import { useJourney } from '../context/JourneyContext'

function MyTrips() {
    const navigate = useNavigate()
    const { journey, totalCost } = useJourney()
    const [activeTab, setActiveTab] = useState('upcoming')

    const upcomingTrips = [
        {
            id: 'TRV-2024-8821',
            from: 'JUIT Waknaghat',
            to: 'New Delhi',
            date: 'Thu, 24 Oct 2024',
            departs: '08:30 AM',
            status: 'Confirmed',
            duration: '~7h 30m',
            total: totalCost + 29,
            transfers: '3 transfers',
            legs: [
                {
                    icon: Car, label: 'Cab',
                    from: 'JUIT Campus', time: '08:30 AM',
                    price: journey.leg1.price,
                    color: '#0EA5E9'
                },
                {
                    icon: Bus, label: journey.leg2.label,
                    from: 'Waknaghat', time: '09:15 AM',
                    price: journey.leg2.price,
                    color: '#D97706'
                },
                {
                    icon: Train, label: journey.leg3.label,
                    from: 'Chandigarh', time: '11:30 AM',
                    price: journey.leg3.price,
                    color: '#1A56DB'
                },
                {
                    icon: Car, label: 'Cab',
                    from: 'New Delhi', time: '5:00 PM',
                    price: journey.leg4.price,
                    color: '#0EA5E9'
                },
            ],
            dest: 'Delhi Campus',
            destTime: '5:45 PM',
        },
        {
            id: 'TRV-2024-8834',
            from: 'JUIT Waknaghat',
            to: 'Chandigarh',
            date: 'Sat, 26 Oct 2024',
            departs: '02:00 PM',
            status: 'Confirmed',
            duration: '1h 15m',
            total: 200,
            transfers: 'Direct',
            legs: [
                {
                    icon: Car, label: 'Direct Cab',
                    from: 'JUIT Waknaghat', time: '02:00 PM',
                    price: 200, color: '#0EA5E9'
                },
            ],
            dest: 'Chandigarh ISBT',
            destTime: '03:15 PM',
        },
    ]

    const pastTrips = [
        {
            id: 'TRV-2024-8756',
            from: 'JUIT Waknaghat',
            to: 'Shimla Mall Road',
            date: 'Sun, 15 Oct 2024',
            status: 'Completed',
            duration: '2h 30m',
            total: 180,
            transfers: 'Direct',
            mode: 'HRTC Deluxe Bus',
        },
    ]

    return (
        <div style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff', minHeight: '100vh'
        }}>

            <div style={{
                maxWidth: '960px', margin: '0 auto',
                padding: '40px 24px'
            }}>

                {/* PAGE HEADER */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end', marginBottom: '24px',
                    flexWrap: 'wrap', gap: '16px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '36px', fontWeight: '800',
                            color: '#0F172A', letterSpacing: '-1px',
                            margin: '0 0 4px'
                        }}>
                            My Trips
                        </h1>
                        <p style={{
                            fontSize: '15px', color: '#64748B',
                            margin: 0
                        }}>
                            All your journeys in one place.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex', alignItems: 'center',
                            gap: '6px', backgroundColor: '#1A56DB',
                            color: '#fff', padding: '12px 20px',
                            borderRadius: '10px', fontWeight: '700',
                            fontSize: '14px', border: 'none',
                            cursor: 'pointer'
                        }}>
                        <Plus size={16} /> Plan New Journey
                    </button>
                </div>

                {/* TABS */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2px solid #F1F5F9',
                    marginBottom: '32px'
                }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        {[
                            {
                                key: 'upcoming', label: 'Upcoming',
                                count: upcomingTrips.length
                            },
                            {
                                key: 'past', label: 'Past',
                                count: pastTrips.length
                            },
                        ].map(tab => (
                            <button key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center', gap: '8px',
                                    paddingBottom: '16px', fontSize: '14px',
                                    fontWeight: '700', background: 'none',
                                    border: 'none', cursor: 'pointer',
                                    color: activeTab === tab.key
                                        ? '#1A56DB' : '#64748B',
                                    borderBottom: activeTab === tab.key
                                        ? '3px solid #1A56DB' : 'none',
                                    marginBottom: activeTab === tab.key
                                        ? '-2px' : '0'
                                }}>
                                {tab.label}
                                <span style={{
                                    backgroundColor:
                                        activeTab === tab.key ? '#EFF6FF' : '#F1F5F9',
                                    color: activeTab === tab.key
                                        ? '#1A56DB' : '#64748B',
                                    fontSize: '11px', fontWeight: '700',
                                    padding: '2px 8px',
                                    borderRadius: '999px'
                                }}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: '6px', fontSize: '12px',
                        color: '#0EA5E9', fontWeight: '600'
                    }}>
                        <div style={{
                            width: '8px', height: '8px',
                            backgroundColor: '#22C55E',
                            borderRadius: '999px'
                        }} />
                        Real-time Connected Transit
                    </div>
                </div>

                {/* UPCOMING TRIPS */}
                {activeTab === 'upcoming' && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', gap: '24px'
                    }}>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: '800', color: '#0F172A',
                                margin: 0
                            }}>
                                Active & Upcoming Bookings ({upcomingTrips.length})
                            </h2>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center', gap: '6px',
                                fontSize: '12px', color: '#22C55E',
                                fontWeight: '700'
                            }}>
                                <div style={{
                                    width: '6px', height: '6px',
                                    backgroundColor: '#22C55E',
                                    borderRadius: '999px'
                                }} />
                                Syncing Active Feeds
                            </div>
                        </div>

                        {upcomingTrips.map(trip => (
                            <article key={trip.id} style={{
                                backgroundColor: '#fff', borderRadius: '16px',
                                border: '1px solid #E2E8F0', overflow: 'hidden',
                                borderLeft: '4px solid #1A56DB',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                            }}>
                                <div style={{
                                    padding: '24px',
                                    display: 'flex', flexDirection: 'column',
                                    gap: '16px'
                                }}>

                                    {/* Top row */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap', gap: '8px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '8px'
                                        }}>
                                            <span style={{
                                                fontSize: '18px',
                                                fontWeight: '800', color: '#0F172A'
                                            }}>
                                                {trip.from}
                                            </span>
                                            <ArrowRight size={18} color="#0EA5E9" />
                                            <span style={{
                                                fontSize: '18px',
                                                fontWeight: '800', color: '#0F172A'
                                            }}>
                                                {trip.to}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            backgroundColor: '#DCFCE7',
                                            padding: '6px 12px', borderRadius: '999px',
                                            fontSize: '12px', fontWeight: '700',
                                            color: '#16A34A'
                                        }}>
                                            <div style={{
                                                width: '6px', height: '6px',
                                                backgroundColor: '#22C55E',
                                                borderRadius: '999px'
                                            }} />
                                            {trip.status}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div style={{
                                        display: 'flex', gap: '20px',
                                        flexWrap: 'wrap', fontSize: '13px',
                                        color: '#64748B'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px'
                                        }}>
                                            <Calendar size={16} color="#0EA5E9" />
                                            {trip.date}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px'
                                        }}>
                                            <Clock size={16} color="#0EA5E9" />
                                            Departs {trip.departs}
                                        </div>
                                    </div>

                                    {/* Journey path */}
                                    <div style={{
                                        backgroundColor: '#F8FAFC',
                                        borderRadius: '12px', padding: '16px',
                                        overflowX: 'auto'
                                    }}>
                                        <div style={{
                                            minWidth: '560px',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'space-between',
                                            position: 'relative', padding: '8px 0'
                                        }}>

                                            {trip.legs.map((leg, i) => (
                                                <>
                                                    {/* Stop node */}
                                                    <div key={`node-${i}`} style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center', gap: '4px',
                                                        zIndex: 1
                                                    }}>
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px', borderRadius: '999px',
                                                            backgroundColor: '#fff',
                                                            border: '1px solid #E2E8F0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                                                        }}>
                                                            <leg.icon size={16}
                                                                color={leg.color} />
                                                        </div>
                                                        <span style={{
                                                            fontSize: '11px',
                                                            fontWeight: '700', color: '#0F172A',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {leg.from}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '10px',
                                                            color: '#94A3B8'
                                                        }}>
                                                            {leg.time}
                                                        </span>
                                                    </div>

                                                    {/* Connector */}
                                                    <div key={`conn-${i}`} style={{
                                                        flex: 1, display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        position: 'relative',
                                                        padding: '0 4px'
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '16px', left: 0, right: 0,
                                                            height: '1px',
                                                            borderTop: '1px dashed #CBD5E1'
                                                        }} />
                                                        <div style={{
                                                            zIndex: 1,
                                                            backgroundColor: '#fff',
                                                            border: `1px solid ${leg.color}40`,
                                                            borderRadius: '999px',
                                                            padding: '3px 8px',
                                                            display: 'flex',
                                                            alignItems: 'center', gap: '4px',
                                                            fontSize: '11px', fontWeight: '700',
                                                            color: leg.color,
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            <leg.icon size={10} />
                                                            {leg.label}
                                                        </div>
                                                        <span style={{
                                                            fontSize: '10px',
                                                            color: '#64748B', marginTop: '2px',
                                                            zIndex: 1,
                                                            backgroundColor: '#F8FAFC',
                                                            padding: '1px 4px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            ₹{leg.price}
                                                        </span>
                                                    </div>
                                                </>
                                            ))}

                                            {/* Final destination node */}
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center', gap: '4px',
                                                zIndex: 1
                                            }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px', borderRadius: '999px',
                                                    backgroundColor: '#1A56DB',
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <MapPin size={16} color="#fff" />
                                                </div>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '700', color: '#0F172A',
                                                    textAlign: 'center',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {trip.dest}
                                                </span>
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: '#94A3B8'
                                                }}>
                                                    {trip.destTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3,1fr)',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            fontSize: '13px', color: '#64748B'
                                        }}>
                                            <Clock size={16} color="#0EA5E9" />
                                            Duration: <strong style={{
                                                color: '#0F172A',
                                                marginLeft: '4px'
                                            }}>
                                                {trip.duration}
                                            </strong>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            fontSize: '13px', color: '#64748B'
                                        }}>
                                            Total Paid:
                                            <span style={{
                                                fontSize: '18px',
                                                fontWeight: '900', color: '#0EA5E9',
                                                marginLeft: '4px'
                                            }}>
                                                ₹{trip.total}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            fontSize: '13px', color: '#64748B',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <CheckCircle size={16} color="#22C55E" />
                                            {trip.transfers}
                                        </div>
                                    </div>

                                    {/* Bottom actions */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '16px',
                                        borderTop: '1px solid #F1F5F9',
                                        flexWrap: 'wrap', gap: '12px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            fontSize: '13px', color: '#64748B',
                                            fontFamily: 'monospace'
                                        }}>
                                            Booking ID:
                                            <strong style={{
                                                color: '#0F172A',
                                                marginLeft: '4px'
                                            }}>
                                                {trip.id}
                                            </strong>
                                            <button
                                                onClick={() => navigator.clipboard
                                                    .writeText(trip.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none', cursor: 'pointer',
                                                    padding: '2px'
                                                }}>
                                                <Copy size={14} color="#94A3B8" />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button style={{
                                                padding: '10px 16px',
                                                borderRadius: '10px',
                                                border: '1.5px solid #1A56DB',
                                                backgroundColor: '#fff',
                                                color: '#1A56DB', fontWeight: '700',
                                                fontSize: '13px', cursor: 'pointer'
                                            }}>
                                                View Ticket
                                            </button>
                                            <button
                                                onClick={() =>
                                                    navigate('/journey-builder')}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center', gap: '6px',
                                                    padding: '10px 20px',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    backgroundColor: '#1A56DB',
                                                    color: '#fff', fontWeight: '700',
                                                    fontSize: '13px', cursor: 'pointer'
                                                }}>
                                                Details <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* PAST TRIPS */}
                {activeTab === 'past' && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', gap: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center', gap: '16px'
                        }}>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: '700', color: '#94A3B8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em'
                            }}>
                                Past Trips
                            </span>
                            <div style={{
                                flex: 1, height: '1px',
                                backgroundColor: '#E2E8F0'
                            }} />
                        </div>

                        {pastTrips.map(trip => (
                            <article key={trip.id} style={{
                                backgroundColor: '#fff', borderRadius: '16px',
                                border: '1px solid #E2E8F0', overflow: 'hidden',
                                borderLeft: '4px solid #94A3B8',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                opacity: 0.9
                            }}>
                                <div style={{
                                    padding: '24px',
                                    display: 'flex', flexDirection: 'column',
                                    gap: '14px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap', gap: '8px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '8px'
                                        }}>
                                            <span style={{
                                                fontSize: '18px',
                                                fontWeight: '800', color: '#0F172A'
                                            }}>
                                                {trip.from}
                                            </span>
                                            <ArrowRight size={18} color="#94A3B8" />
                                            <span style={{
                                                fontSize: '18px',
                                                fontWeight: '800', color: '#0F172A'
                                            }}>
                                                {trip.to}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            backgroundColor: '#F1F5F9',
                                            padding: '6px 12px', borderRadius: '999px',
                                            fontSize: '12px', fontWeight: '700',
                                            color: '#64748B'
                                        }}>
                                            <CheckCircle size={12} />
                                            {trip.status}
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex', gap: '20px',
                                        flexWrap: 'wrap', fontSize: '13px',
                                        color: '#94A3B8'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px'
                                        }}>
                                            <Calendar size={14} />
                                            {trip.date}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px'
                                        }}>
                                            <Bus size={14} />
                                            {trip.mode}
                                        </div>
                                    </div>

                                    {/* Simple path */}
                                    <div style={{
                                        backgroundColor: '#F8FAFC',
                                        borderRadius: '10px', padding: '14px 20px',
                                        display: 'flex', alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            fontSize: '13px', color: '#64748B'
                                        }}>
                                            <MapPin size={16} color="#94A3B8" />
                                            JUIT
                                        </div>
                                        <div style={{
                                            flex: 1, height: '1px',
                                            borderTop: '1px solid #CBD5E1'
                                        }} />
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '600', color: '#64748B',
                                            backgroundColor: '#fff',
                                            padding: '3px 8px',
                                            borderRadius: '999px',
                                            border: '1px solid #E2E8F0'
                                        }}>
                                            {trip.mode} · Direct
                                        </span>
                                        <div style={{
                                            flex: 1, height: '1px',
                                            borderTop: '1px solid #CBD5E1'
                                        }} />
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '6px',
                                            fontSize: '13px', color: '#64748B'
                                        }}>
                                            <MapPin size={16} color="#94A3B8" />
                                            Shimla
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap', gap: '8px'
                                    }}>
                                        <div style={{
                                            display: 'flex', gap: '16px',
                                            fontSize: '13px', color: '#64748B'
                                        }}>
                                            <span>Duration: <strong
                                                style={{ color: '#0F172A' }}>
                                                {trip.duration}
                                            </strong></span>
                                            <span>·</span>
                                            <span>Fare: <strong
                                                style={{ color: '#0F172A' }}>
                                                ₹{trip.total}
                                            </strong></span>
                                            <span>·</span>
                                            <span>Transfers: <strong
                                                style={{ color: '#0F172A' }}>
                                                {trip.transfers}
                                            </strong></span>
                                        </div>
                                        <button
                                            onClick={() => navigate('/search')}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center', gap: '6px',
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                border: '1.5px solid #0EA5E9',
                                                backgroundColor: '#fff',
                                                color: '#0EA5E9', fontWeight: '700',
                                                fontSize: '13px', cursor: 'pointer'
                                            }}>
                                            <RefreshCw size={14} /> Rebook
                                        </button>
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#94A3B8', fontFamily: 'monospace'
                                    }}>
                                        Booking ID: {trip.id}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                <div style={{
                    border: '2px dashed #E2E8F0',
                    borderRadius: '16px', padding: '48px 24px',
                    textAlign: 'center', marginTop: '24px'
                }}>
                    <div style={{
                        width: '48px', height: '48px',
                        borderRadius: '999px', backgroundColor: '#F1F5F9',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 16px'
                    }}>
                        <MapPin size={24} color="#94A3B8" />
                    </div>
                    <h4 style={{
                        fontSize: '18px', fontWeight: '800',
                        color: '#0F172A', margin: '0 0 8px'
                    }}>
                        No more trips yet.
                    </h4>
                    <p style={{
                        fontSize: '13px', color: '#64748B',
                        maxWidth: '400px', margin: '0 auto 24px',
                        lineHeight: '1.6'
                    }}>
                        Plan your next journey and it will appear here with
                        live tracking, transfer guarantee, and single QR boarding.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center', gap: '6px',
                            backgroundColor: '#1A56DB', color: '#fff',
                            padding: '12px 24px', borderRadius: '10px',
                            fontWeight: '700', fontSize: '14px',
                            border: 'none', cursor: 'pointer'
                        }}>
                        Plan a Journey <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MyTrips