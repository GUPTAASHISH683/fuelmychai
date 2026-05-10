import { useState } from 'react';

import { API_URL } from '../utils/api.js';

export default function LoginPage() {
  const [redirecting, setRedirecting] = useState(false);

  function continueWithGoogle() {
    setRedirecting(true);
    window.location.href = `${API_URL}/api/auth/google`;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-6 py-10 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Fuel My Chai
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Create your UPI support page in minutes.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Sign in with Google to claim your public chai page. Payments always go
            directly to your UPI app.
          </p>
        </div>

        <button
          className="w-fit rounded-md bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          disabled={redirecting}
          onClick={continueWithGoogle}
          type="button"
        >
          {redirecting ? 'Redirecting...' : 'Continue with Google'}
        </button>
      </section>
    </main>
  );
}
