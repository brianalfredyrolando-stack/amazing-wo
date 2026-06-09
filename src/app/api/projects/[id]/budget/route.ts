import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessProject } from "@/lib/access";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccessProject(session, params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const body = await req.json();
  if (!body.description) return NextResponse.json({ error: "Deskripsi wajib diisi." }, { status: 400 });

  const item = await prisma.budgetItem.create({
    data: {
      projectId: params.id,
      description: String(body.description).trim(),
      category: body.category || "Lainnya",
      planned: Number(body.planned) || 0,
      paid: Number(body.paid) || 0,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
