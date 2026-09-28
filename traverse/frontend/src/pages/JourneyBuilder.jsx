import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MapPin, Train, Car, Bus, ArrowRight,
    Clock, ChevronLeft, CheckCircle
} from 'lucide-react'

function JourneyBuilder() {
    const navigate = useNavigate()

    const [legs, setLegs] = useState({
        1: {
            title: 'Cab to Chandigarh Station', cost: 200,
            selected: 'cab'
        },
        2: {
            title: 'Vande Bharat Express', cost: 450,
            selected: 'vande'
        },
        3: {
            title: 'City Cab to Destination', cost: 300,
            selected: 'cab'
        },
    })

    const legOptions = {
        1: [
            { key: 'bus', label: 'Bus', cost: 80 },
            { key: 'cab', label: 'Cab', cost: 200 },
            { key: 'buscab', label: 'Bus+Cab', cost: 140 },
        ],
        2: [
            { key: 'vande', label: 'Vande Bharat', cost: 450 },
            { key: 'shatabdi', label: 'Shatabdi', cost: 380 },
            { key: 'bus', label: 'Intercity Bus', cost: 300 },
        ],
        3: [
            { key: 'metro', label: 'Metro', cost: 50 },
            { key: 'metrocab', label: 'Metro+Cab', cost: 150 },
            { key: 'cab', label: 'Cab', cost: 300 },
        ],
    }

    const legTitles = {
        1: {
            bus: 'Bus to Chandigarh',
            cab: 'Cab to Chandigarh Station',
            buscab: 'Bus + Cab to Chandigarh',
        },
        2: {
            vande: 'Vande Bharat Express',
            shatabdi: 'Kalka Shatabdi Express',
            bus: 'HRTC Volvo Intercity Bus',
        },
        3: {
            metro: 'Delhi Metro Yellow Line',
            metrocab: 'Metro + Auto Rickshaw',
            cab: 'Pre-paid City Cab',
        },
    }

    const updateLeg = (legNum, key, cost) => {
        setLegs(prev => ({
            ...prev,
            [legNum]: {
                title: legTitles[legNum][key],
                cost,
                selected: key
            }
        }))
    }

    const totalCost = legs[1].cost + legs[2].cost + legs[3].cost

    const s = {
        page: {
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            paddingBottom: '100px'
        },
        topBar: {
            backgroundColor: '#EFF6FF',
            borderBottom: '1px solid #BFDBFE',
            padding: '16px 24px'
        },
        topBarInner: {
            maxWidth: '900px', margin: '0 auto',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '16px'
        },
        routeLeft: {
            display: 'flex', alignItems: 'center', gap: '12px'
        },
        routeIcon: {
            width: '44px', height: '44px',
            backgroundColor: '#1A56DB', borderRadius: '12px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center'
        },
        routeTitle: {
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '18px', fontWeight: '800', color: '#0F172A'
        },
        routeSub: {
            fontSize: '13px', color: '#64748B', marginTop: '2px',
            display: 'flex', alignItems: 'center', gap: '6px'
        },
        routeRight: {
            display: 'flex', alignItems: 'center', gap: '24px',
            flexWrap: 'wrap'
        },
        totalCost: {
            fontSize: '32px', fontWeight: '900',
            color: '#0EA5E9', letterSpacing: '-1px'
        },
        totalLabel: {
            fontSize: '11px', color: '#94A3B8',
            fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.08em'
        },
        divider: {
            width: '1px', height: '40px',
            backgroundColor: '#CBD5E1'
        },
        timeBlock: {
            fontSize: '18px', fontWeight: '700', color: '#0F172A'
        },
        content: {
            maxWidth: '760px', margin: '0 auto',
            padding: '24px 24px'
        },
        breadcrumb: {
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: '#94A3B8', marginBottom: '20px'
        },
        pageTitle: {
            fontSize: '36px', fontWeight: '800', color: '#0F172A',
            marginBottom: '4px', letterSpacing: '-1px'
        },
        pageSubtitle: {
            fontSize: '15px', color: '#64748B', marginBottom: '32px'
        },
        timeline: {
            position: 'relative', paddingLeft: '56px'
        },
        timelineLine: {
            position: 'absolute', left: '20px', top: '24px',
            bottom: '24px', width: '4px',
            background: 'linear-gradient(to bottom, #1A56DB, #0EA5E9, #22C55E)',
            borderRadius: '4px'
        },
        node: (color) => ({
            position: 'absolute', left: '-36px',
            width: '44px', height: '44px',
            backgroundColor: color, borderRadius: '999px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 4px #ffffff, 0 2px 8px rgba(0,0,0,0.12)',
            zIndex: 1
        }),
        nodeRow: {
            position: 'relative', marginBottom: '8px',
            paddingTop: '4px', paddingLeft: '20px'
        },
        nodeTitle: {
            fontSize: '16px', fontWeight: '800', color: '#0F172A',
            display: 'flex', alignItems: 'center', gap: '8px',
            flexWrap: 'wrap'
        },
        nodeSub: {
            fontSize: '13px', color: '#94A3B8', marginTop: '2px'
        },
        pill: (active) => ({
            display: 'inline-block', padding: '4px 10px',
            borderRadius: '999px', fontSize: '11px',
            fontWeight: '700',
            backgroundColor: active ? '#1A56DB' : '#F1F5F9',
            color: active ? '#fff' : '#64748B',
            border: active ? 'none' : '1px solid #E2E8F0'
        }),
        bufferPill: {
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '4px 10px', borderRadius: '999px',
            fontSize: '11px', fontWeight: '700',
            backgroundColor: '#FFFBEB', color: '#D97706',
            border: '1px solid #FDE68A'
        },
        destPill: {
            display: 'inline-block', padding: '4px 10px',
            borderRadius: '999px', fontSize: '11px',
            fontWeight: '700', backgroundColor: '#DCFCE7',
            color: '#166534', border: '1px solid #BBF7D0'
        },
        legCard: {
            margin: '16px 0 24px',
            backgroundColor: '#fff', borderRadius: '16px',
            border: '1px solid #E2E8F0',
            borderLeft: '4px solid #1A56DB',
            padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        },
        legCardInner: {
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px'
        },
        legLeft: {
            display: 'flex', alignItems: 'flex-start', gap: '12px'
        },
        legIcon: {
            width: '40px', height: '40px', borderRadius: '999px',
            backgroundColor: '#EFF6FF', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
        },
        legTitle: {
            fontSize: '16px', fontWeight: '800', color: '#0F172A'
        },
        legCost: {
            fontSize: '18px', fontWeight: '900', color: '#0EA5E9',
            marginLeft: '8px'
        },
        legTime: {
            fontSize: '13px', color: '#94A3B8', marginTop: '4px'
        },
        legRight: {
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', gap: '8px', flexShrink: 0
        },
        switchLabel: {
            fontSize: '11px', fontWeight: '700', color: '#94A3B8',
            textTransform: 'uppercase', letterSpacing: '0.08em'
        },
        modeButtons: {
            display: 'flex', gap: '8px', flexWrap: 'wrap',
            justifyContent: 'flex-end'
        },
        modeBtn: (active) => ({
            padding: '8px 14px', borderRadius: '999px',
            fontSize: '13px', fontWeight: '700',
            backgroundColor: active ? '#1A56DB' : '#fff',
            color: active ? '#fff' : '#64748B',
            border: active ? 'none' : '1.5px solid #E2E8F0',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: '4px'
        }),
        statsCard: {
            backgroundColor: '#F8FAFC', borderRadius: '16px',
            border: '1px solid #E2E8F0', padding: '24px',
            marginTop: '32px'
        },
        statsLabel: {
            fontSize: '11px', fontWeight: '700', color: '#94A3B8',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '16px'
        },
        statsGrid: {
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '16px'
        },
        statItem: {
            borderRight: '1px solid #E2E8F0', paddingRight: '16px'
        },
        statValue: {
            fontSize: '22px', fontWeight: '800', color: '#0F172A',
            display: 'block', marginBottom: '4px'
        },
        statSub: {
            fontSize: '12px', color: '#94A3B8'
        },
        stickyBar: {
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: '#fff',
            borderTop: '1px solid #E2E8F0',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
            padding: '16px 24px', zIndex: 50
        },
        stickyInner: {
            maxWidth: '900px', margin: '0 auto',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '12px'
        },
        stickyLeft: {
            display: 'flex', alignItems: 'center', gap: '12px'
        },
        stickyQR: {
            width: '44px', height: '44px',
            backgroundColor: '#EFF6FF', borderRadius: '12px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center'
        },
        stickyTotal: {
            fontSize: '22px', fontWeight: '900', color: '#0EA5E9'
        },
        stickySub: {
            fontSize: '13px', color: '#94A3B8'
        },
        stickyRight: {
            display: 'flex', alignItems: 'center', gap: '12px'
        },
        backBtn: {
            fontSize: '14px', fontWeight: '600', color: '#94A3B8',
            background: 'none', border: 'none', cursor: 'pointer'
        },
        confirmBtn: {
            backgroundColor: '#1A56DB', color: '#fff',
            padding: '14px 32px', borderRadius: '12px',
            fontWeight: '700', fontSize: '15px',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(26,86,219,0.3)'
        }
    }

    const getLegIcon = (legNum, selected) => {
        if (legNum === 2) return <Train size={20} color="#1A56DB" />
        if (selected === 'metro' || selected === 'metrocab')
            return <Train size={20} color="#1A56DB" />
        if (selected === 'bus' || selected === 'buscab')
            return <Bus size={20} color="#1A56DB" />
        return <Car size={20} color="#1A56DB" />
    }

    const getLegTimes = (legNum) => {
        const times = {
            1: 'Departs 08:30 AM · Arrives 09:45 AM · 1h 15m',
            2: 'Departs 10:10 AM · Arrives 2:40 PM · 4h 30m',
            3: 'Departs 2:55 PM · Arrives 3:40 PM · 45m',
        }
        return times[legNum]
    }

    return (
        <div style={s.page}>

            {/* TOP SUMMARY BAR */}
            <section style={s.topBar}>
                <div style={s.topBarInner}>
                    <div style={s.routeLeft}>
                        <div style={s.routeIcon}>
                            <MapPin size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={s.routeTitle}>
                                JUIT Waknaghat
                                <ArrowRight size={18} color="#94A3B8" />
                                New Delhi
                            </div>
                            <div style={s.routeSub}>
                                Thu, 24 Oct · 08:30 AM departure
                            </div>
                        </div>
                    </div>
                    <div style={s.routeRight}>
                        <div>
                            <div style={s.totalCost}>₹{totalCost}</div>
                            <div style={s.totalLabel}>Total</div>
                        </div>
                        <div style={s.divider} />
                        <div>
                            <div style={s.timeBlock}>6h 30m</div>
                            <div style={s.totalLabel}>2 transfers</div>
                        </div>
                        <div style={s.divider} />
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            color: '#1A56DB', fontWeight: '600', fontSize: '14px',
                            background: 'none', border: 'none', cursor: 'pointer'
                        }}>
                            Edit Search
                        </button>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <div style={s.content}>

                {/* Breadcrumb */}
                <div style={s.breadcrumb}>
                    <button
                        onClick={() => navigate('/search')}
                        style={{
                            display: 'flex', alignItems: 'center',
                            gap: '4px', color: '#94A3B8', background: 'none',
                            border: 'none', cursor: 'pointer', fontSize: '13px',
                            fontWeight: '600'
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
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap',
                    gap: '12px', marginBottom: '32px'
                }}>
                    <div>
                        <h1 style={s.pageTitle}>Customise Your Journey</h1>
                        <p style={s.pageSubtitle}>
                            Swap any leg to see your total update instantly
                        </p>
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '999px',
                        backgroundColor: '#DCFCE7', color: '#166534',
                        fontSize: '12px', fontWeight: '700',
                        border: '1px solid #BBF7D0'
                    }}>
                        <CheckCircle size={14} />
                        Student Rebate Applied (Save ₹320)
                    </div>
                </div>

                {/* TIMELINE */}
                <div style={s.timeline}>
                    <div style={s.timelineLine} />

                    {/* NODE 1 — ORIGIN */}
                    <div style={s.nodeRow}>
                        <div style={s.node('#1A56DB')}>
                            <MapPin size={20} color="#fff" />
                        </div>
                        <div style={s.nodeTitle}>
                            JUIT Waknaghat, Solan
                            <span style={s.pill(true)}>START</span>
                        </div>
                        <div style={s.nodeSub}>
                            Departure: <strong style={{ color: '#0F172A' }}>
                                08:30 AM
                            </strong> · Campus Gate
                        </div>
                    </div>

                    {/* LEG CARD 1 */}
                    <div style={s.legCard}>
                        <div style={s.legCardInner}>
                            <div style={s.legLeft}>
                                <div style={s.legIcon}>
                                    {getLegIcon(1, legs[1].selected)}
                                </div>
                                <div>
                                    <div>
                                        <span style={s.legTitle}>{legs[1].title}</span>
                                        <span style={s.legCost}>₹{legs[1].cost}</span>
                                    </div>
                                    <div style={s.legTime}>{getLegTimes(1)}</div>
                                </div>
                            </div>
                            <div style={s.legRight}>
                                <div style={s.switchLabel}>Switch leg mode</div>
                                <div style={s.modeButtons}>
                                    {legOptions[1].map(opt => (
                                        <button
                                            key={opt.key}
                                            onClick={() => updateLeg(1, opt.key, opt.cost)}
                                            style={s.modeBtn(legs[1].selected === opt.key)}>
                                            {legs[1].selected === opt.key && (
                                                <CheckCircle size={12} />
                                            )}
                                            {opt.label} ₹{opt.cost}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NODE 2 — CHANDIGARH */}
                    <div style={s.nodeRow}>
                        <div style={s.node('#1A56DB')}>
                            <Train size={20} color="#fff" />
                        </div>
                        <div style={s.nodeTitle}>
                            Chandigarh Junction (CDG)
                            <span style={s.bufferPill}>
                                <Clock size={12} /> 25 MIN BUFFER
                            </span>
                        </div>
                        <div style={s.nodeSub}>
                            Arrive 09:45 AM · Platform 3
                        </div>
                    </div>

                    {/* LEG CARD 2 */}
                    <div style={s.legCard}>
                        <div style={s.legCardInner}>
                            <div style={s.legLeft}>
                                <div style={s.legIcon}>
                                    {getLegIcon(2, legs[2].selected)}
                                </div>
                                <div>
                                    <div>
                                        <span style={s.legTitle}>{legs[2].title}</span>
                                        <span style={s.legCost}>₹{legs[2].cost}</span>
                                    </div>
                                    <div style={s.legTime}>{getLegTimes(2)}</div>
                                    {legs[2].selected === 'vande' && (
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center',
                                            gap: '4px', marginTop: '8px', fontSize: '12px',
                                            fontWeight: '600', color: '#22C55E'
                                        }}>
                                            <CheckCircle size={12} />
                                            IRCTC Confirmed · Coach C4, Seat 28
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={s.legRight}>
                                <div style={s.switchLabel}>Switch leg mode</div>
                                <div style={s.modeButtons}>
                                    {legOptions[2].map(opt => (
                                        <button
                                            key={opt.key}
                                            onClick={() => updateLeg(2, opt.key, opt.cost)}
                                            style={s.modeBtn(legs[2].selected === opt.key)}>
                                            {legs[2].selected === opt.key && (
                                                <CheckCircle size={12} />
                                            )}
                                            {opt.label} ₹{opt.cost}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NODE 3 — NDLS */}
                    <div style={s.nodeRow}>
                        <div style={s.node('#0EA5E9')}>
                            <Train size={20} color="#fff" />
                        </div>
                        <div style={s.nodeTitle}>
                            New Delhi Railway Station (NDLS)
                            <span style={{
                                ...s.pill(false),
                                backgroundColor: '#EFF6FF',
                                color: '#1A56DB',
                                border: '1px solid #BFDBFE'
                            }}>
                                METRO / ROAD LINK
                            </span>
                        </div>
                        <div style={s.nodeSub}>
                            Arrive 2:40 PM · Exit Platform 1
                        </div>
                    </div>

                    {/* LEG CARD 3 */}
                    <div style={s.legCard}>
                        <div style={s.legCardInner}>
                            <div style={s.legLeft}>
                                <div style={s.legIcon}>
                                    {getLegIcon(3, legs[3].selected)}
                                </div>
                                <div>
                                    <div>
                                        <span style={s.legTitle}>{legs[3].title}</span>
                                        <span style={s.legCost}>₹{legs[3].cost}</span>
                                    </div>
                                    <div style={s.legTime}>{getLegTimes(3)}</div>
                                </div>
                            </div>
                            <div style={s.legRight}>
                                <div style={s.switchLabel}>Switch leg mode</div>
                                <div style={s.modeButtons}>
                                    {legOptions[3].map(opt => (
                                        <button
                                            key={opt.key}
                                            onClick={() => updateLeg(3, opt.key, opt.cost)}
                                            style={s.modeBtn(legs[3].selected === opt.key)}>
                                            {legs[3].selected === opt.key && (
                                                <CheckCircle size={12} />
                                            )}
                                            {opt.label} ₹{opt.cost}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NODE 4 — DESTINATION */}
                    <div style={s.nodeRow}>
                        <div style={s.node('#22C55E')}>
                            <MapPin size={20} color="#fff" />
                        </div>
                        <div style={s.nodeTitle}>
                            Delhi Campus, South Delhi
                            <span style={s.destPill}>DESTINATION</span>
                        </div>
                        <div style={s.nodeSub}>
                            Estimated arrival:
                            <strong style={{ color: '#0F172A' }}> 3:40 PM</strong>
                            · Main Gate drop-off
                        </div>
                    </div>

                    {/* STATS CARD */}
                    <div style={s.statsCard}>
                        <div style={s.statsLabel}>Journey Summary</div>
                        <div style={s.statsGrid}>
                            <div style={s.statItem}>
                                <span style={s.statValue}>~450 km</span>
                                <span style={s.statSub}>Total Distance</span>
                            </div>
                            <div style={s.statItem}>
                                <span style={s.statValue}>7h 10m</span>
                                <span style={s.statSub}>Incl. 25m buffer</span>
                            </div>
                            <div style={{ ...s.statItem }}>
                                <span style={{
                                    ...s.statValue,
                                    color: '#0EA5E9'
                                }}>
                                    ₹{totalCost}
                                </span>
                                <span style={{
                                    ...s.statSub,
                                    color: '#22C55E', fontWeight: '700'
                                }}>
                                    Incl. ₹320 student rebate
                                </span>
                            </div>
                            <div>
                                <span style={s.statValue}>2</span>
                                <span style={s.statSub}>Transfers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY BOTTOM BAR */}
            <div style={s.stickyBar}>
                <div style={s.stickyInner}>
                    <div style={s.stickyLeft}>
                        <div style={s.stickyQR}>
                            <CheckCircle size={22} color="#1A56DB" />
                        </div>
                        <div>
                            <div>
                                <span style={{
                                    fontSize: '16px', fontWeight: '700',
                                    color: '#0F172A'
                                }}>Total: </span>
                                <span style={s.stickyTotal}>₹{totalCost}</span>
                                <span style={{
                                    fontSize: '14px', color: '#94A3B8',
                                    marginLeft: '8px'
                                }}>
                                    · 6h 30m · 2 transfers
                                </span>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                gap: '4px', marginTop: '2px'
                            }}>
                                <CheckCircle size={13} color="#22C55E" />
                                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                                    All 3 legs combined into 1 booking
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={s.stickyRight}>
                        <button
                            onClick={() => navigate('/search')}
                            style={s.backBtn}>
                            ← Back to Results
                        </button>
                        <button
                            onClick={() => navigate('/order-summary')}
                            style={s.confirmBtn}>
                            Confirm Journey <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default JourneyBuilder