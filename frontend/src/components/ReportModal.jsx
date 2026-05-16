import { useState } from 'react';

import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';

const reportReasons = [
  {
    label: 'This looks like a fake donation or medical fundraiser',
    value: 'fraud_campaign'
  },
  {
    label: 'This person is pretending to be someone else',
    value: 'impersonation'
  },
  {
    label: 'Inappropriate or harmful content',
    value: 'inappropriate_content'
  },
  {
    label: 'This appears to be spam',
    value: 'spam'
  },
  {
    label: 'This creator appears to be a minor',
    value: 'minor'
  },
  {
    label: 'Other',
    value: 'other'
  }
];

export default function ReportModal({ username, onClose }) {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!reason || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/public/report', {
        reported_username: username,
        reason,
        details,
        reporter_email: user ? undefined : email
      });
      setSubmitted(true);
    } catch (reportError) {
      setError('Could not submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-stone-950 p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center">
            <h2 className="font-display text-2xl text-white">Thank you.</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">
              Our team will review this page.
            </p>
            <button className="btn-primary mt-6 px-6 py-3" onClick={onClose} type="button">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-white">Report this page</h2>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  We take all reports seriously and review within 24 hours.
                </p>
              </div>
              <button
                aria-label="Close report modal"
                className="rounded-full border border-white/10 px-3 py-1 text-white/40 transition hover:border-white/25 hover:text-white"
                onClick={onClose}
                type="button"
              >
                x
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {reportReasons.map((option) => (
                <label
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/8 bg-stone-900/70 p-3 text-sm text-white/65 transition hover:border-amber-400/25 hover:text-white"
                  key={option.value}
                >
                  <input
                    checked={reason === option.value}
                    className="mt-1 accent-amber-400"
                    name="report-reason"
                    onChange={() => setReason(option.value)}
                    type="radio"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <label className="mt-5 block text-sm font-medium text-white/55" htmlFor="report-details">
              Additional details (optional)
            </label>
            <textarea
              className="mt-2 min-h-24 w-full resize-none rounded-xl border border-white/10 bg-stone-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/15"
              id="report-details"
              maxLength={500}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Add any context that can help our review team."
              value={details}
            />
            <p className="mt-1 text-right text-xs text-white/25">{details.length}/500</p>

            {!user && (
              <>
                <label className="mt-4 block text-sm font-medium text-white/55" htmlFor="report-email">
                  Your email (optional)
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/15"
                  id="report-email"
                  maxLength={100}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              </>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              className="btn-primary mt-6 w-full justify-center py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!reason || submitting}
              type="submit"
            >
              {submitting ? 'Submitting...' : 'Submit report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
