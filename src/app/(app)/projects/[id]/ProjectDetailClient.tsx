"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PROJECT_STATUS,
  VENDOR_STATUS,
  formatRupiah,
  formatDate,
  daysUntil,
  progressOf,
} from "@/lib/format";

type Task = { id: string; title: string; category: string; dueDate: string | null; done: boolean; isMilestone: boolean };
type Vendor = { id: string; name: string; category: string; contact: string | null; cost: number; status: string };
type Budget = { id: string; description: string; category: string; planned: number; paid: number };
type Project = {
  id: string;
  coupleName: string;
  weddingDate: string;
  venue: string | null;
  packageName: string | null;
  status: string;
  notes: string | null;
  tasks: Task[];
  vendors: Vendor[];
  budgetItems: Budget[];
  assignments: { user: { id: string; name: string; email: string } }[];
  createdBy: { name: string } | null;
};

const TABS = [
  { key: "overview", label: "Ringkasan" },
  { key: "tasks", label: "Checklist & Milestone" },
  { key: "vendors", label: "Vendor" },
  { key: "budget", label: "Budget" },
];

export default function ProjectDetailClient({ projectId, role }: { projectId: string; role: string }) {
  const router = useRouter();
  const [p, setP] = useState<Project | null>(null);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}`);
    setP(res.ok ? await res.json() : null);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-muted">Memuat…</p>;
  if (!p) return <p className="text-muted">Project tidak ditemukan atau tidak punya akses.</p>;

  const prog = progressOf(p.tasks);
  const d = daysUntil(p.weddingDate);
  const st = PROJECT_STATUS[p.status];

  async function setStatus(status: string) {
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function removeProject() {
    if (!confirm("Hapus project ini beserta seluruh datanya?")) return;
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (res.ok) router.push("/projects");
    else alert((await res.json()).error || "Gagal menghapus.");
  }

  return (
    <div className="max-w-5xl mx-auto animate-rise">
      <Link href="/projects" className="text-sm text-muted hover:text-botanical">← Semua project</Link>

      <header className="mt-3 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-4xl text-ink">{p.coupleName}</h1>
            <span className={`text-xs px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
          </div>
          <p className="text-muted mt-1">
            {formatDate(p.weddingDate)} {p.venue ? `· ${p.venue}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-display text-3xl ${d < 0 ? "text-muted" : d <= 14 ? "text-terracotta" : "text-botanical"}`}>
            {d < 0 ? "Lewat" : `H-${d}`}
          </p>
          <p className="text-xs text-muted">menuju hari-H</p>
        </div>
      </header>

      {/* progress strip */}
      <div className="rounded-2xl bg-white/70 border border-parchment p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Progress keseluruhan</span>
          <span className="font-display text-2xl text-ink">{prog}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-parchment overflow-hidden">
          <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${prog}%` }} />
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-parchment mb-6 overflow-x-auto scrollbar-thin">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition ${
              tab === t.key ? "border-botanical text-botanical font-medium" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <Overview p={p} role={role} onStatus={setStatus} onDelete={removeProject} />
      )}
      {tab === "tasks" && <TasksTab project={p} reload={load} />}
      {tab === "vendors" && <VendorsTab project={p} reload={load} />}
      {tab === "budget" && <BudgetTab project={p} reload={load} />}
    </div>
  );
}

/* ---------- OVERVIEW ---------- */
function Overview({ p, role, onStatus, onDelete }: { p: Project; role: string; onStatus: (s: string) => void; onDelete: () => void }) {
  const milestones = p.tasks.filter((t) => t.isMilestone);
  const totalPlanned = p.budgetItems.reduce((s, b) => s + b.planned, 0);
  const totalPaid = p.budgetItems.reduce((s, b) => s + b.paid, 0);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Card title="Detail">
        <Row label="Paket" value={p.packageName || "—"} />
        <Row label="Venue" value={p.venue || "—"} />
        <Row label="Dibuat oleh" value={p.createdBy?.name || "—"} />
        <Row label="Tim" value={p.assignments.map((a) => a.user.name).join(", ") || "—"} />
        {p.notes && <p className="text-sm text-muted mt-3 pt-3 border-t border-parchment">{p.notes}</p>}
      </Card>

      <Card title="Status & Keuangan">
        <Row label="Anggaran" value={formatRupiah(totalPlanned)} />
        <Row label="Terbayar" value={formatRupiah(totalPaid)} />
        <Row label="Sisa" value={formatRupiah(totalPlanned - totalPaid)} />
        <div className="mt-4 pt-4 border-t border-parchment">
          <p className="text-xs text-muted mb-2 uppercase tracking-wide">Ubah Status</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PROJECT_STATUS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => onStatus(k)}
                className={`text-xs px-3 py-1.5 rounded-full transition ${p.status === k ? v.color + " ring-2 ring-botanical/30" : "bg-parchment/60 text-muted hover:bg-parchment"}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Milestone Utama" className="md:col-span-2">
        {milestones.length === 0 ? (
          <p className="text-sm text-muted">Belum ada milestone. Tandai tugas penting sebagai milestone di tab Checklist.</p>
        ) : (
          <ol className="relative border-l-2 border-parchment ml-2 space-y-4 py-1">
            {milestones.map((m) => (
              <li key={m.id} className="ml-5">
                <span
                  className={`absolute -left-[7px] h-3 w-3 rounded-full ${m.done ? "bg-botanical" : "bg-parchment border-2 border-sage"}`}
                />
                <p className={`text-sm ${m.done ? "text-ink line-through decoration-sage" : "text-ink"}`}>{m.title}</p>
                <p className="text-xs text-muted">{m.done ? "Selesai" : formatDate(m.dueDate) !== "—" ? `Target ${formatDate(m.dueDate)}` : "Belum dijadwalkan"}</p>
              </li>
            ))}
          </ol>
        )}
      </Card>

      {role === "SUPER_ADMIN" && (
        <div className="md:col-span-2">
          <button onClick={onDelete} className="text-sm text-terracotta hover:underline">Hapus project ini</button>
        </div>
      )}
    </div>
  );
}

