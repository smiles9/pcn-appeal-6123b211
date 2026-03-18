import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const TermsPage = () => (
  <HelmetProvider>
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms & Conditions | Ticket Crusader</title>
        <meta name="description" content="Terms and conditions for using the Ticket Crusader parking ticket appeal service." />
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
        <h1>Terms &amp; Conditions</h1>
        <p><strong>Last updated:</strong> 18 March 2026</p>

        <h2>1. About the Service</h2>
        <p>Ticket Crusader ("we", "us", "our") provides an AI-assisted parking ticket appeal letter generation service accessible at pcn-appeal.lovable.app (the "Service"). By using the Service, you agree to these Terms &amp; Conditions.</p>

        <h2>2. Eligibility</h2>
        <p>You must be at least 18 years old and legally capable of entering into a binding agreement to use this Service.</p>

        <h2>3. How the Service Works</h2>
        <ul>
          <li>You upload or describe your parking ticket (Penalty Charge Notice).</li>
          <li>Our AI analyses the ticket and identifies potential grounds for appeal.</li>
          <li>Upon payment of the applicable fee (currently £4.99), we generate a personalised appeal letter.</li>
          <li>You are responsible for submitting the appeal letter to the relevant authority.</li>
        </ul>

        <h2>4. No Legal Advice</h2>
        <p>The Service provides <strong>informational assistance only</strong> and does not constitute legal advice. We are not a law firm and do not provide legal representation. The generated appeal letters are suggestions based on common grounds for appeal. We recommend seeking independent legal advice for complex cases.</p>

        <h2>5. No Guarantee of Outcome</h2>
        <p>While our AI identifies potential grounds for appeal, <strong>we make no guarantee that any appeal will be successful</strong>. Success depends on the specific circumstances, the issuing authority, and applicable law.</p>

        <h2>6. Payment</h2>
        <ul>
          <li>Payment is processed securely via Stripe.</li>
          <li>The fee is charged per appeal letter generated.</li>
          <li>Promotional codes may be applied at checkout where available.</li>
        </ul>

        <h2>7. User Accounts</h2>
        <p>You may need to create an account to use the Service. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</p>

        <h2>8. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or to submit fraudulent appeals.</li>
          <li>Upload content that is illegal, offensive, or infringes third-party rights.</li>
          <li>Attempt to reverse-engineer, scrape, or abuse the Service.</li>
        </ul>

        <h2>9. Intellectual Property</h2>
        <p>All content, design, and technology of the Service are owned by Ticket Crusader. The appeal letters generated for you are licensed for your personal use in submitting appeals.</p>

        <h2>10. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Ticket Crusader shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to unsuccessful appeals or any penalties incurred.</p>

        <h2>11. Changes to Terms</h2>
        <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>

        <h2>12. Governing Law</h2>
        <p>These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

        <h2>13. Contact</h2>
        <p>If you have questions about these Terms, please contact us via our website.</p>
      </article>
    </div>
  </HelmetProvider>
);

export default TermsPage;
