import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const password = String(body.password || "");

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { phone } });
    if (exists) {
      return NextResponse.json({ error: "Telefone já cadastrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, phone, passwordHash, role: "CLIENT" },
    });

    // Auto-create loyalty card
    await prisma.loyaltyCard.create({ data: { userId: user.id } });

    await createSession(user.id);
    return NextResponse.json({ role: user.role, name: user.name });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
