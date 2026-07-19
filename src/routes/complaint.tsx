import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addComplaint, CATEGORIES, DISTRICTS, getSession, seedIfEmpty, type ComplaintCategory } from "@/lib/store";
import { CheckCircle2, Copy } from "lucide-react";

export const Route = createFileRoute("/complaint")({
  head: () => ({ meta: [{ title: "Register Complaint — Vidyut Bhawan" }, { name: "description", content: "File a new electricity complaint online with Vidyut Bhawan, Bihar." }] }),
  component: ComplaintPage,
});

function ComplaintPage() {
  const nav = useNavigate();
  const [f, setF] = useState({
    consumerNo: "", name: "", mobile: "", email: "", address: "", district: DISTRICTS[0],
    category: "Power Failure" as ComplaintCategory, description: "", imageDataUrl: undefined as string | undefined,
  });
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    seedIfEmpty();
    const s = getSession();
    if (s) setF((p) => ({ ...p, name: s.name, email: s.email, mobile: s.mobile }));
  }, []);

  const onFile = (file: File | null) => {
    if (!file) return setF({ ...f, imageDataUrl: undefined });
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2 MB");
    const r = new FileReader();
    r.onload = () => setF((p) => ({ ...p, imageDataUrl: r.result as string }));
    r.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[A-Z0-9]{4,20}$/i.test(f.consumerNo)) return toast.error("Consumer number: 4–20 alphanumeric characters");
    if (f.name.trim().length < 2) return toast.error("Enter a valid name");
    if (!/^\d{10}$/.test(f.mobile)) return toast.error("Mobile must be 10 digits");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Invalid email");
    if (f.address.trim().length < 6) return toast.error("Address is too short");
    if (f.description.trim().length < 10) return toast.error("Description must be at least 10 characters");
    if (f.description.length > 1000) return toast.error("Description under 1000 characters");

    const s = getSession();
    const c = addComplaint({
      userId: s?.id ?? null,
      consumerNo: f.consumerNo.toUpperCase(),
      name: f.name.trim(), mobile: f.mobile, email: f.email.trim(),
      address: f.address.trim(), district: f.district, category: f.category,
      description: f.description.trim(), imageDataUrl: f.imageDataUrl,
    });
    setSubmitted(c.id);
    toast.success("Complaint registered. Email notification sent (demo).");
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="card-govt p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Complaint Registered</h1>
          <p className="mt-2 text-muted-foreground">Save this Complaint ID for tracking:</p>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border bg-muted/40 p-4">
            <code className="text-lg font-bold text-primary">{submitted}</code>
            <button onClick={() => { navigator.clipboard.writeText(submitted); toast.success("Copied"); }} className="text-primary" aria-label="Copy">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => nav({ to: "/track", search: { id: submitted } as any })}>Track this Complaint</Button>
            <Button variant="outline" onClick={() => { setSubmitted(null); }}>File Another</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-saffron">Grievance Form</div>
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">Register Electricity Complaint</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">All fields are required unless marked optional. A unique Complaint ID will be issued upon submission.</p>
      </div>

      <form onSubmit={submit} className="card-govt mt-8 p-6 md:p-8 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Consumer Number" value={f.consumerNo} onChange={(v: string) => setF({ ...f, consumerNo: v })} placeholder="e.g. CN123456" />
          <Input label="Full Name" value={f.name} onChange={(v: string) => setF({ ...f, name: v })} />
          <Input label="Mobile Number" value={f.mobile} onChange={(v: string) => setF({ ...f, mobile: v.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile" />
          <Input label="Email" type="email" value={f.email} onChange={(v: string) => setF({ ...f, email: v })} />
          <div className="md:col-span-2">
            <Input label="Address" value={f.address} onChange={(v: string) => setF({ ...f, address: v })} placeholder="House / street / landmark" />
          </div>
          <Select label="District" value={f.district} onChange={(v: string) => setF({ ...f, district: v })} options={DISTRICTS} />
          <Select label="Complaint Category" value={f.category} onChange={(v: string) => setF({ ...f, category: v as ComplaintCategory })} options={CATEGORIES} />
        </div>
        <div>
          <label className="text-sm font-medium">Complaint Description</label>
          <textarea rows={4} maxLength={1000} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Describe the issue clearly..." />
          <div className="mt-1 text-xs text-muted-foreground">{f.description.length}/1000</div>
        </div>
        <div>
          <label className="text-sm font-medium">Upload Image (optional, &lt; 2MB)</label>
          <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground" />
          {f.imageDataUrl && <img src={f.imageDataUrl} alt="Preview" className="mt-2 h-32 rounded-md object-cover" />}
        </div>
        <Button type="submit" className="w-full" size="lg">Submit Complaint</Button>
      </form>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
