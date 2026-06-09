# WeddingCo — Wedding Organizer Project Studio

Aplikasi internal untuk tim Wedding Organizer: pantau progress setiap project pernikahan
(checklist & milestone, manajemen vendor, budget & pembayaran, hitung mundur hari-H),
dengan sistem login dan dua peran: **Super Admin** (owner) dan **Staff / Koordinator**.

Owner bisa membuat & mengelola akun staff. Staff hanya melihat project yang ditugaskan kepadanya.

---

## Teknologi

- **Next.js 14** (App Router) — frontend + backend dalam satu codebase
- **Prisma ORM** + **SQLite** (default, tanpa setup) — mudah diganti ke PostgreSQL
- **Autentikasi sendiri**: password di-hash (bcrypt), sesi JWT di cookie httpOnly, akses per-peran
- **Tailwind CSS**

---

## Menjalankan di komputer lokal

Prasyarat: **Node.js 18.17+** (disarankan 20+).

```bash
# 1. Install dependency
npm install

# 2. Generate Prisma client + buat database + isi data awal (owner & demo)
npm run setup

# 3. Jalankan
npm run dev
```

Buka http://localhost:3000

> Catatan: `npm run setup` butuh akses internet sekali untuk mengunduh engine Prisma
> (`binaries.prisma.sh`). Setelah itu tidak perlu lagi.

### Akun default (dari seed)

| Peran        | Email                | Password    |
|--------------|----------------------|-------------|
| Super Admin  | owner@weddingco.id   | owner12345  |
| Staff (demo) | staff@weddingco.id   | staff12345  |

**Ganti kredensial ini sebelum dipakai sungguhan** (lihat di bawah).

---

## Konfigurasi (.env)

Salin `.env.example` menjadi `.env`, lalu sesuaikan:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<string-acak-panjang-min-32-karakter>"
OWNER_NAME="Owner WO"
OWNER_EMAIL="owner@weddingco.id"
OWNER_PASSWORD="<password-kuat>"
```

- **AUTH_SECRET** — wajib diganti untuk produksi. Buat string acak, misalnya:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- **OWNER_*** — akun owner pertama dibuat dari nilai ini saat `npm run setup`.
  Setelah akun owner ada, kamu bisa membuat akun lain langsung dari menu **Kelola Akun**.

---

## Deploy ke produksi

### Pilihan A — Tetap pakai SQLite (paling sederhana)

Cocok untuk skala WO (puluhan project, beberapa staff). Deploy ke server yang punya
**disk persisten**, misalnya Railway atau Render (bukan Vercel, karena Vercel tidak
menyimpan file SQLite secara permanen).

```bash
npm run build
npm start
```

Pastikan folder database (`prisma/dev.db`) berada di disk persisten, dan set semua
variabel `.env` di dashboard hosting.

### Pilihan B — PostgreSQL (untuk skala lebih besar / Vercel)

1. Siapkan database Postgres gratis (mis. Neon atau Supabase).
2. Di `prisma/schema.prisma`, ganti:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` ke connection string Postgres.
4. Jalankan `npm run setup` (atau `npx prisma migrate deploy` untuk alur migrasi).
5. Deploy ke Vercel/Railway/Render seperti biasa.

Tidak ada perubahan kode lain yang diperlukan — Prisma menangani perbedaannya.

---

## Struktur

```
src/
  app/
    login/                 Halaman & form login
    (app)/                 Area setelah login (dilindungi)
      dashboard/           Ringkasan + countdown + progress semua project
      projects/            Daftar project + halaman detail (tab: ringkasan,
                           checklist & milestone, vendor, budget)
      users/               Kelola akun (khusus Super Admin)
    api/                   Route API (auth, projects, tasks, vendors, budget, users)
  components/Sidebar.tsx   Navigasi
  lib/                     prisma, auth (JWT), kontrol akses, util format
  middleware.ts            Proteksi route + pembatasan /users untuk Super Admin
prisma/
  schema.prisma            Model data
  seed.ts                  Data awal (owner + demo project)
```

---

## Peran & hak akses

- **Super Admin (owner):** melihat semua project, membuat/menonaktifkan/menghapus akun,
  mengubah peran, reset password, dan menghapus project.
- **Staff / Koordinator:** melihat & mengelola project yang ia buat atau yang ditugaskan
  kepadanya. Tidak bisa mengakses menu Kelola Akun maupun menghapus project.

---

## Catatan keamanan (penting, baca sebelum deploy)

- Versi Next.js di sini adalah **14.2.35**, yang sudah menambal kerentanan kritis
  Desember 2025. Beberapa advisory tingkat menengah lain baru ditambal sepenuhnya di
  Next.js 16. Aplikasi ini **tidak menggunakan** fitur yang terdampak (image optimizer
  `remotePatterns`, rewrites, RSC tidak aman), jadi risikonya rendah untuk pemakaian
  internal. Bila ingin sepenuhnya bersih dari advisory, kamu bisa upgrade ke Next.js 16
  (perlu penyesuaian karena `params` pada route menjadi async).
- `tsx` (dipakai hanya untuk script seed saat development) membawa advisory `esbuild`
  tingkat menengah yang hanya relevan untuk dev server, bukan produksi.
- Selalu ganti `AUTH_SECRET` dan password owner sebelum go-live.
- Aktifkan HTTPS di produksi (cookie sesi otomatis `secure` saat `NODE_ENV=production`).

---

## Perintah berguna

```bash
npm run dev        # mode development
npm run build      # build produksi (menjalankan prisma generate lalu next build)
npm start          # menjalankan hasil build
npm run db:push    # sinkron skema ke database tanpa migrasi
npm run db:seed    # isi ulang data awal
npx prisma studio  # GUI untuk melihat/mengedit isi database
```
