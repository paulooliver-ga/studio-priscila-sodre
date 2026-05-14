import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const password = String(body.password || "");

    if (!phone || !password) {
      return NextResponse.json({ error: "Preencha telefone e senha" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json({ error: "Telefone não cadastrado" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ role: user.role, name: user.name });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
