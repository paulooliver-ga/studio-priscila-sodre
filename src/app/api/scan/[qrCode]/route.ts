import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerLoyaltyEntry } from "@/lib/loyalty";
import { getSession } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ qrCode: string }> }
) {
  try {
    const { qrCode } = await params;

    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/login?redirect=/scan/" + qrCode, request.url));
    }

    if (session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    let loyaltyCard = await prisma.loyaltyCard.findUnique({
      where: { userId: session.user.id },
    });

    if (!loyaltyCard) {
      loyaltyCard = await prisma.loyaltyCard.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    const service = await prisma.service.findUnique({
      where: { qrCode },
    });

    if (!service) {
      return NextResponse.json({ error: "QR Code inválido" }, { status: 404 });
    }

    const existingEntry = await prisma.loyaltyEntry.findFirst({
      where: {
        loyaltyCardId: loyaltyCard.id,
        serviceId: service.id,
        registeredAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    if (existingEntry) {
      return NextResponse.redirect(new URL("/cliente/cartao?error=jah-registrado", request.url));
    }

    const { rewards } = await registerLoyaltyEntry(loyaltyCard.id, service.id);

    const successMessage = rewards.newRewards.length > 0
      ? `Serviço registrado! 🎉\nNovas recompensas: ${rewards.newRewards.map((r) => r.reason).join(", ")}`
      : "Serviço registrado com sucesso!";

    return NextResponse.redirect(
      new URL(`/cliente/cartao?success=${encodeURIComponent(successMessage)}`, request.url)
    );
  } catch (error) {
    console.error("Error scanning QR code:", error);
    return NextResponse.json({ error: "Erro ao processar QR Code" }, { status: 500 });
  }
}