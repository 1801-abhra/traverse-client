import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GitFork, Menu, X, User } from 'lucide-react'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { label: 'Explore', path: '/' },
        { label: 'How It Works', path: '#how-it-works' },
        { label: 'For Students', path: '/for-students' },
        { label: 'About', path: '/about' },
    ]

    const handleNavClick = (path) => {
        setMenuOpen(false)
        if (path.startsWith('#')) {
            const el = document.getElementById(path.substring(1))
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return (
        <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
            <div className="traverse-container">
                <div className="flex items-center justify-between h-[68px]">

                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group text-decoration-none">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB] shadow-2xs group-hover:scale-105 transition-transform">
                            <GitFork className="rotate-90 stroke-[2.5]" size={19} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-black text-[#0F172A] tracking-tight font-heading">
                                TRAVERSE
                            </span>
                        </div>
                    </Link>

                    {/* Center: Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isAnchor = link.path.startsWith('#')
                            const isActive = !isAnchor && location.pathname === link.path

                            if (isAnchor) {
                                return (
                                    <a
                                        key={link.label}
                                        href={link.path}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleNavClick(link.path)
                                        }}
                                        className="text-[13px] font-semibold text-slate-600 hover:text-[#1A56DB] transition-colors py-1 cursor-pointer"
                                    >
                                        {link.label}
                                    </a>
                                )
                            }

                            return (
                                <Link
                                    key={link.label}
                                    to={link.path}
                                    className={`text-[13px] font-semibold transition-colors py-1 ${
                                        isActive
                                            ? 'text-[#1A56DB]'
                                            : 'text-slate-600 hover:text-[#1A56DB]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                        <Link to="/algorithm" style={{ color: '#DC2626', fontWeight: '700' }} className="text-[13px] py-1 transition-opacity hover:opacity-80">
                            Algorithm Demo
                        </Link>
                    </nav>

                    {/* Right: Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="border-[1.5px] border-[#1A56DB] text-[#1A56DB] bg-transparent hover:bg-blue-50/60 text-[13px] font-semibold px-4 py-2 rounded-lg transition-all active:scale-95"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-[#1A56DB] hover:bg-[#1442B0] text-white! text-[13px] font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/profile"
                            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                            title="My Profile"
                        >
                            <User size={16} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                </div>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.path}
                            className="text-sm font-semibold text-slate-700 hover:text-[#1A56DB] py-2 border-b border-slate-50"
                            onClick={(e) => {
                                if (link.path.startsWith('#')) {
                                    e.preventDefault()
                                }
                                handleNavClick(link.path)
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        to="/algorithm"
                        style={{ color: '#DC2626', fontWeight: '700' }}
                        className="text-sm py-2 border-b border-slate-50"
                        onClick={() => setMenuOpen(false)}
                    >
                        Algorithm Demo
                    </Link>
                    <div className="flex items-center gap-3 pt-3">
                        <Link
                            to="/login"
                            className="text-sm font-semibold text-slate-700 w-1/2 text-center py-2.5 rounded-lg border border-slate-200"
                            onClick={() => setMenuOpen(false)}
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm font-semibold bg-[#1A56DB] text-white w-1/2 text-center py-2.5 rounded-lg shadow-xs"
                            onClick={() => setMenuOpen(false)}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar