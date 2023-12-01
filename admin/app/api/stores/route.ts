import { db } from "@/libs/db";
import { StoreValidator } from "@/libs/validators/store";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { name } = StoreValidator.parse(body);

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Internal Error", { status: 500 });
  }
}
