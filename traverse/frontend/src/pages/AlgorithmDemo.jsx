import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Car, Train, Bus, Plane, ArrowRight,
    Calculator, ChevronDown, ChevronUp,
    CheckCircle, MapPin, Clock, Wallet,
    BarChart2, Database, GitBranch
} from 'lucide-react'
import {
    findCandidateRoutes,
    getCorridorDistances,
    getDataSummary,
    NODES,
    EDGES
} from '../utils/routingEngine'
import {
    runTOPSIS,
    runTOPSISWithSteps
} from '../utils/topsisEngine'

// ── Colour helpers ──────────────────────────────────────────
const MODE_COLOR = {
    cab: '#0EA5E9',
    bus: '#D97706',
    train: '#1A56DB',
    flight: '#7C3AED',
    walk: '#22C55E',
    metro: '#8B5CF6',
}
const MODE_ICON = { cab: Car, bus: Bus, train: Train, flight: Plane, walk: Car, metro: Train }

function ModeIcon({ mode, size = 14 }) {
    const Icon = MODE_ICON[mode] || Car
    return <Icon size={size} color={MODE_COLOR[mode] || '#64748B'} />
}

// ── Small reusable card ─────────────────────────────────────
function StatCard({ label, value, sub, color = '#1A56DB' }) {
    return (
        <div style={{
            backgroundColor: '#F8FAFC', borderRadius: '12px',
            padding: '16px', border: '1px solid #E2E8F0', textAlign: 'center'
        }}>
            <div style={{
                fontSize: '11px', fontWeight: '700', color: '#94A3B8',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px'
            }}>
                {label}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color, letterSpacing: '-0.5px' }}>
                {value}
            </div>
            {sub && <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{sub}</div>}
        </div>
    )
}

