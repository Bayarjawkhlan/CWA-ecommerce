import { db } from "@/libs/db";
import { CategoryValidator } from "@/libs/validators/categories";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      categoryId: string;
    };
  },
) {
  try {
    if (!params.categoryId) {
      return new Response("id or userId wrong", { status: 409 });
    }

    const category = await db.category.findFirst({
      where: {
        id: params.categoryId,
      },

      include: {
        billboard: true,
      },
    });

    if (!category) {
      return new Response("id or userId wrong", { status: 409 });
    }

    return NextResponse.json(category);
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
      categoryId: string;
    };
  },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    const { name, billboardId } = CategoryValidator.parse(body);

    if (!params.categoryId) {
      return new Response("wrong id", { status: 405 });
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

    await db.category.update({
      where: {
        id: params.categoryId,
      },

      data: {
        name,
        billboardId,
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
      categoryId: string;
    };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    if (!params.categoryId) {
      return new Response("wrong id", { status: 405 });
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

    await db.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return new Response("OK");
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}
