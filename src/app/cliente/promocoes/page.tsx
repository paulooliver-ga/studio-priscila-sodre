import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function PromocoesPage() {
  await requireAuth();

  const promotions = await prisma.promotion.findMany({
    where: { active: true },
    orderBy: { startsAt: "asc" },
  });

  const currentDate = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Promoções da Semana</h2>

        <div className="card mb-8 bg-gradient-to-r from-primary-100 to-gold-100 border-primary-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">Indique uma amiga!</h3>
              <p className="text-gray-600">Ambas ganham 30% de desconto no próximo serviço</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {promotions.length === 0 ? (
            <p className="text-gray-500">Nenhuma promoção disponível no momento.</p>
          ) : (
            promotions.map((promotion) => {
              const starts = new Date(promotion.startsAt);
              const ends = new Date(promotion.endsAt);
              const isActive = currentDate >= starts && currentDate <= ends;

              return (
                <div
                  key={promotion.id}
                  className={`card ${!isActive ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">✨</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800">
                          {promotion.title}
                        </h3>
                        {isActive && (
                          <span className="badge badge-success">Ativa</span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{promotion.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>📅</span>
                        <span>
                          {starts.toLocaleDateString("pt-BR")} -{" "}
                          {ends.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 btn-primary w-full">Quero aproveitar</button>
                </div>
              );
            })
          )}
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
}