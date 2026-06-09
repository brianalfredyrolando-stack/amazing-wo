"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";

type User = { id: string; name: string; email: string; role: string; active: boolean; createdAt: string };

export default function UsersClient({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    const res = await fetch("/api/users");
    setUsers(res.ok ? await res.json() : []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Gagal membuat akun.");
      return;
    }
    setOk(`Akun ${data.email} berhasil dibuat.`);
    setForm({ name: "", email: "", password: "", role: "STAFF" });
    load();
  }

  async function patch(id: string, body: object) {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) alert((await res.json()).error || "Gagal.");
    load();
  }
  async function resetPw(u: User) {
    const np = prompt(`Password baru untuk ${u.name} (min 6 karakter):`);
    if (!np) return;
    patch(u.id, { password: np });
  }
  async function del(u: User) {
    if (!confirm(`Hapus akun ${u.name}?`)) return;
    const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
    if (!res.ok) alert((await res.json()).error || "Gagal.");
    load();
  }

  return (
    <div className="max-w-4xl mx-auto animate-rise">
      <header className="mb-7">
        <p className="text-xs tracking-[0.25em] uppercase text-gold mb-1">Khusus Super Admin</p>
        <h1 className="font-display text-4xl text-ink">Kelola Akun</h1>
      </header>

      <form onSubmit={create} className="rounded-2xl bg-white/70 border border-parchment p-5 shadow-card mb-8">
        <h3 className="font-display text-lg text-ink mb-4">Buat Akun Baru</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap" className={inputCls} />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className={inputCls} />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="text" placeholder="Password (min 6)" className={inputCls} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
            <option value="STAFF">Staff / Koordinator</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
        {error && <p className="text-sm text-terracotta mt-3">{error}</p>}
        {ok && <p className="text-sm text-botanical mt-3">{ok}</p>}
        <button className="mt-4 rounded-lg bg-botanical text-ivory px-5 py-2.5 text-sm font-medium hover:bg-botanical-soft transition">Buat Akun</button>
      </form>

      <h3 className="font-display text-lg text-ink mb-3">Daftar Akun</h3>
      {loading ? (
        <p className="text-muted">Memuat…</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-white/70 border border-parchment px-4 py-3 shadow-card">
              <div className="h-9 w-9 rounded-full bg-gold/20 text-gold grid place-items-center font-display">{u.name.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-[160px]">
                <p className="text-sm text-ink font-medium">
                  {u.name}
                  {u.id === currentUserId && <span className="ml-2 text-[10px] text-muted">(Anda)</span>}
                </p>
                <p className="text-xs text-muted">{u.email} · {formatDate(u.createdAt)}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${u.role === "SUPER_ADMIN" ? "bg-gold/15 text-gold" : "bg-sage/25 text-botanical-dark"}`}>
                {u.role === "SUPER_ADMIN" ? "Super Admin" : "Staff"}
              </span>
              {!u.active && <span className="text-xs px-2.5 py-1 rounded-full bg-terracotta/15 text-terracotta">Nonaktif</span>}

              {u.id !== currentUserId && (
                <div className="flex items-center gap-2 text-xs">
                  <button onClick={() => patch(u.id, { active: !u.active })} className="text-muted hover:text-botanical">{u.active ? "Nonaktifkan" : "Aktifkan"}</button>
                  <span className="text-parchment">|</span>
                  <button onClick={() => patch(u.id, { role: u.role === "SUPER_ADMIN" ? "STAFF" : "SUPER_ADMIN" })} className="text-muted hover:text-botanical">Ubah role</button>
                  <span className="text-parchment">|</span>
                  <button onClick={() => resetPw(u)} className="text-muted hover:text-botanical">Reset PW</button>
                  <span className="text-parchment">|</span>
                  <button onClick={() => del(u)} className="text-muted hover:text-terracotta">Hapus</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-parchment bg-white px-3.5 py-2.5 text-sm outline-none focus:border-botanical transition";
