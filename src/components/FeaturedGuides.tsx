import { Link } from "react-router-dom";
import { ArrowRight, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FeaturedGuides = () => {
  const { t } = useTranslation();

  const featured = [
    {
      city: "Manchester",
      title: "Manchester T2 (APCOA) Trap",
      slug: "manchester-airport-pcn-appeal-guide",
      description: "How to beat the new barrier-less £100 fines using the 'Non-Relevant Land' defense.",
      tag: "Trending",
    },
    {
      city: "Gatwick",
      title: "Gatwick Drop-off Charge",
      slug: "parking-ticket-appeal-gatwick",
      description: "Contesting NCP drop-off PCNs. Beating the 24-hour payment window trap.",
      tag: "New",
    },
    {
      city: "Heathrow",
      title: "Heathrow T5 (McDonald's) Trap",
      slug: "parking-ticket-appeal-heathrow-t5",
      description: "How to appeal the common validation failure at Heathrow Terminal 5 retail.",
      tag: "Hot",
    },
    {
      city: "Luton",
      title: "Luton Airport PCN",
      slug: "parking-ticket-appeal-luton",
      description: "Appealing drop-off and short-stay fines at Luton (LTN) airport.",
      tag: "Active",
    },
    {
      city: "Dallas",
      title: "Dallas Fort Worth (DFW)",
      slug: "parking-ticket-appeal-dallas",
      description: "International parking enforcement strategies for major US airport hubs.",
      tag: "Global",
    },
    {
      city: "Sacramento",
      title: "Sacramento Midtown",
      slug: "parking-ticket-appeal-sacramento",
      description: "Expert tactics for beating California municipal and private parking tickets.",
      tag: "US West",
    },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent fill-accent" />
          <h2 className="font-display text-lg font-bold text-foreground">
            Claw-Back Success Guides
          </h2>
        </div>
        <Link to="/guides" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-1">
        {featured.map((guide, idx) => (
          <motion.div
            key={guide.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              to={`/guides/${guide.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                  <MapPin className="h-3 w-3" />
                  {guide.city}
                </div>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                  {guide.tag}
                </span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                {guide.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGuides;
