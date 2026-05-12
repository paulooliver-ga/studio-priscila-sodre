import { getLoyaltyCardStats } from "@/lib/loyalty";
import { requireAuth } from "@/lib/auth-helpers";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { redirect } from "next/navigation";

export default async function CartaoPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const session = await requireAuth();
  const stats = await getLoyaltyCardStats(session.user.id);

  if (!stats) {
    redirect("/login");
  }

  const success = (await searchParams).success;
  const error = (await searchParams).error;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Olá, {session.user.name.split(" ")[0]}!</h2>
          <p className="text-gray-500">Seu cartão fidelidade digital</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {decodeURIComponent(success)}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
            Serviço já registrado hoje.
          </div>
        )}

        <div className="card mb-8 border-gold-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Cartão Fidelidade</h3>
            <span className="badge badge-warning">VIP</span>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Serviços</h4>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    index <= stats.serviceProgress
                      ? "bg-primary-300 border-primary-300"
                      : index === 5 && stats.serviceProgress === 4
                      ? "bg-gold-300 border-gold-400"
                      : "bg-gray-100 border-gray-200"
                  }`}
                >
                  {index === 5 && stats.serviceProgress === 4 ? (
                    <span className="text-white font-bold text-xs">50%</span>
                  ) : index <= stats.serviceProgress ? (
                    <span className="text-white font-bold">✓</span>
                  ) : (
                    <span className="text-gray-400 font-bold">{index}</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {stats.serviceCount} de 5 serviços realizados
            </p>
            {stats.serviceProgress === 4 && (
              <div className="mt-2 p-2 bg-gold-50 rounded-lg">
                <p className="text-sm text-gold-600 font-semibold">
                  Próximo serviço: 50% OFF!
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Produtos</h4>
            {stats.productStats.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum produto registrado ainda.</p>
            ) : (
              stats.productStats.map((product, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{product.serviceName}</span>
                    <span className="text-sm text-gray-500">{product.count} de 3</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          dot <= product.progress
                            ? "bg-primary-300 border-primary-300"
                            : dot === 3 && product.progress === 2
                            ? "bg-gold-300 border-gold-400"
                            : "bg-gray-100 border-gray-200"
                        }`}
                      >
                        {dot === 3 && product.progress === 2 ? (
                          <span className="text-white text-xs">🎁</span>
                        ) : dot <= product.progress ? (
                          <span className="text-white text-xs">✓</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Suas recompensas disponíveis</h3>
          {stats.availableRewards.length === 0 ? (
            <p className="text-gray-500">Você ainda não tem recompensas disponíveis.</p>
          ) : (
            <div className="space-y-3">
              {stats.availableRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg border border-primary-200"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-300 flex items-center justify-center">
                    <span className="text-white text-xl">
                      {reward.type === "GIFT" ? "🎁" : "%"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{reward.reason}</p>
                    <p className="text-sm text-gray-500">
                      {reward.type === "GIFT" ? "Brinde" : "50% de Desconto"}
                    </p>
                  </div>
                  <button className="btn-primary py-2 px-4 text-sm">Resgatar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
}