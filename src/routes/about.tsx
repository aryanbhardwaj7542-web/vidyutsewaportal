import { createFileRoute } from "@tanstack/react-router";
import { Building2, Target, Eye, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Department — Vidyut Sewa Portal" },
      { name: "description", content: "About the Electricity Department, Government of Bihar — mission, vision and services provided by Vidyut Sewa Portal." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-saffron">Electricity Department, Bihar</div>
        <h1 className="mt-2 font-serif text-4xl font-bold text-primary">About Vidyut Sewa Portal</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Vidyut Sewa Portal is the official grievance-redressal portal of Bihar's Electricity Department, headquartered at Vidyut Bhawan, Patna. We supply, distribute and maintain reliable electric power to every district of Bihar.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Card icon={Target} title="Our Mission">
          Provide uninterrupted, safe and affordable electricity to every household and enterprise in Bihar, with rapid grievance redressal and transparent operations.
        </Card>
        <Card icon={Eye} title="Our Vision">
          A digitally-enabled, citizen-first electricity utility that resolves 95% of complaints within 48 hours across all 38 districts.
        </Card>
        <Card icon={Building2} title="Infrastructure">
          Over 2,400 technicians, 38 district offices, thousands of transformers and substations, powering 1.8 crore consumers state-wide.
        </Card>
        <Card icon={Award} title="Citizen Charter">
          Complaint acknowledgement within 15 minutes, restoration of urban outages within 4 hours, and rural outages within 12 hours.
        </Card>
      </div>

      <div className="mt-12 card-govt p-8">
        <h2 className="font-serif text-2xl font-bold text-primary">Address</h2>
        <p className="mt-3 text-muted-foreground">
          Vidyut Bhawan, Bailey Road, Patna — 800001, Bihar, India
        </p>
        <p className="mt-2 text-muted-foreground">Office Hours: Mon – Sat, 10:00 AM to 5:30 PM</p>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: any) {
  return (
    <div className="card-govt p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <h3 className="font-serif text-xl font-bold text-primary">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
