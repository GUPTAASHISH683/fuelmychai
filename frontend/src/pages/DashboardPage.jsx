import { Copy, ImageUp, LogOut, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import UsernameSetupModal from '../components/UsernameSetupModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, getApiErrorMessage, PUBLIC_BASE_URL } from '../utils/api.js';

const defaultAmounts = [30, 50, 100];
const blankStatus = { type: '', message: '' };

function getPublicPageUrl(username) {
  if (!username) {
    return '';
  }

  return `${PUBLIC_BASE_URL.replace(/\/$/, '')}/${username}`;
}

function normalizeAmount(value) {
  const amount = Number(value);
  return Number.isInteger(amount) && amount >= 1 && amount <= 10000 ? amount : null;
}

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [pageError, setPageError] = useState('');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amounts, setAmounts] = useState(defaultAmounts);
  const [newAmount, setNewAmount] = useState('');

  const [profileStatus, setProfileStatus] = useState(blankStatus);
  const [upiStatus, setUpiStatus] = useState(blankStatus);
  const [amountStatus, setAmountStatus] = useState(blankStatus);
  const [avatarStatus, setAvatarStatus] = useState(blankStatus);
  const [copyStatus, setCopyStatus] = useState('');
  const [saving, setSaving] = useState({
    profile: false,
    upi: false,
    amounts: false,
    avatar: false
  });

  const publicUrl = useMemo(() => getPublicPageUrl(profile?.username), [profile?.username]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user?.username]);

  async function fetchProfile() {
    setLoadingProfile(true);
    setPageError('');

    try {
      const response = await api.get('/api/user/me');
      hydrateProfile(response.data.user);
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Could not load your dashboard'));
    } finally {
      setLoadingProfile(false);
    }
  }

  function hydrateProfile(nextProfile) {
    setProfile(nextProfile);
    setName(nextProfile.name || '');
    setBio(nextProfile.bio || '');
    setUpiId(nextProfile.upi_id || '');
    setAmounts(Array.isArray(nextProfile.chai_amounts) ? nextProfile.chai_amounts : defaultAmounts);
  }

  async function saveProfile(event) {
    event.preventDefault();
    setProfileStatus(blankStatus);

    if (!name.trim() || name.trim().length > 50) {
      setProfileStatus({
        type: 'error',
        message: 'Display name is required and must be 50 characters or fewer.'
      });
      return;
    }

    if (bio.length > 200) {
      setProfileStatus({ type: 'error', message: 'Bio must be 200 characters or fewer.' });
      return;
    }

    await saveProfilePatch('profile', setProfileStatus, {
      name,
      bio
    });
  }

  async function saveUpi(event) {
    event.preventDefault();
    setUpiStatus(blankStatus);

    if (!upiId.trim() || !upiId.includes('@')) {
      setUpiStatus({ type: 'error', message: 'Enter a valid UPI ID that contains @.' });
      return;
    }

    await saveProfilePatch('upi', setUpiStatus, {
      upi_id: upiId
    });
  }

  async function saveAmounts(event) {
    event.preventDefault();
    setAmountStatus(blankStatus);

    if (amounts.some((amount) => normalizeAmount(amount) === null)) {
      setAmountStatus({
        type: 'error',
        message: 'Each chai amount must be a whole number from ₹1 to ₹10,000.'
      });
      return;
    }

    await saveProfilePatch('amounts', setAmountStatus, {
      chai_amounts: amounts
    });
  }

  async function saveProfilePatch(section, setStatus, payload) {
    setSaving((current) => ({ ...current, [section]: true }));

    try {
      const response = await api.patch('/api/user/profile', payload);
      hydrateProfile(response.data.user);
      setStatus({ type: 'success', message: 'Saved.' });
    } catch (error) {
      setStatus({ type: 'error', message: getApiErrorMessage(error, 'Could not save changes') });
    } finally {
      setSaving((current) => ({ ...current, [section]: false }));
    }
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    setAvatarStatus(blankStatus);

    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setAvatarStatus({ type: 'error', message: 'Profile image must be JPG or PNG.' });
      event.target.value = '';
      return;
    }

    if (file.size > 1024 * 1024) {
      setAvatarStatus({ type: 'error', message: 'Profile image must be 1MB or smaller.' });
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    setSaving((current) => ({ ...current, avatar: true }));

    try {
      const response = await api.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      hydrateProfile(response.data.user);
      setAvatarStatus({ type: 'success', message: 'Profile image updated.' });
    } catch (error) {
      setAvatarStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Image upload failed. Other sections can still be saved.')
      });
    } finally {
      event.target.value = '';
      setSaving((current) => ({ ...current, avatar: false }));
    }
  }

  function addAmount() {
    const amount = normalizeAmount(newAmount);

    if (amount === null) {
      setAmountStatus({
        type: 'error',
        message: 'Add a whole number from ₹1 to ₹10,000.'
      });
      return;
    }

    setAmounts((current) => [...current, amount]);
    setNewAmount('');
    setAmountStatus(blankStatus);
  }

  function removeAmount(indexToRemove) {
    setAmounts((current) => current.filter((_, index) => index !== indexToRemove));
    setAmountStatus(blankStatus);
  }

  async function copyLink() {
    setCopyStatus('');

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyStatus('Copied!');
    } catch (error) {
      setCopyStatus('Could not copy link.');
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      {!user?.username ? <UsernameSetupModal /> : null}

      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-amber-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              Fuel My Chai
            </p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
          </div>

          <button
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
            onClick={logout}
            type="button"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {loadingProfile ? (
          <p className="py-10 text-slate-700">Loading your dashboard...</p>
        ) : pageError ? (
          <p className="py-10 font-medium text-red-600">{pageError}</p>
        ) : profile ? (
          <div className="grid gap-6 py-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <ProfileSection
                avatarStatus={avatarStatus}
                bio={bio}
                name={name}
                onBioChange={setBio}
                onNameChange={setName}
                onSave={saveProfile}
                onUploadAvatar={uploadAvatar}
                profile={profile}
                profileStatus={profileStatus}
                savingAvatar={saving.avatar}
                savingProfile={saving.profile}
              />
              <UpiSection
                onSave={saveUpi}
                onUpiChange={setUpiId}
                saving={saving.upi}
                status={upiStatus}
                upiId={upiId}
              />
              <AmountsSection
                amounts={amounts}
                newAmount={newAmount}
                onAddAmount={addAmount}
                onNewAmountChange={setNewAmount}
                onRemoveAmount={removeAmount}
                onSave={saveAmounts}
                saving={saving.amounts}
                status={amountStatus}
              />
            </div>

            <div className="space-y-6">
              <ShareSection
                copyStatus={copyStatus}
                onCopy={copyLink}
                publicUrl={publicUrl}
              />
              <AnalyticsSection visitCount={profile.visit_count || 0} />
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function ProfileSection({
  avatarStatus,
  bio,
  name,
  onBioChange,
  onNameChange,
  onSave,
  onUploadAvatar,
  profile,
  profileStatus,
  savingAvatar,
  savingProfile
}) {
  return (
    <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Profile</h2>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <div className="flex flex-col items-start gap-3">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-amber-100 text-2xl font-bold text-amber-800">
            {profile.profile_image ? (
              <img
                alt={profile.name}
                className="h-full w-full object-cover"
                src={profile.profile_image}
              />
            ) : (
              <span>{profile.name?.charAt(0)?.toUpperCase() || 'C'}</span>
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-950">
            <ImageUp size={16} />
            {savingAvatar ? 'Uploading...' : 'Upload image'}
            <input
              accept="image/jpeg,image/png"
              className="sr-only"
              disabled={savingAvatar}
              onChange={onUploadAvatar}
              type="file"
            />
          </label>
          <StatusMessage status={avatarStatus} />
        </div>

        <form className="min-w-0 flex-1 space-y-4" onSubmit={onSave}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="name">
              Display name
            </label>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-amber-500 transition focus:border-amber-500 focus:ring-2"
              id="name"
              maxLength={50}
              onChange={(event) => onNameChange(event.target.value)}
              value={name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="bio">
              Bio
            </label>
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-300 px-3 py-2 outline-none ring-amber-500 transition focus:border-amber-500 focus:ring-2"
              id="bio"
              maxLength={200}
              onChange={(event) => onBioChange(event.target.value)}
              value={bio}
            />
            <p className="mt-1 text-sm text-slate-500">{bio.length}/200</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="w-fit rounded-md bg-amber-700 px-4 py-2 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={savingProfile}
              type="submit"
            >
              {savingProfile ? 'Saving...' : 'Save profile'}
            </button>
            <StatusMessage status={profileStatus} />
          </div>
        </form>
      </div>
    </section>
  );
}

function UpiSection({ onSave, onUpiChange, saving, status, upiId }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">UPI ID</h2>

      <form className="mt-5 space-y-4" onSubmit={onSave}>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="upi">
            UPI ID
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-amber-500 transition focus:border-amber-500 focus:ring-2"
            id="upi"
            onChange={(event) => onUpiChange(event.target.value)}
            placeholder="name@bank"
            value={upiId}
          />
          <p className="mt-3 text-sm leading-6 text-amber-800">
            Please double-check your UPI ID. Payments go directly to your UPI app.
            We are not responsible for incorrect or inactive UPI IDs. Lost payments
            cannot be recovered.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="w-fit rounded-md bg-amber-700 px-4 py-2 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={saving}
            type="submit"
          >
            {saving ? 'Saving...' : 'Save UPI ID'}
          </button>
          <StatusMessage status={status} />
        </div>
      </form>
    </section>
  );
}

function AmountsSection({
  amounts,
  newAmount,
  onAddAmount,
  onNewAmountChange,
  onRemoveAmount,
  onSave,
  saving,
  status
}) {
  return (
    <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Chai Amounts</h2>

      <form className="mt-5 space-y-4" onSubmit={onSave}>
        <div className="flex flex-wrap gap-2">
          {amounts.map((amount, index) => (
            <div
              className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2"
              key={`${amount}-${index}`}
            >
              <span className="font-semibold text-amber-900">₹{amount}</span>
              <button
                aria-label={`Remove ₹${amount}`}
                className="rounded p-1 text-amber-900 transition hover:bg-amber-100"
                onClick={() => onRemoveAmount(index)}
                type="button"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-amber-500 transition focus:border-amber-500 focus:ring-2 sm:max-w-xs"
            min={1}
            max={10000}
            onChange={(event) => onNewAmountChange(event.target.value)}
            placeholder="Add custom amount"
            type="number"
            value={newAmount}
          />
          <button
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
            onClick={onAddAmount}
            type="button"
          >
            <Plus size={18} />
            Add amount
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="w-fit rounded-md bg-amber-700 px-4 py-2 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={saving}
            type="submit"
          >
            {saving ? 'Saving...' : 'Save amounts'}
          </button>
          <StatusMessage status={status} />
        </div>
      </form>
    </section>
  );
}

function ShareSection({ copyStatus, onCopy, publicUrl }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Share</h2>
      <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {publicUrl}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-950 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
          disabled={!publicUrl}
          onClick={onCopy}
          type="button"
        >
          <Copy size={18} />
          Copy link
        </button>
        {copyStatus ? <p className="text-sm font-medium text-slate-700">{copyStatus}</p> : null}
      </div>
    </section>
  );
}

function AnalyticsSection({ visitCount }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Analytics</h2>
      <p className="mt-5 text-lg text-slate-700">
        Your page has been visited <span className="font-bold text-slate-950">{visitCount}</span>{' '}
        times.
      </p>
    </section>
  );
}

function StatusMessage({ status }) {
  if (!status?.message) {
    return null;
  }

  return (
    <p
      className={`text-sm font-medium ${
        status.type === 'error' ? 'text-red-600' : 'text-green-700'
      }`}
    >
      {status.message}
    </p>
  );
}
