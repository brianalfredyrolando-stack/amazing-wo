import { getSession } from "@/lib/auth";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = (await getSession())!;
  return <ProjectsClient role={session.role} />;
}
