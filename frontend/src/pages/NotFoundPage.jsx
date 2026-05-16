import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/6 blur-3xl" />
      </div>
      <div className="relative animate-fade-up" style={{ opacity: 0 }}>
        <span className="block text-8xl animate-float">☕</span>
        <h1 className="mt-6 font-display text-6xl text-white">404</h1>
        <p className="mt-3 text-xl text-white/50">This chai spilled somewhere...</p>
        <p className="mt-2 text-sm text-white/30">The page you're looking for doesn't exist.</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-primary px-8 py-3">
            Go home
          </Link>
          <Link to="/login" className="btn-ghost px-8 py-3">
            Create your page
          </Link>
        </div>
      </div>
    </div>
  );
}
