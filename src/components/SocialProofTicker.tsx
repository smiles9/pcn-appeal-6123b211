import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Got my £130 PCN cancelled in 14 days. The appeal letter was spot on — referenced the exact legislation.",
    name: "Sarah M.",
    location: "Camden, London",
    saved: "£130",
  },
  {
    text: "I thought I had no chance but the AI found a signage issue I completely missed. Full refund!",
    name: "James T.",
    location: "Manchester",
    saved: "£70",
  },
  {
    text: "Used it twice now, won both times. The letter was more professional than what a solicitor wrote for my mate.",
    name: "Priya K.",
    location: "Birmingham",
    saved: "£210",
  },
  {
    text: "Council accepted my appeal within a week. Best £3 I've ever spent.",
    name: "David R.",
    location: "Bristol",
    saved: "£110",
  },
  {
    text: "Appealed a private parking charge at a hospital. Letter cited the BPA code of practice perfectly.",
    name: "Emma L.",
    location: "Leeds",
    saved: "£100",
  },
];

// Double the list for seamless looping
const tickerItems = [...testimonials, ...testimonials];

const SocialProofTicker = () => {
  return (
    <div className="w-full overflow-hidden border-y border-border bg-muted/50 py-3">
      <motion.div
        className="flex gap-4 px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 35,
            ease: "linear",
          },
        }}
      >
        {tickerItems.map((t, i) => (
          <div
            key={i}
            className="flex w-[280px] shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <Quote className="h-3.5 w-3.5 text-accent" />
            <p className="text-xs leading-relaxed text-foreground/90">
              {t.text}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.location}</p>
              </div>
              <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                Saved {t.saved}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SocialProofTicker;
