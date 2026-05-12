import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CLIENT",
      },
      phone: {
        type: "string",
        required: true,
      },
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Auth = typeof auth;

export async function signInWithPhone(phone: string, password: string) {
  const users = await prisma.user.findMany({
    where: { phone },
  });

  for (const user of users) {
    if (user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (valid) {
        return user;
      }
    }
  }
  return null;
}

export async function signUpWithPhone(
  name: string,
  phone: string,
  password: string,
  email?: string
) {
  const existing = await prisma.user.findUnique({
    where: { phone },
  });

  if (existing) {
    throw new Error("Telefone já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      passwordHash: hashedPassword,
      email: email || null,
      role: "CLIENT",
    },
  });

  return user;
}