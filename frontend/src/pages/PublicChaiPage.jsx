import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DefaultAvatar, PublicNotFound, PublicPageNotReady } from '../components/PublicPageStates.jsx';
import ReportModal from '../components/ReportModal.jsx';
import { usePublicMeta } from '../hooks/usePublicMeta.js';
import { ACCENT_COLORS } from '../utils/accentColors.js';
import { api, getApiErrorMessage } from '../utils/api.js';

const socialPlatformMeta = {
  youtube: { label: 'YouTube', icon: '▶' },
  instagram: { label: 'Instagram', icon: '◉' },
  twitter: { label: 'X (Twitter)', icon: 'X' },
  linkedin: { label: 'LinkedIn', icon: 'in' },
  website: { label: 'Website', icon: '🌐' }
};

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function normalizeAmount(value) {
  const amount = Number(value);
  return Number.isInteger(amount) && amount >= 1 && amount <= 10000 ? amount : null;
}

function encodeUpiValue(value) {
  return encodeURIComponent(value || '');
}

export default function PublicChaiPage() {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrError, setQrError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);

  const mobile = useMemo(() => isMobileDevice(), []);
  const amounts = Array.isArray(creator?.chai_amounts) ? creator.chai_amounts : [30, 50, 100];
  const finalAmount = customAmount ? normalizeAmount(customAmount) : selectedAmount;
  const validAmount = normalizeAmount(finalAmount);
  const activeColor = ACCENT_COLORS[creator?.accent_color] || ACCENT_COLORS.amber;
  const socialLinks = Array.isArray(creator?.social_links) ? creator.social_links : [];
  usePublicMeta(creator, username);

  const upiLink = useMemo(() => {
    if (!creator?.upi_id || !validAmount) return '';
    const params = [
      `pa=${encodeUpiValue(creator.upi_id)}`,
      `pn=${encodeUpiValue(creator.name)}`,
      `am=${encodeUpiValue(String(validAmount))}`,
      `cu=${encodeUpiValue('INR')}`,
      `tn=${encodeUpiValue(message)}`
    ];
    return `upi://pay?${params.join('&')}`;
  }, [creator?.name, creator?.upi_id, message, validAmount]);

  useEffect(() => { fetchCreator(); }, [username]);

  useEffect(() => {
    if (!amounts.length || selectedAmount !== null) return;
    setSelectedAmount(normalizeAmount(amounts[0]));
  }, [amounts, selectedAmount]);

  useEffect(() => {
    let active = true;
    setQrError('');
    if (!upiLink) { setQrCode(''); return; }
    QRCode.toDataURL(upiLink, { errorCorrectionLevel: 'M', margin: 2, width: 280, color: { dark: activeColor.bg, light: '#0D0A06' } })
      .then((dataUrl) => { if (active) setQrCode(dataUrl); })
      .catch(() => { if (active) { setQrCode(''); setQrError('Could not generate QR code.'); } });
    return () => { active = false; };
  }, [activeColor.bg, upiLink]);

  async function fetchCreator() {
    setLoading(true);
    setErrorState('');
    try {
      const response = await api.get(`/api/public/${username}`);
      if (response.data.state === 'hidden') {
        setCreator(null);
        setErrorState('hidden');
        return;
      }
      setCreator(response.data.creator);
    } catch (error) {
      if (error?.response?.status === 404) setErrorState('not-found');
      else setErrorState(getApiErrorMessage(error, 'Could not load this chai page'));
    } finally {
      setLoading(false);
    }
  }

  function choosePreset(amount) {
    setSelectedAmount(amount);
    setCustomAmount('');
  }

  function updateCustomAmount(value) {
    setCustomAmount(value.replace(/\D/g, ''));
    setSelectedAmount(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <div className="text-center">
          <span className="block text-5xl animate-pulse">☕</span>
          <p className="mt-4 text-sm text-white/40">Loading chai page...</p>
        </div>
      </div>
    );
  }

  if (errorState === 'not-found') return <PublicNotFound />;
  if (errorState === 'hidden') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center">
        <span className="text-6xl">☕</span>
        <h1 className="mt-6 font-display text-3xl text-white">This chai page is currently hidden.</h1>
        <p className="mt-3 max-w-md text-white/40">
          The creator may have taken it offline temporarily.
        </p>
        <Link to="/" className="btn-ghost mt-8 px-8 py-3">
          Back to home
        </Link>
      </div>
    );
  }
  if (errorState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 px-6 text-center">
        <p className="font-medium text-red-400">{errorState}</p>
      </div>
    );
  }
  if (!creator?.upi_id) return <PublicPageNotReady name={creator?.name} />;

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Bg glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* ── LEFT: Creator info + amount selector ── */}
          <div>
            {/* Creator header */}
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-5">
              <div className="shrink-0">
                {creator.profile_image ? (
                  <img
                    alt={creator.name}
                    className="size-24 rounded-full object-cover ring-2 ring-amber-400/20 shadow-xl"
                    src={creator.profile_image}
                  />
                ) : (
                  <div className="size-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-stone-950 ring-2 ring-amber-400/20 shadow-xl">
                    {creator.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl leading-tight text-white">
                  Buy {creator.name} a Chai ☕
                </h1>
                {creator.availability_status && creator.availability_status !== 'not_set' && (creator.availability_status !== 'custom' || creator.availability_label) && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white/60">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor:
                          creator.availability_status === 'available'
                            ? '#22C55E'
                            : creator.availability_status === 'busy'
                              ? '#EF4444'
                              : activeColor.bg
                      }}
                    />
                    {creator.availability_status === 'available'
                      ? 'Available for work'
                      : creator.availability_status === 'busy'
                        ? 'Currently at capacity'
                        : creator.availability_label}
                  </div>
                )}
                {creator.bio && (
                  <p className="mt-2 text-base text-white/50 leading-7 max-w-md">{creator.bio}</p>
                )}
                {socialLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {socialLinks.map((link, index) => {
                      const meta = socialPlatformMeta[link.platform] || { label: link.platform, icon: '↗' };
                      return (
                        <a
                          aria-label={meta.label}
                          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-stone-900 text-xs font-bold text-white/40 transition hover:border-amber-400/40 hover:text-amber-400"
                          href={link.url}
                          key={`${link.platform}-${index}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {meta.icon}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Amount + message card */}
            <div className="mt-8 rounded-2xl border border-white/8 bg-stone-900/80 p-6 backdrop-blur-sm">
              <h2 className="font-bold text-white mb-4">Choose an amount</h2>
              <div className="flex flex-wrap gap-2">
                {amounts.map((amount, index) => (
                  <button
                    className={`rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'shadow-lg'
                        : 'border-white/10 bg-stone-800 text-white/60 hover:border-amber-400/40 hover:text-white'
                    }`}
                    key={`${amount}-${index}`}
                    onClick={() => choosePreset(normalizeAmount(amount))}
                    style={selectedAmount === amount && !customAmount ? {
                      backgroundColor: activeColor.bg,
                      borderColor: activeColor.border,
                      color: activeColor.text
                    } : undefined}
                    type="button"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div className="mt-4 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-sm">₹</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-stone-800 pl-8 pr-4 py-3 text-white placeholder-white/25 outline-none transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/15 sm:max-w-xs"
                  inputMode="numeric"
                  maxLength={5}
                  onChange={(e) => updateCustomAmount(e.target.value)}
                  placeholder="Custom amount"
                  value={customAmount}
                />
              </div>
              {customAmount && !validAmount && (
                <p className="mt-2 text-xs text-red-400">Enter a whole amount from ₹1 to ₹10,000.</p>
              )}

              <div className="mt-5">
                <label className="text-sm font-medium text-white/50" htmlFor="message">
                  Leave a message <span className="text-white/25">(optional)</span>
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-stone-800 px-4 py-3 text-white placeholder-white/25 outline-none transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/15"
                  id="message"
                  maxLength={100}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Thanks for the content you create! 🙌"
                  value={message}
                />
                <p className="mt-1 text-right text-xs text-white/20">{message.length}/100</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: QR + Pay ── */}
          <div className="rounded-2xl border bg-stone-900/80 p-6 backdrop-blur-sm text-center" style={{ borderColor: `${activeColor.border}55` }}>
            <h2 className="font-bold text-white">Pay with UPI</h2>

            {/* Selected amount display */}
            {validAmount && (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-4 py-1.5 text-sm font-bold text-amber-400">
                ₹{validAmount.toLocaleString('en-IN')} selected
              </div>
            )}

            {/* QR Box */}
            <div
              className={`mt-5 flex min-h-64 items-center justify-center rounded-2xl border p-4 transition-all ${qrCode ? 'bg-stone-950' : 'border-white/6 bg-stone-800/40'}`}
              style={qrCode ? { borderColor: `${activeColor.border}55` } : undefined}
            >
              {qrCode ? (
                <img
                  alt="UPI payment QR code"
                  className="size-56 rounded-lg"
                  src={qrCode}
                />
              ) : validAmount ? (
                <div className="text-center">
                  <div className="text-3xl animate-pulse">⏳</div>
                  <p className="mt-2 text-xs text-white/30">{qrError || 'Generating QR...'}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl opacity-30">◻</div>
                  <p className="mt-3 text-xs text-white/30">Select an amount to generate your QR code</p>
                </div>
              )}
            </div>

            {/* Pay button (mobile only) */}
            {mobile ? (
              <a
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-base transition-all ${
                  upiLink
                    ? 'shadow-lg active:scale-95'
                    : 'cursor-not-allowed bg-stone-700 text-white/20'
                }`}
                href={upiLink || undefined}
                style={upiLink ? { backgroundColor: activeColor.bg, color: activeColor.text } : undefined}
              >
                {upiLink ? '⚡ Pay with UPI' : 'Select an amount first'}
              </a>
            ) : (
              <p className="mt-5 text-xs leading-6 text-white/35">
                📱 On a computer? Scan the QR code with your phone's camera to pay via GPay, PhonePe, or Paytm.
              </p>
            )}

            {/* UPI ID display */}
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <span className="text-xs text-white/20">UPI:</span>
              <span className="text-xs font-mono text-white/30">{creator.upi_id}</span>
            </div>

            {/* GPay / PhonePe / Paytm logos text */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                <span key={app} className="rounded-full border border-white/6 bg-stone-800 px-2.5 py-1 text-xs text-white/25">{app}</span>
              ))}
            </div>
            {creator.thankyou_message && (
              <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/6 p-4 text-left">
                <p className="text-sm leading-6 text-white/70">☕ "{creator.thankyou_message}"</p>
                <p className="mt-2 text-xs font-semibold text-amber-400">— {creator.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-2xl border border-white/6 bg-stone-900/40 px-6 py-4 text-center">
          <p className="text-xs leading-6 text-white/25">
            Payments go directly to the creator's UPI ID. This platform does not process or verify transactions.
            Please verify the creator's UPI ID before paying. We are not responsible for incorrect UPI IDs or failed transactions.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            className="text-xs text-white/15 underline transition hover:text-white/35"
            onClick={() => setReportOpen(true)}
            type="button"
          >
            Report this page
          </button>
        </div>
      </div>
      {reportOpen && (
        <ReportModal
          onClose={() => setReportOpen(false)}
          username={creator.username}
        />
      )}
    </div>
  );
}
