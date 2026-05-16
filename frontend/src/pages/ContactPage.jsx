import { useState } from 'react';
import { Link } from 'react-router-dom';

const SUBJECTS = [
  { value: '', label: 'Select a topic...' },
  { value: 'bug', label: '🐛 Report a bug' },
  { value: 'fraud', label: '🚨 Report fraud or impersonation' },
  { value: 'account', label: '🔐 Account or login issue' },
  { value: 'upi', label: '💸 UPI or payment question' },
  { value: 'pro', label: '⭐ Pro plan question' },
  { value: 'delete', label: '🗑️ Delete my account / my data' },
  { value: 'appeal', label: '⚖️ Appeal an account suspension' },
  { value: 'feature', label: '✨ Feature request' },
  { value: 'press', label: '📰 Press or partnership' },
  { value: 'other', label: '💬 Something else' },
];

const INFO_CARDS = [
  {
    icon: '⚡',
    title: 'Fastest response',
    body: 'Bug reports and account suspensions are prioritised. We aim to respond within 4–8 hours on weekdays.',
  },
  {
    icon: '🚨',
    title: 'Reporting fraud',
    body: 'For fake pages or impersonation, use the "Report this page" button directly on the public page. It\'s the fastest path to action.',
  },
  {
    icon: '🗑️',
    title: 'Delete your account',
    body: 'Email us with subject "Delete my account" from your registered email. We process within 7 business days.',
  },
  {
    icon: '⚖️',
    title: 'Appealing a ban',
    body: 'Email with subject "Account Appeal — @username". Include why you believe the suspension was in error. We review every appeal.',
  },
  {
    icon: '💸',
    title: 'Lost payment?',
    body: 'Free plan payments go directly via UPI — we cannot trace or recover them. Contact your UPI app (GPay, PhonePe, Paytm) directly.',
  },
  {
    icon: '📰',
    title: 'Press & partnerships',
    body: 'Building something that could work well with Fuel My Chai? We\'d love to hear from you at hello@fuelmychai.com.',
  },
];

