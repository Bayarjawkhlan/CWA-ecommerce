"use client";

import Image from "next/image";
import { FC, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { usePreviewModal } from "@/hooks/usePreviewModel";

import Currency from "./Currency";
import IconButton from "./IconButton";

import { Expand, ShoppingCart } from "lucide-react";

import { Product } from "@/types/types";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  data: Product;
}

const ProductCard: FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();
  const previewModal = usePreviewModal();
  const cart = useCart();

  const handleClick = () => {
    router.push(`/product/${data.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addItem(data);
  };

  if (data.isArchived) return null;

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer space-y-4 rounded-xl border bg-white p-3"
    >
      {/* Image */}
      <div className="relative aspect-square rounded-xl bg-gray-100">
        <Image
          src={data.images?.[0]}
          alt={data.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 w-full px-6 opacity-100 transition group-hover:opacity-100 lg:opacity-0">
          <div className="flex justify-center gap-x-6">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onAddToCart}
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="">
        <p className="text-lg font-semibold">{data.name}</p>

        <p className="text-sm text-gray-500">{data.category.name}</p>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between">
        <Currency value={data.price} />
      </div>
    </div>
  );
};

export default ProductCard;
