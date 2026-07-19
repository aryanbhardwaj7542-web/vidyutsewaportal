import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, Gauge, FileText, AlertTriangle, Lightbulb, Cable, Wrench, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-power.jpg";
import { getComplaints, seedIfEmpty } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vidyut Sewa Portal — Electricity Complaints, Bihar" },
      { name: "description", content: "Register and track electricity complaints — power failures, meter faults, billing and infrastructure — with the Electricity Department, Bihar." },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: Zap, title: "Power Failure", desc: "Report outages in your area for quick restoration." },
  { icon: Gauge, title: "Meter Issue", desc: "Faulty readings, damaged or missing meters." },
  { icon: FileText, title: "Billing Issue", desc: "Incorrect charges, duplicate bills, corrections." },
  { icon: AlertTriangle, title: "Transformer Fault", desc: "Sparking, burnt or overloaded transformers." },
  { icon: Lightbulb, title: "Street Light", desc: "Non-functional or damaged street lights." },
  { icon: Cable, title: "Loose Wire", desc: "Dangling or unsafe overhead cables." },
  { icon: Wrench, title: "Pole Damage", desc: "Broken or leaning electric poles." },
  { icon: ShieldCheck, title: "Other Grievances", desc: "Any other issue related to power supply." },
];

function useCounter(target: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return n;
}

function StatCard({ label, value, active }: { label: string; value: number; active: boolean }) {
  const n = useCounter(value, active);
  return (
    <div className="card-govt p-6 text-center">
      <div className="font-serif text-4xl font-bold text-primary">{n.toLocaleString()}+</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function HomePage() {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [visible, setVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    seedIfEmpty();
    const all = getComplaints();
    setStats({
      total: 12480 + all.length,
      resolved: 11200 + all.filter(c => c.status === "Resolved").length,
      pending: 320 + all.filter(c => c.status !== "Resolved").length,
    });
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    if (statsRef.current) io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient text-primary-foreground">
        <img src={hero} alt="" width={1920} height={900} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:py-24 md:items-center">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-saffron" /> Government of Bihar · Electricity Department
            </div>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
              Reliable Power. <br /> Faster Resolutions.
            </h1>
            <p className="mt-4 max-w-lg text-base opacity-90 md:text-lg">
              File an electricity complaint online with Vidyut Sewa Portal and track it end-to-end. From power outages to billing disputes, we're committed to a swift response.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/complaint">
                <Button size="lg" className="bg-saffron text-primary hover:bg-saffron/90">
                  Register a Complaint <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20">
                  Track Complaint
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm opacity-90">
              <Phone className="h-4 w-4" /> 24×7 Helpline: <b>1912</b>
            </div>
          </div>

          <div className="fade-up md:justify-self-end w-full max-w-sm">
            <div className="rounded-xl bg-card p-6 text-card-foreground shadow-2xl">
              <div className="font-serif text-lg font-bold text-primary">Quick Status Check</div>
              <p className="mt-1 text-sm text-muted-foreground">Enter your complaint ID to see status.</p>
              <QuickTrack />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-saffron">Department Services</div>
          <h2 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">Everything you can report</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Choose a category and file your complaint — our field teams are alerted immediately.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="card-govt group p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="font-semibold">{s.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted/40 border-y">
        <div ref={statsRef} className="mx-auto max-w-7xl px-4 py-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Complaints Registered" value={stats.total} active={visible} />
          <StatCard label="Successfully Resolved" value={stats.resolved} active={visible} />
          <StatCard label="Districts Covered" value={38} active={visible} />
          <StatCard label="Field Technicians" value={2400} active={visible} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="card-govt overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="font-serif text-2xl font-bold text-primary md:text-3xl">Facing an electricity issue?</h3>
              <p className="mt-2 text-muted-foreground">
                Registering a complaint takes less than 2 minutes. You'll receive a unique complaint ID and status updates.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/complaint"><Button>Register Now</Button></Link>
                <Link to="/login"><Button variant="outline">Login / Register</Button></Link>
              </div>
            </div>
            <div className="hero-gradient p-8 text-primary-foreground md:p-12">
              <div className="font-semibold">Emergency Contacts</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between border-b border-white/10 pb-2"><span>Power Outage</span><b>1912</b></li>
                <li className="flex justify-between border-b border-white/10 pb-2"><span>Complaint Cell</span><b>1800-345-1912</b></li>
                <li className="flex justify-between border-b border-white/10 pb-2"><span>Bijli Sewa</span><b>155333</b></li>
                <li className="flex justify-between"><span>National Emergency</span><b>112</b></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function QuickTrack() {
  const [id, setId] = useState("");
  return (
    <form
      className="mt-4 flex gap-2"
      onSubmit={(e) => { e.preventDefault(); if (id.trim()) window.location.href = `/track?id=${encodeURIComponent(id.trim())}`; }}
    >
      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="e.g. VB-20260719-1234"
        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="submit">Track</Button>
    </form>
  );
}
