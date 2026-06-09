import { prisma } from "@/lib/prisma";
import { Session } from "@/lib/auth";

export async function canAccessProject(session: Session, projectId: string): Promise<boolean> {
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

export async function canAccessChild(
  session: Session,
  model: "task" | "vendor" | "budgetItem",
  id: string
): Promise<string | null> {
  const record = await (prisma[model] as any).findUnique({
    where: { id },
    select: { projectId: true },
  });
  if (!record) return null;
  const ok = await canAccessProject(session, record.projectId);
  return ok ? record.projectId : null;
}
