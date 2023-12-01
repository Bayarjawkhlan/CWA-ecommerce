import { db } from "@/libs/db";
import { ProductValidator } from "@/libs/validators/products";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },

      include: {
        category: true,
        color: true,
        size: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return new Response("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
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

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      return new Response("You can not update other user's store billboard", {
        status: 403,
      });
    }

    const productName = await db.product.findFirst({
      where: {
        name,
      },
    });

    if (productName) {
      return new Response("Name existing", { status: 409 });
    }

    await db.product.create({
      data: {
        storeId: params.storeId,
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
