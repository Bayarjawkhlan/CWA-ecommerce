"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "./ui/Button";

import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value?.map((url) => (
          <div
            className="relative aspect-square h-[200px] w-[200px] overflow-hidden rounded-md"
            key={url}
          >
            <div className="absolute right-2 top-2 z-10">
              <Button
                size={"icon"}
                type="button"
                onClick={() => onRemove(url)}
                variant={"destructive"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              fill
              className="object-cover"
              alt="Billboard photo"
            />
          </div>
        ))}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset="jyvpwxgg">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              disabled={disabled}
              type="button"
              variant={"secondary"}
              onClick={onClick}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
