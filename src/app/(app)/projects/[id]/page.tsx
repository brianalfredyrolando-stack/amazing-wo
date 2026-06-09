import { getSession } from "@/lib/auth";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = (await getSession())!;
  return <ProjectDetailClient projectId={params.id} role={session.role} />;
}
