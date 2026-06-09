import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, Session } from "@/lib/auth";

async function canAccess(session: Session, projectId: string) {
  if (session.role === "SUPER_ADMIN") return true;
  const p = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [{ createdById: session.userId }, { assignments: { some: { userId: session.userId } } }],
    },
    select: { id: true },
  });
  return !!p;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccess(session, params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tasks: { orderBy: [{ done: "asc" }, { order: "asc" }, { createdAt: "asc" }] },
      vendors: { orderBy: { createdAt: "asc" } },
      budgetItems: { orderBy: { createdAt: "asc" } },
      assignments: { include: { user: { select: { id: true, name: true, email: true } } } },
      createdBy: { select: { name: true } },
    },
  });
  if (!project) return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  if (!(await canAccess(session, params.id)))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of ["groomName", "brideName", "venue", "packageName", "status", "notes"]) {
    if (key in body) data[key] = body[key];
  }
  if (body.weddingDate) data.weddingDate = new Date(body.weddingDate);
  // Susun ulang coupleName bila salah satu nama mempelai berubah
  if ("groomName" in body || "brideName" in body) {
    const current = await prisma.project.findUnique({
      where: { id: params.id },
      select: { groomName: true, brideName: true },
    });
    const groomName = String(body.groomName ?? current?.groomName ?? "").trim();
    const brideName = String(body.brideName ?? current?.brideName ?? "").trim();
    data.coupleName = `${groomName} & ${brideName}`;
  }

  const project = await prisma.project.update({ where: { id: params.id }, data });
  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Hanya Super Admin yang dapat menghapus project." }, { status: 403 });
  }
  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
