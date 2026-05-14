"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LOGO_BASE64 } from "@/lib/logo";

const links = [
  { href: "/admin",             label: "Dashboard",   icon: "📊" },
  { href: "/admin/clientes",    label: "Clientes",    icon: "👩" },
  { href: "/admin/servicos",    label: "Serviços",    icon: "✂️" },
  { href: "/admin/promocoes",   label: "Promoções",   icon: "🌟" },
  { href: "/admin/recompensas", label: "Recompensas", icon: "🏆" },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Até logo!");
    router.push("/login");
  }

  return (
    <aside className="w-60 flex flex-col min-h-screen sticky top-0 border-r"
      style={{ background: "rgba(10,8,2,0.98)", borderColor: "rgba(212,175,55,0.25)" }}>
      <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: "rgba(212,175,55,0.25)" }}>
        <img src={LOGO_BASE64} alt="Logo" className="w-12 h-12 rounded-full border-2 object-cover"
          style={{ borderColor: "#D4AF37" }} />
        <div>
          <p className="font-display font-bold gold-text text-sm">Studio Priscila</p>
          <p className="text-xs" style={{ color: "rgba(212,175,55,0.5)" }}>Sodré — Admin</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all`}
              style={active
                ? { background: "linear-gradient(135deg, #D4AF37, #f0d060)", color: "#000" }
                : { color: "rgba(212,175,55,0.6)" }}>
              <span>{link.icon}</span>{link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: "rgba(212,175,55,0.25)" }}>
        <p className="text-xs mb-2 truncate" style={{ color: "rgba(212,175,55,0.4)" }}>{adminName}</p>
        <button onClick={logout} className="text-sm transition-colors" style={{ color: "rgba(212,175,55,0.5)" }}>Sair →</button>
      </div>
    </aside>
  );
}
