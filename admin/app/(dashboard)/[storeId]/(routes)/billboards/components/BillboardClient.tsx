"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, Fragment } from "react";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/DataTable";
import { Separator } from "@/components/ui/Separator";
import ApiList from "@/components/ApiList";

import { BillboardColumn, columns } from "./Columns";

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClient: FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="label" columns={columns} data={data} />

      <Heading title="Api" description="Api calls for Billboards" />
      <ApiList entityName="billboards" entityIdName="{billboardId}" />
    </Fragment>
  );
};

export default BillboardClient;