const SUBJECT_EMAIL_MAP = {
  bug: 'Bug Report: ',
  fraud: 'Fraud / Impersonation Report: ',
  account: 'Account Issue: ',
  upi: 'UPI Question: ',
  pro: 'Pro Plan: ',
  delete: 'Delete My Account',
  appeal: 'Account Appeal — @',
  feature: 'Feature Request: ',
  press: 'Press / Partnership: ',
  other: 'Contact: ',
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', detail: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'faq'

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const prefix = SUBJECT_EMAIL_MAP[form.subject] || '';
    const subjectLine = `${prefix}${form.detail || ''}`.trim() || 'Contact from Fuel My Chai';
    const body = `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.subject}\n\n${form.message}`;
    window.location.href = `mailto:hello@fuelmychai.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  const incomplete = !form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim();

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-amber-400/60 transition hover:text-amber-400">
            ← Back to home
          </Link>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-tag">Support</span>
              <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">Contact Us</h1>
              <p className="mt-3 text-sm text-white/40 max-w-lg">
                Real people read every message. Pick the right topic below and
                we'll get back to you as fast as possible.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-amber-400/15 bg-amber-400/6 px-5 py-3 self-start">
              <span className="text-xl">⏱️</span>
              <div>
                <p className="text-xs font-bold text-amber-400">Avg. response</p>
                <p className="text-xs text-white/40">4–8 hrs (weekdays)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-8 flex gap-2">
          {[
            { id: 'form', label: '✉️ Send a message' },
            { id: 'faq', label: '❓ Quick answers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-amber-400 bg-amber-400/15 text-amber-400'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'form' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">

            {/* Info cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {INFO_CARDS.map((card) => (
                <div key={card.title} className="rounded-2xl border border-white/8 bg-stone-900/60 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-xl shrink-0">{card.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{card.title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/40">{card.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-white/8 bg-stone-900/60 p-6 sm:p-8">
              {submitted ? (
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <span className="text-5xl">☕</span>
                  <h2 className="mt-5 font-display text-2xl text-white">Message sent!</h2>
                  <p className="mt-3 text-sm leading-6 text-white/40">
                    Your email client should have opened with a pre-filled message.
                    Hit send and we'll get back to you shortly.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', detail: '', message: '' }); }}
                      className="btn-ghost px-5 py-2.5 text-sm"
                    >
                      Send another
                    </button>
                    <Link to="/" className="btn-primary px-5 py-2.5 text-sm">
                      Back to home
                    </Link>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <h2 className="font-bold text-white text-lg">Send us a message</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-dark" htmlFor="c-name">Your name <span className="text-red-400">*</span></label>
                      <input
                        className="input-dark"
                        id="c-name"
                        name="name"
                        onChange={handleChange}
                        required
                        value={form.name}
                        placeholder="Priya Sharma"
                      />
                    </div>
                    <div>
                      <label className="label-dark" htmlFor="c-email">Email <span className="text-red-400">*</span></label>
                      <input
                        className="input-dark"
                        id="c-email"
                        name="email"
                        onChange={handleChange}
                        required
                        type="email"
                        value={form.email}
                        placeholder="priya@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-dark" htmlFor="c-subject">Topic <span className="text-red-400">*</span></label>
                    <select
                      className="input-dark"
                      id="c-subject"
                      name="subject"
                      onChange={handleChange}
                      required
                      value={form.subject}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value} className="bg-stone-900">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contextual helper text */}
                  {form.subject === 'fraud' && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/6 px-4 py-3 text-xs leading-5 text-red-300/70">
                      🚨 For faster action on active fraud, use the <strong>"Report this page"</strong> button
                      at the bottom of the fraudulent page — it goes directly into our review queue.
                    </div>
                  )}
                  {form.subject === 'delete' && (
                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/6 px-4 py-3 text-xs leading-5 text-amber-200/70">
                      ⚠️ Please send from your <strong>registered email address</strong> so we can
                      verify your identity. Account deletion is irreversible.
                      Pro plan transaction records are retained for 7 years for legal compliance.
                    </div>
                  )}
                  {form.subject === 'upi' && (
                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/6 px-4 py-3 text-xs leading-5 text-amber-200/70">
                      💡 Free plan payments go directly via UPI. We have no visibility into
                      any transaction. For lost payments, contact your UPI app (GPay, PhonePe, Paytm)
                      or your bank directly.
                    </div>
                  )}
                  {form.subject === 'appeal' && (
                    <div>
                      <label className="label-dark" htmlFor="c-detail">Your username (e.g. @priya)</label>
                      <input
                        className="input-dark"
                        id="c-detail"
                        name="detail"
                        onChange={handleChange}
                        placeholder="@yourname"
                        value={form.detail}
                      />
                    </div>
                  )}

                  <div>
                    <label className="label-dark" htmlFor="c-message">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      className="input-dark min-h-32 resize-y"
                      id="c-message"
                      name="message"
                      onChange={handleChange}
                      required
                      value={form.message}
                      placeholder="Describe your issue in as much detail as possible. Include your username if relevant."
                    />
                    <p className="mt-1 text-right text-xs text-white/20">{form.message.length} chars</p>
                  </div>

                  <button
                    className="btn-primary w-full justify-center py-3.5"
                    disabled={incomplete}
                    type="submit"
                  >
                    Open email client & send →
                  </button>
                  <p className="text-center text-xs text-white/20">
                    This opens your email app pre-filled. Hit send to reach us.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-3">
            {[
              {
                q: 'I made a payment but the creator didn\'t receive it. What do I do?',
                a: 'Free plan payments go directly from your UPI app to the creator — Fuel My Chai has no involvement in the transaction. Check your GPay/PhonePe/Paytm transaction history. If it shows successful, the creator should have received it. Contact your UPI provider or bank if there\'s a discrepancy.'
              },
              {
                q: 'My UPI ID has my phone number in it. Is that a privacy issue?',
                a: 'Yes — on the free plan, your UPI ID is embedded in the QR code and a QR scanner can extract it. We recommend setting up a name-based UPI ID (e.g., yourname@okaxis) through your bank app or Google Pay. Your dashboard has a step-by-step guide. Pro plan creators use masked routing — supporters never see your real UPI ID.'
              },
              {
                q: 'I think someone has created a fake page impersonating me.',
                a: 'Please use the "Report this page" button at the bottom of the fake page — this gets immediate attention. Also email us at hello@fuelmychai.com with subject "Impersonation Report" and include your own verified social media link so we can confirm your identity. We typically act within 4 hours.'
              },
              {
                q: 'Why was my account suspended?',
                a: 'Account suspensions happen when our automated systems or human reviewers find a violation of our Terms of Service — typically related to prohibited content (medical fundraisers, donation campaigns), impersonation, or suspicious activity. Email hello@fuelmychai.com with subject "Account Appeal — @username" to appeal.'
              },
              {
                q: 'Can I use Fuel My Chai to raise money for a medical emergency?',
                a: 'No. Fuel My Chai is a creator support platform, not a crowdfunding or donation platform. Using it for medical fundraisers, disaster relief, or any hardship-based donation campaigns is a violation of our Terms and will result in immediate account termination. For genuine medical emergencies, please use registered platforms like Milaap or Ketto that have proper donor protection in place.'
              },
              {
                q: 'How do I delete my account and all my data?',
                a: 'Email hello@fuelmychai.com from your registered email address with subject "Delete my account." We process within 7 business days. Note: Pro plan transaction records are retained for 7 years as required by Indian financial law, even after account deletion.'
              },
              {
                q: 'What happens if a supporter\'s payment goes to the wrong creator?',
                a: 'On the free plan, payments go directly via UPI and we cannot intercept or reverse them. Always verify the creator\'s username in the URL before paying. On the Pro plan (Razorpay Route), payments are routed via Razorpay and disputes can be raised through them. We always recommend verifying before you pay.'
              },
              {
                q: 'Is Fuel My Chai safe to use? Is it RBI-compliant?',
                a: 'Free plan: yes. We generate links and QR codes — money flows through NPCI\'s UPI infrastructure, which is regulated by RBI. We are not a payment processor. Pro plan: payments route through Razorpay, which holds a valid RBI Payment Aggregator license. We operate under their license as a marketplace platform.'
              },
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}

            <div className="mt-8 rounded-2xl border border-white/8 bg-stone-900/60 p-6 text-center">
              <p className="text-sm text-white/50">Still have a question?</p>
              <button
                onClick={() => setActiveTab('form')}
                className="btn-primary mt-4 px-8 py-2.5 text-sm"
              >
                Send us a message
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 text-center text-xs text-white/20">
          Fuel My Chai · hello@fuelmychai.com · Mumbai, India
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all ${open ? 'border-amber-400/20 bg-stone-900/80' : 'border-white/8 bg-stone-900/40'}`}>
      <button
        className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className={`text-sm font-semibold transition ${open ? 'text-amber-400' : 'text-white/70'}`}>
          {question}
        </span>
        <span className={`mt-0.5 shrink-0 text-xs transition-transform ${open ? 'rotate-180 text-amber-400' : 'text-white/30'}`}>▼</span>
      </button>
      {open && (
        <div className="border-t border-white/6 px-6 pb-5 pt-4">
          <p className="text-sm leading-7 text-white/50">{answer}</p>
        </div>
      )}
    </div>
  );
}
