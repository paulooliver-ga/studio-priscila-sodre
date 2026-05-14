import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const filter = req.nextUrl.searchParams.get("filter");
  const where = filter === "pending" ? { used: false } : {};
  const rewards = await prisma.reward.findMany({
    where,
    include: { loyaltyCard: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rewards);
}
