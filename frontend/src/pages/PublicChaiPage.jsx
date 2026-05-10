import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DefaultAvatar, PublicNotFound, PublicPageNotReady } from '../components/PublicPageStates.jsx';
import { usePublicMeta } from '../hooks/usePublicMeta.js';
import { api, getApiErrorMessage } from '../utils/api.js';

const defaultAmounts = [30, 50, 100];

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
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

  const mobile = useMemo(() => isMobileDevice(), []);
  const amounts = Array.isArray(creator?.chai_amounts) ? creator.chai_amounts : defaultAmounts;
  const finalAmount = customAmount ? normalizeAmount(customAmount) : selectedAmount;
  const validAmount = normalizeAmount(finalAmount);
  usePublicMeta(creator, username);

  const upiLink = useMemo(() => {
    if (!creator?.upi_id || !validAmount) {
      return '';
    }

    const params = [
      `pa=${encodeUpiValue(creator.upi_id)}`,
      `pn=${encodeUpiValue(creator.name)}`,
      `am=${encodeUpiValue(String(validAmount))}`,
      `cu=${encodeUpiValue('INR')}`,
      `tn=${encodeUpiValue(message)}`
    ];

    return `upi://pay?${params.join('&')}`;
  }, [creator?.name, creator?.upi_id, message, validAmount]);

  useEffect(() => {
    fetchCreator();
  }, [username]);

  useEffect(() => {
    if (!amounts.length || selectedAmount !== null) {
      return;
    }

    setSelectedAmount(normalizeAmount(amounts[0]));
  }, [amounts, selectedAmount]);

  useEffect(() => {
    let active = true;
    setQrError('');

    if (!upiLink) {
      setQrCode('');
      return;
    }

    QRCode.toDataURL(upiLink, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 280
    })
      .then((dataUrl) => {
        if (active) {
          setQrCode(dataUrl);
        }
      })
      .catch(() => {
        if (active) {
          setQrCode('');
          setQrError('Could not generate QR code.');
        }
      });

    return () => {
      active = false;
    };
  }, [upiLink]);

  async function fetchCreator() {
    setLoading(true);
    setErrorState('');

    try {
      const response = await api.get(`/api/public/${username}`);
      setCreator(response.data.creator);
    } catch (error) {
      if (error?.response?.status === 404) {
        setErrorState('not-found');
      } else {
        setErrorState(getApiErrorMessage(error, 'Could not load this chai page'));
      }
    } finally {
      setLoading(false);
    }
  }

  function choosePreset(amount) {
    setSelectedAmount(amount);
    setCustomAmount('');
  }

  function updateCustomAmount(value) {
    const digitsOnly = value.replace(/\D/g, '');
    setCustomAmount(digitsOnly);
    setSelectedAmount(null);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-6 text-slate-700">
        Loading chai page...
      </main>
    );
  }

  if (errorState === 'not-found') {
    return <PublicNotFound />;
  }

  if (errorState) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-6 text-center font-medium text-red-600">
        {errorState}
      </main>
    );
  }

  if (!creator?.upi_id) {
    return <PublicPageNotReady name={creator?.name} />;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <section className="text-center sm:text-left">
            {creator.profile_image ? (
              <img
                alt={creator.name}
                className="mx-auto size-28 rounded-full object-cover sm:mx-0"
                src={creator.profile_image}
              />
            ) : (
              <div className="sm:[&>div]:mx-0">
                <DefaultAvatar name={creator.name} />
              </div>
            )}

            <h1 className="mt-5 text-4xl font-bold leading-tight">
              Buy {creator.name} a Chai ☕
            </h1>
            {creator.bio ? (
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">{creator.bio}</p>
            ) : null}
          </section>

          <section className="mt-8 space-y-6 rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-bold">Choose an amount</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {amounts.map((amount, index) => (
                  <button
                    className={`rounded-md border px-4 py-2 font-semibold transition ${
                      selectedAmount === amount && !customAmount
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-500'
                    }`}
                    key={`${amount}-${index}`}
                    onClick={() => choosePreset(normalizeAmount(amount))}
                    type="button"
                  >
                    Rs. {amount}
                  </button>
                ))}
              </div>
              <input
                className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-amber-500 transition focus:border-amber-500 focus:ring-2 sm:max-w-xs"
                inputMode="numeric"
                maxLength={5}
                onChange={(event) => updateCustomAmount(event.target.value)}
                placeholder="Custom amount"
                value={customAmount}
              />
              {customAmount && !validAmount ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  Enter a whole amount from Rs. 1 to Rs. 10,000.
                </p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="message">
                Leave a message (optional)
              </label>
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-amber-500 transition focus:border-amber-500 focus:ring-2"
                id="message"
                maxLength={100}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Thanks for the work you do"
                value={message}
              />
            </div>
          </section>
        </div>

        <aside className="rounded-lg border border-amber-200 bg-white p-5 text-center shadow-sm">
          <h2 className="text-xl font-bold">Pay with UPI</h2>
          <div className="mt-5 flex min-h-[280px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4">
            {qrCode ? (
              <img alt="UPI payment QR code" className="size-64" src={qrCode} />
            ) : validAmount ? (
              <p className="text-sm font-medium text-red-600">{qrError || 'Preparing QR code...'}</p>
            ) : (
              <p className="text-sm text-slate-600">Choose an amount to generate a QR code.</p>
            )}
          </div>

          {mobile ? (
            <a
              className={`mt-5 inline-flex w-full justify-center rounded-md px-4 py-3 font-semibold text-white transition ${
                upiLink ? 'bg-amber-700 hover:bg-amber-800' : 'pointer-events-none bg-slate-300'
              }`}
              href={upiLink || undefined}
            >
              Pay with UPI
            </a>
          ) : (
            <p className="mt-5 text-sm leading-6 text-slate-700">
              On a computer? Scan the QR code with your phone's camera to pay via
              GPay, PhonePe, or Paytm.
            </p>
          )}

          <p className="mt-5 break-all text-xs text-slate-500">{creator.upi_id}</p>
        </aside>
      </section>

      <footer className="mx-auto mt-8 max-w-5xl border-t border-amber-200 pt-5 text-sm leading-6 text-slate-700">
        Payments go directly to the creator's UPI ID. This platform does not process
        or verify transactions. Please verify the creator's UPI ID before paying. We
        are not responsible for incorrect UPI IDs or failed transactions.
      </footer>
    </main>
  );
}
