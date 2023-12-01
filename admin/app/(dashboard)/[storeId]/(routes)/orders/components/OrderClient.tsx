"use client";

import { FC, Fragment } from "react";

import Heading from "@/components/Heading";
import { DataTable } from "@/components/DataTable";
import { Separator } from "@/components/ui/Separator";

import { OrderColumn, columns } from "./Columns";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: FC<OrderClientProps> = ({ data }) => {
  return (
    <Fragment>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </Fragment>
  );
};

export default OrderClient;
