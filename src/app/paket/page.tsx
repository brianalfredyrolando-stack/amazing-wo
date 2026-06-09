import type { Metadata } from "next";
import Link from "next/link";
import { tierPackages, allInInclusions, CONTACT } from "./data";
import { formatRupiah } from "@/lib/format";
import AllInPricing from "./AllInPricing";

export const metadata: Metadata = {
  title: "Paket Pernikahan — Amazing Concept Manado",
  description:
    "Pilihan paket wedding organizer Amazing Concept Manado: Joyful, Wonderful, Luxurious, dan All in Package.",
};

/* Pemisah dekoratif kecil khas undangan */
function Ornament({ light = false }: { light?: boolean }) {
  const line = light ? "via-ivory/30" : "via-gold/40";
  const dot = light ? "text-ivory/60" : "text-gold";
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <span className={`h-px w-16 bg-gradient-to-r from-transparent ${line} to-transparent`} />
      <span className={`${dot} text-sm tracking-[0.3em]`}>✦</span>
      <span className={`h-px w-16 bg-gradient-to-l from-transparent ${line} to-transparent`} />
    </div>
  );
}

function Check({ light = false }: { light?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${light ? "text-gold" : "text-botanical"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export default function PaketPage() {
  return (
    <main className="min-h-screen">
      {/* ── HERO dengan foto ───────────────────────────────── */}
      <header className="relative flex min-h-[92vh] items-center justify-center overflow-hidden text-center text-ivory">
        {/* foto latar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt="Pasangan pengantin"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-botanical-dark/45 to-ink/75" />

        {/* tombol kembali */}
        <Link
          href="/dashboard"
          className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-ivory/30 bg-ink/20 px-4 py-2 text-sm text-ivory backdrop-blur-sm transition hover:bg-ink/40"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          Kembali ke Dashboard
        </Link>

        <div className="relative z-10 px-6 animate-rise">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-ivory/50">
            <span className="font-display text-3xl leading-none text-ivory">A</span>
          </div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.42em] text-ivory/80">
            Amazing Concept Manado
          </p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-7xl">Paket Pernikahan</h1>
          <Ornament light />
          <p className="mx-auto max-w-xl leading-relaxed text-ivory/85">
            Setiap kisah cinta layak dirayakan dengan sempurna — dari koordinasi hari H yang
            esensial hingga layanan menyeluruh bersama wedding planner kami.
          </p>
          <a
            href="#paket"
            className="mt-8 inline-block rounded-full bg-gold px-7 py-3 text-sm font-medium text-ivory shadow-card transition hover:opacity-90"
          >
            Lihat Pilihan Paket
          </a>
        </div>
      </header>

      {/* ── PAKET BERTINGKAT ───────────────────────────────── */}
      <section id="paket" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.42em] text-gold">Pilihan Layanan</p>
          <h2 className="mt-2 font-display text-4xl text-ink">Paket Wedding Organizer</h2>
          <Ornament />
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {tierPackages.map((p) => (
            <article
              key={p.name}
              className={`relative flex flex-col rounded-3xl p-7 transition ${
                p.featured
                  ? "bg-botanical text-ivory shadow-card ring-1 ring-gold/30 lg:-translate-y-3"
                  : "border border-parchment bg-white/70 shadow-card"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory">
                  Paling Diminati
                </span>
              )}

              <header className="text-center">
                <h3 className="font-display text-2xl">{p.name}</h3>
                <p className={`mt-1 text-sm ${p.featured ? "text-ivory/70" : "text-muted"}`}>
                  {p.tagline}
                </p>
                <div className="mt-5">
                  <span className="font-display text-4xl text-gold">{formatRupiah(p.price)}</span>
                </div>
                <p
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${
                    p.featured ? "bg-ivory/10 text-ivory/80" : "bg-parchment text-muted"
                  }`}
                >
                  Estimasi {p.guests}
                </p>
              </header>

              <div className={`my-6 h-px ${p.featured ? "bg-ivory/15" : "bg-parchment"}`} />

              <ul className="flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check light={p.featured} />
                    <span className={p.featured ? "text-ivory/90" : "text-ink/90"}>{f}</span>
                  </li>
                ))}
              </ul>

              {p.bonus && (
                <div
                  className={`mt-5 rounded-xl p-4 ${
                    p.featured ? "bg-ivory/5 ring-1 ring-ivory/10" : "bg-parchment/50"
                  }`}
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Bonus
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    {p.bonus.map((b) => (
                      <li key={b} className="flex gap-2.5">
                        <Check light={p.featured} />
                        <span className={p.featured ? "text-ivory/90" : "text-ink/90"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={`https://wa.me/62${CONTACT.phone.replace(/^0/, "").replace(/\s/g, "")}?text=${encodeURIComponent(
                  `Halo Amazing Concept, saya tertarik dengan ${p.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 block rounded-full py-3 text-center text-sm font-medium transition ${
                  p.featured
                    ? "bg-gold text-ivory hover:opacity-90"
                    : "bg-botanical text-ivory hover:bg-botanical-soft"
                }`}
              >
                Konsultasi Paket
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ── BAND KUTIPAN dengan foto ───────────────────────── */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/band.jpg"
          alt="Momen pernikahan saat matahari terbenam"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center text-ivory">
          <span className="font-display text-5xl text-gold/80">“</span>
          <p className="font-display text-2xl leading-relaxed sm:text-3xl">
            Kami merangkai setiap detail agar Anda cukup hadir, menikmati, dan mengenang
            hari paling istimewa dalam hidup Anda.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.42em] text-ivory/70">
            Amazing Concept Manado
          </p>
        </div>
      </section>

      {/* ── ALL IN PACKAGE ─────────────────────────────────── */}
      <section className="relative bg-botanical-dark text-ivory">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {/* intro + foto */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.42em] text-gold">Paket Menyeluruh</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">All in Package</h2>
              <div className="my-5 h-px w-24 bg-gold/40" />
              <p className="leading-relaxed text-ivory/75">
                Satu paket lengkap — bridal, dekorasi, venue &amp; katering, hingga jasa wedding
                organizer profesional. Anda tinggal memilih gedung dan jumlah tamu, sisanya kami
                yang siapkan dengan sempurna.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl ring-1 ring-ivory/15 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ceremony.jpg"
                alt="Dekorasi upacara pernikahan"
                className="h-72 w-full object-cover sm:h-80"
              />
            </div>
          </div>

          {/* Inklusi */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allInInclusions.map((g) => (
              <div key={g.title} className="rounded-2xl bg-ivory/[0.04] p-6 ring-1 ring-ivory/10">
                <h3 className="mb-4 font-display text-xl text-gold">{g.title}</h3>
                <ul className="space-y-2 text-sm">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <Check light />
                      <span className="text-ivory/85">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Harga per venue & pax */}
          <div className="mt-16">
            <div className="mb-2 text-center">
              <h3 className="font-display text-3xl">Pilihan Gedung &amp; Harga</h3>
              <p className="mt-2 text-sm text-ivory/60">
                Pilih jumlah tamu untuk melihat estimasi harga tiap gedung.
              </p>
            </div>
            <Ornament light />
            <AllInPricing />
          </div>
        </div>
      </section>

      {/* ── GALERI ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.42em] text-gold">Galeri</p>
          <h2 className="mt-2 font-display text-4xl text-ink">Momen yang Kami Rangkai</h2>
          <Ornament />
        </div>
        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { src: "/images/g1.jpg", span: "row-span-2", alt: "Potret pengantin" },
            { src: "/images/g2.jpg", span: "", alt: "Detail tangan pengantin" },
            { src: "/images/ceremony.jpg", span: "", alt: "Upacara pernikahan" },
            { src: "/images/g3.jpg", span: "col-span-2", alt: "Prosesi cincin" },
            { src: "/images/band.jpg", span: "col-span-2 sm:col-span-1", alt: "Pre-wedding" },
          ].map((img) => (
            <div key={img.src} className={`group overflow-hidden rounded-2xl ${img.span}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── KONTAK ─────────────────────────────────────────── */}
      <footer className="bg-ink text-ivory">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.42em] text-gold">Hubungi Kami</p>
          <a
            href={`https://wa.me/62${CONTACT.phone.replace(/^0/, "").replace(/\s/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-3xl transition hover:text-gold sm:text-4xl"
          >
            {CONTACT.phone}
          </a>
          <p className="mt-3 text-sm tracking-wider text-ivory/60">
            Instagram ·{" "}
            <a
              href={`https://instagram.com/${CONTACT.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory/90 transition hover:text-gold"
            >
              @{CONTACT.instagram}
            </a>
          </p>
          <p className="mt-8 text-xs text-ivory/35">
            © {new Date().getFullYear()} Amazing Concept Manado — All in Package &amp; Wedding
            Organizer Services.
          </p>
        </div>
      </footer>
    </main>
  );
}
