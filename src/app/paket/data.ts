// Data paket pernikahan Amazing Concept Manado.
// Dipakai bersama oleh page.tsx (server) dan AllInPricing.tsx (client).

export type TierPackage = {
  name: string;
  tagline: string;
  price: number;
  guests: string;
  featured: boolean;
  features: string[];
  bonus?: string[];
};

export const tierPackages: TierPackage[] = [
  {
    name: "Joyful Package",
    tagline: "Esensial untuk hari bahagia Anda",
    price: 7_500_000,
    guests: "100–400 tamu",
    featured: false,
    features: [
      "1 Professional Crew untuk Pre-Wedding",
      "8 Professional Crews (4 full day & 4 half day)",
      "Pembuatan grup WhatsApp untuk koordinasi",
      "Konsultasi acara unlimited",
      "Penyusunan rundown acara",
      "2x rapat koordinasi dengan pengantin",
      "3x pendampingan fitting bridal",
      "Pengurusan berkas Capil (khusus daerah Manado)",
      "Koordinasi antar vendor",
      "Technical Meeting / Final Meeting / Gladi Resik",
      "Menyediakan All Script untuk hari H",
    ],
  },
  {
    name: "Wonderful Package",
    tagline: "Lebih lengkap, lebih tenang",
    price: 10_000_000,
    guests: "300–800 tamu",
    featured: true,
    features: [
      "2 Professional Crews untuk Pre-Wedding",
      "12 Professional Crews (6 full day & 6 half day)",
      "Grup WhatsApp koordinasi (termasuk seluruh vendor)",
      "Konsultasi acara unlimited (termasuk budgeting & termin pembayaran)",
      "3x rapat koordinasi dengan pengantin",
      "3x pendampingan fitting bridal",
      "Pengurusan berkas Capil (khusus daerah Manado)",
      "Technical Meeting / Final Meeting / Gladi Resik",
      "Menyediakan All Script untuk hari H",
      "Pengaturan meja VIP & list tamu VIP",
    ],
    bonus: ["Undangan Digital Exclusive", "Balon gas 50 pcs", "Plat mobil pengantin"],
  },
  {
    name: "Luxurious Package",
    tagline: "Pendampingan penuh seorang wedding planner",
    price: 12_000_000,
    guests: "300–1000 tamu",
    featured: false,
    features: [
      "Layanan Wedding Planner (dari perencanaan s/d hari H)",
      "2 Professional Crews untuk Pre-Wedding",
      "14 Professional Crews (7 full day & 7 half day)",
      "Pendampingan sejak awal perencanaan & pemilihan vendor",
      "Penyusunan budgeting & pendampingan visit ke venue dan bridal",
      "Rundown pre-wedding & hari H",
      "Grup WhatsApp koordinasi (termasuk seluruh vendor)",
      "Konsultasi acara unlimited",
      "Mengkreasi acara pernikahan yang unik & berkesan",
      "3x rapat koordinasi dengan pengantin",
      "3x pendampingan fitting bridal",
      "Pengurusan berkas Capil (khusus daerah Manado)",
      "Technical Meeting / Final Meeting / Gladi Resik",
      "Menyediakan All Script untuk hari H",
    ],
    bonus: [
      "Undangan Digital Exclusive",
      "Balon gas 50 pcs",
      "Plat mobil pengantin",
      "Pengaturan meja VIP & list tamu VIP",
    ],
  },
];

// ── All in Package ────────────────────────────────────────────────
// Paket menyeluruh: bridal, venue, katering, dan jasa WO dalam satu paket.
// Harga mengikuti pilihan gedung & jumlah tamu (lihat allInPricing).

export type InclusionGroup = { title: string; items: string[] };

export const allInInclusions: InclusionGroup[] = [
  {
    title: "Paket Bridal",
    items: [
      "1 Gaun Pengantin Exclusive",
      "1 Gaun Pengantin Bebas Pilih",
      "Makeup by Ipe Lim / Vania",
      "Retouch Makeup & Hairdo",
      "2 Set Jas Pengantin",
      "4 Gaun Mama Exclusive",
      "Makeup & Retouch by team",
      "2 Set Jas Papa & Dasi",
      "1 Gaun Putih Pre-Wedding",
      "2 Gaun Warna Pre-Wedding",
      "Makeup Pre-Wedding",
      "2 Set Jas Pre-Wedding",
      "Photo Pre-Wedding Indoor & Outdoor",
      "Photo 20R + Bingkai + Copy All Files",
      "20 File Edit Pre-Wedding",
      "Morning Express Video",
      "Photo & Video Liputan Hari H",
      "1 Album Magnetik Hari H",
    ],
  },
  {
    title: "Bonus",
    items: [
      "Bunga Tangan & Bunga Dada (Fresh Flower)",
      "Aksesoris untuk Pengantin",
      "Kimono Pengantin",
      "Aksesoris Mama",
      "Tempat Cincin",
      "4 Gaun Bridesmaid + Makeup",
      "4 Suspender Groomsmen + Dasi",
    ],
  },
  {
    title: "Sudah Termasuk",
    items: [
      "Undangan Cetak & Souvenir",
      "Mobil Pengantin",
      "Akomodasi Hotel 4 Kamar",
      "Lunch Box 50 pcs di hari H",
      "Undangan Digital",
      "Balon Gas 50 pcs",
      "Plat Oto Pengantin",
      "Dekorasi Gereja",
      "Pengurusan Berkas Capil (khusus Manado)",
    ],
  },
  {
    title: "Venue / Gedung Pernikahan",
    items: [
      "Pemakaian Venue / Gedung (4 jam)",
      "Panggung & Dekorasi Pelaminan",
      "Dekorasi Meja Makan VIP untuk Pengantin",
      "Round Table (Meja Bulat) & Theater Seat",
      "Seat Cover dan Pita Kursi",
      "Sound System Standar",
      "Master of Ceremony",
      "Keyboard, Keyboardist, dan Singer",
      "Kue Pengantin & Artificial Dummy Cake",
      "Karpet Merah & Bunga Jalan",
      "Meja Penerima Tamu",
      "Kotak Sampul / Kotak Angpao",
      "Kamar Pengantin / Kamar Retouch",
      "Menu Katering Lengkap",
      "Air Mineral",
      "Champagne Tower & Toast",
    ],
  },
  {
    title: "Jasa Wedding Organizer",
    items: [
      "1 Professional Crew untuk follow Pre-Wedding",
      "8 Professional Crews standby di hari H (4 crew pagi + 4 crew malam)",
      "Pembuatan grup WhatsApp sejak dealing untuk koordinasi",
      "Konsultasi acara unlimited",
      "Pembuatan rundown acara",
      "2x meeting koordinasi dengan pengantin",
      "3x pendampingan fitting ke bridal (Perdana, Pre-Wed & Final Fitting)",
      "Pengurusan berkas Capil (khusus Manado)",
      "Koordinasi antar vendor",
      "1x Technical Meeting / Final Meeting / Gladi Resik",
      "All Script hari H (Cue Card MC, Script Ucapan Terima Kasih)",
    ],
  },
];

