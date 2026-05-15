import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description } = await req.json();

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: { name: true, phone: true },
  });

  const message = encodeURIComponent(
    `Olá! 💄✨\n\n*${title}*\n${description}\n\nAcesse seu cartão fidelidade:\nhttps://studio-priscila-sodre2.vercel.app`
  );

  const links = clients.map((c) => ({
    name: c.name,
    phone: c.phone,
    link: `https://wa.me/55${c.phone}?text=${message}`,
  }));

  return NextResponse.json({ count: clients.length, links });
}