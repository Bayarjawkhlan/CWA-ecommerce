"use client";

import { FC, useState } from "react";
import { Dialog } from "@headlessui/react";

import { Button } from "./ui/Button";
import IconButton from "./IconButton";
import Filter from "./Filter";

import { Plus, X } from "lucide-react";

import { Color, Size } from "@/types/types";

interface MobileFilterProps {
  colors: Color[];
  sizes: Size[];
}

const MobileFilter: FC<MobileFilterProps> = ({ colors, sizes }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen((prev) => (prev = true));
  const onClose = () => setIsOpen((prev) => (prev = false));

  return (
    <>
      <Button
        onClick={onOpen}
        className="flex items-center gap-x-2 rounded-full lg:hidden"
      >
        Filters
        <Plus size={20} />
      </Button>

      <Dialog
        open={isOpen}
        onClose={onClose}
        as="div"
        className={"relative z-40 lg:hidden"}
      >
        <div className="fixed inset-0 flex bg-black/25" />
        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white pb-6 pt-4 shadow-xl">
            <div className="flex items-center justify-end px-4">
              <IconButton onClick={onClose} icon={<X size={15} />} />
            </div>

            <div className="p-4">
              <Filter name="Sizes" data={sizes} valueKey="sizeId" />
              <Filter name="Colors" data={colors} valueKey="colorId" />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileFilter;
