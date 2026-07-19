import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getComplaints, getSession, seedIfEmpty, type Complaint } from "@/lib/store";
import { StatusBadge } from "@/components/complaint-bits";
import { FilePlus2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — Vidyut Bhawan" }, { name: "description", content: "Your electricity complaint history and profile." }] }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mine, setMine] = useState<Complaint[]>([]);

  useEffect(() => {
    seedIfEmpty();
    const s = getSession();
    if (!s) { nav({ to: "/login" }); return; }
    if (s.role === "admin") { nav({ to: "/admin" }); return; }
    setSession(s);
    setMine(getComplaints().filter(c => c.userId === s.id));
  }, [nav]);

  if (!session) return null;

  const stats = {
    total: mine.length,
    pending: mine.filter(c => c.status === "Pending").length,
    progress: mine.filter(c => c.status === "In Progress").length,
    resolved: mine.filter(c => c.status === "Resolved").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs text-muted-foreground">Welcome back</div>
          <h1 className="font-serif text-3xl font-bold text-primary">{session.name}</h1>
          <div className="text-sm text-muted-foreground">{session.email} · {session.mobile}</div>
        </div>
        <Link to="/complaint">
          <Button><FilePlus2 className="mr-2 h-4 w-4" /> New Complaint</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="In Progress" value={stats.progress} />
        <Stat label="Resolved" value={stats.resolved} />
      </div>

      <div className="mt-8 card-govt overflow-hidden">
        <div className="border-b px-5 py-4 font-semibold">My Complaint History</div>
        {mine.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            You haven't filed any complaints yet.
            <div className="mt-4"><Link to="/complaint"><Button>File your first complaint</Button></Link></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Complaint ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {mine.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3 font-mono">{c.id}</td>
                    <td className="p-3">{c.category}</td>
                    <td className="p-3">{c.district}</td>
                    <td className="p-3 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-3"><StatusBadge status={c.status} /></td>
                    <td className="p-3">
                      <Link to="/track" search={{ id: c.id } as any} className="text-primary hover:underline">Track</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-govt p-5">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="mt-1 font-serif text-3xl font-bold text-primary">{value}</div>
    </div>
  );
}
