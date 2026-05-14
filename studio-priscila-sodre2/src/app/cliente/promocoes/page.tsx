import { prisma } from "@/lib/prisma";

export default async function PromocoesPage() {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: { active: true, startsAt: { lte: now }, endsAt: { gte: now } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold gold-text">Promoções 🌟</h2>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>Ofertas exclusivas desta semana</p>
      </div>

      {promotions.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-5xl">🌸</span>
          <p className="mt-4" style={{ color: "rgba(212,175,55,0.5)" }}>Nenhuma promoção ativa no momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map((p) => (
            <div key={p.id} className="card border-l-4" style={{ borderLeftColor: "#D4AF37" }}>
              <h3 className="font-display text-lg font-semibold" style={{ color: "#f5e6a3" }}>{p.title}</h3>
              <p className="text-sm mt-2" style={{ color: "rgba(212,175,55,0.6)" }}>{p.description}</p>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.35)" }}>
                  Até {new Date(p.endsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                </p>
                <a href="https://wa.me/5561982533037" target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{ background: "rgba(37,211,102,0.15)", color: "#25d366" }}>
                  Agendar 💬
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-3xl p-5" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)" }}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">💬</span>
          <div>
            <p className="font-display text-lg font-bold" style={{ color: "#25d366" }}>Agende pelo WhatsApp</p>
            <p className="text-sm" style={{ color: "rgba(37,211,102,0.6)" }}>(61) 98253-3037</p>
          </div>
        </div>
        <a href="https://wa.me/5561982533037?text=Olá! Quero agendar um horário 💖"
          target="_blank" rel="noopener noreferrer"
          className="mt-4 block text-center font-bold py-3 rounded-2xl transition-colors"
          style={{ background: "#25d366", color: "#fff" }}>
          Falar agora
        </a>
      </div>
    </div>
  );
}
