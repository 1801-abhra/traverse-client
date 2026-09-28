import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowRight,
    ArrowLeftRight,
    Car,
    Train,
    Bus,
    Landmark,
    Zap,
    Search,
    SlidersHorizontal,
    Ticket,
    Sparkles,
    CheckCircle2,
    Play,
    Tag,
    Star,
    ChevronDown,
    Shield,
    GitFork,
    Compass
} from 'lucide-react'

function Home() {
    const navigate = useNavigate()

    // Form states
    const [fromLocation, setFromLocation] = useState('JUIT Waknaghat, Solan')
    const [toLocation, setToLocation] = useState('')
    const [departureDate, setDepartureDate] = useState('2026-10-24')
    const [departureTime, setDepartureTime] = useState('08:30')
    const [preference, setPreference] = useState('cheapest') // 'cheapest' | 'fastest' | 'comfortable'
    const [hasReturnLeg, setHasReturnLeg] = useState(false)
    const [returnDate, setReturnDate] = useState('')

    // Format human-readable date
    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return 'Select Date'
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        } catch {
            return dateStr
        }
    }

    // Format human-readable time
    const formatTimeDisplay = (timeStr) => {
        if (!timeStr) return '08:30 AM'
        try {
            const [hours, minutes] = timeStr.split(':')
            const hour = parseInt(hours, 10)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const formattedHour = hour % 12 === 0 ? 12 : hour % 12
            return `${String(formattedHour).padStart(2, '0')}:${minutes} ${ampm}`
        } catch {
            return timeStr
        }
    }

    const transportModes = [
        { icon: Car, title: 'Cab', subtitle: 'First/Last Mile' },
        { icon: Train, title: 'Train', subtitle: 'IRCTC Express' },
        { icon: Bus, title: 'Bus', subtitle: 'Intercity Volvo' },
        { icon: Landmark, title: 'Metro', subtitle: 'Urban Rapid' },
        { icon: Zap, title: 'Auto', subtitle: 'Local Shuttle' },
    ]

    const handleSwapLocations = () => {
        const temp = fromLocation
        setFromLocation(toLocation)
        setToLocation(temp)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const queryParams = new URLSearchParams({
            from: fromLocation || 'JUIT Waknaghat, Solan',
            to: toLocation || 'Kashmere Gate ISBT, Delhi',
            date: departureDate,
            time: departureTime,
            preference: preference,
        })
        navigate(`/search?${queryParams.toString()}`)
    }

    const scrollToHowItWorks = () => {
        const element = document.getElementById('how-it-works')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#FAFCFF] text-[#0F172A] flex flex-col">

            {/* 1. HERO SECTION */}
            <section className="w-full pt-12 pb-10 px-4">
                <div className="traverse-container flex flex-col items-center text-center">

                    {/* Badge */}
                    <div className="traverse-hero-badge">
                        <Sparkles size={14} className="text-[#1A56DB]" />
                        <span>India&apos;s first complete journey planner</span>
                    </div>

                    {/* Headline */}
                    <h1 className="traverse-main-title">
                        Plan Your Complete <br />
                        <span className="traverse-gradient-text">Journey, Your Way</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-xl mx-auto mb-8">
                        From your doorstep to your destination — cab, train, bus, metro — every leg planned, compared and booked in one place.
                    </p>

                    {/* Hero Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-7">
                        <button
                            type="button"
                            onClick={() => {
                                const searchCard = document.getElementById('search-card')
                                if (searchCard) searchCard.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="traverse-btn-primary"
                        >
                            <span>Plan a Journey</span>
                            <ArrowRight size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={scrollToHowItWorks}
                            className="traverse-btn-secondary"
                        >
                            <Play size={13} className="fill-slate-700 text-slate-700" />
                            <span>Watch How It Works</span>
                        </button>
                    </div>

                    {/* Trust Indicator */}
                    <div className="inline-flex items-center gap-2.5 text-xs text-slate-500">
                        <div className="flex -space-x-2 overflow-hidden items-center">
                            <div className="w-6 h-6 rounded-full bg-[#1A56DB] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">JU</div>
                            <div className="w-6 h-6 rounded-full bg-[#0EA5E9] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">AK</div>
                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">PK</div>
                        </div>
                        <span className="font-semibold text-slate-700">Trusted by students at JUIT and growing</span>
                        <CheckCircle2 size={15} className="text-[#0EA5E9]" />
                    </div>

                </div>
            </section>

            {/* 2. TRANSPORT MODES STRIP */}
            <section className="w-full px-4 mb-6">
                <div className="max-w-[880px] mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
                        {transportModes.map((mode) => {
                            const IconComponent = mode.icon
                            return (
                                <div
                                    key={mode.title}
                                    className="bg-slate-50/70 hover:bg-blue-50/40 rounded-xl p-3 border border-slate-100 transition-all flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1A56DB] flex items-center justify-center shrink-0">
                                        <IconComponent size={18} />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                                            {mode.title}
                                        </div>
                                        <div className="text-[10px] text-slate-500 leading-tight truncate mt-0.5">
                                            {mode.subtitle}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* 3. MAIN SEARCH / JOURNEY PLANNER CARD */}
            <section className="w-full px-4 mb-20">
                <div
                    id="search-card"
                    className="max-w-[880px] mx-auto bg-white rounded-3xl border border-slate-200 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] p-6 sm:p-9"
                >

                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#1A56DB]" />
                            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] font-heading">
                                Where do you want to go?
                            </h2>
                        </div>
                        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs font-semibold text-[#0284C7]">
                            <Sparkles size={13} className="text-[#0EA5E9]" />
                            <span>Multi-Modal Engine Active</span>
                        </div>
                    </div>

                    <form onSubmit={handleSearch}>

                        {/* ROW 1: FROM & TO WITH SWAP */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3.5 items-center mb-4">

                            {/* FROM Box */}
                            <div className="traverse-input-box">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]" />
                                    <label className="text-[10px] font-bold text-[#1A56DB] uppercase tracking-wider">
                                        FROM
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={fromLocation}
                                    onChange={(e) => setFromLocation(e.target.value)}
                                    placeholder="JUIT Waknaghat, Solan"
                                    className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* SWAP BUTTON */}
                            <div className="flex justify-center -my-1 md:my-0">
                                <button
                                    type="button"
                                    onClick={handleSwapLocations}
                                    title="Swap Origin & Destination"
                                    className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#1A56DB] hover:text-[#1A56DB] text-slate-400 flex items-center justify-center shadow-xs transition-transform active:rotate-180 duration-200 cursor-pointer"
                                >
                                    <ArrowLeftRight size={14} />
                                </button>
                            </div>

                            {/* TO Box */}
                            <div className="traverse-input-box">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        TO
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={toLocation}
                                    onChange={(e) => setToLocation(e.target.value)}
                                    placeholder="Where are you going? (e.g. Kashmere Gate ISBT, Delhi)"
                                    className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                    required
                                />
                            </div>

                        </div>

                        {/* ROW 2: DATE & DEPARTURE TIME */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">

                            {/* DATE Box */}
                            <div className="traverse-input-box relative">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        DATE
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800">
                                        {formatDateDisplay(departureDate)}
                                    </span>
                                    <ChevronDown size={15} className="text-slate-400" />
                                </div>
                                <input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    required
                                />
                            </div>

                            {/* DEPARTURE TIME Box */}
                            <div className="traverse-input-box relative">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        DEPARTURE TIME
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800">
                                        {formatTimeDisplay(departureTime)}
                                    </span>
                                    <ChevronDown size={15} className="text-slate-400" />
                                </div>
                                <input
                                    type="time"
                                    value={departureTime}
                                    onChange={(e) => setDepartureTime(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    required
                                />
                            </div>

                        </div>

                        {/* Optional Return Leg Box */}
                        {hasReturnLeg && (
                            <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-3.5 px-4 mb-5 transition-all relative animate-in fade-in-50 duration-200">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    <label className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">
                                        RETURN DATE
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800">
                                        {returnDate ? formatDateDisplay(returnDate) : 'Select return date'}
                                    </span>
                                    <ChevronDown size={15} className="text-slate-400" />
                                </div>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                        )}

                        {/* ROW 3: PREFERENCES & ADD RETURN LEG */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs mb-6">

                            {/* Preference Pills */}
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="text-slate-500 text-xs font-semibold">Preference:</span>
                                <div className="inline-flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPreference('cheapest')}
                                        className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 text-xs cursor-pointer ${
                                            preference === 'cheapest'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <Tag size={12} />
                                        <span>Cheapest</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPreference('fastest')}
                                        className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 text-xs cursor-pointer ${
                                            preference === 'fastest'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <Zap size={12} />
                                        <span>Fastest</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPreference('comfortable')}
                                        className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 text-xs cursor-pointer ${
                                            preference === 'comfortable'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <Star size={12} className={preference === 'comfortable' ? 'fill-white' : ''} />
                                        <span>Comfortable</span>
                                    </button>
                                </div>
                            </div>

                            {/* Add Return Leg Toggle */}
                            <button
                                type="button"
                                onClick={() => setHasReturnLeg(!hasReturnLeg)}
                                className="text-xs font-semibold text-[#1A56DB] hover:text-[#1442B0] hover:underline self-start sm:self-auto cursor-pointer"
                            >
                                {hasReturnLeg ? '✕ Remove Return Leg' : '+ Add Return Leg'}
                            </button>

                        </div>

                        {/* FULL WIDTH FIND JOURNEYS BUTTON */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-[#1A56DB] hover:bg-[#1442B0] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                                <Sparkles size={18} />
                                <span>Find Journeys</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>

                    </form>

                </div>
            </section>

            {/* 4. HOW TRAVERSE WORKS SECTION */}
            <section id="how-it-works" className="w-full py-20 bg-white border-t border-slate-200/80">
                <div className="traverse-container text-center flex flex-col items-center">

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3 font-heading">
                        How Traverse Works
                    </h2>
                    <p className="max-w-lg text-sm sm:text-base text-slate-500 mb-14">
                        Three simple steps from your campus hostel to anywhere across India.
                    </p>

                    {/* 3 Step Cards */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

                        {/* Step 1 */}
                        <div className="bg-[#FAFCFF] rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                            <div>
                                <div className="inline-block bg-[#1A56DB] text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-6">
                                    Step 1
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A56DB] flex items-center justify-center mb-6">
                                    <Search size={22} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-2 font-heading">
                                    Enter Your Journey
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                    Enter your starting point, destination, and departure time. We compute all multimodal transit combinations.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-[#FAFCFF] rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between">
                            <div>
                                <div className="inline-block bg-[#0EA5E9] text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-6">
                                    Step 2
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center mb-6">
                                    <SlidersHorizontal size={22} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-2 font-heading">
                                    Compare and Customise
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                    Compare routes by cost, duration, and convenience. Swap intermediate cab, train, or bus legs in one click.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-[#FAFCFF] rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between">
                            <div>
                                <div className="inline-block bg-[#22C55E] text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-6">
                                    Step 3
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center mb-6">
                                    <Ticket size={22} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-2 font-heading">
                                    Book and Travel
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                    Get one unified pass with live connection buffers, step-by-step guidance, and shared campus cab splits.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. CAMPUS COMMUNITY / WHY TRAVERSE */}
            <section className="w-full py-16 bg-[#FAFCFF] px-4">
                <div className="max-w-[880px] mx-auto bg-gradient-to-r from-[#0B2456] via-[#1A56DB] to-[#0284C7] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-3.5 backdrop-blur-xs">
                            <Shield size={13} />
                            <span>Campus-Verified Network</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 font-heading">
                            Traveling with campus friends?
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
                            Find fellow students traveling on the same route and split taxi costs between Waknaghat, Kalka, and Chandigarh.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/search')}
                        className="bg-white hover:bg-slate-50 text-[#1A56DB] text-sm font-bold px-6 py-3.5 rounded-xl shadow-md whitespace-nowrap transition-all shrink-0 cursor-pointer"
                    >
                        Explore Shared Cabs
                    </button>
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="w-full bg-white border-t border-slate-200/80 py-10 px-4">
                <div className="max-w-[880px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1A56DB] flex items-center justify-center">
                            <GitFork className="rotate-90 stroke-[2.5]" size={15} />
                        </div>
                        <span className="font-extrabold text-slate-900 font-heading text-sm">TRAVERSE</span>
                        <span className="text-slate-400">• Built for Students</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#how-it-works" className="hover:text-[#1A56DB] transition-colors font-medium">How It Works</a>
                        <a href="/for-students" className="hover:text-[#1A56DB] transition-colors font-medium">For Students</a>
                        <a href="/about" className="hover:text-[#1A56DB] transition-colors font-medium">About</a>
                    </div>
                    <div className="text-slate-400">
                        © 2026 Traverse Platform.
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Home