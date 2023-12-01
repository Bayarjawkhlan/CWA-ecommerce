"use client";

import { FC } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";

import GalleryTab from "./GalleryTab";

interface GalleryProps {
  images: string[];
}

const Gallery: FC<GalleryProps> = ({ images }) => {
  return (
    <Tab.Group as="div" className={"flex flex-col-reverse"}>
      <div className="mt-6 w-full max-w-2xl lg:max-w-none">
        <Tab.List className={"grid grid-cols-4 gap-6"}>
          {images.map((image) => (
            <GalleryTab key={image} image={image} />
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className={"aspect-square w-full"}>
        {images.map((image) => (
          <Tab.Panel key={image}>
            <div className="relative aspect-square h-full w-full overflow-hidden sm:rounded-lg">
              <Image
                fill
                src={image}
                alt="Product image"
                className="object-cover object-center"
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
