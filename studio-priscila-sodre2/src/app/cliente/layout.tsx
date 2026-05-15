import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";
import { LOGO_BASE64 } from "@/lib/logo";

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 border-b px-4 py-3"
        style={{ background: "rgba(10,8,2,0.95)", borderColor: "rgba(212,175,55,0.3)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_BASE64} alt="Logo" className="w-9 h-9 rounded-full border-2 object-cover"
              style={{ borderColor: "#D4AF37" }} />
            <div>
              <h1 className="font-display text-base font-bold gold-text leading-tight">Studio Priscila Sodré</h1>
              <p className="text-xs" style={{ color: "rgba(212,175,55,0.5)" }}>Olá, {user.name.split(" ")[0]} ✨</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
