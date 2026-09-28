import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MapPin,
    Navigation,
    Calendar,
    Clock,
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
    Users
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
        { icon: Bus, title: 'Bus', subtitle: 'Intercity / Volvo' },
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
        <div className="min-h-screen bg-white text-[#0F172A] flex flex-col items-center">

            {/* 1. HERO SECTION (80px padding top & bottom) */}
            <section className="w-full py-20 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50/20 to-white">
                <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

                    {/* Small Pill Tag (24px bottom margin) */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1A56DB] text-xs font-medium mb-6 shadow-xs">
                        <Sparkles size={14} className="text-[#0EA5E9]" />
                        <span>India&apos;s first complete journey planner</span>
                    </div>

                    {/* Main Headline (24px bottom margin, #0F172A dark) */}
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.2] mb-6">
                        Plan Your Complete <br />
                        Journey, Your Way
                    </h1>

                    {/* Subtitle (24px bottom margin) */}
                    <p className="max-w-xl text-base text-[#64748B] font-normal leading-relaxed mb-6">
                        From your doorstep to your destination — cab, train, bus, metro — every leg<br className="hidden sm:inline" />
                        planned, compared and booked in one place.
                    </p>

                    {/* Action Buttons (24px bottom margin) */}
                    <div className="flex flex-row items-center justify-center gap-4 mb-6">
                        <button
                            onClick={() => {
                                const searchCard = document.getElementById('search-card')
                                if (searchCard) searchCard.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="inline-flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm transition-all"
                        >
                            <span>Plan a Journey</span>
                            <ArrowRight size={16} />
                        </button>

                        <button
                            onClick={scrollToHowItWorks}
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-[#0F172A] text-sm font-medium px-5 py-3 rounded-lg border border-slate-200 shadow-xs transition-all"
                        >
                            <Play size={14} className="fill-[#1A56DB] text-[#1A56DB]" />
                            <span>How It Works</span>
                        </button>
                    </div>

                    {/* Trust Indicator */}
                    <div className="inline-flex items-center gap-2.5 text-xs text-[#64748B]">
                        <div className="flex -space-x-1.5 overflow-hidden items-center">
                            <div className="w-5 h-5 rounded-full bg-[#1A56DB] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">JU</div>
                            <div className="w-5 h-5 rounded-full bg-[#0EA5E9] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">IT</div>
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">PK</div>
                        </div>
                        <span className="font-medium text-[#0F172A]">Trusted by students at JUIT and growing</span>
                        <CheckCircle2 size={14} className="text-[#0EA5E9]" />
                    </div>

                </div>
            </section>

            {/* 2. TRANSPORT MODES STRIP (80px padding top & bottom, 32px gap between icons) */}
            <section className="w-full py-20 bg-[#F8FAFC] border-y border-slate-100 flex flex-col items-center">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
                        {transportModes.map((mode) => {
                            const IconComponent = mode.icon
                            return (
                                <div
                                    key={mode.title}
                                    className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3.5"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1A56DB] flex items-center justify-center shrink-0">
                                        <IconComponent size={20} />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <div className="text-sm font-bold text-[#0F172A] leading-tight truncate mb-1">
                                            {mode.title}
                                        </div>
                                        <div className="text-[11px] text-[#64748B] leading-tight truncate">
                                            {mode.subtitle}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* 3. SEARCH CARD SECTION (80px padding top & bottom, 40px inside padding) */}
            <section className="w-full py-20 flex flex-col items-center px-4 sm:px-6 bg-white">
                <div id="search-card" className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl p-10">

                    {/* Card Header (No bullet point, 24px bottom margin) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 mb-6">
                        <h2 className="text-xl font-bold text-[#0F172A]">
                            Where do you want to go?
                        </h2>
                        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-[#1A56DB]">
                            <Sparkles size={13} className="text-[#0EA5E9]" />
                            <span>Multi-Modal Engine Active</span>
                        </div>
                    </div>

                    <form onSubmit={handleSearch}>

                        {/* ROW 1: ORIGIN & DESTINATION WITH SWAP (24px bottom margin) */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">

                            {/* FROM Input Box */}
                            <div className="bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3.5 transition-all">
                                <label className="block text-[10px] font-bold text-[#1A56DB] uppercase tracking-wider mb-1.5">
                                    FROM
                                </label>
                                <div className="flex items-center gap-2.5">
                                    <MapPin size={18} className="text-[#1A56DB] shrink-0" />
                                    <input
                                        type="text"
                                        value={fromLocation}
                                        onChange={(e) => setFromLocation(e.target.value)}
                                        placeholder="JUIT Waknaghat"
                                        className="w-full bg-transparent text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* SWAP BUTTON */}
                            <div className="flex justify-center -my-1 md:my-0">
                                <button
                                    type="button"
                                    onClick={handleSwapLocations}
                                    title="Swap Origin & Destination"
                                    className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#1A56DB] hover:text-[#1A56DB] text-slate-400 flex items-center justify-center shadow-xs transition-transform active:rotate-180 duration-200"
                                >
                                    <ArrowLeftRight size={15} />
                                </button>
                            </div>

                            {/* TO Input Box */}
                            <div className="bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3.5 transition-all">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                    TO
                                </label>
                                <div className="flex items-center gap-2.5">
                                    <Navigation size={18} className="text-[#0EA5E9] shrink-0" />
                                    <input
                                        type="text"
                                        value={toLocation}
                                        onChange={(e) => setToLocation(e.target.value)}
                                        placeholder="Where are you going? (e.g. Kashmere Gate ISBT, Delhi)"
                                        className="w-full bg-transparent text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                        </div>

                        {/* ROW 2: DATE & TIME (24px bottom margin) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                            {/* DATE Input Box */}
                            <div className="bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3.5 transition-all relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                    DATE
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Calendar size={18} className="text-[#1A56DB] shrink-0" />
                                        <span className="text-sm font-medium text-[#0F172A]">
                                            {formatDateDisplay(departureDate)}
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className="text-slate-400" />
                                </div>
                                <input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    required
                                />
                            </div>

                            {/* DEPARTURE TIME Input Box */}
                            <div className="bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3.5 transition-all relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                    DEPARTURE TIME
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Clock size={18} className="text-[#1A56DB] shrink-0" />
                                        <span className="text-sm font-medium text-[#0F172A]">
                                            {formatTimeDisplay(departureTime)}
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className="text-slate-400" />
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

                        {/* Optional Return Leg Input (24px bottom margin if shown) */}
                        {hasReturnLeg && (
                            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3.5 mb-6 transition-all relative">
                                <label className="block text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider mb-1.5">
                                    RETURN DATE
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Calendar size={18} className="text-[#0EA5E9] shrink-0" />
                                        <span className="text-sm font-medium text-[#0F172A]">
                                            {returnDate ? formatDateDisplay(returnDate) : 'Select return date'}
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className="text-slate-400" />
                                </div>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                        )}

                        {/* ROW 3: PREFERENCE PILLS & RETURN LEG (24px bottom margin) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs mb-6">

                            {/* Preference Pills */}
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 font-medium">Preference:</span>
                                <div className="inline-flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPreference('cheapest')}
                                        className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 text-xs ${
                                            preference === 'cheapest'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        <Tag size={13} />
                                        <span>Cheapest</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPreference('fastest')}
                                        className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 text-xs ${
                                            preference === 'fastest'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        <Zap size={13} />
                                        <span>Fastest</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPreference('comfortable')}
                                        className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 text-xs ${
                                            preference === 'comfortable'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        <Star size={13} />
                                        <span>Comfortable</span>
                                    </button>
                                </div>
                            </div>

                            {/* Add Return Leg */}
                            <button
                                type="button"
                                onClick={() => setHasReturnLeg(!hasReturnLeg)}
                                className="text-xs font-semibold text-[#1A56DB] hover:underline self-start sm:self-auto"
                            >
                                {hasReturnLeg ? '✕ Remove Return Leg' : '+ Add Return Leg'}
                            </button>

                        </div>

                        {/* FULL WIDTH FIND JOURNEYS BUTTON */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-[#1A56DB] hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-base py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} />
                                <span>Find Journeys</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>

                    </form>

                </div>
            </section>

            {/* 4. HOW IT WORKS SECTION (80px padding top & bottom, 60px inside steps) */}
            <section id="how-it-works" className="w-full py-20 bg-[#F8FAFC] border-t border-slate-100 flex flex-col items-center">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
                        How Traverse Works
                    </h2>
                    <p className="max-w-lg text-sm sm:text-base text-[#64748B] mb-12">
                        Three simple steps from your campus hostel to anywhere across India.
                    </p>

                    {/* 3 Step Cards (60px top and bottom padding) */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl py-[60px] px-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
                            <div className="inline-block bg-[#1A56DB] text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-6 self-start">
                                Step 1
                            </div>
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A56DB] flex items-center justify-center mb-6">
                                    <Search size={24} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-3">
                                    Enter Your Journey
                                </h3>
                                <p className="text-sm text-[#64748B] leading-relaxed">
                                    Enter your starting point, destination, and departure time. We compute all multimodal transit combinations.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl py-[60px] px-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
                            <div className="inline-block bg-[#0EA5E9] text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-6 self-start">
                                Step 2
                            </div>
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center mb-6">
                                    <SlidersHorizontal size={24} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-3">
                                    Compare and Customise
                                </h3>
                                <p className="text-sm text-[#64748B] leading-relaxed">
                                    Compare routes by cost, duration, and convenience. Swap intermediate cab, train, or bus legs in one click.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl py-[60px] px-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
                            <div className="inline-block bg-[#22C55E] text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-6 self-start">
                                Step 3
                            </div>
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center mb-6">
                                    <Ticket size={24} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-3">
                                    Book and Travel
                                </h3>
                                <p className="text-sm text-[#64748B] leading-relaxed">
                                    Get one unified pass with live connection buffers, step-by-step guidance, and shared campus cab splits.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. CAMPUS COMMUNITY / WHY TRAVERSE (80px padding top & bottom, 40px inside padding) */}
            <section className="w-full py-20 bg-white flex flex-col items-center px-4 sm:px-6">
                <div className="w-full max-w-5xl bg-gradient-to-r from-blue-900 via-[#1A56DB] to-[#0EA5E9] rounded-2xl p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-4">
                            <Shield size={14} />
                            <span>Campus-Verified Network</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-3">
                            Traveling with campus friends?
                        </h3>
                        <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
                            Find fellow students traveling on the same route and split taxi costs between Waknaghat, Kalka, and Chandigarh.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="bg-white hover:bg-slate-50 text-[#1A56DB] text-sm font-bold px-6 py-3.5 rounded-lg shadow-sm whitespace-nowrap transition-all shrink-0"
                    >
                        Explore Shared Cabs
                    </button>
                </div>
            </section>

        </div>
    )
}

export default Home