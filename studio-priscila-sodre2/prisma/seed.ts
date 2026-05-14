
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";



const prisma = new PrismaClient();



async function main() {

  console.log("í¼± Iniciando seed...");



  const passwordHash = await bcrypt.hash("admin123", 10);



  await prisma.user.upsert({

    where: { phone: "61982533037" },

    update: {},

    create: {

      name: "Priscila SodrÃ©",

      phone: "61982533037",

      email: "admin@studiopriscilasodr.com",

      passwordHash,

      role: "ADMIN",

    },

  });

  console.log("âœ… Admin criado â€” telefone: 61982533037 / senha: admin123");



  const servicos = [

    { name: "Corte", type: "SERVICE", qrCode: "qr-corte" },

    { name: "Escova", type: "SERVICE", qrCode: "qr-escova" },

    { name: "HidrataÃ§Ã£o", type: "SERVICE", qrCode: "qr-hidratacao" },

    { name: "Queratina", type: "PRODUCT", qrCode: "qr-queratina" },

    { name: "Botox Capilar", type: "PRODUCT", qrCode: "qr-botox-capilar" },

  ];



  for (const s of servicos) {

    await prisma.service.upsert({

      where: { qrCode: s.qrCode },

      update: {},

      create: s,

    });

  }

  console.log("âœ… ServiÃ§os criados");



  const now = new Date();

  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);



  await prisma.promotion.create({

    data: {

      title: "í¼Ÿ Quinta do Brilho",

      description: "Toda quinta-feira: Escova + HidrataÃ§Ã£o com 20% de desconto!",

      startsAt: now,

      endsAt: nextWeek,

    },

  });



  await prisma.promotion.create({

    data: {

      title: "í²… Pacote TransformaÃ§Ã£o",

      description: "Corte + Escova + HidrataÃ§Ã£o por R$150. Agende pelo WhatsApp!",

      startsAt: now,

      endsAt: nextWeek,

    },

  });



  console.log("âœ… PromoÃ§Ãµes criadas");

  console.log("í¾‰ Seed concluÃ­do!");

}



main()

  .catch(console.error)

  .finally(() => prisma.$disconnect());

