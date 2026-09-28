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

            {/* HERO SECTION */}
            <section className="w-full pt-10 pb-8 md:pt-14 md:pb-10 flex flex-col items-center justify-center px-4">
                <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

                    {/* Small Pill Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[#0EA5E9] text-xs font-medium mb-5 shadow-xs">
                        <Sparkles size={13} className="text-[#0EA5E9]" />
                        <span>India&apos;s first complete journey planner</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.2] mb-4">
                        Plan Your Complete <br />
                        <span className="text-[#1A56DB]">Journey, Your Way</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-xl text-sm sm:text-base text-[#64748B] font-normal leading-relaxed mb-7">
                        From your doorstep to your destination — cab, train, bus, metro — every leg<br className="hidden sm:inline" />
                        planned, compared and booked in one place.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center justify-center gap-3.5 mb-6">
                        <button
                            onClick={() => {
                                const searchCard = document.getElementById('search-card')
                                if (searchCard) searchCard.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="inline-flex items-center justify-center gap-1.5 bg-[#1A56DB] hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
                        >
                            <span>Plan a Journey</span>
                            <ArrowRight size={15} />
                        </button>

                        <button
                            onClick={scrollToHowItWorks}
                            className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 active:scale-95 text-[#0F172A] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 shadow-xs transition-all"
                        >
                            <Play size={13} className="fill-[#1A56DB] text-[#1A56DB]" />
                            <span>Watch How It Works</span>
                        </button>
                    </div>

                    {/* Trust Indicator */}
                    <div className="inline-flex items-center gap-2 text-xs text-[#64748B]">
                        <div className="flex -space-x-1.5 overflow-hidden items-center">
                            <div className="w-5 h-5 rounded-full bg-[#1A56DB] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">JU</div>
                            <div className="w-5 h-5 rounded-full bg-[#0EA5E9] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">IT</div>
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">PK</div>
                        </div>
                        <span className="font-medium text-[#0F172A]">Trusted by students at JUIT and growing</span>
                        <CheckCircle2 size={13} className="text-[#0EA5E9]" />
                    </div>

                </div>
            </section>

            {/* MAIN CONTENT CONTAINER */}
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-20 flex flex-col items-center">

                {/* TRANSPORT MODES STRIP */}
                <div className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl p-2.5 mb-6 shadow-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                        {transportModes.map((mode) => {
                            const IconComponent = mode.icon
                            return (
                                <div
                                    key={mode.title}
                                    className="bg-white rounded-xl py-2.5 px-3 border border-slate-100/90 shadow-2xs hover:shadow-xs hover:border-blue-200 transition-all flex items-center gap-2.5"
                                >
                                    <div className="text-[#1A56DB] shrink-0">
                                        <IconComponent size={18} />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <div className="text-xs font-bold text-[#0F172A] leading-none truncate mb-1">
                                            {mode.title}
                                        </div>
                                        <div className="text-[10px] text-[#64748B] leading-none truncate">
                                            {mode.subtitle}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* SEARCH CARD */}
                <div id="search-card" className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-8">

                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1A56DB]" />
                            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                                Where do you want to go?
                            </h2>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-medium text-[#1A56DB]">
                            <Sparkles size={12} className="text-[#0EA5E9]" />
                            <span>Multi-Modal Engine Active</span>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">

                        {/* ROW 1: ORIGIN & DESTINATION WITH SWAP */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2.5 items-center">

                            {/* FROM Input Box */}
                            <div className="bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3 transition-all">
                                <label className="block text-[10px] font-bold text-[#1A56DB] uppercase tracking-wider mb-1">
                                    FROM
                                </label>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-[#1A56DB] shrink-0" />
                                    <input
                                        type="text"
                                        value={fromLocation}
                                        onChange={(e) => setFromLocation(e.target.value)}
                                        placeholder="JUIT Waknaghat"
                                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
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
                                    className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-[#1A56DB] hover:text-[#1A56DB] text-slate-400 flex items-center justify-center shadow-xs transition-transform active:rotate-180 duration-200"
                                >
                                    <ArrowLeftRight size={13} />
                                </button>
                            </div>

                            {/* TO Input Box */}
                            <div className="bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3 transition-all">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    TO
                                </label>
                                <div className="flex items-center gap-2">
                                    <Navigation size={16} className="text-[#0EA5E9] shrink-0" />
                                    <input
                                        type="text"
                                        value={toLocation}
                                        onChange={(e) => setToLocation(e.target.value)}
                                        placeholder="Where are you going? (e.g. Kashmere Gate ISBT, Delhi)"
                                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                        </div>

                        {/* ROW 2: DATE & TIME */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* DATE Input Box */}
                            <div className="bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3 transition-all relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    DATE
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-[#1A56DB] shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium text-[#0F172A]">
                                            {formatDateDisplay(departureDate)}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400" />
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
                            <div className="bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 focus-within:border-[#1A56DB] focus-within:bg-white rounded-xl p-3 transition-all relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    DEPARTURE TIME
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-[#1A56DB] shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium text-[#0F172A]">
                                            {formatTimeDisplay(departureTime)}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400" />
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

                        {/* Optional Return Leg Input */}
                        {hasReturnLeg && (
                            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 transition-all relative">
                                <label className="block text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider mb-1">
                                    RETURN DATE
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-[#0EA5E9] shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium text-[#0F172A]">
                                            {returnDate ? formatDateDisplay(returnDate) : 'Select return date'}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </div>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                        )}

                        {/* ROW 3: PREFERENCE PILLS & RETURN LEG */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">

                            {/* Preference Pills */}
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-medium">Preference:</span>
                                <div className="inline-flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setPreference('cheapest')}
                                        className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1 text-xs ${
                                            preference === 'cheapest'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        <Tag size={12} />
                                        <span>Cheapest</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPreference('fastest')}
                                        className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1 text-xs ${
                                            preference === 'fastest'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        <Zap size={12} />
                                        <span>Fastest</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPreference('comfortable')}
                                        className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1 text-xs ${
                                            preference === 'comfortable'
                                                ? 'bg-[#1A56DB] text-white shadow-xs'
                                                : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        <Star size={12} />
                                        <span>Comfortable</span>
                                    </button>
                                </div>
                            </div>

                            {/* Add Return Leg */}
                            <button
                                type="button"
                                onClick={() => setHasReturnLeg(!hasReturnLeg)}
                                className="text-xs font-medium text-[#1A56DB] hover:underline self-start sm:self-auto"
                            >
                                {hasReturnLeg ? '✕ Remove Return Leg' : '+ Add Return Leg'}
                            </button>

                        </div>

                        {/* FULL WIDTH FIND JOURNEYS BUTTON */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                className="w-full bg-[#1A56DB] hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} />
                                <span>Find Journeys</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>

                    </form>

                </div>

                {/* HOW IT WORKS SECTION */}
                <section id="how-it-works" className="w-full mt-20 pt-10 border-t border-slate-100 text-center flex flex-col items-center">
                    
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                        How Traverse Works
                    </h2>
                    <p className="max-w-md text-xs sm:text-sm text-[#64748B] mb-10">
                        Three simple steps from your campus hostel to anywhere across India.
                    </p>

                    {/* 3 Step Cards */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 text-left">

                        {/* Step 1 */}
                        <div className="bg-[#F8FAFC] rounded-xl p-6 border border-slate-100 shadow-2xs hover:shadow-xs transition-all relative">
                            <div className="inline-block bg-[#1A56DB] text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-4">
                                Step 1
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#1A56DB] flex items-center justify-center mb-3">
                                <Search size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">
                                Enter Your Journey
                            </h3>
                            <p className="text-xs text-[#64748B] leading-relaxed">
                                Enter your starting point, destination, and departure time. We compute all multimodal transit combinations.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-[#F8FAFC] rounded-xl p-6 border border-slate-100 shadow-2xs hover:shadow-xs transition-all relative">
                            <div className="inline-block bg-[#0EA5E9] text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-4">
                                Step 2
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#0EA5E9] flex items-center justify-center mb-3">
                                <SlidersHorizontal size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">
                                Compare and Customise
                            </h3>
                            <p className="text-xs text-[#64748B] leading-relaxed">
                                Compare routes by cost, duration, and convenience. Swap intermediate cab, train, or bus legs in one click.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-[#F8FAFC] rounded-xl p-6 border border-slate-100 shadow-2xs hover:shadow-xs transition-all relative">
                            <div className="inline-block bg-[#22C55E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-4">
                                Step 3
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-3">
                                <Ticket size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">
                                Book and Travel
                            </h3>
                            <p className="text-xs text-[#64748B] leading-relaxed">
                                Get one unified pass with live connection buffers, step-by-step guidance, and shared campus cab splits.
                            </p>
                        </div>

                    </div>
                </section>

                {/* CAMPUS COMMUNITY BANNER */}
                <div className="w-full mt-14 bg-gradient-to-r from-blue-900 via-[#1A56DB] to-[#0EA5E9] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold mb-2">
                            <Shield size={12} />
                            <span>Campus-Verified Network</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1">
                            Traveling with campus friends?
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-100 max-w-md">
                            Find fellow students traveling on the same route and split taxi costs between Waknaghat, Kalka, and Chandigarh.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="bg-white hover:bg-slate-50 text-[#1A56DB] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm whitespace-nowrap transition-all"
                    >
                        Explore Shared Cabs
                    </button>
                </div>

            </div>

        </div>
    )
}

export default Home