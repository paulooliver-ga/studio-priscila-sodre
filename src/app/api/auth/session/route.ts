import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get("better-auth.session_token")?.value;
    
    if (!cookie) {
      return NextResponse.json({ user: null, session: null });
    }

    const session = await prisma.session.findUnique({
      where: { token: cookie },
      include: {
        user: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ user: null, session: null });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        phone: session.user.phone,
        email: session.user.email,
        role: session.user.role,
      },
      session: {
        id: session.id,
        token: session.token,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Session GET error:", error);
    return NextResponse.json({ user: null, session: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === "signOut") {
      const cookie = request.cookies.get("better-auth.session_token")?.value;
      
      if (cookie) {
        await prisma.session.deleteMany({
          where: { token: cookie },
        });
      }
      
      const response = NextResponse.json({ success: true });
      response.cookies.delete("better-auth.session_token");
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Session POST error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}