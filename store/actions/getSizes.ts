import axios from "axios";

import { Size } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = async (): Promise<Size[]> => {
  const { data } = await axios.get(URL);

  return data;
};

export default getSizes;
