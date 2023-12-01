"use client";

import { FC } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { cn } from "@/libs/utils";

interface GalleryTabProps {
  image: string;
}

const GalleryTab: FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white">
      {({ selected }) => (
        <div>
          <span className="absolute inset-0 aspect-square h-full w-full overflow-hidden rounded-md">
            <Image
              fill
              src={image}
              alt=""
              className="object-cover object-center"
            />
          </span>

          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-black" : "ring-transparent",
            )}
          />
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;
