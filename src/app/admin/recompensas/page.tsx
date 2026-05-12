import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { markRewardAsUsed } from "@/lib/loyalty";

async function markRewardAction(rewardId: string) {
  "use server";
  await markRewardAsUsed(rewardId);
}

export default async function AdminRecompensasPage() {
  await requireAdmin();

  const rewards = await prisma.reward.findMany({
    include: {
      loyaltyCard: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recompensas</h2>
        <p className="text-gray-500">Gerencie o resgate de recompensas</p>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`card ${reward.used ? "opacity-60" : ""}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    reward.type === "GIFT" ? "bg-primary-100" : "bg-gold-100"
                  }`}
                >
                  <span className="text-xl">
                    {reward.type === "GIFT" ? "🎁" : "%"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{reward.reason}</h3>
                  <p className="text-sm text-gray-500">
                    {reward.loyaltyCard.user.name} - {reward.loyaltyCard.user.phone}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(reward.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div>
                {reward.used ? (
                  <span className="badge badge-success">Resgatada</span>
                ) : (
                  <form action={markRewardAction.bind(null, reward.id)}>
                    <button type="submit" className="btn-primary py-2 px-4 text-sm">
                      Marcar como resgatada
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}