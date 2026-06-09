import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nama, email, dan password wajib diisi." }, { status: 400 });
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
  }

  const normalized = String(email).toLowerCase().trim();
  const exists = await prisma.user.findUnique({ where: { email: normalized } });
  if (exists) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: String(name).trim(),
      email: normalized,
      passwordHash,
      role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "STAFF",
    },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
