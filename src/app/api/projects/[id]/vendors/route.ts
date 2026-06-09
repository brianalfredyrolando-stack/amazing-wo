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
  if (!body.name) return NextResponse.json({ error: "Nama vendor wajib diisi." }, { status: 400 });

  const vendor = await prisma.vendor.create({
    data: {
      projectId: params.id,
      name: String(body.name).trim(),
      category: body.category || "Lainnya",
      contact: body.contact || null,
      cost: Number(body.cost) || 0,
      status: body.status || "PROSPEK",
      notes: body.notes || null,
    },
  });
  return NextResponse.json(vendor, { status: 201 });
}
