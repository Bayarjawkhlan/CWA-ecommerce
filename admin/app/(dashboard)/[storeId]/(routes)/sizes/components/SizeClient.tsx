"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, Fragment } from "react";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/DataTable";
import { Separator } from "@/components/ui/Separator";
import ApiList from "@/components/ApiList";

import { SizeColumn, columns } from "./Columns";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient: FC<SizeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="Api" description="Api calls for Sizes" />
      <ApiList entityName="sizes" entityIdName="{sizeId}" />
    </Fragment>
  );
};

export default SizeClient;
