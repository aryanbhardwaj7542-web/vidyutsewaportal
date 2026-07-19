import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Vidyut Sewa Portal" },
      { name: "description", content: "Get in touch with the Electricity Department, Bihar. Address, phone numbers and message form." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return toast.error("Please fill all fields.");
    if (form.message.length > 1000) return toast.error("Message must be under 1000 characters.");
    toast.success("Message sent. Our team will respond within 2 working days.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-saffron">We're here to help</div>
        <h1 className="mt-2 font-serif text-4xl font-bold text-primary">Contact Vidyut Sewa Portal</h1>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="card-govt p-6 flex gap-4">
            <MapPin className="h-6 w-6 text-primary shrink-0" />
            <div>
              <div className="font-semibold">Head Office</div>
              <div className="text-sm text-muted-foreground">Vidyut Bhawan, Bailey Road, Patna — 800001, Bihar</div>
            </div>
          </div>
          <div className="card-govt p-6 flex gap-4">
            <Phone className="h-6 w-6 text-primary shrink-0" />
            <div>
              <div className="font-semibold">Phone</div>
              <div className="text-sm text-muted-foreground">Office: 0612-2504745 · Helpline: 1912 · Bijli Sewa: 155333</div>
            </div>
          </div>
          <div className="card-govt p-6 flex gap-4">
            <Mail className="h-6 w-6 text-primary shrink-0" />
            <div>
              <div className="font-semibold">Email</div>
              <div className="text-sm text-muted-foreground">info@vidyut.bihar.gov.in</div>
            </div>
          </div>
          <div className="card-govt overflow-hidden">
            <iframe
              title="Vidyut Bhawan location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=85.11%2C25.60%2C85.15%2C25.63&layer=mapnik&marker=25.6165%2C85.1250"
              className="w-full h-64 border-0"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={submit} className="card-govt p-6 md:p-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-primary">Send a message</h2>
          <div>
            <label className="text-sm font-medium">Name</label>
            <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input required type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea required maxLength={1000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
