"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/projects", label: "Project Wedding", icon: "M4 7h16M4 12h16M4 17h10" },
];

export default function Sidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const nav = [...items];
  if (role === "SUPER_ADMIN") nav.push({ href: "/users", label: "Kelola Akun", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-2a6 6 0 0112 0v2" });

  async function logout() {
    if (loggingOut) return;
    if (!confirm("Keluar dari akun ini?")) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* abaikan — tetap arahkan ke login */
    }
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile bar */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-parchment bg-ivory/80 backdrop-blur sticky top-0 z-30">
        <span className="font-display text-lg text-botanical">Amazing WO</span>
        <button onClick={() => setOpen(!open)} className="text-ink" aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} lg:block lg:w-64 shrink-0 border-r border-parchment bg-ivory/70 backdrop-blur lg:min-h-screen lg:sticky lg:top-0`}
      >
        <div className="p-6 hidden lg:block">
          <span className="font-display text-2xl text-botanical">Amazing WO</span>
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold mt-1">Project Studio</p>
        </div>

        <nav className="px-3 py-3 space-y-1">
          {nav.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive(it.href)
                  ? "bg-botanical text-ivory shadow-card"
                  : "text-ink/80 hover:bg-parchment/60"
              }`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={it.icon} /></svg>
              {it.label}
            </Link>
          ))}

          <div className="my-2 border-t border-parchment/70" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink/80 hover:bg-parchment/60 transition"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM12 11v6M9 14h6" /></svg>
            <span className="flex-1">Katalog Paket</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-muted"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </a>
        </nav>

        <div className="px-5 mt-4 lg:absolute lg:bottom-0 lg:w-64 lg:p-5 border-t border-parchment/70">
          <div className="flex items-center gap-3 py-3">
            <div className="h-9 w-9 rounded-full bg-gold/20 text-gold grid place-items-center font-display font-semibold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{name}</p>
              <p className="text-[11px] text-muted">{role === "SUPER_ADMIN" ? "Super Admin" : "Staff"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-parchment py-2.5 text-sm font-medium text-muted transition hover:border-terracotta/40 hover:text-terracotta disabled:opacity-60"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            {loggingOut ? "Keluar…" : "Keluar"}
          </button>
        </div>
      </aside>
    </>
  );
}
