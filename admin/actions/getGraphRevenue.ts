import { db } from "@/libs/db";

interface GraphData {
  name: string;
  total: number;
}

const getGraphRevenue = async (storeId: string) => {
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

    const monthlyRevenue: { [key: number]: number } = {};

    for (let order of paidOrders) {
      const month = order.createdAt.getMonth();

      let revenueForOrder = 0;

      for (let item of order.orderItems) {
        revenueForOrder += item.product.price;
      }

      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: GraphData[] = [
      {
        name: "Jan",
        total: 0,
      },
      {
        name: "Feb",
        total: 0,
      },
      {
        name: "Mar",
        total: 0,
      },
      {
        name: "Apr",
        total: 0,
      },
      {
        name: "May",
        total: 0,
      },
      {
        name: "Jun",
        total: 0,
      },
      {
        name: "Jul",
        total: 0,
      },
      {
        name: "Aug",
        total: 0,
      },
      {
        name: "Sep",
        total: 0,
      },
      {
        name: "Oct",
        total: 0,
      },
      {
        name: "Nov",
        total: 0,
      },
      {
        name: "Dec",
        total: 0,
      },
    ];

    for (let month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
  } catch (error) {
    console.log("Internal error: ");
  }
};

export default getGraphRevenue;
