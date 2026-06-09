import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, Session } from "@/lib/auth";

function visibilityWhere(session: Session) {
  if (session.role === "SUPER_ADMIN") return {};
  return {
    OR: [
      { createdById: session.userId },
      { assignments: { some: { userId: session.userId } } },
    ],
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: visibilityWhere(session),
    orderBy: { weddingDate: "asc" },
    include: {
      tasks: { select: { done: true } },
      assignments: { include: { user: { select: { id: true, name: true } } } },
      _count: { select: { vendors: true, budgetItems: true, tasks: true } },
    },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const body = await req.json();
  const groomName = String(body.groomName || "").trim();
  const brideName = String(body.brideName || "").trim();
  if (!groomName || !brideName || !body.weddingDate) {
    return NextResponse.json({ error: "Nama mempelai pria, wanita, dan tanggal wajib diisi." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      groomName,
      brideName,
      coupleName: `${groomName} & ${brideName}`,
      weddingDate: new Date(body.weddingDate),
      venue: body.venue || null,
      packageName: body.packageName || null,
      status: body.status || "PLANNING",
      notes: body.notes || null,
      createdById: session.userId,
      assignments: { create: [{ userId: session.userId }] },
    },
  });
  return NextResponse.json(project, { status: 201 });
}
