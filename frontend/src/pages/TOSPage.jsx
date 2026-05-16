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

function Highlight({ children }) {
  return (
    <div className="my-3 rounded-xl border border-amber-400/15 bg-amber-400/6 px-4 py-3 text-amber-200/70">
      {children}
    </div>
  );
}

function RedHighlight({ children }) {
  return (
    <div className="my-3 rounded-xl border border-red-400/20 bg-red-400/6 px-4 py-3 text-red-300/70">
      {children}
    </div>
  );
}

export default function TOSPage() {
  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-amber-400/60 transition hover:text-amber-400">
            ← Back to home
          </Link>
        </div>

        <span className="section-tag">Legal</span>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-white/40">Last updated: May 2025 · Effective immediately for all users</p>

        {/* Quick summary card */}
        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/6 p-6">
          <p className="text-sm font-semibold text-amber-400 mb-2">Plain-language summary</p>
          <p className="text-sm leading-7 text-white/60">
            Fuel My Chai is a creator support tool, not a payment processor or donation platform.
            Free plan: we generate UPI links and QR codes — money flows directly between supporters
            and creators, we never touch it. Pro plan: payments route via Razorpay under their PA
            license. We are not responsible for failed transactions, fraud between users, or how
            creators spend their support income. We take platform integrity seriously — fraud,
            impersonation, and fake campaigns will result in immediate bans.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/8 bg-stone-900/60 p-6 sm:p-10 space-y-0 divide-y divide-white/6">

          <Section number="1" title="Acceptance of Terms">
            <p>
              By creating an account, accessing, or using Fuel My Chai ("the Platform", "we", "us"),
              you agree to these Terms of Service and our <Link to="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link>.
              If you do not agree, do not use the Platform. These terms apply to creators (anyone with a chai page)
              and visitors (anyone who views a public chai page).
            </p>
            <p>You must be at least <strong className="text-white">18 years old</strong> to register as a creator and receive
              UPI payments. Visitors must be at least 13 years old. If you are between 13 and 18,
              you may use the Platform only with verifiable parental or guardian consent.
            </p>
          </Section>

          <Section number="2" title="What Fuel My Chai Is (and Is Not)">
            <p><strong className="text-white">Free Plan — Link Generator:</strong> On the free plan, Fuel My Chai
              generates UPI payment links and QR codes. We do <em>not</em>:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Process, hold, receive, or disburse any payments</li>
              <li>Act as a payment gateway, payment aggregator, or escrow service</li>
              <li>Verify whether any UPI transaction succeeded, failed, or was reversed</li>
              <li>Guarantee delivery of funds to any creator</li>
            </ul>
            <p>
              All free-plan payments happen exclusively between the supporter and the creator
              through India's UPI infrastructure (NPCI). Fuel My Chai is not a party to any transaction.
            </p>
            <p><strong className="text-white">Pro Plan — Razorpay Route:</strong> On the Pro plan, payments are
              routed through Razorpay's licensed Payment Aggregator infrastructure. In this case,
              Razorpay (not Fuel My Chai) holds a valid RBI PA license. We operate as a
              marketplace platform under Razorpay's license. Pro plan payments are subject to
              both these Terms and <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Razorpay's Terms of Service</a>.
            </p>
            <Highlight>
              ⚡ Fuel My Chai does not hold an RBI Payment Aggregator license independently.
              We are not a bank, NBFC, or regulated financial institution of any kind.
            </Highlight>
          </Section>

          <Section number="3" title="Creator Responsibilities">
            <p>By creating a chai page, you confirm and agree that you are:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>A real individual or registered entity — not a fake persona or representative of someone else without their written consent</li>
              <li>Using your own active UPI ID that you have rightful access to</li>
              <li>Responsible for verifying the accuracy of your UPI ID — we cannot recover misdirected payments</li>
              <li>Solely responsible for any income tax, GST, or other tax obligations arising from funds received</li>
              <li>Not using the platform to represent an NGO, charity, or religious trust without proof of registration</li>
              <li>Responsible for all content you post, including bios, profile images, and supporter messages</li>
            </ul>
            <p>
              <strong className="text-white">UPI ID Changes:</strong> Changing your UPI ID requires
              re-authentication via your registered email. A 24-hour delay applies before any new
              UPI ID becomes active on your public page. An email alert is sent to you immediately
              on any UPI ID change. If you did not initiate a change, contact us immediately.
            </p>
            <p>
              <strong className="text-white">Tax Compliance:</strong> Creator support income received via UPI
              may be taxable under Indian income tax law. We recommend consulting a Chartered Accountant.
              Pro plan creators with transaction volumes above ₹2.5 lakh/year will be prompted to
              provide their PAN number for platform records.
            </p>
          </Section>

          <Section number="4" title="Prohibited Uses — Read Carefully">
            <RedHighlight>
              Violations of this section result in immediate, permanent account termination.
              We reserve the right to report suspected fraud and money laundering to
              cybercrime authorities under the IT Act 2000 and PMLA 2002.
            </RedHighlight>

            <p><strong className="text-white">4.1 Fundraising and Donation Campaigns (Strictly Prohibited)</strong></p>
            <p>
              Fuel My Chai is a <em>creator support platform</em>, not a fundraising, crowdfunding,
              or charitable donation platform. The following are absolutely prohibited:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Medical emergency fundraisers (for yourself, family members, or third parties)</li>
              <li>Disaster relief, flood relief, accident victim, or hardship campaigns</li>
              <li>Campaigns run on behalf of another person without explicit written proof of authorization</li>
              <li>Using emotive language, illness, injury, or death to solicit support</li>
              <li>Representing registered NGOs, charities, or trusts without a verified account</li>
              <li>Setting targets or goals framed as "help me raise ₹X for [emergency]"</li>
            </ul>

            <p><strong className="text-white">4.2 Identity Fraud and Impersonation</strong></p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Creating a page impersonating a real creator, public figure, celebrity, or brand</li>
              <li>Using profile photos of real people without their consent</li>
              <li>Choosing a username designed to mislead supporters into thinking you are someone else</li>
              <li>Uploading AI-generated or stolen profile photos</li>
              <li>Registering usernames that closely resemble verified creators or well-known brands</li>
            </ul>

            <p><strong className="text-white">4.3 Financial Crimes</strong></p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Using the platform to launder money, structure transactions, or create false paper trails</li>
              <li>Coordinating fake supporter payments to yourself or associates</li>
              <li>Any activity that constitutes a Suspicious Transaction under PMLA 2002</li>
              <li>Operating multiple fake accounts to simulate supporter activity</li>
            </ul>

            <p><strong className="text-white">4.4 Content Violations</strong></p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Adult, explicit, or sexually suggestive content of any kind</li>
              <li>Content involving minors in any inappropriate context</li>
              <li>Hate speech, communal content, or content targeting individuals</li>
              <li>Spam, SEO manipulation, or keyword-stuffed bios designed to game search engines</li>
              <li>Investment schemes, crypto promotions, MLM or network marketing</li>
            </ul>
          </Section>

          <Section number="5" title="Platform Integrity and Fraud Detection">
            <p>
              We operate automated and manual systems to detect fraud, impersonation, and policy violations.
              These include:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Keyword and content screening of bios and usernames at save time</li>
              <li>Username similarity detection against existing creators and protected brand names</li>
              <li>Device fingerprinting (hashed) and IP-based pattern detection to identify ban evasion</li>
              <li>Image analysis via Google Vision API for explicit content and reverse-image fraud detection</li>
              <li>Behavioral anomaly detection (unusual traffic spikes, same-IP multi-visits)</li>
              <li>Community reporting via the "Report this page" button on all public pages</li>
            </ul>
            <p>
              <strong className="text-white">Account Actions:</strong> We may issue warnings, temporarily suspend,
              or permanently ban accounts that violate these terms. Bans apply across
              accounts — ban evasion via new Google accounts or devices constitutes a further violation.
              Creators may appeal via <a href="mailto:hello@fuelmychai.com" className="text-amber-400 hover:underline">hello@fuelmychai.com</a>.
            </p>
            <p>
              <strong className="text-white">Law Enforcement Cooperation:</strong> We will comply with
              valid legal orders and share data with cybercrime authorities, NPCI, or financial
              intelligence units where legally required or where we identify credible fraud.
            </p>
          </Section>

          <Section number="6" title="Pro Plan Terms">
            <p>
              The Pro plan is a paid subscription (₹149/month or ₹999/year). Pro features include
              masked UPI routing via Razorpay Route, full supporter message wall, advanced analytics,
              email notifications, custom themes, and removal of Fuel My Chai branding.
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Pro subscriptions are billed in advance and are non-refundable except as required by law</li>
              <li>Pro creators must complete Razorpay's KYC (PAN + bank account verification) to activate payment routing</li>
              <li>Razorpay deducts ~2.36% per transaction as their processing fee before settlement</li>
              <li>Platform fee: up to 5% of each transaction, deducted before creator settlement</li>
              <li>Settlements occur T+1 business days via Razorpay's standard schedule</li>
              <li>We reserve the right to withhold settlement if fraud is suspected, pending investigation</li>
              <li>Pro plan does not guarantee any minimum income or number of supporters</li>
            </ul>
            <Highlight>
              💡 Pro plan payment routing is powered by Razorpay's RBI-licensed PA infrastructure.
              Creator UPI IDs are stored encrypted and are never displayed to supporters.
            </Highlight>
          </Section>

          <Section number="7" title="Intellectual Property">
            <p>
              You retain ownership of content you create (bio text, uploaded images). By posting content
              on Fuel My Chai, you grant us a non-exclusive, royalty-free, worldwide license to display,
              reproduce, and distribute that content solely for the purpose of operating your public chai page.
              This license ends when you delete your account.
            </p>
            <p>
              The Fuel My Chai name, logo, design system, and codebase are our intellectual property.
              You may not copy, reproduce, or create derivative products based on the Platform without
              written permission.
            </p>
          </Section>

          <Section number="8" title="Disclaimers and Limitation of Liability">
            <p>
              The Platform is provided "as is" and "as available." To the maximum extent permitted by
              Indian law, Fuel My Chai disclaims all warranties, express or implied. We are not liable for:
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Failed, pending, reversed, or disputed UPI transactions on the free plan</li>
              <li>Losses from incorrect UPI IDs entered by creators</li>
              <li>Fraud perpetrated by creators against supporters or vice versa</li>
              <li>Loss of income due to account suspension following policy violations</li>
              <li>Platform downtime, data loss, or technical failures</li>
              <li>Actions of third-party services (Google, Razorpay, Cloudinary, Railway)</li>
            </ul>
            <p>
              Our total liability to you for any claim shall not exceed the amount you paid us
              in the 3 months preceding the claim.
            </p>
          </Section>

          <Section number="9" title="Governing Law and Disputes">
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to
              the exclusive jurisdiction of the courts of Mumbai, Maharashtra. We encourage
              resolving disputes informally first — email us at <a href="mailto:hello@fuelmychai.com" className="text-amber-400 hover:underline">hello@fuelmychai.com</a> before
              initiating any formal proceedings.
            </p>
          </Section>

          <Section number="10" title="Changes to These Terms">
            <p>
              We may update these terms. Changes are effective immediately upon posting.
              For material changes, we will email registered creators at least 7 days in advance.
              Continued use of the Platform after changes constitutes acceptance.
              If you disagree with revised terms, you may close your account.
            </p>
          </Section>

          <Section number="11" title="Contact and Reporting">
            <p>
              To report a fraudulent page: use the "Report this page" button on any public chai page.
            </p>
            <p>
              To report impersonation, abuse, or policy violations:
              <a href="mailto:hello@fuelmychai.com" className="ml-1 text-amber-400 hover:underline">hello@fuelmychai.com</a>
            </p>
            <p>
              To appeal an account suspension:
              <a href="mailto:hello@fuelmychai.com" className="ml-1 text-amber-400 hover:underline">hello@fuelmychai.com</a> with subject "Account Appeal"
            </p>
            <p>
              General questions: <Link to="/contact" className="text-amber-400 hover:underline">Contact page</Link>
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
