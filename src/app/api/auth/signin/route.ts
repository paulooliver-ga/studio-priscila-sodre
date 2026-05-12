import { NextRequest, NextResponse } from "next/server";
import { signInWithPhone } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    const user = await signInWithPhone(identifier, password);

    if (!user) {
      return NextResponse.json(
        { message: "Telefone ou senha inválidos" },
        { status: 401 }
      );
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      },
    });

    const response = NextResponse.json({ session, user });
    response.cookies.set(
      "better-auth.session_token",
      session.token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: error.message || "Falha no login" },
      { status: 401 }
    );
  }
}