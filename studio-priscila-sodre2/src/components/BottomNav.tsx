"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/cliente/cartao",    label: "Cartão",    icon: "💳" },
  { href: "/cliente/promocoes", label: "Promoções", icon: "🌟" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-rose-100 px-4 py-2 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex flex-col items-center gap-1 px-8 py-1 rounded-2xl transition-all ${
                active ? "text-rose-600 bg-rose-50" : "text-gray-400"
              }`}>
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <a href="https://wa.me/5561982533037" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-20 right-4 bg-green-500 text-white w-14 h-14 rounded-full 
                   flex items-center justify-center shadow-xl hover:scale-110 transition-all text-2xl z-50">
        💬
      </a>
    </nav>
  );
}
