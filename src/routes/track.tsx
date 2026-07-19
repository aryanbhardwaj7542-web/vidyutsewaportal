import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { findComplaint, seedIfEmpty, type Complaint } from "@/lib/store";
import { Search, MapPin, Calendar, User } from "lucide-react";
import { StatusBadge, StatusTimeline } from "@/components/complaint-bits";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : "" }),
  head: () => ({ meta: [{ title: "Track Complaint — Vidyut Bhawan" }, { name: "description", content: "Track your electricity complaint status by Complaint ID." }] }),
  component: TrackPage,
});

function TrackPage() {
  const { id: initial } = Route.useSearch();
  const [id, setId] = useState(initial || "");
  const [result, setResult] = useState<Complaint | null | "notfound">(null);

  useEffect(() => {
    seedIfEmpty();
    if (initial) doSearch(initial);
  }, [initial]);

  const doSearch = (val: string) => {
    const c = findComplaint(val);
    setResult(c ?? "notfound");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-saffron">Complaint Status</div>
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">Track your complaint</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Enter your Complaint ID (e.g. VB-20260719-1234).</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); doSearch(id); }} className="card-govt mt-8 p-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="VB-YYYYMMDD-XXXX"
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Button type="submit">Track</Button>
      </form>

      {result === "notfound" && (
        <div className="mt-6 card-govt p-6 text-center text-muted-foreground">
          No complaint found with that ID. Double-check and try again.
        </div>
      )}

      {result && result !== "notfound" && (
        <div className="mt-6 card-govt p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Complaint ID</div>
              <div className="font-serif text-xl font-bold text-primary">{result.id}</div>
            </div>
            <StatusBadge status={result.status} />
          </div>

          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <Info icon={User} label="Filed by" value={result.name} />
            <Info icon={MapPin} label="District" value={`${result.district} — ${result.address}`} />
            <Info icon={Calendar} label="Registered" value={new Date(result.createdAt).toLocaleString()} />
            <Info icon={Calendar} label="Last update" value={new Date(result.updatedAt).toLocaleString()} />
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Category</div>
            <div className="font-medium">{result.category}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Description</div>
            <p className="text-sm">{result.description}</p>
          </div>

          {result.technician && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <b>Assigned technician:</b> {result.technician}
            </div>
          )}
          {result.remarks && (
            <div className="rounded-md border bg-success/10 p-3 text-sm">
              <b>Remarks:</b> {result.remarks}
            </div>
          )}

          <StatusTimeline status={result.status} />
        </div>
      )}
    </div>
  );
}

function Info({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 mt-0.5 text-primary" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
