import { db } from "@/libs/db";
import { BillboardValidator } from "@/libs/validators/billboards";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      billboardId: string;
    };
  },
) {
  try {
    if (!params.billboardId) {
      return new Response("id or userId wrong", { status: 409 });
    }

    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    if (!billboard) {
      return new Response("id or userId wrong", { status: 409 });
    }

    return NextResponse.json(billboard);
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
      billboardId: string;
    };
  },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    const { label, imageUrl } = BillboardValidator.parse(body);

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.billboardId) {
      return new Response("wrong id", { status: 401 });
    }

    await db.billboard.update({
      where: {
        id: params.billboardId,
      },

      data: {
        label,
        imageUrl,
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
      billboardId: string;
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

    if (!params.billboardId) {
      return new Response("wrong id", { status: 401 });
    }

    await db.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return new Response("OK");
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}
