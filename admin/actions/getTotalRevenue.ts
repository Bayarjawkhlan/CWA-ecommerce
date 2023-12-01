import { db } from "@/libs/db";

const getTotalRevenue = async (storeId: string) => {
  try {
    const paidOrders = await db.order.findMany({
      where: {
        storeId,
        isPaid: true,
      },

      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalRevenue = paidOrders.reduce((total, orderItem) => {
      const orderTotal = orderItem.orderItems.reduce((orderSum, orderItem) => {
        return orderSum + orderItem.product.price;
      }, 0);
      return total + orderTotal;
    }, 0);

    return totalRevenue;
  } catch (error) {
    console.log("Internal error: ");
  }
};

export default getTotalRevenue;
