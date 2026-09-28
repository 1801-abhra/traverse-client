import { useNavigate } from 'react-router-dom'
import {
    MapPin, Navigation, Calendar, Clock,
    Car, Train, Bus, Landmark, Zap,
    Search, SlidersHorizontal, Ticket,
    Route, Shield, ArrowRight, PlayCircle
} from 'lucide-react'

function Home() {
    const navigate = useNavigate()

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* HERO */}
            <section style={{
                backgroundColor: '#ffffff',
                padding: '72px 24px 60px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center',
                        gap: '8px', backgroundColor: '#EFF6FF',
                        color: '#1A56DB', fontSize: '13px',
                        fontWeight: '600', padding: '8px 16px',
                        borderRadius: '999px', marginBottom: '32px'
                    }}>
                        <Zap size={14} />
                        India's first complete journey planner
                    </div>

                    <h1 style={{
                        fontSize: '56px', fontWeight: '800',
                        color: '#0F172A', lineHeight: '1.1',
                        marginBottom: '24px', letterSpacing: '-1px'
                    }}>
                        Plan Your Complete<br />Journey, Your Way
                    </h1>

                    <p style={{
                        fontSize: '18px', color: '#64748B',
                        maxWidth: '560px', margin: '0 auto 40px',
                        lineHeight: '1.7'
                    }}>
                        From your doorstep to your destination — cab,
                        train, bus, metro — every leg planned, compared
                        and booked in one place.
                    </p>

                    <div style={{
                        display: 'flex', gap: '16px',
                        justifyContent: 'center', flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => navigate('/search')}
                            style={{
                                backgroundColor: '#1A56DB', color: '#fff',
                                padding: '16px 32px', borderRadius: '12px',
                                fontWeight: '700', fontSize: '16px',
                                border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center',
                                gap: '8px'
                            }}>
                            Plan a Journey <ArrowRight size={18} />
                        </button>
                        <button style={{
                            backgroundColor: '#fff', color: '#0F172A',
                            padding: '16px 32px', borderRadius: '12px',
                            fontWeight: '600', fontSize: '16px',
                            border: '1.5px solid #E2E8F0', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <PlayCircle size={18} color="#1A56DB" />
                            How It Works
                        </button>
                    </div>

                    <p style={{
                        color: '#94A3B8', fontSize: '14px', marginTop: '24px'
                    }}>
                        Trusted by students at JUIT and growing
                    </p>
                </div>
            </section>

            {/* TRANSPORT MODES */}
            <section style={{
                backgroundColor: '#F8FAFC',
                padding: '40px 24px'
            }}>
                <div style={{
                    maxWidth: '900px', margin: '0 auto',
                    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '16px'
                }}>
                    {[
                        { icon: Car, label: 'Cab', sub: 'First/Last Mile' },
                        { icon: Train, label: 'Train', sub: 'IRCTC Express' },
                        { icon: Bus, label: 'Bus', sub: 'Intercity Volvo' },
                        { icon: Landmark, label: 'Metro', sub: 'Urban Rapid' },
                        { icon: Zap, label: 'Auto', sub: 'Local Shuttle' },
                    ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} style={{
                            backgroundColor: '#fff', borderRadius: '16px',
                            padding: '20px 12px', textAlign: 'center',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '8px'
                        }}>
                            <div style={{
                                width: '44px', height: '44px',
                                backgroundColor: '#EFF6FF', borderRadius: '10px',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon size={22} color="#1A56DB" />
                            </div>
                            <span style={{
                                fontSize: '14px', fontWeight: '700',
                                color: '#0F172A'
                            }}>{label}</span>
                            <span style={{
                                fontSize: '11px', color: '#64748B'
                            }}>{sub}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* SEARCH CARD */}
            <section style={{
                backgroundColor: '#ffffff', padding: '52px 24px'
            }}>
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '24px',
                        padding: '48px',
                        boxShadow: '0 8px 32px rgba(15,23,42,0.10)',
                        border: '1px solid #E2E8F0'
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '32px'
                        }}>
                            <h2 style={{
                                fontSize: '22px', fontWeight: '800',
                                color: '#0F172A', margin: 0
                            }}>
                                Where do you want to go?
                            </h2>
                            <span style={{
                                backgroundColor: '#EFF6FF', color: '#0EA5E9',
                                fontSize: '12px', fontWeight: '700',
                                padding: '6px 12px', borderRadius: '999px'
                            }}>
                                Multi-Modal
                            </span>
                        </div>

                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '16px', marginBottom: '24px'
                        }}>
                            {[
                                {
                                    icon: MapPin, label: 'FROM',
                                    placeholder: 'JUIT Waknaghat',
                                    color: '#1A56DB'
                                },
                                {
                                    icon: Navigation, label: 'TO',
                                    placeholder: 'Where are you going?',
                                    color: '#0EA5E9'
                                },
                                {
                                    icon: Calendar, label: 'DATE',
                                    type: 'date', color: '#1A56DB'
                                },
                                {
                                    icon: Clock, label: 'DEPARTURE TIME',
                                    type: 'time', color: '#1A56DB'
                                },
                            ].map(({ icon: Icon, label,
                                placeholder, type, color }) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '12px', border: '1.5px solid #E2E8F0',
                                    borderRadius: '12px', padding: '14px 16px',
                                    backgroundColor: '#F8FAFC'
                                }}>
                                    <Icon size={18} color={color} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '10px', color: '#94A3B8',
                                            fontWeight: '700', letterSpacing: '0.08em',
                                            marginBottom: '4px'
                                        }}>
                                            {label}
                                        </div>
                                        <input
                                            type={type || 'text'}
                                            placeholder={placeholder}
                                            style={{
                                                width: '100%', border: 'none',
                                                outline: 'none', fontSize: '14px',
                                                fontWeight: '600', color: '#0F172A',
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '12px', marginBottom: '24px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{
                                fontSize: '13px', color: '#64748B',
                                fontWeight: '600'
                            }}>
                                Preference:
                            </span>
                            {['Cheapest', 'Fastest', 'Comfortable'].map(
                                (p, i) => (
                                    <button key={p} style={{
                                        padding: '8px 16px', borderRadius: '999px',
                                        fontSize: '13px', fontWeight: '600',
                                        border: i === 0
                                            ? '1.5px solid #1A56DB'
                                            : '1.5px solid #E2E8F0',
                                        backgroundColor: i === 0
                                            ? '#1A56DB' : '#fff',
                                        color: i === 0 ? '#fff' : '#64748B',
                                        cursor: 'pointer'
                                    }}>
                                        {p}
                                    </button>
                                ))}
                        </div>

                        <button
                            onClick={() => navigate('/search')}
                            style={{
                                width: '100%', backgroundColor: '#1A56DB',
                                color: '#fff', padding: '18px',
                                borderRadius: '12px', fontWeight: '700',
                                fontSize: '16px', border: 'none',
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                gap: '8px'
                            }}>
                            Find Journeys <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{
                backgroundColor: '#F8FAFC', padding: '60px 24px'
            }}>
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <h2 style={{
                            fontSize: '36px', fontWeight: '800',
                            color: '#0F172A', marginBottom: '12px'
                        }}>
                            How Traverse Works
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '17px' }}>
                            Three simple steps to your perfect journey
                        </p>
                    </div>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                        gap: '24px'
                    }}>
                        {[
                            {
                                icon: Search, step: '1',
                                title: 'Enter Your Journey',
                                desc: 'Tell us where you are starting and where you want to go.'
                            },
                            {
                                icon: SlidersHorizontal, step: '2',
                                title: 'Compare and Customise',
                                desc: 'See complete journey options and swap any leg instantly.'
                            },
                            {
                                icon: Ticket, step: '3',
                                title: 'Book and Travel',
                                desc: 'Pay once, get all your tickets, travel confidently.'
                            },
                        ].map(({ icon: Icon, step, title, desc }) => (
                            <div key={step} style={{
                                backgroundColor: '#fff', borderRadius: '20px',
                                padding: '36px 32px',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    backgroundColor: '#1A56DB', color: '#fff',
                                    borderRadius: '999px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    fontWeight: '800', fontSize: '16px',
                                    marginBottom: '20px'
                                }}>
                                    {step}
                                </div>
                                <Icon size={28} color="#0EA5E9"
                                    style={{ marginBottom: '16px' }} />
                                <h3 style={{
                                    fontSize: '17px', fontWeight: '700',
                                    color: '#0F172A', marginBottom: '10px'
                                }}>
                                    {title}
                                </h3>
                                <p style={{
                                    color: '#64748B', fontSize: '14px',
                                    lineHeight: '1.6'
                                }}>
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY TRAVERSE */}
            <section style={{
                backgroundColor: '#fff', padding: '60px 24px'
            }}>
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <h2 style={{
                            fontSize: '36px', fontWeight: '800',
                            color: '#0F172A', marginBottom: '12px'
                        }}>
                            Why students choose Traverse
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '17px' }}>
                            Built specifically for Indian college students
                        </p>
                    </div>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                        gap: '24px'
                    }}>
                        {[
                            {
                                icon: Route, title: 'Every Mode in One Place',
                                desc: 'Stop switching between IRCTC, RedBus, Ola and Google Maps. Traverse connects them all.'
                            },
                            {
                                icon: SlidersHorizontal,
                                title: 'Customise Every Leg',
                                desc: 'Change cab to bus, see how total cost and time updates instantly.'
                            },
                            {
                                icon: Shield, title: 'Smart Delay Handling',
                                desc: 'If your train is late, Traverse finds your alternative before you even worry.'
                            },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} style={{
                                backgroundColor: '#F8FAFC',
                                borderRadius: '20px', padding: '36px 32px',
                                border: '1px solid #E2E8F0'
                            }}>
                                <div style={{
                                    width: '48px', height: '48px',
                                    backgroundColor: '#EFF6FF',
                                    borderRadius: '12px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <Icon size={24} color="#1A56DB" />
                                </div>
                                <h3 style={{
                                    fontSize: '17px', fontWeight: '700',
                                    color: '#0F172A', marginBottom: '10px'
                                }}>
                                    {title}
                                </h3>
                                <p style={{
                                    color: '#64748B', fontSize: '14px',
                                    lineHeight: '1.6'
                                }}>
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{
                backgroundColor: '#0F172A', padding: '48px 24px'
            }}>
                <div style={{
                    maxWidth: '960px', margin: '0 auto',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', flexWrap: 'wrap', gap: '16px'
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <MapPin size={20} color="#0EA5E9" />
                        <span style={{
                            color: '#fff', fontWeight: '800', fontSize: '20px'
                        }}>
                            TRAVERSE
                        </span>
                        <span style={{
                            color: '#64748B', fontSize: '13px', marginLeft: '8px'
                        }}>
                            One Journey. Every Mode.
                        </span>
                    </div>
                    <span style={{ color: '#64748B', fontSize: '13px' }}>
                        © 2024 Traverse. Built for students, by students.
                    </span>
                </div>
            </footer>

        </div>
    )
}

export default Home