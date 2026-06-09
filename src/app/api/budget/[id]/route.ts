import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessChild } from "@/lib/access";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccessChild(session, "budgetItem", params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["description", "category"]) if (k in body) data[k] = body[k];
  if ("planned" in body) data.planned = Number(body.planned) || 0;
  if ("paid" in body) data.paid = Number(body.paid) || 0;
  if ("dueDate" in body) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;

  const item = await prisma.budgetItem.update({ where: { id: params.id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccessChild(session, "budgetItem", params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  await prisma.budgetItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