export type VenuePrice = { venue: string; price: number };
export type PaxTier = { pax: string; venues: VenuePrice[] };

export const allInPricing: PaxTier[] = [
  {
    pax: "200 pax",
    venues: [
      { venue: "MGP Imperial", price: 79_000_000 },
      { venue: "Nyiur Melambai", price: 80_000_000 },
      { venue: "Sky Hall", price: 71_000_000 },
      { venue: "Joy Hall", price: 76_000_000 },
      { venue: "Manado Tateli Resort", price: 88_000_000 },
      { venue: "Aryaduta Hotel", price: 90_000_000 },
      { venue: "D'Mason Villa", price: 78_000_000 },
      { venue: "The Sentra Hotel", price: 97_000_000 },
      { venue: "Four Points Hotel", price: 123_000_000 },
      { venue: "Aula Ignatius", price: 60_000_000 },
    ],
  },
  {
    pax: "300 pax",
    venues: [
      { venue: "MGP Imperial", price: 93_000_000 },
      { venue: "M-ICON Convention", price: 95_000_000 },
      { venue: "Nyiur Melambai", price: 97_000_000 },
      { venue: "Manado Convention Center", price: 96_000_000 },
      { venue: "Sky Hall", price: 82_000_000 },
      { venue: "Joy Hall", price: 81_000_000 },
      { venue: "Manado Tateli Resort", price: 111_000_000 },
      { venue: "Aryaduta Hotel", price: 110_000_000 },
      { venue: "D'Mason Villa", price: 94_000_000 },
      { venue: "The Sentra Hotel", price: 127_000_000 },
      { venue: "Four Points Hotel", price: 150_000_000 },
      { venue: "Aula Ignatius", price: 71_000_000 },
    ],
  },
  {
    pax: "400 pax",
    venues: [
      { venue: "MGP Imperial", price: 111_000_000 },
      { venue: "M-ICON Convention", price: 110_000_000 },
      { venue: "Nyiur Melambai", price: 118_000_000 },
      { venue: "Manado Convention Center", price: 118_000_000 },
      { venue: "Sky Hall", price: 98_000_000 },
      { venue: "Joy Hall", price: 89_000_000 },
      { venue: "Manado Tateli Resort", price: 150_000_000 },
      { venue: "Aryaduta Hotel", price: 138_000_000 },
      { venue: "D'Mason Villa", price: 117_000_000 },
      { venue: "The Sentra Hotel", price: 157_000_000 },
      { venue: "Four Points Hotel", price: 181_000_000 },
      { venue: "Aula Ignatius", price: 81_000_000 },
    ],
  },
  {
    pax: "500 pax",
    venues: [
      { venue: "M-ICON Convention", price: 121_000_000 },
      { venue: "Nyiur Melambai", price: 136_000_000 },
      { venue: "Manado Convention Center", price: 136_000_000 },
      { venue: "Joy Hall", price: 95_000_000 },
      { venue: "Manado Tateli Resort", price: 214_000_000 },
      { venue: "The Sentra Hotel", price: 183_000_000 },
      { venue: "Four Points Hotel", price: 209_000_000 },
      { venue: "Aula Ignatius", price: 88_000_000 },
    ],
  },
];

export const CONTACT = { phone: "0821 5455 5151", instagram: "amazingconcept_wo" };

// ── Opsi untuk form Project Baru ──────────────────────────────────
// Daftar paket & venue yang ditawarkan, dipakai sebagai pilihan dropdown.
export const packageOptions: string[] = [
  ...tierPackages.map((p) => p.name),
  "All in Package",
];

export const venueOptions: string[] = Array.from(
  new Set(allInPricing.flatMap((t) => t.venues.map((v) => v.venue)))
).sort((a, b) => a.localeCompare(b, "id"));
