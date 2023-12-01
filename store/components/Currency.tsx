"use client";

import { formatter } from "@/libs/utils";
import { FC, useEffect, useState } from "react";

interface CurrencyProps {
  value: string | number;
}

const Currency: FC<CurrencyProps> = ({ value }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <div className="">{formatter.format(Number(value))}</div>;
};

export default Currency;
