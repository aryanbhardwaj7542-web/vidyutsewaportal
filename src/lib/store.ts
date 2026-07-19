// Client-side mock store using localStorage. Frontend-only prototype.
export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
export type ComplaintCategory =
  | "Power Failure"
  | "Meter Issue"
  | "Billing Issue"
  | "Transformer Fault"
  | "Street Light Problem"
  | "Electric Pole Damage"
  | "Loose Wire"
  | "Other";

export const CATEGORIES: ComplaintCategory[] = [
  "Power Failure",
  "Meter Issue",
  "Billing Issue",
  "Transformer Fault",
  "Street Light Problem",
  "Electric Pole Damage",
  "Loose Wire",
  "Other",
];

export const DISTRICTS = [
  "Patna", "Gaya", "Nalanda", "Bhagalpur", "Muzaffarpur", "Darbhanga",
  "Purnia", "Begusarai", "Saran", "Rohtas", "East Champaran", "West Champaran",
];

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only
  mobile: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Complaint {
  id: string; // VB-YYYYMMDD-XXXX
  userId: string | null;
  consumerNo: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  category: ComplaintCategory;
  description: string;
  imageDataUrl?: string;
  status: ComplaintStatus;
  technician?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

const K_USERS = "vb_users";
const K_COMPLAINTS = "vb_complaints";
const K_SESSION = "vb_session";

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : fallback; }
  catch { return fallback; }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}

// ---- Users ----
export function getUsers(): User[] { return read<User[]>(K_USERS, []); }
export function saveUsers(u: User[]) { write(K_USERS, u); }

export function seedIfEmpty() {
  const users = getUsers();
  if (users.length === 0) {
    const seeded: User[] = [
      { id: "admin", name: "Administrator", email: "admin@vidyut.gov.in", password: "admin123", mobile: "9999999999", role: "admin", createdAt: new Date().toISOString() },
      { id: "u1", name: "Ravi Kumar", email: "ravi@example.com", password: "pass1234", mobile: "9876543210", role: "user", createdAt: new Date().toISOString() },
    ];
    saveUsers(seeded);
  }
  const c = getComplaints();
  if (c.length === 0) {
    const now = Date.now();
    const demo: Complaint[] = [
      mockComplaint(now - 86400000 * 2, "u1", "Patna", "Power Failure", "Pending"),
      mockComplaint(now - 86400000 * 5, "u1", "Gaya", "Meter Issue", "In Progress", "Tech. A. Singh"),
      mockComplaint(now - 86400000 * 9, "u1", "Nalanda", "Street Light Problem", "Resolved", "Tech. R. Verma", "Repaired lamp post."),
      mockComplaint(now - 3600000 * 4, null, "Patna", "Transformer Fault", "Pending"),
      mockComplaint(now - 3600000 * 20, null, "Bhagalpur", "Loose Wire", "In Progress", "Tech. M. Sharma"),
    ];
    saveComplaints(demo);
  }
}

function mockComplaint(ts: number, userId: string | null, district: string, cat: ComplaintCategory, status: ComplaintStatus, tech?: string, remarks?: string): Complaint {
  const d = new Date(ts);
  const iso = d.toISOString();
  return {
    id: genComplaintId(d),
    userId,
    consumerNo: "CN" + (100000 + Math.floor(Math.random() * 900000)),
    name: userId ? "Ravi Kumar" : "Anonymous Citizen",
    mobile: "9876543210",
    email: "citizen@example.com",
    address: "Sample address, near main road",
    district,
    category: cat,
    description: "Reported " + cat.toLowerCase() + " in the area. Requires attention.",
    status,
    technician: tech,
    remarks,
    createdAt: iso,
    updatedAt: iso,
  };
}

// ---- Session ----
export function getSession(): User | null { return read<User | null>(K_SESSION, null); }
export function setSession(u: User | null) { write(K_SESSION, u); }

export function login(email: string, password: string): User | null {
  const u = getUsers().find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (u) setSession(u);
  return u ?? null;
}
export function register(input: Omit<User, "id" | "role" | "createdAt">): User | { error: string } {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === input.email.toLowerCase())) return { error: "Email already registered" };
  const u: User = { ...input, id: "u_" + Math.random().toString(36).slice(2, 10), role: "user", createdAt: new Date().toISOString() };
  users.push(u); saveUsers(users); setSession(u);
  return u;
}
export function logout() { setSession(null); }

// ---- Complaints ----
export function getComplaints(): Complaint[] { return read<Complaint[]>(K_COMPLAINTS, []); }
export function saveComplaints(c: Complaint[]) { write(K_COMPLAINTS, c); }

export function genComplaintId(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VB-${y}${m}${day}-${rand}`;
}

export function addComplaint(input: Omit<Complaint, "id" | "status" | "createdAt" | "updatedAt">): Complaint {
  const now = new Date().toISOString();
  const c: Complaint = { ...input, id: genComplaintId(), status: "Pending", createdAt: now, updatedAt: now };
  const all = getComplaints(); all.unshift(c); saveComplaints(all);
  return c;
}

export function updateComplaint(id: string, patch: Partial<Complaint>): Complaint | null {
  const all = getComplaints();
  const i = all.findIndex(c => c.id === id);
  if (i < 0) return null;
  all[i] = { ...all[i], ...patch, updatedAt: new Date().toISOString() };
  saveComplaints(all);
  return all[i];
}
export function deleteComplaint(id: string) {
  saveComplaints(getComplaints().filter(c => c.id !== id));
}
export function findComplaint(id: string): Complaint | null {
  return getComplaints().find(c => c.id.toLowerCase() === id.trim().toLowerCase()) ?? null;
}
