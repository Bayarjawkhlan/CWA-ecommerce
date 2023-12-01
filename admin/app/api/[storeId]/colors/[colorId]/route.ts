import { db } from "@/libs/db";
import { ColorValidator } from "@/libs/validators/colors";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      colorId: string;
    };
  },
) {
  try {
    if (!params.colorId) {
      return new Response("id or userId wrong", { status: 409 });
    }

    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    if (!color) {
      return new Response("id or userId wrong", { status: 409 });
    }

    return NextResponse.json(color);
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      colorId: string;
    };
  },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    const { name, value } = ColorValidator.parse(body);

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.colorId) {
      return new Response("wrong id", { status: 401 });
    }

    await db.color.update({
      where: {
        id: params.colorId,
      },

      data: {
        name,
        value,
      },
    });

    return new Response("OK");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      colorId: string;
    };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.colorId) {
      return new Response("wrong id", { status: 401 });
    }

    await db.color.delete({
      where: {
        id: params.colorId,
      },
    });

    return new Response("OK");
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}
