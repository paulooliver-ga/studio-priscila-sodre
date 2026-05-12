
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getSession } from "@/lib/auth";

import { registerEntry } from "@/lib/loyalty";



export async function GET(

  req: NextRequest,

  { params }: { params: { qrCode: string } }

) {

  const user = await getSession();

  if (!user) {

    return NextResponse.redirect(new URL("/login", req.url));

  }



  const service = await prisma.service.findUnique({

    where: { qrCode: params.qrCode, active: true },

  });



  if (!service) {

    return NextResponse.redirect(new URL("/cliente/cartao?error=1", req.url));

  }



  let card = await prisma.loyaltyCard.findFirst({

    where: { userId: user.id },

  });



  if (!card) {

    card = await prisma.loyaltyCard.create({

      data: { userId: user.id },

    });

  }



  await registerEntry(card.id, service.id);



  return NextResponse.redirect(new URL("/cliente/cartao?scanned=1", req.url));

}

