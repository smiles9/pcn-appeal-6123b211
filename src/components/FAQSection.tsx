import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

const generalFaqs = [
  {
    q: "What types of parking tickets can I appeal?",
    a: "We support parking tickets from any country — government-issued fines, municipal penalty notices, and private parking charges. Just upload a photo or describe your ticket and our AI will auto-detect the jurisdiction and applicable laws.",
  },
  {
    q: "How does the free ticket audit work?",
    a: "Upload a photo of your parking ticket or type in the details. Our AI detects your country, analyses the notice for procedural errors, signage issues, and legal technicalities — all for free. You only pay if you want the full appeal letter.",
  },
  {
    q: "How much does the appeal letter cost?",
    a: "A full, professionally drafted appeal letter costs just £4.99 — a fraction of what you'd pay a lawyer, and far less than the fine itself.",
  },
  {
    q: "What's the success rate?",
    a: "Our users report a 73% average success rate on appeals. Rates vary by country — UK leads at ~78%, followed by Australia (~72%), Canada (~68%), USA (~65%), and Germany (~61%).",
  },
  {
    q: "How long does the appeal process take?",
    a: "You'll receive your appeal letter within 30 seconds. Once submitted to the issuing authority, response times vary by jurisdiction — typically 14–28 days.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. All uploads are encrypted and we never share your personal information. Images are processed securely and not stored after your appeal is generated.",
  },
];