// ── Section heading ─────────────────────────────────────────
function SectionHead({ icon: Icon, title, badge }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0
            }}>
                <Icon size={16} color="#1A56DB" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{title}</span>
            {badge && (
                <span style={{
                    backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: '11px',
                    fontWeight: '700', padding: '2px 8px', borderRadius: '999px'
                }}>
                    {badge}
                </span>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function AlgorithmDemo() {
    const navigate = useNavigate()

    const [persona, setPersona] = useState('balanced')
    const [results, setResults] = useState(null)
    const [steps, setSteps] = useState(null)
    const [computing, setComputing] = useState(false)
    const [showMatrix, setShowMatrix] = useState(false)
    const [showWeights, setShowWeights] = useState(false)
    const [showDistances, setShowDistances] = useState(false)
    const [candidates, setCandidates] = useState([])
    const [summary, setSummary] = useState(null)
    const [distances, setDistances] = useState([])

    // Load static data on mount
    useEffect(() => {
        const c = findCandidateRoutes()
        setCandidates(c)
        setSummary(getDataSummary())
        setDistances(getCorridorDistances())
    }, [])

    const personas = [
        {
            key: 'cheapest', label: '💰 Cheapest',
            desc: 'Cost 48% · Time 15% · Comfort 10%',
            color: '#16A34A', bg: '#DCFCE7'
        },
        {
            key: 'fastest', label: '⚡ Fastest',
            desc: 'Time 48% · Cost 10% · Transfers 12%',
            color: '#D97706', bg: '#FEF9C3'
        },
        {
            key: 'comfort', label: '⭐ Comfort',
            desc: 'Comfort 44% · Reliability 19% · Cost 9%',
            color: '#7C3AED', bg: '#F5F3FF'
        },
        {
            key: 'balanced', label: '⚖️ Balanced',
            desc: 'Entropy-derived equal weights',
            color: '#1A56DB', bg: '#EFF6FF'
        },
    ]

    function compute() {
        setComputing(true)
        setResults(null)
        setSteps(null)
        setTimeout(() => {
            const r = runTOPSIS(candidates, persona)
            const s = runTOPSISWithSteps(candidates, persona)
            setResults(r)
            setSteps(s)
            setComputing(false)
        }, 900)
    }

    const scoreBar = (val, max = 1) => {
        const pct = Math.min(100, (val / max) * 100)
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    flex: 1, height: '6px', backgroundColor: '#E2E8F0',
                    borderRadius: '999px', overflow: 'hidden'
                }}>
                    <div style={{
                        width: pct + '%', height: '100%',
                        backgroundColor: '#1A56DB', borderRadius: '999px'
                    }} />
                </div>
                <span style={{
                    fontSize: '12px', fontWeight: '800',
                    color: '#1A56DB', minWidth: '44px', textAlign: 'right'
                }}>
                    {val.toFixed(4)}
                </span>
            </div>
        )
    }

    // ── render ────────────────────────────────────────────────
    return (
        <div style={{
            fontFamily: 'Inter, sans-serif', backgroundColor: '#fff',
            minHeight: '100vh', paddingBottom: '60px'
        }}>

            {/* ── HERO HEADER ────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)',
                padding: '40px 24px 36px'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#22C55E20', border: '1px solid #22C55E50',
                        color: '#22C55E', fontSize: '12px', fontWeight: '700',
                        padding: '6px 14px', borderRadius: '999px', marginBottom: '16px'
                    }}>
                        <Calculator size={13} />
                        Mathematical Routing Engine — Live Demo
                    </div>
                    <h1 style={{
                        fontSize: '36px', fontWeight: '900', color: '#fff',
                        letterSpacing: '-1.5px', margin: '0 0 8px'
                    }}>
                        TRAVERSE Algorithm Demo
                    </h1>
                    <p style={{
                        fontSize: '15px', color: '#94A3B8', margin: '0 0 24px',
                        maxWidth: '620px', lineHeight: '1.7'
                    }}>
                        Graph-based multi-modal routing + Modified TOPSIS with three
                        trigonometric similarity measures. Real HRTC scrape data.
                        Zero hardcoded routes.
                    </p>

                    {/* Formula strip */}
                    <div style={{
                        backgroundColor: '#0F172A', borderRadius: '12px',
                        padding: '16px 20px', display: 'inline-block',
                        border: '1px solid #334155', fontFamily: 'monospace'
                    }}>
                        <div style={{ color: '#94A3B8', fontSize: '11px', marginBottom: '6px' }}>
                            Modified TOPSIS Closeness Coefficient (Paper Eq. 5):
                        </div>
                        <div style={{ color: '#22C55E', fontSize: '15px', fontWeight: '700' }}>
                            CC(i) = S(Aᵢ, PIS) / ( S(Aᵢ, PIS) + S(Aᵢ, NIS) )
                        </div>
                        <div style={{ color: '#64748B', fontSize: '11px', marginTop: '6px' }}>
                            S₁ = cosine dot-product &nbsp;|&nbsp;
                            S₂ = cos(π/2 × |diff| / 1) &nbsp;|&nbsp;
                            S₃ = cos(π/2 × |diff| / 3)
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>

                {/* ── DATA SUMMARY CARDS ──────────────────────────── */}
                {summary && (
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                        gap: '12px', marginBottom: '32px'
                    }}>
                        <StatCard label="Hub Nodes" value={summary.totalNodes}
                            sub="Tier 1+2 only" />
                        <StatCard label="Transport Legs" value={summary.totalEdges}
                            sub="Real + formula" color="#D97706" />
                        <StatCard label="HRTC Services" value={summary.busServicesReal}
                            sub="Scraped real data" color="#7C3AED" />
                        <StatCard label="Candidate Routes" value={summary.totalCandidates}
                            sub="Graph traversal" color="#0EA5E9" />
                        <StatCard label="Corridor" value={summary.corridorDistance + ' km'}
                            sub="Haversine computed" color="#22C55E" />
                    </div>
                )}

                {/* ── SECTION 1: HAVERSINE DISTANCES ─────────────── */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '16px',
                    border: '1px solid #E2E8F0', marginBottom: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}>
                    <div style={{ padding: '20px 24px' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <SectionHead icon={MapPin} title="Real Geographic Distances"
                                badge="Haversine Formula" />
                            <button onClick={() => setShowDistances(!showDistances)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#64748B'
                                }}>
                                {showDistances ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        </div>
                        <div style={{
                            fontSize: '13px', color: '#64748B',
                            fontFamily: 'monospace',
                            backgroundColor: '#F8FAFC', borderRadius: '8px',
                            padding: '10px 14px', marginBottom: showDistances ? '16px' : 0
                        }}>
                            d = 2R × arcsin( √( sin²(Δlat/2) + cos(lat₁)·cos(lat₂)·sin²(Δlon/2) ) )
                            &nbsp;&nbsp;where R = 6,371 km
                        </div>
                    </div>
                    {showDistances && (
                        <div style={{ padding: '0 24px 20px' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{
                                    width: '100%', borderCollapse: 'collapse',
                                    fontSize: '13px'
                                }}>
                                    <thead>
                                        <tr>
                                            {['From', 'To', 'Distance (km)', 'Coordinates Used'].map(h => (
                                                <th key={h} style={{
                                                    padding: '10px 12px',
                                                    backgroundColor: '#F8FAFC', textAlign: 'left',
                                                    fontWeight: '700', color: '#64748B', fontSize: '11px',
                                                    textTransform: 'uppercase', letterSpacing: '0.06em'
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {distances.map((d, i) => (
                                            <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                                                <td style={{
                                                    padding: '10px 12px', fontWeight: '700',
                                                    color: '#0F172A'
                                                }}>{d.from}</td>
                                                <td style={{ padding: '10px 12px', color: '#475569' }}>{d.to}</td>
                                                <td style={{
                                                    padding: '10px 12px', fontWeight: '900',
                                                    color: '#1A56DB', fontSize: '15px'
                                                }}>{d.distanceKm}</td>
                                                <td style={{
                                                    padding: '10px 12px', color: '#94A3B8',
                                                    fontSize: '11px', fontFamily: 'monospace'
                                                }}>
                                                    {d.formula}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── SECTION 2: DATA SOURCES ─────────────────────── */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '16px',
                    border: '1px solid #E2E8F0', padding: '20px 24px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}>
                    <SectionHead icon={Database} title="Real Data Sources" />
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '12px'
                    }}>
                        {[
                            {
                                label: 'HRTC Bus Data', src: 'hrtcbustime.com scrape',
                                detail: '21 services on Waknaghat-Delhi corridor',
                                color: '#D97706', bg: '#FFFBEB'
                            },
                            {
                                label: 'Cab Formula', src: 'Mathematical derivation',
                                detail: 'max(Base + km × Rate, MinFare) per vehicle class',
                                color: '#0EA5E9', bg: '#F0F9FF'
                            },
                            {
                                label: 'Train Rates', src: 'IRCTC per-km tariff',
                                detail: 'Intercity ₹0.50/km · Shatabdi ₹1.00/km · VB ₹2.50/km',
                                color: '#1A56DB', bg: '#EFF6FF'
                            },
                        ].map(item => (
                            <div key={item.label} style={{
                                backgroundColor: item.bg,
                                borderRadius: '10px', padding: '14px',
                                border: '1px solid ' + item.color + '30'
                            }}>
                                <div style={{
                                    fontSize: '13px', fontWeight: '800',
                                    color: item.color, marginBottom: '4px'
                                }}>
                                    {item.label}
                                </div>
                                <div style={{
                                    fontSize: '11px', fontWeight: '700',
                                    color: '#64748B', marginBottom: '4px'
                                }}>
                                    Source: {item.src}
                                </div>
                                <div style={{
                                    fontSize: '12px', color: '#475569',
                                    lineHeight: '1.5'
                                }}>
                                    {item.detail}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 3: PERSONA SELECTOR + COMPUTE ───────── */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '16px',
                    border: '1px solid #E2E8F0', padding: '24px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}>
                    <SectionHead icon={BarChart2} title="Select User Persona" />
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                        gap: '12px', marginBottom: '20px'
                    }}>
                        {personas.map(p => (
                            <button key={p.key} onClick={() => setPersona(p.key)}
                                style={{
                                    padding: '16px 12px', borderRadius: '12px',
                                    border: persona === p.key
                                        ? '2px solid ' + p.color
                                        : '1.5px solid #E2E8F0',
                                    backgroundColor: persona === p.key ? p.bg : '#fff',
                                    cursor: 'pointer', textAlign: 'center',
                                    transition: 'all 0.15s'
                                }}>
                                <div style={{
                                    fontSize: '16px', marginBottom: '6px',
                                    fontWeight: '800', color: p.color
                                }}>
                                    {p.label}
                                </div>
                                <div style={{
                                    fontSize: '11px', color: '#64748B',
                                    lineHeight: '1.5'
                                }}>
                                    {p.desc}
                                </div>
                            </button>
                        ))}
                    </div>

                    <button onClick={compute} disabled={computing || candidates.length === 0}
                        style={{
                            width: '100%', padding: '18px',
                            backgroundColor: computing ? '#94A3B8' : '#1A56DB',
                            color: '#fff', border: 'none', borderRadius: '12px',
                            fontWeight: '800', fontSize: '16px',
                            cursor: computing ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '10px',
                            boxShadow: computing ? 'none' : '0 4px 16px rgba(26,86,219,0.3)',
                            transition: 'all 0.2s'
                        }}>
                        <Calculator size={20} />
                        {computing
                            ? 'Running Modified TOPSIS — Computing Similarity Measures…'
                            : `▶  Compute Optimal Routes for JUIT → Delhi  (${candidates.length} candidates)`
                        }
                    </button>
                </div>

                {/* ── SECTION 4: RESULTS ──────────────────────────── */}
                {results && steps && (
                    <>
                        {/* Weight summary */}
                        <div style={{
                            backgroundColor: '#0F172A', borderRadius: '16px',
                            padding: '20px 24px', marginBottom: '20px'
                        }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '12px'
                            }}>
                                <span style={{
                                    color: '#94A3B8', fontSize: '12px',
                                    fontWeight: '700', textTransform: 'uppercase',
                                    letterSpacing: '0.08em'
                                }}>
                                    Entropy Weights → Persona Adjusted Final Weights
                                </span>
                                <button onClick={() => setShowWeights(!showWeights)}
                                    style={{
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', color: '#64748B'
                                    }}>
                                    {showWeights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {steps.weightDetails.labels.map((label, i) => (
                                    <div key={label} style={{ textAlign: 'center' }}>
                                        <div style={{
                                            fontSize: '10px', color: '#64748B',
                                            textTransform: 'uppercase', marginBottom: '4px'
                                        }}>
                                            {label}
                                        </div>
                                        <div style={{
                                            fontSize: '11px', color: '#475569',
                                            marginBottom: '2px'
                                        }}>
                                            entropy: {steps.entropyWeights.weights[i]}
                                        </div>
                                        <div style={{
                                            fontSize: '16px', fontWeight: '900',
                                            color: '#22C55E'
                                        }}>
                                            {steps.weightDetails.finalWeights[i]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {showWeights && (
                                <div style={{
                                    marginTop: '16px', padding: '14px',
                                    backgroundColor: '#1E293B', borderRadius: '10px',
                                    fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace',
                                    lineHeight: '1.8'
                                }}>
                                    <div style={{
                                        color: '#22C55E', marginBottom: '8px',
                                        fontWeight: '700'
                                    }}>
                                        Entropy Weight Formula (Paper Eq. 4):
                                    </div>
                                    <div>Hⱼ = -(1/ln(m)) × Σᵢ(nᵢⱼ × ln(nᵢⱼ))</div>
                                    <div>wⱼ = (1 - Hⱼ) / Σⱼ(1 - Hⱼ)</div>
                                    <div style={{ marginTop: '8px', color: '#64748B' }}>
                                        m = {steps.totalCandidates} alternatives evaluated
                                    </div>
                                    <div style={{ color: '#64748B' }}>
                                        Persona boost then applied and renormalized
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PIS / NIS */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '12px', marginBottom: '20px'
                        }}>
                            {[
                                {
                                    label: 'Positive Ideal Solution (PIS)', vals: steps.PIS,
                                    color: '#22C55E', bg: '#DCFCE7',
                                    desc: 'Best value per criterion'
                                },
                                {
                                    label: 'Negative Ideal Solution (NIS)', vals: steps.NIS,
                                    color: '#DC2626', bg: '#FEE2E2',
                                    desc: 'Worst value per criterion'
                                },
                            ].map(({ label, vals, color, bg, desc }) => (
                                <div key={label} style={{
                                    backgroundColor: bg,
                                    borderRadius: '12px', padding: '16px',
                                    border: '1px solid ' + color + '40'
                                }}>
                                    <div style={{
                                        fontSize: '13px', fontWeight: '800',
                                        color, marginBottom: '4px'
                                    }}>{label}</div>
                                    <div style={{
                                        fontSize: '11px', color: '#64748B',
                                        marginBottom: '10px'
                                    }}>{desc}</div>
                                    <div style={{
                                        display: 'flex', gap: '12px',
                                        flexWrap: 'wrap'
                                    }}>
                                        {['Cost', 'Time', 'Comfort', 'Reliability', 'Transfers']
                                            .map((l, i) => (
                                                <div key={l}>
                                                    <div style={{
                                                        fontSize: '10px', color: '#64748B',
                                                        textTransform: 'uppercase'
                                                    }}>{l}</div>
                                                    <div style={{
                                                        fontSize: '14px', fontWeight: '800',
                                                        color
                                                    }}>
                                                        {vals ? (Math.round(vals[i] * 10000) / 10000) : '-'}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Route cards */}
                        <h2 style={{
                            fontSize: '20px', fontWeight: '900', color: '#0F172A',
                            margin: '0 0 16px', letterSpacing: '-0.5px'
                        }}>
                            Modified TOPSIS Ranked Results
                            <span style={{
                                fontSize: '13px', fontWeight: '400',
                                color: '#94A3B8', marginLeft: '10px'
                            }}>
                                {steps.totalCandidates} candidates → top 4
                            </span>
                        </h2>

                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            gap: '16px', marginBottom: '24px'
                        }}>
                            {results.map((route, i) => (
                                <div key={route.id} style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid ' + (i === 0 ? '#22C55E' : '#E2E8F0'),
                                    borderLeft: '4px solid ' + (i === 0 ? '#22C55E' : '#1A56DB'),
                                    padding: '24px',
                                    boxShadow: i === 0
                                        ? '0 4px 16px rgba(34,197,94,0.12)'
                                        : '0 1px 4px rgba(0,0,0,0.06)'
                                }}>

                                    {/* Top row */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'flex-start', flexWrap: 'wrap',
                                        gap: '12px', marginBottom: '16px'
                                    }}>
                                        <div>
                                            <div style={{
                                                display: 'flex', alignItems: 'center',
                                                gap: '8px', marginBottom: '8px'
                                            }}>
                                                <span style={{
                                                    backgroundColor: i === 0 ? '#DCFCE7' : '#EFF6FF',
                                                    color: i === 0 ? '#16A34A' : '#1A56DB',
                                                    fontSize: '11px', fontWeight: '700',
                                                    padding: '3px 10px', borderRadius: '999px'
                                                }}>
                                                    #{route.rank} {route.label}
                                                </span>
                                            </div>
                                            {/* Stop path */}
                                            <div style={{
                                                display: 'flex', alignItems: 'center',
                                                gap: '6px', flexWrap: 'wrap'
                                            }}>
                                                {route.stopNames.map((stop, si) => (
                                                    <span key={si} style={{
                                                        display: 'flex',
                                                        alignItems: 'center', gap: '6px'
                                                    }}>
                                                        <span style={{
                                                            fontSize: '13px', fontWeight: '700',
                                                            color: '#0F172A'
                                                        }}>{stop}</span>
                                                        {si < route.stopNames.length - 1 && (
                                                            <ArrowRight size={12} color="#CBD5E1" />
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* TOPSIS Score */}
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{
                                                fontSize: '10px', color: '#94A3B8',
                                                fontWeight: '700', textTransform: 'uppercase',
                                                letterSpacing: '0.08em', marginBottom: '4px'
                                            }}>
                                                CC Final Score
                                            </div>
                                            <div style={{
                                                fontSize: '32px', fontWeight: '900',
                                                color: i === 0 ? '#22C55E' : '#1A56DB',
                                                letterSpacing: '-1px', lineHeight: 1
                                            }}>
                                                {route.ccFinal.toFixed(4)}
                                            </div>
                                            <div style={{
                                                fontSize: '11px', color: '#94A3B8',
                                                marginTop: '4px'
                                            }}>
                                                (SM1+SM2+SM3) / 3
                                            </div>
                                        </div>
                                    </div>

                                    {/* Leg pills */}
                                    <div style={{
                                        display: 'flex', gap: '8px',
                                        flexWrap: 'wrap', marginBottom: '16px'
                                    }}>
                                        {route.legs.map((leg, li) => (
                                            <div key={li} style={{
                                                display: 'flex',
                                                alignItems: 'center', gap: '6px',
                                                backgroundColor: '#F8FAFC', padding: '7px 12px',
                                                borderRadius: '999px',
                                                border: '1px solid ' + (MODE_COLOR[leg.mode] || '#E2E8F0') + '50',
                                                fontSize: '12px', fontWeight: '600',
                                                color: MODE_COLOR[leg.mode] || '#64748B'
                                            }}>
                                                <ModeIcon mode={leg.mode} size={13} />
                                                {leg.operator}
                                                {leg.serviceNo && leg.serviceNo !== 'null' && (
                                                    <span style={{ color: '#94A3B8', fontWeight: '400' }}>
                                                        #{leg.serviceNo}
                                                    </span>
                                                )}
                                                <span style={{
                                                    color: '#94A3B8', fontWeight: '400',
                                                    fontSize: '11px'
                                                }}>
                                                    ₹{leg.cost} · {leg.time}m
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Criteria grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5,1fr)',
                                        gap: '10px', backgroundColor: '#F8FAFC',
                                        borderRadius: '10px', padding: '14px'
                                    }}>
                                        {[
                                            {
                                                label: 'Total Cost', value: '₹' + route.totalCost,
                                                highlight: true
                                            },
                                            {
                                                label: 'Total Time',
                                                value: Math.floor(route.totalTime / 60) + 'h ' +
                                                    (route.totalTime % 60) + 'm'
                                            },
                                            {
                                                label: 'Comfort',
                                                value: route.avgComfort + '/10'
                                            },
                                            {
                                                label: 'Reliability',
                                                value: (route.avgReliability * 100).toFixed(0) + '%'
                                            },
                                            {
                                                label: 'Transfers',
                                                value: route.transfers
                                            },
                                        ].map(({ label, value, highlight }) => (
                                            <div key={label} style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '10px', color: '#94A3B8',
                                                    fontWeight: '600', textTransform: 'uppercase',
                                                    marginBottom: '4px', letterSpacing: '0.06em'
                                                }}>
                                                    {label}
                                                </div>
                                                <div style={{
                                                    fontSize: '16px', fontWeight: '900',
                                                    color: highlight ? '#0EA5E9' : '#0F172A'
                                                }}>
                                                    {value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Three SM scores */}
                                    <div style={{
                                        marginTop: '14px', display: 'grid',
                                        gridTemplateColumns: 'repeat(3,1fr)', gap: '10px'
                                    }}>
                                        {[
                                            {
                                                label: 'SM₁ (Cosine dot)', cc: route.cc1,
                                                desc: 'Eq. 1 — vector dot product'
                                            },
                                            {
                                                label: 'SM₂ (cos π/2·|d|)', cc: route.cc2,
                                                desc: 'Eq. 2 — denominator 1'
                                            },
                                            {
                                                label: 'SM₃ (cos π/2·|d|/3)', cc: route.cc3,
                                                desc: 'Eq. 3 — denominator 3'
                                            },
                                        ].map(({ label, cc, desc }) => (
                                            <div key={label} style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '8px', padding: '10px 12px',
                                                border: '1px solid #E2E8F0'
                                            }}>
                                                <div style={{
                                                    fontSize: '11px', fontWeight: '700',
                                                    color: '#0F172A', marginBottom: '2px'
                                                }}>{label}</div>
                                                <div style={{
                                                    fontSize: '10px', color: '#94A3B8',
                                                    marginBottom: '8px'
                                                }}>{desc}</div>
                                                {scoreBar(cc)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Decision matrix toggle */}
                        <button onClick={() => setShowMatrix(!showMatrix)}
                            style={{
                                width: '100%', padding: '14px',
                                backgroundColor: '#0F172A', color: '#fff',
                                border: 'none', borderRadius: '12px',
                                fontWeight: '700', fontSize: '14px',
                                cursor: 'pointer', marginBottom: '16px',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '8px'
                            }}>
                            <GitBranch size={16} />
                            {showMatrix ? '▲ Hide' : '▼ Show'} Full Decision Matrix
                            — All {steps.totalCandidates} Candidates Evaluated
                        </button>

                        {showMatrix && (
                            <div style={{
                                backgroundColor: '#0F172A', borderRadius: '16px',
                                padding: '24px', overflowX: 'auto'
                            }}>
                                <div style={{
                                    color: '#94A3B8', fontSize: '12px',
                                    fontWeight: '700', textTransform: 'uppercase',
                                    letterSpacing: '0.08em', marginBottom: '16px'
                                }}>
                                    Normalized Weighted Decision Matrix ·
                                    Persona: {persona.toUpperCase()} ·
                                    {steps.totalCandidates} Routes Evaluated
                                </div>
                                <table style={{
                                    width: '100%', borderCollapse: 'collapse',
                                    fontSize: '12px', color: '#E2E8F0'
                                }}>
                                    <thead>
                                        <tr>
                                            {['#', 'Route Stops', 'Cost ₹', 'Time min',
                                                'Comfort', 'Reliability', 'Transfers',
                                                'SM₁ CC', 'SM₂ CC', 'SM₃ CC', 'CC Final'
                                            ].map(h => (
                                                <th key={h} style={{
                                                    padding: '10px 10px',
                                                    backgroundColor: '#1E293B', textAlign: 'left',
                                                    fontWeight: '700', color: '#94A3B8',
                                                    fontSize: '10px', whiteSpace: 'nowrap',
                                                    textTransform: 'uppercase', letterSpacing: '0.06em'
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {steps.allScored
                                            .slice()
                                            .sort((a, b) => b.ccFinal - a.ccFinal)
                                            .map((row, i) => (
                                                <tr key={row.id} style={{
                                                    backgroundColor: i < 4
                                                        ? (i === 0 ? '#052e16' : '#1E293B')
                                                        : 'transparent',
                                                    borderTop: '1px solid #1E293B'
                                                }}>
                                                    <td style={{
                                                        padding: '8px 10px',
                                                        fontWeight: '700',
                                                        color: i === 0 ? '#22C55E' : '#64748B'
                                                    }}>
                                                        {i + 1}
                                                    </td>
                                                    <td style={{
                                                        padding: '8px 10px',
                                                        fontSize: '11px', color: '#94A3B8',
                                                        maxWidth: '180px'
                                                    }}>
                                                        {row.stops.join(' → ')}
                                                    </td>
                                                    <td style={{ padding: '8px 10px' }}>
                                                        ₹{row.totalCost}
                                                    </td>
                                                    <td style={{ padding: '8px 10px' }}>
                                                        {row.totalTime}
                                                    </td>
                                                    <td style={{ padding: '8px 10px' }}>
                                                        {/* comfort from rawValues index 2 */}
                                                        —
                                                    </td>
                                                    <td style={{ padding: '8px 10px' }}>—</td>
                                                    <td style={{ padding: '8px 10px' }}>—</td>
                                                    <td style={{
                                                        padding: '8px 10px',
                                                        color: '#0EA5E9', fontWeight: '700'
                                                    }}>
                                                        {row.cc1}
                                                    </td>
                                                    <td style={{
                                                        padding: '8px 10px',
                                                        color: '#0EA5E9', fontWeight: '700'
                                                    }}>
                                                        {row.cc2}
                                                    </td>
                                                    <td style={{
                                                        padding: '8px 10px',
                                                        color: '#0EA5E9', fontWeight: '700'
                                                    }}>
                                                        {row.cc3}
                                                    </td>
                                                    <td style={{
                                                        padding: '8px 10px',
                                                        fontWeight: '900', fontSize: '14px',
                                                        color: i === 0 ? '#22C55E' : '#60A5FA'
                                                    }}>
                                                        {row.ccFinal}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <div style={{
                                    marginTop: '14px', fontSize: '11px',
                                    color: '#475569', lineHeight: '1.6'
                                }}>
                                    Note: CC = Closeness Coefficient from Paper Eq.5.
                                    Higher CC = closer to ideal solution = better rank.
                                    Highlighted rows = top 4 shown to user.
                                    All {steps.totalCandidates} candidates were mathematically evaluated.
                                </div>
                            </div>
                        )}

                        {/* Try in app button */}
                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button onClick={() => navigate('/search')}
                                style={{
                                    backgroundColor: '#1A56DB', color: '#fff',
                                    padding: '16px 40px', borderRadius: '12px',
                                    fontWeight: '700', fontSize: '15px', border: 'none',
                                    cursor: 'pointer', display: 'inline-flex',
                                    alignItems: 'center', gap: '8px',
                                    boxShadow: '0 4px 16px rgba(26,86,219,0.3)'
                                }}>
                                See These Results in the App
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
