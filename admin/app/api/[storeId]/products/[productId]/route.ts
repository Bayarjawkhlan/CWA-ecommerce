import { db } from "@/libs/db";
import { ProductValidator } from "@/libs/validators/products";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      productId: string;
    };
  },
) {
  try {
    if (!params.productId) {
      return new Response("id or userId wrong", { status: 409 });
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },

      include: {
        category: true,
        size: true,
        color: true,
      },
    });

    if (!product) {
      return new Response("id or userId wrong", { status: 409 });
    }

    return NextResponse.json(product);
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
      productId: string;
    };
  },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    const {
      name,
      images,
      price,
      categoryId,
      sizeId,
      colorId,
      isArchived,
      isFeatured,
    } = ProductValidator.parse(body);

    if (!params.productId) {
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

    await db.product.update({
      where: {
        id: params.productId,
      },

      data: {
        name,
        images,
        price,
        categoryId,
        sizeId,
        colorId,
        isArchived,
        isFeatured,
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
      productId: string;
    };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    if (!params.productId) {
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

    await db.product.delete({
      where: {
        id: params.productId,
        isArchived: true,
      },
    });

    return new Response("OK");
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}
