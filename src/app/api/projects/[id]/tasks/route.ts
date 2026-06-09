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
  if (!body.title) return NextResponse.json({ error: "Judul tugas wajib diisi." }, { status: 400 });

  const count = await prisma.task.count({ where: { projectId: params.id } });
  const task = await prisma.task.create({
    data: {
      projectId: params.id,
      title: String(body.title).trim(),
      category: body.category || "Umum",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      isMilestone: !!body.isMilestone,
      order: count + 1,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
