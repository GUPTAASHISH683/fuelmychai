import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Reveal-on-scroll hook
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = '', delay = 0, ...props }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...props}>
      {children}
    </div>
  );
}

const FEATURES = [
  { icon: '₹', title: 'Zero Platform Fees', desc: 'Every rupee goes directly to you. We never take a cut. UPI is free and so are we.' },
  { icon: '⚡', title: '5-Minute Setup', desc: 'Sign in with Google, claim your username, add your UPI ID. Your page is live.' },
  { icon: '🔒', title: 'No Payment Processing', desc: 'We never touch your money. Supporters pay directly to your UPI app — GPay, PhonePe, Paytm.' },
  { icon: '📱', title: 'Mobile-First QR', desc: 'Auto-generated QR code updates in real-time. Supporters on desktop scan, mobile taps Pay.' },
  { icon: '🎨', title: 'Your Brand, Your Page', desc: 'Custom bio, profile photo, and amounts. Share fuelmychai.in/yourname everywhere.' },
  { icon: '📊', title: 'Page Analytics', desc: 'See how many people have visited your chai page. Know when your shoutout worked.' },
];

const STEPS = [
  { num: '01', title: 'Sign in with Google', desc: 'One click, no passwords. Your account is created instantly using your Google profile.' },
  { num: '02', title: 'Set up your page', desc: 'Add your UPI ID, a friendly bio, and choose your chai amounts — ₹30, ₹50, ₹100 or custom.' },
  { num: '03', title: 'Share your link', desc: 'Drop your fuelmychai.in/username link in your bio, posts, and reels. Done!' },
];

const ROADMAP = [
  { status: 'live', label: 'Live', item: 'UPI QR + Deep link payment page' },
  { status: 'live', label: 'Live', item: 'Google OAuth — zero-friction signup' },
  { status: 'live', label: 'Live', item: 'Custom chai amounts' },
  { status: 'live', label: 'Live', item: 'Page visit analytics' },
  { status: 'soon', label: 'Coming', item: 'Payment notifications via email' },
  { status: 'soon', label: 'Coming', item: 'Monthly supporter leaderboard' },
  { status: 'soon', label: 'Coming', item: 'Supporter messages & thank-you wall' },
  { status: 'soon', label: 'Coming', item: 'Multiple UPI ID support' },
  { status: 'future', label: 'Planned', item: 'Creator tiers & exclusive content' },
  { status: 'future', label: 'Planned', item: 'Supporter subscription / recurring chai' },
  { status: 'future', label: 'Planned', item: 'Custom domain mapping' },
  { status: 'future', label: 'Planned', item: 'iOS & Android app' },
];

