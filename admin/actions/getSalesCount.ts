import { db } from "@/libs/db";

const getSalesCount = async (storeId: string) => {
  try {
    const salesCount = await db.order.findMany({
      where: {
        storeId,
        isPaid: true,
      },
    });

    return salesCount.length;
  } catch (error) {
    console.log("Internal error: ");
  }
};

export default getSalesCount;
