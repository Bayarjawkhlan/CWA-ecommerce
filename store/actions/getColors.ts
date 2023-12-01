import axios from "axios";

import { Color } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`;

const getColors = async (): Promise<Color[]> => {
  const { data } = await axios.get(URL);

  return data;
};

export default getColors;
