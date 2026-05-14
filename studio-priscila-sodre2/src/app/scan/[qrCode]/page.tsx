import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCard, registerEntry } from "@/lib/loyalty";

export default async function ScanPage({ params }: { params: { qrCode: string } }) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  const service = await prisma.service.findUnique({
    where: { qrCode: params.qrCode, active: true },
  });

  if (service) {
    const card = await getOrCreateCard(user.id);
    await registerEntry(card.id, service.id);
    redirect("/cliente/cartao?scanned=1");
  }

  redirect("/cliente/cartao?error=1");
}
