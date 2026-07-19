import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login, seedIfEmpty } from "@/lib/store";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Vidyut Bhawan" }, { name: "description", content: "Login to the Vidyut Bhawan electricity complaint portal." }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [forgot, setForgot] = useState(false); const [forgotEmail, setForgotEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    seedIfEmpty();
    const u = login(email, password);
    if (!u) return toast.error("Invalid email or password.");
    toast.success(`Welcome back, ${u.name}!`);
    nav({ to: u.role === "admin" ? "/admin" : "/dashboard" });
  };

  const forgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes("@")) return toast.error("Enter a valid email");
    toast.success("If an account exists, a reset link has been sent.");
    setForgot(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card-govt overflow-hidden">
        <div className="hero-gradient p-6 text-primary-foreground text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15"><Zap className="h-6 w-6" /></div>
          <h1 className="mt-3 font-serif text-2xl font-bold">Portal Login</h1>
          <p className="text-sm opacity-90">Access your complaint dashboard</p>
        </div>
        <div className="p-6">
          {!forgot ? (
            <form onSubmit={submit} className="space-y-4">
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Password" type="password" value={password} onChange={setPassword} required />
              <Button className="w-full" type="submit">Login</Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setForgot(true)} className="text-primary hover:underline">Forgot password?</button>
                <Link to="/register" className="text-primary hover:underline">Create account</Link>
              </div>
              <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="font-semibold mb-1">Demo accounts</div>
                <div>Admin: admin@vidyut.gov.in / admin123</div>
                <div>User: ravi@example.com / pass1234</div>
              </div>
            </form>
          ) : (
            <form onSubmit={forgotSubmit} className="space-y-4">
              <h2 className="font-semibold">Reset password</h2>
              <Field label="Registered email" type="email" value={forgotEmail} onChange={setForgotEmail} required />
              <Button className="w-full" type="submit">Send reset link</Button>
              <button type="button" onClick={() => setForgot(false)} className="text-sm text-primary hover:underline">Back to login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, ...rest }: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean; maxLength?: number; }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...rest} onChange={(e) => rest.onChange(e.target.value)}
        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
