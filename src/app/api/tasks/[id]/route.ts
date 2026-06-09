import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessChild } from "@/lib/access";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccessChild(session, "task", params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.done === "boolean") data.done = body.done;
  if (typeof body.isMilestone === "boolean") data.isMilestone = body.isMilestone;
  if (body.title) data.title = String(body.title).trim();
  if (body.category) data.category = body.category;
  if ("dueDate" in body) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;

  const task = await prisma.task.update({ where: { id: params.id }, data });
  return NextResponse.json(task);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccessChild(session, "task", params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
