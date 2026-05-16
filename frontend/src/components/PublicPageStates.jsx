import { Link } from 'react-router-dom';

export function DefaultAvatar({ name }) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl font-bold text-stone-950 shadow-lg ring-2 ring-amber-400/20 sm:mx-0">
      {initial}
    </div>
  );
}

export function PublicNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center">
      <span className="text-6xl">☕</span>
      <h1 className="mt-6 font-display text-3xl text-white">Page not found</h1>
      <p className="mt-3 text-white/40">This chai page doesn't exist. Maybe the creator hasn't signed up yet?</p>
      <Link to="/" className="btn-primary mt-8 px-8 py-3">
        Create your own page
      </Link>
    </div>
  );
}

export function PublicPageNotReady({ name }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center">
      <span className="text-6xl animate-pulse">☕</span>
      <h1 className="mt-6 font-display text-3xl text-white">
        {name ? `${name}'s page` : 'This page'} is brewing...
      </h1>
      <p className="mt-3 text-white/40">
        {name ? `${name} hasn't` : "This creator hasn't"} set up their chai page yet. Check back soon!
      </p>
      <Link to="/" className="btn-ghost mt-8 px-8 py-3">
        ← Back to home
      </Link>
    </div>
  );
}
