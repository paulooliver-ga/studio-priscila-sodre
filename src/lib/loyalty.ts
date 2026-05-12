import { prisma } from "./prisma";

interface CheckRewardsResult {
  newRewards: Array<{
    type: "GIFT" | "DISCOUNT_50";
    reason: string;
  }>;
  totalServiceEntries: number;
  productEntries: number;
}

export async function checkAndCreateRewards(
  loyaltyCardId: string,
  serviceId: string
): Promise<CheckRewardsResult> {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new Error("Serviço não encontrado");
  }

  const loyaltyCard = await prisma.loyaltyCard.findUnique({
    where: { id: loyaltyCardId },
    include: {
      entries: {
        include: { service: true },
      },
      rewards: true,
    },
  });

  if (!loyaltyCard) {
    throw new Error("Cartão fidelidade não encontrado");
  }

  const newRewards: Array<{ type: "GIFT" | "DISCOUNT_50"; reason: string }> = [];

  if (service.type === "PRODUCT") {
    const productEntries = loyaltyCard.entries.filter(
      (entry) => entry.service.type === "PRODUCT" && entry.serviceId === serviceId
    );
    const productCount = productEntries.length;

    if (productCount > 0 && productCount % 3 === 0) {
      const existingReward = loyaltyCard.rewards.find(
        (r) =>
          r.type === "GIFT" &&
          r.reason.includes(service.name) &&
          !r.used
      );

      if (!existingReward) {
        const multiplier = productCount / 3;
        const reason = `${multiplier}x ${service.name} - Brinde!`;

        await prisma.reward.create({
          data: {
            loyaltyCardId,
            type: "GIFT",
            reason,
            used: false,
          },
        });

        newRewards.push({ type: "GIFT", reason });
      }
    }

    return {
      newRewards,
      totalServiceEntries: loyaltyCard.entries.filter((e) => e.service.type === "SERVICE").length,
      productEntries: productCount,
    };
  }

  if (service.type === "SERVICE") {
    const serviceEntries = loyaltyCard.entries.filter(
      (entry) => entry.service.type === "SERVICE"
    );
    const serviceCount = serviceEntries.length;

    if (serviceCount > 0 && serviceCount % 5 === 0) {
      const existingReward = loyaltyCard.rewards.find(
        (r) => r.type === "DISCOUNT_50" && !r.used
      );

      if (!existingReward) {
        const multiplier = serviceCount / 5;
        const reason = `${multiplier}º Ciclo de 5 Serviços - 50% OFF!`;

        await prisma.reward.create({
          data: {
            loyaltyCardId,
            type: "DISCOUNT_50",
            reason,
            used: false,
          },
        });

        newRewards.push({ type: "DISCOUNT_50", reason });
      }
    }

    return {
      newRewards,
      totalServiceEntries: serviceCount,
      productEntries: loyaltyCard.entries.filter((e) => e.service.type === "PRODUCT").length,
    };
  }

  return {
    newRewards,
    totalServiceEntries: loyaltyCard.entries.filter((e) => e.service.type === "SERVICE").length,
    productEntries: loyaltyCard.entries.filter((e) => e.service.type === "PRODUCT").length,
  };
}

export async function registerLoyaltyEntry(
  loyaltyCardId: string,
  serviceId: string
): Promise<{
  entry: any;
  rewards: CheckRewardsResult;
}> {
  const entry = await prisma.loyaltyEntry.create({
    data: {
      loyaltyCardId,
      serviceId,
      registeredAt: new Date(),
    },
    include: {
      service: true,
    },
  });

  const rewards = await checkAndCreateRewards(loyaltyCardId, serviceId);

  return { entry, rewards };
}

export async function getLoyaltyCardStats(loyaltyCardId: string) {
  const loyaltyCard = await prisma.loyaltyCard.findUnique({
    where: { id: loyaltyCardId },
    include: {
      entries: {
        include: { service: true },
        orderBy: { registeredAt: "desc" },
      },
      rewards: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!loyaltyCard) {
    return null;
  }

  const serviceEntries = loyaltyCard.entries.filter((e) => e.service.type === "SERVICE");
  const serviceCount = serviceEntries.length;
  const serviceProgress = serviceCount % 5;
  const nextServiceReward = 5 - serviceProgress;

  const productGroups: Record<string, { name: string; count: number }> = {};
  loyaltyCard.entries
    .filter((e) => e.service.type === "PRODUCT")
    .forEach((entry) => {
      if (!productGroups[entry.serviceId]) {
        productGroups[entry.serviceId] = { name: entry.service.name, count: 0 };
      }
      productGroups[entry.serviceId].count++;
    });

  const productStats = Object.entries(productGroups).map(([serviceId, data]) => {
    const progress = data.count % 3;
    const nextReward = 3 - progress;
    return {
      serviceName: data.name,
      count: data.count,
      progress,
      nextReward,
    };
  });

  const availableRewards = loyaltyCard.rewards.filter((r) => !r.used);

  return {
    loyaltyCard,
    serviceCount,
    serviceProgress,
    nextServiceReward,
    productStats,
    availableRewards,
  };
}

export async function markRewardAsUsed(rewardId: string) {
  return prisma.reward.update({
    where: { id: rewardId },
    data: { used: true },
  });
}