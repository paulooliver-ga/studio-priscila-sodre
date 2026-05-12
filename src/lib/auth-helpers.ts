import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        phone: session.user.phone,
        email: session.user.email,
        role: session.user.role,
        createdAt: session.user.createdAt,
      },
      session: {
        id: session.id,
        token: session.token,
        expiresAt: session.expiresAt,
      },
    };
  } catch (error) {
    console.error("getSession error:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  
  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  
  return session;
}