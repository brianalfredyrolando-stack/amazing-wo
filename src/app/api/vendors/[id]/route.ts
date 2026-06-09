import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessChild } from "@/lib/access";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccessChild(session, "vendor", params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["name", "category", "contact", "status", "notes"]) if (k in body) data[k] = body[k];
  if ("cost" in body) data.cost = Number(body.cost) || 0;

  const vendor = await prisma.vendor.update({ where: { id: params.id }, data });
  return NextResponse.json(vendor);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccessChild(session, "vendor", params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  await prisma.vendor.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
