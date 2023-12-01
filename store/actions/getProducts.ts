import axios from "axios";
import qs from "query-string";

import { Product } from "@/types/types";

interface Query {
  categoryId?: string;
  sizeId?: string;
  colorId?: string;
  isFeatured?: boolean;
}

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,

    query: {
      colorId: query.colorId,
      sizeId: query.sizeId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
    },
  });

  const { data } = await axios.get(url);

  return data;
};

export default getProducts;
