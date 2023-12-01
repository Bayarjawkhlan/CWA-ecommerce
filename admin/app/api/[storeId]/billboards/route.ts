import { db } from "@/libs/db";
import { BillboardValidator } from "@/libs/validators/billboards";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
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

    const { label, imageUrl } = BillboardValidator.parse(body);

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

    const billboardName = await db.billboard.findFirst({
      where: {
        label,
      },
    });

    if (billboardName) {
      return new Response("Name existing", { status: 409 });
    }

    await db.billboard.create({
      data: {
        storeId: params.storeId,
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