/* ---------- TASKS ---------- */
function TasksTab({ project, reload }: { project: Project; reload: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Umum");
  const [dueDate, setDueDate] = useState("");
  const [isMilestone, setIsMilestone] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`/api/projects/${project.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, dueDate: dueDate || null, isMilestone }),
    });
    setTitle("");
    setDueDate("");
    setIsMilestone(false);
    reload();
  }
  async function toggle(t: Task) {
    await fetch(`/api/tasks/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !t.done }),
    });
    reload();
  }
  async function toggleMs(t: Task) {
    await fetch(`/api/tasks/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isMilestone: !t.isMilestone }),
    });
    reload();
  }
  async function del(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    reload();
  }

  const done = project.tasks.filter((t) => t.done).length;

  return (
    <div>
      <form onSubmit={add} className="rounded-2xl bg-white/70 border border-parchment p-4 shadow-card mb-5 grid sm:grid-cols-[1fr_auto_auto_auto] gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tambah tugas / milestone…" className="rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori" className="rounded-lg border border-parchment bg-white px-3 py-2.5 text-sm outline-none focus:border-botanical w-full sm:w-32" />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-lg border border-parchment bg-white px-3 py-2.5 text-sm outline-none focus:border-botanical" />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-muted whitespace-nowrap">
            <input type="checkbox" checked={isMilestone} onChange={(e) => setIsMilestone(e.target.checked)} className="accent-gold" /> Milestone
          </label>
          <button className="rounded-lg bg-botanical text-ivory px-4 py-2.5 text-sm hover:bg-botanical-soft transition">Tambah</button>
        </div>
      </form>

      <p className="text-sm text-muted mb-3">{done} dari {project.tasks.length} tugas selesai</p>

      <div className="space-y-2">
        {project.tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-xl bg-white/70 border border-parchment px-4 py-3 shadow-card">
            <button onClick={() => toggle(t)} className={`h-5 w-5 rounded-md border-2 grid place-items-center transition ${t.done ? "bg-botanical border-botanical" : "border-sage hover:border-botanical"}`}>
              {t.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBF8F2" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${t.done ? "line-through text-muted" : "text-ink"}`}>
                {t.title}
                {t.isMilestone && <span className="ml-2 text-[10px] uppercase tracking-wide text-gold bg-gold/10 px-1.5 py-0.5 rounded">Milestone</span>}
              </p>
              <p className="text-xs text-muted">{t.category}{t.dueDate ? ` · ${formatDate(t.dueDate)}` : ""}</p>
            </div>
            <button onClick={() => toggleMs(t)} title="Toggle milestone" className="text-xs text-muted hover:text-gold">★</button>
            <button onClick={() => del(t.id)} className="text-xs text-muted hover:text-terracotta">Hapus</button>
          </div>
        ))}
        {project.tasks.length === 0 && <p className="text-muted text-sm">Belum ada tugas.</p>}
      </div>
    </div>
  );
}

