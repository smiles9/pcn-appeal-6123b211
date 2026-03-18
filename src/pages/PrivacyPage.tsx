import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const PrivacyPage = () => (
  <HelmetProvider>
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Ticket Crusader</title>
        <meta name="description" content="How Ticket Crusader collects, uses, and protects your personal data." />
      </Helmet>

      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <span className="text-border">|</span>
          <Link to="/" className="flex items-center gap-1.5">
            <img src="/favicon.png" alt="Ticket Crusader" className="h-4 w-4" />
            <span className="font-display text-xs font-bold text-primary">Ticket Crusader</span>
          </Link>
        </div>
      </header>

      <article className="prose prose-sm mx-auto max-w-3xl px-4 py-10 text-foreground prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> 18 March 2026</p>

        <h2>1. Who We Are</h2>
        <p>Ticket Crusader operates the parking ticket appeal service at pcn-appeal.lovable.app. This policy explains how we collect, use, and protect your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

        <h2>2. Data We Collect</h2>
        <h3>Account Data</h3>
        <ul>
          <li>Email address (for account creation and communication)</li>
          <li>Password (stored securely, hashed)</li>
        </ul>

        <h3>Ticket Data</h3>
        <ul>
          <li>Images of parking tickets you upload</li>
          <li>Text descriptions of parking tickets you provide</li>
          <li>AI-generated analysis results and appeal letters</li>
        </ul>

        <h3>Payment Data</h3>
        <ul>
          <li>Payment is processed by <strong>Stripe</strong>. We do not store your card details. Stripe's privacy policy applies to payment processing.</li>
        </ul>

        <h3>Technical Data</h3>
        <ul>
          <li>Browser type, IP address, and device information (collected automatically)</li>
          <li>Usage data such as pages visited and features used</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <ul>
          <li><strong>Service delivery:</strong> To analyse your parking ticket and generate appeal letters.</li>
          <li><strong>Account management:</strong> To manage your account, login sessions, and appeal history.</li>
          <li><strong>Payment processing:</strong> To process payments via Stripe.</li>
          <li><strong>Service improvement:</strong> To improve our AI analysis and overall service quality.</li>
          <li><strong>Legal compliance:</strong> To comply with applicable laws and regulations.</li>
        </ul>

        <h2>4. Legal Basis for Processing</h2>
        <ul>
          <li><strong>Contract:</strong> Processing necessary to deliver the service you paid for.</li>
          <li><strong>Legitimate interest:</strong> Service improvement and fraud prevention.</li>
          <li><strong>Consent:</strong> Where you explicitly consent (e.g., optional communications).</li>
        </ul>

        <h2>5. Data Sharing</h2>
        <p>We do not sell your personal data. We share data only with:</p>
        <ul>
          <li><strong>Stripe:</strong> For secure payment processing.</li>
          <li><strong>Cloud infrastructure providers:</strong> For hosting and data storage.</li>
          <li><strong>AI processing services:</strong> For ticket analysis (data is processed securely and not used to train third-party models).</li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>We retain your data for as long as your account is active. Ticket images and appeal letters are stored for up to 12 months after generation. You may request deletion at any time.</p>

        <h2>7. Your Rights</h2>
        <p>Under UK GDPR, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Erase your data ("right to be forgotten")</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>To exercise any of these rights, contact us via our website.</p>

        <h2>8. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>

        <h2>9. Security</h2>
        <p>We implement appropriate technical and organisational measures to protect your data, including encryption in transit (TLS) and at rest, secure authentication, and access controls.</p>

        <h2>10. Children</h2>
        <p>The Service is not intended for individuals under 18. We do not knowingly collect data from minors.</p>

        <h2>11. Changes to This Policy</h2>
        <p>We may update this policy from time to time. We will notify users of material changes via email or a notice on the Service.</p>

        <h2>12. Contact</h2>
        <p>For privacy-related enquiries, please contact us via our website.</p>
      </article>
    </div>
  </HelmetProvider>
);

export default PrivacyPage;
