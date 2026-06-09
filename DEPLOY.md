# Deploy Gratis — Vercel + Neon (PostgreSQL)

Panduan menjalankan aplikasi ini secara online **tanpa biaya**.
Semua layanan di bawah punya paket gratis permanen dan **tidak meminta kartu kredit**.

```
Kode  ──push──▶  GitHub  ──import──▶  Vercel (menjalankan app)
                                          │
                                          ▼
                                   Neon (database Postgres)
```

---

## 1. Buat database gratis di Neon

1. Buka <https://neon.tech> → **Sign up** (bisa pakai akun GitHub).
2. **Create Project** → beri nama, pilih region terdekat (mis. Singapore).
3. Setelah dibuat, salin **Connection string** (format `postgresql://...?sslmode=require`).
   - Gunakan string **"Pooled connection"** untuk aplikasi (cocok untuk Vercel).

---

## 2. Buat tabel + akun owner (sekali saja, dari komputermu)

Di folder proyek, buat file `.env` (jangan di-commit) berisi connection string Neon:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
AUTH_SECRET="<string-acak-min-32-karakter>"
OWNER_NAME="Owner WO"
OWNER_EMAIL="owner@amazingwo.id"
OWNER_PASSWORD="<password-kuat>"
```

Buat `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Lalu jalankan (membuat tabel di Neon + mengisi akun owner & demo):

```bash
npm run setup
```

> Cek hasilnya dengan `npx prisma studio` bila ingin.

---

## 3. Push kode ke GitHub

```bash
git remote add origin https://github.com/<username>/<nama-repo>.git
git branch -M main
git push -u origin main
```

---

## 4. Deploy di Vercel

1. Buka <https://vercel.com> → **Sign up / Login with GitHub** (gratis, paket Hobby).
2. **Add New → Project** → pilih repo tadi → **Import**.
3. Di bagian **Environment Variables**, tambahkan (ambil dari `.env` lokalmu):
   - `DATABASE_URL` — connection string Neon
   - `AUTH_SECRET` — string acak yang sama
   - `OWNER_NAME`, `OWNER_EMAIL`, `OWNER_PASSWORD`
4. Klik **Deploy**.
5. Selesai — dapat URL publik `https://<nama-app>.vercel.app` ✅

Login pakai `OWNER_EMAIL` / `OWNER_PASSWORD` yang kamu set.

---

## Update berikutnya

Cukup `git push` — Vercel otomatis deploy ulang. Tidak perlu langkah lain.

## Catatan biaya

- **Neon** free: 0,5 GB storage — lebih dari cukup untuk WO. Database tidak kedaluwarsa.
- **Vercel** Hobby: gratis untuk proyek pribadi/non-komersial-berat.
- **GitHub**: repo publik & privat gratis.

Tidak ada langkah di atas yang menagih biaya.
