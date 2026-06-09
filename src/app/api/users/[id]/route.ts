import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }
  if (session.userId === params.id) {
    return NextResponse.json({ error: "Tidak bisa mengubah akun sendiri di sini." }, { status: 400 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.active === "boolean") data.active = body.active;
  if (body.role === "SUPER_ADMIN" || body.role === "STAFF") data.role = body.role;
  if (body.password) {
    if (String(body.password).length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(body.password, 10);
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  return NextResponse.json(user);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }
  if (session.userId === params.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri." }, { status: 400 });
  }
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
