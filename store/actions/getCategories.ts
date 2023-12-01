import axios from "axios";

import { Category } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get(URL);

  return data;
};

export default getCategories;
