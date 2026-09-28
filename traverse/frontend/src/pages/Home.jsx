import { useNavigate } from 'react-router-dom'
import {
    MapPin, Navigation, Calendar, Clock,
    Car, Train, Bus, Landmark, Zap,
    Search, SlidersHorizontal, Ticket,
    Route, Shield, ArrowRight, PlayCircle
} from 'lucide-react'

function Home() {
    const navigate = useNavigate()

    const modes = [
        { icon: Car, label: 'Cab', sub: 'First/Last Mile' },
        { icon: Train, label: 'Train', sub: 'IRCTC Express' },
        { icon: Bus, label: 'Bus', sub: 'Intercity Volvo' },
        { icon: Landmark, label: 'Metro', sub: 'Urban Rapid' },
        { icon: Zap, label: 'Auto', sub: 'Local Shuttle' },
    ]

    const steps = [
        {
            icon: Search, step: '1', title: 'Enter Your Journey',
            desc: 'Tell us where you are starting and where you want to go.'
        },
        {
            icon: SlidersHorizontal, step: '2',
            title: 'Compare and Customise',
            desc: 'See complete journey options and swap any leg instantly.'
        },
        {
            icon: Ticket, step: '3', title: 'Book and Travel',
            desc: 'Pay once, get all your tickets, travel confidently.'
        },
    ]

    const features = [
        {
            icon: Route, title: 'Every Mode in One Place',
            desc: 'Stop switching between IRCTC, RedBus, Ola and Google Maps. Traverse connects them all.'
        },
        {
            icon: SlidersHorizontal, title: 'Customise Every Leg',
            desc: 'Change cab to bus, see how total cost and time updates instantly.'
        },
        {
            icon: Shield, title: 'Smart Delay Handling',
            desc: 'If your train is late, Traverse finds your alternative before you even worry.'
        },
    ]

    return (
        <div className="min-h-screen bg-white">

            {/* HERO */}
            <section className="w-full bg-white py-24 px-6 
      flex flex-col items-center text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 
          px-4 py-2 rounded-full bg-blue-50 text-blue-600 
          text-sm font-semibold mb-8">
                        <Zap size={14} />
                        India's first complete journey planner
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold 
          text-[#0F172A] leading-tight tracking-tight mb-6">
                        Plan Your Complete<br />
                        Journey, Your Way
                    </h1>

                    <p className="text-lg md:text-xl text-[#64748B] 
          max-w-2xl mx-auto mb-10 leading-relaxed">
                        From your doorstep to your destination — cab,
                        train, bus, metro — every leg planned, compared
                        and booked in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center 
          justify-center gap-4">
                        <button
                            onClick={() => navigate('/search')}
                            className="flex items-center gap-2 bg-[#1A56DB] 
              text-white px-8 py-4 rounded-xl font-semibold 
              text-base hover:bg-blue-700 transition-all 
              shadow-lg shadow-blue-200 w-full sm:w-auto 
              justify-center"
                        >
                            Plan a Journey <ArrowRight size={18} />
                        </button>
                        <button className="flex items-center gap-2 
            border border-gray-200 text-[#0F172A] px-8 py-4 
            rounded-xl font-semibold text-base hover:bg-gray-50 
            transition-all w-full sm:w-auto justify-center">
                            <PlayCircle size={18} className="text-[#1A56DB]" />
                            How It Works
                        </button>
                    </div>

                    <p className="text-sm text-[#64748B] mt-6">
                        Trusted by students at JUIT and growing
                    </p>
                </div>
            </section>

            {/* TRANSPORT MODES */}
            <section className="w-full bg-[#F8FAFC] py-10 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-5 gap-4">
                        {modes.map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="bg-white rounded-xl 
              px-4 py-4 shadow-sm border border-gray-100 
              flex flex-col items-center gap-2 
              hover:-translate-y-1 transition-transform">
                                <div className="w-10 h-10 rounded-lg 
                bg-blue-50 flex items-center justify-center">
                                    <Icon size={22} className="text-[#1A56DB]" />
                                </div>
                                <span className="text-sm font-semibold 
                text-[#0F172A]">{label}</span>
                                <span className="text-xs text-[#64748B] 
                text-center">{sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEARCH CARD */}
            <section className="w-full bg-white py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg 
          border border-gray-100 p-10">
                        <div className="flex items-center justify-between 
            mb-8">
                            <h2 className="text-2xl font-bold text-[#0F172A]">
                                Where do you want to go?
                            </h2>
                            <span className="text-xs font-semibold 
              text-[#0EA5E9] bg-blue-50 px-3 py-1 rounded-full">
                                Multi-Modal
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 
            gap-4 mb-6">
                            {[
                                {
                                    icon: MapPin, label: 'FROM',
                                    placeholder: 'JUIT Waknaghat',
                                    color: 'text-[#1A56DB]'
                                },
                                {
                                    icon: Navigation, label: 'TO',
                                    placeholder: 'Where are you going?',
                                    color: 'text-[#0EA5E9]'
                                },
                                {
                                    icon: Calendar, label: 'DATE',
                                    placeholder: '', type: 'date',
                                    color: 'text-[#1A56DB]'
                                },
                                {
                                    icon: Clock, label: 'DEPARTURE TIME',
                                    placeholder: '', type: 'time',
                                    color: 'text-[#1A56DB]'
                                },
                            ].map(({ icon: Icon, label, placeholder,
                                type, color }) => (
                                <div key={label} className="flex items-center 
                gap-3 border border-gray-200 rounded-xl px-4 
                py-4 focus-within:border-[#1A56DB] 
                focus-within:ring-2 focus-within:ring-blue-50 
                transition-all bg-[#F8FAFC]">
                                    <Icon size={18} className={color} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-[#64748B] 
                    font-semibold uppercase tracking-wide mb-1">
                                            {label}
                                        </div>
                                        <input
                                            type={type || 'text'}
                                            placeholder={placeholder}
                                            className="w-full text-[#0F172A] font-medium 
                      outline-none bg-transparent text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mb-8 
            flex-wrap">
                            <span className="text-sm text-[#64748B] font-medium">
                                Preference:
                            </span>
                            {['Cheapest', 'Fastest', 'Comfortable'].map(
                                (pref, i) => (
                                    <button key={pref} className={`px-4 py-2 
                rounded-full text-sm font-semibold border 
                transition-all ${i === 0
                                            ? 'bg-[#1A56DB] text-white border-[#1A56DB]'
                                            : 'text-[#64748B] border-gray-200 hover:border-[#1A56DB] hover:text-[#1A56DB]'
                                        }`}>
                                        {pref}
                                    </button>
                                ))}
                        </div>

                        <button
                            onClick={() => navigate('/search')}
                            className="w-full bg-[#1A56DB] text-white py-4 
              rounded-xl font-semibold text-base hover:bg-blue-700 
              transition-all flex items-center justify-center 
              gap-2 shadow-lg shadow-blue-200"
                        >
                            Find Journeys <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="w-full bg-[#F8FAFC] py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
                        How Traverse Works
                    </h2>
                    <p className="text-[#64748B] text-lg mb-14">
                        Three simple steps to your perfect journey
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map(({ icon: Icon, step, title, desc }) => (
                            <div key={step} className="bg-white rounded-2xl 
              p-8 shadow-sm border border-gray-100 text-left 
              hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-[#1A56DB] 
                text-white rounded-full flex items-center 
                justify-center font-bold text-base mb-6">
                                    {step}
                                </div>
                                <Icon size={28} className="text-[#0EA5E9] mb-4" />
                                <h3 className="text-lg font-bold text-[#0F172A] 
                mb-3">{title}</h3>
                                <p className="text-[#64748B] leading-relaxed 
                text-sm">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY TRAVERSE */}
            <section className="w-full bg-white py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
                        Why students choose Traverse
                    </h2>
                    <p className="text-[#64748B] text-lg mb-14">
                        Built specifically for Indian college students
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-[#F8FAFC] 
              rounded-2xl p-8 border border-gray-100 text-left 
              hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl 
                flex items-center justify-center mb-5">
                                    <Icon size={24} className="text-[#1A56DB]" />
                                </div>
                                <h3 className="text-lg font-bold text-[#0F172A] 
                mb-3">{title}</h3>
                                <p className="text-[#64748B] leading-relaxed 
                text-sm">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#0F172A] py-12 px-6">
                <div className="max-w-5xl mx-auto flex flex-col 
        md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <MapPin size={20} className="text-[#0EA5E9]" />
                        <span className="text-white font-bold text-xl">
                            TRAVERSE
                        </span>
                        <span className="text-[#64748B] text-sm ml-2">
                            One Journey. Every Mode.
                        </span>
                    </div>
                    <div className="text-[#64748B] text-sm">
                        © 2024 Traverse. Built for students, by students.
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Home