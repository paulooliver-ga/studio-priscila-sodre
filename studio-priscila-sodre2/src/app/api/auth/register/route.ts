import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { getOrCreateCard } from "@/lib/loyalty";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, birthdate } = await req.json();
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (!name || !cleanPhone || !password) {
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { phone: cleanPhone } });
    if (exists) return NextResponse.json({ error: "Telefone já cadastrado" }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        phone: cleanPhone,
        passwordHash,
        role: "CLIENT",
        birthdate: birthdate ? new Date(birthdate) : null,
      },
    });
    await getOrCreateCard(user.id);
    await createSession(user.id);
    return NextResponse.json({ role: user.role, name: user.name });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}