import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Vidyut Sewa Portal" },
      { name: "description", content: "Frequently asked questions about registering and tracking electricity complaints with the Bihar Electricity Department." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  { q: "How do I register an electricity complaint?", a: "Click 'Register Complaint' on the top navigation, fill in your details and category, and submit. You'll receive a unique Complaint ID." },
  { q: "Can I file a complaint without logging in?", a: "Yes, complaints can be filed anonymously, but logging in lets you track history and edit your profile." },
  { q: "How long does resolution take?", a: "Urban outages: within 4 hours. Rural outages: within 12 hours. Billing/meter issues: within 7 working days." },
  { q: "How do I track my complaint?", a: "Use the 'Track' page and enter your Complaint ID (e.g. VB-20260719-1234). The current status and remarks will be shown." },
  { q: "I forgot my password — what do I do?", a: "Click 'Forgot password?' on the login page and enter your registered email. A reset link will be sent (demo mode)." },
  { q: "What are the emergency contact numbers?", a: "Power outage: 1912. Complaint Cell: 1800-345-1912. Bijli Sewa: 155333. Life-threatening emergencies: 112." },
  { q: "Is there any charge to file a complaint?", a: "No, filing a complaint is completely free of cost." },
  { q: "Can I upload an image of the issue?", a: "Yes, the complaint form accepts an optional image (e.g., a leaning pole or damaged wire) to help our field team." },
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-saffron">Help Center</div>
        <h1 className="mt-2 font-serif text-4xl font-bold text-primary">Frequently Asked Questions</h1>
      </div>
      <div className="mt-10 card-govt p-4 md:p-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
