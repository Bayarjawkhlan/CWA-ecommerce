import getBillboard from "@/actions/getBillboard";
import getProducts from "@/actions/getProducts";

import Billboard from "@/components/Billboard";
import Container from "@/components/Container";
import ProductList from "@/components/ProductList";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const HomePage = async () => {
  const billboard = await getBillboard("651e552b18ecff51c168b998");

  const products = await getProducts({ isFeatured: true });

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
      </div>

      <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
        <ProductList products={products} title="Featured Products" />
      </div>
    </Container>
  );
};

export default HomePage;
