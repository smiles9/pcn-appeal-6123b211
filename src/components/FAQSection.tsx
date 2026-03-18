import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "When can I legally refuse to pay a private parking ticket?",
    a: "Under the Protection of Freedoms Act 2012, you don't have to pay if: the signage was inadequate or unclear, no proper Notice to Keeper was sent within 14 days, the charge exceeds a genuine pre-estimate of loss (per ParkingEye v Beavis [2015]), the operator isn't BPA/IPC accredited, or the required 10-minute grace period wasn't given.",
  },
  {
    q: "When can I challenge a council-issued PCN?",
    a: "Under the Traffic Management Act 2004 and TSRGD 2016, you can challenge if: road signs or markings were incorrect or missing, the PCN contains procedural errors (wrong date, code, or missing info), there were mitigating circumstances like a breakdown or medical emergency, the CEO didn't observe for long enough, or the contravention simply didn't occur — e.g. a valid permit was displayed.",
  },
  {
    q: "How does the free PCN audit work?",
    a: "Upload a photo of your parking ticket or type in the details. Our AI analyses the notice for procedural errors, signage issues, and legal technicalities — all for free. You only pay if you want the full appeal letter.",
  },
  {
    q: "What types of parking tickets can I appeal?",
    a: "We cover council-issued Penalty Charge Notices (PCNs), private parking charges from companies like ParkingEye, APCOA, and Excel, as well as bus lane and box junction fines.",
  },
  {
    q: "How much does the appeal letter cost?",
    a: "A full, professionally drafted appeal letter costs just £4.99 — a fraction of what you'd pay a solicitor, and far less than the fine itself.",
  },
  {
    q: "What's the success rate?",
    a: "Our users report a 73% success rate on appeals. The AI references specific legislation, council codes of practice, and procedural requirements to build the strongest possible case.",
  },
  {
    q: "How long does the appeal process take?",
    a: "You'll receive your appeal letter within 30 seconds. Once submitted to the council or parking company, most decisions come back within 14–28 days.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. All uploads are encrypted and we never share your personal information. Images are processed securely and not stored after your appeal is generated.",
  },
];

const FAQSection = () => {
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
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-border">
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
