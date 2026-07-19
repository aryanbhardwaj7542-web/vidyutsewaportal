import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CATEGORIES, DISTRICTS, deleteComplaint, getComplaints, getSession, seedIfEmpty, updateComplaint,
  type Complaint, type ComplaintStatus,
} from "@/lib/store";
import { StatusBadge } from "@/components/complaint-bits";
import { Search, Trash2, Download, ClipboardCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Vidyut Bhawan" }, { name: "description", content: "Admin dashboard for managing electricity complaints." }] }),
  component: AdminPanel,
});

const TECHNICIANS = ["Tech. A. Singh", "Tech. R. Verma", "Tech. M. Sharma", "Tech. P. Kumar", "Tech. S. Das"];

function AdminPanel() {
  const nav = useNavigate();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [items, setItems] = useState<Complaint[]>([]);
  const [q, setQ] = useState("");
  const [fDistrict, setFDistrict] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fStatus, setFStatus] = useState<"" | ComplaintStatus>("");
  const [fDate, setFDate] = useState("");
  const [editing, setEditing] = useState<Complaint | null>(null);

  useEffect(() => {
    seedIfEmpty();
    const s = getSession();
    if (!s) { nav({ to: "/login" }); return; }
    if (s.role !== "admin") { nav({ to: "/dashboard" }); return; }
    setSession(s);
    refresh();
  }, [nav]);

  const refresh = () => setItems(getComplaints());

  const filtered = useMemo(() => {
    return items.filter(c => {
      if (q && !`${c.id} ${c.name} ${c.consumerNo} ${c.mobile}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (fDistrict && c.district !== fDistrict) return false;
      if (fCategory && c.category !== fCategory) return false;
      if (fStatus && c.status !== fStatus) return false;
      if (fDate) {
        const d = new Date(c.createdAt).toISOString().slice(0, 10);
        if (d !== fDate) return false;
      }
      return true;
    });
  }, [items, q, fDistrict, fCategory, fStatus, fDate]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: items.length,
      pending: items.filter(c => c.status === "Pending").length,
      progress: items.filter(c => c.status === "In Progress").length,
      resolved: items.filter(c => c.status === "Resolved").length,
      today: items.filter(c => c.createdAt.slice(0, 10) === today).length,
    };
  }, [items]);

  const doDelete = (id: string) => {
    if (!confirm("Delete this complaint permanently?")) return;
    deleteComplaint(id);
    toast.success("Complaint deleted");
    refresh();
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Consumer No", "Name", "Mobile", "Email", "District", "Category", "Status", "Technician", "Remarks", "Created"],
      ...filtered.map(c => [c.id, c.consumerNo, c.name, c.mobile, c.email, c.district, c.category, c.status, c.technician ?? "", c.remarks ?? "", c.createdAt]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "complaints.csv"; a.click(); URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  if (!session) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-saffron font-semibold">Administrator Panel</div>
          <h1 className="font-serif text-3xl font-bold text-primary">Complaint Management</h1>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total" value={stats.total} tone="primary" />
        <Stat label="Pending" value={stats.pending} tone="warning" />
        <Stat label="In Progress" value={stats.progress} tone="info" />
        <Stat label="Resolved" value={stats.resolved} tone="success" />
        <Stat label="Today" value={stats.today} tone="primary" />
      </div>

      {/* Filters */}
      <div className="card-govt mt-6 p-4 grid gap-3 md:grid-cols-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID / name / consumer no."
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={fDistrict} onChange={(e) => setFDistrict(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="">All districts</option>
          {DISTRICTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value as any)} className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option>Pending</option><option>In Progress</option><option>Resolved</option>
        </select>
        <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm" />
      </div>

      {/* Table */}
      <div className="card-govt mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Consumer</th>
                <th className="p-3">District</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Technician</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{c.id}</td>
                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.consumerNo} · {c.mobile}</div>
                  </td>
                  <td className="p-3">{c.district}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                  <td className="p-3 text-xs">{c.technician ?? "—"}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => setEditing(c)}><ClipboardCheck className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="outline" onClick={() => doDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No complaints match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ManageDialog complaint={editing} onClose={() => setEditing(null)} onSaved={() => { refresh(); setEditing(null); }} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "primary" | "warning" | "info" | "success" }) {
  const bar = { primary: "bg-primary", warning: "bg-warning", info: "bg-info", success: "bg-success" }[tone];
  return (
    <div className="card-govt p-5 relative overflow-hidden">
      <div className={`absolute left-0 top-0 h-full w-1 ${bar}`} />
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-3xl font-bold text-primary">{value}</div>
    </div>
  );
}

function ManageDialog({ complaint, onClose, onSaved }: { complaint: Complaint | null; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState<ComplaintStatus>("Pending");
  const [tech, setTech] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (complaint) { setStatus(complaint.status); setTech(complaint.technician ?? ""); setRemarks(complaint.remarks ?? ""); }
  }, [complaint]);

  const save = () => {
    if (!complaint) return;
    updateComplaint(complaint.id, { status, technician: tech || undefined, remarks: remarks || undefined });
    toast.success("Complaint updated");
    onSaved();
  };

  return (
    <Dialog open={!!complaint} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Complaint</DialogTitle>
        </DialogHeader>
        {complaint && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted/40 p-3 text-sm">
              <div className="font-mono text-xs text-primary">{complaint.id}</div>
              <div className="mt-1">{complaint.name} · {complaint.district} · {complaint.category}</div>
              <p className="mt-2 text-muted-foreground">{complaint.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option>Pending</option><option>In Progress</option><option>Resolved</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Assign Technician</label>
              <select value={tech} onChange={(e) => setTech(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">— unassigned —</option>
                {TECHNICIANS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Remarks</label>
              <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} maxLength={500}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Resolution notes, next steps..." />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
