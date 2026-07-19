import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { register } from "@/lib/store";
import { Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Vidyut Sewa Portal" }, { name: "description", content: "Create a Vidyut Sewa Portal portal account to file and track electricity complaints." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", mobile: "", password: "", confirm: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast.error("Name is too short");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Invalid email");
    if (!/^\d{10}$/.test(f.mobile)) return toast.error("Mobile must be 10 digits");
    if (f.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (f.password !== f.confirm) return toast.error("Passwords do not match");
    const res = register({ name: f.name.trim(), email: f.email.trim(), mobile: f.mobile, password: f.password });
    if ("error" in res) return toast.error(res.error);
    toast.success("Account created. Welcome!");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card-govt p-6 md:p-8">
        <h1 className="font-serif text-2xl font-bold text-primary">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Register once and track all your complaints in one place.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Field label="Full name" value={f.name} onChange={(v) => setF({ ...f, name: v })} required maxLength={100} />
          <Field label="Email" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} required maxLength={255} />
          <Field label="Mobile (10 digits)" value={f.mobile} onChange={(v) => setF({ ...f, mobile: v.replace(/\D/g, "").slice(0, 10) })} required />
          <Field label="Password" type="password" value={f.password} onChange={(v) => setF({ ...f, password: v })} required />
          <Field label="Confirm password" type="password" value={f.confirm} onChange={(v) => setF({ ...f, confirm: v })} required />
          <Button className="w-full" type="submit">Create Account</Button>
          <div className="text-sm text-center">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
