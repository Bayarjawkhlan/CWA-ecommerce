import { db } from "@/libs/db";

const getStockCount = async (storeId: string) => {
  try {
    const paidOrders = await db.product.findMany({
      where: {
        storeId,
        isArchived: false,
      },
    });

    return paidOrders.length;
  } catch (error) {
    console.log("Internal error: ");
  }
};

export default getStockCount;
