import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "priscila-setup-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const adminHash = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { phone: "61982533037" },
      update: {},
      create: {
        name: "Priscila Sodré",
        phone: "61982533037",
        passwordHash: adminHash,
        role: "ADMIN",
      },
    });
    const services = [
      { name: "Corte", type: "SERVICE", qrCode: "qr-priscila-corte" },
      { name: "Escova", type: "SERVICE", qrCode: "qr-priscila-escova" },
      { name: "Hidratação", type: "SERVICE", qrCode: "qr-priscila-hidratacao" },
      { name: "Mechas", type: "SERVICE", qrCode: "qr-priscila-mechas" },
      { name: "Queratina", type: "PRODUCT", qrCode: "qr-priscila-queratina" },
    ];
    for (const s of services) {
      await prisma.service.upsert({
        where: { qrCode: s.qrCode },
        update: {},
        create: s,
      });
    }
    return NextResponse.json({ ok: true, message: "Setup concluído!" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}