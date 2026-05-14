import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(promotions);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, startsAt, endsAt } = await req.json();
  const promo = await prisma.promotion.create({ data: { title, description, startsAt: new Date(startsAt), endsAt: new Date(endsAt) } });
  return NextResponse.json(promo);
}
