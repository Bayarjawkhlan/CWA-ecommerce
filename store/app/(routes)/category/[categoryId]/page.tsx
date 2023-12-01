import getCategory from "@/actions/getCategory";
import getColors from "@/actions/getColors";
import getProducts from "@/actions/getProducts";
import getSizes from "@/actions/getSizes";

import Billboard from "@/components/Billboard";
import Container from "@/components/Container";
import Empty from "@/components/Empty";
import Filter from "@/components/Filter";
import MobileFilter from "@/components/MobileFilter";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CategoryPage = async ({
  params: { categoryId },
  searchParams: { colorId, sizeId },
}: {
  params: {
    categoryId: string;
  };
  searchParams: {
    sizeId: string;
    colorId: string;
  };
}) => {
  const products = await getProducts({
    categoryId: categoryId,
    colorId: colorId,
    sizeId: sizeId,
  });

  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(categoryId);

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category.billboard} />

        <div className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            {/* Mobile filter */}
            <MobileFilter sizes={sizes} colors={colors} />

            {/* Desktop filter */}
            <div className="hidden lg:block">
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
              <Filter valueKey="colorId" name="Colors" data={colors} />
            </div>

            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 ? <Empty /> : null}

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard data={product} key={product.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
