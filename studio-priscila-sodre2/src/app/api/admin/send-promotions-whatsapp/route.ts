import { NextRequest, NextResponse } from "next/server";
import { sendPromotionMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { clientPhones, promotionTitle, promotionDescription } = await req.json();

    if (!clientPhones || !Array.isArray(clientPhones) || !promotionTitle) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const results = [];
    for (const phone of clientPhones) {
      const success = await sendPromotionMessage(
        phone,
        promotionTitle,
        promotionDescription
      );
      results.push({ phone, success });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      ok: true,
      message: `${successCount} de ${clientPhones.length} mensagens enviadas`,
      results
    });
  } catch (err) {
    console.error("Erro:", err);
    return NextResponse.json(
      { error: "Erro ao enviar notificações" },
      { status: 500 }
    );
  }
}