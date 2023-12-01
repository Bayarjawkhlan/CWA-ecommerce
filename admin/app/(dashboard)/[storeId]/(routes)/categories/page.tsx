import { db } from "@/libs/db";
import { format } from "date-fns";

import CategoryClient from "./components/CategoryClient";
import { CategoryColumn } from "./components/Columns";

const CategoriesPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },

    include: {
      billboard: true,
    },

    orderBy: { createdAt: "desc" },
  });

  const formattedcategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
    billboardLabel: category.billboard.label,
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedcategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
