import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What types of parking tickets can I appeal?",
    a: "We support parking tickets from any country — government-issued fines, municipal penalty notices, and private parking charges. Just upload a photo or describe your ticket and our AI will auto-detect the jurisdiction and applicable laws.",
  },
  {
    q: "How does the free ticket audit work?",
    a: "Upload a photo of your parking ticket or type in the details. Our AI detects your country, analyses the notice for procedural errors, signage issues, and legal technicalities — all for free. You only pay if you want the full appeal letter.",
  },
  {
    q: "Which countries do you support?",
    a: "We support tickets from the UK, US, Canada, Australia, New Zealand, Germany, France, Italy, and many more. Our AI automatically detects the jurisdiction and applies the correct local laws and regulations.",
  },
  {
    q: "How much does the appeal letter cost?",
    a: "A full, professionally drafted appeal letter costs just £4.99 — a fraction of what you'd pay a lawyer, and far less than the fine itself.",
  },
  {
    q: "What's the success rate?",
    a: "Our users report a 73% success rate on appeals. The AI references specific legislation, codes of practice, and procedural requirements for your jurisdiction to build the strongest possible case.",
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
