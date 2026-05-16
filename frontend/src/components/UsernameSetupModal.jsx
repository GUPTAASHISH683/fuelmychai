import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { api, getApiErrorMessage } from '../utils/api.js';
import { looksProblematic } from '../utils/usernameGuard.js';

const usernameRegex = /^[a-z0-9_-]{3,30}$/;

export default function UsernameSetupModal() {
  const { refreshUser, setUser, user } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [ageChecked, setAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = usernameRegex.test(username);
  const usernameWarning = username && looksProblematic(username);
  const needsAgeConfirmation = user?.age_confirmed === false;

  async function handleAgeContinue(event) {
    event.preventDefault();
    setError('');
    if (!ageChecked || !termsChecked) return;

    setSubmitting(true);
    try {
      await api.post('/api/user/confirm-age');
      await refreshUser();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Could not save confirmation'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!isValid) { setError('Choose a valid username before claiming your page.'); return; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-stone-900 shadow-2xl" style={{ opacity: 0 }}>
        <div className="border-b border-white/8 bg-gradient-to-r from-amber-400/10 to-transparent px-8 py-6">
          <span className="text-3xl">☕</span>
          <h2 className="mt-2 font-display text-2xl text-white">
            {needsAgeConfirmation ? 'Before you continue' : 'Claim your page'}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {needsAgeConfirmation
              ? 'A quick confirmation before setting up your chai page.'
              : 'This is your permanent public URL. Choose wisely!'}
          </p>
        </div>

        <div className="p-8">
          {needsAgeConfirmation ? (
            <form className="space-y-5" onSubmit={handleAgeContinue}>
              <label className="flex items-start gap-3 rounded-xl border border-white/8 bg-stone-800/50 p-4 text-sm leading-6 text-white/60">
                <input
                  checked={ageChecked}
                  className="mt-1 accent-amber-400"
                  onChange={(event) => setAgeChecked(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  I confirm I am 18 years of age or older, or I have verifiable parental consent to use this platform and receive UPI payments.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-white/8 bg-stone-800/50 p-4 text-sm leading-6 text-white/60">
                <input
                  checked={termsChecked}
                  className="mt-1 accent-amber-400"
                  onChange={(event) => setTermsChecked(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  I agree to the{' '}
                  <Link className="text-amber-400 underline" to="/terms">Terms of Service</Link>
                  {' '}and{' '}
                  <Link className="text-amber-400 underline" to="/privacy">Privacy Policy</Link>.
                </span>
              </label>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                className="btn-primary w-full justify-center py-3.5 text-sm font-bold"
                disabled={submitting || !ageChecked || !termsChecked}
                type="submit"
              >
                {submitting ? 'Saving...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="label-dark" htmlFor="username">Your username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">fuelmychai.in/</span>
                  <input
                    id="username"
                    className="input-dark pl-32"
                    maxLength={30}
                    minLength={3}
                    onChange={handleChange}
                    placeholder="yourname"
                    value={username}
                    autoFocus
                  />
                </div>
                <ul className="mt-3 space-y-1 text-xs text-white/30">
                  <li className={`flex items-center gap-1.5 ${username.length >= 3 && username.length <= 30 ? 'text-green-400' : ''}`}>
                    {username.length >= 3 ? '✓' : '○'} 3-30 characters
                  </li>
                  <li className={`flex items-center gap-1.5 ${username && /^[a-z0-9_-]+$/.test(username) ? 'text-green-400' : ''}`}>
                    {username && /^[a-z0-9_-]+$/.test(username) ? '✓' : '○'} Lowercase letters, numbers, hyphens, underscores only
                  </li>
                </ul>
                {usernameWarning && (
                  <p className="mt-3 text-xs font-medium text-red-400">
                    This username is not available.
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                className="btn-primary w-full justify-center py-3.5 text-sm font-bold"
                disabled={submitting || !isValid}
                type="submit"
              >
                {submitting ? 'Claiming your page...' : '☕ Claim my chai page'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
