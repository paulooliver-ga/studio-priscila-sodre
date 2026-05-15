import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const user = await prisma.user.findUnique({ where: { phone: "61982533037" } });
  if (!user) return NextResponse.json({ error: "User not found" });
  
  const test = await bcrypt.compare("admin123", user.passwordHash);
  return NextResponse.json({ 
    role: user.role,
    hashStored: user.passwordHash.substring(0, 20) + "...",
    passwordMatches: test
  });
}