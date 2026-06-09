"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PROJECT_STATUS, formatDate, daysUntil, progressOf } from "@/lib/format";
import { venueOptions, packageOptions } from "@/app/paket/data";

type Project = {
  id: string;
  coupleName: string;
  weddingDate: string;
  venue: string | null;
  status: string;
  tasks: { done: boolean }[];
  assignments: { user: { id: string; name: string } }[];
  _count: { vendors: number; budgetItems: number; tasks: number };
};

export default function ProjectsClient({ role }: { role: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch("/api/projects");
    setProjects(res.ok ? await res.json() : []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = projects.filter((p) => p.coupleName.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto animate-rise">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-1">Daftar</p>
          <h1 className="font-display text-4xl text-ink">Project Wedding</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-botanical text-ivory px-5 py-2.5 text-sm font-medium hover:bg-botanical-soft transition"
        >
          + Project Baru
        </button>
      </header>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari nama pasangan…"
        className="w-full sm:max-w-xs mb-6 rounded-lg border border-parchment bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-botanical transition"
      />

      {loading ? (
        <p className="text-muted">Memuat…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-parchment p-10 text-center text-muted">
          Tidak ada project.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const prog = progressOf(p.tasks);
            const st = PROJECT_STATUS[p.status];
            const d = daysUntil(p.weddingDate);
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="rounded-2xl bg-white/70 border border-parchment p-5 shadow-card hover:border-botanical/40 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-xl text-ink">{p.coupleName}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${st.color}`}>{st.label}</span>
                </div>
                <p className="text-sm text-muted mb-1">{formatDate(p.weddingDate)}</p>
                {p.venue && <p className="text-sm text-muted/80 mb-4 truncate">{p.venue}</p>}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-2 rounded-full bg-parchment overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${prog}%` }} />
                  </div>
                  <span className="text-sm font-medium tabular-nums">{prog}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{p._count.tasks} tugas · {p._count.vendors} vendor</span>
                  <span className={d < 0 ? "text-muted" : d <= 14 ? "text-terracotta font-medium" : "text-botanical"}>
                    {d < 0 ? "Selesai" : `H-${d}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showForm && <NewProjectModal onClose={() => setShowForm(false)} onCreated={load} />}
    </div>
  );
}

function NewProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ groomName: "", brideName: "", weddingDate: "", venue: "", packageName: "", status: "PLANNING" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Gagal menyimpan.");
      setSaving(false);
      return;
    }
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 backdrop-blur-sm p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-ivory border border-parchment p-6 shadow-card animate-rise"
      >
        <h3 className="font-display text-2xl text-ink mb-5">Project Baru</h3>
        <div className="space-y-4">
          <Field label="Nama Mempelai Pria *">
            <input required value={form.groomName} onChange={(e) => setForm({ ...form, groomName: e.target.value })} className={inputCls} placeholder="Bagas" />
          </Field>
          <Field label="Nama Mempelai Wanita *">
            <input required value={form.brideName} onChange={(e) => setForm({ ...form, brideName: e.target.value })} className={inputCls} placeholder="Rani" />
          </Field>
          <Field label="Tanggal Pernikahan *">
            <input required type="date" value={form.weddingDate} onChange={(e) => setForm({ ...form, weddingDate: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Venue">
            <select value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputCls}>
              <option value="">Pilih venue…</option>
              {venueOptions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Paket">
            <select value={form.packageName} onChange={(e) => setForm({ ...form, packageName: e.target.value })} className={inputCls}>
              <option value="">Pilih paket…</option>
              {packageOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>
        {error && <p className="text-sm text-terracotta mt-3">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-parchment py-2.5 text-sm text-muted hover:bg-parchment/40 transition">Batal</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-botanical text-ivory py-2.5 text-sm font-medium hover:bg-botanical-soft transition disabled:opacity-60">{saving ? "Menyimpan…" : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-parchment bg-white/70 px-3.5 py-2.5 text-sm outline-none focus:border-botanical transition";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
