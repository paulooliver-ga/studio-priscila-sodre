export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCard } from "@/lib/loyalty";

export default async function CartaoPage({ searchParams }: { searchParams: { scanned?: string; error?: string } }) {
  const user = await getSession();
  const today = new Date();
  const isBirthday = user.birthdate && 
  new Date(user.birthdate).getDate() === today.getDate() &&
  new Date(user.birthdate).getMonth() === today.getMonth();
  if (!user) return null;

  const card = await getOrCreateCard(user.id);
  const entries = await prisma.loyaltyEntry.findMany({
    where: { loyaltyCardId: card.id },
    include: { service: true },
    orderBy: { registeredAt: "desc" },
  });
  const rewards = await prisma.reward.findMany({
    where: { loyaltyCardId: card.id, used: false },
    orderBy: { createdAt: "desc" },
  });

  const serviceEntries = entries.filter((e) => e.service.type === "SERVICE");
  const totalServices = serviceEntries.length;
  const filledDots = totalServices % 5;

  const productGroups: Record<string, { name: string; count: number }> = {};
  for (const e of entries.filter((e) => e.service.type === "PRODUCT")) {
    if (!productGroups[e.serviceId]) productGroups[e.serviceId] = { name: e.service.name, count: 0 };
    productGroups[e.serviceId].count++;
  }

  return (
    <div className="space-y-5">
      {searchParams.scanned === "1" && (
       
    <div className="rounded-2xl p-4 text-center font-semibold"
        style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}>
           ✅ Serviço registrado no seu cartão!
     </div>
 )}

 {isBirthday && (
    <div className="rounded-2xl p-4 text-center font-semibold"
          style={{ background: "rgba(212,175,55,0.15)", border: "2px solid rgba(212,175,55,0.5)" }}>
          <p className="text-2xl mb-1">🎂</p>
          <p className="font-bold gold-text text-lg">Feliz Aniversário, {user.name.split(" ")[0]}!</p>
          <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.7)" }}>
          Você ganhou 10% de desconto hoje! Mostre para a atendente 🎁
        </p>
    </div>
       )}
        <div className="rounded-2xl p-4 text-center font-semibold"
          style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}>
          ✅ Serviço registrado no seu cartão!
        </div>
       
      {searchParams.error === "1" && (
        <div className="rounded-2xl p-4 text-center font-semibold"
          style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.3)", color: "#ff6b6b" }}>
          ❌ QR Code inválido ou inativo.
        </div>
      )}

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-black shadow-2xl"
        style={{ background: "linear-gradient(135deg, #D4AF37 0%, #f5d76e 50%, #b8860b 100%)", boxShadow: "0 8px 40px rgba(212,175,55,0.4)" }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-10 translate-x-10" style={{ background: "rgba(255,255,255,0.15)" }} />
        <p className="text-xs uppercase tracking-widest mb-1 font-bold opacity-70">Cartão Fidelidade</p>
        <h2 className="font-display text-2xl font-bold">{user.name}</h2>
        <p className="text-sm mt-1 opacity-70">📞 {user.phone}</p>
        <div className="mt-4 pt-4 border-t border-black/20 flex gap-6">
          <div>
            <p className="text-xs opacity-60">Visitas</p>
            <p className="font-bold text-xl">{totalServices}</p>
          </div>
          <div>
            <p className="text-xs opacity-60">Recompensas</p>
            <p className="font-bold text-xl">{rewards.length}</p>
          </div>
        </div>
      </div>

      {/* Rewards */}
      {rewards.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(212,175,55,0.5)", background: "rgba(212,175,55,0.08)" }}>
          <h3 className="font-display text-lg font-bold gold-text mb-3">🏆 Suas Recompensas</h3>
          {rewards.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-2"
              style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)" }}>
              <span className="text-2xl">{r.type === "GIFT" ? "🎁" : "🏷️"}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#f5e6a3" }}>
                  {r.type === "GIFT" ? "Brinde Especial!" : "50% de Desconto!"}
                </p>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.6)" }}>{r.reason}</p>
              </div>
            </div>
          ))}
          <p className="text-xs mt-2" style={{ color: "rgba(212,175,55,0.4)" }}>Mostre para a atendente 💖</p>
        </div>
      )}

      {/* Services */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold gold-text">✂️ Serviços</h3>
          <span className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>
            {filledDots}/5 → 50% OFF
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i < filledDots;
            return (
              <div key={i} className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all"
                style={filled
                  ? { background: "linear-gradient(135deg, #D4AF37, #f0d060)", borderColor: "#D4AF37", color: "#000", boxShadow: "0 4px 12px rgba(212,175,55,0.4)" }
                  : { background: "transparent", borderColor: "rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.3)" }}>
                {filled ? (i === 4 ? "🏷️" : "✓") : i + 1}
              </div>
            );
          })}
        </div>
        {totalServices > 0 && (
          <p className="text-xs mt-3" style={{ color: "rgba(212,175,55,0.4)" }}>Total acumulado: {totalServices} serviços</p>
        )}
      </div>

      {/* Products */}
      {Object.keys(productGroups).length > 0 && (
        <div className="card">
          <h3 className="font-display text-lg font-bold gold-text mb-4">💆 Produtos</h3>
          {Object.entries(productGroups).map(([id, group]) => {
            const filled = group.count % 3;
            return (
              <div key={id} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: "#f5e6a3" }}>{group.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>
                    {filled}/3 → Brinde
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => {
                    const f = i < filled;
                    return (
                      <div key={i} className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all"
                        style={f
                          ? { background: "linear-gradient(135deg, #D4AF37, #f0d060)", borderColor: "#D4AF37", color: "#000", boxShadow: "0 4px 12px rgba(212,175,55,0.4)" }
                          : { background: "transparent", borderColor: "rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.3)" }}>
                        {f ? (i === 2 ? "🎁" : "✓") : i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WhatsApp */}
      <a href="https://wa.me/5561982533037" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-3xl px-5 py-4 transition-all hover:opacity-90"
        style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)" }}>
        <span className="text-3xl">💬</span>
        <div>
          <p className="font-semibold text-sm" style={{ color: "#25d366" }}>Fale com o Studio</p>
          <p className="text-xs" style={{ color: "rgba(37,211,102,0.6)" }}>(61) 98253-3037 • WhatsApp</p>
        </div>
      </a>
    </div>
  );
}
