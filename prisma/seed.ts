import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL || "owner@weddingco.id";
  const ownerPassword = process.env.OWNER_PASSWORD || "owner12345";
  const ownerName = process.env.OWNER_NAME || "Owner WO";

  const existing = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (existing) {
    console.log(`Owner sudah ada: ${ownerEmail}`);
  } else {
    const passwordHash = await bcrypt.hash(ownerPassword, 10);
    await prisma.user.create({
      data: { name: ownerName, email: ownerEmail, passwordHash, role: "SUPER_ADMIN" },
    });
    console.log(`Owner dibuat: ${ownerEmail} / ${ownerPassword}`);
  }

  // Demo staff + project hanya jika DB masih kosong projeknya
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const staffHash = await bcrypt.hash("staff12345", 10);
    const staff = await prisma.user.upsert({
      where: { email: "staff@weddingco.id" },
      update: {},
      create: { name: "Koordinator Andi", email: "staff@weddingco.id", passwordHash: staffHash, role: "STAFF" },
    });

    const owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
    const wedDate = new Date();
    wedDate.setMonth(wedDate.getMonth() + 3);

    const project = await prisma.project.create({
      data: {
        groomName: "Bagas",
        brideName: "Rani",
        coupleName: "Bagas & Rani",
        weddingDate: wedDate,
        venue: "Grand Ballroom Hotel Aryaduta, Manado",
        packageName: "Paket Platinum",
        status: "IN_PROGRESS",
        createdById: owner?.id,
        notes: "Tema rustic-botanical, 500 undangan.",
        assignments: { create: [{ userId: staff.id }] },
        tasks: {
          create: [
            { title: "Tanda tangan kontrak klien", category: "Administrasi", done: true, isMilestone: true, order: 1 },
            { title: "DP venue & catering", category: "Pembayaran", done: true, isMilestone: true, order: 2 },
            { title: "Fitting baju pengantin", category: "Persiapan", done: true, order: 3 },
            { title: "Finalisasi rundown acara", category: "Konsep", done: false, isMilestone: true, order: 4 },
            { title: "Technical meeting H-7", category: "Koordinasi", done: false, isMilestone: true, order: 5 },
            { title: "Pelunasan semua vendor", category: "Pembayaran", done: false, isMilestone: true, order: 6 },
          ],
        },
        vendors: {
          create: [
            { name: "Catering Nusantara", category: "Catering", contact: "0812-1111-2222", cost: 75000000, status: "DEAL" },
            { name: "Lensa Abadi Photography", category: "Fotografi", contact: "0813-3333-4444", cost: 25000000, status: "LUNAS" },
            { name: "Bloom Decor", category: "Dekorasi", contact: "0814-5555-6666", cost: 40000000, status: "DEAL" },
            { name: "MC Bagus", category: "Entertainment", contact: "0815-7777-8888", cost: 8000000, status: "PROSPEK" },
          ],
        },
        budgetItems: {
          create: [
            { description: "Catering 500 pax", category: "Catering", planned: 75000000, paid: 30000000 },
            { description: "Dekorasi pelaminan", category: "Dekorasi", planned: 40000000, paid: 20000000 },
            { description: "Dokumentasi foto & video", category: "Dokumentasi", planned: 25000000, paid: 25000000 },
            { description: "Venue & sound", category: "Venue", planned: 60000000, paid: 30000000 },
          ],
        },
      },
    });
    console.log(`Demo project dibuat: ${project.coupleName}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
