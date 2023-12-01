import { db } from "@/libs/db";

import ProductForm from "./components/ProductForm";

const ProductPage = async ({
  params,
}: {
  params: {
    storeId: string;
    productId: string;
  };
}) => {
  let product = null;

  if (params.productId !== "new") {
    product = await db.product.findFirst({
      where: {
        id: params.productId,
      },
    });
  }

  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
