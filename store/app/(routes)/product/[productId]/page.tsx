import { redirect } from "next/navigation";
import getProduct from "@/actions/getProduct";
import getProducts from "@/actions/getProducts";

import Container from "@/components/Container";
import Gallery from "@/components/Gallery";
import ProductList from "@/components/ProductList";
import { Separator } from "@/components/ui/separator";
import Info from "@/components/Info";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const ProductPage = async ({
  params,
}: {
  params: {
    productId: string;
  };
}) => {
  const product = await getProduct(params.productId);

  if (!product) redirect("/");

  const suggestedProducts = await getProducts({
    categoryId: product.category.id,
  });

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Gallery */}
            <Gallery images={product.images} />

            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              {/* info */}
              <Info data={product} />
            </div>
          </div>
          <Separator className="my-10" />

          <ProductList
            products={suggestedProducts}
            title="Suggested products"
          />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
