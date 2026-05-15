import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.update({
    where: { phone: "61982533037" },
    data: { passwordHash: hash },
  });
  const test = await bcrypt.compare("admin123", hash);
  return NextResponse.json({ ok: true, hashGerado: hash, teste: test });
}