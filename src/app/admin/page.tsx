import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/cliente/cartao");
  }

  redirect("/admin/clientes");
}