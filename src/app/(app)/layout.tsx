import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar name={session.name} role={session.role} />
      <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-8 lg:py-10">{children}</main>
    </div>
  );
}
