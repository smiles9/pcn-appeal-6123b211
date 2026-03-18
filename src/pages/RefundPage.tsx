import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const RefundPage = () => (
  <HelmetProvider>
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | Ticket Crusader</title>
        <meta name="description" content="Refund policy for Ticket Crusader's parking ticket appeal letter service." />
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
        <h1>Refund Policy</h1>
        <p><strong>Last updated:</strong> 18 March 2026</p>

        <h2>1. Digital Product</h2>
        <p>Ticket Crusader provides a digital service — AI-generated parking ticket appeal letters. As the appeal letter is delivered immediately upon payment, please read this policy carefully before purchasing.</p>

        <h2>2. When Refunds Are Available</h2>
        <p>We will issue a full refund in the following circumstances:</p>
        <ul>
          <li><strong>Service failure:</strong> If we fail to generate an appeal letter after payment due to a technical error on our end.</li>
          <li><strong>Duplicate charge:</strong> If you were charged more than once for the same appeal letter.</li>
          <li><strong>Incorrect analysis:</strong> If the AI analysis was based on a completely unrelated image or text (e.g., not a parking ticket at all) and you did not receive a usable output.</li>
        </ul>

        <h2>3. When Refunds Are Not Available</h2>
        <p>Due to the nature of digital products, refunds are <strong>not</strong> available in these cases:</p>
        <ul>
          <li>You received the appeal letter but your appeal was unsuccessful.</li>
          <li>You changed your mind after the letter was generated.</li>
          <li>You did not submit the appeal letter to the relevant authority.</li>
          <li>The parking ticket was valid and correctly issued.</li>
        </ul>

        <h2>4. How to Request a Refund</h2>
        <p>To request a refund, please contact us via our website within <strong>14 days</strong> of purchase. Include your account email and a brief description of the issue.</p>

        <h2>5. Processing Time</h2>
        <p>Approved refunds will be processed within 5–10 business days and returned to the original payment method via Stripe.</p>

        <h2>6. Consumer Rights</h2>
        <p>This policy does not affect your statutory rights under the Consumer Rights Act 2015 or the Consumer Contracts Regulations 2013.</p>
      </article>
    </div>
  </HelmetProvider>
);

export default RefundPage;
