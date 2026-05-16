import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/api.js';

export default function LoginPage() {
  const [redirecting, setRedirecting] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const suspended = urlParams.get('error') === 'suspended';

  function continueWithGoogle() {
    setRedirecting(true);
    window.location.href = `${API_URL}/api/auth/google`;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-stone-950 px-4">
      {/* Bg glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-orange-600/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up" style={{ opacity: 0 }}>
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-3xl">☕</span>
            <span className="font-display italic">Fuel My Chai</span>
          </Link>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-stone-900/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 px-8 py-6 text-center border-b border-white/6">
            <h1 className="font-display text-3xl text-white">
              Create your <span className="shimmer-text italic">chai page</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              In 5 minutes, your supporters can start sending chai ☕
            </p>
          </div>

          <div className="p-8">
            {suspended && (
              <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm leading-6 text-red-300">
                Your account has been suspended. Email hello@fuelmychai.com with subject 'Account Appeal' to request a review.
              </div>
            )}

            <button
              className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white px-6 py-4 font-semibold text-stone-900 transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={redirecting}
              onClick={continueWithGoogle}
              type="button"
            >
              <span className="flex items-center justify-center gap-3">
                {!redirecting && (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {redirecting ? (
                  <span className="flex items-center gap-2">
                    <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecting to Google...
                  </span>
                ) : (
                  'Continue with Google'
                )}
              </span>
            </button>

            <div className="mt-6 space-y-2 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
              {['Create your page instantly', 'Zero platform fees — ever', 'UPI payments go directly to you'].map((p) => (
                <div key={p} className="flex items-center gap-2 text-xs text-white/50">
                  <svg className="size-3.5 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  {p}
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-white/25">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-white/40 underline hover:text-white">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-white/40 underline hover:text-white">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/30">
          Already have a page?{' '}
          <Link to="/login" className="text-amber-400 hover:underline">Sign in above</Link>
        </p>
      </div>
    </div>
  );
}
