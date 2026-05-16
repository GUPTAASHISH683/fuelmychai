import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'border-b border-white/8 bg-stone-950/90 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-white transition hover:text-amber-400"
        >
          <span className="text-2xl">☕</span>
          <span className="font-display italic">Fuel My Chai</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {isHome && (
            <>
              <a href="#how-it-works" className="text-sm font-medium text-white/60 transition hover:text-white">
                How it works
              </a>
              <a href="#features" className="text-sm font-medium text-white/60 transition hover:text-white">
                Features
              </a>
              <a href="#roadmap" className="text-sm font-medium text-white/60 transition hover:text-white">
                Roadmap
              </a>
            </>
          )}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {!loading && (
            user ? (
              <Link
                to="/dashboard"
                className="btn-primary px-5 py-2.5 text-sm"
              >
                Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/60 transition hover:text-white">
                  Sign in
                </Link>
                <Link to="/login" className="btn-primary px-5 py-2.5 text-sm">
                  Get Started Free
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/8 bg-stone-950/95 backdrop-blur-md px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {isHome && (
              <>
                <a href="#how-it-works" className="text-white/60 transition hover:text-white">How it works</a>
                <a href="#features" className="text-white/60 transition hover:text-white">Features</a>
                <a href="#roadmap" className="text-white/60 transition hover:text-white">Roadmap</a>
              </>
            )}
            <hr className="border-white/10" />
            {user ? (
              <Link to="/dashboard" className="btn-primary w-full justify-center">
                Dashboard →
              </Link>
            ) : (
              <Link to="/login" className="btn-primary w-full justify-center">
                Get Started Free
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
