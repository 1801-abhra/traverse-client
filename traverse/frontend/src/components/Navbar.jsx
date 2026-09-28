import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MapPin, Menu, X } from 'lucide-react'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { label: 'Explore', path: '/' },
        { label: 'How It Works', path: '/how-it-works' },
        { label: 'For Students', path: '/for-students' },
        { label: 'About', path: '/about' },
    ]

    return (
        <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <MapPin className="text-[#1A56DB]" size={22} />
                        <span className="text-xl font-bold text-[#1A56DB] tracking-tight">
                            TRAVERSE
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={`text-sm font-medium transition-colors duration-200 ${location.pathname === link.path
                                        ? 'text-[#1A56DB]'
                                        : 'text-[#64748B] hover:text-[#1A56DB]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-[#1A56DB] 
              hover:text-blue-700 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm font-medium bg-[#1A56DB] 
              text-white px-4 py-2 rounded-lg hover:bg-blue-700 
              transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-[#64748B]"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 
        px-4 py-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.path}
                            className="text-sm font-medium text-[#64748B] 
              hover:text-[#1A56DB]"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-2 pt-2 border-t 
          border-gray-100">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-[#1A56DB] 
              text-center py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm font-medium bg-[#1A56DB] 
              text-white text-center py-2 rounded-lg"
                            onClick={() => setMenuOpen(false)}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar