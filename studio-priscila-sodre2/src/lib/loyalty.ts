import { prisma } from "./prisma";

export async function registerEntry(loyaltyCardId: string, serviceId: string) {
  await prisma.loyaltyEntry.create({ data: { loyaltyCardId, serviceId } });

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];

  const rewards: { type: string; reason: string }[] = [];

  if (service.type === "PRODUCT") {
    const count = await prisma.loyaltyEntry.count({
      where: { loyaltyCardId, serviceId },
    });
    if (count > 0 && count % 3 === 0) {
      rewards.push({ type: "GIFT", reason: `3x ${service.name}` });
    }
  }

  if (service.type === "SERVICE") {
    const count = await prisma.loyaltyEntry.count({
      where: {
        loyaltyCardId,
        service: { type: "SERVICE" },
      },
    });
    if (count > 0 && count % 5 === 0) {
      rewards.push({ type: "DISCOUNT_50", reason: `${count}º Serviço` });
    }
  }

  for (const reward of rewards) {
    await prisma.reward.create({ data: { loyaltyCardId, ...reward } });
  }

  return rewards;
}

export async function getOrCreateCard(userId: string) {
  const existing = await prisma.loyaltyCard.findFirst({ where: { userId } });
  if (existing) return existing;
  return prisma.loyaltyCard.create({ data: { userId } });
}
