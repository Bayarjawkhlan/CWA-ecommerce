import { db } from "@/libs/db";
import { SettingsValidator } from "@/libs/validators/settings";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export async function PATCH(
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

    const { name } = SettingsValidator.parse(body);

    const store = await db.store.update({
      where: {
        id: params.storeId,
        userId,
      },

      data: {
        name,
      },
    });

    if (!store) {
      return new Response("id or userId wrong", { status: 409 });
    }

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
    };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unautherized", { status: 401 });
    }

    const store = await db.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      return new Response("id or userId wrong", { status: 409 });
    }

    return new Response("OK");
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}
