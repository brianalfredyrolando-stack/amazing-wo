import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PROJECT_STATUS, formatRupiah, formatDate, daysUntil, progressOf } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = (await getSession())!;
  const where =
    session.role === "SUPER_ADMIN"
      ? {}
      : { OR: [{ createdById: session.userId }, { assignments: { some: { userId: session.userId } } }] };

  const projects = await prisma.project.findMany({
    where,
    orderBy: { weddingDate: "asc" },
    include: {
      tasks: { select: { done: true } },
      budgetItems: { select: { planned: true, paid: true } },
      assignments: { include: { user: { select: { name: true } } } },
    },
  });

  const active = projects.filter((p) => p.status === "IN_PROGRESS" || p.status === "PLANNING");
  const upcoming = active
    .filter((p) => daysUntil(p.weddingDate) >= 0)
    .sort((a, b) => daysUntil(a.weddingDate) - daysUntil(b.weddingDate));
  const totalPlanned = projects.reduce((s, p) => s + p.budgetItems.reduce((x, b) => x + b.planned, 0), 0);
  const totalPaid = projects.reduce((s, p) => s + p.budgetItems.reduce((x, b) => x + b.paid, 0), 0);

  const stats = [
    { label: "Total Project", value: projects.length },
    { label: "Sedang Berjalan", value: active.length },
    { label: "Nilai Anggaran", value: formatRupiah(totalPlanned), small: true },
    { label: "Sudah Dibayar", value: formatRupiah(totalPaid), small: true },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-rise">
      <header className="mb-8">
        <p className="text-xs tracking-[0.25em] uppercase text-gold mb-1">Selamat datang kembali</p>
        <h1 className="font-display text-4xl text-ink">{session.name}</h1>
      </header>

      <a
        href="/paket"
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-8 flex items-center justify-between gap-4 rounded-2xl bg-botanical text-ivory p-5 shadow-card hover:bg-botanical-soft transition"
      >
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 flex-shrink-0 rounded-full bg-gold/20 text-gold grid place-items-center">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM12 11v6M9 14h6" />
            </svg>
          </div>
          <div>
            <p className="font-display text-lg">Katalog Paket Pernikahan</p>
            <p className="text-sage/90 text-sm">Buka untuk dipresentasikan ke klien saat meeting — Joyful, Wonderful, Luxurious & All in Package.</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 flex-shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-medium text-ivory group-hover:opacity-90 transition">
          Buka Katalog
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </a>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/70 border border-parchment p-5 shadow-card">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`font-display text-ink ${s.small ? "text-xl" : "text-3xl"}`}>{s.value}</p>
          </div>
        ))}
      </section>

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-ink mb-4">Hitung Mundur Terdekat</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.slice(0, 3).map((p) => {
              const d = daysUntil(p.weddingDate);
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="rounded-2xl bg-botanical text-ivory p-5 shadow-card hover:bg-botanical-soft transition"
                >
                  <p className="font-display text-xl mb-1">{p.coupleName}</p>
                  <p className="text-sage/90 text-sm mb-4">{formatDate(p.weddingDate)}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl">{d}</span>
                    <span className="text-sage/90 text-sm">hari lagi</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-ink">Progress Semua Project</h2>
          <Link href="/projects" className="text-sm text-botanical hover:underline">Lihat semua →</Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-parchment p-10 text-center text-muted">
            Belum ada project. <Link href="/projects" className="text-botanical underline">Buat project pertama</Link>.
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => {
              const prog = progressOf(p.tasks);
              const st = PROJECT_STATUS[p.status];
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="block rounded-2xl bg-white/70 border border-parchment p-5 shadow-card hover:border-botanical/40 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="font-display text-lg text-ink">{p.coupleName}</span>
                      <span className="text-muted text-sm ml-3">{formatDate(p.weddingDate)}</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 rounded-full bg-parchment overflow-hidden">
                      <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${prog}%` }} />
                    </div>
                    <span className="text-sm font-medium text-ink tabular-nums w-12 text-right">{prog}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
