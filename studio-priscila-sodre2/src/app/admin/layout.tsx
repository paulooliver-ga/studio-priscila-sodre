import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/cliente/cartao");

  return (
    <div className="min-h-screen flex">
      <AdminSidebar adminName={user.name} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
