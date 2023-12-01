import axios from "axios";

import { Product } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product | null> => {
  const { data } = await axios.get(URL + `/${id}`);

  if (!data) {
    return null;
  }

  return data;
};

export default getProduct;
