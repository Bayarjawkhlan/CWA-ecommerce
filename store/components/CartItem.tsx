"use client";

import { FC } from "react";

import { Product } from "@/types/types";
import Image from "next/image";
import IconButton from "./IconButton";
import { X } from "lucide-react";
import { Separator } from "./ui/separator";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  data: Product;
}

const CartItem: FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  return (
    <li className="flex border-b py-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
        <Image
          src={data.images[0]}
          alt="Cart item"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute right-0 top-0 z-10">
          <IconButton
            onClick={() => cart.removeItem(data.id)}
            icon={<X size={15} />}
          />
        </div>

        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="fond-semibold text-lg text-black">{data.name}</p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <Separator orientation="vertical" className="mx-4 bg-gray-200" />
            <p className="text-gray-500">{data.size.name}</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
