import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@studiopriscilasodre.com" },
    update: {},
    create: {
      name: "Admin Studio",
      phone: "(61) 90000-0000",
      email: "admin@studiopriscilasodre.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin criado:", admin.email);

  const services = [
    { name: "Corte", type: "SERVICE", qrCode: "CERVO001" },
    { name: "Escova", type: "SERVICE", qrCode: "CERVO002" },
    { name: "Hidratação", type: "SERVICE", qrCode: "CERVO003" },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { qrCode: service.qrCode },
      update: {},
      create: service,
    });
    console.log(`✅ Serviço criado: ${service.name}`);
  }

  const products = [
    { name: "Queratina", type: "PRODUCT", qrCode: "PROD001" },
    { name: "Botox Capilar", type: "PRODUCT", qrCode: "PROD002" },
  ];

  for (const product of products) {
    await prisma.service.upsert({
      where: { qrCode: product.qrCode },
      update: {},
      create: product,
    });
    console.log(`✅ Produto criado: ${product.name}`);
  }

  const promotions = [
    {
      title: "Promoção Primavera",
      description: "20% de desconto em todos os procedimentos de coloração.",
      startsAt: new Date("2026-05-01"),
      endsAt: new Date("2026-05-31"),
    },
    {
      title: "Combo Casamento",
      description: "Pacote especial com hidratação, nutrição e reconstrução. Leve 3 e pague 2!",
      startsAt: new Date("2026-05-10"),
      endsAt: new Date("2026-06-30"),
    },
  ];

  for (const promotion of promotions) {
    await prisma.promotion.create({
      data: promotion,
    });
    console.log(`✅ Promoção criada: ${promotion.title}`);
  }

  console.log("🎉 Seed concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });