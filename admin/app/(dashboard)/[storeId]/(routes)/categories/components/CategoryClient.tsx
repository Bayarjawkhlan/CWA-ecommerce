"use client";

import { FC, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { DataTable } from "@/components/DataTable";
import ApiList from "@/components/ApiList";

import { Plus } from "lucide-react";

import { CategoryColumn, columns } from "./Columns";

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient: FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="Api" description="Api calls for Categories" />
      <ApiList entityName="categories" entityIdName="{categoryId}" />
    </Fragment>
  );
};

export default CategoryClient;
