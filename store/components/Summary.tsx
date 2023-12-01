"use client";

import { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useCart } from "@/hooks/useCart";

import Currency from "./Currency";
import { Button } from "./ui/Button";
import ButtonLoader from "./ButtonLoader";
import { toast } from "./ui/use-toast";

interface SummaryProps {}

const Summary: FC<SummaryProps> = () => {
  const searchParams = useSearchParams();
  const { items, removeAll } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast({
        title: "Successfully",
        description: "Payment completed",
      });

      removeAll();
    }

    if (searchParams.get("cancelled")) {
      toast({
        title: "Something went wrong",
        description: "Cancelled your request, please try again later",
        variant: "destructive",
      });
    }
  }, [searchParams, removeAll]);

  const onCheckOut = async () => {
    setIsLoading(true);
    try {
      const payload: {
        productIds: string[];
      } = {
        productIds: items.map((item) => item.id),
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        payload,
      );

      setIsLoading(false);

      window.location = data.url;
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "",
      });
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-8 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order toal</div>

          <Currency value={totalPrice} />
        </div>
      </div>

      <Button
        className="mt-6 w-full rounded-full"
        onClick={onCheckOut}
        disabled={isLoading || items.length === 0}
      >
        <ButtonLoader isLoading={isLoading} />
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
