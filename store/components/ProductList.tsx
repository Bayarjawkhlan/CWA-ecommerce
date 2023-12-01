"use client";

import { FC } from "react";

import Empty from "./Empty";
import ProductCard from "./ProductCard";

import { Product } from "@/types/types";

interface ProductListProps {
  products: Product[];
  title: string;
}

const ProductList: FC<ProductListProps> = ({ products, title }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold">{title}</h3>
      {products.length === 0 && <Empty />}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
