export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function ClientesPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      loyaltyCards: { include: { entries: true, rewards: { where: { used: false } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Clientes</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>{clients.length} cadastradas</p>
      </div>
      {clients.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-5xl">👩</span>
          <p className="mt-4" style={{ color: "rgba(212,175,55,0.5)" }}>Nenhuma cliente ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => {
            const card = c.loyaltyCards[0];
            return (
              <div key={c.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-black"
                    style={{ background: "linear-gradient(135deg, #D4AF37, #f0d060)" }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "#f5e6a3" }}>{c.name}</p>
                    <p className="text-xs" style={{ color: "rgba(212,175,55,0.5)" }}>📞 {c.phone}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>{card?.entries.length ?? 0} visitas</span>
                      {(card?.rewards.length ?? 0) > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-black"
                          style={{ background: "linear-gradient(135deg, #D4AF37, #f0d060)" }}>
                          {card.rewards.length} recompensa{card.rewards.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>{new Date(c.createdAt).toLocaleDateString("pt-BR")}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
