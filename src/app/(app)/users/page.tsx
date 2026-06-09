import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = (await getSession())!;
  if (session.role !== "SUPER_ADMIN") redirect("/dashboard");
  return <UsersClient currentUserId={session.userId} />;
}