/* ---------- VENDORS ---------- */
function VendorsTab({ project, reload }: { project: Project; reload: () => void }) {
  const [form, setForm] = useState({ name: "", category: "", contact: "", cost: "", status: "PROSPEK" });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await fetch(`/api/projects/${project.id}/vendors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", category: "", contact: "", cost: "", status: "PROSPEK" });
    reload();
  }
  async function setVendorStatus(id: string, status: string) {
    await fetch(`/api/vendors/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    reload();
  }
  async function del(id: string) {
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    reload();
  }
  const total = project.vendors.reduce((s, v) => s + v.cost, 0);

  return (
    <div>
      <form onSubmit={add} className="rounded-2xl bg-white/70 border border-parchment p-4 shadow-card mb-5 grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama vendor" className="rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Kategori (Catering…)" className="rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical" />
        <input value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="Biaya (Rp)" type="number" className="rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical" />
        <button className="rounded-lg bg-botanical text-ivory px-4 py-2.5 text-sm hover:bg-botanical-soft transition">Tambah</button>
      </form>

      <p className="text-sm text-muted mb-3">Total estimasi biaya vendor: <span className="text-ink font-medium">{formatRupiah(total)}</span></p>

      <div className="space-y-2">
        {project.vendors.map((v) => (
          <div key={v.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-white/70 border border-parchment px-4 py-3 shadow-card">
            <div className="flex-1 min-w-[150px]">
              <p className="text-sm text-ink font-medium">{v.name}</p>
              <p className="text-xs text-muted">{v.category}{v.contact ? ` · ${v.contact}` : ""}</p>
            </div>
            <span className="text-sm text-ink tabular-nums">{formatRupiah(v.cost)}</span>
            <select value={v.status} onChange={(e) => setVendorStatus(v.id, e.target.value)} className="text-xs rounded-full border border-parchment bg-white px-2 py-1 outline-none">
              {Object.entries(VENDOR_STATUS).map(([k, val]) => <option key={k} value={k}>{val.label}</option>)}
            </select>
            <button onClick={() => del(v.id)} className="text-xs text-muted hover:text-terracotta">Hapus</button>
          </div>
        ))}
        {project.vendors.length === 0 && <p className="text-muted text-sm">Belum ada vendor.</p>}
      </div>
    </div>
  );
}

/* ---------- BUDGET ---------- */
function BudgetTab({ project, reload }: { project: Project; reload: () => void }) {
  const [form, setForm] = useState({ description: "", category: "", planned: "", paid: "" });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) return;
    await fetch(`/api/projects/${project.id}/budget`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ description: "", category: "", planned: "", paid: "" });
    reload();
  }
  async function updatePaid(id: string, paid: number) {
    await fetch(`/api/budget/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paid }) });
    reload();
  }
  async function del(id: string) {
    await fetch(`/api/budget/${id}`, { method: "DELETE" });
    reload();
  }

  const totalPlanned = project.budgetItems.reduce((s, b) => s + b.planned, 0);
  const totalPaid = project.budgetItems.reduce((s, b) => s + b.paid, 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="Anggaran" value={formatRupiah(totalPlanned)} />
        <Stat label="Terbayar" value={formatRupiah(totalPaid)} accent="botanical" />
        <Stat label="Sisa" value={formatRupiah(totalPlanned - totalPaid)} accent="terracotta" />
      </div>

      <form onSubmit={add} className="rounded-2xl bg-white/70 border border-parchment p-4 shadow-card mb-5 grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2">
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Item (mis. Catering)" className="rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical" />
        <input value={form.planned} onChange={(e) => setForm({ ...form, planned: e.target.value })} type="number" placeholder="Anggaran (Rp)" className="rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical" />
        <input value={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.value })} type="number" placeholder="Terbayar (Rp)" className="rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical" />
        <button className="rounded-lg bg-botanical text-ivory px-4 py-2.5 text-sm hover:bg-botanical-soft transition">Tambah</button>
      </form>

      <div className="space-y-2">
        {project.budgetItems.map((b) => {
          const pct = b.planned ? Math.min(100, Math.round((b.paid / b.planned) * 100)) : 0;
          return (
            <div key={b.id} className="rounded-xl bg-white/70 border border-parchment px-4 py-3 shadow-card">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <p className="text-sm text-ink font-medium">{b.description}</p>
                  <p className="text-xs text-muted">{b.category}</p>
                </div>
                <div className="text-right text-sm">
                  <span className="text-ink tabular-nums">{formatRupiah(b.paid)}</span>
                  <span className="text-muted"> / {formatRupiah(b.planned)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-parchment overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 100 ? "bg-botanical" : "bg-gold"}`} style={{ width: `${pct}%` }} />
                </div>
                <input
                  type="number"
                  defaultValue={b.paid}
                  onBlur={(e) => { const val = Number(e.target.value); if (val !== b.paid) updatePaid(b.id, val); }}
                  className="w-28 rounded-md border border-parchment bg-white px-2 py-1 text-xs outline-none focus:border-botanical"
                  title="Update jumlah terbayar"
                />
                <button onClick={() => del(b.id)} className="text-xs text-muted hover:text-terracotta">Hapus</button>
              </div>
            </div>
          );
        })}
        {project.budgetItems.length === 0 && <p className="text-muted text-sm">Belum ada item budget.</p>}
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */
function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/70 border border-parchment p-5 shadow-card ${className}`}>
      <h3 className="font-display text-lg text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-ink text-right">{value}</span>
    </div>
  );
}
function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const color = accent === "botanical" ? "text-botanical" : accent === "terracotta" ? "text-terracotta" : "text-ink";
  return (
    <div className="rounded-xl bg-white/70 border border-parchment p-4 shadow-card">
      <p className="text-xs text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-display text-lg ${color}`}>{value}</p>
    </div>
  );
}
