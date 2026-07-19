import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { ComplaintStatus } from "@/lib/store";

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const map: Record<ComplaintStatus, { cls: string; icon: any }> = {
    Pending: { cls: "bg-warning/20 text-foreground border-warning/50", icon: Clock },
    "In Progress": { cls: "bg-info/20 text-foreground border-info/50", icon: Loader2 },
    Resolved: { cls: "bg-success/20 text-foreground border-success/50", icon: CheckCircle2 },
  };
  const { cls, icon: Icon } = map[status];
  return (
    <Badge variant="outline" className={`gap-1.5 ${cls}`}>
      <Icon className="h-3.5 w-3.5" /> {status}
    </Badge>
  );
}

export function StatusTimeline({ status }: { status: ComplaintStatus }) {
  const steps = ["Pending", "In Progress", "Resolved"] as const;
  const idx = steps.indexOf(status);
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-3">Progress</div>
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${i <= idx ? "bg-primary" : "bg-muted"}`} />
            {i < steps.length - 1 && <span />}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        {steps.map((s) => <span key={s}>{s}</span>)}
      </div>
    </div>
  );
}
