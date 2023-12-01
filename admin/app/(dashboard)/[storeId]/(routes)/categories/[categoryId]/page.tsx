import { db } from "@/libs/db";

import CategoryForm from "./components/CategoryForm";

const CategoryPage = async ({
  params,
}: {
  params: {
    storeId: string;
    categoryId: string;
  };
}) => {
  let category = null;

  if (params.categoryId !== "new") {
    category = await db.category.findFirst({
      where: {
        id: params.categoryId,
      },
    });
  }

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
