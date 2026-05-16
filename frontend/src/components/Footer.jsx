import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="text-2xl">☕</span>
              <span className="font-display italic">Fuel My Chai</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/40">
              The simplest UPI support page for Indian creators. Zero fees. Direct payments.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-amber-400/40 hover:text-amber-400"
                aria-label="Twitter"
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-amber-400/40 hover:text-amber-400"
                aria-label="Instagram"
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-400/80">Product</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/login" className="text-sm text-white/40 transition hover:text-white">Get started</Link></li>
              <li><a href="/#how-it-works" className="text-sm text-white/40 transition hover:text-white">How it works</a></li>
              <li><a href="/#features" className="text-sm text-white/40 transition hover:text-white">Features</a></li>
              <li><a href="/#roadmap" className="text-sm text-white/40 transition hover:text-white">Roadmap</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-400/80">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/privacy" className="text-sm text-white/40 transition hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white/40 transition hover:text-white">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-sm text-white/40 transition hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-400/80">Connect</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="mailto:hello@fuelmychai.com" className="text-sm text-white/40 transition hover:text-white">
                  hello@fuelmychai.com
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-white/40 transition hover:text-white">
                  Send us a message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            © {year} Fuel My Chai. Made with ☕ in India.
          </p>
          <p className="text-xs text-white/20">
            Payments go directly to creators. We do not process or hold funds.
          </p>
        </div>
      </div>
    </footer>
  );
}
