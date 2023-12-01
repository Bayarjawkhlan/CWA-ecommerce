import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (product: Product) => {
        const currentItems = get().items;
        const existingItems = currentItems.find(
          (item) => item.id === product.id,
        );
        if (existingItems) {
          return toast({
            description: "Item already in cart",
          });
        }

        set({ items: [...get().items, product] });
        toast({
          title: "Success",
          description: "Item added to cart",
        });
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] }),
          toast({
            title: "Success",
            description: "Item removed from the cart",
          });
      },

      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
