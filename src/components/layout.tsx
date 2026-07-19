import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { getSession, logout, seedIfEmpty } from "@/lib/store";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/complaint", label: "Register Complaint" },
  { to: "/track", label: "Track" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [session, setSessionState] = useState<ReturnType<typeof getSession>>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    seedIfEmpty();
    setSessionState(getSession());
  }, [path]);

  const doLogout = () => {
    logout();
    setSessionState(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="tricolor-band" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Zap className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-bold text-primary">Vidyut Bhawan</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Electricity Complaint Portal · Govt. of Bihar
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {session ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to={session.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="outline" size="sm">{session.role === "admin" ? "Admin" : "Dashboard"}</Button>
              </Link>
              <Button size="sm" onClick={doLogout} variant="secondary">Logout</Button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link to={session.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)}>
                  <Button className="w-full mt-2" variant="outline">{session.role === "admin" ? "Admin Panel" : "My Dashboard"}</Button>
                </Link>
                <Button className="w-full mt-1" variant="secondary" onClick={doLogout}>Logout</Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button className="w-full mt-2">Login / Register</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-serif text-lg font-bold">Vidyut Bhawan</div>
          <p className="mt-2 text-sm opacity-80">
            Electricity Department, Bailey Road, Patna — 800001, Bihar, India
          </p>
          <p className="mt-2 text-sm opacity-80">Office: 0612-2504745</p>
        </div>
        <div>
          <div className="font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/about">About Department</Link></li>
            <li><Link to="/complaint">Register Complaint</Link></li>
            <li><Link to="/track">Track Complaint</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Emergency Helplines</div>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Power Outage: <b>1912</b></li>
            <li>Complaint Cell: <b>1800-345-1912</b></li>
            <li>Bijli Sewa: <b>155333</b></li>
            <li>Emergency: <b>112</b></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Connect</div>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Twitter · Facebook · YouTube</li>
            <li>info@vidyut.bihar.gov.in</li>
          </ul>
          <p className="mt-4 text-xs opacity-70">
            This is a demonstration portal built for illustrative purposes.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} Electricity Department, Government of Bihar. All rights reserved.
      </div>
    </footer>
  );
}