const countryFaqs: Record<string, { flag: string; label: string; faqs: { q: string; a: string }[] }> = {
  uk: {
    flag: "🇬🇧",
    label: "UK",
    faqs: [
      {
        q: "What's the difference between a council PCN and a private parking charge?",
        a: "Council PCNs are issued under the Traffic Management Act 2004 and are enforceable by law. Private charges are invoices under the Protection of Freedoms Act 2012 (PoFA) — they're contractual, not criminal, and have weaker enforcement. Private operators must follow strict rules (e.g., serving a Notice to Keeper within 14 days) or lose the right to pursue the keeper.",
      },
      {
        q: "Do I have to pay a private parking ticket?",
        a: "Not necessarily. Under PoFA 2012 Schedule 4, the operator must prove adequate signage, a valid contract, and correct procedure. If they failed to issue a Notice to Keeper within the required timeframe or their signs don't meet BPA/IPC Code of Practice standards, the charge may be unenforceable. The Supreme Court case ParkingEye v Beavis [2015] also set limits on proportionality.",
      },
      {
        q: "What is the 10-minute grace period?",
        a: "Under Section 71 of the Deregulation Act 2015, councils must allow a 10-minute grace period after on-street paid parking expires before issuing a PCN. If your ticket was issued within this window, it should be cancelled.",
      },
      {
        q: "Where do I appeal a UK parking ticket?",
        a: "For council PCNs: make informal representations to the council, then formal representations, then appeal to the Traffic Penalty Tribunal (England & Wales) or the Parking and Bus Lane Tribunal (Scotland). For private charges: appeal to POPLA (BPA members) or IAS (IPC members).",
      },
    ],
  },
  us: {
    flag: "🇺🇸",
    label: "USA",
    faqs: [
      {
        q: "Can I fight a parking ticket in the US?",
        a: "Yes. Every city has a formal dispute process. In NYC, you contest via the NYC Department of Finance or appear before an Administrative Law Judge. In LA, you request an initial review then an administrative hearing. Most cities allow online, mail, or in-person disputes.",
      },
      {
        q: "What are common defenses for US parking tickets?",
        a: "Missing or obscured signage (must comply with MUTCD standards), broken or malfunctioning meters, incorrect information on the ticket (wrong plate, VIN, location), expired parking authority registration, ADA violations issued incorrectly, and due process failures under the 14th Amendment.",
      },
      {
        q: "How long do I have to contest a US parking ticket?",
        a: "It varies by city. NYC gives 30 days, Chicago gives 21 days, LA gives 21 days for initial review. Missing the deadline usually means the fine increases or you lose the right to appeal. Check your ticket for the specific deadline.",
      },
      {
        q: "Will an unpaid parking ticket affect my credit?",
        a: "In many cities, yes. Unpaid tickets can be sent to collections, which impacts your credit score. In NYC, unpaid tickets can also result in booting or towing. It's better to dispute the ticket than ignore it.",
      },
    ],
  },
  au: {
    flag: "🇦🇺",
    label: "Australia",
    faqs: [
      {
        q: "How do I challenge a parking fine in Australia?",
        a: "Each state has its own process. In NSW, request an internal review under the Fines Act 1996 (s24A). In Victoria, apply for internal review under the Infringements Act 2006 (s22). You can also request the matter be heard in court. Our AI generates the correct letter for your state.",
      },
      {
        q: "What are common grounds for appeal in Australia?",
        a: "Incorrect or unclear signage (must comply with Australian Standards AS1742), faulty parking meters, unclear time restrictions, exemptions for loading/unloading, medical emergencies, and disproportionate fines. First-time offences often receive leniency on internal review.",
      },
      {
        q: "Can I request evidence from the council?",
        a: "Yes. Under GIPA Act (NSW) or FOI legislation in other states, you can request photos, officer notes, and signage records. If the council can't produce adequate evidence, this strengthens your appeal significantly.",
      },
    ],
  },
  ca: {
    flag: "🇨🇦",
    label: "Canada",
    faqs: [
      {
        q: "How do I dispute a parking ticket in Canada?",
        a: "In Ontario, you can request a trial under the Provincial Offences Act — the city must prove the offence beyond reasonable doubt. In BC, dispute via the city's dispute process. In most provinces, you have 15–30 days to file a dispute. Our AI tailors the response to your province.",
      },
      {
        q: "What defenses work for Canadian parking tickets?",
        a: "Unclear or missing signage (per Transportation Association of Canada guidelines), meter malfunctions, procedural defects on the ticket (wrong date, location, plate), inconsistent by-law application, and emergencies. In Toronto, Municipal Code Chapter 950 has specific requirements that officers frequently fail to follow.",
      },
      {
        q: "What happens if I ignore a parking ticket in Canada?",
        a: "Unpaid municipal tickets can prevent you from renewing your vehicle registration or licence plates. In Ontario, unpaid fines over $10,000 can result in licence suspension. It's always better to dispute than ignore.",
      },
    ],
  },
  de: {
    flag: "🇩🇪",
    label: "Germany",
    faqs: [
      {
        q: "How do I object to a parking fine (Bußgeldbescheid) in Germany?",
        a: "You file an Einspruch (objection) with the Ordnungsamt within 14 days of receiving the notice, as per the Ordnungswidrigkeitengesetz (OWiG) §67. If rejected, the case goes to the Amtsgericht (local court). Our AI drafts the objection in formal English with all German legal references.",
      },
      {
        q: "What are common defenses for German parking tickets?",
        a: "Inadequate or non-compliant signage (StVO §39-43), measurement or documentation errors by the officer, proportionality principle violations, unclear zone markings, incorrect Bußgeldkatalog classification, and procedural defects in the notice itself.",
      },
      {
        q: "Can I appeal a German parking ticket from abroad?",
        a: "Yes. Under EU Directive 2015/413 on cross-border enforcement, you have the same objection rights. File your Einspruch in writing within 14 days. Our AI generates the letter with correct OWiG references so you can send it by post or email.",
      },
    ],
  },
};

const countryKeys = Object.keys(countryFaqs);

const FAQSection = () => {
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  const displayedFaqs = activeCountry
    ? countryFaqs[activeCountry].faqs
    : generalFaqs;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mx-auto w-full max-w-lg px-4 py-8"
    >
      <div className="mb-4 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Frequently Asked Questions</h2>
      </div>

      {/* Country filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCountry(null)}
          className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
            activeCountry === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          General
        </button>
        {countryKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveCountry(key)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
              activeCountry === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {countryFaqs[key].flag} {countryFaqs[key].label}
          </button>
        ))}
      </div>

      <Accordion type="single" collapsible className="w-full">
        {displayedFaqs.map((faq, i) => (
          <AccordionItem key={`${activeCountry}-${i}`} value={`faq-${i}`} className="border-border">
            <AccordionTrigger className="text-left text-xs font-semibold text-foreground hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
};

export default FAQSection;