// Visual mock of the chai page for the "screenshot" section
function ChaiPageMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-stone-900 shadow-2xl shadow-black/60">
      {/* Browser bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-stone-950 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-500/60" />
          <span className="size-2.5 rounded-full bg-yellow-500/60" />
          <span className="size-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="mx-auto rounded bg-stone-800 px-3 py-1 text-xs text-white/30">
          fuelmychai.in/priya
        </div>
      </div>
      {/* Page content */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
            🎨
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Buy Priya a Chai ☕</h3>
            <p className="text-xs text-white/40 mt-0.5">Digital illustrator & creator</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-xs text-white/50">Choose an amount</p>
          <div className="flex gap-2">
            {[30, 50, 100].map((a, i) => (
              <button key={a} className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${i === 1 ? 'bg-amber-400 text-stone-950' : 'border border-white/10 text-white/60'}`}>
                ₹{a}
              </button>
            ))}
          </div>
          <input
            readOnly
            className="w-full rounded-xl border border-white/10 bg-stone-800 px-3 py-2 text-xs text-white/30"
            placeholder="Leave a message (optional)"
          />
          <div className="flex items-center justify-center rounded-xl bg-stone-800 py-6 border border-white/10">
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({length: 49}).map((_, i) => (
                <div key={i} className={`size-3 rounded-sm ${Math.random() > 0.5 ? 'bg-amber-400' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-amber-400 py-2.5 text-center text-xs font-bold text-stone-950">
            Pay with UPI ↗
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard mock
function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-stone-900 shadow-2xl shadow-black/60">
      <div className="flex items-center gap-2 border-b border-white/10 bg-stone-950 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-500/60" />
          <span className="size-2.5 rounded-full bg-yellow-500/60" />
          <span className="size-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="mx-auto rounded bg-stone-800 px-3 py-1 text-xs text-white/30">
          fuelmychai.in/dashboard
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg">🎨</div>
          <div>
            <p className="text-xs font-semibold text-white">Priya's Dashboard</p>
            <p className="text-xs text-amber-400">fuelmychai.in/priya</p>
          </div>
          <div className="ml-auto rounded-lg bg-amber-400/15 px-2 py-1">
            <p className="text-xs font-bold text-amber-400">342 visits</p>
          </div>
        </div>
        {['Profile', 'UPI ID', 'Chai Amounts', 'Share'].map((s) => (
          <div key={s} className="rounded-xl border border-white/8 bg-stone-800/60 px-4 py-3">
            <p className="text-xs font-semibold text-white/80">{s}</p>
            <div className="mt-2 h-2 rounded-full bg-white/10 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 sm:pt-40">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/8 blur-3xl" />
          <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-orange-600/6 blur-3xl" />
          <div className="absolute top-60 -left-20 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="animate-fade-up mb-6 section-tag" style={{ animationDelay: '0ms' }}>
              <span>🇮🇳</span> Made for Indian Creators
            </div>

            {/* Main headline */}
            <h1
              className="animate-fade-up font-display text-5xl font-normal leading-tight sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '100ms', opacity: 0 }}
            >
              The easiest way to get
              <br />
              <span className="shimmer-text italic">chai support</span>
              <br />
              from your audience
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-lg leading-8 text-white/50"
              style={{ animationDelay: '200ms', opacity: 0 }}
            >
              Create a free UPI page in 5 minutes. Share your link. Let supporters pay you
              directly — no platform fees, no middlemen, ever.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row"
              style={{ animationDelay: '300ms', opacity: 0 }}
            >
              <Link to="/login" className="btn-primary px-8 py-4 text-base font-bold shadow-lg shadow-amber-400/20">
                ☕ Create your Chai page — Free
              </Link>
              <a href="#how-it-works" className="btn-ghost px-8 py-4 text-base">
                See how it works ↓
              </a>
            </div>

            {/* Trust signals */}
            <div
              className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
              style={{ animationDelay: '400ms', opacity: 0 }}
            >
              {['Zero platform fees', 'Direct UPI payment', '5-min setup', 'No payment gateway needed'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-white/40">
                  <svg className="size-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Hero mockup duo */}
          <div
            className="animate-fade-up relative mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2"
            style={{ animationDelay: '500ms', opacity: 0 }}
          >
            <div className="animate-float" style={{ animationDelay: '0s' }}>
              <ChaiPageMockup />
              <p className="mt-3 text-center text-xs text-white/30">Your public chai page</p>
            </div>
            <div className="animate-float sm:mt-10" style={{ animationDelay: '0.5s' }}>
              <DashboardMockup />
              <p className="mt-3 text-center text-xs text-white/30">Your creator dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <RevealDiv className="text-center">
            <span className="section-tag">How it works</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Live in <span className="shimmer-text italic">5 minutes</span>
            </h2>
            <p className="mt-4 text-white/50">Seriously. We timed it.</p>
          </RevealDiv>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <RevealDiv key={step.num} delay={i * 100} className="relative">
                <div className="card-glass p-8 text-center h-full">
                  <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
                    <span className="font-display text-2xl text-amber-400">{step.num}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-8 -right-3 hidden h-0.5 w-6 bg-gradient-to-r from-amber-400/40 to-transparent sm:block" />
                  )}
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/50">{step.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <RevealDiv className="text-center">
            <span className="section-tag">Features</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Everything you need,
              <br />
              <span className="shimmer-text italic">nothing you don't</span>
            </h2>
          </RevealDiv>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <RevealDiv key={f.title} delay={i * 80}>
                <div className="group card-glass h-full p-6 transition-all duration-300 hover:border-amber-400/20 hover:bg-white/6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/8 text-xl group-hover:border-amber-400/30 group-hover:bg-amber-400/15 transition-all">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/40">{f.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-amber-400/10 bg-gradient-to-br from-stone-900 to-stone-950 p-8 sm:p-14">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <RevealDiv>
                <span className="section-tag">Why Fuel My Chai?</span>
                <h2 className="mt-4 font-display text-4xl leading-tight">
                  Other platforms take a cut.
                  <br />
                  <span className="shimmer-text italic">We never do.</span>
                </h2>
                <p className="mt-5 text-white/50 leading-7">
                  Ko-fi, Buy Me a Coffee — they're great but built for global audiences.
                  Fuel My Chai is built from the ground up for India.
                  UPI is free. Your page is free. Forever.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    ['Fuel My Chai', 'free', true],
                    ['Other platforms', '5–10% per transaction', false],
                    ['PayPal / Stripe', 'Not available in India', false],
                  ].map(([platform, cost, good]) => (
                    <div key={platform} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${good ? 'border border-amber-400/20 bg-amber-400/8' : 'border border-white/5 bg-white/3'}`}>
                      <span className={`text-lg ${good ? 'text-amber-400' : 'text-white/20'}`}>
                        {good ? '✓' : '✗'}
                      </span>
                      <span className={`text-sm font-medium ${good ? 'text-white' : 'text-white/40'}`}>{platform}</span>
                      <span className={`ml-auto text-xs ${good ? 'font-bold text-amber-400' : 'text-white/25'}`}>
                        {cost}
                      </span>
                    </div>
                  ))}
                </div>
              </RevealDiv>

              <RevealDiv delay={150} className="grid grid-cols-2 gap-4">
                {[
                  { value: '₹0', label: 'Platform fees' },
                  { value: '5m', label: 'Avg setup time' },
                  { value: '100%', label: 'Goes to you' },
                  { value: '∞', label: 'Supporters' },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/4 p-6 text-center">
                    <span className="font-display text-4xl text-amber-400">{stat.value}</span>
                    <span className="mt-1 text-xs text-white/40">{stat.label}</span>
                  </div>
                ))}
              </RevealDiv>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROADMAP ─── */}
      <section id="roadmap" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <RevealDiv className="text-center">
            <span className="section-tag">Roadmap</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              We're just <span className="shimmer-text italic">getting started</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Fuel My Chai is growing fast. Here's what's live and what's brewing in the pot.
            </p>
          </RevealDiv>

          <RevealDiv delay={100} className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ROADMAP.map((item) => (
              <div
                key={item.item}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition ${
                  item.status === 'live'
                    ? 'border-amber-400/20 bg-amber-400/6'
                    : item.status === 'soon'
                    ? 'border-blue-400/15 bg-blue-400/4'
                    : 'border-white/6 bg-white/2'
                }`}
              >
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                    item.status === 'live'
                      ? 'bg-amber-400/20 text-amber-400'
                      : item.status === 'soon'
                      ? 'bg-blue-400/20 text-blue-400'
                      : 'bg-white/8 text-white/40'
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`text-sm ${
                    item.status === 'live' ? 'text-white' : item.status === 'soon' ? 'text-white/70' : 'text-white/35'
                  }`}
                >
                  {item.item}
                </span>
              </div>
            ))}
          </RevealDiv>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <RevealDiv>
            <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-stone-900 to-orange-900/10 p-12">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-400/15 blur-3xl" />
              </div>
              <div className="relative">
                <span className="text-5xl">☕</span>
                <h2 className="mt-4 font-display text-4xl sm:text-5xl">
                  Your audience wants to
                  <br />
                  <span className="shimmer-text italic">support you.</span>
                </h2>
                <p className="mt-4 text-white/50">
                  Don't make them struggle with payment links. Give them a page that works.
                </p>
                <Link
                  to="/login"
                  className="btn-primary mt-8 px-10 py-4 text-base font-bold shadow-xl shadow-amber-400/20 inline-flex"
                >
                  Create your free page →
                </Link>
                <p className="mt-4 text-xs text-white/25">No credit card. No hidden fees. Ever.</p>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>
    </div>
  );
}
