"use client";

import { FC } from "react";
import { useCart } from "@/hooks/useCart";

import { Separator } from "./ui/separator";
import Currency from "./Currency";
import { Button } from "./ui/Button";

import { ShoppingCart } from "lucide-react";

import { Product } from "@/types/types";

interface InfoProps {
  data: Product;
}

const Info: FC<InfoProps> = ({ data }) => {
  const { addItem } = useCart();

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={data.price} />
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <p>{data.size.name}</p>
        </div>

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div className="flex items-center gap-2">
            <p>{data.color.name}</p>
            <div
              className="h-6 w-6 rounded-full border border-gray-600"
              style={{ backgroundColor: data.color.value }}
            />
          </div>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          onClick={() => addItem(data)}
          className="flex items-center gap-2 rounded-full"
        >
          Add to Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
