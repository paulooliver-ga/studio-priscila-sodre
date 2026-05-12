import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export default async function AdminPromocoesPage() {
  await requireAdmin();

  const promotions = await prisma.promotion.findMany({
    orderBy: { startsAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Promoções</h2>
          <p className="text-gray-500">Gerencie as promoções ativas</p>
        </div>
        <button className="btn-primary">Nova Promoção</button>
      </div>

      <div className="space-y-4">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {promotion.title}
                  </h3>
                  <span
                    className={
                      promotion.active ? "badge badge-success" : "badge badge-warning"
                    }
                  >
                    {promotion.active ? "Ativa" : "Inativa"}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{promotion.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(promotion.startsAt).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(promotion.endsAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary py-2 px-4 text-sm">Editar</button>
                <button className="btn-secondary py-2 px-4 text-sm">
                  {promotion.active ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}