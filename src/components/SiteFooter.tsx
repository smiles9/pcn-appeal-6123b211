import { Link } from "react-router-dom";

const SiteFooter = () => (
  <footer className="border-t border-border bg-muted/30 px-4 py-8">
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <img src="/favicon.png" alt="Ticket Crusader" className="h-4 w-4" />
        <span className="font-display text-xs font-bold text-primary">Ticket Crusader</span>
      </div>

      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link to="/terms" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
          Terms &amp; Conditions
        </Link>
        <Link to="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
          Privacy Policy
        </Link>
        <Link to="/refund" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
          Refund Policy
        </Link>
      </nav>

      <p className="text-[10px] text-muted-foreground">
        © {new Date().getFullYear()} Ticket Crusader. All rights reserved.
      </p>
    </div>
  </footer>
);

export default SiteFooter;
