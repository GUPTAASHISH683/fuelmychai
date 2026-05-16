import { Link } from 'react-router-dom';

function Section({ number, title, children }) {
  return (
    <div className="mt-10 first:mt-0">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">
          {number}
        </span>
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-white/50">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Table({ rows }) {
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-white/8">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/8 bg-white/4">
            {rows[0].map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-white/70">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, ri) => (
            <tr key={ri} className="border-b border-white/5 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-white/40">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoBox({ icon, title, children }) {
  return (
    <div className="my-3 rounded-xl border border-amber-400/15 bg-amber-400/6 px-4 py-3">
      <p className="text-xs font-semibold text-amber-400 mb-1">{icon} {title}</p>
      <p className="text-xs leading-6 text-amber-200/60">{children}</p>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-amber-400/60 transition hover:text-amber-400">
            ← Back to home
          </Link>
        </div>

        <span className="section-tag">Legal</span>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/40">Last updated: May 2025 · Applies to all plans</p>

        {/* Summary */}
        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/6 p-6">
          <p className="text-sm font-semibold text-amber-400 mb-2">What matters most — in plain English</p>
          <ul className="space-y-2 text-sm leading-6 text-white/60">
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> We never sell your data to anyone, ever.</li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Free plan: we never see any payment data. Money flows directly via UPI.</li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Your UPI ID is stored encrypted in our database.</li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> We use hashed (not raw) IPs and device fingerprints for fraud prevention only.</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">~</span> Pro plan: Razorpay collects your PAN and bank details for KYC — under their own privacy policy.</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">~</span> We may share data with law enforcement if legally required or if fraud is detected.</li>
          </ul>
        </div>

        <div className="mt-8 rounded-2xl border border-white/8 bg-stone-900/60 p-6 sm:p-10 space-y-0 divide-y divide-white/6">

          <Section number="1" title="Who We Are">
            <p>
              Fuel My Chai ("we", "us", "Platform") is based in Mumbai, India. We build creator support tools for Indian content creators.
              Questions: <a href="mailto:hello@fuelmychai.com" className="text-amber-400 hover:underline">hello@fuelmychai.com</a>
            </p>
            <p>
              This policy applies to all users of fuelmychai.in — both creators (registered accounts)
              and visitors (people who view public chai pages).
            </p>
          </Section>

          <Section number="2" title="Data We Collect — Creators (Registered Accounts)">
            <p><strong className="text-white">2.1 At Sign-up (via Google OAuth):</strong></p>
            <Table rows={[
              ['Data', 'Why we collect it', 'Stored?'],
              ['Google Account ID (sub)', 'Unique identifier — links your Google account to your profile', 'Yes'],
              ['Email address', 'Account management, email notifications, security alerts', 'Yes'],
              ['Display name', 'Pre-fills your profile name', 'Yes'],
              ['Google profile picture URL', 'Pre-fills your profile photo', 'URL only'],
            ]} />

            <p><strong className="text-white">2.2 Profile data you add voluntarily:</strong></p>
            <Table rows={[
              ['Data', 'Why we collect it', 'Stored?'],
              ['Username', 'Your public page URL (fuelmychai.in/username)', 'Yes'],
              ['Bio (up to 200 chars)', 'Shown on your public chai page', 'Yes'],
              ['UPI ID', 'Used to generate your payment QR code', 'Yes, encrypted'],
              ['Profile image', 'Shown on your chai page and dashboard', 'Cloudinary CDN'],
              ['Chai support amounts', 'Displayed as preset buttons on your public page', 'Yes'],
              ['Social media links', 'Optional — displayed on your public page', 'Yes'],
            ]} />

            <InfoBox icon="🔐" title="UPI ID Privacy">
              Your UPI ID is stored with AES encryption in our database. On the free plan, it is
              embedded in your QR code and UPI deep link — which means a QR decoder app can
              extract it. On Pro plan with Razorpay Route, your UPI ID is never exposed to the
              frontend at all — supporters only see a masked Fuel My Chai payment link.
              We strongly recommend using a non-phone-number UPI ID on the free plan.
            </InfoBox>

            <p><strong className="text-white">2.3 Fraud prevention data (all hashed — never raw):</strong></p>
            <Table rows={[
              ['Data', 'How it is stored', 'Purpose'],
              ['IP address', 'SHA-256 one-way hash — raw IP never stored', 'Detect ban evasion, coordinated fraud'],
              ['Device fingerprint', 'SHA-256 hash of browser attributes', 'Detect account resurrection after bans'],
              ['Referrer / UTM data', 'Aggregated bucket (Instagram, YouTube, etc.)', 'Analytics for creators and fraud patterns'],
            ]} />
            <p>
              We cannot reverse hashed values back to raw IPs or device identifiers. This data is
              used only for platform integrity and is never sold or shared for advertising.
            </p>
          </Section>

          <Section number="3" title="Data We Collect — Visitors (Public Page Visitors)">
            <p>
              When someone visits a public chai page (fuelmychai.in/username), we collect:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>A page visit count increment (raw number, no personal data)</li>
              <li>Hashed IP address (fraud pattern detection only)</li>
              <li>Referrer category (which platform sent the visitor — e.g., Instagram, Direct)</li>
              <li>Event type: did they view the page, scan the QR, or click the Pay button (mobile)</li>
              <li>Supporter name and message (only if they voluntarily type it before clicking Pay — not stored unless creator has Pro message wall)</li>
            </ul>
            <p>
              <strong className="text-white">We do not collect:</strong> supporter payment amounts,
              UPI transaction IDs, bank details, or any confirmation that a payment occurred.
              On the free plan, payments flow directly via UPI and we have zero visibility into them.
            </p>
          </Section>

          <Section number="4" title="Pro Plan — Additional Data (Razorpay Route)">
            <p>
              Pro plan creators who activate masked UPI routing are subject to Razorpay's KYC process.
              The following data is collected by <strong className="text-white">Razorpay</strong> (not by us)
              and subject to <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Razorpay's Privacy Policy</a>:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>PAN card number</li>
              <li>Bank account details (account number + IFSC)</li>
              <li>Identity verification documents (as required by Razorpay KYC)</li>
            </ul>
            <p>
              Data we additionally store for Pro plan:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Razorpay linked account ID (a reference key — not financial data)</li>
              <li>Transaction records: amount (in paise), platform fee, creator settlement amount, supporter message, supporter name (if given), payment status — received via Razorpay webhooks</li>
              <li>Payout records: settlement amount, Razorpay transfer ID, settlement timestamp</li>
            </ul>
            <InfoBox icon="💡" title="Pro Plan Supporter Messages">
              If a supporter leaves their name and a message on a Pro creator's page, we store
              that name and message in our database to display on the creator's public supporter wall.
              Supporters are informed of this before they submit. Names can be "Anonymous."
            </InfoBox>
          </Section>

          <Section number="5" title="How We Use Your Data">
            <p>We use data only for these purposes:</p>
            <Table rows={[
              ['Purpose', 'Legal basis', 'Applies to'],
              ['Running your public chai page', 'Contract (account agreement)', 'Creators'],
              ['Authentication and session management', 'Contract', 'Creators'],
              ['Email notifications (milestones, weekly digest, UPI alerts)', 'Consent (opt-in at signup)', 'Creators'],
              ['Fraud detection and ban enforcement', 'Legitimate interest (platform safety)', 'All users'],
              ['Pro plan payment processing and settlement', 'Contract (Pro subscription)', 'Pro creators'],
              ['Tax and legal compliance', 'Legal obligation', 'Pro creators'],
              ['Responding to your support requests', 'Contract', 'All users'],
            ]} />
            <p>
              <strong className="text-white">We never use your data for:</strong> advertising to you,
              selling to third parties, building advertising profiles, or any purpose beyond
              operating this platform.
            </p>
          </Section>

          <Section number="6" title="Email Communications">
            <p>By creating an account, you consent to receiving:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li><strong className="text-white">Transactional emails</strong> — account security (UPI ID change alerts, login from new device). These cannot be opted out of as they are for your security.</li>
              <li><strong className="text-white">Product emails</strong> — page milestone celebrations (first visit, 100 visits, etc.), weekly digest. You can unsubscribe from these in your dashboard settings.</li>
              <li><strong className="text-white">Pro plan emails</strong> — payment received notifications, payout confirmations, KYC status. Cannot be opted out of while on Pro plan.</li>
            </ul>
            <p>We use a third-party email provider (SendGrid or Resend) to deliver these emails. Your email address is shared with them solely for delivery.</p>
          </Section>

          <Section number="7" title="Third-Party Services We Use">
            <Table rows={[
              ['Service', 'What they receive', 'Their privacy policy'],
              ['Google OAuth', 'Your Google sub, email, name', 'policies.google.com/privacy'],
              ['Cloudinary', 'Profile images you upload', 'cloudinary.com/privacy'],
              ['Railway (USA)', 'Hosts our PostgreSQL database', 'railway.app/legal/privacy'],
              ['Razorpay (Pro only)', 'KYC data, payment routing', 'razorpay.com/privacy'],
              ['SendGrid / Resend', 'Your email address for delivery', 'sendgrid.com/policies/privacy'],
            ]} />
            <p>
              We do not use Google Analytics, Facebook Pixel, or any advertising trackers.
              No third party receives your data for advertising or marketing purposes.
            </p>
          </Section>

          <Section number="8" title="Data Retention">
            <ul className="ml-4 list-disc space-y-1.5">
              <li><strong className="text-white">Active accounts:</strong> retained until you request deletion</li>
              <li><strong className="text-white">Hashed IP / device fingerprints:</strong> 12 months, then purged automatically</li>
              <li><strong className="text-white">Supporter messages (Pro):</strong> retained while the creator's account is active</li>
              <li><strong className="text-white">Transaction records (Pro):</strong> 7 years for legal / tax compliance purposes</li>
              <li><strong className="text-white">Banned account records:</strong> permanently retained to prevent ban evasion (Google ID + hashed IP + hashed device fingerprint only)</li>
              <li><strong className="text-white">Page visit event logs:</strong> 90 days rolling window</li>
            </ul>
          </Section>

          <Section number="9" title="Security">
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Sessions managed via httpOnly JWT cookies — inaccessible to JavaScript</li>
              <li>UPI IDs stored with AES encryption at rest</li>
              <li>Database access restricted to application servers only (no public access)</li>
              <li>All data in transit encrypted via TLS 1.2+</li>
              <li>Profile images served via Cloudinary CDN (not our servers)</li>
              <li>Rate limiting on sensitive endpoints (login, profile changes)</li>
              <li>Passwords: we don't store any (Google OAuth only)</li>
            </ul>
            <p>
              Despite these measures, no system is 100% secure. In the event of a data breach
              affecting your personal data, we will notify you within 72 hours as required by
              India's DPDP Act 2023.
            </p>
          </Section>

          <Section number="10" title="Your Rights (India DPDP Act 2023)">
            <p>Under the Digital Personal Data Protection Act 2023, you have the right to:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li><strong className="text-white">Access</strong> — request a copy of all personal data we hold about you</li>
              <li><strong className="text-white">Correction</strong> — correct inaccurate data (most data editable directly in your dashboard)</li>
              <li><strong className="text-white">Erasure</strong> — request deletion of your account and personal data (7 business day processing time)</li>
              <li><strong className="text-white">Grievance redressal</strong> — raise a complaint with our Data Protection Officer</li>
              <li><strong className="text-white">Nominate</strong> — nominate a person to exercise these rights in case of death or incapacity</li>
            </ul>
            <p>
              To exercise any right: email <a href="mailto:hello@fuelmychai.com" className="text-amber-400 hover:underline">hello@fuelmychai.com</a> with
              subject "Privacy Request — [Right]". We respond within 7 business days.
              Note: transaction records on Pro plan are retained for 7 years regardless of deletion
              request, as required by Indian financial compliance law.
            </p>
          </Section>

          <Section number="11" title="Law Enforcement and Legal Disclosures">
            <p>
              We may disclose your personal data without notice if required by:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Valid court order, summons, or legal process under Indian law</li>
              <li>A request from cybercrime authorities (under IT Act 2000)</li>
              <li>Financial Intelligence Unit (FIU-IND) under PMLA 2002</li>
              <li>NPCI or RBI in connection with payment fraud investigation</li>
            </ul>
            <p>
              Where legally permitted, we will attempt to notify you before disclosing.
              We will not comply with requests from foreign governments unless routed through
              valid Mutual Legal Assistance Treaty (MLAT) processes.
            </p>
          </Section>

          <Section number="12" title="Children">
            <p>
              The Platform is not directed at children under 13. Creators must be 18 or older
              (or have verifiable parental consent if between 13–18). If we become aware that
              a user under 13 has created an account without parental consent, we will delete
              their data promptly. To report a suspected underage account:
              <a href="mailto:hello@fuelmychai.com" className="ml-1 text-amber-400 hover:underline">hello@fuelmychai.com</a>
            </p>
          </Section>

          <Section number="13" title="Changes to This Policy">
            <p>
              We may update this policy. Material changes will be communicated by email to
              registered creators at least 7 days before they take effect. The "Last updated"
              date at the top always reflects the most recent revision. Continued use of
              the Platform after changes constitutes acceptance.
            </p>
          </Section>

          <Section number="14" title="Contact and Grievance Officer">
            <p>
              For privacy questions, data requests, or to raise a grievance:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Email: <a href="mailto:hello@fuelmychai.com" className="text-amber-400 hover:underline">hello@fuelmychai.com</a></li>
              <li>Subject line: "Privacy Request" or "Data Grievance"</li>
              <li>Response time: within 7 business days</li>
              <li>Contact form: <Link to="/contact" className="text-amber-400 hover:underline">fuelmychai.in/contact</Link></li>
            </ul>
            <p>
              If your grievance is not resolved within 30 days, you may escalate to the
              Data Protection Board of India once operational under the DPDP Act 2023.
            </p>
          </Section>

        </div>

        <div className="mt-8 text-center text-xs text-white/20">
          Fuel My Chai. · Mumbai, India
        </div>
      </div>
    </div>
  );
}
