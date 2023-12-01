import { db } from "@/libs/db";
import { SizeValidator } from "@/libs/validators/sizes";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      sizeId: string;
    };
  },
) {
  try {
    if (!params.sizeId) {
      return new Response("id or userId wrong", { status: 409 });
    }

    const size = await db.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    if (!size) {
      return new Response("id or userId wrong", { status: 409 });
    }

    return NextResponse.json(size);
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
      sizeId: string;
    };
  },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    const { name, value } = SizeValidator.parse(body);

    if (!params.sizeId) {
      return new NextResponse("Wrong id", { status: 405 });
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

    await db.size.update({
      where: {
        id: params.sizeId,
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
      sizeId: string;
    };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Wrong id", { status: 405 });
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

    await db.size.delete({
      where: {
        id: params.sizeId,
      },
    });

    return new Response("OK");
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}
