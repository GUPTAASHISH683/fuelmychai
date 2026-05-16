import { Copy, ImageUp, LogOut, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import UsernameSetupModal from '../components/UsernameSetupModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ACCENT_COLORS } from '../utils/accentColors.js';
import { api, getApiErrorMessage, PUBLIC_BASE_URL } from '../utils/api.js';

const defaultAmounts = [30, 50, 100];
const blankStatus = { type: '', message: '' };
const emptyAnalytics = { total_visits: 0, referrers: [], daily: [] };
const socialPlatforms = [
  { platform: 'youtube', label: 'YouTube', icon: '▶' },
  { platform: 'instagram', label: 'Instagram', icon: '◉' },
  { platform: 'twitter', label: 'X (Twitter)', icon: 'X' },
  { platform: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { platform: 'website', label: 'Website', icon: '🌐' }
];

function getPublicPageUrl(username) {
  if (!username) return '';
  return `${PUBLIC_BASE_URL.replace(/\/$/, '')}/${username}`;
}

function normalizeAmount(value) {
  const amount = Number(value);
  return Number.isInteger(amount) && amount >= 1 && amount <= 10000 ? amount : null;
}

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [pageError, setPageError] = useState('');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amounts, setAmounts] = useState(defaultAmounts);
  const [newAmount, setNewAmount] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocialPlatform, setNewSocialPlatform] = useState('youtube');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('not_set');
  const [availabilityLabel, setAvailabilityLabel] = useState('');
  const [thankyouMessage, setThankyouMessage] = useState('');
  const [accentColor, setAccentColor] = useState('amber');
  const [pageLive, setPageLive] = useState(true);

  const [profileStatus, setProfileStatus] = useState(blankStatus);
  const [upiStatus, setUpiStatus] = useState(blankStatus);
  const [amountStatus, setAmountStatus] = useState(blankStatus);
  const [socialStatus, setSocialStatus] = useState(blankStatus);
  const [thankyouStatus, setThankyouStatus] = useState(blankStatus);
  const [visibilityStatus, setVisibilityStatus] = useState(blankStatus);
  const [avatarStatus, setAvatarStatus] = useState(blankStatus);
  const [copyStatus, setCopyStatus] = useState('');
  const [saving, setSaving] = useState({ profile: false, upi: false, amounts: false, avatar: false, social: false, thankyou: false, visibility: false });

  const publicUrl = useMemo(() => getPublicPageUrl(profile?.username), [profile?.username]);

  useEffect(() => { if (user) fetchProfile(); }, [user?.username]);

  async function fetchProfile() {
    setLoadingProfile(true);
    setPageError('');
    try {
      const [profileResponse, analyticsResponse] = await Promise.all([
        api.get('/api/user/me'),
        api.get('/api/user/analytics')
      ]);
      hydrateProfile(profileResponse.data.user);
      setAnalytics(analyticsResponse.data.analytics || emptyAnalytics);
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
    setSocialLinks(Array.isArray(nextProfile.social_links) ? nextProfile.social_links : []);
    setAvailabilityStatus(nextProfile.availability_status || 'not_set');
    setAvailabilityLabel(nextProfile.availability_label || '');
    setThankyouMessage(nextProfile.thankyou_message || '');
    setAccentColor(nextProfile.accent_color || 'amber');
    setPageLive(nextProfile.page_live !== false);
  }

  async function saveProfile(event) {
    event.preventDefault();
    setProfileStatus(blankStatus);
    if (!name.trim() || name.trim().length > 50) {
      setProfileStatus({ type: 'error', message: 'Display name is required and must be 50 characters or fewer.' });
      return;
    }
    if (bio.length > 200) {
      setProfileStatus({ type: 'error', message: 'Bio must be 200 characters or fewer.' });
      return;
    }
    if (availabilityLabel.length > 50) {
      setProfileStatus({ type: 'error', message: 'Availability label must be 50 characters or fewer.' });
      return;
    }
    await saveProfilePatch('profile', setProfileStatus, {
      name,
      bio,
      availability_status: availabilityStatus,
      availability_label: availabilityLabel,
      accent_color: accentColor
    });
  }

  async function saveUpi(event) {
    event.preventDefault();
    setUpiStatus(blankStatus);
    if (!upiId.trim() || !upiId.includes('@')) {
      setUpiStatus({ type: 'error', message: 'Enter a valid UPI ID that contains @.' });
      return;
    }
    await saveProfilePatch('upi', setUpiStatus, { upi_id: upiId });
  }

  async function saveAmounts(event) {
    event.preventDefault();
    setAmountStatus(blankStatus);
    if (amounts.some((amount) => normalizeAmount(amount) === null)) {
      setAmountStatus({ type: 'error', message: 'Each chai amount must be a whole number from ₹1 to ₹10,000.' });
      return;
    }
    await saveProfilePatch('amounts', setAmountStatus, { chai_amounts: amounts });
  }

  async function saveSocialLinks(event) {
    event.preventDefault();
    setSocialStatus(blankStatus);
    await saveProfilePatch('social', setSocialStatus, { social_links: socialLinks });
  }

  async function saveThankyouMessage(event) {
    event.preventDefault();
    setThankyouStatus(blankStatus);
    if (thankyouMessage.length > 200) {
      setThankyouStatus({ type: 'error', message: 'Thank-you message must be 200 characters or fewer.' });
      return;
    }
    await saveProfilePatch('thankyou', setThankyouStatus, { thankyou_message: thankyouMessage });
  }

  async function togglePageLive(nextPageLive) {
    setVisibilityStatus(blankStatus);

    if (!nextPageLive) {
      const confirmed = window.confirm('Are you sure? Supporters will not be able to reach your page while it is hidden.');
      if (!confirmed) return;
    }

    await saveProfilePatch('visibility', setVisibilityStatus, { page_live: nextPageLive });
  }

  async function saveProfilePatch(section, setStatus, payload) {
    setSaving((c) => ({ ...c, [section]: true }));
    try {
      const response = await api.patch('/api/user/profile', payload);
      hydrateProfile(response.data.user);
      setStatus({ type: 'success', message: 'Saved successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: getApiErrorMessage(error, 'Could not save changes') });
    } finally {
      setSaving((c) => ({ ...c, [section]: false }));
    }
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    setAvatarStatus(blankStatus);
    if (!file) return;
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
    setSaving((c) => ({ ...c, avatar: true }));
    try {
      const response = await api.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      hydrateProfile(response.data.user);
      setAvatarStatus({ type: 'success', message: 'Profile image updated.' });
    } catch (error) {
      setAvatarStatus({ type: 'error', message: getApiErrorMessage(error, 'Image upload failed. Other sections can still be saved.') });
    } finally {
      event.target.value = '';
      setSaving((c) => ({ ...c, avatar: false }));
    }
  }

  function addAmount() {
    const amount = normalizeAmount(newAmount);
    if (amount === null) {
      setAmountStatus({ type: 'error', message: 'Add a whole number from ₹1 to ₹10,000.' });
      return;
    }
    setAmounts((c) => [...c, amount]);
    setNewAmount('');
    setAmountStatus(blankStatus);
  }

  function removeAmount(indexToRemove) {
    setAmounts((c) => c.filter((_, i) => i !== indexToRemove));
    setAmountStatus(blankStatus);
  }

  function addSocialLink() {
    setSocialStatus(blankStatus);
    const url = newSocialUrl.trim();

    if (socialLinks.length >= 5) {
      setSocialStatus({ type: 'error', message: 'Maximum 5 links' });
      return;
    }

    if (!url.startsWith('https://')) {
      setSocialStatus({ type: 'error', message: 'URL must start with https://' });
      return;
    }

    if (url.length > 200) {
      setSocialStatus({ type: 'error', message: 'URL must be 200 characters or fewer.' });
      return;
    }

    setSocialLinks((current) => [...current, { platform: newSocialPlatform, url }]);
    setNewSocialUrl('');
  }

  function removeSocialLink(indexToRemove) {
    setSocialLinks((current) => current.filter((_, index) => index !== indexToRemove));
    setSocialStatus(blankStatus);
  }

  async function copyLink() {
    setCopyStatus('');
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyStatus('Copied!');
    } catch {
      setCopyStatus('Could not copy link.');
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {!user?.username ? <UsernameSetupModal /> : null}

      {/* Dash header */}
      <div className="border-b border-white/8 bg-stone-950/80 backdrop-blur-sm sticky top-0 z-40 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">☕</span>
            <div>
              <p className="text-xs font-medium text-amber-400/70 uppercase tracking-widest">Dashboard</p>
              {profile?.username && (
                <p className="text-sm font-semibold text-white/60">fuelmychai.in/<span className="text-amber-400">{profile.username}</span></p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile?.username && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-400/20"
              >
                View my page ↗
              </a>
            )}
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition hover:border-white/20 hover:text-white"
              onClick={logout}
              type="button"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loadingProfile ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-white/40">
              <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading dashboard...
            </div>
          </div>
        ) : pageError ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/8 p-8 text-center">
            <p className="text-red-400">{pageError}</p>
          </div>
        ) : profile ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <ProfileSection
                avatarStatus={avatarStatus}
                bio={bio}
                name={name}
                onBioChange={setBio}
                onAccentColorChange={setAccentColor}
                onAvailabilityLabelChange={setAvailabilityLabel}
                onAvailabilityStatusChange={setAvailabilityStatus}
                onNameChange={setName}
                onSave={saveProfile}
                onUploadAvatar={uploadAvatar}
                profile={profile}
                profileStatus={profileStatus}
                availabilityLabel={availabilityLabel}
                availabilityStatus={availabilityStatus}
                accentColor={accentColor}
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
              <SocialLinksSection
                links={socialLinks}
                newPlatform={newSocialPlatform}
                newUrl={newSocialUrl}
                onAddLink={addSocialLink}
                onNewPlatformChange={setNewSocialPlatform}
                onNewUrlChange={setNewSocialUrl}
                onRemoveLink={removeSocialLink}
                onSave={saveSocialLinks}
                saving={saving.social}
                status={socialStatus}
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
                onThankyouChange={setThankyouMessage}
                onThankyouSave={saveThankyouMessage}
                onTogglePageLive={togglePageLive}
                pageLive={pageLive}
                publicUrl={publicUrl}
                savingThankyou={saving.thankyou}
                savingVisibility={saving.visibility}
                thankyouMessage={thankyouMessage}
                thankyouStatus={thankyouStatus}
                visibilityStatus={visibilityStatus}
                username={profile?.username}
              />
              <AnalyticsSection analytics={analytics} visitCount={profile.visit_count || 0} />
              <ProTipsSection />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Section components ────────────────────────────────

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-white/8 bg-stone-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 border-b border-white/6 pb-4">
        <h2 className="text-base font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function StatusMessage({ status }) {
  if (!status?.message) return null;
  return (
    <p className={`flex items-center gap-1.5 text-sm font-medium ${status.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
      {status.type === 'error' ? '✕' : '✓'} {status.message}
    </p>
  );
}

function ProfileSection({
  accentColor,
  availabilityLabel,
  availabilityStatus,
  avatarStatus,
  bio,
  name,
  onAccentColorChange,
  onAvailabilityLabelChange,
  onAvailabilityStatusChange,
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
    <SectionCard title="Profile" subtitle="Your public name, photo and bio">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative size-24 overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-amber-400/20">
            {profile.profile_image ? (
              <img alt={profile.name} className="h-full w-full object-cover" src={profile.profile_image} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-stone-950">
                {profile.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            {savingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <svg className="size-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}
          </div>
          <label className="cursor-pointer rounded-xl border border-white/10 bg-stone-800 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-amber-400/30 hover:text-amber-400">
            <span className="flex items-center gap-1.5"><ImageUp size={13} /> Change photo</span>
            <input accept="image/jpeg,image/png" className="hidden" disabled={savingAvatar} onChange={onUploadAvatar} type="file" />
          </label>
          <StatusMessage status={avatarStatus} />
        </div>

        {/* Fields */}
        <form className="flex-1 space-y-4" onSubmit={onSave}>
          <div>
            <label className="label-dark" htmlFor="name">Display name</label>
            <input className="input-dark" id="name" maxLength={50} onChange={(e) => onNameChange(e.target.value)} value={name} />
            <p className="mt-1 text-right text-xs text-white/25">{name.length}/50</p>
          </div>
          <div>
            <label className="label-dark" htmlFor="bio">Bio</label>
            <textarea
              className="input-dark min-h-24 resize-y"
              id="bio"
              maxLength={200}
              onChange={(e) => onBioChange(e.target.value)}
              value={bio}
            />
            <p className="mt-1 text-right text-xs text-white/25">{bio.length}/200</p>
          </div>
          <div>
            <label className="label-dark">Availability status (shown on your page)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ['not_set', 'Not shown'],
                ['available', 'Available'],
                ['busy', 'Busy'],
                ['custom', 'Custom']
              ].map(([value, label]) => (
                <button
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    availabilityStatus === value
                      ? 'border-amber-400 bg-amber-400 text-stone-950'
                      : 'border-white/10 bg-stone-800 text-white/45 hover:border-white/20 hover:text-white'
                  }`}
                  key={value}
                  onClick={() => onAvailabilityStatusChange(value)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            {availabilityStatus === 'custom' && (
              <div className="mt-3">
                <input
                  className="input-dark"
                  maxLength={50}
                  onChange={(event) => onAvailabilityLabelChange(event.target.value)}
                  placeholder="Taking requests until Dec 31"
                  value={availabilityLabel}
                />
                <p className="mt-1 text-right text-xs text-white/25">{availabilityLabel.length}/50</p>
              </div>
            )}
          </div>
          <div>
            <label className="label-dark">Page accent color</label>
            <p className="mt-1 text-xs text-white/35">Changes the button color on your public page</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(ACCENT_COLORS).map(([key, color]) => (
                <button
                  aria-label={`${key} accent color`}
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 text-xs font-bold shadow-sm"
                  key={key}
                  onClick={() => onAccentColorChange(key)}
                  style={{ backgroundColor: color.bg, color: color.text }}
                  type="button"
                >
                  {accentColor === key ? '✓' : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-primary py-2.5 px-5 text-sm" disabled={savingProfile} type="submit">
              {savingProfile ? 'Saving...' : 'Save profile'}
            </button>
            <StatusMessage status={profileStatus} />
          </div>
        </form>
      </div>
    </SectionCard>
  );
}

function UpiPrivacyTip() {
  const [open, setOpen] = useState(false);

  const UPI_GUIDES = [
    { app: 'Google Pay', handle: 'yourname@okicici / @okhdfcbank', steps: 'GPay → Profile photo → UPI IDs → Add new UPI ID → choose a name-based handle' },
    { app: 'PhonePe', handle: 'yourname@ybl / @ibl', steps: 'PhonePe → Profile → UPI ID → Edit → enter custom handle (availability checked live)' },
    { app: 'Paytm', handle: 'yourname@paytm', steps: 'Paytm → Profile → Payment Settings → Paytm UPI ID → Edit UPI ID' },
    { app: 'BHIM / Bank app', handle: 'yourname@upi / @axisbank', steps: 'Most bank apps: Settings → UPI Settings → Manage UPI IDs → Add ID → choose custom handle' },
  ];

  const hasPhoneNumber = (id) => {
    const cleaned = id.split('@')[0].replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  return (
    <div className="rounded-xl border border-blue-400/20 bg-blue-400/6 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base">🔒</span>
          <div>
            <p className="text-xs font-bold text-blue-300">Privacy tip — your UPI ID may expose your phone number</p>
            <p className="text-xs text-blue-400/50 mt-0.5">Tap to see how to fix this in 2 minutes</p>
          </div>
        </div>
        <span className={`text-xs text-blue-400/50 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="border-t border-blue-400/15 px-4 pb-5 pt-4 space-y-4">
          <div className="space-y-2 text-xs leading-6 text-blue-200/60">
            <p>
              Most people use a phone-number-based UPI ID like <code className="rounded bg-blue-400/10 px-1 text-blue-300">9876543210@paytm</code>.
              When a supporter scans your QR code with any scanner app, they can see your full phone number — it's embedded inside the QR.
            </p>
            <p>
              The fix: create a <strong className="text-blue-300">name-based UPI handle</strong> like{' '}
              <code className="rounded bg-blue-400/10 px-1 text-blue-300">priyacreates@okaxis</code>.
              No phone number, no private info — just your name.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-blue-300">How to create one — pick your app:</p>
            {UPI_GUIDES.map((g) => (
              <div key={g.app} className="rounded-lg border border-blue-400/10 bg-blue-400/4 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-xs font-bold text-white/70">{g.app}</p>
                  <code className="rounded bg-blue-400/10 px-2 py-0.5 text-xs text-blue-300">{g.handle}</code>
                </div>
                <p className="mt-1 text-xs text-blue-400/50 leading-5">{g.steps}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-400/15 bg-amber-400/6 px-3 py-2.5">
            <p className="text-xs text-amber-200/60">
              <strong className="text-amber-400">After creating your new handle:</strong> come back here, update your UPI ID to the new name-based one, and save. Your QR code will regenerate automatically. Your old phone-number UPI still works — you can keep both active in your UPI app.
            </p>
          </div>

          <div className="rounded-lg border border-purple-400/15 bg-purple-400/6 px-3 py-2.5">
            <p className="text-xs text-purple-200/60">
              ⭐ <strong className="text-purple-400">Pro plan:</strong> Even with a phone-number UPI ID, Pro creators get complete privacy — payments route through our masked system and your real UPI ID is never exposed to anyone. <a href="/login" className="text-purple-400 underline">Learn about Pro →</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function UpiSection({ onSave, onUpiChange, saving, status, upiId }) {
  const looksLikePhone = upiId && /^[0-9]{10}@/.test(upiId.trim());

  return (
    <SectionCard title="UPI ID" subtitle="Where supporters send chai money">
      <form className="space-y-4" onSubmit={onSave}>
        <div>
          <label className="label-dark" htmlFor="upi">UPI ID</label>
          <div className="relative">
            <input
              className={`input-dark pr-10 ${looksLikePhone ? 'border-orange-400/40 focus:border-orange-400/60' : ''}`}
              id="upi"
              onChange={(e) => onUpiChange(e.target.value)}
              placeholder="yourname@okaxis"
              value={upiId}
            />
            {upiId && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {looksLikePhone ? (
                  <span title="Phone number detected" className="text-base">⚠️</span>
                ) : upiId.includes('@') ? (
                  <span title="Looks good" className="text-base">✅</span>
                ) : null}
              </div>
            )}
          </div>

          {/* Live phone number warning */}
          {looksLikePhone && (
            <div className="mt-2 flex items-start gap-2 rounded-lg border border-orange-400/20 bg-orange-400/6 px-3 py-2">
              <span className="mt-0.5 shrink-0 text-sm">⚠️</span>
              <p className="text-xs leading-5 text-orange-300/80">
                This looks like a phone-number UPI ID. Anyone who scans your QR code will see your phone number.
                <button
                  type="button"
                  className="ml-1 text-orange-400 underline hover:text-orange-300"
                  onClick={() => {
                    const el = document.getElementById('upi-privacy-tip');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See how to fix this ↓
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Payment disclaimer */}
        <div className="rounded-xl border border-amber-400/15 bg-amber-400/8 px-4 py-3">
          <p className="text-xs leading-5 text-amber-200/70">
            ⚠️ Double-check your UPI ID. Payments go directly to your UPI app.
            We are not responsible for incorrect or inactive UPI IDs.
            Lost payments cannot be recovered.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="btn-primary py-2.5 px-5 text-sm" disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save UPI ID'}
          </button>
          <StatusMessage status={status} />
        </div>
      </form>

      {/* Privacy tip — always visible, expandable */}
      <div id="upi-privacy-tip" className="mt-5">
        <UpiPrivacyTip />
      </div>
    </SectionCard>
  );
}

function SocialLinksSection({
  links,
  newPlatform,
  newUrl,
  onAddLink,
  onNewPlatformChange,
  onNewUrlChange,
  onRemoveLink,
  onSave,
  saving,
  status
}) {
  const selectedPlatform = socialPlatforms.find((item) => item.platform === newPlatform);
  const addDisabled = links.length >= 5 || !newUrl.trim();

  return (
    <SectionCard title="Social links" subtitle="Add up to 5 links to your public page">
      <form className="space-y-4" onSubmit={onSave}>
        <div className="space-y-2">
          {links.length === 0 ? (
            <p className="rounded-xl border border-white/6 bg-stone-800/40 px-4 py-3 text-sm text-white/35">
              No social links yet.
            </p>
          ) : links.map((link, index) => {
            const platform = socialPlatforms.find((item) => item.platform === link.platform);
            return (
              <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-stone-800/60 px-3 py-2" key={`${link.platform}-${link.url}-${index}`}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/6 text-xs font-bold text-white/60">
                  {platform?.icon || '↗'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white/60">{platform?.label || link.platform}</p>
                  <p className="truncate text-xs text-white/30">{link.url}</p>
                </div>
                <button
                  aria-label="Remove social link"
                  className="rounded-full p-1.5 text-white/30 transition hover:bg-white/10 hover:text-white"
                  onClick={() => onRemoveLink(index)}
                  type="button"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid gap-2 sm:grid-cols-[150px_1fr_auto]">
          <select
            className="input-dark"
            onChange={(event) => onNewPlatformChange(event.target.value)}
            value={newPlatform}
          >
            {socialPlatforms.map((item) => (
              <option key={item.platform} value={item.platform}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            className="input-dark"
            maxLength={200}
            onChange={(event) => onNewUrlChange(event.target.value)}
            placeholder={`https://${selectedPlatform?.platform || 'example'}.com/yourname`}
            value={newUrl}
          />
          <button
            className="btn-dark justify-center py-2.5 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            disabled={addDisabled}
            onClick={onAddLink}
            type="button"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {links.length >= 5 && <p className="text-xs text-amber-400">Maximum 5 links</p>}

        <div className="flex items-center gap-4">
          <button className="btn-primary py-2.5 px-5 text-sm" disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save links'}
          </button>
          <StatusMessage status={status} />
        </div>
      </form>
    </SectionCard>
  );
}

function AmountsSection({ amounts, newAmount, onAddAmount, onNewAmountChange, onRemoveAmount, onSave, saving, status }) {
  return (
    <SectionCard title="Chai Amounts" subtitle="Preset amounts shown to your supporters">
      <form className="space-y-4" onSubmit={onSave}>
        <div className="flex flex-wrap gap-2">
          {amounts.map((amount, index) => (
            <div
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5"
              key={`${amount}-${index}`}
            >
              <span className="text-sm font-bold text-amber-400">₹{amount}</span>
              <button
                aria-label={`Remove ₹${amount}`}
                className="rounded-full p-0.5 text-white/30 transition hover:bg-white/10 hover:text-white/70"
                onClick={() => onRemoveAmount(index)}
                type="button"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="input-dark max-w-xs"
            min={1}
            max={10000}
            onChange={(e) => onNewAmountChange(e.target.value)}
            placeholder="Add amount (e.g. 200)"
            type="number"
            value={newAmount}
          />
          <button
            className="btn-dark shrink-0 py-2.5 px-4 text-sm"
            onClick={onAddAmount}
            type="button"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="btn-primary py-2.5 px-5 text-sm" disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save amounts'}
          </button>
          <StatusMessage status={status} />
        </div>
      </form>
    </SectionCard>
  );
}

// Embed badge option for the share section
function BadgeOption({ label, code, lang }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="rounded-xl border border-white/8 bg-stone-800/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6">
        <span className="text-xs font-semibold text-white/50">{label}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg bg-white/6 px-3 py-1 text-xs font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <><svg className="size-3 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg> Copied!</>
          ) : (
            <><Copy size={12} /> Copy code</>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-xs text-amber-400/80 whitespace-pre-wrap break-all leading-5">
        {code}
      </pre>
    </div>
  );
}

function ShareSection({
  copyStatus,
  onCopy,
  onThankyouChange,
  onThankyouSave,
  onTogglePageLive,
  pageLive,
  publicUrl,
  savingThankyou,
  savingVisibility,
  thankyouMessage,
  thankyouStatus,
  visibilityStatus,
  username
}) {
  const mdBadge = `[![☕ Fuel my chai](https://img.shields.io/badge/☕_Fuel_my_Chai-F59E0B?style=for-the-badge&logoColor=000)](${publicUrl})`;
  const htmlBtn = `<a href="${publicUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;background:#F59E0B;color:#000;padding:10px 20px;border-radius:9999px;font-weight:700;font-family:sans-serif;text-decoration:none;font-size:14px">☕ Fuel my Chai</a>`;
  const plainLink = publicUrl;

  return (
    <SectionCard title="Share your page" subtitle="Let your audience know where to send chai">
      {/* Public URL */}
      <div className="flex items-center gap-2 overflow-hidden rounded-xl border border-amber-400/20 bg-amber-400/8 px-4 py-3">
        <span className="flex-1 truncate text-sm font-medium text-amber-400">{publicUrl || '—'}</span>
        <button
          className="shrink-0 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-stone-950 transition hover:bg-amber-300 disabled:opacity-40"
          disabled={!publicUrl}
          onClick={onCopy}
          type="button"
        >
          {copyStatus === 'Copied!' ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-white/8 bg-stone-800/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-white/75">Page visibility</p>
            <p className="mt-1 text-xs text-white/35">
              {pageLive
                ? 'Your page is live and accessible to anyone.'
                : 'Your page is hidden. Only you can see it.'}
            </p>
          </div>
          <button
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              pageLive
                ? 'border-green-400/30 bg-green-400/10 text-green-300 hover:bg-green-400/15'
                : 'border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/15'
            }`}
            disabled={savingVisibility}
            onClick={() => onTogglePageLive(!pageLive)}
            type="button"
          >
            {savingVisibility ? 'Saving...' : pageLive ? 'Public ✓' : 'Hidden ●'}
          </button>
        </div>
        <StatusMessage status={visibilityStatus} />
      </div>

      {/* Quick links */}
      <div className="mt-4 flex gap-2">
        {publicUrl && (
          <>
            <a
              href={`https://twitter.com/intent/tweet?text=Support+me+with+a+chai+☕&url=${encodeURIComponent(publicUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl border border-white/8 bg-stone-800/60 py-2.5 text-center text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white"
            >
              Share on 𝕏
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Support me with a chai ☕ ' + publicUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl border border-white/8 bg-stone-800/60 py-2.5 text-center text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white"
            >
              Share on WhatsApp
            </a>
          </>
        )}
      </div>

      {/* Embed badges */}
      {publicUrl && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
            Add to your profiles
          </p>
          <BadgeOption label="GitHub README / Markdown" code={mdBadge} />
          <BadgeOption label="HTML (website, portfolio, Linktree)" code={htmlBtn} />
          <BadgeOption label="Plain link (Instagram bio, LinkedIn, anywhere)" code={plainLink} />
        </div>
      )}

      <form className="mt-6 border-t border-white/6 pt-5" onSubmit={onThankyouSave}>
        <label className="label-dark" htmlFor="thankyou-message">Thank-you message</label>
        <p className="mt-1 text-xs text-white/35">Shown to supporters after they tap Pay (free plan: plain text only)</p>
        <textarea
          className="input-dark mt-2 min-h-24 resize-y"
          id="thankyou-message"
          maxLength={200}
          onChange={(event) => onThankyouChange(event.target.value)}
          placeholder="Thank you for the chai! It means the world."
          value={thankyouMessage}
        />
        <p className="mt-1 text-right text-xs text-white/25">{thankyouMessage.length}/200</p>
        <div className="mt-3 flex items-center gap-4">
          <button className="btn-primary py-2.5 px-5 text-sm" disabled={savingThankyou} type="submit">
            {savingThankyou ? 'Saving...' : 'Save'}
          </button>
          <StatusMessage status={thankyouStatus} />
        </div>
      </form>
    </SectionCard>
  );
}

const referrerDisplay = {
  instagram: { label: 'Instagram', icon: '◉' },
  youtube: { label: 'YouTube', icon: '▶' },
  twitter: { label: 'X (Twitter)', icon: 'X' },
  whatsapp: { label: 'WhatsApp', icon: 'WA' },
  linkedin: { label: 'LinkedIn', icon: 'in' },
  google: { label: 'Google Search', icon: 'G' },
  direct: { label: 'Direct / Unknown', icon: '•' },
  other: { label: 'Other', icon: '↗' }
};

function getLastSevenDays(daily) {
  const countsByDate = new Map(
    (Array.isArray(daily) ? daily : []).map((item) => [
      new Date(item.date).toISOString().slice(0, 10),
      Number(item.count || 0)
    ])
  );

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);

    return {
      key,
      label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      count: countsByDate.get(key) || 0
    };
  });
}

function AnalyticsSection({ analytics, visitCount }) {
  const totalVisits = Number(analytics?.total_visits ?? visitCount ?? 0);
  const referrers = Array.isArray(analytics?.referrers) ? analytics.referrers : [];
  const maxReferrerCount = Math.max(...referrers.map((item) => Number(item.count || 0)), 1);
  const dailyBars = getLastSevenDays(analytics?.daily);
  const maxDailyCount = Math.max(...dailyBars.map((item) => item.count), 1);

  return (
    <SectionCard title="Analytics" subtitle="How many people have discovered your chai page">
      <div className="flex items-center gap-4 rounded-2xl border border-white/6 bg-stone-800/40 p-5">
        <div className="flex size-12 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-xl">
          👁️
        </div>
        <div>
          <p className="text-3xl font-bold text-amber-400">{totalVisits.toLocaleString('en-IN')}</p>
          <p className="text-xs text-white/40">total page visits</p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-bold text-white/80">Where your visitors came from (last 30 days)</h3>
        {referrers.length > 0 ? (
          <div className="mt-3 space-y-3">
            {referrers.map((item) => {
              const meta = referrerDisplay[item.bucket] || referrerDisplay.other;
              const count = Number(item.count || 0);
              const width = `${Math.max((count / maxReferrerCount) * 100, 4)}%`;

              return (
                <div key={item.bucket}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 font-medium text-white/55">
                      <span className="flex size-6 items-center justify-center rounded-md bg-white/6 text-[10px] font-bold text-white/45">{meta.icon}</span>
                      {meta.label}
                    </span>
                    <span className="font-semibold text-white/45">{count.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-800">
                    <div className="h-full rounded-full bg-amber-400" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-white/6 bg-stone-800/40 px-4 py-3 text-xs leading-5 text-white/35">
            Share your page to start seeing where your visitors come from.
          </p>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-bold text-white/80">Last 7 days</h3>
        <div className="mt-3 flex h-24 items-end gap-2 rounded-xl border border-white/6 bg-stone-800/30 px-3 py-3">
          {dailyBars.map((day) => (
            <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={day.key}>
              <div
                className="w-full max-w-4 rounded-t bg-amber-400/80"
                style={{ height: `${Math.max((day.count / maxDailyCount) * 60, day.count > 0 ? 8 : 2)}px` }}
                title={`${day.count} visits`}
              />
              <span className="text-[10px] text-white/30">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-white/25">This data is private — not shown on your public chai page.</p>
    </SectionCard>
  );
}

const TIPS = [
  {
    id: 'upi-username',
    icon: '🔒',
    tag: 'Privacy',
    tagColor: 'blue',
    title: 'Switch to a name-based UPI ID',
    short: 'Your phone number is visible in your QR code right now.',
    detail: (
      <div className="space-y-2 text-xs leading-6 text-white/40">
        <p>
          UPI IDs like <code className="rounded bg-white/8 px-1 text-white/60">9876543210@paytm</code> embed
          your phone number inside the QR code. Anyone who scans it can read it — no special tool needed.
        </p>
        <p>
          Create a custom handle like <code className="rounded bg-green-400/10 px-1 text-green-400">priya@okaxis</code> or <code className="rounded bg-green-400/10 px-1 text-green-400">priyacreates@ybl</code> in your UPI app settings.
          Then update it in the UPI ID section below.
        </p>
        <div className="rounded-lg border border-white/6 bg-white/3 px-3 py-2 space-y-1.5">
          <p className="font-semibold text-white/50">Quick guide by app:</p>
          <p><span className="text-white/60">GPay:</span> Profile → UPI IDs → Add new → type a custom name</p>
          <p><span className="text-white/60">PhonePe:</span> Profile → UPI ID → Edit → choose a custom handle</p>
          <p><span className="text-white/60">Paytm:</span> Profile → Payment Settings → Paytm UPI ID → Edit</p>
          <p><span className="text-white/60">Bank app:</span> Settings → UPI Settings → Manage UPI IDs → Add</p>
        </div>
      </div>
    ),
  },
  {
    id: 'bio-cta',
    icon: '✍️',
    tag: 'Growth',
    tagColor: 'green',
    title: 'Your bio is your best sales pitch',
    short: 'Creators with a clear bio get 3× more chai support.',
    detail: (
      <div className="space-y-2 text-xs leading-6 text-white/40">
        <p>Tell supporters exactly who you are and what you make — in one or two sentences. Be specific.</p>
        <div className="rounded-lg border border-red-400/15 bg-red-400/5 px-3 py-2">
          <p className="text-red-400/70 font-semibold text-xs mb-1">❌ Weak bio</p>
          <p>"Content creator. Love making videos."</p>
        </div>
        <div className="rounded-lg border border-green-400/15 bg-green-400/5 px-3 py-2">
          <p className="text-green-400/70 font-semibold text-xs mb-1">✅ Strong bio</p>
          <p>"I make weekly personal finance videos for salaried Indians in their 20s. If my SIP calculator saved you money — this is your chai round ☕"</p>
        </div>
        <p>The goal: make a supporter who's already watched your content feel like <em>of course</em> they should send chai.</p>
      </div>
    ),
  },
  {
    id: 'share-strategy',
    icon: '📣',
    tag: 'Growth',
    tagColor: 'green',
    title: 'Where to put your chai link',
    short: 'Most creators only share their link once. Big mistake.',
    detail: (
      <div className="space-y-2 text-xs leading-6 text-white/40">
        <p>Drop your link in all of these — not just your Instagram bio:</p>
        <ul className="ml-3 space-y-1.5 list-disc">
          <li><strong className="text-white/60">YouTube description</strong> — line 1 of every video</li>
          <li><strong className="text-white/60">YouTube end screen</strong> — "Support this channel" card</li>
          <li><strong className="text-white/60">Instagram bio</strong> — with a 🍵 emoji so it stands out</li>
          <li><strong className="text-white/60">Instagram stories</strong> — "link in bio" sticker once a week</li>
          <li><strong className="text-white/60">Twitter/X pinned tweet</strong> — "If my threads help you, buy me a chai"</li>
          <li><strong className="text-white/60">Newsletter footer</strong> — every single issue</li>
          <li><strong className="text-white/60">LinkedIn About section</strong> — at the end, after your work history</li>
          <li><strong className="text-white/60">WhatsApp status</strong> — especially after a popular post</li>
        </ul>
        <p>Use the Share section below to copy your link and the embed badges for GitHub or HTML sites.</p>
      </div>
    ),
  },
  {
    id: 'amounts',
    icon: '💰',
    tag: 'Conversion',
    tagColor: 'amber',
    title: 'The ₹50 sweet spot',
    short: 'Most Indian creators see the highest conversion at ₹30–₹50.',
    detail: (
      <div className="space-y-2 text-xs leading-6 text-white/40">
        <p>
          Supporters decide based on the first amount they see. If your lowest amount feels
          too high, they leave. If it's too low, you leave money on the table.
        </p>
        <p>Recommended setup for most creators:</p>
        <div className="flex gap-2">
          {[['₹30', 'Everyone can afford this. Highest volume.'], ['₹50', 'Sweet spot. Best conversion.'], ['₹100', 'Super fan tier.']].map(([amt, note]) => (
            <div key={amt} className="flex-1 rounded-lg border border-amber-400/15 bg-amber-400/6 p-2.5 text-center">
              <p className="text-sm font-bold text-amber-400">{amt}</p>
              <p className="mt-1 text-xs text-white/30 leading-4">{note}</p>
            </div>
          ))}
        </div>
        <p>You can always add a ₹200 or ₹500 "super chai" option for your most dedicated fans — some will pick it.</p>
      </div>
    ),
  },
  {
    id: 'photo',
    icon: '📸',
    tag: 'Trust',
    tagColor: 'purple',
    title: 'Use a clear, smiling face photo',
    short: 'Pages with real face photos get 2× more support than logos or avatars.',
    detail: (
      <div className="space-y-2 text-xs leading-6 text-white/40">
        <p>
          Supporters are paying a real person, not a brand. A clear, well-lit photo of
          your actual face builds more trust than a logo, illustration, or channel art.
        </p>
        <p>What works best:</p>
        <ul className="ml-3 space-y-1 list-disc">
          <li>Square crop, face centered and clearly visible</li>
          <li>Natural light — near a window is perfect</li>
          <li>Smiling or looking directly at camera</li>
          <li>Same photo you use on YouTube or Instagram — recognition matters</li>
        </ul>
        <p>Max size: 1MB, JPG or PNG only. Update it in the Profile section above.</p>
      </div>
    ),
  },
  {
    id: 'verify-upi',
    icon: '✅',
    tag: 'Safety',
    tagColor: 'red',
    title: 'Test your UPI ID before going live',
    short: 'A wrong UPI ID means real supporters lose real money.',
    detail: (
      <div className="space-y-2 text-xs leading-6 text-white/40">
        <p>
          Before sharing your page with your audience, send yourself a ₹1 test payment:
        </p>
        <ol className="ml-3 space-y-1.5 list-decimal">
          <li>Save your UPI ID in the section below</li>
          <li>Open your public page: <code className="rounded bg-white/8 px-1 text-white/60">fuelmychai.in/yourusername</code></li>
          <li>Select ₹1 (or add it as a custom amount)</li>
          <li>Scan the QR with a different phone</li>
          <li>Confirm the payment reaches your UPI account</li>
          <li>Only then share with your audience</li>
        </ol>
        <p className="text-amber-200/60">
          ⚠️ We cannot recover misdirected payments. 5 minutes of testing now can save a lot of headaches later.
        </p>
      </div>
    ),
  },
];

function TipCard({ tip }) {
  const [open, setOpen] = useState(false);

  const tagStyles = {
    blue: 'bg-blue-400/10 text-blue-400',
    green: 'bg-green-400/10 text-green-400',
    amber: 'bg-amber-400/10 text-amber-400',
    purple: 'bg-purple-400/10 text-purple-400',
    red: 'bg-red-400/10 text-red-400',
  };

  return (
    <div className={`overflow-hidden rounded-xl border transition-all ${open ? 'border-white/15 bg-stone-800/60' : 'border-white/6 bg-stone-800/30'}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className="mt-0.5 text-lg shrink-0">{tip.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tagStyles[tip.tagColor]}`}>
              {tip.tag}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-white/80 leading-5">{tip.title}</p>
          {!open && <p className="mt-0.5 text-xs text-white/35">{tip.short}</p>}
        </div>
        <span className={`shrink-0 text-xs text-white/25 transition-transform mt-1 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="border-t border-white/6 px-4 pb-4 pt-3">
          {tip.detail}
        </div>
      )}
    </div>
  );
}

function ProTipsSection() {
  const [filter, setFilter] = useState('All');
  const tags = ['All', 'Privacy', 'Growth', 'Conversion', 'Trust', 'Safety'];
  const filtered = filter === 'All' ? TIPS : TIPS.filter((t) => t.tag === filter);

  return (
    <section className="rounded-2xl border border-white/8 bg-stone-900/60 p-6 backdrop-blur-sm">
      <div className="mb-4 border-b border-white/6 pb-4">
        <h2 className="text-base font-bold text-white">Creator Tips</h2>
        <p className="mt-0.5 text-xs text-white/40">
          {TIPS.length} tips to grow your chai support
        </p>
      </div>

      {/* Tag filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setFilter(tag)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              filter === tag
                ? 'bg-amber-400 text-stone-950'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </section>
  );
}
