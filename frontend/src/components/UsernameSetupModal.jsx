import { useState } from 'react';

import { useAuth } from '../context/AuthContext.jsx';
import { api, getApiErrorMessage } from '../utils/api.js';

const usernameRegex = /^[a-z0-9_-]{3,30}$/;

export default function UsernameSetupModal() {
  const { refreshUser, setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = usernameRegex.test(username);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isValid) {
      setError('Choose a valid username before claiming your page.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/api/user/username', { username });
      setUser(response.data.user);
      await refreshUser();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Could not claim this username'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(event) {
    setUsername(event.target.value.toLowerCase().trim());
    setError('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Claim your creator page
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Choose your username
        </h2>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="username">
              Choose your username
            </label>
            <input
              id="username"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-amber-500 transition focus:border-amber-500 focus:ring-2"
              maxLength={30}
              minLength={3}
              onChange={handleChange}
              placeholder="your_name"
              value={username}
            />
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>Lowercase letters, numbers, hyphens, underscores only</li>
              <li>3-30 characters</li>
              <li>No spaces or special characters</li>
            </ul>
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <button
            className="w-full rounded-md bg-amber-700 px-4 py-2.5 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={submitting || !isValid}
            type="submit"
          >
            {submitting ? 'Claiming...' : 'Claim my page'}
          </button>
        </form>
      </section>
    </div>
  );
}
