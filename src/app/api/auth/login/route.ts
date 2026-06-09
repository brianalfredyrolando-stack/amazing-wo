import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
  if (!user || !user.active) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const token = await createToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role as "SUPER_ADMIN" | "STAFF",
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, role: user.role });
}
