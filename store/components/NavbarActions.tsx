"use client";

import { FC, useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

import { Button } from "./ui/Button";

import { ShoppingBag } from "lucide-react";

interface NavbarActionsProps {}

const NavbarActions: FC<NavbarActionsProps> = () => {
  const [IsMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();

  if (!IsMounted) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button
        size={"none"}
        variant={"none"}
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-black px-4 py-2 hover:opacity-75"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
};

export default NavbarActions;
