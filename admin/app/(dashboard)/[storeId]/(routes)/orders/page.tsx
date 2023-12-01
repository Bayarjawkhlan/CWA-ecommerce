import { format } from "date-fns";
import { db } from "@/libs/db";
import { formatter } from "@/libs/utils";

import { OrderColumn } from "./components/Columns";
import OrderClient from "./components/OrderClient";

const BillboardsPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },

    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },

    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((ordersItem) => ordersItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + item.product.price;
      }, 0),
    ),
    createdAt: format(item.createdAt, "MMMM do,yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default BillboardsPage;
